<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <n-config-provider>
      <n-message-provider>
        <router-view></router-view>
        <ChatContainer />
        <template v-if="authStore.isLoggedIn">
          <SupportChatButton />
          <SupportChatWindow />
        </template>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import { useChatStore } from './stores/chatStore';
import ChatContainer from './components/ChatContainer.vue';
import { useAuthStore } from './stores/auth';
import { useSupportChatStore } from './stores/supportChatStore';
import SupportChatButton from './components/SupportChatButton.vue';
import SupportChatWindow from './components/SupportChatWindow.vue';
const authStore = useAuthStore();
const supportStore = useSupportChatStore();

const chatStore = useChatStore();
const isDarkMode = ref(false);

onMounted(() => {
  // Kết nối WebSocket khi app mount
  chatStore.connectWebSocket();
  if (authStore.isLoggedIn) {
    // Initialize support chat
    supportStore.subscribeToUserChannel();
    supportStore.loadUnreadCount();
    supportStore.checkSupportOnline();
  }
});

onUnmounted(() => {
  // Ngắt kết nối WebSocket khi app unmount
  chatStore.disconnectWebSocket();
  supportStore.cleanup();
});
</script>
<style>
.n-card-header {
  background-color: rgb(240, 236, 221) !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.n-base-icon {
  position: relative; /* Đảm bảo container có relative để icon được định vị đúng */
}

/* .n-base-icon svg {
  height: 200%;
  width: 200%;
  background-color: red;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
} */
.n-form-item-f.n-form-item.n-form-item-feedback-wrapper {
  min-height: 8px;
}
.error {
  color: red;
  margin-top: -4px !important;
  margin-bottom: 4px !important;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
