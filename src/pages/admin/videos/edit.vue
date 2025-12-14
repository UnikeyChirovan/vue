<template>
  <div class="edit-wrapper">
    <div class="edit-container">
      <!-- Page Header Outside Card -->
      <div class="page-header">
        <h1 class="page-title">
          <i class="fa-solid fa-pen-to-square"></i>
          Chỉnh Sửa Video
        </h1>
        <p class="page-subtitle">Cập nhật thông tin video của bạn</p>
      </div>

      <!-- Content Card -->
      <a-card class="edit-card">
        <form @submit.prevent="submitForm" class="edit-form">
          <!-- Video Preview -->
          <div v-if="videoUrl" class="media-section" data-aos="fade-up">
            <h3 class="section-title">
              <i class="fa-solid fa-play-circle"></i>
              Video hiện tại
            </h3>
            <div class="video-preview-wrapper">
              <video controls class="video-preview" controlsList="nodownload">
                <source :src="videoUrl" type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          </div>

          <!-- Thumbnail Preview -->
          <div v-if="thumbnailUrl" class="media-section" data-aos="fade-up">
            <h3 class="section-title">
              <i class="fa-solid fa-image"></i>
              Thumbnail hiện tại
            </h3>
            <div class="thumbnail-preview-container">
              <img
                :src="thumbnailUrl"
                class="thumbnail-preview"
                alt="Current Thumbnail"
              />
            </div>
          </div>

          <!-- Video Name -->
          <div class="form-group" data-aos="fade-up">
            <label for="videoName" class="form-label">
              <i class="fa-solid fa-signature"></i>
              Tên Video
              <span class="required">*</span>
            </label>
            <input
              v-model="form.video_name"
              type="text"
              id="videoName"
              required
              class="form-input"
              placeholder="Nhập tên video..."
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
              v-model="form.episode_number"
              type="number"
              id="episodeNumber"
              class="form-input"
              min="0"
              required
              placeholder="Nhập số tập..."
            />
          </div>

          <!-- Description -->
          <div class="form-group" data-aos="fade-up">
            <label for="videoDescription" class="form-label">
              <i class="fa-solid fa-align-left"></i>
              Mô tả Video
            </label>
            <textarea
              v-model="form.description"
              id="videoDescription"
              rows="5"
              class="form-textarea"
              placeholder="Nhập mô tả cho video..."
            ></textarea>
          </div>

          <!-- New Thumbnail Upload -->
          <div class="form-group" data-aos="fade-up">
            <label for="videoThumbnail" class="form-label">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              Cập nhật Thumbnail
            </label>
            <div class="file-input-wrapper">
              <input
                type="file"
                id="videoThumbnail"
                class="file-input"
                @change="handleThumbnailUpload"
                accept="image/*"
              />
              <label for="videoThumbnail" class="file-input-label">
                <i class="fa-solid fa-upload"></i>
                <span v-if="!thumbnailFile"
                  >Chọn thumbnail mới (nếu muốn thay đổi)</span
                >
                <span v-else class="file-selected">{{
                  thumbnailFile.name
                }}</span>
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions" data-aos="fade-up">
            <button type="submit" class="save-button">
              <span class="btn-content">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>Lưu Thay Đổi</span>
              </span>
            </button>
            <button type="button" @click="cancelEdit" class="cancel-button">
              <span class="btn-content">
                <i class="fa-solid fa-xmark"></i>
                <span>Hủy</span>
              </span>
            </button>
          </div>
        </form>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';
import AOS from 'aos';
import 'aos/dist/aos.css';

const route = useRoute();
const router = useRouter();
const videoId = route.params.id;
const form = ref({
  video_name: '',
  video_path: '',
  description: '',
  episode_number: 1,
  thumbnail: '',
});

const thumbnailFile = ref(null);
const BaseURL = 'http://127.0.0.1:8000';
const videoUrl = computed(() =>
  form.value.video_path ? `${BaseURL}/storage/${form.value.video_path}` : null
);
const thumbnailUrl = computed(() =>
  form.value.thumbnail ? `${BaseURL}/storage/${form.value.thumbnail}` : null
);

const fetchVideoData = async () => {
  try {
    const response = await api.get(`videos/${videoId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải video.');
  }
};

const handleThumbnailUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    thumbnailFile.value = file;
  }
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    let hasChanges = false;

    formData.append('_method', 'PUT');

    if (form.value.video_name) {
      formData.append('video_name', form.value.video_name);
      hasChanges = true;
    }

    if (form.value.description) {
      formData.append('description', form.value.description);
      hasChanges = true;
    }

    if (form.value.episode_number || form.value.episode_number === 0) {
      formData.append('episode_number', form.value.episode_number);
      hasChanges = true;
    }

    if (thumbnailFile.value) {
      formData.append('thumbnail', thumbnailFile.value);
      hasChanges = true;
    }

    if (!hasChanges) {
      message.info('Không có thay đổi nào để cập nhật.');
      return;
    }

    await api.post(`videos/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    message.success('Video đã được cập nhật thành công.');
    router.push({ name: 'admin-videos' });
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật video.');
  }
};

const cancelEdit = () => {
  router.push({ name: 'admin-videos' });
};

onMounted(() => {
  fetchVideoData();
  useMenu().onSelectedKey(['admin-videos']);
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic',
  });
});
</script>

<style scoped>
/* ========== EDIT PAGE WRAPPER ========== */
.edit-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  padding: 80px 20px 60px;
}

.edit-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ========== PAGE HEADER - OUTSIDE CARD ========== */
.page-header {
  text-align: center;
  padding: 30px 35px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-radius: 24px 24px 0 0;
  color: white;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.2);
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

/* ========== EDIT CARD ========== */
.edit-card {
  background: white;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 10px 40px rgba(12, 113, 61, 0.1);
  border: 1px solid rgba(12, 113, 61, 0.1);
  border-top: none;
  overflow: hidden;
}

/* Override ant-design card styles */
.edit-card :deep(.ant-card-head) {
  display: none;
}

.edit-card :deep(.ant-card-body) {
  padding: 30px 24px;
}

/* ========== FORM STYLES ========== */
.edit-form {
  padding: 0 10px;
}

.media-section {
  margin-bottom: 35px;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 2px solid #0c713d;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0c713d;
  margin: 0 0 18px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.video-preview-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: #000;
}

.video-preview {
  width: 100%;
  height: auto;
  display: block;
  max-height: 500px;
}

.thumbnail-preview-container {
  display: flex;
  justify-content: center;
}

.thumbnail-preview {
  max-width: 100%;
  max-height: 500px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border: 3px solid #0c713d;
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

/* ========== FORM ACTIONS - STYLED LIKE CONTACT BUTTON ========== */
.form-actions {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.save-button,
.cancel-button {
  border: none;
  padding: 14px 48px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  min-width: 180px;
}

.btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.save-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
}

.save-button::before {
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

.save-button:hover::before {
  width: 300px;
  height: 300px;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.cancel-button {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(108, 117, 125, 0.3);
}

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

.cancel-button:hover::before {
  width: 300px;
  height: 300px;
}

.cancel-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(108, 117, 125, 0.4);
}

.save-button:active,
.cancel-button:active {
  transform: translateY(0);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .edit-wrapper {
    padding: 70px 20px 50px;
  }

  .page-header {
    padding: 25px 30px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.15rem;
  }

  .form-label {
    font-size: 1rem;
  }

  .save-button,
  .cancel-button {
    padding: 13px 40px;
    font-size: 1rem;
    min-width: 160px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .edit-wrapper {
    padding: 60px 15px 40px;
  }

  .page-header {
    padding: 20px 20px;
    border-radius: 16px 16px 0 0;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
  }

  .edit-card {
    border-radius: 0 0 16px 16px;
  }

  .edit-card :deep(.ant-card-body) {
    padding: 25px 20px;
  }

  .media-section {
    padding: 20px;
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 1.1rem;
    gap: 8px;
  }

  .thumbnail-preview {
    max-height: 350px;
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

  .form-actions {
    margin-top: 35px;
    gap: 15px;
  }

  .save-button,
  .cancel-button {
    padding: 12px 32px;
    font-size: 0.95rem;
    min-width: 140px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .edit-wrapper {
    padding: 50px 10px 30px;
  }

  .page-header {
    padding: 15px 15px;
  }

  .page-title {
    font-size: 1.3rem;
    gap: 8px;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .edit-card :deep(.ant-card-body) {
    padding: 20px 16px;
  }

  .media-section {
    padding: 16px;
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 1rem;
  }

  .thumbnail-preview {
    max-height: 280px;
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

  .form-actions {
    flex-direction: column;
    gap: 12px;
    margin-top: 30px;
  }

  .save-button,
  .cancel-button {
    width: 100%;
    padding: 12px 24px;
    font-size: 0.9rem;
    min-width: auto;
  }

  .btn-content {
    gap: 8px;
  }
}
</style>
