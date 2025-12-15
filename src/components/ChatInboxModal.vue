<template>
  <transition name="fade-zoom">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="inbox-modal">
        <div class="modal-header">
          <div class="header-content">
            <i class="fa-solid fa-inbox"></i>
            <h2 class="title">Hộp Thư</h2>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Đóng">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="loading" class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Đang tải...</p>
          </div>

          <div
            v-else-if="chatStore.chatHistory.length === 0"
            class="empty-state"
          >
            <i class="fa-solid fa-inbox"></i>
            <p>Chưa có tin nhắn nào</p>
            <span class="empty-hint">Bắt đầu cuộc trò chuyện với bạn bè!</span>
          </div>

          <div v-else class="chat-list">
            <div
              v-for="chat in sortedChatHistory"
              :key="chat.id"
              class="chat-item"
              @click="openChat(chat)"
            >
              <div class="chat-avatar">
                <img :src="chat.avatar" :alt="chat.name" />
                <span v-if="chat.online" class="online-indicator"></span>
                <span v-if="chat.unread > 0" class="unread-count">{{
                  chat.unread
                }}</span>
              </div>
              <div class="chat-info">
                <div class="chat-header-info">
                  <h3 class="chat-name">{{ chat.name }}</h3>
                  <span class="chat-time">{{
                    formatTime(chat.lastMessageTime)
                  }}</span>
                </div>
                <p class="last-message" :class="{ unread: chat.unread > 0 }">
                  {{ chat.lastMessage || 'Bắt đầu cuộc trò chuyện' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useChatStore } from '../stores/chatStore';

const chatStore = useChatStore();
const showModal = ref(false);
const loading = ref(false);

const sortedChatHistory = computed(() => {
  return [...chatStore.chatHistory].sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return timeB - timeA;
  });
});

const openModal = async () => {
  showModal.value = true;
  loading.value = true;

  try {
    await chatStore.loadChatHistory();
  } catch (error) {
    console.error('Error loading chat history:', error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
};

const openChat = async (chat) => {
  closeModal();

  await chatStore.openChat({
    id: chat.id,
    name: chat.name,
    avatar: chat.avatar,
    online: chat.online,
    conversationId: chat.conversationId,
  });

  if (chat.unread > 0 && chat.conversationId) {
    await chatStore.markAsRead(chat.id);
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 86400000) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  if (diff < 172800000) {
    return 'Hôm qua';
  }

  if (diff < 604800000) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

defineExpose({ openModal });
</script>

<style scoped>
/* ========== MODAL OVERLAY ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* ========== INBOX MODAL ========== */
.inbox-modal {
  position: relative;
  width: 100%;
  max-width: 550px;
  max-height: 85vh;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Dark Mode */
html.dark-mode .inbox-modal {
  background: #1e1e1e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* ========== MODAL HEADER ========== */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%);
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
}

.header-content i {
  font-size: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

/* ========== MODAL BODY ========== */
.modal-body {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  min-height: 300px;
}

/* Dark Mode */
html.dark-mode .modal-body {
  background: #1e1e1e;
}

/* ========== LOADING STATE ========== */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading i {
  font-size: 48px;
  color: #0084ff;
}

html.dark-mode .loading i {
  color: #4da3ff;
}

.loading p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

html.dark-mode .loading p {
  color: #aaa;
}

/* ========== EMPTY STATE ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
}

.empty-state i {
  font-size: 64px;
  color: #ccc;
  margin-bottom: 8px;
  opacity: 0.6;
}

html.dark-mode .empty-state i {
  color: #555;
}

.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  font-weight: 600;
}

html.dark-mode .empty-state p {
  color: #aaa;
}

.empty-hint {
  font-size: 0.95rem;
  color: #999;
  font-style: italic;
}

html.dark-mode .empty-hint {
  color: #777;
}

/* ========== CHAT LIST ========== */
.chat-list {
  display: flex;
  flex-direction: column;
}

/* ========== CHAT ITEM ========== */
.chat-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

html.dark-mode .chat-item {
  border-bottom-color: #2a2a2a;
}

.chat-item:hover {
  background: #f8f9fa;
}

html.dark-mode .chat-item:hover {
  background: #2a2a2a;
}

.chat-item:active {
  background: #e9ecef;
}

html.dark-mode .chat-item:active {
  background: #333333;
}

/* ========== CHAT AVATAR ========== */
.chat-avatar {
  position: relative;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0084ff;
}

html.dark-mode .chat-avatar img {
  border-color: #4da3ff;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background: #44b700;
  border: 3px solid white;
  border-radius: 50%;
}

html.dark-mode .online-indicator {
  border-color: #1e1e1e;
}

.unread-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3b30;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 7px;
  border-radius: 12px;
  min-width: 22px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.4);
}

/* ========== CHAT INFO ========== */
.chat-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chat-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.chat-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

html.dark-mode .chat-name {
  color: #e0e0e0;
}

.chat-time {
  font-size: 0.8rem;
  color: #888;
  flex-shrink: 0;
  font-weight: 500;
}

html.dark-mode .chat-time {
  color: #999;
}

.last-message {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

html.dark-mode .last-message {
  color: #aaa;
}

.last-message.unread {
  color: #000;
  font-weight: 600;
}

html.dark-mode .last-message.unread {
  color: #fff;
}

/* ========== ANIMATIONS ========== */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-zoom-enter-active .inbox-modal,
.fade-zoom-leave-active .inbox-modal {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-zoom-enter-from .inbox-modal,
.fade-zoom-leave-to .inbox-modal {
  transform: scale(0.9) translateY(20px);
}

/* ========== SCROLLBAR STYLING ========== */
.modal-body::-webkit-scrollbar,
.chat-list::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track,
.chat-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

html.dark-mode .modal-body::-webkit-scrollbar-track,
html.dark-mode .chat-list::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.modal-body::-webkit-scrollbar-thumb,
.chat-list::-webkit-scrollbar-thumb {
  background: #0084ff;
  border-radius: 10px;
}

html.dark-mode .modal-body::-webkit-scrollbar-thumb,
html.dark-mode .chat-list::-webkit-scrollbar-thumb {
  background: #4da3ff;
}

.modal-body::-webkit-scrollbar-thumb:hover,
.chat-list::-webkit-scrollbar-thumb:hover {
  background: #0066cc;
}

html.dark-mode .modal-body::-webkit-scrollbar-thumb:hover,
html.dark-mode .chat-list::-webkit-scrollbar-thumb:hover {
  background: #6bb5ff;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 15px;
  }

  .inbox-modal {
    max-width: 100%;
    border-radius: 16px;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .header-content i {
    font-size: 1.3rem;
  }

  .title {
    font-size: 1.3rem;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .chat-item {
    padding: 14px 18px;
  }

  .chat-avatar img {
    width: 54px;
    height: 54px;
  }

  .chat-name {
    font-size: 0.95rem;
  }

  .last-message {
    font-size: 0.85rem;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }

  .inbox-modal {
    border-radius: 14px;
    max-height: 90vh;
  }

  .modal-header {
    padding: 18px 20px;
  }

  .header-content i {
    font-size: 1.2rem;
  }

  .title {
    font-size: 1.2rem;
  }

  .close-btn {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  .chat-item {
    padding: 12px 16px;
    gap: 12px;
  }

  .chat-avatar img {
    width: 50px;
    height: 50px;
  }

  .online-indicator {
    width: 12px;
    height: 12px;
    border-width: 2px;
  }

  .unread-count {
    font-size: 10px;
    padding: 2px 6px;
    min-width: 20px;
  }

  .chat-name {
    font-size: 0.9rem;
  }

  .chat-time {
    font-size: 0.75rem;
  }

  .last-message {
    font-size: 0.8rem;
  }

  .loading,
  .empty-state {
    padding: 50px 15px;
  }

  .loading i,
  .empty-state i {
    font-size: 48px;
  }

  .loading p,
  .empty-state p {
    font-size: 0.95rem;
  }

  .empty-hint {
    font-size: 0.85rem;
  }
}

/* Very Small Mobile */
@media (max-width: 360px) {
  .title {
    font-size: 1.1rem;
  }

  .chat-avatar img {
    width: 46px;
    height: 46px;
  }

  .chat-name {
    font-size: 0.85rem;
  }

  .last-message {
    font-size: 0.75rem;
  }
}
</style>
