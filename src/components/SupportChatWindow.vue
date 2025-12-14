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
          <router-link to="/contact">liên hệ</router-link></span
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
            Gửi đánh giá
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
        'Cảm ơn bạn đã đánh giá! Nếu cần hỗ trợ thêm, hãy liên hệ lại.'
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
  flex-shrink: 0;
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

.rating-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #4caf50;
}

.rating-header i {
  font-size: 24px;
}

.rating-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
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
  transition: opacity 0.2s;
}

.skip-rating-btn {
  background: #e0e0e0;
  color: #666;
}

.skip-rating-btn:hover {
  opacity: 0.8;
}

.submit-rating-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-rating-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-rating-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  flex-shrink: 0;
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

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet (769px - 1023px) */
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

/* Mobile (481px - 768px) */
@media (max-width: 768px) {
  .support-chat-window {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
    max-width: none;
    /* ✅ SỬA: Thêm padding-top để không bị navbar che */
    padding-top: env(safe-area-inset-top, 0);
  }

  /* ✅ SỬA: Header nhỏ gọn hơn + margin-top để tránh navbar */
  .chat-header {
    padding: 12px 16px;
    margin-top: 60px; /* Tránh navbar */
    position: relative;
  }

  .header-info {
    gap: 10px;
    flex: 1;
    min-width: 0; /* Cho phép text truncate */
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
    min-width: 0; /* Cho phép text truncate */
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

  /* ✅ SỬA: Nút close trong mobile */
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
  }

  .message-content p {
    font-size: 13px;
  }

  .offline-notice {
    padding: 10px;
    font-size: 12px;
  }

  .rating-section {
    padding: 14px;
  }

  .rating-header h4 {
    font-size: 15px;
  }

  .rating-stars i {
    font-size: 26px;
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
  /* ✅ SỬA: Header compact hơn + margin-top */
  .chat-header {
    padding: 10px 12px;
    margin-top: 55px; /* Tránh navbar trên màn nhỏ */
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

  /* ✅ SỬA: Nút close nhỏ hơn nhưng vẫn dễ bấm */
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
    padding: 9px 12px;
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
    font-size: 22px;
  }

  .rating-header h4 {
    font-size: 14px;
  }

  .rating-section p {
    font-size: 13px;
  }

  .rating-stars {
    gap: 6px;
  }

  .rating-stars i {
    font-size: 24px;
  }

  .rating-section textarea {
    padding: 7px;
    font-size: 13px;
  }

  .skip-rating-btn,
  .submit-rating-btn {
    padding: 9px;
    font-size: 13px;
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
  /* ✅ SỬA: Header siêu compact + margin-top */
  .chat-header {
    padding: 9px 10px;
    margin-top: 50px; /* Tránh navbar trên màn rất nhỏ */
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

  /* ✅ SỬA: Nút close nhỏ nhất */
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

  .offline-notice {
    padding: 8px;
    font-size: 10px;
  }

  .rating-section {
    padding: 10px;
  }

  .rating-header i {
    font-size: 20px;
  }

  .rating-header h4 {
    font-size: 13px;
  }

  .rating-section p {
    font-size: 12px;
  }

  .rating-stars {
    gap: 5px;
  }

  .rating-stars i {
    font-size: 22px;
  }

  .rating-section textarea {
    padding: 6px;
    font-size: 12px;
  }

  .skip-rating-btn,
  .submit-rating-btn {
    padding: 8px;
    font-size: 12px;
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
