<template>
  <TheHeader />
  <div class="terms-wrapper">
    <div class="terms-container">
      <div class="terms-header">
        <div class="header-icon">
          <i class="fa-solid fa-file-contract"></i>
        </div>
        <h2 class="header-title">Điều Khoản Sử Dụng</h2>
        <p class="header-subtitle">Quy định và điều kiện khi sử dụng dịch vụ</p>
      </div>

      <div class="terms-content">
        <section
          v-for="(section, index) in termsSections"
          :key="index"
          class="terms-section"
        >
          <div class="section-header">
            <div class="section-number">{{ index + 1 }}</div>
            <h3>{{ section.title }}</h3>
          </div>
          <p class="section-content">{{ section.content }}</p>
        </section>
      </div>

      <div class="terms-actions">
        <button @click="goToPolicy" class="action-btn policy-btn">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Chính sách bảo mật</span>
        </button>
        <button @click="goToHome" class="action-btn home-btn">
          <i class="fa-solid fa-house"></i>
          <span>Trang chủ</span>
        </button>
        <button @click="goToFAQ" class="action-btn faq-btn">
          <i class="fa-solid fa-circle-question"></i>
          <span>Câu hỏi thường gặp</span>
        </button>
      </div>
    </div>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from './TheHeader.vue';
import TheFooter from './TheFooter.vue';

const router = useRouter();
const goToHome = () => router.push('/');
const goToPolicy = () => router.push('/policy');
const goToFAQ = () => router.push('/faq');

const termsSections = ref([
  {
    title: 'Điều Kiện Sử Dụng',
    content: `Khi sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Nếu không đồng ý, vui lòng không tiếp tục sử dụng dịch vụ. Chúng tôi có quyền cập nhật hoặc thay đổi các điều khoản này mà không cần thông báo trước. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.`,
  },
  {
    title: 'Quyền và Trách nhiệm của Người Dùng',
    content: `Bạn cam kết cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản và cập nhật thông tin nếu có thay đổi. Người dùng chịu trách nhiệm hoàn toàn về bảo mật tài khoản và mật khẩu, không chia sẻ với bất kỳ bên nào khác. Bạn không được sử dụng dịch vụ cho các mục đích phi pháp hoặc vi phạm quyền lợi của bất kỳ bên thứ ba nào.`,
  },
  {
    title: 'Quyền và Trách nhiệm của Chúng Tôi',
    content: `Chúng tôi cam kết cung cấp dịch vụ an toàn, bảo mật và liên tục cho người dùng. Tuy nhiên, chúng tôi không chịu trách nhiệm cho các sự cố do lỗi kỹ thuật hoặc các tình huống nằm ngoài khả năng kiểm soát. Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn nếu bạn vi phạm bất kỳ điều khoản nào trong thỏa thuận này.`,
  },
  {
    title: 'Giới hạn Trách nhiệm',
    content: `Chúng tôi không chịu trách nhiệm về các thiệt hại trực tiếp, gián tiếp hoặc mất mát mà bạn phải chịu khi sử dụng dịch vụ, trừ trường hợp được quy định rõ trong các điều khoản pháp lý hiện hành.`,
  },
  {
    title: 'Luật áp dụng',
    content: `Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền.`,
  },
]);
</script>

<style scoped>
/* ========== WRAPPER ========== */
.terms-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

html.dark-mode .terms-wrapper {
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 100%);
}

/* ========== CONTAINER ========== */
.terms-container {
  max-width: 900px;
  margin: 0 auto;
}

/* ========== HEADER ========== */
.terms-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 30px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;
}

html.dark-mode .terms-header {
  background: #1e1e1e;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.terms-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.header-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
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

.header-icon i {
  font-size: 36px;
  color: white;
}

.header-title {
  margin: 0 0 10px 0;
  font-size: 2.2rem;
  color: #667eea;
  font-weight: 800;
  letter-spacing: 0.5px;
}

html.dark-mode .header-title {
  color: #8b9aec;
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

/* ========== CONTENT ========== */
.terms-content {
  margin-bottom: 40px;
}

.terms-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border-left: 4px solid #667eea;
}

html.dark-mode .terms-section {
  background: #1e1e1e;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border-left-color: #8b9aec;
}

.terms-section:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.12);
  transform: translateY(-2px);
}

html.dark-mode .terms-section:hover {
  box-shadow: 0 8px 24px rgba(139, 154, 236, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.section-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.section-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}

html.dark-mode .section-header h3 {
  color: #e5e5e5;
}

.section-content {
  margin: 0;
  color: #666;
  line-height: 1.8;
  font-size: 0.98rem;
  padding-left: 56px;
}

html.dark-mode .section-content {
  color: #a3a3a3;
}

/* ========== ACTIONS ========== */
.terms-actions {
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

.policy-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.home-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
}

.faq-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* ========== RESPONSIVE ========== */

/* Tablet */
@media (max-width: 1024px) {
  .terms-wrapper {
    padding: 70px 20px 50px;
  }

  .terms-header {
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

  .terms-section {
    padding: 28px;
  }

  .terms-actions {
    gap: 14px;
  }

  .action-btn {
    padding: 14px 20px;
    font-size: 0.9rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .terms-wrapper {
    padding: 60px 15px 40px;
  }

  .terms-header {
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

  .terms-section {
    padding: 24px 20px;
    margin-bottom: 16px;
    border-radius: 14px;
  }

  .section-header {
    gap: 14px;
    margin-bottom: 14px;
  }

  .section-number {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .section-header h3 {
    font-size: 1.15rem;
  }

  .section-content {
    font-size: 0.92rem;
    padding-left: 50px;
  }

  .terms-actions {
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
  .terms-wrapper {
    padding: 50px 10px 30px;
  }

  .terms-header {
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

  .terms-section {
    padding: 20px 18px;
    margin-bottom: 14px;
    border-radius: 12px;
  }

  .section-header {
    gap: 12px;
    margin-bottom: 12px;
  }

  .section-number {
    width: 34px;
    height: 34px;
    font-size: 0.95rem;
  }

  .section-header h3 {
    font-size: 1.05rem;
  }

  .section-content {
    font-size: 0.88rem;
    padding-left: 46px;
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
  .terms-wrapper {
    padding: 45px 8px 25px;
  }

  .terms-header {
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

  .terms-section {
    padding: 18px 16px;
  }

  .section-header {
    gap: 10px;
  }

  .section-number {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .section-header h3 {
    font-size: 1rem;
  }

  .section-content {
    font-size: 0.85rem;
    padding-left: 42px;
  }

  .action-btn {
    padding: 11px 16px;
    font-size: 0.8rem;
  }
}
</style>
