<template>
  <transition name="fade-zoom">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="inbox-modal">
        <div class="modal-header">
          <h2 class="title">Hộp Thư</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <div v-if="loading" class="loading">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Đang tải...</p>
        </div>

        <div v-else-if="chatStore.chatHistory.length === 0" class="empty-state">
          <i class="fa-solid fa-inbox"></i>
          <p>Chưa có tin nhắn nào</p>
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
  // Đóng modal trước
  closeModal();

  // Mở chat với conversationId để đảm bảo markAsRead hoạt động
  await chatStore.openChat({
    id: chat.id,
    name: chat.name,
    avatar: chat.avatar,
    online: chat.online,
    conversationId: chat.conversationId, // Thêm conversationId
  });

  // Đảm bảo markAsRead được gọi ngay sau khi mở
  // chatStore.openChat đã tự động gọi markAsRead, nhưng để chắc chắn:
  if (chat.unread > 0 && chat.conversationId) {
    await chatStore.markAsRead(chat.id);
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // Trong ngày
  if (diff < 86400000) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Hôm qua
  if (diff < 172800000) {
    return 'Hôm qua';
  }

  // Trong tuần
  if (diff < 604800000) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  }

  // Lâu hơn
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

defineExpose({ openModal });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.inbox-modal {
  position: relative;
  width: 90vw;
  max-width: 500px;
  max-height: 80vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%);
  color: white;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading {
  text-align: center;
  padding: 40px;
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.loading i {
  font-size: 32px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #888;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.chat-list::-webkit-scrollbar {
  width: 6px;
}

.chat-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.chat-item:hover {
  background: #f5f5f5;
}

.chat-avatar {
  position: relative;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
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

.unread-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3b30;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 7px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.chat-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
  margin-left: 8px;
}

.last-message {
  font-size: 13px;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-message.unread {
  color: #000;
  font-weight: 600;
}

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
