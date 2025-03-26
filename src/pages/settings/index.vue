<template>
  <TheHeader />
  <div class="container mt-5 custom-container">
    <h2 class="mb-4 text-center page-title">Cài Đặt Tài Khoản</h2>

    <!-- Tùy chỉnh giao diện -->
    <div class="card shadow-sm mb-4 rounded">
      <div class="card-header font-weight-bold">Tùy Chỉnh Giao Diện</div>
      <div class="card-body d-flex align-items-center justify-content-center">
      <span class="font-weight-bold mr-3 me-4" style="font-size: 17px;">Chế độ tối</span>
        <n-switch v-model:value="isDarkMode" @update:value="toggleTheme" />
      </div>
    </div>

    <!-- Đăng xuất tất cả tài khoản -->
    <div class="card shadow-sm mb-4 rounded">
      <div class="card-header font-weight-bold">Bảo Mật</div>
      <div class="card-body text-center">
        <button class="btn btn-warning px-4 py-2" @click="logoutAllDevices">
          🔒 Đăng xuất khỏi tất cả thiết bị
        </button>
      </div>
    </div>

    <!-- Xóa tài khoản -->
    <div class="card shadow-sm rounded">
      <div class="card-header font-weight-bold text-danger">Xóa Tài Khoản</div>
      <div class="card-body text-center">
        <p class="text-danger font-italic">
          ⚠ Hành động này không thể hoàn tác. Toàn bộ dữ liệu sẽ bị xóa vĩnh viễn.
        </p>
        <button class="btn btn-danger px-4 py-2"  @click="confirmDeleteAccount">
          🗑 Xóa tài khoản
        </button>
      </div>
    </div>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { NSwitch } from 'naive-ui';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import { useAuthStore } from '../../stores/auth';
const auth = useAuthStore();
import { useMessage } from 'naive-ui';
const message = useMessage();


const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

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
    message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!');
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

html, body {
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}

.custom-container {
  max-width: 600px;
  margin: auto;
  color: var(--light-text);
}

.page-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.card {
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--light-bg);
  color: var(--light-text);
}

.card-header {
  font-size: 1.1rem;
  padding: 10px 15px;
  background: #f8f9fa;
}

button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: scale(1.05);
}

/* Áp dụng nền tối toàn bộ trang */
.dark-mode {
  background-color: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

/* Áp dụng cho toàn bộ các thẻ chính */
.dark-mode body,
.dark-mode .container,
.dark-mode .card,
.dark-mode .navbar,
.dark-mode .footer {
  background-color: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

/* Chỉnh màu chữ trên toàn bộ trang */
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

/* Chỉnh màu cho card */
.dark-mode .card {
  background-color: #1e1e1e !important;
  color: var(--dark-text) !important;
}

/* Chỉnh màu cho header */
.dark-mode .card-header {
  background-color: #2a2a2a !important;
  color: var(--dark-text) !important;
}

/* Chỉnh màu cho button */
.dark-mode button {
  background-color: #333 !important;
  color: var(--dark-text) !important;
  border: 1px solid var(--dark-text) !important;
}

/* Chỉnh màu link */
.dark-mode a {
  color: #4da6ff !important;
}
.dark-mode .sidebar,
.dark-mode .sidebar a {
  color: var(--dark-text) !important;
}

/* Bảng dữ liệu */
.dark-mode table {
  background-color: #1e1e1e !important;
  color: var(--dark-text) !important;
}

/* Ô trong bảng */
.dark-mode th,
.dark-mode td {
  background-color: #1e1e1e !important;
  color: var(--dark-text) !important;
  border-color: #444 !important; /* Giảm độ sáng của đường kẻ */
}

/* Chỉnh màu header của bảng */
.dark-mode thead {
  background-color: #2a2a2a !important;
  color: var(--dark-text) !important;
}

/* Chỉnh màu chữ trong sidebar */
.dark-mode .sidebar {
  background-color: #1a1a1a !important;
  color: var(--dark-text) !important;
}

/* Nếu có menu dropdown thì chỉnh luôn */
.dark-mode .dropdown-menu {
  background-color: #2a2a2a !important;
  color: var(--dark-text) !important;
}

</style>