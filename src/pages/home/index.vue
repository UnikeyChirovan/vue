<template>
  <TheHeader />
  <LoadingModal v-if="loadingStore.isDataLoading"/>
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
  <Notification :title="notificationTitle"/>
  <section class="future-projects-section" ref="futureSection" data-aos="fade-in">
    <h2 class="future-projects-title text-uppercase">{{ futureProjectTitle }}</h2>
    <div class="future-projects-carousel">
      <div class="future-project-item" v-for="project in futureProjects" :key="project.name">
        <h3 class="future-project-name">{{ project.name }}</h3>
        <span class="future-project-timeline">Dự kiến: {{ project.timeline }}</span>
        <p class="future-project-description">{{ project.description }}</p>
      </div>
    </div>
  </section>
  <section class="video-section" >
    <h2 class="section-title text-uppercase">{{ firstMeetTitle }}</h2>
    <div class="video-container" v-if="featuredVideo">
      <video controls preload="metadata">
        <source :src="getVideoUrl(featuredVideo.video_path)" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <p class="video-title">{{ featuredVideo.video_name }}</p>
    </div>
    <p v-else>Chưa có thông tin video nào.</p>
  </section>
  <section class="feature-section" data-aos="fade-up">
    <h2 class="feature-section-title text-uppercase">{{ todayFeatureTitle }}</h2>
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
import eventBus from '../../stores/eventBus';
import apiLinks from '../../services/api-links';
import Handshake20Filled from '@vicons/fluent/Handshake20Filled';
import StarEmphasis24Filled from '@vicons/fluent/StarEmphasis24Filled';
import {Rocket} from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { useAuthStore } from '../../stores/auth';
import { useVoteStore } from '../../stores/vote';
import Notification from '../../components/Notification.vue';
import LoadingModal from '../../components/LoadingModal.vue';
import { useLoadingStore } from '../../stores/loadingStore';
import { useCategoryStore } from '../../stores/useCategoryStore';
const BaseURL = 'http://127.0.0.1:8000';
const getVideoUrl = (path) => `${BaseURL}/storage/${path}`;

const loadingStore = useLoadingStore();
const voteStore = useVoteStore(); 
const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const message = useMessage();
const router = useRouter();

const futureProjectTitle = computed(() => categoryStore.getCategoryTitle('2', 'home', 'Dự Án Tương Lai'));
const firstMeetTitle = computed(() => categoryStore.getCategoryTitle('3', 'home', 'Thất Sắc Chi Đạo – Khi Số Phận Gọi Tên'));
const todayFeatureTitle = computed(() => categoryStore.getCategoryTitle('4', 'home', 'Ý Kiến Của Bạn Quan Trọng!'));
const notificationTitle = computed(() => categoryStore.getCategoryTitle('1', 'home', 'Theo Dòng Sự Kiện'));
const voteResults = ref({
  totalVotes: 0,
  votesByChoice: {}
});
const heroSlides = ref([]);
const isHeroSlidesReady = ref(false); 
const futureProjects = ref([]);
const featuredVideo = ref(null);


const currentSlideIndex = ref(0);
const nextSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % heroSlides.value.length;
};

const prevSlide = () => {
  currentSlideIndex.value =
    (currentSlideIndex.value - 1 + heroSlides.value.length) % heroSlides.value.length;
};

const currentBackground = computed(() => isHeroSlidesReady.value ? heroSlides.value[currentSlideIndex.value].image_url : '');
const currentRound = computed(() => isHeroSlidesReady.value ? heroSlides.value[currentSlideIndex.value].round : '');
const currentTitle = computed(() => isHeroSlidesReady.value ? heroSlides.value[currentSlideIndex.value].title : '');
const currentDescription = computed(() => isHeroSlidesReady.value ? heroSlides.value[currentSlideIndex.value].description : '');
const currentButtonText = computed(() => isHeroSlidesReady.value ? heroSlides.value[currentSlideIndex.value].button_text : '');


const features = ref([]);
const iconMap = {
  'StarEmphasis24Filled': markRaw(StarEmphasis24Filled),
  'Rocket': markRaw(Rocket),
  'Handshake20Filled': markRaw(Handshake20Filled),
};

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

const voteUpdated = ref(false);

const vote = async (choice) => {
  if (!authStore.isLoggedIn) {
    message.warning('Vui lòng đăng nhập để vote!');
    return;
  }

  try {
    const response = await api.post('/vote/createOrUpdate', { choice }); 
    message.success(response.data.message);
    
    voteStore.userVoteChoice = choice; 
    voteUpdated.value = true;
    await updateVoteResults();
  } catch (error) {
    message.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
  }
};

const updateVoteResults = async () => {
  try {
    const response = await api.get('/vote/results');

    voteResults.value = {
      totalVotes: response.data.total_users_voted,
      votesByChoice: response.data.votes_by_choice.reduce((acc, vote) => {
        acc[vote.choice] = vote.total;
        return acc;
      }, {})
    };

    if (voteUpdated.value) {
      localStorage.removeItem('voteResults');
      localStorage.setItem('voteResults', JSON.stringify(voteResults.value));
      voteUpdated.value = false;
      eventBus.emit('voteUpdated', voteResults.value);
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật kết quả vote:', error);
  }
};


const observeLocalStorageChange = () => {
  const originalSetItem = localStorage.setItem;

  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    switch (key) {
      case 'heroSlides':
        heroSlides.value = JSON.parse(value);
        isHeroSlidesReady.value = true;
        break;
      case 'futureProjects':
        futureProjects.value = JSON.parse(value);
        break;
      case 'features':
        features.value = JSON.parse(value).map(item => ({
          ...item,
          icon: item.icon ? iconMap[item.icon] : null,
          iconClass: item.icon_class,
        }));
        break;
    }
  };
};


const loadHeroSlidesFromStorage = () => {
  const heroSlidesData = localStorage.getItem('heroSlides');
  if (heroSlidesData) {
    heroSlides.value = JSON.parse(heroSlidesData);
    isHeroSlidesReady.value = true;
  }
};

const loadFutureProjectsFromStorage = () => {
  const futureProjectsData = localStorage.getItem('futureProjects');
  if (futureProjectsData) {
    futureProjects.value = JSON.parse(futureProjectsData);
  }
};

const loadFeaturesFromStorage = () => {
  const featuresData = localStorage.getItem('features');
  if (featuresData) {
    features.value = JSON.parse(featuresData).map(item => ({
      ...item,
      icon: item.icon ? iconMap[item.icon] : null,
      iconClass: item.icon_class,
    }));
  }
};
const fetchFeaturedVideo = async () => {
  try {
    const response = await api.get('/videos/featured');
    featuredVideo.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy video đặc biệt:', error);
  }
};

onMounted(async () => {
  const beforeStatus = localStorage.getItem('Before');
  const finalStatus = localStorage.getItem('Final');
  await AOS.init();
  observeLocalStorageChange();
  loadHeroSlidesFromStorage();
  loadFutureProjectsFromStorage();
  loadFeaturesFromStorage();
  fetchFeaturedVideo();
  if(finalStatus !=='ok'){
    if (beforeStatus !== 'ok') {
      await loadingStore.fetchDataBeforeLogin(() => {
        console.log('Dữ liệu được cập nhật từ API và lưu vào localStorage!');
      });
    }
  }
  await updateVoteResults();
  if (authStore.isLoggedIn) {
    await voteStore.getUserVote();
  }
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
  color: #0c713d;
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
  color: #0c713d;
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
  color: #0c713d;
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
  color: #0c713d;
  text-align: center;
}

.video-section {
  padding: 40px 50px;
  background-color: #e8f1f2;
}

.video-container {
    display: flex;
    flex-direction: column; /* Đảm bảo sắp xếp theo chiều dọc */
    align-items: center; /* Căn giữa nội dung */
    text-align: center; /* Căn giữa chữ */
}

.video-title {
    margin-top: 20px; /* Tạo khoảng cách với video */
    font-size: 16px;
    font-weight: bold;
    color: #0c713d;
}


video {
  width: 50%; 
  height: auto;
  object-fit: cover; 
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
