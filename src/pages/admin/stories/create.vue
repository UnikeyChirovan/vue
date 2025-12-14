<template>
  <div class="create-chapter-wrapper">
    <a-card class="modern-create-card" title="Tạo Chương Mới">
      <form @submit.prevent="submitForm" class="create-form">
        <!-- Title Input -->
        <div class="form-group">
          <label for="title" class="form-label">
            <i class="fa-solid fa-heading"></i> Tiêu đề
          </label>
          <input
            v-model="form.title"
            type="text"
            id="title"
            required
            class="form-control modern-input"
            placeholder="Nhập tiêu đề chương mới..."
          />
        </div>

        <!-- Chapter Number -->
        <div class="form-group">
          <label for="chapterNumber" class="form-label">
            <i class="fa-solid fa-list-ol"></i> Chương số
          </label>
          <input
            v-model="form.chapter_number"
            type="number"
            id="chapterNumber"
            required
            class="form-control modern-input"
            placeholder="Nhập số chương..."
          />
        </div>

        <!-- File Upload -->
        <div class="form-group">
          <label for="file" class="form-label">
            <i class="fa-solid fa-file-arrow-up"></i> Chọn tệp .txt để nhập nội
            dung
          </label>
          <div class="file-upload-wrapper">
            <input
              @change="handleFileUpload"
              type="file"
              id="file"
              accept=".txt"
              class="form-control modern-file-input"
            />
            <p class="file-hint">
              <i class="fa-solid fa-circle-info"></i>
              Tải lên file .txt để tự động tách thành các đoạn
            </p>
          </div>
        </div>

        <!-- Content Sections -->
        <div class="content-sections">
          <div class="sections-header">
            <h3 class="sections-title">
              <i class="fa-solid fa-book"></i> Nội dung chương
            </h3>
            <div class="section-actions">
              <a-button
                @click="addSection"
                type="primary"
                class="add-section-btn"
              >
                <i class="fa-solid fa-plus"></i> Thêm đoạn
              </a-button>
              <a-button
                @click="showConfirmDelete"
                danger
                class="delete-all-btn"
              >
                <i class="fa-solid fa-trash-can"></i> Xóa toàn bộ
              </a-button>
            </div>
          </div>

          <div
            v-for="(section, index) in form.content"
            :key="index"
            class="section-item"
          >
            <div class="section-header">
              <span class="section-number">Đoạn {{ index + 1 }}</span>
              <a-button
                @click="removeSection(index)"
                danger
                size="small"
                class="remove-section-btn"
              >
                <i class="fa-solid fa-xmark"></i> Xóa
              </a-button>
            </div>
            <textarea
              v-model="form.content[index]"
              rows="4"
              class="form-control modern-textarea"
              placeholder="Nhập nội dung đoạn văn..."
            ></textarea>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            class="submit-btn"
          >
            <i class="fa-solid fa-paper-plane"></i> Tạo Chương
          </a-button>
        </div>
      </form>

      <!-- Confirm Delete Modal -->
      <a-modal
        v-model:visible="isConfirmVisible"
        title="Xác Nhận Xóa Toàn Bộ"
        @ok="removeAllSections"
        @cancel="handleCancelDelete"
        okText="Xóa"
        cancelText="Hủy"
        class="confirm-modal"
      >
        <p class="modal-warning">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Bạn có chắc chắn muốn xóa toàn bộ nội dung các đoạn không? Hành động
          này không thể hoàn tác.
        </p>
      </a-modal>

      <!-- Scroll Buttons -->
      <ScrollButtons>
        <template v-slot:top-button>
          <a-button type="primary"
            ><i class="fa-solid fa-arrow-down"></i
          ></a-button>
        </template>
        <template v-slot:bottom-button>
          <a-button type="primary"
            ><i class="fa-solid fa-arrow-up"></i
          ></a-button>
        </template>
      </ScrollButtons>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenu } from '../../../stores/use-menu';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import ScrollButtons from '../../../components/ScrollButtons.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const form = ref({
  title: '',
  chapter_number: route.params.lastIndex ? Number(route.params.lastIndex) : 1,
  content: [''],
});
const index = ref(Number(route.params.lastIndex));

const isConfirmVisible = ref(false);

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

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result.split('\n\n');
      form.value.content = content;
      message.success('Nội dung của tệp đã được nhập vào');
    };
    reader.readAsText(file);
  }
};

const submitForm = async () => {
  try {
    await api.post('/story/chapters', {
      title: form.value.title,
      chapter_number: form.value.chapter_number,
      content: form.value.content,
    });
    message.success('Chương đã được tạo thành công');
    index.value = index.value + 1;
    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tạo chương');
  }
};

const resetForm = () => {
  form.value = {
    title: '',
    chapter_number: index.value,
    content: [''],
  };
};

const handleCancelDelete = () => {
  isConfirmVisible.value = false;
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-stories']);
});
</script>

<style scoped>
/* ========== WRAPPER STYLES ========== */
.create-chapter-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 40px 20px;
}

/* ========== CARD STYLES ========== */
.modern-create-card {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
}

.modern-create-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-bottom: none;
  padding: 24px 32px;
}

.modern-create-card :deep(.ant-card-head-title) {
  color: white;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.modern-create-card :deep(.ant-card-body) {
  padding: 40px;
}

/* ========== FORM STYLES ========== */
.create-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0c713d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label i {
  font-size: 1rem;
}

.modern-input,
.modern-textarea {
  width: 100%;
  padding: 14px 18px;
  font-size: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
}

.modern-input:focus,
.modern-textarea:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 4px rgba(12, 113, 61, 0.1);
}

.modern-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.6;
}

/* ========== FILE UPLOAD ========== */
.file-upload-wrapper {
  position: relative;
}

.modern-file-input {
  padding: 12px;
  cursor: pointer;
}

.modern-file-input::file-selector-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.modern-file-input::file-selector-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.file-hint {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}

.file-hint i {
  color: #0c713d;
}

/* ========== CONTENT SECTIONS ========== */
.content-sections {
  background: #f8f9fa;
  padding: 28px;
  border-radius: 16px;
  border: 2px solid #e9ecef;
}

.sections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.sections-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0c713d;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.add-section-btn,
.delete-all-btn {
  height: 42px;
  padding: 0 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.add-section-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
}

.add-section-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.delete-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

/* ========== SECTION ITEMS ========== */
.section-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.section-item:hover {
  border-color: #0c713d;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-number {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0c713d;
  background: rgba(12, 113, 61, 0.1);
  padding: 6px 16px;
  border-radius: 8px;
}

.remove-section-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ========== FORM ACTIONS ========== */
.form-actions {
  display: flex;
  justify-content: center;
  padding-top: 12px;
}

.submit-btn {
  height: 52px;
  padding: 0 48px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(12, 113, 61, 0.4);
}

/* ========== MODAL STYLES ========== */
.confirm-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
}

.confirm-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 700;
}

.modal-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.05rem;
  color: #333;
  line-height: 1.6;
}

.modal-warning i {
  color: #dc2626;
  font-size: 1.8rem;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
  .create-chapter-wrapper {
    padding: 30px 15px;
  }

  .modern-create-card :deep(.ant-card-head-title) {
    font-size: 1.5rem;
  }

  .modern-create-card :deep(.ant-card-body) {
    padding: 32px;
  }

  .sections-title {
    font-size: 1.3rem;
  }

  .submit-btn {
    height: 48px;
    padding: 0 40px;
    font-size: 1.05rem;
  }
}

/* Mobile (max-width: 767px) */
@media (max-width: 767px) {
  .create-chapter-wrapper {
    padding: 20px 10px;
  }

  .modern-create-card {
    border-radius: 16px;
  }

  .modern-create-card :deep(.ant-card-head) {
    padding: 20px 16px;
  }

  .modern-create-card :deep(.ant-card-head-title) {
    font-size: 1.3rem;
  }

  .modern-create-card :deep(.ant-card-body) {
    padding: 24px 16px;
  }

  .create-form {
    gap: 24px;
  }

  .form-label {
    font-size: 1rem;
  }

  .modern-input,
  .modern-textarea {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  .file-hint {
    font-size: 0.85rem;
  }

  .content-sections {
    padding: 20px 16px;
  }

  .sections-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .sections-title {
    font-size: 1.2rem;
  }

  .section-actions {
    width: 100%;
  }

  .add-section-btn,
  .delete-all-btn {
    flex: 1;
    justify-content: center;
    height: 40px;
    padding: 0 16px;
    font-size: 0.9rem;
  }

  .section-item {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .remove-section-btn {
    width: 100%;
    justify-content: center;
  }

  .submit-btn {
    width: 100%;
    height: 46px;
    font-size: 1rem;
  }
}

/* Small Mobile (max-width: 480px) */
@media (max-width: 480px) {
  .create-chapter-wrapper {
    padding: 15px 8px;
  }

  .modern-create-card {
    border-radius: 12px;
  }

  .modern-create-card :deep(.ant-card-head) {
    padding: 16px 12px;
  }

  .modern-create-card :deep(.ant-card-head-title) {
    font-size: 1.1rem;
  }

  .modern-create-card :deep(.ant-card-body) {
    padding: 20px 12px;
  }

  .form-label {
    font-size: 0.95rem;
  }

  .modern-input,
  .modern-textarea {
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  .file-hint {
    font-size: 0.8rem;
  }

  .content-sections {
    padding: 16px 12px;
  }

  .sections-title {
    font-size: 1.1rem;
  }

  .add-section-btn,
  .delete-all-btn {
    height: 38px;
    font-size: 0.85rem;
  }

  .section-number {
    font-size: 0.95rem;
    padding: 4px 12px;
  }

  .submit-btn {
    height: 44px;
    font-size: 0.95rem;
    padding: 0 32px;
  }
}
</style>
