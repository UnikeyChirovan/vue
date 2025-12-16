<template>
  <div>
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

/* Existing styles */
html.light-mode .n-card-header {
  background-color: rgb(240, 236, 221) !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.n-base-icon {
  position: relative;
}

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
