<template>
  <div class="modal-container">
    <div class="modal-backdrop"></div>
    <div class="modal-content-container">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Update profile picture</div>
          <div @click="handleCloseModal" class="close-button">
            <i class="fas fa-times"></i>
          </div>
        </div>

        <div class="modal-body">
          <div class="upload-section">
            <label for="image" class="upload-label">
              <i class="fas fa-plus"></i> Upload photo
            </label>
            <input
              type="file"
              id="image"
              ref="fileInput"
              class="hidden"
              @change="getUploadedImage"
            />
          </div>

          <div class="cropper-wrapper">
            <Cropper
              class="cropper"
              ref="cropper"
              :stencil-component="CircleStencil"
              :src="uploadedImage"
            />
          </div>

          <div
            class="button-group"
            :class="uploadedImage ? 'button-group-spacing' : ''"
          >
            <button
              @click="$emit('showModal', false)"
              type="button"
              class="cancel-button"
            >
              Cancel
            </button>
            <button
              v-if="uploadedImage"
              @click="crop"
              type="button"
              class="crop-button"
            >
              Crop Image
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
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import { useProfileStore } from '../stores/profile';
import 'vue-advanced-cropper/dist/style.css';
import { useGeneralStore } from '../stores/general';
const useGeneral = useGeneralStore();
const useProfile = useProfileStore();
const emit = defineEmits(['showModal']);
const handleCloseModal = () => {
  emit('showModal', false);
};

// Khai báo các biến reactive
let fileInput = ref(null);
let cropper = ref(null);
let uploadedImage = ref(null);
let croppedImageData = {
  file: null,
  imageUrl: null,
  height: null,
  width: null,
  left: null,
  top: null,
};

const getUploadedImage = (e) => {
  const file = e.target.files[0];
  uploadedImage.value = URL.createObjectURL(file);
};

const crop = async () => {
  const { coordinates, canvas } = cropper.value.getResult();
  croppedImageData.imageUrl = canvas.toDataURL();
  let data = new FormData();
  data.append('file', fileInput.value.files[0] || '');
  data.append('height', coordinates.height || '');
  data.append('width', coordinates.width || '');
  data.append('left', coordinates.left !== 0 ? coordinates.left : '0');
  data.append('top', coordinates.top !== 0 ? coordinates.top : '0');
  try {
    const response = await api.post('link/upload/avatar', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.url) {
      useProfile.updateAvatarUrl(response.data.url);
      useGeneral.setAvatarUpdated(true);
    }
    emit('showModal', false);
  } catch (error) {
    console.error(
      'Lỗi khi upload avatar:',
      error.response?.data || error.message
    );
  }
};
</script>
<style scoped>
.modal-container {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.6);
}

.modal-content-container {
  position: fixed;
  inset: 0;
  z-index: 10;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #d1d5db;
}

.modal-title {
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  width: 100%;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #e5e7eb;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #d1d5db;
}

.modal-body {
  padding: 16px;
  background-color: white;
}

.upload-section {
  margin-bottom: 16px;
}

.upload-label {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7f3ff;
  padding: 10px;
  border-radius: 8px;
  color: #1977f2;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.upload-label:hover {
  background-color: #dbe7f2;
}

.cropper-wrapper {
  max-width: 350px;
  margin: 0 auto;
}

.cropper {
  object-fit: cover;
}

.button-group {
  display: flex;
  gap: 16px;
}

.button-group-spacing {
  padding-top: 16px;
}

.cancel-button,
.crop-button {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button {
  background-color: #f3f4f6;
  color: #6b7280;
}

.cancel-button:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.crop-button {
  background-color: #3b82f6;
  color: white;
}

.crop-button:hover {
  background-color: #2563eb;
}
.hidden {
  visibility: hidden; /**xử lý ẩn input mà vẫn giữ tồn tại */
}
</style>
