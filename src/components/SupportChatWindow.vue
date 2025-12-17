<template>
  <transition name="slide-up">
    <div v-if="supportStore.isOpen" class="support-chat-window">
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

      <div v-if="!supportStore.supportOnline" class="offline-notice">
        <i class="fa-solid fa-info-circle"></i>
        <span
          >Hiện không có support online, vui lòng để lại tin nhắn trong phần
          <router-link to="/contact">liên lạc</router-link></span
        >
      </div>

      <div v-if="showRating" class="rating-section">
        <div class="rating-header">
          <i class="fa-solid fa-check-circle"></i>
          <h4>Vấn đề của bạn đã được giải quyết!</h4>
        </div>

        <p>Vui lòng đánh giá trải nghiệm của bạn:</p>

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

        <div class="rating-actions">
          <button @click="skipRating" class="skip-rating-btn">Bỏ qua</button>
          <button
            @click="submitRating"
            class="submit-rating-btn"
            :disabled="selectedRating === 0"
          >
            gởi đánh giá
          </button>
        </div>
      </div>

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
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useSupportChatStore } from '../stores/supportChatStore';
import { useAuthStore } from '../stores/auth';
import { useProfileStore } from '../stores/profile';
import { useMessage } from 'naive-ui';

const supportStore = useSupportChatStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();

const message = useMessage();
const messageText = ref('');
const messagesContainer = ref(null);
const loading = ref(false);

const showRating = ref(false);
const selectedRating = ref(0);
const ratingComment = ref('');

const backendUrl = 'http://127.0.0.1:8000';

const supportTeamAvatar = computed(() => '/image/ST.jpg');

const userAvatar = computed(() => {
  if (profileStore.avatarUrl) {
    return profileStore.avatarUrl;
  }

  if (profileStore.users?.avatar && authStore.user?.id) {
    return `${backendUrl}/storage/avatars/${authStore.user.id}/${profileStore.users.avatar}`;
  }

  return 'https://picsum.photos/40';
});

const messages = computed(() => supportStore.messages);

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
    messageText.value = text;
  }
};

const closeChat = () => {
  supportStore.closeChat();
};

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

    supportStore.conversation = null;
    supportStore.messages = [];

    setTimeout(() => {
      message.info(
        'Cảm ơn bạn đã đánh giá! Nếu cần hỗ trợ thêm, hãy liên lạc lại.'
      );
    }, 300);
  } catch (error) {
    console.error('Error submitting rating:', error);
  }
};

const skipRating = async () => {
  try {
    await supportStore.rateConversation(0, 'Skipped by user');

    showRating.value = false;
    selectedRating.value = 0;
    ratingComment.value = '';

    supportStore.conversation = null;
    supportStore.messages = [];
  } catch (error) {
    console.error('Error skipping rating:', error);
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(
  () => supportStore.messages.length,
  () => {
    scrollToBottom();
  }
);

watch(
  () => supportStore.conversation?.status,
  (newStatus, oldStatus) => {
    if (newStatus === 'resolved' && oldStatus !== 'resolved') {
      showRating.value = true;
      scrollToBottom();
    }
  }
);

watch(
  () => supportStore.isOpen,
  (isOpen) => {
    if (isOpen && !supportStore.conversation) {
      loadConversation();
    }
  }
);

onMounted(async () => {
  if (supportStore.isOpen) {
    loadConversation();
  }
  if (!profileStore.users?.id && authStore.user?.id) {
    await profileStore.getProfile(authStore.user.id);
  }
});

onUnmounted(() => {
  supportStore.stopSupportOnlinePolling();
});
</script>

<style scoped>
/* ========== CHAT WINDOW ========== */
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
  z-index: 1001;
  overflow: hidden;
  transition: all 0.3s ease;
}

html.dark-mode .support-chat-window {
  background: #1e1e1e;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* ========== CHAT HEADER ========== */
.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

html.dark-mode .chat-header {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.support-avatar {
  position: relative;
  flex-shrink: 0;
}

.support-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
}

html.dark-mode .support-avatar img {
  border-color: rgba(255, 255, 255, 0.9);
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
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.header-text {
  flex: 1;
  min-width: 0;
}

.header-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-text p {
  margin: 4px 0 0 0;
  font-size: 12px;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-online {
  color: #a7f3d0;
}

.status-offline {
  color: #fde68a;
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
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.close-btn:active {
  transform: rotate(90deg) scale(0.95);
}

/* ========== CHAT MESSAGES ========== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

html.dark-mode .chat-messages {
  background: #121212;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

html.dark-mode .chat-messages::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

html.dark-mode .chat-messages::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* ========== LOADING & EMPTY STATE ========== */
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

html.dark-mode .loading-state,
html.dark-mode .empty-state {
  color: #9ca3af;
}

.loading-state i,
.empty-state i {
  font-size: 48px;
}

.empty-state p {
  font-size: 15px;
  text-align: center;
  max-width: 80%;
}

/* ========== MESSAGES ========== */
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

.message-avatar {
  flex-shrink: 0;
}

.message-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

html.dark-mode .message-content {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.message.support .message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

html.dark-mode .message.support .message-content {
  background: #2a2a2a;
  color: #e0e0e0;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

html.dark-mode .message.user .message-content {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
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

/* ========== OFFLINE NOTICE ========== */
.offline-notice {
  background: #fff3cd;
  color: #856404;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  border-top: 1px solid #ffeaa7;
  flex-shrink: 0;
}

html.dark-mode .offline-notice {
  background: #3a3100;
  color: #fde68a;
  border-top-color: #4a4100;
}

.offline-notice a {
  color: #667eea;
  text-decoration: underline;
  font-weight: 600;
}

html.dark-mode .offline-notice a {
  color: #a78bfa;
}

.offline-notice a:hover {
  color: #764ba2;
}

html.dark-mode .offline-notice a:hover {
  color: #c4b5fd;
}

/* ========== RATING SECTION ========== */
.rating-section {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

html.dark-mode .rating-section {
  background: #1e1e1e;
  border-top-color: #333;
}

.rating-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.rating-header i {
  font-size: 24px;
  color: #4caf50;
}

html.dark-mode .rating-header i {
  color: #6ee7b7;
}

.rating-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

html.dark-mode .rating-header h4 {
  color: #e0e0e0;
}

.rating-section > p {
  margin: 0 0 12px 0;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

html.dark-mode .rating-section > p {
  color: #d1d5db;
}

.rating-stars {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  justify-content: center;
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  margin-bottom: 12px;
  font-size: 14px;
  background: white;
  color: #333;
  transition: border-color 0.2s;
}

html.dark-mode .rating-section textarea {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: #444;
}

.rating-section textarea:focus {
  outline: none;
  border-color: #667eea;
}

html.dark-mode .rating-section textarea:focus {
  border-color: #764ba2;
}

.rating-section textarea::placeholder {
  color: #999;
}

html.dark-mode .rating-section textarea::placeholder {
  color: #6b7280;
}

.rating-actions {
  display: flex;
  gap: 8px;
}

.skip-rating-btn,
.submit-rating-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.skip-rating-btn {
  background: #e0e0e0;
  color: #666;
}

html.dark-mode .skip-rating-btn {
  background: #374151;
  color: #d1d5db;
}

.skip-rating-btn:hover {
  background: #d0d0d0;
  transform: translateY(-1px);
}

html.dark-mode .skip-rating-btn:hover {
  background: #4b5563;
}

.submit-rating-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

html.dark-mode .submit-rating-btn {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 4px 12px rgba(118, 75, 162, 0.4);
}

.submit-rating-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

html.dark-mode .submit-rating-btn:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(118, 75, 162, 0.5);
}

.submit-rating-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ========== CHAT INPUT ========== */
.chat-input {
  padding: 12px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

html.dark-mode .chat-input {
  background: #1e1e1e;
  border-top-color: #333;
}

.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
  background: white;
  color: #333;
}

html.dark-mode .chat-input input {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: #444;
}

.chat-input input:focus {
  border-color: #667eea;
}

html.dark-mode .chat-input input:focus {
  border-color: #764ba2;
}

.chat-input input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

html.dark-mode .chat-input input:disabled {
  background: #1a1a1a;
}

.chat-input input::placeholder {
  color: #999;
}

html.dark-mode .chat-input input::placeholder {
  color: #6b7280;
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
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

html.dark-mode .send-btn {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 2px 8px rgba(118, 75, 162, 0.4);
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

html.dark-mode .send-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(118, 75, 162, 0.5);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========== ANIMATIONS ========== */
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

/* ========== RESPONSIVE DESIGN ========== */

/* Large Tablet (769px - 1023px) */
@media (max-width: 1023px) {
  .support-chat-window {
    width: 90%;
    max-width: 400px;
    height: 600px;
    bottom: 15px;
    right: 15px;
  }

  .chat-header {
    padding: 14px;
  }

  .support-avatar img {
    width: 44px;
    height: 44px;
  }

  .header-text h3 {
    font-size: 15px;
  }

  .header-text p {
    font-size: 11px;
  }

  .close-btn {
    width: 30px;
    height: 30px;
  }
}

/* Tablet & Mobile (≤768px) - Full Screen */
@media (max-width: 768px) {
  .support-chat-window {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
    max-width: none;
    padding-top: env(safe-area-inset-top, 0);
  }

  .chat-header {
    padding: 12px 16px;
    margin-top: 60px;
    position: relative;
  }

  .header-info {
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .support-avatar img {
    width: 40px;
    height: 40px;
  }

  .online-dot {
    width: 10px;
    height: 10px;
    border: 1.5px solid white;
  }

  .header-text {
    flex: 1;
    min-width: 0;
  }

  .header-text h3 {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-text p {
    font-size: 11px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 18px;
    flex-shrink: 0;
    margin-left: 8px;
  }

  .close-btn i {
    font-size: 18px;
  }

  .chat-messages {
    padding: 12px;
    gap: 10px;
  }

  .message-avatar img {
    width: 28px;
    height: 28px;
  }

  .message-content {
    max-width: 75%;
    padding: 9px 12px;
  }

  .message-content p {
    font-size: 13px;
  }

  .message-time {
    font-size: 10px;
  }

  .offline-notice {
    padding: 10px;
    font-size: 12px;
  }

  .rating-section {
    padding: 14px;
  }

  .rating-header i {
    font-size: 22px;
  }

  .rating-header h4 {
    font-size: 15px;
  }

  .rating-section > p {
    font-size: 13px;
  }

  .rating-stars i {
    font-size: 26px;
  }

  .rating-section textarea {
    padding: 9px;
    font-size: 13px;
  }

  .skip-rating-btn,
  .submit-rating-btn {
    padding: 9px;
    font-size: 13px;
  }

  .chat-input {
    padding: 10px;
  }

  .chat-input input {
    padding: 9px 12px;
    font-size: 13px;
  }

  .send-btn {
    width: 38px;
    height: 38px;
  }
}

/* Small Mobile (361px - 480px) */
@media (max-width: 480px) {
  .chat-header {
    padding: 10px 12px;
    margin-top: 55px;
  }

  .header-info {
    gap: 8px;
  }

  .support-avatar img {
    width: 36px;
    height: 36px;
  }

  .online-dot {
    width: 9px;
    height: 9px;
  }

  .header-text h3 {
    font-size: 13px;
  }

  .header-text p {
    font-size: 10px;
  }

  .close-btn {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }

  .close-btn i {
    font-size: 16px;
  }

  .chat-messages {
    padding: 10px;
    gap: 8px;
  }

  .message-avatar img {
    width: 26px;
    height: 26px;
  }

  .message-content {
    padding: 8px 11px;
  }

  .message-content p {
    font-size: 12px;
  }

  .message-time {
    font-size: 10px;
  }

  .offline-notice {
    padding: 9px;
    font-size: 11px;
  }

  .rating-section {
    padding: 12px;
  }

  .rating-header i {
    font-size: 20px;
  }

  .rating-header h4 {
    font-size: 14px;
  }

  .rating-section > p {
    font-size: 12px;
  }

  .rating-stars {
    gap: 6px;
  }

  .rating-stars i {
    font-size: 24px;
  }

  .rating-section textarea {
    padding: 8px;
    font-size: 12px;
  }

  .skip-rating-btn,
  .submit-rating-btn {
    padding: 8px;
    font-size: 12px;
  }

  .chat-input {
    padding: 9px;
  }

  .chat-input input {
    padding: 8px 11px;
    font-size: 12px;
  }

  .send-btn {
    width: 36px;
    height: 36px;
  }
}

/* Extra Small Mobile (≤360px) */
@media (max-width: 360px) {
  .chat-header {
    padding: 9px 10px;
    margin-top: 50px;
  }

  .header-info {
    gap: 7px;
  }

  .support-avatar img {
    width: 34px;
    height: 34px;
  }

  .online-dot {
    width: 8px;
    height: 8px;
  }

  .header-text h3 {
    font-size: 12px;
  }

  .header-text p {
    font-size: 9px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 15px;
  }

  .close-btn i {
    font-size: 15px;
  }

  .chat-messages {
    padding: 8px;
    gap: 7px;
  }

  .message-avatar img {
    width: 24px;
    height: 24px;
  }

  .message-content {
    padding: 8px 10px;
  }

  .message-content p {
    font-size: 11px;
  }

  .message-time {
    font-size: 9px;
  }

  .loading-state i,
  .empty-state i {
    font-size: 40px;
  }

  .empty-state p {
    font-size: 13px;
  }

  .offline-notice {
    padding: 8px;
    font-size: 10px;
  }

  .rating-section {
    padding: 10px;
  }

  .rating-header i {
    font-size: 18px;
  }

  .rating-header h4 {
    font-size: 13px;
  }

  .rating-section > p {
    font-size: 11px;
  }

  .rating-stars {
    gap: 5px;
  }

  .rating-stars i {
    font-size: 22px;
  }

  .rating-section textarea {
    padding: 7px;
    font-size: 11px;
  }

  .skip-rating-btn,
  .submit-rating-btn {
    padding: 7px;
    font-size: 11px;
  }

  .chat-input {
    padding: 8px;
  }

  .chat-input input {
    padding: 7px 10px;
    font-size: 11px;
  }

  .send-btn {
    width: 34px;
    height: 34px;
  }
}
</style>
