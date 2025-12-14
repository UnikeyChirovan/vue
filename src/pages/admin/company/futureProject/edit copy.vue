<template>
  <div class="form-wrapper">
    <a-card class="form-card">
      <template #title>
        <div class="card-header">
          <h1 class="header-title">
            <i class="fa-solid fa-pen-to-square"></i>
            Sửa Future Project
          </h1>
        </div>
      </template>

      <form @submit.prevent="submitForm" class="modern-form">
        <!-- Name Input -->
        <div class="form-group">
          <label for="name" class="form-label">
            <i class="fa-solid fa-project-diagram"></i>
            <span>Tên Dự Án</span>
            <span class="required">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            required
            class="form-input"
            placeholder="Nhập tên dự án"
          />
        </div>

        <!-- Timeline Input -->
        <div class="form-group">
          <label for="timeline" class="form-label">
            <i class="fa-solid fa-calendar-days"></i>
            <span>Thời Gian</span>
            <span class="required">*</span>
          </label>
          <input
            v-model="form.timeline"
            type="text"
            id="timeline"
            required
            class="form-input"
            placeholder="Ví dụ: 2025-2027"
          />
        </div>

        <!-- Description Input -->
        <div class="form-group">
          <label for="description" class="form-label">
            <i class="fa-solid fa-align-left"></i>
            <span>Mô Tả</span>
            <span class="required">*</span>
          </label>
          <textarea
            v-model="form.description"
            id="description"
            required
            class="form-textarea"
            placeholder="Nhập mô tả chi tiết dự án"
            rows="5"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button type="submit" class="submit-button">
            <span class="button-content">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>Lưu thay đổi</span>
            </span>
          </button>
        </div>
      </form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../../services/axiosInterceptor';
import { useRoute } from 'vue-router';
import { useMenu } from '../../../../stores/use-menu';

const route = useRoute();
const projectId = route.params.id;

const form = ref({
  name: '',
  timeline: '',
  description: '',
});

const fetchProjectData = async () => {
  try {
    const response = await api.get(`/future-projects/${projectId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải dữ liệu Future Project');
  }
};

onMounted(() => {
  fetchProjectData();
  useMenu().onSelectedKey(['admin-company']);
});

const submitForm = async () => {
  try {
    await api.put(`/future-projects/${projectId}`, form.value);
    message.success('Future Project đã được cập nhật thành công');
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật Future Project');
  }
};
</script>

<style scoped>
/* Copy toàn bộ CSS từ file create, giữ nguyên 100% */
.form-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 800px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
}

.form-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  padding: 30px;
}

.form-card :deep(.ant-card-body) {
  padding: 40px;
  background: white;
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
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label i {
  color: #0c713d;
  font-size: 1.1rem;
}

.required {
  color: #e74c3c;
  font-size: 1.1rem;
  margin-left: 4px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #0c713d;
  background: white;
  box-shadow: 0 0 0 4px rgba(12, 113, 61, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #999;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.submit-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  padding: 0;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
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
  width: 300px;
  height: 300px;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.submit-button:active {
  transform: translateY(0);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 48px;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}

.button-content i {
  font-size: 1.2rem;
}

@media (max-width: 1024px) {
  .form-wrapper {
    padding: 30px 15px;
  }

  .form-card :deep(.ant-card-head) {
    padding: 25px;
  }

  .form-card :deep(.ant-card-body) {
    padding: 35px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .header-title i {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .form-wrapper {
    padding: 20px 10px;
  }

  .form-card :deep(.ant-card-head) {
    padding: 20px;
  }

  .form-card :deep(.ant-card-body) {
    padding: 30px 25px;
  }

  .header-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 10px;
  }

  .header-title i {
    font-size: 1.8rem;
  }

  .modern-form {
    gap: 20px;
  }

  .form-label {
    font-size: 0.95rem;
  }

  .form-input,
  .form-textarea {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  .form-actions {
    justify-content: stretch;
  }

  .submit-button {
    width: 100%;
  }

  .button-content {
    padding: 12px 32px;
    font-size: 1rem;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-wrapper {
    padding: 15px 8px;
  }

  .form-card {
    border-radius: 16px;
  }

  .form-card :deep(.ant-card-head) {
    padding: 15px;
  }

  .form-card :deep(.ant-card-body) {
    padding: 25px 20px;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .header-title i {
    font-size: 1.6rem;
  }

  .modern-form {
    gap: 18px;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-label i {
    font-size: 1rem;
  }

  .form-input,
  .form-textarea {
    padding: 10px 14px;
    font-size: 0.9rem;
    border-radius: 10px;
  }

  .button-content {
    padding: 10px 24px;
    font-size: 0.9rem;
  }

  .button-content i {
    font-size: 1rem;
  }
}
</style>
