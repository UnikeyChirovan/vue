<template>
  <div class="reply-wrapper">
    <div class="reply-container">
      <div class="reply-header">
        <i class="fa-solid fa-reply-all header-icon"></i>
        <h1 class="header-title">Phản Hồi Email</h1>
      </div>

      <div class="reply-content">
        <!-- Contact Message Section -->
        <div class="message-section">
          <div class="section-header">
            <i class="fa-solid fa-message"></i>
            <span>Nội dung liên lạc từ khách hàng</span>
          </div>
          <div class="message-box">
            <textarea
              class="contact-message"
              rows="5"
              v-model="contactMessage"
              readonly
            ></textarea>
          </div>
        </div>

        <!-- Reply Form -->
        <form @submit.prevent="submitForm" class="reply-form">
          <!-- Email Input -->
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-envelope"></i>
              <span class="label-text">
                <span class="required">*</span>
                Email người nhận
              </span>
            </label>
            <input
              type="email"
              v-model="email"
              class="form-input"
              placeholder="example@email.com"
              required
              readonly
            />
          </div>

          <!-- Editor Section -->
          <div class="editor-section">
            <div class="section-header">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Nội dung phản hồi</span>
            </div>
            <div class="editor-container">
              <CKEditor v-model="responseMessage" />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="goBack">
              <i class="fa-solid fa-xmark"></i>
              <span>Hủy bỏ</span>
            </button>
            <button type="submit" class="submit-btn">
              <i class="fa-solid fa-paper-plane"></i>
              <span>gởi phản hồi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CKEditor from '../../../components/CKEditor.vue';
import api from '../../../services/axiosInterceptor';
import { useMessage } from 'naive-ui';

const messagenaive = useMessage();
const route = useRoute();
const router = useRouter();
const email = ref('');
const responseMessage = ref('');
const contactMessage = ref('');

onMounted(() => {
  email.value = route.query.email;
  contactMessage.value = route.query.message;
});

const goBack = () => {
  router.push({ name: 'admin-contacts' });
};

const submitForm = async () => {
  try {
    const formData = {
      email: email.value,
      message: responseMessage.value,
    };
    const response = await api.post('/noauth/reply-email', formData);
    sessionStorage.setItem(`replyStatus-${route.params.id}`, 'success');
    messagenaive.success(response.data.message);
    router.push({ name: 'admin-contacts' });
  } catch (error) {
    console.error(error);
    sessionStorage.setItem(`replyStatus-${route.params.id}`, 'error');
    messagenaive.error('Phản hồi không thành công!');
  }
};
</script>

<style scoped>
/* ========== WRAPPER ========== */
.reply-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

.reply-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* ========== HEADER ========== */
.reply-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 32px 40px;
  border-radius: 24px 24px 0 0;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.2);
}

.header-icon {
  font-size: 2.5rem;
  color: white;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
}

/* ========== CONTENT ========== */
.reply-content {
  background: white;
  padding: 40px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* ========== MESSAGE SECTION ========== */
.message-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header i {
  color: #0c713d;
  font-size: 1.3rem;
}

.message-box {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
}

.contact-message {
  width: 100%;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  background: white;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.contact-message:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

/* ========== FORM ========== */
.reply-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.form-label i {
  color: #0c713d;
  font-size: 1.2rem;
}

.label-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.required {
  color: #ff4d4f;
  font-size: 1.1rem;
}

.form-input {
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #333;
  background: #f8f9fa;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
  background: white;
}

/* ========== EDITOR SECTION ========== */
.editor-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor-container {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.editor-container:focus-within {
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

/* ========== FORM ACTIONS ========== */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
}

.cancel-btn,
.submit-btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cancel-btn {
  background: white;
  border: 2px solid #d0d0d0;
  color: #666;
}

.cancel-btn:hover {
  background: #f5f5f5;
  border-color: #b0b0b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

.submit-btn:active,
.cancel-btn:active {
  transform: translateY(0);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .reply-wrapper {
    padding: 70px 16px 50px;
  }

  .reply-header {
    padding: 28px 32px;
  }

  .header-icon {
    font-size: 2.2rem;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .reply-content {
    padding: 32px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .reply-wrapper {
    padding: 60px 12px 40px;
  }

  .reply-header {
    padding: 24px 24px;
    border-radius: 16px 16px 0 0;
    flex-direction: column;
    text-align: center;
  }

  .header-icon {
    font-size: 2rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .reply-content {
    padding: 24px 20px;
    border-radius: 0 0 16px 16px;
  }

  .section-header {
    font-size: 1rem;
  }

  .section-header i {
    font-size: 1.1rem;
  }

  .form-label {
    font-size: 0.95rem;
  }

  .form-label i {
    font-size: 1.1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .reply-wrapper {
    padding: 50px 8px 30px;
  }

  .reply-header {
    padding: 20px 20px;
    border-radius: 12px 12px 0 0;
    gap: 12px;
  }

  .header-icon {
    font-size: 1.8rem;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .reply-content {
    padding: 20px 16px;
    border-radius: 0 0 12px 12px;
  }

  .message-section {
    margin-bottom: 24px;
  }

  .section-header {
    font-size: 0.95rem;
    gap: 8px;
  }

  .section-header i {
    font-size: 1rem;
  }

  .contact-message {
    padding: 14px;
    font-size: 0.9rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-label i {
    font-size: 1rem;
  }

  .form-input {
    padding: 12px 16px;
    font-size: 0.9rem;
  }

  .cancel-btn,
  .submit-btn {
    padding: 12px 28px;
    font-size: 0.95rem;
  }
}
</style>
