<template>
  <TheHeader />
  <section class="hero-section" :style="{ backgroundImage: `url(${currentBackground})` }" data-aos="fade-in">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h2 class="hero-round">{{ currentRound }}</h2>
      <h1 class="hero-title">{{ currentTitle }}</h1>
      <p class="hero-description">{{ currentDescription }}</p>
      <n-button size="large" type="primary" @click="handleButtonClick">{{ currentButtonText }}</n-button>
    </div>
    <button class="prev-btn" @click="prevSlide">Prev</button>
    <button class="next-btn" @click="nextSlide">Next</button>
  </section>
  <Notification/>
  <section class="future-projects-section" ref="futureSection" data-aos="fade-in">
    <h2 class="future-projects-title text-uppercase">Dự Án Tương Lai</h2>
    <div class="future-projects-carousel">
      <div class="future-project-item" v-for="project in futureProjects" :key="project.name">
        <h3 class="future-project-name">{{ project.name }}</h3>
        <span class="future-project-timeline">Dự kiến: {{ project.timeline }}</span>
        <p class="future-project-description">{{ project.description }}</p>
      </div>
    </div>
  </section>
  <section class="video-section" data-aos="zoom-in">
    <h2 class="section-title text-uppercase">Cho Lần Đầu Gặp Gỡ</h2>
    <div class="video-container">
      <video controls>
        <source src="#!" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  </section>
    <section class="feature-section" data-aos="fade-up">
    <h2 class="feature-section-title text-uppercase">Dấu Ấn Hôm Nay</h2>
    <div class="feature-grid">
      <div 
        class="feature-item" 
        v-for="(feature, index) in features" 
        :key="feature.title" 
        @click="vote(index + 1)"
        @mouseover="hoveredFeature = feature.title" 
        @mouseleave="hoveredFeature = null"
        :class="{ 
          'hovered': hoveredFeature === feature.title,
          'voted': voteStore.userVoteChoice === (index + 1)
        }"
      >
        <n-icon size="64" :class="feature.iconClass">
          <component :is="feature.icon" />
        </n-icon>
        <h3 class="feature-title ">{{ feature.title }}</h3>
        <p class="feature-description">{{ feature.description }}</p>
        <p v-if="voteResults.totalVotes > 0" class="feature-percentage">
          {{ (Math.round((voteResults.votesByChoice[index + 1] || 0) / voteResults.totalVotes * 100 * 100) / 100).toFixed(2).replace(/\.00$/, '') }}%
        </p>
      </div>
    </div>
  </section>
  <TheFooter/>
</template>

<script setup>
import { ref, markRaw,computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import api from '../../services/axiosInterceptor';
import Handshake20Filled from '@vicons/fluent/Handshake20Filled';
import StarEmphasis24Filled from '@vicons/fluent/StarEmphasis24Filled';
import {Rocket} from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { useAuthStore } from '../../stores/auth';
import { useVoteStore } from '../../stores/vote';
import Notification from '../../components/Notification.vue';
const voteStore = useVoteStore(); 
const authStore = useAuthStore();
const message = useMessage();
const router = useRouter();
const voteResults = ref({
  totalVotes: 0,
  votesByChoice: {}
});
const heroSlides = ref([
  {
    background: '../../assets/img/slide1.jpg',
    title: 'Welcome to Selorson Tales',
    description: 'Nơi những cuộc phiêu lưu đang chờ đợi bạn...',
    buttonText: 'Get Started'

  },
  {
    background: '../../assets/img/slide2.jpg',
    round: 'Khởi động!',
    title: 'Hãy đến với Selorson Tales',
    description: 'Kết nối với tôi, chúng ta cùng nhau xây dựng một cộng đồng vui vẻ, nhiều màu sắc nhé!',
    buttonText: 'Tới Trang Liên Hệ'
  },
  {
    background: '../../assets/img/slide3.jpg',
    round: 'Vượt chướng ngại vật! ',
    title: 'Câu chuyện của tác giả',
    description: 'Câu chuyện về sự ra đời của thế giới Selorson...',
    buttonText: 'Tới Trang Giới Thiệu'
  },
  {
    background: '../../assets/img/slide4.jpg',
    round: 'Tăng tốc!',
    title: 'Thế giới bản đồ',
    description: 'Khám phá thế giới của Selorson theo một cách khác!',
    buttonText: 'Tới Trang Bản Đồ'
  },
  {
    background: '../../assets/img/slide5.jpg',
    round: 'Về Đích!',
    title: 'Let\'s Go!!!',
    description: 'Hòa mình vào cộng đồng Selorson và thư giãn cùng những trang sách!',
    buttonText: 'Tới Trang Đọc Truyện'
  }
]);
const futureProjects = ref([
  { 
    name: 'Selorson App', 
    timeline: '2026', 
    description: 'Ứng dụng di động Selorson sẽ cung cấp trải nghiệm đọc truyện, tương tác bản đồ và kết nối cộng đồng.' 
  },
  { 
    name: 'Selorson YouTube', 
    timeline: '2027', 
    description: 'Kênh YouTube Selorson sẽ bao gồm podcast, clip giải thích, bàn luận và phim hoạt hình, chúng ta sẽ trò chuyện với nhau thế giới Selorson.' 
  },
  { 
    name: 'Selorson World', 
    timeline: '2028', 
    description: 'Selorson World sẽ mở ra một thế giới ảo, cho phép người dùng khám phá và tương tác với nhau trong không gian kỳ ảo.' 
  },
]);

const currentSlideIndex = ref(0);
const nextSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % heroSlides.value.length;
};

const prevSlide = () => {
  currentSlideIndex.value =
    (currentSlideIndex.value - 1 + heroSlides.value.length) % heroSlides.value.length;
};

const currentBackground = computed(() => heroSlides.value[currentSlideIndex.value].background);
const currentRound = computed(() => heroSlides.value[currentSlideIndex.value].round);
const currentTitle = computed(() => heroSlides.value[currentSlideIndex.value].title);
const currentDescription = computed(() => heroSlides.value[currentSlideIndex.value].description);
const currentButtonText = computed(() => heroSlides.value[currentSlideIndex.value].buttonText);


const features = ref([
  { icon: markRaw(StarEmphasis24Filled), iconClass: 'green-star', title: 'Tặng Tôi Một Ngôi Sao', description: 'Hãy ghi nhận nỗ lực của tôi và khích lệ tinh thần để tôi có thể tiếp tục vươn xa hơn!' },
  { icon: markRaw(Rocket), iconClass: 'black-rocket', title: 'Phóng Vô Tôi Một Trái Rocket', description: 'Nhắc nhở tôi về những điều cần cải thiện, giúp tôi nâng cao chất lượng nội dung và giao diện hơn nữa!' },
  { icon: markRaw(Handshake20Filled), iconClass: 'Handshake', title: 'Trao Nhau Cái Bắt Tay', description: 'Chúng ta cùng nhau chia sẻ cảm xúc, nhận ra rằng ai cũng có những khuyết điểm. Bạn thông cảm cho những thiếu sót của tôi, còn tôi sẽ luôn luôn ở đây, lắng nghe và hỗ trợ bạn!' }
]);

const handleButtonClick = () => {
  if (currentButtonText.value === 'Get Started') {
    scrollToFeatures(); 
  } else if (currentButtonText.value === 'Tới Trang Liên Hệ') {
    goToContacts(); 
  } else if (currentButtonText.value === 'Tới Trang Giới Thiệu') {
    goToAbout(); 
  } else if (currentButtonText.value === 'Tới Trang Bản Đồ') {
    goToMaps(); 
  } else if (currentButtonText.value === 'Tới Trang Đọc Truyện') {
    goToStories();
  }
}; 

const futureSection = ref(null);
const scrollToFeatures = () => {
  futureSection.value.scrollIntoView({ behavior: 'smooth' });
};
const goToContacts = () => {
   router.push({ name: 'contact' });
};
const goToAbout = () => {
   router.push({ name: 'about' });
};
const goToMaps = () => {
   router.push({ name: 'maps' });
};
const goToStories = () => {
  
  if (!authStore.isLoggedIn) {
    message.warning('Vui lòng đăng nhập để đọc truyện bạn nhé!');
  } else {
    router.push({ name: 'stories' });
  }
};

const hoveredFeature = ref(null);

const vote = async (choice) => {
  if (!authStore.isLoggedIn) {
    message.warning('Vui lòng đăng nhập để vote!');
    return;
  }

  try {
    const response = await api.post('/vote/createOrUpdate', { choice }); 
    message.success(response.data.message);
    voteStore.userVoteChoice = choice; 
  } catch (error) {
    if (error.response && error.response.data) {
      message.error(error.response.data.message);
    } else {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  }
};

const getVoteResults = async () => {
  try {
    const response = await api.get('/vote/results');
    voteResults.value = {
      totalVotes: response.data.total_users_voted,
      votesByChoice: response.data.votes_by_choice.reduce((acc, vote) => {
        acc[vote.choice] = vote.total;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Lỗi khi lấy kết quả vote:', error);
  }
};
onMounted(async () => {
  AOS.init();
  voteStore.getUserVote();
  await getVoteResults();
});
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.hero-section {
  position: relative;
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  transition: background-image 1s ease-in-out;
  margin-bottom: 0px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #C4DFDF;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
}

.hero-round {
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-transform: uppercase;
  color: red;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.hero-description {
  font-size: 1.8rem;
  color: #804F37;
  margin-bottom: 30px;
  line-height: 1.5;
}

.prev-btn,
.next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

.prev-btn:hover,
.next-btn:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.feature-section {
  padding: 40px 50px;
  background-color: #F8F6F4;
  text-align: center;
}

.feature-item.voted {
  background-color: #f0f8ff;
  border: 2px solid #007bff;
}

.green-star {
  color: rgb(16, 188, 16);
}

.black-rocket {
  color: black;
}

.Handshake {
  color: rgb(69, 69, 242);
}

.feature-section-title {
  font-size: 2rem;
  margin-bottom: 50px;
  color: #34495e;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-item {
  position: relative;
  background-color: white;
  cursor: pointer;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-item:hover {
  transform: translateY(-10px);
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.hovered {
  background-color: rgba(255, 255, 255, 0.2);
}

p.feature-percentage {
  position: absolute;
  font-size: 1.25rem;
  font-weight: bold; 
  color: #4CAF50; 
  text-align: center; 
  background-color: #e8f5e9; 
  border-radius: 8px; 
  padding: 5px 15px; 
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); 
  margin-bottom: 0px;
  bottom: 10px;
  left: 50%; 
  transform: translateX(-50%);
}


.future-projects-section {
  padding: 40px 50px;
  background-color: #E3F4F4;
  text-align: center;
}

.future-projects-title {
  font-size: 2rem;
  margin-bottom: 50px;
  color: #34495e;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #2c3e50;
}

.feature-description {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.future-projects-carousel {
  display: flex;
  justify-content: space-around;
}

.future-project-item {
  max-width: 300px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.future-project-name {
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #2c3e50;
}

.future-project-timeline {
  font-size: 1rem;
  color: #7f8c8d;
}

.future-project-description {
  font-size: 1.2rem;
  margin-bottom: 15px;
}


.section-title {
  font-size: 2rem;
  margin-bottom: 50px;
  color: #34495e;
  text-align: center;
}

.video-section {
  padding: 40px 50px;
  background-color: #e8f1f2;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

video {
  width: 50%; /* Hoặc tùy chỉnh kích thước video */
  height: auto;
  object-fit: cover; /* Giữ tỉ lệ của video */
}


n-button {
  transition: all 0.3s ease;
}

n-button:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
