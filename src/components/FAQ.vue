<template>
  <TheHeader />
  <div class="faq-wrapper">
    <div class="faq-container">
      <div class="faq-header">
        <div class="header-icon">
          <i class="fa-solid fa-circle-question"></i>
        </div>
        <h2 class="header-title">Câu Hỏi Thường Gặp</h2>
        <p class="header-subtitle">Tìm câu trả lời cho các thắc mắc của bạn</p>
      </div>

      <div class="faq-content">
        <n-collapse accordion :default-expanded-names="['0']">
          <n-collapse-item
            v-for="(faq, index) in faqList"
            :key="index"
            :name="String(index)"
            class="faq-item"
          >
            <template #header>
              <div class="faq-question">
                <i class="fa-solid fa-circle-chevron-right"></i>
                <span>{{ faq.question }}</span>
              </div>
            </template>
            <div class="faq-answer">
              {{ faq.answer }}
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>

      <div class="faq-actions">
        <button @click="goToTerms" class="action-btn terms-btn">
          <i class="fa-solid fa-file-contract"></i>
          <span>Điều khoản sử dụng</span>
        </button>
        <button @click="goToHome" class="action-btn home-btn">
          <i class="fa-solid fa-house"></i>
          <span>Trang chủ</span>
        </button>
        <button @click="goToPolicy" class="action-btn policy-btn">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Chính sách bảo mật</span>
        </button>
      </div>
    </div>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref } from 'vue';
import TheHeader from './TheHeader.vue';
import TheFooter from './TheFooter.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goToTerms = () => router.push('/terms');
const goToHome = () => router.push('/');
const goToPolicy = () => router.push('/policy');

const faqList = ref([
  {
    question: 'Làm thế nào để tạo tài khoản?',
    answer:
      'Để tạo tài khoản, bạn chỉ cần vào trang đăng ký, điền thông tin và làm theo hướng dẫn.',
  },
  {
    question: 'Tôi có thể thay đổi mật khẩu ở đâu?',
    answer:
      'Bạn có thể thay đổi mật khẩu trong phần cài đặt tài khoản của mình.',
  },
  {
    question: 'Nếu quên mật khẩu thì làm thế nào?',
    answer:
      'Bạn bấm vào nút đăng nhập rồi bấm quên mật khẩu để có thể cấp lại mật khẩu, hoặc có thể liên lạc với chúng tôi',
  },
  {
    question: 'Làm thế nào để liên lạc với bộ phận hỗ trợ?',
    answer:
      'Bạn có thể liên lạc với chúng tôi qua email, điện thoại hoặc điền vào form liên lạc trên trang liên lạc.',
  },
]);
</script>

<style scoped>
/* ========== WRAPPER ========== */
.faq-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

html.dark-mode .faq-wrapper {
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 100%);
}

/* ========== CONTAINER ========== */
.faq-container {
  max-width: 900px;
  margin: 0 auto;
}

/* ========== HEADER ========== */
.faq-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 30px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(12, 113, 61, 0.1);
  position: relative;
  overflow: hidden;
}

html.dark-mode .faq-header {
  background: #1e1e1e;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.faq-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #0c713d, #0a5a31);
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
  font-size: 36px;
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.header-title {
  margin: 0 0 10px 0;
  font-size: 2.2rem;
  color: #0c713d;
  font-weight: 800;
  letter-spacing: 0.5px;
}

html.dark-mode .header-title {
  color: #4ade80;
}

.header-subtitle {
  margin: 0;
  font-size: 1.05rem;
  color: #666;
  font-weight: 400;
}

html.dark-mode .header-subtitle {
  color: #a3a3a3;
}

/* ========== FAQ CONTENT ========== */
.faq-content {
  margin-bottom: 40px;
}

.faq-content :deep(.n-collapse) {
  background: transparent;
}

.faq-content :deep(.n-collapse-item) {
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  transition: all 0.3s ease;
}

html.dark-mode .faq-content :deep(.n-collapse-item) {
  background: #1e1e1e;
  border-color: #333;
}

.faq-content :deep(.n-collapse-item:hover) {
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.1);
  transform: translateY(-2px);
}

html.dark-mode .faq-content :deep(.n-collapse-item:hover) {
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.2);
}

.faq-content :deep(.n-collapse-item__header) {
  padding: 20px 24px;
  background: transparent;
  font-weight: 600;
}

html.dark-mode .faq-content :deep(.n-collapse-item__header) {
  color: #e5e5e5;
}

.faq-content :deep(.n-collapse-item__content-wrapper) {
  background: transparent;
}

.faq-content :deep(.n-collapse-item__content-inner) {
  padding: 0 24px 20px 24px;
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.05rem;
}

.faq-question i {
  color: #0c713d;
  font-size: 20px;
  transition: transform 0.3s ease;
}

html.dark-mode .faq-question i {
  color: #4ade80;
}

.faq-content :deep(.n-collapse-item--active) .faq-question i {
  transform: rotate(90deg);
}

.faq-answer {
  color: #666;
  line-height: 1.7;
  font-size: 0.98rem;
  padding-left: 32px;
}

html.dark-mode .faq-answer {
  color: #a3a3a3;
}

/* ========== ACTIONS ========== */
.faq-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn i {
  font-size: 18px;
}

.terms-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.home-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
}

.policy-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* ========== RESPONSIVE ========== */

/* Tablet */
@media (max-width: 1024px) {
  .faq-wrapper {
    padding: 70px 20px 50px;
  }

  .faq-header {
    padding: 35px 25px;
    margin-bottom: 40px;
  }

  .header-icon {
    width: 70px;
    height: 70px;
  }

  .header-icon i {
    font-size: 32px;
  }

  .header-title {
    font-size: 2rem;
  }

  .faq-actions {
    gap: 14px;
  }

  .action-btn {
    padding: 14px 20px;
    font-size: 0.9rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .faq-wrapper {
    padding: 60px 15px 40px;
  }

  .faq-header {
    padding: 30px 20px;
    margin-bottom: 30px;
    border-radius: 20px;
  }

  .header-icon {
    width: 64px;
    height: 64px;
  }

  .header-icon i {
    font-size: 28px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .faq-content :deep(.n-collapse-item) {
    margin-bottom: 14px;
    border-radius: 14px;
  }

  .faq-content :deep(.n-collapse-item__header) {
    padding: 18px 20px;
  }

  .faq-content :deep(.n-collapse-item__content-inner) {
    padding: 0 20px 18px 20px;
  }

  .faq-question {
    font-size: 1rem;
  }

  .faq-question i {
    font-size: 18px;
  }

  .faq-answer {
    font-size: 0.92rem;
    padding-left: 30px;
  }

  .faq-actions {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .action-btn {
    padding: 14px 20px;
    font-size: 0.9rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .faq-wrapper {
    padding: 50px 10px 30px;
  }

  .faq-header {
    padding: 25px 18px;
    margin-bottom: 25px;
    border-radius: 16px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .header-icon i {
    font-size: 24px;
  }

  .header-title {
    font-size: 1.6rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .faq-content :deep(.n-collapse-item) {
    margin-bottom: 12px;
    border-radius: 12px;
  }

  .faq-content :deep(.n-collapse-item__header) {
    padding: 16px 18px;
  }

  .faq-content :deep(.n-collapse-item__content-inner) {
    padding: 0 18px 16px 18px;
  }

  .faq-question {
    font-size: 0.95rem;
  }

  .faq-question i {
    font-size: 16px;
  }

  .faq-answer {
    font-size: 0.88rem;
    padding-left: 28px;
  }

  .action-btn {
    padding: 12px 18px;
    font-size: 0.85rem;
  }

  .action-btn i {
    font-size: 16px;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .faq-wrapper {
    padding: 45px 8px 25px;
  }

  .faq-header {
    padding: 20px 15px;
    margin-bottom: 20px;
  }

  .header-icon {
    width: 52px;
    height: 52px;
  }

  .header-icon i {
    font-size: 22px;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  .faq-content :deep(.n-collapse-item__header) {
    padding: 14px 16px;
  }

  .faq-content :deep(.n-collapse-item__content-inner) {
    padding: 0 16px 14px 16px;
  }

  .faq-question {
    font-size: 0.9rem;
  }

  .faq-answer {
    font-size: 0.85rem;
    padding-left: 26px;
  }

  .action-btn {
    padding: 11px 16px;
    font-size: 0.8rem;
  }

  .action-btn span {
    font-size: 0.8rem;
  }
}
</style>
