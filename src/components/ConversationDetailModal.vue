<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="conversation-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="user-info">
          <img
            :src="getAvatarUrl(conversation.user.id, conversation.user.avatar)"
            :alt="conversation.user.name"
            class="user-avatar"
          />
          <div>
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

      <!-- Messages -->
      <div class="messages-container" ref="messagesContainer">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message', msg.sender_type === 'user' ? 'user' : 'support']"
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

      <!-- Input (chỉ hiện khi đã claim và chưa resolved) -->
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
          <i class="fa-solid fa-paper-plane"></i>
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
import { ref, computed, onMounted, nextTick, watch } from 'vue';
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

// Transfer modal
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
// const supportAvatar =
//   'https://ui-avatars.com/api/?name=Support+Team&background=667eea&color=fff';
const supportAvatar = computed(() => {
  return '/image/ST.jpg';
});
// Computed
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

// Methods
const loadMessages = async () => {
  loading.value = true;
  try {
    const response = await supportApi.getConversations('my_active');
    const conv = response.data.conversations.find(
      (c) => c.id === props.conversation.id
    );
    if (conv && conv.messages) {
      messages.value = conv.messages;
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

    messages.value.push(response);
    scrollToBottom();

    // Mark as read
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
    // Loại bỏ manager hiện tại
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

// Watch for new messages
watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);

onMounted(() => {
  loadMessages();
  loadManagers();

  // Mark as read when opened
  if (props.conversation.unread_count > 0) {
    supportApi.markAsReadByManager(props.conversation.id);
  }
});
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

.conversation-modal {
  width: 90vw;
  max-width: 700px;
  height: 80vh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
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
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid white;
}

.user-info h2 {
  margin: 0 0 6px 0;
  font-size: 20px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.pending {
  background: rgba(255, 243, 205, 0.9);
  color: #856404;
}

.status-badge.active {
  background: rgba(209, 236, 241, 0.9);
  color: #0c5460;
}

.status-badge.resolved {
  background: rgba(212, 237, 218, 0.9);
  color: #155724;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.action-btn.resolve {
  background: rgba(76, 175, 80, 0.8);
}

.action-btn.resolve:hover {
  background: rgba(76, 175, 80, 1);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
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

.message.support {
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message.support .message-content {
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

.message-input-container {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #667eea;
}

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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

/* Transfer Modal */
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
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
}

.transfer-modal h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
}

.transfer-modal p {
  margin: 0 0 16px 0;
  color: #666;
}

.managers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.manager-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.manager-item:hover {
  border-color: #667eea;
  background: #f5f5f5;
}

.manager-item.selected {
  border-color: #667eea;
  background: #e8eaf6;
}

.manager-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.transfer-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.cancel-btn {
  background: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  opacity: 0.8;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
