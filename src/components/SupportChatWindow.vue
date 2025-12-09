<template>
  <transition name="slide-up">
    <div v-if="supportStore.isOpen" class="support-chat-window">
      <!-- Header -->
      <div class="chat-header">
        <div class="header-info">
          <div class="support-avatar">
            <img :src="supportTeamAvatar" alt="Support Team" />
            <span v-if="supportStore.supportOnline" class="online-dot"></span>
          </div>
          <div class="header-text">
            <h3>Support Team</h3>
            <p v-if="supportStore.supportOnline" class="status-online">
              Đang hoạt động
            </p>
            <p v-else class="status-offline">Hiện không có support online</p>
          </div>
        </div>
        <button @click="closeChat" class="close-btn">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-if="loading" class="loading-state">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Đang tải...</p>
        </div>

        <div v-else-if="messages.length === 0" class="empty-state">
          <i class="fa-solid fa-comments"></i>
          <p>Chào bạn! Chúng tôi có thể giúp gì cho bạn?</p>
        </div>

        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'message',
            message.sender_type === 'user' ? 'user' : 'support',
          ]"
        >
          <div class="message-avatar" v-if="message.sender_type === 'support'">
            <img :src="supportTeamAvatar" alt="Support" />
          </div>
          <div class="message-content">
            <p>{{ message.message }}</p>
            <span class="message-time">{{
              formatTime(message.timestamp)
            }}</span>
          </div>
          <div class="message-avatar" v-if="message.sender_type === 'user'">
            <img :src="userAvatar" alt="You" />
          </div>
        </div>
      </div>

      <!-- Offline Notice -->
      <div v-if="!supportStore.supportOnline" class="offline-notice">
        <i class="fa-solid fa-info-circle"></i>
        <span
          >Hiện không có support online, vui lòng để lại tin nhắn trong phần
          <router-link to="/contact">liên hệ</router-link></span
        >
      </div>

      <!-- Rating (if resolved) -->
      <div v-if="showRating" class="rating-section">
        <p>Đánh giá trải nghiệm của bạn:</p>
        <div class="rating-stars">
          <i
            v-for="star in 5"
            :key="star"
            :class="[
              'fa-star',
              star <= selectedRating ? 'fa-solid' : 'fa-regular',
            ]"
            @click="selectRating(star)"
          ></i>
        </div>
        <textarea
          v-model="ratingComment"
          placeholder="Nhận xét (tùy chọn)"
          rows="2"
        ></textarea>
        <button @click="submitRating" class="submit-rating-btn">
          Gửi đánh giá
        </button>
      </div>

      <!-- Input -->
      <div v-else class="chat-input">
        <input
          v-model="messageText"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Nhập tin nhắn..."
          :disabled="!supportStore.supportOnline"
        />
        <button
          @click="sendMessage"
          class="send-btn"
          :disabled="!messageText.trim() || !supportStore.supportOnline"
        >
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useSupportChatStore } from '../stores/supportChatStore';
import { useAuthStore } from '../stores/auth';

const supportStore = useSupportChatStore();
const authStore = useAuthStore();

const messageText = ref('');
const messagesContainer = ref(null);
const loading = ref(false);

// Rating state
const showRating = ref(false);
const selectedRating = ref(0);
const ratingComment = ref('');

// Avatar
// const supportTeamAvatar = computed(() => {
//   // TODO: Replace with actual support team avatar from settings
//   return 'https://ui-avatars.com/api/?name=Support+Team&background=667eea&color=fff';
// });
const supportTeamAvatar = computed(() => {
  return '/image/ST.jpg';
});

const userAvatar = computed(() => {
  return authStore.user?.avatar || 'https://picsum.photos/40';
});

// Messages
const messages = computed(() => supportStore.messages);

// Load conversation
const loadConversation = async () => {
  loading.value = true;
  try {
    await supportStore.loadConversation();
    await supportStore.checkSupportOnline();
    scrollToBottom();
  } catch (error) {
    console.error('Error loading conversation:', error);
  } finally {
    loading.value = false;
  }
};

// Send message
const sendMessage = async () => {
  if (!messageText.value.trim()) return;
  if (!supportStore.supportOnline) return;

  const text = messageText.value.trim();
  messageText.value = '';

  try {
    await supportStore.sendMessage(text);
    scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
    messageText.value = text; // Restore message on error
  }
};

// Close chat
const closeChat = () => {
  supportStore.closeChat();
};

// Rating
const selectRating = (star) => {
  selectedRating.value = star;
};

const submitRating = async () => {
  if (selectedRating.value === 0) return;

  try {
    await supportStore.rateConversation(
      selectedRating.value,
      ratingComment.value
    );
    showRating.value = false;
    selectedRating.value = 0;
    ratingComment.value = '';
  } catch (error) {
    console.error('Error submitting rating:', error);
  }
};

// Format time
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Watch for new messages
watch(
  () => supportStore.messages.length,
  () => {
    scrollToBottom();
  }
);

// Watch for resolved status
// Watch for resolved status
watch(
  () => supportStore.conversation?.status,
  (newStatus) => {
    if (newStatus === 'resolved') {
      showRating.value = true;
    }
  }
);

// Watch for open state
watch(
  () => supportStore.isOpen,
  (isOpen) => {
    if (isOpen && !supportStore.conversation) {
      loadConversation();
    }
  }
);

onMounted(() => {
  if (supportStore.isOpen) {
    loadConversation();
  }
});
</script>

<style scoped>
.support-chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  height: 550px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 998;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.support-avatar {
  position: relative;
}

.support-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid white;
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #44b700;
  border: 2px solid white;
  border-radius: 50%;
}

.header-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-text p {
  margin: 4px 0 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.status-online {
  color: #44b700;
}

.status-offline {
  color: #ffcc00;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  gap: 12px;
}

.loading-state i,
.empty-state i {
  font-size: 48px;
}

.message {
  display: flex;
  gap: 8px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  word-wrap: break-word;
}

.message.support .message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-content p {
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.offline-notice {
  background: #fff3cd;
  color: #856404;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  border-top: 1px solid #ffeaa7;
}

.offline-notice a {
  color: #667eea;
  text-decoration: underline;
}

.rating-section {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.rating-section p {
  margin: 0 0 12px 0;
  font-weight: 600;
  color: #333;
}

.rating-stars {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.rating-stars i {
  font-size: 28px;
  color: #ffc107;
  cursor: pointer;
  transition: transform 0.2s;
}

.rating-stars i:hover {
  transform: scale(1.2);
}

.rating-section textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  margin-bottom: 12px;
}

.submit-rating-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-rating-btn:hover {
  opacity: 0.9;
}

.chat-input {
  padding: 12px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.chat-input input:focus {
  border-color: #667eea;
}

.chat-input input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .support-chat-window {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
}
</style>
