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

    // ✅ OPTIMIZED: Xử lý realtime update thông minh hơn
    subscribeToManagerChannel() {
      const authStore = useAuthStore();
      if (!authStore.user) return;
      if (!authStore.isAdmin && authStore.user.department_id !== 3) return;

      this.initializeEcho();

      this.echo
        .private(`support.manager.${authStore.user.id}`)
        .listen('.support.message.sent', (event) => {
          // ✅ Thay vì refresh toàn bộ, chỉ update conversation cụ thể
          this.handleRealtimeMessageUpdate(event);
        });

      if (authStore.isAdmin) {
        this.echo
          .private('support.admin')
          .listen('.support.message.sent', (event) => {
            this.handleRealtimeMessageUpdate(event);
          });
      }
    },

    // ✅ NEW: Xử lý update conversation realtime mà không cần refresh toàn bộ
    handleRealtimeMessageUpdate(event) {
      const conversationId = event.conversation_id;
      const authStore = useAuthStore();

      // Update trong pending list
      const pendingIndex = this.pendingConversations.findIndex(
        (c) => c.id === conversationId
      );
      if (pendingIndex !== -1) {
        this.pendingConversations[pendingIndex].last_message = {
          message: event.message,
          timestamp: event.timestamp,
        };
        this.pendingConversations[pendingIndex].last_message_at =
          event.timestamp;

        // Update unread count nếu message từ user
        if (event.sender_type === 'user') {
          this.pendingConversations[pendingIndex].unread_count++;
        }

        // Di chuyển lên đầu list
        const conv = this.pendingConversations.splice(pendingIndex, 1)[0];
        this.pendingConversations.unshift(conv);
      }

      // Update trong my_active list
      const myActiveIndex = this.myActiveConversations.findIndex(
        (c) => c.id === conversationId
      );
      if (myActiveIndex !== -1) {
        this.myActiveConversations[myActiveIndex].last_message = {
          message: event.message,
          timestamp: event.timestamp,
        };
        this.myActiveConversations[myActiveIndex].last_message_at =
          event.timestamp;

        if (event.sender_type === 'user') {
          this.myActiveConversations[myActiveIndex].unread_count++;
        }

        const conv = this.myActiveConversations.splice(myActiveIndex, 1)[0];
        this.myActiveConversations.unshift(conv);
      }

      // Update trong all_active list (admin only)
      if (authStore.isAdmin) {
        const allActiveIndex = this.allActiveConversations.findIndex(
          (c) => c.id === conversationId
        );
        if (allActiveIndex !== -1) {
          this.allActiveConversations[allActiveIndex].last_message = {
            message: event.message,
            timestamp: event.timestamp,
          };
          this.allActiveConversations[allActiveIndex].last_message_at =
            event.timestamp;

          if (event.sender_type === 'user') {
            this.allActiveConversations[allActiveIndex].unread_count++;
          }

          const conv = this.allActiveConversations.splice(allActiveIndex, 1)[0];
          this.allActiveConversations.unshift(conv);
        }
      }

      // Nếu không tìm thấy trong bất kỳ list nào, có thể là conversation mới
      // Chỉ khi đó mới cần refresh (ít khi xảy ra)
      if (pendingIndex === -1 && myActiveIndex === -1) {
        // Conversation mới hoặc status thay đổi - chỉ refresh list cần thiết
        if (event.conversation?.status === 'pending') {
          this.loadManagerConversations('pending');
        } else if (event.conversation?.assigned_to === authStore.user.id) {
          this.loadManagerConversations('my_active');
        }
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

        // ✅ Optimized: Chỉ update conversations liên quan
        const claimedConv = response.data.conversation;

        // Xóa khỏi pending
        this.pendingConversations = this.pendingConversations.filter(
          (c) => c.id !== conversationId
        );

        // Thêm vào my_active
        this.myActiveConversations.unshift(claimedConv);

        return claimedConv;
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

        // ✅ Update last_message local ngay lập tức
        const updateLastMessage = (list) => {
          const index = list.findIndex((c) => c.id === conversationId);
          if (index !== -1) {
            list[index].last_message = {
              message: response.data.message.message,
              timestamp: response.data.message.timestamp,
            };
            list[index].last_message_at = response.data.message.timestamp;

            // Di chuyển lên đầu
            const conv = list.splice(index, 1)[0];
            list.unshift(conv);
          }
        };

        updateLastMessage(this.myActiveConversations);
        updateLastMessage(this.allActiveConversations);

        return response.data.message;
      } catch (error) {
        console.error('Error sending manager message:', error);
        throw error;
      }
    },

    async transferConversation(conversationId, newManagerId) {
      try {
        await supportApi.transferConversation(conversationId, newManagerId);

        // ✅ Optimized: Xóa khỏi my_active, không cần refresh toàn bộ
        this.myActiveConversations = this.myActiveConversations.filter(
          (c) => c.id !== conversationId
        );
      } catch (error) {
        console.error('Error transferring conversation:', error);
        throw error;
      }
    },

    async resolveConversation(conversationId) {
      try {
        await supportApi.resolveConversation(conversationId);

        // ✅ Optimized: Xóa khỏi active lists
        this.myActiveConversations = this.myActiveConversations.filter(
          (c) => c.id !== conversationId
        );
        this.allActiveConversations = this.allActiveConversations.filter(
          (c) => c.id !== conversationId
        );
      } catch (error) {
        console.error('Error resolving conversation:', error);
        throw error;
      }
    },

    // ✅ Giữ lại nhưng chỉ dùng khi thực sự cần (ví dụ: click refresh button)
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
        audio.play().catch(() => {});
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
