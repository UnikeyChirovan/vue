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
import ChatContainer from './components/ChatContainer.vue';
import { useAuthStore } from './stores/auth';
import { useSupportChatStore } from './stores/supportChatStore';
import SupportChatButton from './components/SupportChatButton.vue';
import SupportChatWindow from './components/SupportChatWindow.vue';
import ToastNotification from './components/ToastNotification.vue';
import { darkTheme } from 'naive-ui';
const naiveTheme = computed(() => {
  return document.documentElement.classList.contains('dark-mode')
    ? darkTheme
    : null;
});
const authStore = useAuthStore();
const supportStore = useSupportChatStore();
const chatStore = useChatStore();

// ========== DARK MODE INITIALIZATION ==========
const initializeDarkMode = () => {
  const savedTheme = localStorage.getItem('theme');
  const html = document.documentElement;

  if (savedTheme === 'dark') {
    html.classList.add('dark-mode');
    html.classList.remove('light-mode');
  } else {
    html.classList.add('light-mode');
    html.classList.remove('dark-mode');
  }
};

// Khởi tạo dark mode ngay lập tức
initializeDarkMode();

onMounted(() => {
  // Đảm bảo theme được apply sau khi DOM mounted
  initializeDarkMode();

  // Lắng nghe sự kiện thay đổi theme từ Settings
  window.addEventListener('themeChanged', (event) => {
    const html = document.documentElement;
    if (event.detail === 'dark') {
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
    }
  });

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

  // Cleanup event listener
  window.removeEventListener('themeChanged', () => {});
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
