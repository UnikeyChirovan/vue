<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="settings-header">
      <div class="header-content">
        <h1>
          <i class="fas fa-cog me-2"></i>
          Cài Đặt Hệ Thống
        </h1>
        <p>Quản lý cấu hình và tùy chỉnh hệ thống</p>
      </div>
      <button class="save-all-btn" @click="saveAllSettings">
        <i class="fas fa-save me-2"></i>
        Lưu Tất Cả
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
              <label>Email Liên Hệ</label>
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
                <i class="fas fa-upload me-2"></i>
                Tải Logo
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
                <i class="fas fa-upload me-2"></i>
                Tải Favicon
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
          <n-button type="info" size="large" @click="testEmail">
            <i class="fas fa-paper-plane me-2"></i>
            gởi Email Thử Nghiệm
          </n-button>
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
      <n-space>
        <n-button size="large" @click="resetSettings">
          <i class="fas fa-undo me-2"></i>
          Khôi Phục Mặc Định
        </n-button>
        <n-button type="primary" size="large" @click="saveAllSettings">
          <i class="fas fa-save me-2"></i>
          Lưu Thay Đổi
        </n-button>
      </n-space>
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
  // General
  siteName: 'Admin Dashboard',
  contactEmail: 'admin@example.com',
  phone: '0123-456-789',
  address: '',

  // Appearance
  darkMode: false,
  language: 'vi',

  // Security
  twoFactorAuth: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  ipWhitelist: '',

  // Email
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpEmail: '',
  smtpPassword: '',

  // Performance
  cacheEnabled: true,
  cacheDuration: 3600,
  imageCompression: true,
  lazyLoading: true,

  // Maintenance
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
  // TODO: Call API to save settings
  message.success('Đã lưu cài đặt thành công!');
};

const resetSettings = () => {
  message.warning('Đã khôi phục cài đặt mặc định');
  // Reset to default values
};

const testEmail = () => {
  message.info('Đang gởi email thử nghiệm...');
  // TODO: Call API to test email
  setTimeout(() => {
    message.success('Email đã được gởi thành công!');
  }, 2000);
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-settings']);
  // TODO: Load settings from API
});
</script>

<style scoped>
.settings-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* Header */
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.header-content p {
  margin: 0;
  opacity: 0.9;
}

.save-all-btn {
  padding: 12px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.save-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Settings Content */
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title i {
  font-size: 24px;
  color: #667eea;
}

.section-title h3 {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-info label {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  display: block;
  margin-bottom: 4px;
}

.setting-info p {
  font-size: 13px;
  color: #718096;
  margin: 0;
  line-height: 1.5;
}

/* Test Email Section */
.test-email-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* Maintenance Mode */
.danger-zone {
  border: 2px solid #fed7d7;
  background: #fffaf0;
}

.danger-zone .section-title i {
  color: #f56565;
}

.maintenance-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 2px solid #fed7d7;
}

.maintenance-info h4 {
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.maintenance-info p {
  font-size: 14px;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.maintenance-message-box {
  margin-top: 20px;
}

.maintenance-message-box label {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  display: block;
  margin-bottom: 8px;
}

/* Footer */
.settings-footer {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 20px 28px;
  border-radius: 16px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }

  .settings-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .save-all-btn {
    width: 100%;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .maintenance-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .settings-footer {
    padding: 16px;
  }
}
</style>
