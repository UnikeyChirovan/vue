<template>
  <div class="modal-container">
    <div class="modal-backdrop" @click="handleCloseModal"></div>
    <div class="modal-content-container">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-icon">
            <i class="fas fa-image"></i>
          </div>
          <div class="modal-title">Cập Nhật Hình Bìa</div>
          <button @click="handleCloseModal" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Upload Section -->
          <div class="upload-section">
            <label for="coverImage" class="upload-label">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Chọn hình bìa từ thiết bị</span>
            </label>
            <input
              type="file"
              id="coverImage"
              ref="fileInput"
              class="hidden"
              accept="image/*"
              @change="getUploadedImage"
            />
          </div>

          <!-- Cropper Wrapper -->
          <div class="cropper-wrapper" v-if="uploadedImage">
            <Cropper
              class="cropper"
              ref="cropper"
              :src="uploadedImage"
              :stencil-props="{
                aspectRatio: 3 / 1,
              }"
            />
          </div>

          <!-- Empty State -->
          <div class="empty-state" v-else>
            <div class="empty-icon">
              <i class="fas fa-image"></i>
            </div>
            <p class="empty-text">Chưa có hình bìa nào được chọn</p>
            <p class="empty-subtext">Kích thước đề xuất: 1200x400 pixel</p>
          </div>

          <!-- Button Group -->
          <div class="button-group">
            <button
              @click="handleCloseModal"
              type="button"
              class="cancel-button"
            >
              <i class="fas fa-times-circle"></i>
              <span>Hủy</span>
            </button>
            <button
              v-if="uploadedImage"
              @click="crop"
              type="button"
              class="crop-button"
            >
              <i class="fas fa-check-circle"></i>
              <span>Cắt & Lưu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/axiosInterceptor';
import { Cropper } from 'vue-advanced-cropper';
import { useProfileStore } from '../stores/profile';
import 'vue-advanced-cropper/dist/style.css';
import { useGeneralStore } from '../stores/general';

const useGeneral = useGeneralStore();
const useProfile = useProfileStore();
const emit = defineEmits(['showModal']);

const handleCloseModal = () => {
  emit('showModal', false);
  uploadedImage.value = null;
};

let fileInput = ref(null);
let cropper = ref(null);
let uploadedImage = ref(null);

const getUploadedImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadedImage.value = URL.createObjectURL(file);
  }
};

const crop = async () => {
  const { coordinates, canvas } = cropper.value.getResult();

  let data = new FormData();
  data.append('file', fileInput.value.files[0] || '');
  data.append('height', coordinates.height || '');
  data.append('width', coordinates.width || '');
  data.append('left', coordinates.left !== 0 ? coordinates.left : '0');
  data.append('top', coordinates.top !== 0 ? coordinates.top : '0');

  try {
    const response = await api.post('link/upload/cover', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.url) {
      useProfile.updateCoverUrl(response.data.url);
      useGeneral.setCoverUpdated(true);
    }

    emit('showModal', false);
    uploadedImage.value = null;
  } catch (error) {
    console.error(
      'Lỗi khi upload cover:',
      error.response?.data || error.message
    );
  }
};
</script>

<style scoped>
/* ========== MODAL CONTAINER ========== */
.modal-container {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

html.dark-mode .modal-backdrop {
  background-color: rgba(0, 0, 0, 0.8);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 900px;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.modal-content {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
}

html.dark-mode .modal-content {
  background: #1e1e1e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* ========== MODAL HEADER ========== */
.modal-header {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  color: white;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

html.dark-mode .modal-header {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.header-icon {
  font-size: 28px;
  display: flex;
  align-items: center;
}

.modal-title {
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.close-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.close-button:active {
  transform: rotate(90deg) scale(0.95);
}

/* ========== MODAL BODY ========== */
.modal-body {
  padding: 28px;
  background: white;
}

html.dark-mode .modal-body {
  background: #1e1e1e;
}

/* ========== UPLOAD SECTION ========== */
.upload-section {
  margin-bottom: 24px;
}

.upload-label {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
  border: 2px dashed #0891b2;
  padding: 16px 24px;
  border-radius: 12px;
  color: #0891b2;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
}

html.dark-mode .upload-label {
  background: linear-gradient(135deg, #164e63 0%, #155e75 100%);
  border-color: #06b6d4;
  color: #06b6d4;
}

.upload-label:hover {
  background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%);
  border-color: #0e7490;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.2);
}

html.dark-mode .upload-label:hover {
  background: linear-gradient(135deg, #155e75 0%, #0e7490 100%);
  border-color: #22d3ee;
}

.upload-label i {
  font-size: 20px;
}

.hidden {
  display: none;
}

/* ========== CROPPER WRAPPER ========== */
.cropper-wrapper {
  max-width: 100%;
  margin: 0 auto 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

html.dark-mode .cropper-wrapper {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.cropper {
  width: 100%;
  height: 400px;
  background: #f9fafb;
}

html.dark-mode .cropper {
  background: #252525;
}

html.dark-mode :deep(.vue-advanced-cropper__background) {
  background: #252525;
}

html.dark-mode :deep(.vue-advanced-cropper__foreground) {
  background: rgba(255, 255, 255, 0.05);
}

/* ========== EMPTY STATE ========== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 24px;
}

.empty-icon {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

html.dark-mode .empty-icon {
  color: #4b5563;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 8px 0;
}

html.dark-mode .empty-text {
  color: #9ca3af;
}

.empty-subtext {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

html.dark-mode .empty-subtext {
  color: #6b7280;
}

/* ========== BUTTON GROUP ========== */
.button-group {
  display: flex;
  gap: 12px;
}

.cancel-button,
.crop-button {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.cancel-button::before,
.crop-button::before {
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

.cancel-button:hover::before,
.crop-button:hover::before {
  width: 300px;
  height: 300px;
}

.cancel-button {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #4b5563;
}

html.dark-mode .cancel-button {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  color: #d1d5db;
}

.cancel-button:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

html.dark-mode .cancel-button:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
}

.crop-button {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
}

html.dark-mode .crop-button {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.crop-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(8, 145, 178, 0.4);
}

html.dark-mode .crop-button:hover {
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
}

.cancel-button:active,
.crop-button:active {
  transform: translateY(0);
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 768px) {
  .modal-content-container {
    max-width: 100%;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .header-icon {
    font-size: 24px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-body {
    padding: 24px;
  }

  .cropper {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .modal-container {
    padding: 12px;
  }

  .modal-content {
    border-radius: 16px;
  }

  .modal-header {
    padding: 18px 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .upload-label {
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }

  .cropper {
    height: 250px;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .cancel-button,
  .crop-button {
    padding: 12px 20px;
  }
}
</style>
