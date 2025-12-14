<template>
  <div class="upload-wrapper">
    <div class="upload-container">
      <div class="upload-header">
        <i class="fa-solid fa-cloud-arrow-up header-icon"></i>
        <h1 class="header-title">Tải Lên Hình Ảnh</h1>
        <p class="header-subtitle">Chọn tối đa 10 hình ảnh để tải lên</p>
      </div>

      <div class="upload-content">
        <form @submit.prevent="submitForm">
          <!-- File Upload Section -->
          <div class="file-upload-section">
            <label for="backgroundImages" class="upload-area">
              <input
                type="file"
                id="backgroundImages"
                class="file-input"
                multiple
                @change="handleFileUpload"
                accept="image/*"
                required
              />
              <div class="upload-area-content">
                <i class="fa-solid fa-images upload-icon"></i>
                <h3>Kéo thả hoặc nhấn để chọn hình</h3>
                <p>Hỗ trợ: JPG, PNG, GIF (Tối đa 10 hình)</p>
              </div>
            </label>
          </div>

          <!-- Preview Section -->
          <div v-if="backgroundImages.length > 0" class="preview-section">
            <div class="preview-header">
              <h2>
                <i class="fa-solid fa-image"></i>
                Danh sách hình đã chọn ({{ backgroundImages.length }}/10)
              </h2>
            </div>

            <div class="preview-grid">
              <div
                v-for="(image, index) in backgroundImages"
                :key="index"
                class="preview-card"
              >
                <div class="preview-image-container">
                  <img
                    :src="image.previewUrl"
                    :alt="`Preview ${index + 1}`"
                    class="preview-image"
                  />
                  <button
                    type="button"
                    class="remove-btn"
                    @click="removeImage(index)"
                    title="Xóa hình này"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div class="preview-info">
                  <div class="input-group">
                    <label :for="'backgroundName-' + index" class="input-label">
                      <i class="fa-solid fa-tag"></i>
                      Tên hình {{ index + 1 }}
                    </label>
                    <input
                      type="text"
                      :id="'backgroundName-' + index"
                      class="name-input"
                      v-model="image.name"
                      placeholder="Nhập tên hình ảnh..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button
              type="button"
              class="cancel-btn"
              @click="resetForm"
              :disabled="loading"
            >
              <i class="fa-solid fa-rotate-left"></i>
              <span>Đặt lại</span>
            </button>
            <button
              type="submit"
              class="submit-btn"
              :disabled="backgroundImages.length === 0 || loading"
            >
              <i class="fa-solid fa-cloud-arrow-up" v-if="!loading"></i>
              <i class="fa-solid fa-spinner fa-spin" v-else></i>
              <span>{{ loading ? 'Đang tải lên...' : 'Tải lên' }}</span>
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="message" class="success-message">
            <i class="fa-solid fa-circle-check"></i>
            <span>{{ message }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenu } from '../../../stores/use-menu';
import api from '../../../services/axiosInterceptor';

const backgroundImages = ref([]);
const loading = ref(false);
const message = ref('');

const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 10) {
    alert('Bạn chỉ có thể chọn tối đa 10 hình ảnh.');
    return;
  }
  backgroundImages.value = files.map((file) => ({
    file: file,
    name: '',
    previewUrl: URL.createObjectURL(file),
  }));
};

const removeImage = (index) => {
  URL.revokeObjectURL(backgroundImages.value[index].previewUrl);
  backgroundImages.value.splice(index, 1);
};

const resetForm = () => {
  backgroundImages.value.forEach((img) => {
    URL.revokeObjectURL(img.previewUrl);
  });
  backgroundImages.value = [];
  message.value = '';
  document.getElementById('backgroundImages').value = '';
};

const submitForm = async () => {
  const formData = new FormData();

  backgroundImages.value.forEach((image) => {
    formData.append('image_names[]', image.name);
    formData.append('images[]', image.file);
  });

  loading.value = true;
  message.value = '';

  try {
    const response = await api.post('/image-manager/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.message) {
      message.value = response.data.message;
      setTimeout(() => {
        resetForm();
      }, 2000);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    message.value = 'Tải lên thất bại. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-images-manager']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.upload-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

.upload-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ========== HEADER ========== */
.upload-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 40px;
  border-radius: 24px 24px 0 0;
  text-align: center;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.2);
}

.header-icon {
  font-size: 3rem;
  color: white;
  margin-bottom: 16px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
}

.header-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* ========== CONTENT ========== */
.upload-content {
  background: white;
  padding: 40px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* ========== FILE UPLOAD SECTION ========== */
.file-upload-section {
  margin-bottom: 32px;
}

.upload-area {
  display: block;
  border: 3px dashed #0c713d;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(12, 113, 61, 0.02);
}

.upload-area:hover {
  border-color: #0a5a31;
  background: rgba(12, 113, 61, 0.05);
  transform: scale(1.01);
}

.file-input {
  display: none;
}

.upload-area-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 4rem;
  color: #0c713d;
  margin-bottom: 20px;
}

.upload-area-content h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.upload-area-content p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

/* ========== PREVIEW SECTION ========== */
.preview-section {
  margin-bottom: 32px;
}

.preview-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.preview-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-header i {
  color: #0c713d;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.preview-card {
  background: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.preview-card:hover {
  border-color: #0c713d;
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.15);
  transform: translateY(-4px);
}

.preview-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #e9ecef;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 77, 79, 0.9);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #ff4d4f;
  transform: scale(1.1);
}

.preview-info {
  padding: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-label i {
  color: #0c713d;
}

.name-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.name-input:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

/* ========== FORM ACTIONS ========== */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
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

.cancel-btn:hover:not(:disabled) {
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

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========== SUCCESS MESSAGE ========== */
.success-message {
  margin-top: 24px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message i {
  font-size: 1.5rem;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .upload-wrapper {
    padding: 70px 16px 50px;
  }

  .upload-header {
    padding: 32px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .upload-content {
    padding: 32px;
  }

  .preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .upload-wrapper {
    padding: 60px 12px 40px;
  }

  .upload-header {
    padding: 28px 24px;
    border-radius: 16px 16px 0 0;
  }

  .header-icon {
    font-size: 2.5rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .upload-content {
    padding: 24px 20px;
    border-radius: 0 0 16px 16px;
  }

  .upload-area {
    padding: 40px 20px;
  }

  .upload-icon {
    font-size: 3rem;
  }

  .upload-area-content h3 {
    font-size: 1.1rem;
  }

  .upload-area-content p {
    font-size: 0.9rem;
  }

  .preview-grid {
    grid-template-columns: 1fr;
    gap: 16px;
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
  .upload-wrapper {
    padding: 50px 8px 30px;
  }

  .upload-header {
    padding: 24px 20px;
    border-radius: 12px 12px 0 0;
  }

  .header-icon {
    font-size: 2.2rem;
    margin-bottom: 12px;
  }

  .header-title {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  .upload-content {
    padding: 20px 16px;
    border-radius: 0 0 12px 12px;
  }

  .upload-area {
    padding: 32px 16px;
  }

  .upload-icon {
    font-size: 2.5rem;
    margin-bottom: 16px;
  }

  .upload-area-content h3 {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .upload-area-content p {
    font-size: 0.85rem;
  }

  .preview-header h2 {
    font-size: 1.2rem;
  }

  .preview-image-container {
    height: 180px;
  }

  .remove-btn {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .preview-info {
    padding: 14px;
  }

  .input-label {
    font-size: 0.85rem;
  }

  .name-input {
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  .cancel-btn,
  .submit-btn {
    padding: 12px 28px;
    font-size: 0.95rem;
  }

  .success-message {
    padding: 14px 16px;
    font-size: 0.95rem;
  }

  .success-message i {
    font-size: 1.3rem;
  }
}
</style>
