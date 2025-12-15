<template>
  <TheHeader />
  <div class="policy-wrapper">
    <div class="policy-container">
      <div class="policy-header">
        <div class="header-icon">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h2 class="header-title">Chính Sách Bảo Mật</h2>
        <p class="header-subtitle">Cam kết bảo vệ thông tin cá nhân của bạn</p>
      </div>

      <div class="policy-content">
        <section
          v-for="(section, index) in privacyPolicySections"
          :key="index"
          class="policy-section"
        >
          <div class="section-header">
            <div class="section-number">{{ index + 1 }}</div>
            <h3>{{ section.title }}</h3>
          </div>
          <p class="section-content">{{ section.content }}</p>
        </section>
      </div>

      <div class="policy-actions">
        <button @click="goToTerms" class="action-btn terms-btn">
          <i class="fa-solid fa-file-contract"></i>
          <span>Điều khoản sử dụng</span>
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
const goToTerms = () => router.push('/terms');
const goToHome = () => router.push('/');
const goToFAQ = () => router.push('/faq');

const privacyPolicySections = ref([
  {
    title: 'Thu thập thông tin cá nhân',
    content: `Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Khi bạn truy cập và sử dụng dịch vụ, chúng tôi có thể thu thập các thông tin sau: Thông tin cá nhân như họ tên, địa chỉ email, số điện thoại để xác minh và hỗ trợ khách hàng. Thông tin sử dụng, bao gồm lịch sử hoạt động, thiết bị truy cập, và thông tin cookies nhằm tối ưu hóa trải nghiệm người dùng.`,
  },
  {
    title: 'Sử dụng Thông tin Cá nhân',
    content: `Chúng tôi chỉ sử dụng thông tin cá nhân của bạn cho các mục đích sau: Cải thiện chất lượng dịch vụ, cung cấp dịch vụ và hỗ trợ khách hàng. Phát triển tính năng mới và tối ưu hóa trải nghiệm sử dụng. Thực hiện các yêu cầu pháp lý hoặc bảo mật thông tin theo quy định.`,
  },
  {
    title: 'Chia sẻ và Bảo vệ Thông tin Cá nhân',
    content: `Chúng tôi cam kết không chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ trường hợp có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật. Các biện pháp bảo mật kỹ thuật và tổ chức được áp dụng để ngăn chặn việc truy cập trái phép, tiết lộ, sửa đổi hoặc phá hủy thông tin cá nhân của bạn.`,
  },
  {
    title: 'Quyền Của Người Dùng',
    content: `Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa bỏ thông tin cá nhân của mình bất cứ lúc nào bằng cách liên hệ với chúng tôi. Nếu bạn có bất kỳ thắc mắc hoặc lo ngại nào về chính sách bảo mật của chúng tôi, vui lòng liên hệ qua địa chỉ email hỗ trợ.`,
  },
]);
</script>

<style scoped>
/* ========== WRAPPER ========== */
.policy-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

html.dark-mode .policy-wrapper {
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 100%);
}

/* ========== CONTAINER ========== */
.policy-container {
  max-width: 900px;
  margin: 0 auto;
}

/* ========== HEADER ========== */
.policy-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 30px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(245, 87, 108, 0.1);
  position: relative;
  overflow: hidden;
}

html.dark-mode .policy-header {
  background: #1e1e1e;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.policy-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.header-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(245, 87, 108, 0.3);
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
  color: #f5576c;
  font-weight: 800;
  letter-spacing: 0.5px;
}

html.dark-mode .header-title {
  color: #fb7185;
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
.policy-content {
  margin-bottom: 40px;
}

.policy-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border-left: 4px solid #f5576c;
}

html.dark-mode .policy-section {
  background: #1e1e1e;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border-left-color: #fb7185;
}

.policy-section:hover {
  box-shadow: 0 8px 24px rgba(245, 87, 108, 0.12);
  transform: translateY(-2px);
}

html.dark-mode .policy-section:hover {
  box-shadow: 0 8px 24px rgba(251, 113, 133, 0.2);
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
.policy-actions {
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

.faq-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* ========== RESPONSIVE ========== */

/* Tablet */
@media (max-width: 1024px) {
  .policy-wrapper {
    padding: 70px 20px 50px;
  }

  .policy-header {
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

  .policy-section {
    padding: 28px;
  }

  .policy-actions {
    gap: 14px;
  }

  .action-btn {
    padding: 14px 20px;
    font-size: 0.9rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .policy-wrapper {
    padding: 60px 15px 40px;
  }

  .policy-header {
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

  .policy-section {
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

  .policy-actions {
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
  .policy-wrapper {
    padding: 50px 10px 30px;
  }

  .policy-header {
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

  .policy-section {
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
  .policy-wrapper {
    padding: 45px 8px 25px;
  }

  .policy-header {
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

  .policy-section {
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
