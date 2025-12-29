<template>
  <div class="create-notification-wrapper">
    <a-card class="create-card">
      <template #title>
        <div class="card-header">
          <i class="fa-solid fa-file-circle-plus"></i>
          <h1>Tạo Thông Báo Mới</h1>
        </div>
      </template>

      <form @submit.prevent="submitForm" class="create-form">
        <!-- Tiêu đề -->
        <div class="form-section">
          <label for="title" class="form-label">
            <i class="fa-solid fa-heading"></i>
            Tiêu Đề Thông Báo
          </label>
          <input
            v-model="form.title"
            type="text"
            id="title"
            required
            class="form-input"
            placeholder="Nhập tiêu đề thông báo..."
          />
        </div>

        <!-- Trang -->
        <div class="form-section">
          <label for="page" class="form-label">
            <i class="fa-solid fa-file-lines"></i>
            Chọn Trang Hiển Thị
          </label>
          <select v-model="form.page" id="page" required class="form-select">
            <option value="">-- Chọn trang --</option>
            <option
              v-for="option in pageOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Loại thông báo -->
        <div class="form-section">
          <label for="type" class="form-label">
            <i class="fa-solid fa-layer-group"></i>
            Loại Thông Báo
          </label>
          <select v-model="form.type" id="type" required class="form-select">
            <option value="normal">Thông Báo Thường</option>
            <option value="voting">Thông Báo Bình Chọn</option>
          </select>
        </div>

        <!-- Tải lên file (chỉ cho normal) -->
        <div v-if="form.type === 'normal'" class="form-section">
          <label for="file" class="form-label">
            <i class="fa-solid fa-file-import"></i>
            Tải Lên File Text
          </label>
          <div class="file-upload-container">
            <label for="file" class="file-upload-label">
              <span class="upload-content">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <span>Chọn File .txt</span>
              </span>
            </label>
            <input
              @change="handleFileUpload"
              type="file"
              id="file"
              accept=".txt"
              class="hidden-input"
            />
          </div>
        </div>

        <!-- Tải lên hình ảnh -->
        <div class="form-section">
          <label for="images" class="form-label">
            <i class="fa-solid fa-images"></i>
            Tải Lên Hình Ảnh
          </label>
          <div class="file-upload-container">
            <label for="images" class="file-upload-label">
              <span class="upload-content">
                <i class="fa-solid fa-camera"></i>
                <span>Chọn Hình Ảnh</span>
              </span>
            </label>
            <input
              @change="handleImageUpload"
              type="file"
              id="images"
              accept="image/*"
              multiple
              class="hidden-input"
            />
          </div>
        </div>

        <!-- Hiển thị hình ảnh đã chọn -->
        <div class="image-preview-section" v-if="imagePreviews.length > 0">
          <label class="form-label">
            <i class="fa-solid fa-image"></i>
            Hình Ảnh Đã Chọn
          </label>
          <div class="image-grid">
            <div
              v-for="(image, index) in imagePreviews"
              :key="index"
              class="image-card"
            >
              <img :src="image" alt="Image Preview" class="preview-image" />
              <div class="image-overlay">
                <span>Ảnh {{ index + 1 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Normal Content - chỉ hiện khi type = 'normal' -->
        <div v-if="form.type === 'normal'" class="content-section">
          <label class="form-label">
            <i class="fa-solid fa-align-left"></i>
            Nội Dung Thông Báo
          </label>
          <div class="paragraphs-container">
            <div
              v-for="(section, index) in form.content"
              :key="index"
              class="paragraph-card"
            >
              <div class="paragraph-header">
                <span class="paragraph-title">Đoạn {{ index + 1 }}</span>
                <button
                  @click="removeSection(index)"
                  type="button"
                  class="remove-btn"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span>Xóa</span>
                </button>
              </div>
              <textarea
                v-model="form.content[index]"
                rows="4"
                class="paragraph-textarea"
                placeholder="Nhập nội dung đoạn văn..."
              ></textarea>
            </div>
          </div>

          <div class="paragraph-actions">
            <button @click="addSection" type="button" class="add-paragraph-btn">
              <span class="btn-content">
                <i class="fa-solid fa-plus"></i>
                <span>Thêm Đoạn</span>
              </span>
            </button>
            <button
              @click="showConfirmDelete"
              type="button"
              class="delete-all-btn"
            >
              <span class="btn-content">
                <i class="fa-solid fa-trash-can"></i>
                <span>Xóa Toàn Bộ</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Voting Content - chỉ hiện khi type = 'voting' -->
        <div v-if="form.type === 'voting'" class="voting-form-section">
          <!-- Câu hỏi -->
          <div class="form-section">
            <label for="voting_question" class="form-label">
              <i class="fa-solid fa-circle-question"></i>
              Câu Hỏi Bình Chọn
            </label>
            <textarea
              v-model="form.voting_question"
              id="voting_question"
              rows="3"
              class="form-textarea"
              placeholder="Nhập câu hỏi bình chọn..."
              required
            ></textarea>
          </div>

          <!-- Các lựa chọn -->
          <div class="form-section">
            <label class="form-label">
              <i class="fa-solid fa-list-check"></i>
              Các Lựa Chọn (Tối thiểu 2, tối đa 10)
            </label>
            <div class="voting-options-container">
              <div
                v-for="(option, index) in form.voting_options"
                :key="index"
                class="voting-option-item"
              >
                <span class="option-number">{{ index + 1 }}</span>
                <input
                  v-model="option.text"
                  type="text"
                  class="option-input"
                  :placeholder="`Lựa chọn ${index + 1}`"
                  required
                />
                <button
                  v-if="form.voting_options.length > 2"
                  @click="removeVotingOption(index)"
                  type="button"
                  class="option-remove-btn"
                >
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
            <button
              v-if="form.voting_options.length < 10"
              @click="addVotingOption"
              type="button"
              class="add-option-btn"
            >
              <span class="btn-content">
                <i class="fa-solid fa-plus-circle"></i>
                <span>Thêm Lựa Chọn</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Nút gởi -->
        <div class="submit-section">
          <button type="submit" class="submit-btn">
            <span class="submit-content">
              <i class="fa-solid fa-paper-plane"></i>
              <span>Tạo Thông Báo</span>
            </span>
          </button>
        </div>
      </form>
    </a-card>

    <a-modal
      v-model:visible="isConfirmVisible"
      title="Xác Nhận Xóa Toàn Bộ"
      @ok="removeAllSections"
      @cancel="handleCancelDelete"
      class="confirm-modal"
    >
      <div class="modal-content">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>Bạn có chắc chắn muốn xóa toàn bộ nội dung các đoạn không?</p>
      </div>
    </a-modal>

    <!-- Scroll Buttons -->
    <ScrollButtons>
      <template v-slot:top-button>
        <a-button type="primary"
          ><i class="fa-solid fa-arrow-down"></i
        ></a-button>
      </template>
      <template v-slot:bottom-button>
        <a-button type="primary"><i class="fa-solid fa-arrow-up"></i></a-button>
      </template>
    </ScrollButtons>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenu } from '../../../stores/use-menu';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import ScrollButtons from '../../../components/ScrollButtons.vue';

// Form state
const form = ref({
  title: '',
  content: [''],
  images: [],
  page: '',
  type: 'normal', // 'normal' hoặc 'voting'
  voting_question: '',
  voting_options: [{ text: '' }, { text: '' }],
});

const imagePreviews = ref([]);
const isConfirmVisible = ref(false);
const pageOptions = ref([]);

// Fetch page options
const fetchPageOptions = async () => {
  try {
    const response = await api.get('/user-notifications/page-options');
    pageOptions.value = response.data.pageOptions;
  } catch (error) {
    message.error('Không thể lấy danh sách trang');
  }
};

// Normal content functions
const addSection = () => {
  form.value.content.push('');
};

const removeSection = (index) => {
  form.value.content.splice(index, 1);
};

const showConfirmDelete = () => {
  isConfirmVisible.value = true;
};

const removeAllSections = () => {
  form.value.content = [''];
  message.success('Đã xóa toàn bộ nội dung các đoạn');
  isConfirmVisible.value = false;
};

const handleCancelDelete = () => {
  isConfirmVisible.value = false;
};

// Voting functions
const addVotingOption = () => {
  if (form.value.voting_options.length < 10) {
    form.value.voting_options.push({ text: '' });
  } else {
    message.warning('Tối đa 10 lựa chọn');
  }
};

const removeVotingOption = (index) => {
  if (form.value.voting_options.length > 2) {
    form.value.voting_options.splice(index, 1);
  } else {
    message.warning('Cần ít nhất 2 lựa chọn');
  }
};

// File upload functions
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result.split('\n\n');
      form.value.content = content;
      message.success('Nội dung của tệp đã được nhập vào dưới dạng các đoạn');
    };
    reader.readAsText(file);
  }
};

const handleImageUpload = (event) => {
  const files = event.target.files;
  form.value.images = Array.from(files);

  imagePreviews.value = [];
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(files[i]);
  }
};

// Submit form
// Trong admin-news-create.vue, sửa hàm submitForm:

const submitForm = async () => {
  // Validate based on type
  if (form.value.type === 'voting') {
    if (!form.value.voting_question.trim()) {
      message.error('Vui lòng nhập câu hỏi bình chọn');
      return;
    }

    const validOptions = form.value.voting_options.filter((opt) =>
      opt.text.trim()
    );
    if (validOptions.length < 2) {
      message.error('Vui lòng nhập ít nhất 2 lựa chọn');
      return;
    }
  }

  const formData = new FormData();
  formData.append('title', form.value.title);
  formData.append('page', form.value.page);
  formData.append('type', form.value.type);

  if (form.value.type === 'normal') {
    formData.append('content', form.value.content.join('\n\n'));
  } else if (form.value.type === 'voting') {
    formData.append('voting_question', form.value.voting_question);
    form.value.voting_options.forEach((option, index) => {
      if (option.text.trim()) {
        formData.append(`voting_options[${index}][text]`, option.text);
      }
    });
  }

  form.value.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });

  try {
    const response = await api.post('/user-notifications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    message.success('Thông báo đã được tạo thành công');

    // THÊM VÀO localStorage
    const newNotification = response.data; // API trả về notification mới tạo

    // Cập nhật danh sách notifications
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const allNotifications = JSON.parse(storedNotifications);
      allNotifications.unshift(newNotification); // Thêm vào đầu mảng
      localStorage.setItem('notifications', JSON.stringify(allNotifications));
    }

    // Lấy chi tiết notification và lưu vào localStorage
    try {
      const detailResponse = await api.get(
        `/user-notifications/${newNotification.id}`
      );
      const notificationDetails = JSON.parse(
        localStorage.getItem('notification_detail') || '{}'
      );
      notificationDetails[newNotification.id] = detailResponse.data;
      localStorage.setItem(
        'notification_detail',
        JSON.stringify(notificationDetails)
      );
    } catch (error) {
      console.error('Không thể lấy chi tiết notification:', error);
    }

    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tạo thông báo');
  }
};

const resetForm = () => {
  form.value = {
    title: '',
    content: [''],
    images: [],
    page: '',
    type: 'normal',
    voting_question: '',
    voting_options: [{ text: '' }, { text: '' }],
  };
  imagePreviews.value = [];
};

onMounted(() => {
  fetchPageOptions();
  useMenu().onSelectedKey(['admin-news']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.create-notification-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

/* ========== CARD STYLING ========== */
.create-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.create-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  padding: 30px;
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

.card-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
}

/* ========== FORM STYLING ========== */
.create-form {
  padding: 40px;
}

.form-section {
  margin-bottom: 30px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0c713d;
  margin-bottom: 12px;
}

.form-label i {
  font-size: 1.2rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 14px 18px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
  line-height: 1.6;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230c713d' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 45px;
}

/* ========== FILE UPLOAD ========== */
.file-upload-container {
  display: flex;
  justify-content: center;
}

.file-upload-label {
  cursor: pointer;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.file-upload-label::before {
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

.file-upload-label:hover::before {
  width: 300px;
  height: 300px;
}

.file-upload-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.file-upload-label:active {
  transform: translateY(0);
}

.upload-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
}

.upload-content i {
  font-size: 1.3rem;
}

.hidden-input {
  display: none;
}

/* ========== IMAGE PREVIEW ========== */
.image-preview-section {
  margin-bottom: 30px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.image-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.image-card:hover {
  transform: scale(1.05);
}

.preview-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(12, 113, 61, 0.9), transparent);
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: 700;
}

/* ========== CONTENT SECTION (NORMAL) ========== */
.content-section {
  margin-bottom: 30px;
}

.paragraphs-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 15px;
  margin-bottom: 20px;
}

.paragraph-card {
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 20px;
  border: 2px solid #e8f5e9;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.paragraph-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.15);
}

.paragraph-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.paragraph-title {
  font-weight: 700;
  color: #0c713d;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.paragraph-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #0c713d, #0a5a31);
  border-radius: 2px;
}

.remove-btn {
  border: none;
  border-radius: 50px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 0.9rem;
}

.remove-btn::before {
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

.remove-btn:hover::before {
  width: 150px;
  height: 150px;
}

.remove-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
}

.remove-btn:active {
  transform: translateY(0);
}

.paragraph-textarea {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
  line-height: 1.6;
}

.paragraph-textarea:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

/* ========== PARAGRAPH ACTIONS ========== */
.paragraph-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.add-paragraph-btn,
.delete-all-btn {
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.add-paragraph-btn::before,
.delete-all-btn::before {
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

.add-paragraph-btn:hover::before,
.delete-all-btn:hover::before {
  width: 300px;
  height: 300px;
}

.add-paragraph-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
}

.delete-all-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
}

.add-paragraph-btn:hover,
.delete-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.add-paragraph-btn:active,
.delete-all-btn:active {
  transform: translateY(0);
}

/* ========== VOTING FORM SECTION ========== */
.voting-form-section {
  margin-bottom: 30px;
}

.voting-options-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.voting-option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 15px;
  border: 2px solid #e8f5e9;
  transition: all 0.3s ease;
}

.voting-option-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.1);
}

.option-number {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.option-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: white;
}

.option-input:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

.option-remove-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.option-remove-btn::before {
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

.option-remove-btn:hover::before {
  width: 80px;
  height: 80px;
}

.option-remove-btn:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
}

.option-remove-btn:active {
  transform: scale(0.95) rotate(90deg);
}

.option-remove-btn i {
  font-size: 1.1rem;
}

.add-option-btn {
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(82, 196, 26, 0.3);
  width: 100%;
}

.add-option-btn::before {
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

.add-option-btn:hover::before {
  width: 300px;
  height: 300px;
}

.add-option-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(82, 196, 26, 0.4);
}

.add-option-btn:active {
  transform: translateY(0);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 1rem;
  color: white;
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
}

/* ========== SUBMIT SECTION ========== */
.submit-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.submit-btn {
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
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

.submit-btn:hover::before {
  width: 400px;
  height: 400px;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.5);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 48px;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
}

.submit-content i {
  font-size: 1.4rem;
}

/* ========== MODAL STYLING ========== */
.confirm-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
}

.confirm-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 700;
}

.modal-content {
  text-align: center;
  padding: 20px 0;
}

.modal-content i {
  font-size: 4rem;
  color: #ff4d4f;
  margin-bottom: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.modal-content p {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1024px) {
  .create-notification-wrapper {
    padding: 30px 15px;
  }

  .card-header h1 {
    font-size: 1.7rem;
  }

  .card-header i {
    font-size: 2.2rem;
  }

  .create-form {
    padding: 30px;
  }

  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .create-notification-wrapper {
    padding: 20px 10px;
  }

  .create-card {
    border-radius: 16px;
  }

  .create-card :deep(.ant-card-head) {
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

  .create-form {
    padding: 20px;
  }

  .form-section {
    margin-bottom: 25px;
  }

  .form-label {
    font-size: 1rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  .upload-content {
    padding: 12px 24px;
    font-size: 0.95rem;
  }

  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }

  .preview-image {
    height: 120px;
  }

  .paragraph-card {
    padding: 18px;
  }

  .paragraph-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .remove-btn {
    align-self: flex-end;
  }

  .paragraph-actions {
    flex-direction: column;
  }

  .add-paragraph-btn,
  .delete-all-btn {
    width: 100%;
  }

  .btn-content {
    justify-content: center;
  }

  .voting-option-item {
    padding: 12px;
  }

  .option-number {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .option-input {
    padding: 10px 14px;
    font-size: 0.95rem;
  }

  .option-remove-btn {
    width: 32px;
    height: 32px;
  }

  .option-remove-btn i {
    font-size: 1rem;
  }

  .submit-btn {
    width: 100%;
  }

  .submit-content {
    padding: 14px 36px;
    font-size: 1.1rem;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .create-notification-wrapper {
    padding: 15px 8px;
  }

  .create-card {
    border-radius: 12px;
  }

  .create-card :deep(.ant-card-head) {
    padding: 15px;
  }

  .card-header h1 {
    font-size: 1.2rem;
  }

  .card-header i {
    font-size: 1.8rem;
  }

  .create-form {
    padding: 15px;
  }

  .form-section {
    margin-bottom: 20px;
  }

  .form-label {
    font-size: 0.95rem;
  }

  .form-label i {
    font-size: 1.1rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  .upload-content {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .upload-content i {
    font-size: 1.1rem;
  }

  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }

  .preview-image {
    height: 100px;
  }

  .image-overlay {
    padding: 8px;
    font-size: 0.85rem;
  }

  .paragraph-card {
    padding: 15px;
  }

  .paragraph-title {
    font-size: 1rem;
  }

  .remove-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .paragraph-textarea {
    padding: 10px;
    font-size: 0.9rem;
  }

  .voting-options-container {
    gap: 12px;
  }

  .voting-option-item {
    padding: 10px;
    gap: 10px;
  }

  .option-number {
    width: 30px;
    height: 30px;
    font-size: 0.85rem;
  }

  .option-input {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .option-remove-btn {
    width: 30px;
    height: 30px;
  }

  .option-remove-btn i {
    font-size: 0.9rem;
  }

  .btn-content {
    padding: 10px 20px;
    font-size: 0.95rem;
  }

  .add-option-btn .btn-content {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .submit-content {
    padding: 12px 28px;
    font-size: 1rem;
  }

  .submit-content i {
    font-size: 1.2rem;
  }

  .modal-content i {
    font-size: 3rem;
  }

  .modal-content p {
    font-size: 1rem;
  }
}
</style>
