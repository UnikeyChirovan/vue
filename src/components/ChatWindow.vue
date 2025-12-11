<template>
  <div
    class="chat-window"
    :class="{ minimized: chat.minimized }"
    :style="windowStyle"
  >
    <!-- Header -->
    <div class="chat-header" @click="toggleMinimize">
      <div class="user-info">
        <div class="avatar-container">
          <img :src="chat.avatar" :alt="chat.name" class="avatar" />
          <span v-if="chat.online" class="online-indicator"></span>
        </div>
        <div class="user-details">
          <span class="user-name">{{ chat.name }}</span>
          <span v-if="chat.typing" class="typing-indicator">Đang nhập...</span>
          <span v-else-if="chat.online" class="status">Đang hoạt động</span>
        </div>
      </div>
      <div class="header-actions">
        <button
          @click.stop="confirmDeleteAll"
          class="action-btn"
          title="Xóa toàn bộ tin nhắn"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
        <button @click.stop="minimizeChat" class="action-btn">
          <i class="fa-solid fa-minus"></i>
        </button>
        <button @click.stop="closeChat" class="action-btn">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="!chat.minimized" class="chat-messages" ref="messagesContainer">
      <div
        v-for="message in chat.messages"
        :key="message.id"
        :class="['message', message.sender === 'me' ? 'sent' : 'received']"
        @contextmenu.prevent="showContextMenu($event, message)"
      >
        <div class="message-content">
          <p>{{ message.text }}</p>
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="chat.messages.length === 0" class="empty-messages">
        <i class="fa-solid fa-comments"></i>
        <p>Bắt đầu cuộc trò chuyện</p>
      </div>
    </div>

    <!-- Context Menu -->
    <div
      v-if="contextMenu.show"
      class="context-menu"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
    >
      <button
        v-if="contextMenu.message?.sender === 'me'"
        @click="deleteMessage(contextMenu.message)"
        class="menu-item delete"
      >
        <i class="fa-solid fa-trash"></i>
        Xóa tin nhắn
      </button>
      <button @click="copyMessage(contextMenu.message)" class="menu-item">
        <i class="fa-solid fa-copy"></i>
        Sao chép
      </button>
    </div>

    <!-- Input -->
    <div v-if="!chat.minimized" class="chat-input">
      <input
        v-model="messageText"
        @keyup.enter="sendMessage"
        @input="handleTyping"
        type="text"
        placeholder="Nhập tin nhắn..."
        class="message-input"
      />
      <button
        @click="sendMessage"
        class="send-btn"
        :disabled="!messageText.trim()"
      >
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>

    <!-- Confirm Delete Modal -->
    <div
      v-if="showDeleteConfirm"
      class="confirm-overlay"
      @click="showDeleteConfirm = false"
    >
      <div class="confirm-modal" @click.stop>
        <h3>Xóa toàn bộ tin nhắn?</h3>
        <p>Hành động này không thể hoàn tác.</p>
        <div class="confirm-actions">
          <button @click="showDeleteConfirm = false" class="btn-cancel">
            Hủy
          </button>
          <button @click="deleteAllMessages" class="btn-delete">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useChatStore } from '../stores/chatStore';
import { useMessage } from 'naive-ui';
const message = useMessage();

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const chatStore = useChatStore();
const messageText = ref('');
const messagesContainer = ref(null);
const typingTimeout = ref(null);
const showDeleteConfirm = ref(false);

// Context menu state
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  message: null,
});

const windowStyle = computed(() => {
  if (props.chat.minimized) {
    return {};
  }
  return {
    right: `${20 + props.index * 340}px`,
  };
});

const toggleMinimize = () => {
  if (props.chat.minimized) {
    chatStore.openChat({
      id: props.chat.id,
      name: props.chat.name,
      avatar: props.chat.avatar,
      online: props.chat.online,
    });
    chatStore.markAsRead(props.chat.id);
  }
};

const minimizeChat = () => {
  chatStore.minimizeChat(props.chat.id);
};

const closeChat = () => {
  chatStore.closeChat(props.chat.id);
};

const sendMessage = () => {
  if (messageText.value.trim()) {
    chatStore.sendMessage(props.chat.id, messageText.value.trim());
    messageText.value = '';
    scrollToBottom();
  }
};

const handleTyping = () => {
  // TODO: Send typing status via WebSocket
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  typingTimeout.value = setTimeout(() => {
    // Stop typing
  }, 1000);
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

// ===== CHỨC NĂNG XÓA TIN NHẮN =====

// Hiển thị context menu
const showContextMenu = (event, message) => {
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    message: message,
  };
};

// Đóng context menu
const closeContextMenu = () => {
  contextMenu.value.show = false;
};

// Xóa một tin nhắn
const deleteMessage = async (message) => {
  if (!message) return;

  try {
    await chatStore.deleteMessage(props.chat.id, message.id);
    closeContextMenu();
  } catch (error) {
    console.error('Error deleting message:', error);
    message.error('Không thể xóa tin nhắn');
  }
};

// Sao chép tin nhắn
const copyMessage = (message) => {
  if (!message) return;

  navigator.clipboard.writeText(message.text).then(() => {
    console.log('Đã sao chép tin nhắn');
  });
  closeContextMenu();
};

// Confirm xóa toàn bộ
const confirmDeleteAll = () => {
  showDeleteConfirm.value = true;
};

// Xóa toàn bộ tin nhắn
const deleteAllMessages = async () => {
  try {
    await chatStore.deleteAllMessages(props.chat.id);
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Error deleting all messages:', error);
    message.error('Không thể xóa tin nhắn');
  }
};

// Đóng context menu khi click ra ngoài
const handleClickOutside = (event) => {
  if (contextMenu.value.show) {
    // Check if click is outside context menu
    const contextMenuEl = document.querySelector('.context-menu');
    if (contextMenuEl && !contextMenuEl.contains(event.target)) {
      closeContextMenu();
    }
  }
};

watch(
  () => props.chat.messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

watch(
  () => props.chat.minimized,
  (newVal) => {
    if (!newVal) {
      scrollToBottom();
      chatStore.markAsRead(props.chat.id);
    }
  }
);

onMounted(() => {
  scrollToBottom();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.chat-window {
  position: fixed;
  bottom: 0;
  width: 320px;
  height: 450px;
  background: white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: all 0.3s ease;
}

.chat-window.minimized {
  height: 48px;
  width: 280px;
  bottom: 0;
  right: auto !important;
}

.chat-header {
  background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%);
  color: white;
  padding: 12px 15px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  overflow: hidden;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #44b700;
  border: 2px solid white;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status,
.typing-indicator {
  font-size: 11px;
  opacity: 0.9;
}

.typing-indicator {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.empty-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
}

.empty-messages i {
  font-size: 48px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-messages p {
  margin: 0;
  font-size: 14px;
}

.message {
  display: flex;
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

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 18px;
  word-wrap: break-word;
  cursor: context-menu;
}

.message.sent .message-content {
  background: #0084ff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-content {
  background: #e4e6eb;
  color: #050505;
  border-bottom-left-radius: 4px;
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

.chat-input {
  padding: 10px;
  background: white;
  border-top: 1px solid #e4e6eb;
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e4e6eb;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #0084ff;
}

.send-btn {
  background: #0084ff;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: #0066cc;
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 4px;
  z-index: 10000;
  min-width: 160px;
}

.menu-item {
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #333;
  border-radius: 4px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f0f0f0;
}

.menu-item.delete {
  color: #ff3b30;
}

.menu-item.delete:hover {
  background: #ffe5e5;
}

/* Confirm Modal */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.confirm-modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  text-align: center;
}

.confirm-modal h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #333;
}

.confirm-modal p {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel,
.btn-delete {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-cancel {
  background: #e4e6eb;
  color: #333;
}

.btn-cancel:hover {
  background: #d0d2d7;
}

.btn-delete {
  background: #ff3b30;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
}
</style>
