<template>
  <div class="auth-wrapper">
    <!-- Not Logged In - Buttons -->
    <div v-if="!auth.isLoggedIn" class="auth-buttons">
      <n-button
        @click="showRegister = true"
        ghost
        class="auth-btn register-btn"
      >
        <i class="fa-solid fa-user-plus me-2"></i>
        <span class="btn-text">Đăng Ký</span>
      </n-button>

      <n-button @click="showLogin = true" ghost class="auth-btn login-btn">
        <i class="fa-solid fa-arrow-right-to-bracket me-2"></i>
        <span class="btn-text">Đăng Nhập</span>
      </n-button>
    </div>

    <!-- Register Modal -->
    <n-modal
      v-model:show="showRegister"
      class="custom-card"
      preset="card"
      :style="modalStyle"
      title="ĐĂNG KÝ TÀI KHOẢN"
      :bordered="false"
      size="small"
      :segmented="segmented"
    >
      <div class="modal-content">
        <div class="switch-auth-section">
          <span class="switch-text">Bạn đã có tài khoản?</span>
          <n-button @click="openLoginModal" type="error" ghost size="small">
            Đăng nhập ngay
          </n-button>
        </div>

        <n-form @submit.prevent="handleRegisterSubmit">
          <div v-for="(field, index) in formFields" :key="index">
            <n-form-item :label="field.label" :for="field.model">
              <component
                :is="field.component"
                v-model:value="users[field.model]"
                :type="field.type || 'text'"
                :id="field.model"
                :placeholder="field.placeholder"
                :allow-clear="field.allowClear"
                v-bind="
                  field.type === 'password'
                    ? { 'show-password-on': 'click' }
                    : {}
                "
              />
            </n-form-item>
            <div v-if="errors[field.model]" class="error-message">
              {{ errors[field.model][0] }}
            </div>
          </div>

          <n-button
            block
            type="primary"
            @click="handleRegisterSubmit"
            :loading="loading"
            html-type="submit"
            class="submit-btn"
          >
            Đăng Ký
          </n-button>
        </n-form>
      </div>
    </n-modal>

    <!-- Login Modal -->
    <n-modal
      v-model:show="showLogin"
      class="custom-card"
      preset="card"
      :style="modalStyle"
      title="ĐĂNG NHẬP TÀI KHOẢN"
      :bordered="false"
      size="small"
      :segmented="segmented"
    >
      <div class="modal-content">
        <div class="switch-auth-section">
          <span class="switch-text">Bạn chưa có tài khoản?</span>
          <n-button @click="openRegisterModal" type="error" ghost size="small">
            Đăng ký ngay
          </n-button>
        </div>

        <n-form
          @submit.prevent="handleLoginSubmit"
          @keyup.enter="handleLoginSubmit"
        >
          <n-form-item label="Username hoặc Email:">
            <n-input
              v-model:value="usernameOrEmail"
              type="text"
              placeholder="Nhập username hoặc email"
            />
          </n-form-item>
          <div v-if="errorsLogin.username_or_email" class="error-message">
            {{ errorsLogin.username_or_email[0] }}
          </div>

          <n-form-item label="Password:">
            <n-input
              v-model:value="password"
              type="password"
              placeholder="Nhập password"
              show-password-on="click"
            />
          </n-form-item>
          <div v-if="errorsLogin.password" class="error-message">
            {{ errorsLogin.password[0] }}
          </div>

          <div class="login-options">
            <n-checkbox v-model:checked="rememberMe"> Remember me </n-checkbox>
            <router-link to="/password-reset-request" class="forgot-password">
              Quên mật khẩu?
            </router-link>
          </div>

          <n-button
            block
            type="primary"
            @click="handleLoginSubmit"
            html-type="submit"
            class="submit-btn"
          >
            Đăng Nhập
          </n-button>
        </n-form>
      </div>
    </n-modal>

    <!-- Logged In - Profile Menu with Dropdown -->
    <div class="profile-section" v-if="auth.isLoggedIn">
      <span class="welcome-text"> Xin chào, {{ auth.user.nickname }} </span>
      <n-dropdown :options="options" @select="handleSelect" trigger="click">
        <n-button type="error" class="profile-btn">
          <i class="fa-regular fa-user"></i>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLoadingStore } from '../stores/loadingStore';
import { h } from 'vue';
import { NIcon } from 'naive-ui';
import {
  Settings as SettingsIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
} from '@vicons/ionicons5';
import apiLinks from '../services/api-links';

const loadingStore = useLoadingStore();
const auth = useAuthStore();
const router = useRouter();
const message = useMessage();

const showRegister = ref(false);
const showLogin = ref(false);
const loading = ref(false);
const errors = ref({});
const errorsLogin = ref({});
const usernameOrEmail = ref('');
const password = ref('');
const rememberMe = ref(false);

const users = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  nickname: '',
  status_id: 5,
  department_id: 2,
});

// Responsive modal width
const modalStyle = computed(() => {
  if (window.innerWidth < 480) return { width: '95%', maxWidth: '400px' };
  if (window.innerWidth < 768) return { width: '90%', maxWidth: '400px' };
  return { width: '400px' };
});

const formFields = [
  {
    label: 'Tên Tài khoản',
    model: 'username',
    component: 'n-input',
    placeholder: 'Tên Tài khoản',
    allowClear: true,
    required: true,
  },
  {
    label: 'Họ và Tên',
    model: 'name',
    component: 'n-input',
    placeholder: 'Họ và Tên',
    allowClear: true,
    required: true,
  },
  {
    label: 'Biệt Danh',
    model: 'nickname',
    component: 'n-input',
    placeholder: 'Tên muốn thể hiện',
    allowClear: true,
    required: true,
  },
  {
    label: 'Email',
    model: 'email',
    component: 'n-input',
    placeholder: 'Email',
    allowClear: true,
    required: true,
  },
  {
    label: 'Mật khẩu',
    model: 'password',
    component: 'n-input',
    placeholder: 'Mật khẩu',
    type: 'password',
    allowClear: true,
    required: true,
  },
  {
    label: 'Xác nhận mật khẩu',
    model: 'password_confirmation',
    component: 'n-input',
    placeholder: 'Xác nhận mật khẩu',
    type: 'password',
    allowClear: true,
    required: true,
  },
];

function handleRegisterSubmit() {
  loading.value = true;
  apiLinks.auth
    .register(users)
    .then((res) => {
      if (res.status === 200) {
        message.success(res.data.message);
        resetRegisterForm();
        closeRegisterModal();
      }
    })
    .catch((err) => {
      if (err.response && err.response.status === 422) {
        errors.value = err.response.data.errors;
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

const handleLoginSubmit = async () => {
  try {
    const response = await apiLinks.auth.login({
      username_or_email: usernameOrEmail.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });

    const accessToken = response.data.access_token;
    const user = response.data.user;
    const isAdmin = response.data.isAdmin;

    auth.login(user, isAdmin, accessToken);

    resetLoginForm();
    closeLoginModal();

    const beforeStatus = localStorage.getItem('Before');
    loadingStore.isDataLoading = true;

    if (beforeStatus) {
      router.push({ name: 'home' });
    } else {
      await loadingStore.fetchDataBeforeLogin();
      loadingStore.isDataLoading = true;
      router.push({ name: 'home' });
    }

    message.success('Đăng nhập thành công!');
    loadingStore.isDataLoading = false;
    loadingStore.fetchDataFinalLogin();
  } catch (error) {
    loadingStore.isDataLoading = false;
    if (error.response) {
      if (error.response.data && error.response.data.errors) {
        errorsLogin.value = error.response.data.errors;
      } else {
        errorsLogin.value = {};
      }
      if (error.response.status === 401) {
        message.warning('Tài khoản hoặc mật khẩu không chính xác');
      } else if (error.response.status === 403) {
        message.error(error.response.data.message);
        resetLoginForm();
        closeLoginModal();
      } else {
        message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } else {
      message.error(
        'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.'
      );
    }
  }
};

function openLoginModal() {
  showRegister.value = false;
  showLogin.value = true;
}

function openRegisterModal() {
  showLogin.value = false;
  showRegister.value = true;
}

function closeRegisterModal() {
  showRegister.value = false;
}

function closeLoginModal() {
  showLogin.value = false;
}

function resetRegisterForm() {
  Object.keys(users).forEach((key) => {
    users[key] = key === 'status_id' ? 5 : key === 'department_id' ? 2 : '';
  });
  errors.value = {};
}

function resetLoginForm() {
  usernameOrEmail.value = '';
  password.value = '';
  errorsLogin.value = {};
}

const segmented = reactive({
  content: true,
  footer: 'soft',
});

function renderIcon(icon) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
}

const options = [
  {
    label: 'Profile',
    key: 'profile',
    icon: renderIcon(UserIcon),
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: renderIcon(SettingsIcon),
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: renderIcon(LogoutIcon),
  },
];

async function handleSelect(key) {
  switch (key) {
    case 'profile':
      router.push({ name: 'profile-info' });
      break;
    case 'settings':
      router.push({ name: 'settings' });
      break;
    case 'logout':
      try {
        await auth.logout();
        message.success('Đăng xuất thành công, hẹn gặp lại!');
      } catch (error) {
        message.error('Xin lỗi về sự bất tiện');
      }
      break;
    default:
      router.push({ name: 'home' });
      break;
  }
}
</script>

<style scoped>
/* ===== AUTH WRAPPER ===== */
.auth-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* ===== AUTH BUTTONS (Not Logged In) ===== */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: nowrap;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.9375rem;
  font-weight: 500;
}

.auth-btn:hover {
  border-color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.auth-btn i {
  font-size: 1rem;
}

.auth-btn .btn-text {
  display: inline;
  color: white !important;
}

/* ===== PROFILE SECTION (Logged In) ===== */
.profile-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.welcome-text {
  color: white;
  font-size: 0.9375rem;
  font-weight: 500;
  white-space: nowrap;
}

.profile-btn {
  min-width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.profile-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(208, 48, 80, 0.3);
}

.profile-btn i {
  font-size: 1.125rem;
}

/* ===== MODAL CONTENT ===== */
.modal-content {
  padding: 0.5rem 0;
}

.switch-auth-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.switch-text {
  color: #d03050;
  font-size: 0.9375rem;
  font-weight: 500;
}

.error-message {
  color: #d03050;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.forgot-password {
  color: #18a058;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #0c713d;
  text-decoration: underline;
}

.submit-btn {
  margin-top: 0.5rem;
  height: 42px;
  font-size: 1rem;
  font-weight: 600;
}

/* ===== MOBILE AUTH CONTAINER ===== */
.mobile-auth-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Ensure buttons show correctly in drawer */
.mobile-auth-container .auth-buttons {
  flex-direction: column;
  width: 100%;
  gap: 1rem;
}

.mobile-auth-container .auth-btn {
  width: 100%;
  justify-content: center;
  padding: 0.75rem 1rem !important;
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
}

.mobile-auth-container .auth-btn .btn-text {
  display: inline !important;
  color: white !important;
  font-weight: 600;
  font-size: 1rem;
}

.mobile-auth-container .auth-btn i {
  color: white !important;
  font-size: 1.125rem;
}

.mobile-auth-container .auth-btn:hover {
  background: linear-gradient(135deg, #0a5c32 0%, #084426 100%) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
}

/* ===== RESPONSIVE STYLES ===== */

/* Small Mobile (< 480px) */
@media (max-width: 479px) {
  .auth-wrapper {
    gap: 0.5rem;
  }

  .auth-buttons {
    gap: 0.5rem;
  }

  .auth-btn {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.875rem;
    gap: 0.375rem;
  }

  .auth-btn i {
    font-size: 0.9375rem;
  }

  .auth-btn .btn-text {
    font-size: 0.875rem;
  }

  .profile-section {
    gap: 0.5rem;
  }

  /* Hide welcome text on small mobile */
  .welcome-text {
    display: none;
  }

  .profile-btn {
    min-width: 38px;
    height: 38px;
  }

  .profile-btn i {
    font-size: 1rem;
  }

  .modal-content {
    padding: 0.25rem 0;
  }

  .switch-auth-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .switch-text {
    font-size: 0.875rem;
  }

  .login-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .submit-btn {
    height: 40px;
    font-size: 0.9375rem;
  }
}

/* Mobile (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .auth-wrapper {
    gap: 0.625rem;
  }

  .auth-buttons {
    gap: 0.5rem;
  }

  .auth-btn {
    padding: 0.5rem 0.875rem !important;
    font-size: 0.9375rem;
  }

  .profile-section {
    gap: 0.625rem;
  }

  /* Hide welcome text on mobile */
  .welcome-text {
    display: none;
  }

  .profile-btn {
    min-width: 40px;
    height: 40px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .auth-btn {
    padding: 0.5rem 1rem !important;
  }

  /* Hide welcome text on tablet when in mobile mode */
  .welcome-text {
    display: none;
  }

  .profile-btn {
    min-width: 42px;
    height: 42px;
  }
}

/* Small Laptop (1024px - 1279px) */
@media (min-width: 1024px) and (max-width: 1279px) {
  .auth-btn {
    font-size: 0.9375rem;
    padding: 0.5rem 1rem !important;
  }

  .welcome-text {
    display: inline;
    font-size: 0.875rem;
  }
}

/* Desktop (1280px+) */
@media (min-width: 1280px) {
  .auth-buttons {
    gap: 0.75rem;
  }

  .profile-section {
    gap: 1rem;
  }

  .auth-btn {
    padding: 0.5rem 1.125rem !important;
  }

  .welcome-text {
    display: inline;
    font-size: 0.9375rem;
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .auth-btn {
    padding: 0.625rem 1.25rem !important;
    font-size: 1rem;
  }

  .auth-btn i {
    font-size: 1.125rem;
  }

  .welcome-text {
    display: inline;
    font-size: 1rem;
  }

  .profile-btn {
    min-width: 44px;
    height: 44px;
  }
}

/* Portrait Tablet */
@media (min-width: 768px) and (max-width: 1023px) and (orientation: portrait) {
  .welcome-text {
    display: none;
  }
}

/* Landscape Phone */
@media (max-width: 767px) and (orientation: landscape) {
  .welcome-text {
    display: none;
  }

  .auth-btn {
    padding: 0.375rem 0.75rem !important;
    font-size: 0.875rem;
  }
}
</style>
