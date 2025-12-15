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

const showContextMenu = (event, msg) => {
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    message: msg,
  };
};

const closeContextMenu = () => {
  contextMenu.value.show = false;
};

const deleteMessage = async (msg) => {
  if (!msg) return;

  try {
    await chatStore.deleteMessage(props.chat.id, msg.id);
    closeContextMenu();
  } catch (error) {
    console.error('Error deleting message:', error);
    message.error('Không thể xóa tin nhắn');
  }
};

const copyMessage = (msg) => {
  if (!msg) return;

  navigator.clipboard.writeText(msg.text);
  closeContextMenu();
};

const confirmDeleteAll = () => {
  showDeleteConfirm.value = true;
};

const deleteAllMessages = async () => {
  try {
    await chatStore.deleteAllMessages(props.chat.id);
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Error deleting all messages:', error);
    message.error('Không thể xóa tin nhắn');
  }
};

const handleClickOutside = (event) => {
  if (contextMenu.value.show) {
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
  height: 460px;
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

html.dark-mode .chat-window {
  background: #1e1e1e;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.5);
}

.chat-window.minimized {
  height: 52px;
  width: 280px;
  bottom: 0;
  right: auto !important;
}

/* ========== CHAT HEADER ========== */
.chat-header {
  background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%);
  color: white;
  padding: 14px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  min-height: 52px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  overflow: hidden;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11px;
  height: 11px;
  background: #44b700;
  border: 2px solid white;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status,
.typing-indicator {
  font-size: 0.75rem;
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
  gap: 6px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* ========== CHAT MESSAGES ========== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

html.dark-mode .chat-messages {
  background: #121212;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

html.dark-mode .chat-messages::-webkit-scrollbar-thumb {
  background: #555;
}

.empty-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
}

html.dark-mode .empty-messages {
  color: #666;
}

.empty-messages i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-messages p {
  margin: 0;
  font-size: 0.9rem;
}

/* ========== MESSAGE ========== */
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
  max-width: 75%;
  padding: 10px 14px;
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

html.dark-mode .message.received .message-content {
  background: #2a2a2a;
  color: #e0e0e0;
}

.message-content p {
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* ========== CONTEXT MENU ========== */
.context-menu {
  position: fixed;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 6px;
  z-index: 10000;
  min-width: 170px;
}

html.dark-mode .context-menu {
  background: #2a2a2a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.menu-item {
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #333;
  border-radius: 6px;
  transition: background 0.2s;
}

html.dark-mode .menu-item {
  color: #e0e0e0;
}

.menu-item:hover {
  background: #f0f0f0;
}

html.dark-mode .menu-item:hover {
  background: #3a3a3a;
}

.menu-item.delete {
  color: #ff3b30;
}

.menu-item.delete:hover {
  background: #ffe5e5;
}

html.dark-mode .menu-item.delete:hover {
  background: #3a1a1a;
}

/* ========== CHAT INPUT ========== */
.chat-input {
  padding: 12px;
  background: white;
  border-top: 1px solid #e4e6eb;
  display: flex;
  gap: 10px;
  align-items: center;
}

html.dark-mode .chat-input {
  background: #1e1e1e;
  border-top-color: #2a2a2a;
}

.message-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e4e6eb;
  border-radius: 20px;
  outline: none;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  background: white;
  color: #333;
}

html.dark-mode .message-input {
  background: #2a2a2a;
  border-color: #3a3a3a;
  color: #e0e0e0;
}

.message-input:focus {
  border-color: #0084ff;
}

html.dark-mode .message-input:focus {
  border-color: #4da3ff;
}

.send-btn {
  background: #0084ff;
  color: white;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.send-btn:hover:not(:disabled) {
  background: #0066cc;
  transform: scale(1.05);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========== CONFIRM MODAL ========== */
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
  padding: 26px;
  border-radius: 14px;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

html.dark-mode .confirm-modal {
  background: #2a2a2a;
}

.confirm-modal h3 {
  margin: 0 0 12px 0;
  font-size: 1.15rem;
  color: #333;
}

html.dark-mode .confirm-modal h3 {
  color: #e0e0e0;
}

.confirm-modal p {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 0.9rem;
}

html.dark-mode .confirm-modal p {
  color: #aaa;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel,
.btn-delete {
  padding: 11px 26px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-cancel {
  background: #e4e6eb;
  color: #333;
}

html.dark-mode .btn-cancel {
  background: #3a3a3a;
  color: #e0e0e0;
}

.btn-cancel:hover {
  background: #d0d2d7;
}

html.dark-mode .btn-cancel:hover {
  background: #4a4a4a;
}

.btn-delete {
  background: #ff3b30;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
  transform: scale(1.05);
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 768px) {
  .chat-window {
    width: 300px;
    height: 440px;
  }

  .chat-window.minimized {
    width: 260px;
  }
}

@media (max-width: 480px) {
  .chat-window {
    width: 280px;
    height: 420px;
    border-radius: 10px 10px 0 0;
  }

  .chat-window.minimized {
    width: 240px;
  }

  .chat-header {
    padding: 12px 14px;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
  }

  .chat-messages {
    padding: 14px;
  }

  .message-content {
    max-width: 80%;
    padding: 9px 12px;
  }

  .message-content p {
    font-size: 0.85rem;
  }

  .chat-input {
    padding: 10px;
  }

  .message-input {
    padding: 9px 12px;
    font-size: 0.85rem;
  }

  .send-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
