<template>
  <div>
    <ToastNotification ref="toastNotification" />
    <n-config-provider :theme="naiveTheme">
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
import { onMounted, onUnmounted, computed } from 'vue';
import { useChatStore } from './stores/chatStore';
import { useThemeStore } from './stores/themeStore';
import ChatContainer from './components/ChatContainer.vue';
import { useAuthStore } from './stores/auth';
import { useSupportChatStore } from './stores/supportChatStore';
import SupportChatButton from './components/SupportChatButton.vue';
import SupportChatWindow from './components/SupportChatWindow.vue';
import ToastNotification from './components/ToastNotification.vue';
import { darkTheme } from 'naive-ui';

const authStore = useAuthStore();
const supportStore = useSupportChatStore();
const chatStore = useChatStore();
const themeStore = useThemeStore();

// Naive UI theme reactive với theme store
const naiveTheme = computed(() => {
  return themeStore.isDarkMode ? darkTheme : null;
});

onMounted(() => {
  // Khởi tạo theme từ store
  themeStore.initializeTheme();

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
/* Import Dark Mode CSS */
@import './assets/styles/dark-mode.css';

/* #app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
} */
</style>
