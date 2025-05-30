<template>
  <n-layout-footer class="footer text-white py-4">
    <div class="container">
      <!-- Logo và tên công ty -->
      <div class="row">
        <div class="col-md-2">
          <h3 class="company-name text-uppercase text-white">Selorson Tales</h3>
          <p class="text-white">Chút sắc màu cuộc sống</p>
          <img :src="introImage" alt="Logo Công Ty" class="company-logo mb-3" />
        </div>
        <div class="col-md-10">
          <div class="row mb-2">
            <div class="col-12 d-flex justify-content-evenly">
              <div class="icon">
                <n-icon size="30">
                  <Sigma style="color: red;" />
                </n-icon>
                {{ voteResults.totalVotes }}
              </div>
              <div class="icon">
                <n-icon size="30">
                  <Star style="color: green;" />
                </n-icon>
                {{ voteResults.votesByChoice[1] || 0 }}
              </div>
              <div class="icon">
                <n-icon size="30">
                  <Rocket style="color: black;" />
                </n-icon>
                {{ voteResults.votesByChoice[2] || 0 }}
              </div>
              <div class="icon">
                <n-icon size="30">
                  <Handshake20Filled style="color: blue;" />
                </n-icon>
                {{ voteResults.votesByChoice[3] || 0 }}
              </div>
            </div>
          </div>
          <div class="row m-0 p-0">
            <div class="col-md-3">
              <h5 class="text-white">VỀ CHÚNG TÔI</h5>
              <ul class="list-unstyled">
                <li><router-link to="/about" class="text-white">Giới Thiệu</router-link></li>
                <li><router-link to="/contact" class="text-white">Liên Hệ</router-link></li>
              </ul>
            </div>
            <div class="col-md-3">
              <h5 class="text-white">HỖ TRỢ</h5>
              <ul class="list-unstyled">
                <li><router-link to="/faq" class="text-white">FAQs</router-link></li>
                <li><router-link to="/policy" class="text-white">Chính sách bảo mật</router-link></li>
                <li><router-link to="/terms" class="text-white">Điều khoản dịch vụ</router-link></li>
              </ul>
            </div>
            <div class="col-md-3">
              <h5 class="text-uppercase text-white">Thông Tin Liên Hệ</h5>
              <p class="text-white mb-1"><strong>Email:</strong> selorson.tcv@gmail.com</p>
              <p class="text-white mb-1"><strong>Hotline:</strong> 0974.170.194 - Mr. Redfox</p>
              <div class="col-12 text-md-right mt-2">
                <n-space style="display: flex; justify-content: space-between;">
                  <n-button ghost text>
                    <i class="fab fa-facebook-f" style="font-size: 20px; color: #1877F2;"></i>
                  </n-button>
                  <n-button ghost text>
                    <i class="fab fa-twitter" style="font-size: 20px; color: #1DA1F2;"></i>
                  </n-button>
                  <n-button ghost text>
                    <i class="fab fa-instagram" style="font-size: 20px; background: radial-gradient(circle at 30% 30%, #F58529, #DD2A7B, #8134AF, #515BD4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i>
                  </n-button>
                  <n-button ghost text>
                    <i class="fab fa-youtube" style="font-size: 20px; color: #FF0000;"></i>
                  </n-button>
                </n-space>
              </div>
            </div>
            <div class="col-md-3 newsletter-form">
              <h5 class="text-uppercase text-white">Đăng Ký Nhận Tin</h5>
              <form @submit.prevent="subscribeToNewsletter">
                <input v-model="email" placeholder="Nhập email của bạn" class="newsletter-input" />
                <button type="submit" class="newsletter-button mt-2">Đăng ký</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 text-center">
          <p class="text-white">&copy; 2024 TCV. All rights reserved.</p>
        </div>
      </div>
    </div>
  </n-layout-footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLoadingStore } from '../stores/loadingStore';
import { NLayoutFooter, NButton, NInput, NSpace } from 'naive-ui';
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
  votesByChoice: {}
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
        }, {})
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
    const response = await api.post('/newsletter/subscribe', { email: email.value });
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
  const intro = images.find(img => img.image_name === 'LOGO');

  if (intro) {
    introImage.value = `http://127.0.0.1:8000/storage/${intro.image_path}`;
  } else {
    try {
      const response = await apiLinks.imageManager.getImages();
      localStorage.setItem('images', JSON.stringify(response.data));
      images = response.data || [];
      const updatedIntro = images.find(img => img.image_name === 'LOGO');
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

  // Lắng nghe sự kiện mitt khi vote thay đổi
  eventBus.on('voteUpdated', (updatedVoteResults) => {
    voteResults.value = updatedVoteResults;
  });

  // Lắng nghe sự kiện storage khi thay đổi giữa các tab
  window.addEventListener("storage", () => {
    const storedVoteResults = localStorage.getItem("voteResults");
    if (storedVoteResults) {
      voteResults.value = JSON.parse(storedVoteResults);
    }
  });
});

onUnmounted(() => {
  eventBus.off('voteUpdated'); // Hủy lắng nghe mitt để tránh memory leak
  window.removeEventListener("storage", () => {});
});

</script>



<style scoped>
.footer {
  background-color: #424844;
}

.company-name {
  font-weight: bold;
  color: #fff;
}

a:hover {
  text-decoration: underline;
}

.icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.newsletter-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: black; 
}

.newsletter-input::placeholder {
  color: #999;
}

.newsletter-button {
  max-width: 50%;
  background-color: #28a745; 
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}
.newsletter-button:hover {
  background-color: #218838; 
}

.mt-2 {
  margin-top: 10px;
}


</style>
