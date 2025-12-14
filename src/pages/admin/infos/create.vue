<template>
  <div class="notification-create-wrapper">
    <n-card class="create-card">
      <template #header>
        <div class="card-header">
          <h1 class="header-title">
            <i class="fa-solid fa-bell-concierge"></i>
            Tạo Thông Báo
          </h1>
        </div>
      </template>

      <n-form
        ref="formRef"
        :model="formValue"
        @submit.prevent="submitForm"
        class="notification-form"
      >
        <div class="form-content">
          <n-form-item class="form-group">
            <label class="field-label">
              <span class="required-mark">*</span>
              <span>Tiêu đề:</span>
            </label>
            <n-input
              v-model:value="formValue.title"
              placeholder="Nhập tiêu đề thông báo"
              size="large"
              class="form-input"
            />
          </n-form-item>

          <n-form-item class="form-group">
            <label class="field-label">
              <span class="required-mark">*</span>
              <span>Nội dung:</span>
            </label>
            <n-input
              v-model:value="formValue.content"
              placeholder="Nhập nội dung thông báo"
              type="textarea"
              size="large"
              :autosize="{
                minRows: 8,
                maxRows: 15,
              }"
              class="form-textarea"
            />
          </n-form-item>

          <div class="form-actions">
            <button type="button" @click="submitForm" class="submit-button">
              <span>Gởi Thông Báo</span>
            </button>
          </div>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const message = useMessage();

const formValue = ref({
  title: '',
  content: '',
});

const submitForm = async () => {
  if (!formValue.value.title || !formValue.value.content) {
    message.warning('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
    return;
  }

  try {
    const response = await api.post(
      '/newsletter/notifications/create',
      formValue.value
    );
    message.success(response.data.success);
    formValue.value.title = '';
    formValue.value.content = '';
  } catch (error) {
    console.error(error);
    if (error.response) {
      if (error.response.status === 429) {
        message.warning(error.response.data.message);
      } else {
        message.error('Đã xảy ra lỗi, vui lòng thử lại.');
      }
    } else {
      message.error('Lỗi kết nối, vui lòng kiểm tra lại.');
    }
  }
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-infos']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.notification-create-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

/* ========== CARD STYLING ========== */
.create-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
}

.create-card :deep(.n-card-header) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  padding: 30px;
}

.create-card :deep(.n-card__content) {
  padding: 40px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  color: white;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  letter-spacing: 0.5px;
}

.header-title i {
  font-size: 2.2rem;
  animation: ring 2s ease-in-out infinite;
}

@keyframes ring {
  0%,
  100% {
    transform: rotate(0deg);
  }
  10%,
  30% {
    transform: rotate(-10deg);
  }
  20%,
  40% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(0deg);
  }
}

/* ========== FORM STYLING ========== */
.notification-form {
  width: 100%;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
}

.form-group :deep(.n-form-item-blank) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.required-mark {
  color: #e74c3c;
  font-size: 1.1rem;
}

.form-input :deep(.n-input__input-el),
.form-textarea :deep(.n-input__textarea-el) {
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input :deep(.n-input--focus),
.form-textarea :deep(.n-input--focus) {
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

.form-textarea :deep(.n-input__textarea-el) {
  line-height: 1.6;
  resize: vertical;
}

/* ========== SUBMIT BUTTON ========== */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.submit-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  padding: 14px 48px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
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

.submit-button:hover::before {
  width: 300px;
  height: 300px;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.submit-button:active {
  transform: translateY(0);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .notification-create-wrapper {
    padding: 30px 15px;
  }

  .create-card :deep(.n-card-header) {
    padding: 25px;
  }

  .create-card :deep(.n-card__content) {
    padding: 35px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .header-title i {
    font-size: 2rem;
  }

  .form-content {
    gap: 25px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .notification-create-wrapper {
    padding: 20px 10px;
  }

  .create-card {
    border-radius: 16px;
  }

  .create-card :deep(.n-card-header) {
    padding: 20px;
  }

  .create-card :deep(.n-card__content) {
    padding: 25px 20px;
  }

  .header-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 10px;
  }

  .header-title i {
    font-size: 1.7rem;
  }

  .form-content {
    gap: 20px;
  }

  .field-label {
    font-size: 0.95rem;
  }

  .form-input :deep(.n-input__input-el),
  .form-textarea :deep(.n-input__textarea-el) {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  .submit-button {
    width: 100%;
    padding: 14px 32px;
  }

  .form-actions {
    justify-content: stretch;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .notification-create-wrapper {
    padding: 15px 8px;
  }

  .create-card {
    border-radius: 12px;
  }

  .create-card :deep(.n-card-header) {
    padding: 15px;
  }

  .create-card :deep(.n-card__content) {
    padding: 20px 15px;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .header-title i {
    font-size: 1.5rem;
  }

  .form-content {
    gap: 18px;
  }

  .field-label {
    font-size: 0.9rem;
  }

  .form-input :deep(.n-input__input-el),
  .form-textarea :deep(.n-input__textarea-el) {
    padding: 12px 14px;
    font-size: 0.9rem;
    border-radius: 10px;
  }

  .submit-button {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
}
</style>
