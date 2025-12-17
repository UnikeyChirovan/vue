<template>
  <n-layout-footer class="footer">
    <div class="footer-container">
      <!-- Top Section -->
      <div class="footer-top">
        <!-- Logo & Brand -->
        <div class="footer-brand">
          <div class="brand-logo-wrapper">
            <div class="logo-ring"></div>
            <div class="logo-ring-inner"></div>
            <img
              v-if="introImage"
              :src="introImage"
              alt="Logo Công Ty"
              class="brand-logo"
            />
          </div>
          <h3 class="brand-name">Selorson Tales</h3>
          <p class="brand-tagline">Chút sắc màu cuộc sống</p>
        </div>

        <!-- Vote Statistics -->
        <div class="vote-stats">
          <div class="stat-item total">
            <div class="stat-icon-wrapper">
              <n-icon size="48" class="stat-icon">
                <Sigma />
              </n-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ voteResults.totalVotes }}</span>
              <span class="stat-label">Tổng Votes</span>
            </div>
            <div class="stat-decoration"></div>
          </div>

          <div class="stat-item choice-1">
            <div class="stat-icon-wrapper">
              <n-icon size="48" class="stat-icon">
                <Star />
              </n-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{
                voteResults.votesByChoice[1] || 0
              }}</span>
              <span class="stat-label">Lựa Chọn 1</span>
            </div>
            <div class="stat-decoration"></div>
          </div>

          <div class="stat-item choice-2">
            <div class="stat-icon-wrapper">
              <n-icon size="48" class="stat-icon">
                <Rocket />
              </n-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{
                voteResults.votesByChoice[2] || 0
              }}</span>
              <span class="stat-label">Lựa Chọn 2</span>
            </div>
            <div class="stat-decoration"></div>
          </div>

          <div class="stat-item choice-3">
            <div class="stat-icon-wrapper">
              <n-icon size="48" class="stat-icon">
                <Handshake20Filled />
              </n-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{
                voteResults.votesByChoice[3] || 0
              }}</span>
              <span class="stat-label">Lựa Chọn 3</span>
            </div>
            <div class="stat-decoration"></div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="footer-main">
        <!-- About Section -->
        <div class="footer-column">
          <h5 class="column-title">VỀ CHÚNG TÔI</h5>
          <ul class="footer-links">
            <li><router-link to="/about">Giới Thiệu</router-link></li>
            <li><router-link to="/contact">liên lạc</router-link></li>
          </ul>
        </div>

        <!-- Support Section -->
        <div class="footer-column">
          <h5 class="column-title">HỖ TRỢ</h5>
          <ul class="footer-links">
            <li><router-link to="/faq">FAQs</router-link></li>
            <li><router-link to="/policy">Chính sách bảo mật</router-link></li>
            <li><router-link to="/terms">Điều khoản dịch vụ</router-link></li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div class="footer-column">
          <h5 class="column-title">THÔNG TIN liên lạc</h5>
          <div class="contact-info">
            <p class="contact-item">
              <span class="contact-icon">✉</span>
              <span>selorson.tcv@gmail.com</span>
            </p>
            <p class="contact-item">
              <span class="contact-icon">📞</span>
              <span>0974.170.194 - Mr. Redfox</span>
            </p>
          </div>
          <div class="social-links">
            <n-button text class="social-btn facebook">
              <i class="fab fa-facebook-f"></i>
            </n-button>
            <n-button text class="social-btn twitter">
              <i class="fab fa-twitter"></i>
            </n-button>
            <n-button text class="social-btn instagram">
              <i class="fab fa-instagram"></i>
            </n-button>
            <n-button text class="social-btn youtube">
              <i class="fab fa-youtube"></i>
            </n-button>
          </div>
        </div>

        <!-- Newsletter Section -->
        <div class="footer-column newsletter">
          <h5 class="column-title">ĐĂNG KÝ NHẬN TIN</h5>
          <form @submit.prevent="subscribeToNewsletter" class="newsletter-form">
            <input
              v-model="email"
              type="email"
              placeholder="Nhập email của bạn"
              class="newsletter-input"
            />
            <button type="submit" class="newsletter-button">
              <span>Đăng ký</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="footer-bottom">
        <p class="copyright">&copy; 2024 TCV. All rights reserved.</p>
      </div>
    </div>
  </n-layout-footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLoadingStore } from '../stores/loadingStore';
import { NLayoutFooter, NButton } from 'naive-ui';
import { Star, Rocket } from '@vicons/ionicons5';
import Handshake20Filled from '@vicons/fluent/Handshake20Filled';
import Sigma from '@vicons/carbon/Sigma';
import { useMessage } from 'naive-ui';
import apiLinks from '../services/api-links';
import api from '../services/axiosInterceptor';
import eventBus from '../stores/eventBus';

const message = useMessage();

const voteResults = ref({
  totalVotes: 0,
  votesByChoice: {},
});

const getVoteResults = async () => {
  const storedVoteResults = localStorage.getItem('voteResults');

  if (storedVoteResults) {
    voteResults.value = JSON.parse(storedVoteResults);
  } else {
    try {
      const response = await apiLinks.votes.getVoteResults();
      voteResults.value = {
        totalVotes: response.data.total_users_voted,
        votesByChoice: response.data.votes_by_choice.reduce((acc, vote) => {
          acc[vote.choice] = vote.total;
          return acc;
        }, {}),
      };
      localStorage.setItem('voteResults', JSON.stringify(voteResults.value));
    } catch (error) {
      console.error('Lỗi khi lấy kết quả vote:', error);
    }
  }
};

const email = ref('');

const subscribeToNewsletter = async () => {
  if (!email.value) {
    message.warning('Vui lòng nhập email');
    return;
  }

  try {
    const response = await api.post('/newsletter/subscribe', {
      email: email.value,
    });
    message.success(response.data.success);
    email.value = '';
  } catch (error) {
    message.error(error.response.data.error || 'Có lỗi xảy ra!');
  }
};

const loadingStore = useLoadingStore();
const introImage = ref(null);

const fetchIntroImage = async () => {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  const intro = images.find((img) => img.image_name === 'LOGO');

  if (intro) {
    introImage.value = `http://127.0.0.1:8000/storage/${intro.image_path}`;
  } else {
    try {
      const response = await apiLinks.imageManager.getImages();
      localStorage.setItem('images', JSON.stringify(response.data));
      images = response.data || [];
      const updatedIntro = images.find((img) => img.image_name === 'LOGO');
      if (updatedIntro) {
        introImage.value = `http://127.0.0.1:8000/storage/${updatedIntro.image_path}`;
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu hình ảnh:', error);
    }
  }
};

onMounted(() => {
  getVoteResults();
  fetchIntroImage();

  eventBus.on('voteUpdated', (updatedVoteResults) => {
    voteResults.value = updatedVoteResults;
  });

  window.addEventListener('storage', () => {
    const storedVoteResults = localStorage.getItem('voteResults');
    if (storedVoteResults) {
      voteResults.value = JSON.parse(storedVoteResults);
    }
  });
});

onUnmounted(() => {
  eventBus.off('voteUpdated');
  window.removeEventListener('storage', () => {});
});
</script>

<style scoped>
/* ========== ENHANCED FOOTER DESIGN ========== */
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0c713d, #0a5a31, #0c713d);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px 30px;
}

/* ========== TOP SECTION - ENHANCED ========== */
.footer-top {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 60px;
  padding-bottom: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 50px;
}

/* Enhanced Logo */
.footer-brand {
  text-align: center;
}

.brand-logo-wrapper {
  width: 180px;
  height: 180px;
  margin: 0 auto 25px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.3),
    rgba(10, 90, 49, 0.2)
  );
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.logo-ring-inner {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0c713d, #0a5a31);
  box-shadow:
    0 0 30px rgba(12, 113, 61, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.brand-logo {
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.brand-name {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.brand-tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0;
  font-style: italic;
}

/* Enhanced Vote Statistics */
.vote-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-decoration {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 150%;
  height: 150%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.stat-item.total .stat-icon-wrapper {
  background: linear-gradient(
    135deg,
    rgba(231, 76, 60, 0.2),
    rgba(192, 57, 43, 0.1)
  );
  box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
}

.stat-item.choice-1 .stat-icon-wrapper {
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.2),
    rgba(10, 90, 49, 0.1)
  );
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
}

.stat-item.choice-2 .stat-icon-wrapper {
  background: linear-gradient(
    135deg,
    rgba(52, 73, 94, 0.2),
    rgba(44, 62, 80, 0.1)
  );
  box-shadow: 0 4px 20px rgba(52, 73, 94, 0.3);
}

.stat-item.choice-3 .stat-icon-wrapper {
  background: linear-gradient(
    135deg,
    rgba(52, 152, 219, 0.2),
    rgba(41, 128, 185, 0.1)
  );
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
}

.stat-item:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.stat-item.total .stat-icon {
  color: #e74c3c;
}

.stat-item.choice-1 .stat-icon {
  color: #0c713d;
}

.stat-item.choice-2 .stat-icon {
  color: #34495e;
}

.stat-item.choice-3 .stat-icon {
  color: #3498db;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

/* ========== MAIN CONTENT ========== */
.footer-main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 12px;
}

.column-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #0c713d, transparent);
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: inline-block;
  position: relative;
}

.footer-links a::before {
  content: '→';
  position: absolute;
  left: -20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #0c713d;
  padding-left: 20px;
}

.footer-links a:hover::before {
  opacity: 1;
  left: 0;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.contact-item {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.contact-icon {
  font-size: 1.2rem;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 12px;
}

.social-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.social-btn.facebook {
  color: #1877f2;
}

.social-btn.facebook:hover {
  background: rgba(24, 119, 242, 0.1);
  border-color: #1877f2;
}

.social-btn.twitter {
  color: #1da1f2;
}

.social-btn.twitter:hover {
  background: rgba(29, 161, 242, 0.1);
  border-color: #1da1f2;
}

.social-btn.instagram {
  background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.social-btn.instagram:hover {
  background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
  -webkit-background-clip: initial;
  -webkit-text-fill-color: white;
  border-color: #dd2a7b;
}

.social-btn.youtube {
  color: #ff0000;
}

.social-btn.youtube:hover {
  background: rgba(255, 0, 0, 0.1);
  border-color: #ff0000;
}

/* Newsletter */
.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.newsletter-input {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  transition: all 0.3s ease;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.newsletter-input:focus {
  outline: none;
  border-color: #0c713d;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

.newsletter-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.3);
}

.newsletter-button:hover {
  background: linear-gradient(135deg, #0a5a31 0%, #084524 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

.newsletter-button svg {
  transition: transform 0.3s ease;
}

.newsletter-button:hover svg {
  transform: translateX(3px);
}

/* ========== BOTTOM SECTION ========== */
.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin: 0;
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1200px) {
  .footer-container {
    padding: 50px 30px 25px;
  }

  .footer-top {
    grid-template-columns: 320px 1fr;
    gap: 50px;
  }

  .brand-logo-wrapper {
    width: 160px;
    height: 160px;
  }

  .brand-logo {
    width: 120px;
    height: 120px;
  }

  .vote-stats {
    gap: 15px;
  }

  .stat-item {
    padding: 20px 15px;
  }

  .stat-icon-wrapper {
    width: 70px;
    height: 70px;
  }

  .stat-icon {
    font-size: 42px !important;
  }

  .stat-value {
    font-size: 2rem;
  }
}

@media (max-width: 992px) {
  .footer-container {
    padding: 40px 25px 20px;
  }

  .footer-top {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .vote-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-main {
    grid-template-columns: repeat(2, 1fr);
    gap: 35px;
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 35px 20px 20px;
  }

  .footer-top {
    gap: 35px;
    padding-bottom: 35px;
    margin-bottom: 35px;
  }

  .brand-logo-wrapper {
    width: 140px;
    height: 140px;
  }

  .brand-logo {
    width: 100px;
    height: 100px;
  }

  .brand-name {
    font-size: 1.6rem;
  }

  .vote-stats {
    gap: 12px;
  }

  .stat-item {
    padding: 18px 15px;
  }

  .stat-icon-wrapper {
    width: 65px;
    height: 65px;
  }

  .stat-icon {
    font-size: 38px !important;
  }

  .stat-value {
    font-size: 1.8rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 30px 15px 15px;
  }

  .footer-top {
    gap: 30px;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }

  .brand-logo-wrapper {
    width: 120px;
    height: 120px;
  }

  .brand-logo {
    width: 85px;
    height: 85px;
  }

  .brand-name {
    font-size: 1.4rem;
  }

  .brand-tagline {
    font-size: 0.95rem;
  }

  .vote-stats {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-item {
    flex-direction: row;
    padding: 15px;
    gap: 15px;
  }

  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }

  .stat-icon {
    font-size: 34px !important;
  }

  .stat-content {
    align-items: flex-start;
  }

  .stat-value {
    font-size: 1.8rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .footer-main {
    gap: 25px;
  }

  .column-title {
    font-size: 1rem;
  }
}
</style>
