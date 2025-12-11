<template>
  <n-button
    class="chat-button"
    type="primary"
    @click="handleChatClick"
    v-if="showButton"
    :loading="loading"
  >
    <i class="fa-solid fa-comment"></i>
    Nhắn Tin
  </n-button>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/auth';
import apiLinks from '../services/api-links';
import { useMessage } from 'naive-ui';
const message = useMessage();

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
  userName: {
    type: String,
    default: '',
  },
  userAvatar: {
    type: String,
    default: null,
  },
  allowMessage: {
    type: Boolean,
    default: true,
  },
  isFollowing: {
    type: Boolean,
    default: false,
  },
});

const chatStore = useChatStore();
const authStore = useAuthStore();
const loading = ref(false);

// Local state để tránh nút nhấp nháy
const localAllowMessage = ref(props.allowMessage);

// Watch để cập nhật khi prop thay đổi
watch(
  () => props.allowMessage,
  (newVal) => {
    localAllowMessage.value = newVal;
  },
  { immediate: true }
);

// Hiển thị nút chat nếu người dùng cho phép nhắn tin
const showButton = computed(() => {
  return localAllowMessage.value;
});

const handleChatClick = async () => {
  loading.value = true;
  try {
    chatStore.openChat({
      id: props.userId,
      name: props.userName,
      avatar: props.userAvatar,
      online: false,
    });
  } catch (error) {
    console.error('Error opening chat:', error);
    message.error('Không thể mở chat. Vui lòng thử lại.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.chat-button {
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.chat-button:hover {
  background-color: #006bcc;
  transform: translateY(-2px);
}

.chat-button i {
  font-size: 14px;
}
</style>
