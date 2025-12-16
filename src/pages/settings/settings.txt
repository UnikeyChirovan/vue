<template>
  <TheHeader />
  <div class="settings-wrapper">
    <div class="settings-page">
      <div class="header-section">
        <div class="header-icon">
          <i class="fa-solid fa-gear"></i>
        </div>
        <h2 class="header-title">Cài Đặt Tài Khoản</h2>
        <p class="header-subtitle">Tùy chỉnh trải nghiệm của bạn</p>
      </div>

      <n-form class="settings-form">
        <!-- Chế độ tối -->
        <div class="setting-card">
          <div class="setting-content">
            <div class="setting-info">
              <div class="setting-icon theme-icon">
                <i class="fa-solid fa-moon"></i>
              </div>
              <div class="setting-text">
                <label class="setting-label">Chế độ tối</label>
                <p class="setting-description">
                  Bật giao diện tối để bảo vệ mắt
                </p>
              </div>
            </div>
            <n-switch
              v-model:value="isDarkMode"
              @update:value="toggleTheme"
              size="large"
            />
          </div>
        </div>

        <!-- Nút Hỗ Trợ -->
        <div class="setting-card">
          <div class="setting-content">
            <div class="setting-info">
              <div class="setting-icon support-icon">
                <i class="fa-solid fa-headset"></i>
              </div>
              <div class="setting-text">
                <label class="setting-label">Hiện nút Hỗ Trợ</label>
                <p class="setting-description">
                  Hiển thị nút hỗ trợ nhanh trên màn hình
                </p>
              </div>
            </div>
            <n-switch
              v-model:value="isSupportButtonEnabled"
              @update:value="toggleSupportButton"
              size="large"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="section-divider"></div>

        <!-- Đăng xuất khỏi tất cả thiết bị -->
        <div class="action-card warning">
          <div class="action-header">
            <div class="action-icon warning-icon">
              <i class="fa-solid fa-lock"></i>
            </div>
            <div class="action-text">
              <h3>Đăng xuất tất cả thiết bị</h3>
              <p>Đăng xuất khỏi tất cả các thiết bị đã đăng nhập</p>
            </div>
          </div>
          <button
            @click="logoutAllDevices"
            class="action-btn logout-btn"
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fa-solid fa-spinner fa-spin"></i>
            <span v-else>Đăng xuất tất cả</span>
          </button>
        </div>

        <!-- Xóa tài khoản -->
        <div class="action-card danger">
          <div class="action-header">
            <div class="action-icon danger-icon">
              <i class="fa-solid fa-trash-alt"></i>
            </div>
            <div class="action-text">
              <h3>Xóa tài khoản vĩnh viễn</h3>
              <p>Hành động này không thể hoàn tác</p>
            </div>
          </div>
          <button @click="confirmDeleteAccount" class="action-btn delete-btn">
            <span>Xóa tài khoản</span>
          </button>
        </div>

        <!-- Cảnh báo -->
        <div class="warning-banner">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>
            Hành động xóa tài khoản không thể hoàn tác. Toàn bộ dữ liệu sẽ bị
            xóa vĩnh viễn.
          </p>
        </div>
      </n-form>
    </div>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
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
  const html = document.documentElement;

  if (value) {
    html.classList.add('dark-mode');
    html.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.add('light-mode');
    html.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }

  // Emit event để App.vue biết
  window.dispatchEvent(
    new CustomEvent('themeChanged', { detail: value ? 'dark' : 'light' })
  );
};

const toggleSupportButton = (value) => {
  isSupportButtonEnabled.value = value;
  localStorage.setItem('supportButtonEnabled', value ? 'true' : 'false');

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

  const handleToggle = (event) => {
    isSupportButtonEnabled.value = event.detail;
  };

  window.addEventListener('supportButtonToggle', handleToggle);

  onUnmounted(() => {
    window.removeEventListener('supportButtonToggle', handleToggle);
  });
});
</script>

<style scoped>
html,
body {
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}
/* ========== SETTINGS PAGE MODERN DESIGN ========== */
.settings-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

.settings-page {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
}

/* ========== HEADER SECTION ========== */
.header-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 30px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(12, 113, 61, 0.1);
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #0c713d, #0a5a31);
}

.header-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.3);
}

.header-icon i {
  font-size: 36px;
  color: white;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.header-title {
  margin: 0 0 10px 0;
  font-size: 2.2rem;
  color: #0c713d;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.header-subtitle {
  margin: 0;
  font-size: 1.05rem;
  color: #666;
  font-weight: 400;
}

/* ========== SETTINGS FORM ========== */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ========== SETTING CARD ========== */
.setting-card {
  background: white;
  padding: 28px 32px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
}

.setting-card:hover {
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.12);
  transform: translateY(-2px);
  border-left-color: #0c713d;
}

.setting-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.setting-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.theme-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.support-icon {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
}

.setting-text {
  flex: 1;
}

.setting-label {
  display: block;
  font-size: 1.15rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.setting-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* ========== SECTION DIVIDER ========== */
.section-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  margin: 30px 0;
}

/* ========== ACTION CARD ========== */
.action-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.action-card.warning {
  border-left-color: #ff9800;
}

.action-card.danger {
  border-left-color: #f44336;
}

.action-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.action-header {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.warning-icon {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.danger-icon {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
}

.action-text h3 {
  margin: 0 0 6px 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #333;
}

.action-text p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* ========== ACTION BUTTONS (STANDARD STYLE) ========== */
.action-btn {
  flex-shrink: 0;
  padding: 12px 28px;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.action-btn:hover::before {
  width: 300px;
  height: 300px;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn:active {
  transform: translateY(0);
}

.logout-btn {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3);
}

.logout-btn:hover {
  box-shadow: 0 8px 30px rgba(255, 152, 0, 0.4);
}

.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-btn {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  box-shadow: 0 4px 20px rgba(244, 67, 54, 0.3);
}

.delete-btn:hover {
  box-shadow: 0 8px 30px rgba(244, 67, 54, 0.4);
}

/* ========== WARNING BANNER ========== */
.warning-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffe7a0 100%);
  border-radius: 16px;
  border-left: 4px solid #ff9800;
  margin-top: 10px;
}

.warning-banner i {
  font-size: 24px;
  color: #856404;
  flex-shrink: 0;
}

.warning-banner p {
  margin: 0;
  font-size: 0.95rem;
  color: #856404;
  font-weight: 600;
  line-height: 1.5;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .settings-wrapper {
    padding: 70px 20px 50px;
  }

  .header-section {
    padding: 35px 25px;
    margin-bottom: 40px;
  }

  .header-icon {
    width: 70px;
    height: 70px;
  }

  .header-icon i {
    font-size: 32px;
  }

  .header-title {
    font-size: 2rem;
  }

  .setting-card {
    padding: 24px 28px;
  }

  .action-card {
    padding: 26px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .settings-wrapper {
    padding: 60px 15px 40px;
  }

  .header-section {
    padding: 30px 20px;
    margin-bottom: 30px;
    border-radius: 20px;
  }

  .header-icon {
    width: 64px;
    height: 64px;
  }

  .header-icon i {
    font-size: 28px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .setting-card {
    padding: 22px 24px;
    border-radius: 16px;
  }

  .setting-content {
    gap: 16px;
  }

  .setting-icon {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }

  .setting-label {
    font-size: 1.05rem;
  }

  .setting-description {
    font-size: 0.85rem;
  }

  .action-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    gap: 20px;
  }

  .action-header {
    width: 100%;
  }

  .action-icon {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }

  .action-text h3 {
    font-size: 1.05rem;
  }

  .action-text p {
    font-size: 0.85rem;
  }

  .action-btn {
    width: 100%;
    padding: 14px;
    justify-content: center;
  }

  .warning-banner {
    padding: 18px 20px;
    gap: 14px;
  }

  .warning-banner i {
    font-size: 22px;
  }

  .warning-banner p {
    font-size: 0.9rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .settings-wrapper {
    padding: 50px 10px 30px;
  }

  .header-section {
    padding: 25px 18px;
    margin-bottom: 25px;
    border-radius: 16px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .header-icon i {
    font-size: 24px;
  }

  .header-title {
    font-size: 1.6rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .setting-card {
    padding: 20px;
    border-radius: 14px;
  }

  .setting-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .setting-info {
    width: 100%;
  }

  .setting-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .setting-label {
    font-size: 1rem;
  }

  .setting-description {
    font-size: 0.8rem;
  }

  .section-divider {
    margin: 25px 0;
  }

  .action-card {
    padding: 20px;
    border-radius: 16px;
  }

  .action-header {
    gap: 16px;
  }

  .action-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .action-text h3 {
    font-size: 1rem;
  }

  .action-text p {
    font-size: 0.8rem;
  }

  .action-btn {
    padding: 12px 24px;
    font-size: 0.9rem;
  }

  .warning-banner {
    padding: 16px 18px;
    gap: 12px;
    border-radius: 14px;
  }

  .warning-banner i {
    font-size: 20px;
  }

  .warning-banner p {
    font-size: 0.85rem;
  }
}
</style>
