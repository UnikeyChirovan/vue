// stores/supportChatStore.js
import { defineStore } from 'pinia';
import supportApi from '../services/support-api';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from './auth';
import api from '../services/axiosInterceptor';

export const useSupportChatStore = defineStore('supportChat', {
  state: () => ({
    // User state
    conversation: null,
    messages: [],
    isOpen: false,
    unreadCount: 0,
    supportOnline: false,

    // Manager state
    pendingConversations: [],
    myActiveConversations: [],
    allActiveConversations: [],

    // Echo instance
    echo: null,
  }),

  getters: {
    hasConversation: (state) => state.conversation !== null,
    conversationStatus: (state) => state.conversation?.status || null,
    isResolved: (state) => state.conversation?.status === 'resolved',
  },

  actions: {
    // ============================================
    // WEBSOCKET SETUP
    // ============================================

    initializeEcho() {
      if (this.echo) return;

      const authStore = useAuthStore();

      window.Pusher = Pusher;

      this.echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT,
        wssPort: import.meta.env.VITE_REVERB_PORT,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authorizer: (channel, options) => {
          return {
            authorize: (socketId, callback) => {
              api
                .post('/broadcasting/auth', {
                  socket_id: socketId,
                  channel_name: channel.name,
                })
                .then((response) => {
                  callback(null, response.data);
                })
                .catch((error) => {
                  callback(error);
                });
            },
          };
        },
      });
    },

    subscribeToUserChannel() {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      this.initializeEcho();

      // Unsubscribe first to avoid duplicates
      if (this.echo) {
        this.echo.leave(`support.user.${authStore.user.id}`);
      }

      // Subscribe to user's support channel
      this.echo
        .private(`support.user.${authStore.user.id}`)
        .listen('.support.message.sent', (event) => {
          console.log('Support message received:', event);

          // Thêm message vào danh sách nếu đúng cuộc trò chuyện
          if (event.conversation_id === this.conversation?.id) {
            const exists = this.messages.find((m) => m.id === event.id);

            if (!exists) {
              const newMessage = {
                id: event.id,
                sender_type: event.sender_type,
                message: event.message,
                is_read: event.is_read,
                timestamp: event.timestamp,
              };

              this.messages.push(newMessage);

              // Tăng unread count nếu chat đang đóng
              if (!this.isOpen && event.sender_type === 'support') {
                this.unreadCount++;
                this.playNotificationSound();
              }
            }
          }
        });
    },

    subscribeToManagerChannel() {
      const authStore = useAuthStore();
      if (!authStore.user) return;
      if (!authStore.isAdmin && authStore.user.department_id !== 3) return;

      this.initializeEcho();

      // Subscribe to manager's channel
      this.echo
        .private(`support.manager.${authStore.user.id}`)
        .listen('.support.message.sent', (event) => {
          console.log('Support message for manager:', event);

          // Cập nhật conversation list
          this.refreshManagerConversations();
        });

      // Subscribe to admin channel if admin
      if (authStore.isAdmin) {
        this.echo
          .private('support.admin')
          .listen('.support.message.sent', (event) => {
            console.log('Support message for admin:', event);
            this.refreshManagerConversations();
          });
      }
    },

    // ============================================
    // USER ACTIONS
    // ============================================

    async loadConversation() {
      try {
        const response = await supportApi.getOrCreateConversation();
        this.conversation = response.data.conversation;
        this.messages = response.data.conversation.messages || [];
        this.unreadCount = response.data.conversation.unread_count || 0;

        // Subscribe to WebSocket
        this.subscribeToUserChannel();

        return this.conversation;
      } catch (error) {
        console.error('Error loading conversation:', error);
        throw error;
      }
    },

    async sendMessage(message) {
      if (!this.conversation) {
        await this.loadConversation();
      }

      try {
        const response = await supportApi.sendMessage(
          this.conversation.id,
          message
        );

        // Thêm message vào danh sách
        this.messages.push(response.data.message);

        return response.data.message;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },

    async markAsRead() {
      if (!this.conversation) return;

      try {
        await supportApi.markAsRead(this.conversation.id);

        // Reset unread count
        this.unreadCount = 0;

        // Đánh dấu messages là đã đọc
        this.messages = this.messages.map((msg) => ({
          ...msg,
          is_read: msg.sender_type === 'support' ? true : msg.is_read,
        }));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    },

    async loadUnreadCount() {
      try {
        const response = await supportApi.getUnreadCount();
        this.unreadCount = response.data.unread_count;
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    },

    async checkSupportOnline() {
      try {
        const response = await supportApi.checkSupportOnline();
        this.supportOnline = response.data.online;
        return response.data.online;
      } catch (error) {
        console.error('Error checking support online:', error);
        return false;
      }
    },

    async rateConversation(rating, comment = '') {
      if (!this.conversation) return;

      try {
        await supportApi.rateConversation(
          this.conversation.id,
          rating,
          comment
        );

        // Cập nhật conversation status
        this.conversation.status = 'closed';

        // Reset conversation
        this.conversation = null;
        this.messages = [];
        this.unreadCount = 0;
      } catch (error) {
        console.error('Error rating conversation:', error);
        throw error;
      }
    },

    openChat() {
      this.isOpen = true;
      if (this.unreadCount > 0) {
        this.markAsRead();
      }
    },

    closeChat() {
      this.isOpen = false;
    },

    // ============================================
    // MANAGER ACTIONS
    // ============================================

    async loadManagerConversations(type = 'pending') {
      try {
        const response = await supportApi.getConversations(type);

        if (type === 'pending') {
          this.pendingConversations = response.data.conversations;
        } else if (type === 'my_active') {
          this.myActiveConversations = response.data.conversations;
        } else if (type === 'all_active') {
          this.allActiveConversations = response.data.conversations;
        }

        return response.data.conversations;
      } catch (error) {
        console.error('Error loading conversations:', error);
        throw error;
      }
    },

    async claimConversation(conversationId) {
      try {
        const response = await supportApi.claimConversation(conversationId);

        // Refresh lists
        await this.refreshManagerConversations();

        return response.data.conversation;
      } catch (error) {
        console.error('Error claiming conversation:', error);
        throw error;
      }
    },

    async sendManagerMessage(conversationId, message) {
      try {
        const response = await supportApi.sendManagerMessage(
          conversationId,
          message
        );

        return response.data.message;
      } catch (error) {
        console.error('Error sending manager message:', error);
        throw error;
      }
    },

    async transferConversation(conversationId, newManagerId) {
      try {
        await supportApi.transferConversation(conversationId, newManagerId);

        // Refresh lists
        await this.refreshManagerConversations();
      } catch (error) {
        console.error('Error transferring conversation:', error);
        throw error;
      }
    },

    async resolveConversation(conversationId) {
      try {
        await supportApi.resolveConversation(conversationId);

        // Refresh lists
        await this.refreshManagerConversations();
      } catch (error) {
        console.error('Error resolving conversation:', error);
        throw error;
      }
    },

    async refreshManagerConversations() {
      const authStore = useAuthStore();

      await this.loadManagerConversations('pending');
      await this.loadManagerConversations('my_active');

      if (authStore.isAdmin) {
        await this.loadManagerConversations('all_active');
      }
    },

    // ============================================
    // UTILITIES
    // ============================================

    playNotificationSound() {
      // Play sound only if chat is closed
      if (!this.isOpen) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch((err) => console.log('Audio play failed:', err));
      }
    },

    cleanup() {
      if (this.echo) {
        this.echo.disconnect();
        this.echo = null;
      }

      this.conversation = null;
      this.messages = [];
      this.isOpen = false;
      this.unreadCount = 0;
    },
  },

  persist: {
    storage: localStorage,
    paths: ['unreadCount'],
  },
});
