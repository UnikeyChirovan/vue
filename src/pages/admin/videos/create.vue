<template>
  <div class="upload-wrapper">
    <div class="upload-container">
      <n-card class="upload-card">
        <template #header>
          <div class="card-header">
            <h1 class="page-title">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              Upload Video
            </h1>
            <p class="page-subtitle">Tải lên video mới của bạn</p>
          </div>
        </template>

        <form @submit.prevent="submitForm" class="upload-form">
          <!-- Video File Upload -->
          <div class="form-group">
            <label for="videoFile" class="form-label">
              <i class="fa-solid fa-video"></i>
              Chọn Video
              <span class="required">*</span>
            </label>
            <div class="file-input-wrapper">
              <input
                type="file"
                id="videoFile"
                class="file-input"
                @change="handleFileUpload"
                accept="video/*"
                required
              />
              <label for="videoFile" class="file-input-label">
                <i class="fa-solid fa-upload"></i>
                <span v-if="!videoFile">Chọn file video</span>
                <span v-else class="file-selected">{{ videoFile.name }}</span>
              </label>
            </div>
          </div>

          <!-- Video Preview -->
          <div v-if="videoFile" class="preview-section" data-aos="fade-up">
            <div class="preview-header">
              <h3 class="preview-title">
                <i class="fa-solid fa-eye"></i>
                Xem trước Video
              </h3>
              <n-button
                type="error"
                size="small"
                @click="removeVideo"
                class="remove-btn"
              >
                <i class="fa-solid fa-trash"></i>
                Xóa
              </n-button>
            </div>
            <div class="video-preview-container">
              <video
                :src="videoPreviewUrl"
                controls
                class="video-preview"
              ></video>
            </div>
          </div>

          <!-- Video Name -->
          <div v-if="videoFile" class="form-group" data-aos="fade-up">
            <label for="videoName" class="form-label">
              <i class="fa-solid fa-signature"></i>
              Tên Video
              <span class="required">*</span>
            </label>
            <input
              type="text"
              id="videoName"
              class="form-input"
              v-model="videoName"
              placeholder="Nhập tên video..."
              required
            />
          </div>

          <!-- Thumbnail Upload -->
          <div class="form-group" data-aos="fade-up">
            <label for="thumbnailFile" class="form-label">
              <i class="fa-solid fa-image"></i>
              Thumbnail (Ảnh đại diện)
            </label>
            <div class="file-input-wrapper">
              <input
                type="file"
                id="thumbnailFile"
                class="file-input"
                @change="handleThumbnailUpload"
                accept="image/*"
              />
              <label for="thumbnailFile" class="file-input-label">
                <i class="fa-solid fa-upload"></i>
                <span v-if="!thumbnailFile">Chọn ảnh thumbnail</span>
                <span v-else class="file-selected">{{
                  thumbnailFile.name
                }}</span>
              </label>
            </div>
          </div>

          <!-- Thumbnail Preview -->
          <div
            v-if="thumbnailPreviewUrl"
            class="thumbnail-preview-section"
            data-aos="fade-up"
          >
            <img
              :src="thumbnailPreviewUrl"
              class="thumbnail-preview"
              alt="Thumbnail Preview"
            />
          </div>

          <!-- Episode Number -->
          <div class="form-group" data-aos="fade-up">
            <label for="episodeNumber" class="form-label">
              <i class="fa-solid fa-hashtag"></i>
              Số Tập
              <span class="required">*</span>
            </label>
            <input
              type="number"
              id="episodeNumber"
              class="form-input"
              v-model="episodeNumber"
              min="0"
              placeholder="Nhập số tập..."
              required
            />
          </div>

          <!-- Description -->
          <div class="form-group" data-aos="fade-up">
            <label for="videoDescription" class="form-label">
              <i class="fa-solid fa-align-left"></i>
              Mô tả Video
            </label>
            <textarea
              id="videoDescription"
              class="form-textarea"
              v-model="videoDescription"
              placeholder="Nhập mô tả cho video..."
              rows="5"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="form-actions" data-aos="fade-up">
            <button
              type="submit"
              :disabled="!videoFile || loading"
              class="submit-button"
            >
              <span class="btn-content">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <span>{{ loading ? 'Đang tải lên...' : 'Upload Video' }}</span>
              </span>
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="message" class="success-message" data-aos="fade-up">
            <i class="fa-solid fa-circle-check"></i>
            {{ message }}
          </div>
        </form>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenu } from '../../../stores/use-menu';
import api from '../../../services/axiosInterceptor';
import AOS from 'aos';
import 'aos/dist/aos.css';

const videoFile = ref(null);
const videoName = ref('');
const videoPreviewUrl = ref('');
const videoDescription = ref('');
const episodeNumber = ref(0);
const thumbnailFile = ref(null);
const thumbnailPreviewUrl = ref('');
const loading = ref(false);
const message = ref('');

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  videoFile.value = file;
  videoName.value = file.name.split('.').slice(0, -1).join('.');
  videoPreviewUrl.value = URL.createObjectURL(file);
};

const handleThumbnailUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  thumbnailFile.value = file;
  thumbnailPreviewUrl.value = URL.createObjectURL(file);
};

const removeVideo = () => {
  videoFile.value = null;
  videoName.value = '';
  videoPreviewUrl.value = '';
  videoDescription.value = '';
  episodeNumber.value = 0;
  thumbnailFile.value = null;
  thumbnailPreviewUrl.value = '';
};

const submitForm = async () => {
  if (!videoFile.value) {
    alert('Vui lòng chọn video trước khi upload.');
    return;
  }

  const formData = new FormData();
  formData.append('video', videoFile.value);
  formData.append('video_name', videoName.value);
  formData.append('description', videoDescription.value);
  formData.append('episode_number', episodeNumber.value);
  if (thumbnailFile.value) {
    formData.append('thumbnail', thumbnailFile.value);
  }

  loading.value = true;

  try {
    const response = await api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.message) {
      message.value = response.data.message;
      setTimeout(() => {
        removeVideo();
        message.value = '';
      }, 3000);
    }
  } catch (error) {
    console.error('Upload thất bại:', error);
    message.value = 'Không thể tải lên video.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-videos']);
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic',
  });
});
</script>

<style scoped>
/* ========== UPLOAD PAGE WRAPPER ========== */
.upload-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  padding: 80px 20px 60px;
}

.upload-container {
  max-width: 900px;
  margin: 0 auto;
}

.upload-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(12, 113, 61, 0.1);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
}

/* ========== CARD HEADER ========== */
.card-header {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  margin: -24px -24px 30px -24px;
  color: white;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.page-subtitle {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
}

/* ========== FORM STYLES ========== */
.upload-form {
  padding: 0 10px;
}

.form-group {
  margin-bottom: 28px;
}

.form-label {
  display: block;
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label i {
  color: #0c713d;
  font-size: 1.1rem;
}

.required {
  color: #ff4d4f;
  margin-left: 4px;
}

/* ========== FILE INPUT ========== */
.file-input-wrapper {
  position: relative;
}

.file-input {
  display: none;
}

.file-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #0c713d;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  color: #495057;
}

.file-input-label:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  border-color: #0a5a31;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.15);
}

.file-selected {
  color: #0c713d;
  font-weight: 600;
}

/* ========== FORM INPUT ========== */
.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #0c713d;
  background: white;
  box-shadow: 0 0 0 4px rgba(12, 113, 61, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  background: #fafafa;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #0c713d;
  background: white;
  box-shadow: 0 0 0 4px rgba(12, 113, 61, 0.1);
}

/* ========== VIDEO PREVIEW ========== */
.preview-section {
  margin-bottom: 28px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 2px solid #0c713d;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0c713d;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.video-preview-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.video-preview {
  width: 100%;
  height: auto;
  display: block;
  background: #000;
}

/* ========== THUMBNAIL PREVIEW ========== */
.thumbnail-preview-section {
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
}

.thumbnail-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border: 3px solid #0c713d;
}

/* ========== FORM ACTIONS - STYLED LIKE CONTACT BUTTON ========== */
.form-actions {
  margin-top: 35px;
  display: flex;
  justify-content: center;
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
  min-width: 200px;
}

.btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
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

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ========== SUCCESS MESSAGE ========== */
.success-message {
  margin-top: 24px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 2px solid #28a745;
  border-radius: 12px;
  color: #155724;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.4s ease;
}

.success-message i {
  font-size: 1.3rem;
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

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .upload-wrapper {
    padding: 70px 20px 50px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .form-label {
    font-size: 1rem;
  }

  .submit-button {
    padding: 14px 40px;
    font-size: 1.05rem;
    min-width: 180px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .upload-wrapper {
    padding: 60px 15px 40px;
  }

  .card-header {
    padding: 15px 0;
    margin: -20px -20px 25px -20px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-label {
    font-size: 0.95rem;
  }

  .form-input,
  .form-textarea {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  .file-input-label {
    padding: 16px 20px;
    font-size: 0.95rem;
  }

  .preview-section {
    padding: 16px;
  }

  .preview-title {
    font-size: 1.1rem;
  }

  .submit-button {
    width: 100%;
    padding: 14px 36px;
    font-size: 1rem;
    min-width: auto;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .upload-wrapper {
    padding: 50px 10px 30px;
  }

  .upload-card {
    border-radius: 16px;
  }

  .card-header {
    padding: 12px 0;
    margin: -16px -16px 20px -16px;
  }

  .page-title {
    font-size: 1.3rem;
    gap: 8px;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    font-size: 0.9rem;
    gap: 6px;
  }

  .form-input,
  .form-textarea {
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  .file-input-label {
    padding: 14px 18px;
    font-size: 0.9rem;
    flex-direction: column;
    gap: 8px;
  }

  .preview-section {
    padding: 14px;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .preview-title {
    font-size: 1rem;
  }

  .thumbnail-preview {
    max-height: 200px;
  }

  .submit-button {
    width: 100%;
    padding: 12px 24px;
    font-size: 0.95rem;
  }

  .btn-content {
    gap: 8px;
  }

  .success-message {
    padding: 14px 16px;
    font-size: 0.9rem;
  }
}
</style>
