<template>
  <div class="password-reset-wrapper">
    <div class="reset-container">
      <div class="reset-card">
        <div class="card-header">
          <div class="header-icon">
            <i class="fa-solid fa-key"></i>
          </div>
          <h2>Đặt Lại Mật Khẩu</h2>
          <p>Nhập mật khẩu mới của bạn</p>
        </div>

        <n-form @submit.prevent="handleSubmit" :label-placement="'top'">
          <n-form-item label="Mật khẩu mới" :show-feedback="false">
            <n-input
              v-model:value="password"
              type="password"
              show-password-on="click"
              placeholder="Nhập mật khẩu mới"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Xác nhận mật khẩu" :show-feedback="false">
            <n-input
              v-model:value="password_confirmation"
              type="password"
              show-password-on="click"
              placeholder="Xác nhận mật khẩu mới"
              size="large"
            />
          </n-form-item>

          <button type="submit" class="submit-btn" :disabled="loading">
            <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-check"></i>
            <span>{{ loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu' }}</span>
          </button>
        </n-form>

        <div class="card-footer">
          <i class="fa-solid fa-shield-halved"></i>
          <p>Mật khẩu của bạn được bảo mật tuyệt đối</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import apiLinks from '../services/api-links';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const password = ref('');
const password_confirmation = ref('');
const loading = ref(false);

const token = route.query.token;
const email = route.query.email;

onMounted(() => {
  if (!token || !email) {
    message.error('Liên kết đặt lại mật khẩu không hợp lệ.');
    router.push({ name: 'home' });
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const response = await apiLinks.auth.resetPassword({
      token,
      email,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
    message.success(response.data.message);
    router.push({ name: 'home' });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message.error(error.response.data.message);
    } else {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* ========== WRAPPER ========== */
.password-reset-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

html.dark-mode .password-reset-wrapper {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

/* ========== CONTAINER ========== */
.reset-container {
  width: 100%;
  max-width: 450px;
}

/* ========== CARD ========== */
.reset-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;
}

html.dark-mode .reset-card {
  background: #1e1e1e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== HEADER ========== */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.header-icon i {
  font-size: 32px;
  color: white;
}

.card-header h2 {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

html.dark-mode .card-header h2 {
  color: #e5e5e5;
}

.card-header p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

html.dark-mode .card-header p {
  color: #a3a3a3;
}

/* ========== FORM ========== */
.reset-card :deep(.n-form-item) {
  margin-bottom: 24px;
}

.reset-card :deep(.n-form-item-label) {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 8px;
}

html.dark-mode .reset-card :deep(.n-form-item-label) {
  color: #e5e5e5;
}

.reset-card :deep(.n-input) {
  border-radius: 12px;
  border: 2px solid #e5e5e5;
  transition: all 0.3s ease;
}

html.dark-mode .reset-card :deep(.n-input) {
  background: #2a2a2a;
  border-color: #404040;
  color: #e5e5e5;
}

.reset-card :deep(.n-input:hover) {
  border-color: #667eea;
}

html.dark-mode .reset-card :deep(.n-input:hover) {
  border-color: #8b9aec;
}

.reset-card :deep(.n-input.n-input--focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

html.dark-mode .reset-card :deep(.n-input.n-input--focus) {
  box-shadow: 0 0 0 3px rgba(139, 154, 236, 0.2);
}

/* ========== SUBMIT BUTTON ========== */
.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn i {
  font-size: 18px;
}

/* ========== FOOTER ========== */
.card-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #666;
}

html.dark-mode .card-footer {
  border-color: #333;
  color: #a3a3a3;
}

.card-footer i {
  font-size: 20px;
  color: #4ade80;
}

.card-footer p {
  margin: 0;
  font-size: 0.9rem;
}

/* ========== RESPONSIVE ========== */

/* Tablet */
@media (max-width: 1024px) {
  .reset-card {
    padding: 36px;
  }

  .header-icon {
    width: 68px;
    height: 68px;
  }

  .header-icon i {
    font-size: 30px;
  }

  .card-header h2 {
    font-size: 1.7rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .password-reset-wrapper {
    padding: 15px;
  }

  .reset-card {
    padding: 32px 28px;
    border-radius: 20px;
  }

  .header-icon {
    width: 64px;
    height: 64px;
  }

  .header-icon i {
    font-size: 28px;
  }

  .card-header {
    margin-bottom: 28px;
  }

  .card-header h2 {
    font-size: 1.6rem;
  }

  .card-header p {
    font-size: 0.9rem;
  }

  .reset-card :deep(.n-form-item) {
    margin-bottom: 20px;
  }

  .submit-btn {
    padding: 13px 20px;
    font-size: 0.95rem;
  }

  .card-footer {
    margin-top: 28px;
    padding-top: 20px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .password-reset-wrapper {
    padding: 12px;
  }

  .reset-card {
    padding: 28px 24px;
    border-radius: 18px;
  }

  .header-icon {
    width: 60px;
    height: 60px;
  }

  .header-icon i {
    font-size: 26px;
  }

  .card-header {
    margin-bottom: 24px;
  }

  .card-header h2 {
    font-size: 1.5rem;
  }

  .card-header p {
    font-size: 0.88rem;
  }

  .reset-card :deep(.n-form-item-label) {
    font-size: 0.9rem;
  }

  .submit-btn {
    padding: 12px 18px;
    font-size: 0.9rem;
  }

  .card-footer {
    margin-top: 24px;
    padding-top: 18px;
  }

  .card-footer i {
    font-size: 18px;
  }

  .card-footer p {
    font-size: 0.85rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .password-reset-wrapper {
    padding: 10px;
  }

  .reset-card {
    padding: 24px 20px;
    border-radius: 16px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .header-icon i {
    font-size: 24px;
  }

  .card-header h2 {
    font-size: 1.4rem;
  }

  .card-header p {
    font-size: 0.85rem;
  }

  .reset-card :deep(.n-form-item) {
    margin-bottom: 18px;
  }

  .submit-btn {
    padding: 11px 16px;
    font-size: 0.85rem;
  }

  .card-footer p {
    font-size: 0.8rem;
  }
}
</style>
