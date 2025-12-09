<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1>Cài Đặt Tài Khoản</h1>
      <p>Quản lý thông tin và quyền riêng tư của bạn</p>
    </div>

    <div class="settings-container">
      <!-- 1. Thông tin cá nhân -->
      <div class="settings-card">
        <div class="card-header">
          <div class="header-left">
            <i class="fas fa-user-circle"></i>
            <div>
              <h2>Thông Tin Cá Nhân</h2>
              <p>Kiểm soát ai có thể xem thông tin của bạn</p>
            </div>
          </div>
          <n-button text @click="toggleSection('personal')" class="toggle-btn">
            <i
              :class="
                expanded.personal ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
              "
            ></i>
          </n-button>
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
              <n-switch v-model:value="visibility[key]" />
            </div>

            <div class="quick-actions">
              <n-button @click="toggleAllPersonal(true)" size="small" secondary>
                <i class="fas fa-eye"></i> Hiện tất cả
              </n-button>
              <n-button
                @click="toggleAllPersonal(false)"
                size="small"
                secondary
              >
                <i class="fas fa-eye-slash"></i> Ẩn tất cả
              </n-button>
            </div>
          </div>
        </transition>
      </div>

      <!-- 2. Tin nhắn & Giao tiếp -->
      <div class="settings-card">
        <div class="card-header">
          <div class="header-left">
            <i class="fas fa-comment-dots"></i>
            <div>
              <h2>Tin Nhắn & Giao Tiếp</h2>
              <p>Cài đặt cách bạn nhận và gửi tin nhắn</p>
            </div>
          </div>
          <n-button text @click="toggleSection('messaging')" class="toggle-btn">
            <i
              :class="
                expanded.messaging ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
              "
            ></i>
          </n-button>
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
              <n-switch v-model:value="messagingSettings.allow_messages" />
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
              <n-switch v-model:value="messagingSettings.notifications" />
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
              <n-switch v-model:value="messagingSettings.sound" />
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
              <n-switch v-model:value="messagingSettings.show_online_status" />
            </div>
          </div>
        </transition>
      </div>

      <!-- 3. Quyền riêng tư & Bảo mật -->
      <div class="settings-card">
        <div class="card-header">
          <div class="header-left">
            <i class="fas fa-shield-alt"></i>
            <div>
              <h2>Quyền Riêng Tư & Bảo Mật</h2>
              <p>Quản lý ai có thể tương tác với bạn</p>
            </div>
          </div>
          <n-button text @click="toggleSection('privacy')" class="toggle-btn">
            <i
              :class="
                expanded.privacy ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
              "
            ></i>
          </n-button>
        </div>

        <transition name="expand">
          <div v-show="expanded.privacy" class="card-content">
            <div class="setting-item" @click="openBlockedModal">
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
                      privacySettings.privateAccount
                        ? 'Tài khoản riêng tư'
                        : 'Tài khoản công khai'
                    }}
                  </span>
                </div>
              </div>
              <n-switch v-model:value="privacySettings.privateAccount" />
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
              <n-switch v-model:value="privacySettings.allowSearch" />
            </div>
          </div>
        </transition>
      </div>

      <!-- 4. Thông báo -->
      <div class="settings-card">
        <div class="card-header">
          <div class="header-left">
            <i class="fas fa-bell"></i>
            <div>
              <h2>Thông Báo</h2>
              <p>Chọn loại thông báo bạn muốn nhận</p>
            </div>
          </div>
          <n-button
            text
            @click="toggleSection('notifications')"
            class="toggle-btn"
          >
            <i
              :class="
                expanded.notifications
                  ? 'fas fa-chevron-up'
                  : 'fas fa-chevron-down'
              "
            ></i>
          </n-button>
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
              <n-switch v-model:value="notificationSettings.likesComments" />
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
              <n-switch v-model:value="notificationSettings.newFollowers" />
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
              <n-switch v-model:value="notificationSettings.mentions" />
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Save Button -->
    <div class="save-section">
      <n-button
        type="primary"
        @click="saveSettings"
        class="save-btn"
        size="large"
        :loading="saving"
      >
        <i class="fas fa-save"></i>
        Lưu Tất Cả Thay Đổi
      </n-button>
    </div>

    <!-- Blocked List Modal -->
    <BlockedListModal ref="blockedModalRef" />
  </div>
</template>

<script setup>
import { useMenuProfile } from '../../../stores/use-menu-profile';
useMenuProfile().onSelectedKey(['profile-settings']);
import { ref, computed, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import api from '../../../services/axiosInterceptor';
import apiLinks from '../../../services/api-links';
import { useAuthStore } from '../../../stores/auth';
import { useProfileStore } from '../../../stores/profile';
import BlockedListModal from '../../../components/BlockedListModal.vue';

const blockedModalRef = ref(null);
const auth = useAuthStore();
const profile = useProfileStore();
const id = auth.user?.id;
const message = useMessage();
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
  privateAccount: false,
  allowSearch: true,
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

    // Load privacy settings từ database (THAY ĐỔI Ở ĐÂY)
    try {
      const privacySettingsRes = await apiLinks.profile.getPrivacySettings();
      privacySettings.value = {
        private_account: privacySettingsRes.data.private_account,
        allow_search: privacySettingsRes.data.allow_search,
      };
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }

    // Notification settings vẫn dùng localStorage tạm thời
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

    // Save privacy settings vào database (THAY ĐỔI Ở ĐÂY)
    await apiLinks.profile.updatePrivacySettings({
      private_account: privacySettings.value.private_account,
      allow_search: privacySettings.value.allow_search,
    });

    // Notification settings vẫn lưu localStorage tạm thời
    localStorage.setItem(
      'notification_settings',
      JSON.stringify(notificationSettings.value)
    );

    message.success('Đã lưu tất cả cài đặt!');

    // Clear cache
    sessionStorage.removeItem('user_profile');
    profile.getProfile(id);
  } catch (error) {
    message.error('Lỗi khi lưu cài đặt.');
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
  padding: 20px;
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

.settings-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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

.card-header h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
}

.card-header p {
  margin: 0;
  font-size: 13px;
  color: #718096;
}

.toggle-btn {
  color: #667eea;
  font-size: 20px;
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

.setting-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item.highlighted {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border: 2px solid rgba(102, 126, 234, 0.3);
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

.setting-info label {
  display: block;
  font-weight: 600;
  font-size: 15px;
  color: #2d3748;
  margin-bottom: 2px;
}

.setting-description {
  display: block;
  font-size: 12px;
  color: #718096;
}

.quick-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.save-section {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 48px;
  border-radius: 28px;
  font-weight: 600;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
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
</style>
