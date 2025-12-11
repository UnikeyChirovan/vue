import { defineStore } from 'pinia';
import supportApi from '../services/support-api';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from './auth';
import api from '../services/axiosInterceptor';

export const useSupportChatStore = defineStore('supportChat', {
  state: () => ({
    conversation: null,
    messages: [],
    isOpen: false,
    unreadCount: 0,
    supportOnline: false,
    pendingConversations: [],
    myActiveConversations: [],
    allActiveConversations: [],
    echo: null,
    _onlinePollingInterval: null,
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

      if (this.echo) {
        this.echo.leave(`support.user.${authStore.user.id}`);
      }

      this.echo
        .private(`support.user.${authStore.user.id}`)
        .listen('.support.message.sent', (event) => {
          if (
            event.conversation_id === this.conversation?.id &&
            event.sender_type === 'support'
          ) {
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

              if (!this.isOpen) {
                this.unreadCount++;
                this.playNotificationSound();
              }
            }
          }
        })
        .listen('.support.conversation.resolved', (event) => {
          if (event.conversation_id === this.conversation?.id) {
            this.conversation.status = 'resolved';
            this.playNotificationSound();
          }
        });
    },

    async rateConversation(rating, comment = '') {
      if (!this.conversation) return;

      try {
        await supportApi.rateConversation(
          this.conversation.id,
          rating,
          comment
        );

        this.conversation = null;
        this.messages = [];
        this.unreadCount = 0;
      } catch (error) {
        console.error('Error rating conversation:', error);
        throw error;
      }
    },

    async skipRating() {
      if (!this.conversation) return;

      try {
        await supportApi.rateConversation(this.conversation.id, 0, 'Skipped');

        this.conversation = null;
        this.messages = [];
        this.unreadCount = 0;
      } catch (error) {
        console.error('Error skipping rating:', error);
        throw error;
      }
    },

    subscribeToManagerChannel() {
      const authStore = useAuthStore();
      if (!authStore.user) return;
      if (!authStore.isAdmin && authStore.user.department_id !== 3) return;

      this.initializeEcho();

      this.echo
        .private(`support.manager.${authStore.user.id}`)
        .listen('.support.message.sent', (event) => {
          this.refreshManagerConversations();
        });

      if (authStore.isAdmin) {
        this.echo
          .private('support.admin')
          .listen('.support.message.sent', (event) => {
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

        const exists = this.messages.find(
          (m) => m.id === response.data.message.id
        );

        if (!exists) {
          this.messages.push(response.data.message);
        }

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
        this.unreadCount = 0;
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

    startSupportOnlinePolling() {
      this.checkSupportOnline();

      if (this._onlinePollingInterval) {
        clearInterval(this._onlinePollingInterval);
      }

      this._onlinePollingInterval = setInterval(() => {
        this.checkSupportOnline();
      }, 30000);
    },

    stopSupportOnlinePolling() {
      if (this._onlinePollingInterval) {
        clearInterval(this._onlinePollingInterval);
        this._onlinePollingInterval = null;
      }
    },

    openChat() {
      this.isOpen = true;
      if (this.unreadCount > 0) {
        this.markAsRead();
      }
      this.startSupportOnlinePolling();
    },

    closeChat() {
      this.isOpen = false;
      this.stopSupportOnlinePolling();
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
        await this.refreshManagerConversations();
      } catch (error) {
        console.error('Error transferring conversation:', error);
        throw error;
      }
    },

    async resolveConversation(conversationId) {
      try {
        await supportApi.resolveConversation(conversationId);
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
      if (!this.isOpen) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch((err) => console.log('Audio play failed:', err));
      }
    },

    cleanup() {
      this.stopSupportOnlinePolling();

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
