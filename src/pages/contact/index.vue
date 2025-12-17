<template>
  <TheHeader />
  <div class="contact-wrapper">
    <div class="contact-container">
      <div class="contact-content">
        <div class="contact-form-section">
          <h2 class="page-title">{{ contactTitle }}</h2>
          <div class="contact-form">
            <div class="form-fields">
              <div
                v-for="(field, index) in formFields"
                :key="index"
                class="form-group"
              >
                <label :for="field.id" class="field-label">
                  <span v-if="field.required" class="required-mark">*</span>
                  <span>{{ field.label }}</span>
                </label>
                <input
                  :type="field.type"
                  :id="field.id"
                  v-model="formData[field.modelKey]"
                  :class="[
                    'form-input',
                    field.required && !formData[field.modelKey]
                      ? 'invalid'
                      : '',
                  ]"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  @keypress.enter="submitForm"
                />
              </div>
              <div class="form-group editor-group">
                <label class="field-label">
                  <span class="required-mark">*</span>
                  <span>Nội dung:</span>
                </label>
                <div class="ckeditor-wrapper">
                  <CKEditor v-model="formData.message" />
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button
                type="button"
                class="submit-button"
                :disabled="isSubmitting"
                @click="submitForm"
              >
                <span v-if="isSubmitting">Đang gởi...</span>
                <span v-else>gởi</span>
              </button>
            </div>
          </div>
        </div>

        <div class="contact-info-section">
          <h2 class="info-title">{{ companyInfo.webname }}</h2>
          <div class="info-content">
            <div class="info-item">
              <strong>{{ titleAddress }}</strong>
              <p>{{ companyInfo.address }}</p>
            </div>
            <div class="info-item">
              <strong>{{ titlePhone }}</strong>
              <p>{{ companyInfo.phone }}</p>
            </div>
            <div class="info-item">
              <strong>{{ titleEmail }}</strong>
              <p>{{ companyInfo.email }}</p>
            </div>
            <div class="info-item">
              <strong>{{ titleSocialMedia }}</strong>
              <ul class="social-links">
                <li v-if="companyInfo.facebook">
                  <a
                    :href="companyInfo.facebook"
                    target="_blank"
                    rel="noopener"
                  >
                    <span class="social-icon facebook-icon">f</span>
                    <span>Facebook</span>
                  </a>
                </li>
                <li v-if="companyInfo.twitter">
                  <a :href="companyInfo.twitter" target="_blank" rel="noopener">
                    <span class="social-icon twitter-icon">𝕏</span>
                    <span>Twitter</span>
                  </a>
                </li>
                <li v-if="companyInfo.linkedin">
                  <a
                    :href="companyInfo.linkedin"
                    target="_blank"
                    rel="noopener"
                  >
                    <span class="social-icon linkedin-icon">in</span>
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="map-container">
              <h4 class="map-title">{{ titleMap }}</h4>
              <iframe
                :src="
                  'https://www.google.com/maps/embed?pb=' + companyInfo.address
                "
                class="map-frame"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Container -->
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'toast',
        `toast-${toast.type}`,
        { 'toast-exit': toast.removing },
      ]"
    >
      <div class="toast-icon">
        <span v-if="toast.type === 'success'" class="icon-success">✓</span>
        <span v-else-if="toast.type === 'error'" class="icon-error">✕</span>
        <span v-else-if="toast.type === 'info'" class="icon-info">ℹ</span>
        <span v-else class="icon-warning">⚠</span>
      </div>
      <div class="toast-content">
        <p class="toast-message">{{ toast.message }}</p>
      </div>
      <button class="toast-close" @click="removeToast(toast.id)" type="button">
        ×
      </button>
    </div>
  </div>

  <TheFooter />
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useCompanyInfoStore } from '../../stores/useCompanyInfoStore';
import CKEditor from '../../components/CKEditor.vue';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import axios from 'axios';

const categoryStore = useCategoryStore();
const companyInfoStore = useCompanyInfoStore();

const contactTitle = computed(() =>
  categoryStore.getCategoryTitle('5', 'contact', 'TRANG liên lạc QUẢN TRỊ')
);
const titleAddress = computed(() =>
  categoryStore.getCategoryTitle('6', 'contact', 'Địa chỉ:')
);
const titlePhone = computed(() =>
  categoryStore.getCategoryTitle('7', 'contact', 'Điện thoại:')
);
const titleEmail = computed(() =>
  categoryStore.getCategoryTitle('8', 'contact', 'Email:')
);
const titleSocialMedia = computed(() =>
  categoryStore.getCategoryTitle('9', 'contact', 'Mạng xã hội')
);
const titleMap = computed(() =>
  categoryStore.getCategoryTitle('10', 'contact', 'Bản đồ')
);

const companyInfo = computed(() => companyInfoStore.companyInfo);

// Form data - sử dụng reactive object thay vì refs riêng lẻ
const formData = reactive({
  username: '',
  name: '',
  email: '',
  message: '',
  title: '',
});

const isSubmitting = ref(false);

// Toast system
const toasts = ref([]);
let toastId = 0;

const showToast = (message, type = 'info') => {
  const id = toastId++;
  toasts.value.push({ id, message, type, removing: false });

  setTimeout(() => {
    removeToast(id);
  }, 5000);
};

const removeToast = (id) => {
  const toast = toasts.value.find((t) => t.id === id);
  if (toast) {
    toast.removing = true;
    setTimeout(() => {
      const index = toasts.value.findIndex((t) => t.id === id);
      if (index > -1) {
        toasts.value.splice(index, 1);
      }
    }, 300);
  }
};

// Form fields configuration - sử dụng modelKey thay vì model
const formFields = [
  {
    id: 'username',
    label: 'Username:',
    type: 'text',
    modelKey: 'username',
    placeholder: 'Nhập username nếu có',
    required: false,
  },
  {
    id: 'name',
    label: 'Họ và tên:',
    type: 'text',
    modelKey: 'name',
    placeholder: 'Nhập họ tên của bạn',
    required: true,
  },
  {
    id: 'email',
    label: 'Email:',
    type: 'email',
    modelKey: 'email',
    placeholder: 'Nhập email của bạn',
    required: true,
  },
  {
    id: 'problem',
    label: 'Vấn đề:',
    type: 'text',
    modelKey: 'title',
    placeholder: 'Tiêu đề vấn đề',
    required: true,
  },
];

const submitForm = async () => {
  if (isSubmitting.value) return;

  // Validation
  if (!formData.name.trim()) {
    showToast('Vui lòng nhập họ tên!', 'warning');
    return;
  }
  if (!formData.email.trim()) {
    showToast('Vui lòng nhập email!', 'warning');
    return;
  }
  if (!formData.title.trim()) {
    showToast('Vui lòng nhập tiêu đề vấn đề!', 'warning');
    return;
  }
  if (!formData.message.trim()) {
    showToast('Vui lòng nhập nội dung!', 'warning');
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/noauth/contact',
      formData
    );
    showToast(response.data.message || 'gởi thông tin thành công!', 'success');
    defaultForm();
  } catch (error) {
    console.error(error);
    const errorMsg =
      error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
    showToast(errorMsg, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const defaultForm = () => {
  formData.username = '';
  formData.name = '';
  formData.email = '';
  formData.message = '';
  formData.title = '';
};
</script>

<style scoped>
/* ========== MODERN CONTACT PAGE DESIGN ========== */
.contact-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 80px 20px 60px;
}

.contact-container {
  max-width: 1400px;
  margin: 0 auto;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: start;
}

/* ========== FORM SECTION ========== */
.contact-form-section {
  background: white;
  padding: 50px 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  transition: all 0.3s ease;
}

.page-title {
  text-align: center;
  color: #0c713d;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 40px;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 20px;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #0c713d, transparent);
  border-radius: 2px;
}

.contact-form {
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

.editor-group {
  margin-top: 10px;
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

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-bottom: 2px solid #ddd;
  font-size: 1rem;
  background: transparent;
  transition: all 0.3s ease;
  outline: none;
  color: #333;
}

.form-input:focus {
  border-bottom-color: #0c713d;
  background: rgba(12, 113, 61, 0.02);
}

.form-input.invalid {
  border-bottom-color: #e74c3c;
}

.form-input::placeholder {
  color: #999;
}

.ckeditor-wrapper {
  border: 2px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.ckeditor-wrapper:focus-within {
  border-color: #0c713d;
}

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
}

/* ========== INFO SECTION ========== */
.contact-info-section {
  background: white;
  padding: 50px 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  position: sticky;
  top: 100px;
}

.info-title {
  color: #0c713d;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 35px;
  text-align: center;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.info-item {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(12, 113, 61, 0.1);
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-item strong {
  display: block;
  color: #0c713d;
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: 700;
}

.info-item p {
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.social-links {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.social-links li {
  margin: 0;
}

.social-links a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0c713d;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(12, 113, 61, 0.05);
}

.social-links a:hover {
  background: rgba(12, 113, 61, 0.15);
  transform: translateY(-2px);
}

.social-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
}

.facebook-icon {
  background: #1877f2;
  color: white;
}

.twitter-icon {
  background: #000;
  color: white;
  font-size: 12px;
}

.linkedin-icon {
  background: #0077b5;
  color: white;
  font-size: 12px;
}

.map-container {
  margin-top: 30px;
}

.map-title {
  color: #0c713d;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.map-frame {
  width: 100%;
  height: 280px;
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* ========== TOAST NOTIFICATION ========== */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 420px;
  pointer-events: all;
  animation: slideInRight 0.3s ease-out;
  border-left: 4px solid #666;
}

.toast-exit {
  animation: slideOutRight 0.3s ease-out forwards;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

.toast-success {
  border-left-color: #4caf50;
}

.toast-error {
  border-left-color: #f44336;
}

.toast-warning {
  border-left-color: #ff9800;
}

.toast-info {
  border-left-color: #2196f3;
}

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: bold;
  font-size: 18px;
}

.toast-success .toast-icon {
  background: #4caf50;
  color: white;
}

.toast-error .toast-icon {
  background: #f44336;
  color: white;
}

.toast-warning .toast-icon {
  background: #ff9800;
  color: white;
}

.toast-info .toast-icon {
  background: #2196f3;
  color: white;
}

.toast-content {
  flex: 1;
}

.toast-message {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

/* ========== DARK MODE ========== */
.dark-mode .contact-wrapper {
  background: linear-gradient(135deg, var(--dark-bg-primary) 0%, #0d0d0d 100%);
}

.dark-mode .contact-form-section,
.dark-mode .contact-info-section {
  background: var(--dark-bg-card);
  border-color: var(--dark-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.dark-mode .page-title,
.dark-mode .info-title {
  color: var(--dark-accent-green-light);
}

.dark-mode .field-label,
.dark-mode .info-item strong,
.dark-mode .map-title {
  color: var(--dark-text-primary);
}

.dark-mode .form-input {
  color: var(--dark-text-primary);
  border-bottom-color: var(--dark-border);
  background: transparent;
}

.dark-mode .form-input:focus {
  border-bottom-color: var(--dark-accent-green);
  background: rgba(12, 113, 61, 0.1);
}

.dark-mode .form-input::placeholder {
  color: var(--dark-text-muted);
}

.dark-mode .ckeditor-wrapper {
  border-color: var(--dark-border);
}

.dark-mode .ckeditor-wrapper:focus-within {
  border-color: var(--dark-accent-green);
}

.dark-mode .info-item {
  border-bottom-color: var(--dark-border);
}

.dark-mode .info-item p {
  color: var(--dark-text-secondary);
}

.dark-mode .social-links a {
  color: var(--dark-accent-green-light);
  background: rgba(12, 113, 61, 0.15);
}

.dark-mode .social-links a:hover {
  background: rgba(12, 113, 61, 0.25);
}

.dark-mode .toast {
  background: var(--dark-bg-elevated);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.dark-mode .toast-message {
  color: var(--dark-text-primary);
}

.dark-mode .toast-close {
  color: var(--dark-text-muted);
}

.dark-mode .toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--dark-text-primary);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact-info-section {
    position: static;
  }

  .contact-form-section,
  .contact-info-section {
    padding: 40px 30px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .contact-wrapper {
    padding: 60px 15px 40px;
  }

  .page-title {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }

  .info-title {
    font-size: 1.5rem;
  }

  .contact-form-section,
  .contact-info-section {
    padding: 35px 25px;
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

  .social-links {
    flex-direction: column;
    gap: 10px;
  }

  .social-links a {
    justify-content: center;
  }

  .map-frame {
    height: 220px;
  }

  .toast-container {
    left: 10px;
    right: 10px;
    top: 10px;
  }

  .toast {
    min-width: auto;
    max-width: 100%;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .contact-wrapper {
    padding: 50px 10px 30px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .info-title {
    font-size: 1.3rem;
  }

  .contact-form-section,
  .contact-info-section {
    padding: 25px 15px;
    border-radius: 16px;
  }

  .field-label {
    font-size: 0.95rem;
  }

  .form-input {
    padding: 12px 14px;
    font-size: 0.95rem;
  }

  .submit-button {
    padding: 12px 24px;
    font-size: 0.95rem;
  }

  .toast {
    padding: 12px 16px;
    font-size: 0.9rem;
  }

  .toast-icon {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
}
</style>
