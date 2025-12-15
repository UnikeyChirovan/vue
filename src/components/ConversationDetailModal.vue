<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="conversation-modal">
      <div class="modal-header">
        <div class="user-info">
          <img
            :src="getAvatarUrl(conversation.user.id, conversation.user.avatar)"
            :alt="conversation.user.name"
            class="user-avatar"
          />
          <div class="user-header-details">
            <h2>{{ conversation.user.name }}</h2>
            <span :class="['status-badge', conversation.status]">
              {{ getStatusText(conversation.status) }}
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button
            v-if="canTransfer"
            @click="showTransferModal = true"
            class="action-btn transfer"
            title="Chuyển tiếp"
          >
            <i class="fa-solid fa-share"></i>
          </button>
          <button
            v-if="canResolve"
            @click="resolveConversation"
            class="action-btn resolve"
            title="Đánh dấu đã giải quyết"
            :disabled="resolving"
          >
            <i v-if="resolving" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-check"></i>
          </button>
          <button @click="$emit('close')" class="action-btn close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="messages-container" ref="messagesContainer">
        <div v-if="loading" class="loading-messages">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Đang tải tin nhắn...</p>
        </div>

        <div v-else>
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'message',
              msg.sender_type === 'user' ? 'user' : 'support',
            ]"
          >
            <div class="message-avatar" v-if="msg.sender_type === 'user'">
              <img
                :src="
                  getAvatarUrl(conversation.user.id, conversation.user.avatar)
                "
                alt="User"
              />
            </div>
            <div class="message-content">
              <p>{{ msg.message }}</p>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
            <div class="message-avatar" v-if="msg.sender_type === 'support'">
              <img :src="supportAvatar" alt="Support" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="canReply" class="message-input-container">
        <input
          v-model="messageText"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Nhập tin nhắn..."
          class="message-input"
        />
        <button
          @click="sendMessage"
          class="send-btn"
          :disabled="!messageText.trim() || sending"
        >
          <i v-if="sending" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>

    <!-- Transfer Modal -->
    <div
      v-if="showTransferModal"
      class="transfer-modal-overlay"
      @click.self="showTransferModal = false"
    >
      <div class="transfer-modal">
        <h3>Chuyển tiếp cuộc hội thoại</h3>
        <p>Chọn manager mới:</p>
        <div class="managers-list">
          <div
            v-for="manager in availableManagers"
            :key="manager.id"
            :class="[
              'manager-item',
              { selected: selectedManagerId === manager.id },
            ]"
            @click="selectedManagerId = manager.id"
          >
            <img
              :src="getAvatarUrl(manager.id, manager.avatar)"
              :alt="manager.name"
            />
            <span>{{ manager.name }}</span>
          </div>
        </div>
        <div class="transfer-actions">
          <button @click="showTransferModal = false" class="cancel-btn">
            Hủy
          </button>
          <button
            @click="confirmTransfer"
            class="confirm-btn"
            :disabled="!selectedManagerId || transferring"
          >
            <i v-if="transferring" class="fa-solid fa-spinner fa-spin"></i>
            <span v-else>Xác nhận</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { useSupportChatStore } from '../stores/supportChatStore';
import { useAuthStore } from '../stores/auth';
import supportApi from '../services/support-api';
import { useMessage } from 'naive-ui';

const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'refresh']);

const message = useMessage();
const supportStore = useSupportChatStore();
const authStore = useAuthStore();

const messageText = ref('');
const messages = ref([]);
const messagesContainer = ref(null);
const sending = ref(false);
const loading = ref(false);
const resolving = ref(false);
const transferring = ref(false);
let messagePollingInterval = null;

const showTransferModal = ref(false);
const availableManagers = ref([]);
const selectedManagerId = ref(null);

const backendUrl = 'http://127.0.0.1:8000';

const getAvatarUrl = (userId, avatar) => {
  if (!avatar) return 'https://picsum.photos/50';

  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  return `${backendUrl}/storage/avatars/${userId}/${avatar}`;
};

const supportAvatar = computed(() => '/image/ST.jpg');

const canReply = computed(() => {
  return (
    props.conversation.status === 'active' &&
    (props.conversation.assigned_to === authStore.user.id || authStore.isAdmin)
  );
});

const canTransfer = computed(() => {
  return (
    props.conversation.status === 'active' &&
    (props.conversation.assigned_to === authStore.user.id || authStore.isAdmin)
  );
});

const canResolve = computed(() => {
  return (
    props.conversation.status === 'active' &&
    (props.conversation.assigned_to === authStore.user.id || authStore.isAdmin)
  );
});

const loadMessages = async () => {
  loading.value = true;
  try {
    const response = await supportApi.getConversationMessages(
      props.conversation.id
    );

    if (response.data.messages) {
      messages.value = response.data.messages;
    }

    scrollToBottom();
  } catch (error) {
    console.error('Error loading messages:', error);
  } finally {
    loading.value = false;
  }
};

const sendMessage = async () => {
  if (!messageText.value.trim() || sending.value) return;

  const text = messageText.value.trim();
  messageText.value = '';
  sending.value = true;

  try {
    const response = await supportStore.sendManagerMessage(
      props.conversation.id,
      text
    );

    const exists = messages.value.find((m) => m.id === response.id);

    if (!exists) {
      messages.value.push(response);
    }

    scrollToBottom();

    await supportApi.markAsReadByManager(props.conversation.id);
  } catch (error) {
    console.error('Error sending message:', error);
    message.error('Không thể gửi tin nhắn');
    messageText.value = text;
  } finally {
    sending.value = false;
  }
};

const resolveConversation = async () => {
  if (resolving.value) return;

  resolving.value = true;
  try {
    await supportStore.resolveConversation(props.conversation.id);
    message.success('Đã đánh dấu đã giải quyết');
    emit('refresh');
    emit('close');
  } catch (error) {
    console.error('Error resolving conversation:', error);
    message.error('Không thể đánh dấu đã giải quyết');
  } finally {
    resolving.value = false;
  }
};

const loadManagers = async () => {
  try {
    const response = await supportApi.getManagers();
    availableManagers.value = response.data.managers.filter(
      (m) => m.id !== props.conversation.assigned_to
    );
  } catch (error) {
    console.error('Error loading managers:', error);
  }
};

const confirmTransfer = async () => {
  if (!selectedManagerId.value || transferring.value) return;

  transferring.value = true;
  try {
    await supportStore.transferConversation(
      props.conversation.id,
      selectedManagerId.value
    );
    message.success('Đã chuyển tiếp cuộc hội thoại');
    showTransferModal.value = false;
    emit('refresh');
    emit('close');
  } catch (error) {
    console.error('Error transferring conversation:', error);
    message.error('Không thể chuyển tiếp');
  } finally {
    transferring.value = false;
  }
};

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Đang chờ',
    active: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    closed: 'Đã đóng',
  };
  return statusMap[status] || status;
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

const startMessagePolling = () => {
  messagePollingInterval = setInterval(() => {
    loadMessages();
  }, 3000);
};

const stopMessagePolling = () => {
  if (messagePollingInterval) {
    clearInterval(messagePollingInterval);
    messagePollingInterval = null;
  }
};

watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);

onMounted(() => {
  loadMessages();
  loadManagers();
  startMessagePolling();

  if (props.conversation.unread_count > 0) {
    supportApi.markAsReadByManager(props.conversation.id);
  }
});

onUnmounted(() => {
  stopMessagePolling();
});
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

/* ========== CONVERSATION MODAL ========== */
.conversation-modal {
  width: 100%;
  max-width: 750px;
  height: 85vh;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

html.dark-mode .conversation-modal {
  background: #1e1e1e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* ========== MODAL HEADER ========== */
.modal-header {
  padding: 22px 26px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
  flex-shrink: 0;
}

.user-header-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.user-header-details h2 {
  margin: 0;
  font-size: 1.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 5px 14px;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  width: fit-content;
}

.status-badge.pending {
  background: rgba(255, 243, 205, 0.95);
  color: #856404;
}

.status-badge.active {
  background: rgba(209, 236, 241, 0.95);
  color: #0c5460;
}

.status-badge.resolved {
  background: rgba(212, 237, 218, 0.95);
  color: #155724;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.05rem;
}

.action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.resolve {
  background: rgba(76, 175, 80, 0.85);
}

.action-btn.resolve:hover:not(:disabled) {
  background: rgba(76, 175, 80, 1);
}

/* ========== MESSAGES CONTAINER ========== */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

html.dark-mode .messages-container {
  background: #121212;
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

html.dark-mode .messages-container::-webkit-scrollbar-thumb {
  background: #555;
}

.loading-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
}

.loading-messages i {
  font-size: 48px;
  color: #667eea;
}

html.dark-mode .loading-messages i {
  color: #8b9eff;
}

.loading-messages p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

html.dark-mode .loading-messages p {
  color: #aaa;
}

/* ========== MESSAGE ========== */
.message {
  display: flex;
  gap: 10px;
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

.message.support {
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

html.dark-mode .message.user .message-content {
  background: #2a2a2a;
  color: #e0e0e0;
}

.message.support .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-content p {
  margin: 0 0 6px 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.75;
}

/* ========== MESSAGE INPUT ========== */
.message-input-container {
  padding: 18px 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 14px;
}

html.dark-mode .message-input-container {
  background: #1e1e1e;
  border-top-color: #2a2a2a;
}

.message-input {
  flex: 1;
  padding: 13px 18px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  font-size: 0.95rem;
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
  border-color: #667eea;
}

.send-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.05rem;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========== TRANSFER MODAL ========== */
.transfer-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.transfer-modal {
  background: white;
  padding: 26px;
  border-radius: 16px;
  max-width: 440px;
  width: 90%;
}

html.dark-mode .transfer-modal {
  background: #2a2a2a;
}

.transfer-modal h3 {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  color: #333;
}

html.dark-mode .transfer-modal h3 {
  color: #e0e0e0;
}

.transfer-modal p {
  margin: 0 0 18px 0;
  color: #666;
  font-size: 0.95rem;
}

html.dark-mode .transfer-modal p {
  color: #aaa;
}

.managers-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 22px;
  max-height: 320px;
  overflow-y: auto;
}

.managers-list::-webkit-scrollbar {
  width: 6px;
}

.managers-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

html.dark-mode .managers-list::-webkit-scrollbar-thumb {
  background: #555;
}

.manager-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

html.dark-mode .manager-item {
  border-color: #3a3a3a;
}

.manager-item:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

html.dark-mode .manager-item:hover {
  border-color: #8b9eff;
  background: #333333;
}

.manager-item.selected {
  border-color: #667eea;
  background: #e8eaf6;
}

html.dark-mode .manager-item.selected {
  border-color: #8b9eff;
  background: #3a3555;
}

.manager-item img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}

.manager-item span {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

html.dark-mode .manager-item span {
  color: #e0e0e0;
}

.transfer-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #e0e0e0;
  color: #333;
}

html.dark-mode .cancel-btn {
  background: #3a3a3a;
  color: #e0e0e0;
}

.cancel-btn:hover {
  background: #d0d0d0;
}

html.dark-mode .cancel-btn:hover {
  background: #4a4a4a;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.confirm-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 768px) {
  .modal-overlay {
    padding: 15px;
  }

  .conversation-modal {
    max-width: 100%;
    height: 90vh;
    border-radius: 16px;
  }

  .modal-header {
    padding: 18px 20px;
  }

  .user-avatar {
    width: 52px;
    height: 52px;
  }

  .user-header-details h2 {
    font-size: 1.15rem;
  }

  .action-btn {
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }

  .messages-container {
    padding: 20px;
  }

  .message-content {
    max-width: 75%;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }

  .conversation-modal {
    height: 95vh;
    border-radius: 14px;
  }

  .modal-header {
    padding: 16px 18px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .user-info {
    flex: 1;
    min-width: 200px;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    border-width: 2px;
  }

  .user-header-details h2 {
    font-size: 1.05rem;
  }

  .status-badge {
    padding: 4px 12px;
    font-size: 0.75rem;
  }

  .header-actions {
    gap: 6px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
  }

  .messages-container {
    padding: 16px;
    gap: 12px;
  }

  .message-avatar img {
    width: 36px;
    height: 36px;
  }

  .message-content {
    max-width: 80%;
    padding: 10px 14px;
  }

  .message-content p {
    font-size: 0.9rem;
  }

  .message-input-container {
    padding: 14px 16px;
    gap: 10px;
  }

  .message-input {
    padding: 11px 16px;
    font-size: 0.9rem;
  }

  .send-btn {
    width: 46px;
    height: 46px;
  }

  .transfer-modal {
    padding: 22px;
  }

  .transfer-modal h3 {
    font-size: 1.15rem;
  }

  .manager-item {
    padding: 12px;
  }

  .manager-item img {
    width: 40px;
    height: 40px;
  }
}
</style>
