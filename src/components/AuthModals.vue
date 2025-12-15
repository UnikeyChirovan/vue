<template>
  <!-- Register Modal -->
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="showRegister"
        class="modal-overlay"
        @click="closeRegisterModal"
        @keydown.esc="closeRegisterModal"
      >
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-header-content">
              <i class="fa-solid fa-user-plus"></i>
              <h3>ĐĂNG KÝ TÀI KHOẢN</h3>
            </div>
            <button @click="closeRegisterModal" class="modal-close">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="switch-auth-section">
              <span class="switch-text">Bạn đã có tài khoản?</span>
              <button @click="openLoginModal" class="switch-btn">
                Đăng nhập ngay
              </button>
            </div>

            <form @submit.prevent="handleRegisterSubmit" class="auth-form">
              <div
                v-for="(field, index) in formFields"
                :key="index"
                class="form-field-wrapper"
              >
                <div class="form-item">
                  <label :for="field.model" class="form-label">
                    {{ field.label }}
                  </label>
                  <div class="input-wrapper">
                    <input
                      v-model="users[field.model]"
                      :type="field.type || 'text'"
                      :id="field.model"
                      :placeholder="field.placeholder"
                      class="form-input"
                    />
                    <button
                      v-if="users[field.model]"
                      type="button"
                      @click="users[field.model] = ''"
                      class="input-clear"
                    >
                      <i class="fa-solid fa-times"></i>
                    </button>
                  </div>
                </div>
                <div v-if="errors[field.model]" class="error-message">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {{ errors[field.model][0] }}
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="submit-btn register-submit"
              >
                <i
                  :class="
                    loading
                      ? 'fa-solid fa-spinner fa-spin'
                      : 'fa-solid fa-user-plus'
                  "
                ></i>
                {{ loading ? 'Đang xử lý...' : 'Đăng Ký' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>

  <!-- Login Modal -->
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="showLogin"
        class="modal-overlay"
        @click="closeLoginModal"
        @keydown.esc="closeLoginModal"
      >
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-header-content">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
              <h3>ĐĂNG NHẬP TÀI KHOẢN</h3>
            </div>
            <button @click="closeLoginModal" class="modal-close">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="switch-auth-section">
              <span class="switch-text">Bạn chưa có tài khoản?</span>
              <button @click="openRegisterModal" class="switch-btn">
                Đăng ký ngay
              </button>
            </div>

            <form
              @submit.prevent="handleLoginSubmit"
              @keyup.enter="handleLoginSubmit"
              class="auth-form"
            >
              <div class="form-field-wrapper">
                <div class="form-item">
                  <label class="form-label">Username hoặc Email:</label>
                  <div class="input-wrapper">
                    <input
                      v-model="usernameOrEmail"
                      type="text"
                      placeholder="Nhập username hoặc email"
                      class="form-input"
                    />
                  </div>
                </div>
                <div v-if="errorsLogin.username_or_email" class="error-message">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {{ errorsLogin.username_or_email[0] }}
                </div>
              </div>

              <div class="form-field-wrapper">
                <div class="form-item">
                  <label class="form-label">Password:</label>
                  <div class="input-wrapper">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Nhập password"
                      class="form-input"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="input-toggle"
                    >
                      <i
                        :class="
                          showPassword
                            ? 'fa-solid fa-eye-slash'
                            : 'fa-solid fa-eye'
                        "
                      ></i>
                    </button>
                  </div>
                </div>
                <div v-if="errorsLogin.password" class="error-message">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {{ errorsLogin.password[0] }}
                </div>
              </div>

              <div class="login-options">
                <label class="remember-checkbox">
                  <input type="checkbox" v-model="rememberMe" />
                  <span class="checkbox-custom"></span>
                  <span class="remember-text">Remember me</span>
                </label>
                <router-link
                  to="/password-reset-request"
                  class="forgot-password"
                >
                  <i class="fa-solid fa-key"></i>
                  Quên mật khẩu?
                </router-link>
              </div>

              <button type="submit" class="submit-btn login-submit">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
                Đăng Nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLoadingStore } from '../stores/loadingStore';
import { useMessage } from 'naive-ui';
import apiLinks from '../services/api-links';

const props = defineProps({
  showRegister: Boolean,
  showLogin: Boolean,
});

const emit = defineEmits(['update:showRegister', 'update:showLogin']);

const loadingStore = useLoadingStore();
const auth = useAuthStore();
const router = useRouter();
const message = useMessage();

const showPassword = ref(false);
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

const formFields = [
  {
    label: 'Tên Tài khoản',
    model: 'username',
    placeholder: 'Tên Tài khoản',
  },
  {
    label: 'Họ và Tên',
    model: 'name',
    placeholder: 'Họ và Tên',
  },
  {
    label: 'Biệt Danh',
    model: 'nickname',
    placeholder: 'Tên muốn thể hiện',
  },
  {
    label: 'Email',
    model: 'email',
    placeholder: 'Email',
  },
  {
    label: 'Mật khẩu',
    model: 'password',
    placeholder: 'Mật khẩu',
    type: 'password',
  },
  {
    label: 'Xác nhận mật khẩu',
    model: 'password_confirmation',
    placeholder: 'Xác nhận mật khẩu',
    type: 'password',
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
  emit('update:showRegister', false);
  emit('update:showLogin', true);
}

function openRegisterModal() {
  emit('update:showLogin', false);
  emit('update:showRegister', true);
}

function closeRegisterModal() {
  emit('update:showRegister', false);
  resetRegisterForm();
}

function closeLoginModal() {
  emit('update:showLogin', false);
  resetLoginForm();
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
</script>

<style scoped>
/* ===== MODAL OVERLAY ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
  overflow-y: auto;
}

html.dark-mode .modal-overlay {
  background: rgba(0, 0, 0, 0.8);
}

/* ===== MODAL CONTAINER ===== */
.modal-container {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  margin: auto;
}

html.dark-mode .modal-container {
  background: #1a1a1a;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* ===== MODAL HEADER ===== */
.modal-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 50%, #084426 100%);
  padding: 1.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

html.dark-mode .modal-header {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 50%, #1a1a1a 100%);
  border-bottom: 2px solid rgba(74, 222, 128, 0.2);
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  position: relative;
  z-index: 1;
}

.modal-header-content i {
  font-size: 1.75rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

html.dark-mode .modal-header-content {
  color: #4ade80;
}

.modal-header-content h3 {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.modal-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg) scale(1.1);
}

html.dark-mode .modal-close {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

html.dark-mode .modal-close:hover {
  background: rgba(74, 222, 128, 0.25);
}

/* ===== MODAL BODY ===== */
.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

html.dark-mode .modal-body::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #0c713d;
  border-radius: 4px;
}

html.dark-mode .modal-body::-webkit-scrollbar-thumb {
  background: #4ade80;
}

/* ===== SWITCH AUTH SECTION ===== */
.switch-auth-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  flex-wrap: wrap;
  gap: 0.75rem;
  border-left: 4px solid #0c713d;
  box-shadow: 0 2px 8px rgba(12, 113, 61, 0.08);
}

html.dark-mode .switch-auth-section {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-left-color: #4ade80;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.15);
}

.switch-text {
  color: #0c713d;
  font-size: 0.9375rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

html.dark-mode .switch-text {
  color: #4ade80;
}

.switch-btn {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #d03050 0%, #c02040 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(208, 48, 80, 0.3);
}

.switch-btn:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(208, 48, 80, 0.4);
}

html.dark-mode .switch-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* ===== FORM STYLES ===== */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-field-wrapper {
  margin-bottom: 1.25rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 0.9375rem;
}

html.dark-mode .form-label {
  color: #e5e5e5;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  padding-right: 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  background: white;
  color: #333;
}

html.dark-mode .form-input {
  background: #2a2a2a;
  border-color: #3a3a3a;
  color: #e5e5e5;
}

.form-input:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
  transform: translateY(-2px);
}

html.dark-mode .form-input:focus {
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.input-clear,
.input-toggle {
  position: absolute;
  right: 1rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.input-clear:hover,
.input-toggle:hover {
  background: rgba(12, 113, 61, 0.1);
  color: #0c713d;
}

html.dark-mode .input-clear:hover,
html.dark-mode .input-toggle:hover {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

/* ===== ERROR MESSAGE ===== */
.error-message {
  color: #d03050;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: rgba(208, 48, 80, 0.1);
  border-radius: 10px;
  border-left: 3px solid #d03050;
  animation: shake 0.5s ease;
}

html.dark-mode .error-message {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-left-color: #ef4444;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* ===== LOGIN OPTIONS ===== */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem 0;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  user-select: none;
}

.remember-checkbox input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #0c713d;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: white;
}

html.dark-mode .checkbox-custom {
  background: #2a2a2a;
  border-color: #4ade80;
}

.remember-checkbox input[type='checkbox']:checked + .checkbox-custom {
  background: #0c713d;
  border-color: #0c713d;
}

html.dark-mode
  .remember-checkbox
  input[type='checkbox']:checked
  + .checkbox-custom {
  background: #4ade80;
  border-color: #4ade80;
}

.remember-checkbox input[type='checkbox']:checked + .checkbox-custom::after {
  content: '\f00c';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  color: white;
  font-size: 0.75rem;
}

html.dark-mode
  .remember-checkbox
  input[type='checkbox']:checked
  + .checkbox-custom::after {
  color: #1a1a1a;
}

.remember-text {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
}

html.dark-mode .remember-text {
  color: #e5e5e5;
}

.forgot-password {
  color: #0c713d;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

html.dark-mode .forgot-password {
  color: #4ade80;
}

.forgot-password:hover {
  color: #0a5c32;
  transform: translateX(4px);
}

html.dark-mode .forgot-password:hover {
  color: #22c55e;
}

/* ===== SUBMIT BUTTON ===== */
.submit-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 0.75rem;
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.3);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s ease,
    height 0.6s ease;
}

.submit-btn:hover::before {
  width: 400px;
  height: 400px;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.4);
}

html.dark-mode .submit-btn:hover {
  box-shadow: 0 8px 24px rgba(74, 222, 128, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn i {
  font-size: 1.125rem;
  position: relative;
  z-index: 1;
}

/* ===== TRANSITIONS ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from .modal-container {
  transform: scale(0.9) translateY(-20px);
}

.modal-fade-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 479px) {
  .modal-overlay {
    padding: 10px;
    align-items: flex-start;
    padding-top: 5vh;
  }

  .modal-container {
    max-width: 95%;
    max-height: 90vh;
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
  }

  .modal-header-content h3 {
    font-size: 1.125rem;
  }

  .modal-body {
    padding: 1.5rem 1.25rem;
  }

  .switch-auth-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .modal-overlay {
    padding: 15px;
    align-items: flex-start;
    padding-top: 8vh;
  }

  .modal-container {
    max-width: 90%;
    max-height: 85vh;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .modal-overlay {
    align-items: center;
  }
}
</style>