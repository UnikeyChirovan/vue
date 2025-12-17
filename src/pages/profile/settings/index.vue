<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1>Cài Đặt Tài Khoản</h1>
      <p>Quản lý thông tin và quyền riêng tư của bạn</p>
    </div>

    <div class="settings-container">
      <!-- 1. Thông tin cá nhân -->
      <div class="settings-card">
        <div class="card-header" @click="toggleSection('personal')">
          <div class="header-left">
            <i class="fas fa-user-circle"></i>
            <div>
              <h2>Thông Tin Cá Nhân</h2>
              <p>Kiểm soát ai có thể xem thông tin của bạn</p>
            </div>
          </div>
          <button class="toggle-btn">
            <i
              :class="
                expanded.personal ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
              "
            ></i>
          </button>
        </div>

        <transition name="expand">
          <div v-show="expanded.personal" class="card-content">
            <div
              v-for="(value, key) in personalInfoFields"
              :key="key"
              class="setting-item"
            >
              <div class="setting-info">
                <i :class="fieldIcons[key]"></i>
                <div>
                  <label>{{ labels[key] }}</label>
                  <span class="setting-description">
                    {{ value ? 'Hiển thị công khai' : 'Ẩn khỏi người khác' }}
                  </span>
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="visibility[key]" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="quick-actions">
              <button @click="toggleAllPersonal(true)" class="quick-action-btn">
                <i class="fas fa-eye"></i> Hiện tất cả
              </button>
              <button
                @click="toggleAllPersonal(false)"
                class="quick-action-btn secondary"
              >
                <i class="fas fa-eye-slash"></i> Ẩn tất cả
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- 2. Tin nhắn & Giao tiếp -->
      <div class="settings-card">
        <div class="card-header" @click="toggleSection('messaging')">
          <div class="header-left">
            <i class="fas fa-comment-dots"></i>
            <div>
              <h2>Tin Nhắn & Giao Tiếp</h2>
              <p>Cài đặt cách bạn nhận và gởi tin nhắn</p>
            </div>
          </div>
          <button class="toggle-btn">
            <i
              :class="
                expanded.messaging ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
              "
            ></i>
          </button>
        </div>

        <transition name="expand">
          <div v-show="expanded.messaging" class="card-content">
            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-envelope-open-text"></i>
                <div>
                  <label>Cho phép nhắn tin</label>
                  <span class="setting-description">
                    {{
                      messagingSettings.allow_messages
                        ? 'Mọi người có thể nhắn tin cho bạn'
                        : 'Chỉ người theo dõi mới có thể nhắn tin'
                    }}
                  </span>
                </div>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="messagingSettings.allow_messages"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-bell"></i>
                <div>
                  <label>Thông báo tin nhắn</label>
                  <span class="setting-description"
                    >Nhận thông báo khi có tin nhắn mới</span
                  >
                </div>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="messagingSettings.notifications"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-volume-up"></i>
                <div>
                  <label>Âm thanh thông báo</label>
                  <span class="setting-description"
                    >Phát âm thanh khi nhận tin nhắn</span
                  >
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="messagingSettings.sound" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-circle"></i>
                <div>
                  <label>Hiển thị trạng thái hoạt động</label>
                  <span class="setting-description"
                    >Cho phép người khác thấy bạn đang online</span
                  >
                </div>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="messagingSettings.show_online_status"
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </transition>
      </div>

      <!-- 3. Quyền riêng tư & Bảo mật -->
      <div class="settings-card">
        <div class="card-header" @click="toggleSection('privacy')">
          <div class="header-left">
            <i class="fas fa-shield-alt"></i>
            <div>
              <h2>Quyền Riêng Tư & Bảo Mật</h2>
              <p>Quản lý ai có thể tương tác với bạn</p>
            </div>
          </div>
          <button class="toggle-btn">
            <i
              :class="
                expanded.privacy ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
              "
            ></i>
          </button>
        </div>

        <transition name="expand">
          <div v-show="expanded.privacy" class="card-content">
            <div class="setting-item clickable" @click="openBlockedModal">
              <div class="setting-info">
                <i class="fas fa-ban"></i>
                <div>
                  <label>Danh sách chặn</label>
                  <span class="setting-description">
                    Quản lý người dùng bị chặn ({{ blockedCount }})
                  </span>
                </div>
              </div>
              <i class="fas fa-chevron-right"></i>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-user-friends"></i>
                <div>
                  <label>Chế độ riêng tư tài khoản</label>
                  <span class="setting-description">
                    {{
                      privacySettings.private_account
                        ? 'Tài khoản riêng tư'
                        : 'Tài khoản công khai'
                    }}
                  </span>
                </div>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="privacySettings.private_account"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-search"></i>
                <div>
                  <label>Cho phép tìm kiếm</label>
                  <span class="setting-description"
                    >Người khác có thể tìm thấy tài khoản của bạn</span
                  >
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="privacySettings.allow_search" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </transition>
      </div>

      <!-- 4. Thông báo -->
      <div class="settings-card">
        <div class="card-header" @click="toggleSection('notifications')">
          <div class="header-left">
            <i class="fas fa-bell"></i>
            <div>
              <h2>Thông Báo</h2>
              <p>Chọn loại thông báo bạn muốn nhận</p>
            </div>
          </div>
          <button class="toggle-btn">
            <i
              :class="
                expanded.notifications
                  ? 'fas fa-chevron-up'
                  : 'fas fa-chevron-down'
              "
            ></i>
          </button>
        </div>

        <transition name="expand">
          <div v-show="expanded.notifications" class="card-content">
            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-heart"></i>
                <div>
                  <label>Lượt thích & Bình luận</label>
                  <span class="setting-description"
                    >Nhận thông báo khi có người thích hoặc bình luận</span
                  >
                </div>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="notificationSettings.likesComments"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-user-plus"></i>
                <div>
                  <label>Người theo dõi mới</label>
                  <span class="setting-description"
                    >Nhận thông báo khi có người theo dõi bạn</span
                  >
                </div>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="notificationSettings.newFollowers"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <i class="fas fa-at"></i>
                <div>
                  <label>Nhắc đến & Tag</label>
                  <span class="setting-description"
                    >Nhận thông báo khi ai đó nhắc đến bạn</span
                  >
                </div>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="notificationSettings.mentions"
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Save Button -->
    <div class="save-section">
      <button @click="saveSettings" class="save-btn" :disabled="saving">
        <i v-if="saving" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-save"></i>
        <span>{{ saving ? 'Đang lưu...' : 'Lưu Tất Cả Thay Đổi' }}</span>
      </button>
    </div>

    <!-- Blocked List Modal -->
    <BlockedListModal ref="blockedModalRef" />
  </div>
</template>

<script setup>
import { useMenuProfile } from '../../../stores/use-menu-profile';
useMenuProfile().onSelectedKey(['profile-settings']);
import { ref, computed, onMounted } from 'vue';
import { useToast } from '../../../stores/useToast';
import api from '../../../services/axiosInterceptor';
import apiLinks from '../../../services/api-links';
import { useAuthStore } from '../../../stores/auth';
import { useProfileStore } from '../../../stores/profile';
import BlockedListModal from '../../../components/BlockedListModal.vue';

const toast = useToast();
const blockedModalRef = ref(null);
const auth = useAuthStore();
const profile = useProfileStore();
const id = auth.user?.id;
const saving = ref(false);

// Expanded sections
const expanded = ref({
  personal: true,
  messaging: true,
  privacy: false,
  notifications: false,
});

// Settings data
const visibility = ref({
  email: true,
  phone_number: true,
  occupation: true,
  biography: true,
  hobbies: true,
  birthday: true,
  gender: true,
  address: true,
});

const messagingSettings = ref({
  allow_messages: true,
  notifications: true,
  sound: true,
  show_online_status: true,
});

const privacySettings = ref({
  private_account: false,
  allow_search: true,
});

const notificationSettings = ref({
  likesComments: true,
  newFollowers: true,
  mentions: true,
});

const blockedCount = ref(0);

// Labels and icons
const labels = {
  email: 'Email',
  phone_number: 'Số điện thoại',
  occupation: 'Nghề nghiệp',
  biography: 'Tiểu sử (Bio)',
  hobbies: 'Sở thích',
  birthday: 'Ngày sinh',
  gender: 'Giới tính',
  address: 'Địa chỉ',
};

const fieldIcons = {
  email: 'fas fa-envelope',
  phone_number: 'fas fa-phone',
  occupation: 'fas fa-briefcase',
  biography: 'fas fa-book',
  hobbies: 'fas fa-heart',
  birthday: 'fas fa-birthday-cake',
  gender: 'fas fa-venus-mars',
  address: 'fas fa-map-marker-alt',
};

const personalInfoFields = computed(() => {
  const fields = {};
  for (const key in visibility.value) {
    fields[key] = visibility.value[key];
  }
  return fields;
});

// Methods
const toggleSection = (section) => {
  expanded.value[section] = !expanded.value[section];
};

const toggleAllPersonal = (state) => {
  for (const key in visibility.value) {
    visibility.value[key] = state;
  }
};

const openBlockedModal = () => {
  blockedModalRef.value.openModal();
};

const loadBlockedCount = async () => {
  try {
    const response = await api.get(`/social/blocked-users`);
    blockedCount.value = response.data.users?.length || 0;
  } catch (error) {
    console.error('Error loading blocked count:', error);
  }
};

onMounted(async () => {
  try {
    // Load visibility settings
    const privacyRes = await api.get(`/private/settings/${id}`);
    visibility.value = privacyRes.data;

    // Load messaging settings
    const messagingRes = await apiLinks.chat.getSettings();
    messagingSettings.value = {
      allow_messages: messagingRes.data.allow_messages,
      notifications: messagingRes.data.notifications,
      sound: messagingRes.data.sound,
      show_online_status: messagingRes.data.show_online_status,
    };

    // Load privacy settings
    try {
      const privacySettingsRes = await apiLinks.profile.getPrivacySettings();
      privacySettings.value = {
        private_account: privacySettingsRes.data.private_account,
        allow_search: privacySettingsRes.data.allow_search,
      };
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }

    // Notification settings
    const savedNotificationSettings = localStorage.getItem(
      'notification_settings'
    );
    if (savedNotificationSettings) {
      notificationSettings.value = JSON.parse(savedNotificationSettings);
    }

    // Load blocked count
    await loadBlockedCount();
  } catch (error) {
    console.error('Error loading settings:', error);
  }
});

const saveSettings = async () => {
  saving.value = true;
  try {
    // Save visibility settings
    await api.post(`/private/settings/${id}`, visibility.value);

    // Save messaging settings
    await apiLinks.chat.updateSettings(messagingSettings.value);

    // Save privacy settings
    await apiLinks.profile.updatePrivacySettings({
      private_account: privacySettings.value.private_account,
      allow_search: privacySettings.value.allow_search,
    });

    // Notification settings
    localStorage.setItem(
      'notification_settings',
      JSON.stringify(notificationSettings.value)
    );

    toast.success('Đã lưu tất cả cài đặt!');

    // Clear cache
    sessionStorage.removeItem('user_profile');
    profile.getProfile(id);
  } catch (error) {
    toast.error('Lỗi khi lưu cài đặt.');
    console.error(error);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.settings-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px 60px;
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
}

html.dark-mode .settings-page {
  background: linear-gradient(180deg, #0a0a0a 0%, #121212 100%);
}

.settings-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.settings-header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 700;
}

.settings-header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

html.dark-mode .settings-card {
  background: #1e1e1e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.settings-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

html.dark-mode .settings-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  cursor: pointer;
  user-select: none;
}

html.dark-mode .card-header {
  background: linear-gradient(135deg, #252525 0%, #2a2a2a 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.header-left > i {
  font-size: 32px;
  color: #667eea;
}

html.dark-mode .header-left > i {
  color: #8b9cf6;
}

.card-header h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
}

html.dark-mode .card-header h2 {
  color: #e0e0e0;
}

.card-header p {
  margin: 0;
  font-size: 13px;
  color: #718096;
}

html.dark-mode .card-header p {
  color: #b0b0b0;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #667eea;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s ease;
}

html.dark-mode .toggle-btn {
  color: #8b9cf6;
}

.toggle-btn:hover {
  transform: scale(1.1);
}

.card-content {
  padding: 20px 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

html.dark-mode .setting-item {
  background: #252525;
}

.setting-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

html.dark-mode .setting-item:hover {
  background: #2a2a2a;
}

.setting-item.clickable {
  cursor: pointer;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.setting-info > i {
  font-size: 20px;
  color: #667eea;
  width: 24px;
  text-align: center;
}

html.dark-mode .setting-info > i {
  color: #8b9cf6;
}

.setting-info label {
  display: block;
  font-weight: 600;
  font-size: 15px;
  color: #2d3748;
  margin-bottom: 2px;
  cursor: pointer;
}

html.dark-mode .setting-info label {
  color: #e0e0e0;
}

.setting-description {
  display: block;
  font-size: 12px;
  color: #718096;
}

html.dark-mode .setting-description {
  color: #b0b0b0;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 28px;
}

html.dark-mode .slider {
  background-color: #444;
}

.slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

html.dark-mode input:checked + .slider {
  background-color: #8b9cf6;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

html.dark-mode .quick-actions {
  border-top-color: #333;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.quick-action-btn.secondary {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.quick-action-btn.secondary:hover {
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
}

/* Save Section */
.save-section {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

html.dark-mode .save-section {
  background: #1e1e1e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 48px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.save-btn::before {
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

.save-btn:hover:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 768px) {
  .settings-page {
    padding: 70px 16px 50px;
  }

  .settings-header {
    padding: 25px 18px;
    margin-bottom: 32px;
  }

  .settings-header h1 {
    font-size: 28px;
  }

  .settings-header p {
    font-size: 15px;
  }

  .card-header {
    padding: 18px 20px;
  }

  .header-left > i {
    font-size: 28px;
  }

  .card-header h2 {
    font-size: 18px;
  }

  .card-content {
    padding: 18px 20px;
  }

  .setting-item {
    padding: 14px;
  }

  .quick-actions {
    flex-direction: column;
  }

  .quick-action-btn {
    width: 100%;
    justify-content: center;
  }

  .save-section {
    padding: 20px;
  }

  .save-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .settings-page {
    padding: 60px 12px 40px;
  }

  .settings-header {
    padding: 22px 16px;
    margin-bottom: 28px;
  }

  .settings-header h1 {
    font-size: 24px;
  }

  .settings-header p {
    font-size: 14px;
  }

  .card-header {
    padding: 16px 18px;
  }

  .header-left {
    gap: 12px;
  }

  .header-left > i {
    font-size: 26px;
  }
  .card-header h2 {
    font-size: 16px;
  }

  .card-header p {
    font-size: 12px;
  }

  .card-content {
    padding: 16px;
  }

  .setting-item {
    padding: 12px;
    margin-bottom: 10px;
  }

  .setting-info {
    gap: 10px;
  }

  .setting-info > i {
    font-size: 18px;
  }

  .setting-info label {
    font-size: 14px;
  }

  .setting-description {
    font-size: 11px;
  }

  .switch {
    width: 46px;
    height: 24px;
  }

  .slider:before {
    width: 18px;
    height: 18px;
    left: 3px;
    bottom: 3px;
  }

  input:checked + .slider:before {
    transform: translateX(22px);
  }

  .save-section {
    padding: 16px;
    margin-top: 24px;
  }

  .save-btn {
    padding: 12px 32px;
    font-size: 15px;
  }
}
</style>
