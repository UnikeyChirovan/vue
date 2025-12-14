<template>
  <div class="edit-wrapper">
    <div class="edit-container">
      <div class="edit-header">
        <i class="fa-solid fa-pen-to-square header-icon"></i>
        <h1 class="header-title">Chỉnh Sửa Hình Ảnh</h1>
      </div>

      <div class="edit-content">
        <form @submit.prevent="submitForm">
          <!-- Image Preview Section -->
          <div class="preview-section">
            <div class="section-header">
              <i class="fa-solid fa-image"></i>
              <span>Hình ảnh hiện tại</span>
            </div>
            <div class="image-preview-container">
              <img :src="imageUrl" alt="Current Image" class="preview-image" />
              <div class="image-overlay">
                <i class="fa-solid fa-eye"></i>
              </div>
            </div>
          </div>

          <!-- Edit Form Section -->
          <div class="form-section">
            <div class="section-header">
              <i class="fa-solid fa-file-signature"></i>
              <span>Thông tin hình ảnh</span>
            </div>

            <div class="form-group">
              <label for="backgroundName" class="form-label">
                <i class="fa-solid fa-tag"></i>
                <span class="label-text">
                  <span class="required">*</span>
                  Tên hình ảnh
                </span>
              </label>
              <input
                v-model="form.image_name"
                type="text"
                id="backgroundName"
                required
                class="form-input"
                placeholder="Nhập tên hình ảnh..."
              />
            </div>

            <div class="info-box">
              <i class="fa-solid fa-circle-info"></i>
              <div class="info-content">
                <p class="info-title">Lưu ý:</p>
                <p class="info-text">
                  Bạn chỉ có thể thay đổi tên hình ảnh. Để thay đổi hình ảnh,
                  vui lòng xóa và tải lên hình mới.
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="goBack">
              <i class="fa-solid fa-xmark"></i>
              <span>Hủy bỏ</span>
            </button>
            <button type="submit" class="submit-btn">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
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
  image_name: '',
  image_path: '',
});

const BaseURL = 'http://127.0.0.1:8000';
const imageUrl = computed(() => {
  return `${BaseURL}/storage/${form.value.image_path}`;
});

const fetchBackgroundData = async () => {
  try {
    const response = await api.get(`/image-manager/${backgroundId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải hình ảnh.');
  }
};

const goBack = () => {
  router.push({ name: 'admin-images-manager' });
};

const submitForm = async () => {
  try {
    await api.put(`/image-manager/${backgroundId}`, {
      image_name: form.value.image_name,
    });
    message.success('Hình ảnh đã được cập nhật thành công.');
    router.push({ name: 'admin-images-manager' });
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật hình ảnh.');
  }
};

onMounted(() => {
  fetchBackgroundData();
  useMenu().onSelectedKey(['admin-images-manager']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.edit-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

.edit-container {
  max-width: 900px;
  margin: 0 auto;
}

/* ========== HEADER ========== */
.edit-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 32px 40px;
  border-radius: 24px 24px 0 0;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.2);
}

.header-icon {
  font-size: 2.5rem;
  color: white;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
}

/* ========== CONTENT ========== */
.edit-content {
  background: white;
  padding: 40px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* ========== SECTIONS ========== */
.preview-section,
.form-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header i {
  color: #0c713d;
  font-size: 1.4rem;
}

/* ========== IMAGE PREVIEW ========== */
.image-preview-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.2);
  border: 4px solid #0c713d;
  transition: all 0.3s ease;
}

.image-preview-container:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 40px rgba(12, 113, 61, 0.3);
}

/* .image-preview-container:hover .image-overlay {
  opacity: 1;
} */

.preview-image {
  width: 100%;
  height: auto;
  display: block;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(12, 113, 61, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-overlay i {
  font-size: 3rem;
  color: white;
}

/* ========== FORM ========== */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.form-label i {
  color: #0c713d;
  font-size: 1.2rem;
}

.label-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.required {
  color: #ff4d4f;
  font-size: 1.1rem;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  color: #333;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

/* ========== INFO BOX ========== */
.info-box {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(12, 113, 61, 0.05);
  border-left: 4px solid #0c713d;
  border-radius: 10px;
  margin-top: 24px;
}

.info-box > i {
  color: #0c713d;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-content {
  flex: 1;
}

.info-title {
  font-weight: 700;
  color: #0c713d;
  margin: 0 0 6px 0;
  font-size: 0.95rem;
}

.info-text {
  color: #555;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* ========== FORM ACTIONS ========== */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
  margin-top: 32px;
}

.cancel-btn,
.submit-btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cancel-btn {
  background: white;
  border: 2px solid #d0d0d0;
  color: #666;
}

.cancel-btn:hover {
  background: #f5f5f5;
  border-color: #b0b0b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

.submit-btn:active,
.cancel-btn:active {
  transform: translateY(0);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .edit-wrapper {
    padding: 70px 16px 50px;
  }

  .edit-header {
    padding: 28px 32px;
  }

  .header-icon {
    font-size: 2.2rem;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .edit-content {
    padding: 32px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .edit-wrapper {
    padding: 60px 12px 40px;
  }

  .edit-header {
    padding: 24px 24px;
    border-radius: 16px 16px 0 0;
    flex-direction: column;
    text-align: center;
  }

  .header-icon {
    font-size: 2rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .edit-content {
    padding: 24px 20px;
    border-radius: 0 0 16px 16px;
  }

  .section-header {
    font-size: 1.1rem;
  }

  .section-header i {
    font-size: 1.2rem;
  }

  .form-label {
    font-size: 0.95rem;
  }

  .form-label i {
    font-size: 1.1rem;
  }

  .info-box {
    flex-direction: column;
    gap: 12px;
  }

  .info-box > i {
    font-size: 1.3rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .edit-wrapper {
    padding: 50px 8px 30px;
  }

  .edit-header {
    padding: 20px 20px;
    border-radius: 12px 12px 0 0;
    gap: 12px;
  }

  .header-icon {
    font-size: 1.8rem;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .edit-content {
    padding: 20px 16px;
    border-radius: 0 0 12px 12px;
  }

  .preview-section,
  .form-section {
    margin-bottom: 24px;
  }

  .section-header {
    font-size: 1rem;
    gap: 8px;
    margin-bottom: 16px;
  }

  .section-header i {
    font-size: 1.1rem;
  }

  .image-preview-container {
    border-width: 3px;
  }

  .image-overlay i {
    font-size: 2.5rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-label i {
    font-size: 1rem;
  }

  .form-input {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  .info-box {
    padding: 14px 16px;
    gap: 10px;
  }

  .info-box > i {
    font-size: 1.2rem;
  }

  .info-title {
    font-size: 0.9rem;
  }

  .info-text {
    font-size: 0.85rem;
  }

  .cancel-btn,
  .submit-btn {
    padding: 12px 28px;
    font-size: 0.95rem;
  }
}
</style>
