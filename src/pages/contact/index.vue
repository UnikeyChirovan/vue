<template>
  <TheHeader />
  <div class="contact-wrapper">
    <div class="contact-container">
      <div class="contact-content">
        <div class="contact-form-section">
          <h2 class="page-title">{{ contactTitle }}</h2>
          <form @submit.prevent="submitForm" class="contact-form">
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
                  v-model="field.model"
                  :class="[
                    'form-input',
                    field.required && !field.model ? 'invalid' : '',
                  ]"
                  :placeholder="field.placeholder"
                  :required="field.required"
                />
              </div>
              <div class="form-group editor-group">
                <label class="field-label">
                  <span class="required-mark">*</span>
                  <span>Nội dung:</span>
                </label>
                <div class="ckeditor-wrapper">
                  <CKEditor v-model="message" />
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="submit-button">
                <span>Gởi</span>
              </button>
            </div>
          </form>
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
                  <a :href="companyInfo.facebook" target="_blank">
                    <i class="fab fa-facebook"></i> Facebook
                  </a>
                </li>
                <li v-if="companyInfo.twitter">
                  <a :href="companyInfo.twitter" target="_blank">
                    <i class="fab fa-twitter"></i> Twitter
                  </a>
                </li>
                <li v-if="companyInfo.linkedin">
                  <a :href="companyInfo.linkedin" target="_blank">
                    <i class="fab fa-linkedin"></i> LinkedIn
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
import { useMessage } from 'naive-ui';

const messagenaive = useMessage();
const categoryStore = useCategoryStore();
const companyInfoStore = useCompanyInfoStore();

const contactTitle = computed(() =>
  categoryStore.getCategoryTitle('5', 'contact', 'TRANG LIÊN HỆ QUẢN TRỊ')
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

const username = ref('');
const name = ref('');
const email = ref('');
const message = ref('');
const title = ref('');
const formFields = reactive([
  {
    id: 'username',
    label: 'Username:',
    type: 'text',
    model: username,
    placeholder: 'Nhập username nếu có',
    required: false,
  },
  {
    id: 'name',
    label: 'Họ và tên:',
    type: 'text',
    model: name,
    placeholder: 'Nhập họ tên của bạn',
    required: true,
  },
  {
    id: 'email',
    label: 'Email:',
    type: 'email',
    model: email,
    placeholder: 'Nhập email của bạn',
    required: true,
  },
  {
    id: 'problem',
    label: 'Vấn đề:',
    type: 'text',
    model: title,
    placeholder: 'Tiêu đề vấn đề',
    required: true,
  },
]);

const submitForm = () => {
  const formData = {
    username: username.value,
    name: name.value,
    email: email.value,
    message: message.value,
    title: title.value,
  };

  axios
    .post('http://127.0.0.1:8000/api/noauth/contact', formData)
    .then((response) => {
      messagenaive.success(response.data.message);
      defaultForm();
    })
    .catch((error) => {
      console.error(error);
      messagenaive.error('Có lỗi xảy ra. Vui lòng thử lại!');
    });
};

const defaultForm = () => {
  username.value = '';
  name.value = '';
  email.value = '';
  message.value = '';
  title.value = '';
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
}

.form-input:focus {
  border-bottom-color: #0c713d;
  background: rgba(12, 113, 61, 0.02);
}

.form-input.invalid {
  border-bottom-color: #e74c3c;
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

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.submit-button:active {
  transform: translateY(0);
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

.social-links i {
  font-size: 1.2rem;
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
    padding: 30px 20px;
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
}
</style>
