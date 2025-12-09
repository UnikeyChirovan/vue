<template>
  <TheHeader />
  <div class="settings-page">
    <div class="header">
      <h2>Cài Đặt Tài Khoản</h2>
    </div>

    <n-form>
      <!-- Chế độ tối -->
      <div class="form-item">
        <label class="form-label theme-label">Chế độ tối:</label>
        <n-switch v-model:value="isDarkMode" @update:value="toggleTheme" />
      </div>

      <!-- Nút Hỗ Trợ -->
      <div class="form-item">
        <label class="form-label support-label">Hiện nút Hỗ Trợ:</label>
        <n-switch
          v-model:value="isSupportButtonEnabled"
          @update:value="toggleSupportButton"
        />
      </div>

      <!-- Đăng xuất khỏi tất cả thiết bị -->
      <div class="button-wrapper">
        <n-button type="warning" @click="logoutAllDevices" class="logout-btn">
          🔒 Đăng xuất tất cả
        </n-button>
      </div>

      <!-- Xóa tài khoản -->
      <div class="button-wrapper">
        <n-button type="error" @click="confirmDeleteAccount" class="delete-btn">
          🗑 Xóa tài khoản
        </n-button>
      </div>

      <!-- Cảnh báo -->
      <div class="warning-message">
        <p>
          ⚠ Hành động xóa tài khoản này không thể hoàn tác. Toàn bộ dữ liệu sẽ
          bị xóa vĩnh viễn.
        </p>
      </div>
    </n-form>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { NSwitch } from 'naive-ui';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import { useAuthStore } from '../../stores/auth';
import { useMessage } from 'naive-ui';

const auth = useAuthStore();
const message = useMessage();

const isDarkMode = ref(localStorage.getItem('theme') === 'dark');
const isSupportButtonEnabled = ref(
  localStorage.getItem('supportButtonEnabled') !== 'false'
);

const applyTheme = async (dark) => {
  const html = document.documentElement;
  if (dark) {
    html.classList.add('dark-mode');
    html.classList.remove('light-mode');
  } else {
    html.classList.add('light-mode');
    html.classList.remove('dark-mode');
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  await nextTick();
};

const toggleTheme = (value) => {
  isDarkMode.value = value;
  applyTheme(value);
};

const toggleSupportButton = (value) => {
  isSupportButtonEnabled.value = value;
  localStorage.setItem('supportButtonEnabled', value ? 'true' : 'false');

  // Trigger event để component button lắng nghe
  window.dispatchEvent(
    new CustomEvent('supportButtonToggle', { detail: value })
  );

  if (value) {
    message.success('Đã bật nút Hỗ Trợ');
  } else {
    message.info('Đã tắt nút Hỗ Trợ');
  }
};

const isLoading = ref(false);

const logoutAllDevices = async () => {
  if (!auth.accessToken) {
    message.warning('Bạn chưa đăng nhập!');
    return;
  }

  isLoading.value = true;

  try {
    await auth.superForceLogout();
    message.success('Bạn đã đăng xuất khỏi tất cả thiết bị!');
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    message.error(
      error.response?.data?.message ||
        'Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!'
    );
  } finally {
    isLoading.value = false;
  }
};

const confirmDeleteAccount = async () => {
  if (confirm('Bạn có chắc chắn muốn xóa tài khoản vĩnh viễn?')) {
    try {
      await auth.selfDeleteAccount();
      message.success('Tài khoản của bạn đã bị xóa vĩnh viễn!');
    } catch (errorMessage) {
      message.error(errorMessage);
    }
  }
};

onMounted(() => {
  applyTheme(isDarkMode.value);
});
</script>

<style>
:root {
  --dark-bg: #121212;
  --dark-text: #f1f1f1;
  --light-bg: #ffffff;
  --light-text: #000000;
}

html,
body {
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}

.settings-page {
  width: 100%;
  max-width: 650px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f4f6f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #dee1e5;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  text-align: center;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: black;
  font-weight: 600;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 10px;
}

.form-label {
  flex: 1;
  text-align: left;
  font-weight: 500;
}

.theme-label {
  font-size: 18px;
  font-weight: bold;
  color: teal;
}

.support-label {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.logout-btn,
.delete-btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: orange;
}

.delete-btn:hover {
  background-color: red;
}

.warning-message {
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  color: red;
}

/* Dark mode styles */
.dark-mode {
  background-color: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

.dark-mode body,
.dark-mode .container,
.dark-mode .card,
.dark-mode .navbar,
.dark-mode .footer {
  background-color: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

.dark-mode p,
.dark-mode span,
.dark-mode h1,
.dark-mode h2,
.dark-mode h3,
.dark-mode h4,
.dark-mode h5,
.dark-mode h6,
.dark-mode a,
.dark-mode label,
.dark-mode button {
  color: var(--dark-text) !important;
}

.dark-mode .card {
  background-color: #1e1e1e !important;
  color: var(--dark-text) !important;
}

.dark-mode .card-header {
  background-color: #2a2a2a !important;
  color: var(--dark-text) !important;
}

.dark-mode button {
  background-color: #333 !important;
  color: var(--dark-text) !important;
  border: 1px solid var(--dark-text) !important;
}

.dark-mode a {
  color: #4da6ff !important;
}

.dark-mode .sidebar,
.dark-mode .sidebar a {
  color: var(--dark-text) !important;
}

.dark-mode table {
  background-color: #1e1e1e !important;
  color: var(--dark-text) !important;
}

.dark-mode th,
.dark-mode td {
  background-color: #1e1e1e !important;
  color: var(--dark-text) !important;
  border-color: #444 !important;
}

.dark-mode thead {
  background-color: #2a2a2a !important;
  color: var(--dark-text) !important;
}

.dark-mode .sidebar {
  background-color: #1a1a1a !important;
  color: var(--dark-text) !important;
}

.dark-mode .dropdown-menu {
  background-color: #2a2a2a !important;
  color: var(--dark-text) !important;
}
</style>
