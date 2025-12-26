<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="settings-header">
      <div class="header-content">
        <h1>
          <i class="fas fa-cog"></i>
          Cài Đặt Hệ Thống
        </h1>
        <p>Quản lý cấu hình và tùy chỉnh hệ thống</p>
      </div>
      <button class="save-all-btn" @click="saveAllSettings">
        <i class="fas fa-save"></i>
        <span>Lưu Tất Cả</span>
      </button>
    </div>

    <!-- Settings Content -->
    <div class="settings-content">
      <!-- General Settings -->
      <div class="settings-section">
        <div class="section-title">
          <i class="fas fa-sliders-h"></i>
          <h3>Cài Đặt Chung</h3>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <div class="setting-info">
              <label>Tên Website</label>
              <p>Hiển thị trên thanh tiêu đề và SEO</p>
            </div>
            <n-input
              v-model:value="settings.siteName"
              placeholder="Nhập tên website"
              size="large"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Email liên lạc</label>
              <p>Email chính để nhận thông tin từ khách hàng</p>
            </div>
            <n-input
              v-model:value="settings.contactEmail"
              placeholder="contact@example.com"
              size="large"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Số Điện Thoại</label>
              <p>Số điện thoại hỗ trợ khách hàng</p>
            </div>
            <n-input
              v-model:value="settings.phone"
              placeholder="0123-456-789"
              size="large"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Địa Chỉ</label>
              <p>Địa chỉ văn phòng hoặc công ty</p>
            </div>
            <n-input
              v-model:value="settings.address"
              type="textarea"
              placeholder="Nhập địa chỉ"
              :rows="2"
            />
          </div>
        </div>
      </div>

      <!-- Appearance Settings -->
      <div class="settings-section">
        <div class="section-title">
          <i class="fas fa-palette"></i>
          <h3>Giao Diện</h3>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <div class="setting-info">
              <label>Chế Độ Tối</label>
              <p>Bật/tắt giao diện tối cho hệ thống</p>
            </div>
            <n-switch v-model:value="settings.darkMode" size="large">
              <template #checked>Bật</template>
              <template #unchecked>Tắt</template>
            </n-switch>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Ngôn Ngữ</label>
              <p>Chọn ngôn ngữ mặc định</p>
            </div>
            <n-select
              v-model:value="settings.language"
              :options="languageOptions"
              size="large"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Logo Website</label>
              <p>Tải lên logo hiển thị trên header</p>
            </div>
            <n-upload action="/api/upload/logo" :max="1" list-type="image-card">
              <n-button size="large">
                <i class="fas fa-upload"></i>
                <span>Tải Logo</span>
              </n-button>
            </n-upload>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Favicon</label>
              <p>Icon hiển thị trên tab trình duyệt</p>
            </div>
            <n-upload
              action="/api/upload/favicon"
              :max="1"
              list-type="image-card"
            >
              <n-button size="large">
                <i class="fas fa-upload"></i>
                <span>Tải Favicon</span>
              </n-button>
            </n-upload>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="settings-section">
        <div class="section-title">
          <i class="fas fa-shield-alt"></i>
          <h3>Bảo Mật</h3>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <div class="setting-info">
              <label>Xác Thực 2 Yếu Tố (2FA)</label>
              <p>Tăng cường bảo mật tài khoản admin</p>
            </div>
            <n-switch v-model:value="settings.twoFactorAuth" size="large">
              <template #checked>Bật</template>
              <template #unchecked>Tắt</template>
            </n-switch>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Thời Gian Hết Phiên (phút)</label>
              <p>Tự động đăng xuất sau thời gian không hoạt động</p>
            </div>
            <n-input-number
              v-model:value="settings.sessionTimeout"
              :min="5"
              :max="120"
              size="large"
              style="width: 100%"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Giới Hạn Đăng Nhập Sai</label>
              <p>Số lần đăng nhập sai trước khi khóa tài khoản</p>
            </div>
            <n-input-number
              v-model:value="settings.maxLoginAttempts"
              :min="3"
              :max="10"
              size="large"
              style="width: 100%"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>IP Whitelist</label>
              <p>Chỉ cho phép truy cập admin từ các IP này</p>
            </div>
            <n-input
              v-model:value="settings.ipWhitelist"
              type="textarea"
              placeholder="192.168.1.1, 192.168.1.2"
              :rows="2"
            />
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div class="settings-section">
        <div class="section-title">
          <i class="fas fa-envelope"></i>
          <h3>Cấu Hình Email</h3>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <div class="setting-info">
              <label>SMTP Host</label>
              <p>Máy chủ gởi email</p>
            </div>
            <n-input
              v-model:value="settings.smtpHost"
              placeholder="smtp.gmail.com"
              size="large"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>SMTP Port</label>
              <p>Cổng kết nối SMTP</p>
            </div>
            <n-input-number
              v-model:value="settings.smtpPort"
              :min="1"
              :max="65535"
              size="large"
              style="width: 100%"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Email gởi</label>
              <p>Địa chỉ email dùng để gởi</p>
            </div>
            <n-input
              v-model:value="settings.smtpEmail"
              placeholder="noreply@example.com"
              size="large"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Mật Khẩu Email</label>
              <p>Mật khẩu hoặc App Password</p>
            </div>
            <n-input
              v-model:value="settings.smtpPassword"
              type="password"
              placeholder="••••••••"
              size="large"
              show-password-on="click"
            />
          </div>
        </div>

        <div class="test-email-section">
          <button class="test-email-btn" @click="testEmail">
            <i class="fas fa-paper-plane"></i>
            <span>gởi Email Thử Nghiệm</span>
          </button>
        </div>
      </div>

      <!-- Performance Settings -->
      <div class="settings-section">
        <div class="section-title">
          <i class="fas fa-tachometer-alt"></i>
          <h3>Hiệu Suất</h3>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <div class="setting-info">
              <label>Cache</label>
              <p>Bật cache để tăng tốc độ tải trang</p>
            </div>
            <n-switch v-model:value="settings.cacheEnabled" size="large">
              <template #checked>Bật</template>
              <template #unchecked>Tắt</template>
            </n-switch>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Thời Gian Cache (giây)</label>
              <p>Thời gian lưu trữ cache</p>
            </div>
            <n-input-number
              v-model:value="settings.cacheDuration"
              :min="60"
              :max="86400"
              size="large"
              style="width: 100%"
            />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Nén Ảnh</label>
              <p>Tự động nén ảnh khi tải lên</p>
            </div>
            <n-switch v-model:value="settings.imageCompression" size="large">
              <template #checked>Bật</template>
              <template #unchecked>Tắt</template>
            </n-switch>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Lazy Loading</label>
              <p>Tải hình ảnh khi người dùng cuộn đến</p>
            </div>
            <n-switch v-model:value="settings.lazyLoading" size="large">
              <template #checked>Bật</template>
              <template #unchecked>Tắt</template>
            </n-switch>
          </div>
        </div>
      </div>

      <!-- Maintenance Mode -->
      <div class="settings-section danger-zone">
        <div class="section-title">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Chế Độ Bảo Trì</h3>
        </div>
        <div class="maintenance-controls">
          <div class="maintenance-info">
            <h4>Kích Hoạt Chế Độ Bảo Trì</h4>
            <p>
              Website sẽ hiển thị trang bảo trì cho tất cả người dùng (trừ
              admin). Sử dụng khi cần cập nhật hệ thống.
            </p>
          </div>
          <div class="maintenance-actions">
            <n-switch
              v-model:value="settings.maintenanceMode"
              size="large"
              :checked-value="true"
              :unchecked-value="false"
            >
              <template #checked>
                <span style="color: #fff">Đang Bảo Trì</span>
              </template>
              <template #unchecked>Hoạt Động</template>
            </n-switch>
          </div>
        </div>

        <div v-if="settings.maintenanceMode" class="maintenance-message-box">
          <label>Thông Báo Bảo Trì</label>
          <n-input
            v-model:value="settings.maintenanceMessage"
            type="textarea"
            placeholder="Website đang trong quá trình bảo trì..."
            :rows="3"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="settings-footer">
      <button class="reset-button" @click="resetSettings">
        <i class="fas fa-undo"></i>
        <span>Khôi Phục Mặc Định</span>
      </button>
      <button class="save-button" @click="saveAllSettings">
        <i class="fas fa-save"></i>
        <span>Lưu Thay Đổi</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  NInput,
  NInputNumber,
  NSwitch,
  NSelect,
  NButton,
  NSpace,
  NUpload,
  useMessage,
} from 'naive-ui';
import { useMenu } from '../../../stores/use-menu';

const message = useMessage();

const settings = ref({
  siteName: 'Admin Dashboard',
  contactEmail: 'admin@example.com',
  phone: '0123-456-789',
  address: '',
  darkMode: false,
  language: 'vi',
  twoFactorAuth: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  ipWhitelist: '',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpEmail: '',
  smtpPassword: '',
  cacheEnabled: true,
  cacheDuration: 3600,
  imageCompression: true,
  lazyLoading: true,
  maintenanceMode: false,
  maintenanceMessage:
    'Website đang trong quá trình bảo trì. Vui lòng quay lại sau!',
});

const languageOptions = [
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' },
];

const saveAllSettings = () => {
  message.success('Đã lưu cài đặt thành công!');
};

const resetSettings = () => {
  message.warning('Đã khôi phục cài đặt mặc định');
};

const testEmail = () => {
  message.info('Đang gởi email thử nghiệm...');
  setTimeout(() => {
    message.success('Email đã được gởi thành công!');
  }, 2000);
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-settings']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.dark-mode .settings-page {
  background: linear-gradient(135deg, var(--dark-bg-primary) 0%, #121212 100%);
}

/* ========== HEADER ========== */
.settings-header {
  max-width: 1400px;
  margin: 0 auto 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 40px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 40px rgba(12, 113, 61, 0.3);
}

.dark-mode .settings-header {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
  box-shadow: 0 10px 40px rgba(12, 113, 61, 0.5);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  letter-spacing: 0.5px;
}

.dark-mode .header-content h1 {
  color: white;
}

.header-content h1 i {
  font-size: 2.2rem;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.header-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.dark-mode .header-content p {
  color: rgba(255, 255, 255, 0.9);
}

.save-all-btn {
  background: white;
  color: #0c713d;
  border: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.dark-mode .save-all-btn {
  background: var(--dark-bg-elevated);
  color: var(--dark-accent-green-light);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.save-all-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(12, 113, 61, 0.1);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.dark-mode .save-all-btn::before {
  background: rgba(12, 113, 61, 0.3);
}

.save-all-btn:hover::before {
  width: 300px;
  height: 300px;
}

.save-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.4);
}

.dark-mode .save-all-btn:hover {
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
  background: var(--dark-bg-card);
}

.save-all-btn:active {
  transform: translateY(0);
}

/* ========== SETTINGS CONTENT ========== */
.settings-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  background: white;
  border-radius: 20px;
  padding: 35px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  transition: all 0.3s ease;
}

.dark-mode .settings-section {
  background: var(--dark-bg-card);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border-color: var(--dark-border);
}

.settings-section:hover {
  box-shadow: 0 12px 40px rgba(12, 113, 61, 0.12);
}

.dark-mode .settings-section:hover {
  box-shadow: 0 12px 40px rgba(12, 113, 61, 0.3);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(12, 113, 61, 0.1);
}

.dark-mode .section-title {
  border-bottom-color: var(--dark-border);
}

.section-title i {
  font-size: 1.5rem;
  color: #0c713d;
}

.dark-mode .section-title i {
  color: var(--dark-accent-green-light);
}

.section-title h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.dark-mode .section-title h3 {
  color: var(--dark-text-primary);
}

/* ========== SETTINGS GRID ========== */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-info label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.dark-mode .setting-info label {
  color: var(--dark-text-primary);
}

.setting-info p {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
  line-height: 1.5;
}

.dark-mode .setting-info p {
  color: var(--dark-text-secondary);
}

/* ========== INPUT STYLING ========== */
.setting-item :deep(.n-input),
.setting-item :deep(.n-input-number),
.setting-item :deep(.n-select) {
  border-radius: 12px;
}

.setting-item :deep(.n-input__input-el),
.setting-item :deep(.n-input__textarea-el) {
  border: 2px solid #ddd;
  transition: all 0.3s ease;
}

.dark-mode .setting-item :deep(.n-input__input-el),
.dark-mode .setting-item :deep(.n-input__textarea-el) {
  background-color: var(--dark-bg-elevated);
  border-color: var(--dark-border);
  color: var(--dark-text-primary);
}

.setting-item :deep(.n-input--focus .n-input__input-el),
.setting-item :deep(.n-input--focus .n-input__textarea-el) {
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

.dark-mode .setting-item :deep(.n-input--focus .n-input__input-el),
.dark-mode .setting-item :deep(.n-input--focus .n-input__textarea-el) {
  border-color: var(--dark-accent-green);
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.2);
  background-color: var(--dark-bg-card);
}

/* ========== TEST EMAIL SECTION ========== */
.test-email-section {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid rgba(12, 113, 61, 0.1);
}

.dark-mode .test-email-section {
  border-top-color: var(--dark-border);
}

.test-email-btn {
  background: linear-gradient(135deg, #2196f3 0%, #1565c0 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.dark-mode .test-email-btn {
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.4);
}

.test-email-btn::before {
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

.test-email-btn:hover::before {
  width: 300px;
  height: 300px;
}

.test-email-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(33, 150, 243, 0.4);
}

.dark-mode .test-email-btn:hover {
  box-shadow: 0 8px 30px rgba(33, 150, 243, 0.6);
}

.test-email-btn:active {
  transform: translateY(0);
}

/* ========== DANGER ZONE ========== */
.danger-zone {
  border: 2px solid #fed7d7;
  background: linear-gradient(135deg, #fff5f5 0%, #fffaf0 100%);
}

.dark-mode .danger-zone {
  border-color: rgba(244, 67, 54, 0.3);
  background: linear-gradient(
    135deg,
    rgba(51, 26, 26, 0.4) 0%,
    rgba(51, 38, 0, 0.4) 100%
  );
}

.danger-zone .section-title i {
  color: #f56565;
}

.dark-mode .danger-zone .section-title i {
  color: var(--dark-accent-red-light);
}

.maintenance-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: white;
  border-radius: 16px;
  border: 2px solid #fed7d7;
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.1);
}

.dark-mode .maintenance-controls {
  background: var(--dark-bg-elevated);
  border-color: rgba(244, 67, 54, 0.3);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
}

.maintenance-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.dark-mode .maintenance-info h4 {
  color: var(--dark-text-primary);
}

.maintenance-info p {
  font-size: 0.95rem;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.dark-mode .maintenance-info p {
  color: var(--dark-text-secondary);
}

.maintenance-message-box {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
}

.dark-mode .maintenance-message-box {
  background: var(--dark-bg-elevated);
}

.maintenance-message-box label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 10px;
}

.dark-mode .maintenance-message-box label {
  color: var(--dark-text-primary);
}

/* ========== FOOTER ========== */
.settings-footer {
  max-width: 1400px;
  margin: 24px auto 0;
  background: white;
  padding: 25px 40px;
  border-radius: 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.dark-mode .settings-footer {
  background: var(--dark-bg-card);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

.reset-button,
.save-button {
  border: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.reset-button::before,
.save-button::before {
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

.reset-button:hover::before,
.save-button:hover::before {
  width: 300px;
  height: 300px;
}

.reset-button {
  background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(113, 128, 150, 0.3);
}

.dark-mode .reset-button {
  box-shadow: 0 4px 20px rgba(113, 128, 150, 0.4);
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(113, 128, 150, 0.4);
}

.dark-mode .reset-button:hover {
  box-shadow: 0 8px 30px rgba(113, 128, 150, 0.6);
}

.save-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
}

.dark-mode .save-button {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.5);
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.dark-mode .save-button:hover {
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.6);
}

.reset-button:active,
.save-button:active {
  transform: translateY(0);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .settings-page {
    padding: 30px 15px;
  }

  .settings-header {
    padding: 25px 30px;
  }

  .header-content h1 {
    font-size: 1.7rem;
  }

  .header-content h1 i {
    font-size: 1.9rem;
  }

  .settings-section {
    padding: 30px 30px;
  }

  .settings-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .settings-page {
    padding: 20px 10px;
  }

  .settings-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: 20px 20px;
  }

  .header-content h1 {
    font-size: 1.4rem;
  }

  .header-content h1 i {
    font-size: 1.6rem;
  }

  .header-content p {
    font-size: 0.9rem;
  }

  .save-all-btn {
    width: 100%;
    justify-content: center;
    padding: 12px 24px;
  }

  .settings-section {
    padding: 25px 20px;
    border-radius: 16px;
  }

  .section-title {
    margin-bottom: 25px;
    padding-bottom: 15px;
  }

  .section-title h3 {
    font-size: 1.2rem;
  }

  .settings-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .maintenance-controls {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }

  .settings-footer {
    flex-direction: column;
    padding: 20px;
  }

  .reset-button,
  .save-button {
    width: 100%;
    justify-content: center;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .settings-page {
    padding: 15px 8px;
  }

  .settings-header {
    padding: 15px;
    border-radius: 12px;
  }

  .header-content h1 {
    font-size: 1.2rem;
  }

  .header-content h1 i {
    font-size: 1.4rem;
  }

  .header-content p {
    font-size: 0.85rem;
  }

  .save-all-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .settings-section {
    padding: 20px 15px;
    border-radius: 12px;
  }

  .section-title i {
    font-size: 1.3rem;
  }

  .section-title h3 {
    font-size: 1.1rem;
  }

  .setting-info label {
    font-size: 0.95rem;
  }

  .setting-info p {
    font-size: 0.85rem;
  }

  .test-email-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .maintenance-controls {
    padding: 15px;
  }

  .maintenance-info h4 {
    font-size: 1rem;
  }

  .maintenance-info p {
    font-size: 0.85rem;
  }

  .settings-footer {
    padding: 15px;
  }

  .reset-button,
  .save-button {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}
</style>
