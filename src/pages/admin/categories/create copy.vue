<template>
  <div class="category-create-wrapper">
    <div class="create-container">
      <div class="create-card">
        <div class="card-header">
          <div class="header-icon">
            <i class="fa-solid fa-plus-circle"></i>
          </div>
          <h2 class="header-title">Tạo Danh Mục Mới</h2>
          <p class="header-subtitle">Thêm danh mục mới vào hệ thống</p>
        </div>

        <form @submit.prevent="submitForm" class="create-form">
          <div class="form-fields">
            <div class="form-group">
              <label for="name" class="field-label">
                <span class="required-mark">*</span>
                <span>Tên Danh Mục</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                required
                class="form-input"
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div class="form-group">
              <label for="code" class="field-label">
                <span class="required-mark">*</span>
                <span>Mã Số</span>
              </label>
              <input
                v-model="form.code"
                type="text"
                id="code"
                required
                class="form-input"
                placeholder="Nhập mã số danh mục"
              />
            </div>

            <div class="form-group">
              <label for="page" class="field-label">
                <span class="required-mark">*</span>
                <span>Trang</span>
              </label>
              <select
                v-model="form.page"
                id="page"
                required
                class="form-select"
              >
                <option value="" disabled>Chọn trang</option>
                <option
                  v-for="option in pageOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-button">
              <span>Gởi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const form = ref({
  name: '',
  code: '',
  page: '',
});

const pageOptions = ref([]);

const fetchPageOptions = async () => {
  try {
    const response = await api.get('/categories/page-options');
    pageOptions.value = response.data.pageOptions;
  } catch (error) {
    message.error('Không thể lấy danh sách trang');
  }
};

const submitForm = async () => {
  try {
    await api.post('/categories', {
      name: form.value.name,
      code: form.value.code,
      page: form.value.page,
    });
    message.success('Danh mục đã được tạo thành công');
    resetForm();
  } catch (error) {
    message.error('Đã xảy ra lỗi khi tạo danh mục');
  }
};

const resetForm = () => {
  form.value.name = '';
  form.value.code = '';
  form.value.page = '';
};

onMounted(() => {
  fetchPageOptions();
  useMenu().onSelectedKey(['admin-categories']);
});
</script>

<style scoped>
/* ========== MODERN CREATE PAGE DESIGN ========== */
.category-create-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 80px 20px 60px;
}

.create-container {
  max-width: 800px;
  margin: 0 auto;
}

.create-card {
  background: white;
  padding: 50px 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
}

/* ========== CARD HEADER ========== */
.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.3);
}

.header-icon i {
  font-size: 2.5rem;
  color: white;
}

.header-title {
  color: #0c713d;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: 0.5px;
}

.header-subtitle {
  color: #555;
  font-size: 1.05rem;
  margin: 0;
}

/* ========== FORM STYLING ========== */
.create-form {
  width: 100%;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.required-mark {
  color: #e74c3c;
  font-size: 1.1rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-bottom: 2px solid #ddd;
  font-size: 1rem;
  background: transparent;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus {
  border-bottom-color: #0c713d;
  background: rgba(12, 113, 61, 0.02);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230c713d' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  padding-right: 45px;
}

.form-select option {
  padding: 10px;
}

/* ========== FORM ACTIONS ========== */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 35px;
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

.submit-button span {
  position: relative;
  z-index: 1;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .category-create-wrapper {
    padding: 70px 20px 50px;
  }

  .create-card {
    padding: 40px 35px;
  }

  .header-title {
    font-size: 2rem;
  }

  .header-icon {
    width: 70px;
    height: 70px;
  }

  .header-icon i {
    font-size: 2.2rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .category-create-wrapper {
    padding: 60px 15px 40px;
  }

  .create-card {
    padding: 35px 25px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .header-icon {
    width: 65px;
    height: 65px;
  }

  .header-icon i {
    font-size: 2rem;
  }

  .form-fields {
    gap: 20px;
  }

  .submit-button {
    width: 100%;
    padding: 14px 32px;
  }

  .form-actions {
    justify-content: stretch;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .category-create-wrapper {
    padding: 50px 10px 30px;
  }

  .create-card {
    padding: 30px 20px;
    border-radius: 16px;
  }

  .header-title {
    font-size: 1.6rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .header-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 15px;
  }

  .header-icon i {
    font-size: 1.8rem;
  }

  .card-header {
    margin-bottom: 30px;
  }

  .field-label {
    font-size: 0.95rem;
  }

  .form-input,
  .form-select {
    padding: 12px 14px;
    font-size: 0.95rem;
  }

  .form-select {
    background-position: right 14px center;
    padding-right: 40px;
  }

  .submit-button {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
}
</style>
