<template>
  <div class="background-edit-wrapper">
    <a-card class="edit-card">
      <template #title>
        <div class="card-header">
          <h1 class="header-title">
            <i class="fa-solid fa-pen-to-square"></i>
            Chỉnh Sửa Hình Nền
          </h1>
        </div>
      </template>

      <div class="edit-content">
        <form @submit.prevent="submitForm" class="edit-form">
          <div class="image-preview-section">
            <div class="preview-container">
              <img
                :src="imageUrl"
                alt="Background Image"
                class="preview-image"
              />
            </div>
          </div>

          <div class="form-section">
            <div class="form-group">
              <label for="backgroundName" class="field-label">
                <span class="required-mark">*</span>
                <span>Tên Hình Nền:</span>
              </label>
              <input
                v-model="form.background_image_name"
                type="text"
                id="backgroundName"
                required
                class="form-input"
                placeholder="Nhập tên hình nền"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-button">
                <span class="button-content">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>Lưu Thay Đổi</span>
                </span>
              </button>
              <button
                type="button"
                class="cancel-button"
                @click="router.push({ name: 'admin-images' })"
              >
                <span class="button-content">
                  <i class="fa-solid fa-xmark"></i>
                  <span>Hủy</span>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const route = useRoute();
const router = useRouter();
const backgroundId = route.params.id;
const form = ref({
  background_image_name: '',
  background_image_path: '',
});

const BaseURL = 'http://127.0.0.1:8000';
const imageUrl = computed(() => {
  return `${BaseURL}/storage/${form.value.background_image_path}`;
});

const fetchBackgroundData = async () => {
  try {
    const response = await api.get(`/story/backgrounds/${backgroundId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải hình nền.');
  }
};

const submitForm = async () => {
  try {
    await api.put(`/story/backgrounds/${backgroundId}`, {
      background_image_name: form.value.background_image_name,
    });
    message.success('Hình nền đã được cập nhật thành công.');
    router.push({ name: 'admin-images' });
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật hình nền.');
  }
};

onMounted(() => {
  fetchBackgroundData();
  useMenu().onSelectedKey(['admin-images']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.background-edit-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

/* ========== CARD STYLING ========== */
.edit-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
}

.edit-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  padding: 30px;
}

.edit-card :deep(.ant-card-body) {
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
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========== EDIT CONTENT ========== */
.edit-content {
  background: white;
  border-radius: 16px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ========== IMAGE PREVIEW ========== */
.image-preview-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-container {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  background: #f5f5f5;
}

.preview-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
  z-index: 1;
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.preview-container:hover .preview-image {
  transform: scale(1.05);
}

/* ========== FORM SECTION ========== */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-bottom: 2px solid #ddd;
  font-size: 1rem;
  background: transparent;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-bottom-color: #0c713d;
  background: rgba(12, 113, 61, 0.02);
}

/* ========== FORM ACTIONS ========== */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.submit-button,
.cancel-button {
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  padding: 0;
}

.submit-button::before,
.cancel-button::before {
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

.submit-button:hover::before,
.cancel-button:hover::before {
  width: 300px;
  height: 300px;
}

.submit-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.cancel-button {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  box-shadow: 0 4px 20px rgba(108, 117, 125, 0.3);
}

.cancel-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(108, 117, 125, 0.4);
}

.submit-button:active,
.cancel-button:active {
  transform: translateY(0);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  font-size: 1rem;
  color: white;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.button-content i {
  font-size: 1.2rem;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .background-edit-wrapper {
    padding: 30px 15px;
  }

  .edit-card :deep(.ant-card-body) {
    padding: 35px;
  }

  .header-title {
    font-size: 1.7rem;
  }

  .header-title i {
    font-size: 1.9rem;
  }

  .edit-form {
    gap: 35px;
  }

  .form-section {
    gap: 25px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .background-edit-wrapper {
    padding: 20px 10px;
  }

  .edit-card {
    border-radius: 16px;
  }

  .edit-card :deep(.ant-card-head) {
    padding: 20px;
  }

  .edit-card :deep(.ant-card-body) {
    padding: 25px 20px;
  }

  .header-title {
    font-size: 1.4rem;
    flex-direction: column;
    gap: 10px;
  }

  .header-title i {
    font-size: 1.6rem;
  }

  .edit-form {
    gap: 30px;
  }

  .form-section {
    gap: 20px;
  }

  .form-actions {
    justify-content: stretch;
    flex-direction: column;
  }

  .submit-button,
  .cancel-button {
    width: 100%;
  }

  .button-content {
    justify-content: center;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .background-edit-wrapper {
    padding: 15px 8px;
  }

  .edit-card {
    border-radius: 12px;
  }

  .edit-card :deep(.ant-card-head) {
    padding: 15px;
  }

  .edit-card :deep(.ant-card-body) {
    padding: 20px 15px;
  }

  .header-title {
    font-size: 1.2rem;
  }

  .header-title i {
    font-size: 1.4rem;
  }

  .edit-form {
    gap: 25px;
  }

  .form-section {
    gap: 18px;
  }

  .field-label {
    font-size: 0.95rem;
  }

  .form-input {
    padding: 12px 14px;
    font-size: 0.95rem;
  }

  .button-content {
    padding: 12px 24px;
    font-size: 0.95rem;
  }

  .button-content i {
    font-size: 1.1rem;
  }
}
</style>
