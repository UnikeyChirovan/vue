<template>
  <div class="edit-notification-wrapper">
    <n-card class="edit-card">
      <template #header>
        <div class="card-header">
          <i class="fa-solid fa-edit"></i>
          <h1>Chỉnh Sửa Thông Báo</h1>
        </div>
      </template>

      <n-form
        ref="formRef"
        :model="form"
        label-placement="top"
        size="large"
        class="edit-form"
      >
        <!-- Tiêu đề -->
        <n-form-item label="Tiêu Đề" class="form-item">
          <div class="input-wrapper">
            <i class="fa-solid fa-heading input-icon"></i>
            <n-input
              v-model:value="form.title"
              placeholder="Nhập tiêu đề thông báo"
              class="modern-input"
            />
          </div>
        </n-form-item>

        <!-- Nội dung thông báo -->
        <n-form-item label="Nội Dung" class="form-item">
          <div class="content-section">
            <div
              v-for="(paragraph, index) in form.content"
              :key="index"
              class="content-card"
            >
              <div class="card-header-section">
                <span class="paragraph-number">Đoạn {{ index + 1 }}</span>
                <div class="card-actions">
                  <button
                    @click="removeParagraph(index)"
                    type="button"
                    class="action-btn delete-btn-small"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                  <button
                    @click="addParagraph(index)"
                    type="button"
                    class="action-btn add-btn-small"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              <n-input
                type="textarea"
                v-model:value="form.content[index]"
                placeholder="Nhập nội dung đoạn văn"
                :rows="4"
                class="textarea-modern"
              />
            </div>
          </div>
        </n-form-item>

        <!-- Hình ảnh hiện tại -->
        <n-form-item
          label="Hình Ảnh Hiện Tại"
          class="form-item"
          v-if="imageUrl"
        >
          <div class="image-preview-container current-image-container">
            <div class="image-badge">Hiện Tại</div>
            <img :src="imageUrl" class="preview-image" alt="Current Image" />
          </div>
        </n-form-item>

        <!-- Hình ảnh mới -->
        <n-form-item label="Tải Hình Ảnh Mới" class="form-item">
          <div class="upload-section">
            <div
              v-if="previewImage"
              class="image-preview-container new-image-container"
            >
              <div class="image-badge new-badge">Mới</div>
              <img :src="previewImage" class="preview-image" alt="New Image" />
            </div>
            <label class="upload-label">
              <span class="upload-content">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <span>Chọn Hình Ảnh</span>
              </span>
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden-file-input"
              />
            </label>
          </div>
        </n-form-item>

        <!-- Trang -->
        <n-form-item label="Chọn Trang" class="form-item">
          <div class="input-wrapper">
            <i class="fa-solid fa-file input-icon"></i>
            <n-select
              v-model:value="form.page"
              :options="pageOptions"
              placeholder="Chọn trang hiển thị"
              class="modern-select"
            />
          </div>
        </n-form-item>

        <!-- Nút cập nhật -->
        <div class="button-group">
          <button @click="submitText" type="button" class="submit-button">
            <span class="submit-content">
              <i class="fa-solid fa-check-circle"></i>
              <span>Cập Nhật Thông Báo</span>
            </span>
          </button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import api from '../../../services/axiosInterceptor';
import { useRoute } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';
import { useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const formRef = ref(null);
const message = useMessage();
const backendUrl = 'http://127.0.0.1:8000';

const form = ref({
  title: '',
  content: [],
  page: '',
  image_paths: [],
});

const imageUrl = ref(null);
const previewImage = ref(null);
const imageFile = ref(null);

const id = route.params.id;

onMounted(async () => {
  try {
    const response = await api.get(`/user-notifications/${id}`);
    if (response.status === 200) {
      const notificationDetail = response.data;
      form.value.title = notificationDetail.title;
      form.value.content = notificationDetail.content.split('\n');
      form.value.page = notificationDetail.page;
      form.value.image_paths = notificationDetail.image_paths;
      if (notificationDetail.image_paths.length > 0) {
        imageUrl.value = `${backendUrl}/storage/${notificationDetail.image_paths[0]}`;
      }
    }
  } catch (error) {
    message.error('Failed to load notification data.');
  }
  await fetchPageOptions();
  useMenu().onSelectedKey(['admin-news']);
});

const pageOptions = ref([]);

const fetchPageOptions = async () => {
  try {
    const response = await api.get('/user-notifications/page-options');
    if (response.status === 200) {
      pageOptions.value = response.data.pageOptions;
    } else {
      message.error('Không thể tải danh sách trang.');
    }
  } catch (error) {
    message.error('Lỗi khi tải danh sách trang.');
  }
};

const addParagraph = (index) => {
  form.value.content.splice(index + 1, 0, '');
};

const removeParagraph = (index) => {
  form.value.content.splice(index, 1);
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

const submitText = async () => {
  const formData = new FormData();
  formData.append('_method', 'PUT');

  formData.append('title', form.value.title);
  formData.append('content', form.value.content.join('\n'));
  formData.append('page', form.value.page);

  if (imageFile.value) {
    formData.append('images[]', imageFile.value);
  }

  try {
    const response = await api.post(
      `/user-notifications/${id}/text`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    if (response.status === 200) {
      message.success('Cập nhật thành công!');
      router.push({ name: 'admin-news' });
    } else {
      message.error('Cập nhật thất bại.');
    }
  } catch (error) {
    message.error('Lỗi khi cập nhật.');
  }
};
</script>

<style scoped>
/* ========== WRAPPER ========== */
.edit-notification-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

/* ========== CARD STYLING ========== */
.edit-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  background: white;
}

.edit-card :deep(.n-card-header) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 30px;
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: white;
}

.card-header i {
  font-size: 2.5rem;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
}

/* ========== FORM STYLING ========== */
.edit-form {
  padding: 40px;
}

.form-item {
  margin-bottom: 35px;
}

.form-item :deep(.n-form-item-label) {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0c713d;
  margin-bottom: 12px;
}

/* ========== INPUT WRAPPER ========== */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 1.2rem;
  color: #0c713d;
  z-index: 1;
}

.modern-input,
.modern-select {
  width: 100%;
  padding-left: 50px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.modern-input:focus,
.modern-select:focus {
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

/* ========== CONTENT SECTION ========== */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
}

.content-card {
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 25px;
  border: 2px solid #e8f5e9;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  width: 100%;
}

.content-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(12, 113, 61, 0.15);
}

.card-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.paragraph-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0c713d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.paragraph-number::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #0c713d, #0a5a31);
  border-radius: 2px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 1rem;
  color: white;
}

.action-btn::before {
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
    width 0.6s,
    height 0.6s;
}

.action-btn:hover::before {
  width: 100px;
  height: 100px;
}

.delete-btn-small {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.delete-btn-small:hover {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 6px 16px rgba(255, 77, 79, 0.4);
}

.add-btn-small {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.add-btn-small:hover {
  transform: scale(1.1) rotate(-10deg);
  box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
}

.action-btn:active {
  transform: scale(0.95);
}

.textarea-modern {
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  font-size: 1rem;
  line-height: 1.6;
  width: 100%;
}

.textarea-modern:focus {
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

/* ========== IMAGE STYLING ========== */
.image-preview-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.image-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.new-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.image-preview-container:hover .preview-image {
  transform: scale(1.05);
}

/* ========== UPLOAD SECTION ========== */
.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.upload-label {
  cursor: pointer;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.upload-label::before {
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

.upload-label:hover::before {
  width: 300px;
  height: 300px;
}

.upload-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.upload-label:active {
  transform: translateY(0);
}

.upload-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  font-weight: 700;
  font-size: 1rem;
  color: white;
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
}

.upload-content i {
  font-size: 1.3rem;
}

.hidden-file-input {
  display: none;
}

/* ========== BUTTON GROUP ========== */
.button-group {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.submit-button {
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  width: 400px;
  height: 400px;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.5);
}

.submit-button:active {
  transform: translateY(0);
}

.submit-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 48px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
}

.submit-content i {
  font-size: 1.3rem;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .edit-notification-wrapper {
    padding: 30px 15px;
  }

  .card-header h1 {
    font-size: 1.7rem;
  }

  .card-header i {
    font-size: 2.2rem;
  }

  .edit-form {
    padding: 30px;
  }

  .content-card {
    padding: 20px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .edit-notification-wrapper {
    padding: 20px 10px;
  }

  .edit-card {
    border-radius: 16px;
  }

  .edit-card :deep(.n-card-header) {
    padding: 20px;
  }

  .card-header {
    flex-direction: column;
    gap: 10px;
  }

  .card-header h1 {
    font-size: 1.4rem;
    text-align: center;
  }

  .card-header i {
    font-size: 2rem;
  }

  .edit-form {
    padding: 20px;
  }

  .form-item {
    margin-bottom: 25px;
  }

  .form-item :deep(.n-form-item-label) {
    font-size: 1rem;
  }

  .content-card {
    padding: 18px;
  }

  .card-header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .paragraph-number {
    font-size: 1rem;
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .image-preview-container {
    max-width: 100%;
  }

  .upload-content {
    padding: 12px 28px;
    font-size: 0.95rem;
  }

  .submit-content {
    padding: 14px 36px;
    font-size: 1rem;
  }

  .submit-button {
    width: 100%;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .edit-notification-wrapper {
    padding: 15px 8px;
  }

  .edit-card {
    border-radius: 12px;
  }

  .edit-card :deep(.n-card-header) {
    padding: 15px;
  }

  .card-header h1 {
    font-size: 1.2rem;
  }

  .card-header i {
    font-size: 1.8rem;
  }

  .edit-form {
    padding: 15px;
  }

  .form-item {
    margin-bottom: 20px;
  }

  .form-item :deep(.n-form-item-label) {
    font-size: 0.95rem;
    margin-bottom: 10px;
  }

  .input-icon {
    font-size: 1.1rem;
    left: 12px;
  }

  .modern-input,
  .modern-select {
    padding-left: 42px;
    font-size: 0.9rem;
  }

  .content-card {
    padding: 15px;
  }

  .paragraph-number {
    font-size: 0.95rem;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }

  .textarea-modern {
    font-size: 0.9rem;
  }

  .image-badge {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 0.75rem;
  }

  .upload-content {
    padding: 10px 24px;
    font-size: 0.9rem;
  }

  .upload-content i {
    font-size: 1.1rem;
  }

  .submit-content {
    padding: 12px 28px;
    font-size: 0.95rem;
  }

  .submit-content i {
    font-size: 1.1rem;
  }
}
</style>
