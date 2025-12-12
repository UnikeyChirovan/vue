<template>
  <TheHeader />
  <LoadingModal v-if="loadingStore.isDataLoading" />

  <!-- Hero Section -->
  <section
    class="hero-section"
    :style="{ backgroundImage: `url(${currentBackground})` }"
    data-aos="fade-in"
  >
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h2 class="hero-round">{{ currentRound }}</h2>
      <h1 class="hero-title">{{ currentTitle }}</h1>
      <p class="hero-description">{{ currentDescription }}</p>
      <button class="cta-button" @click="handleButtonClick">
        {{ currentButtonText }}
      </button>
    </div>
    <button class="prev-btn" @click="prevSlide" aria-label="Previous slide">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="next-btn" @click="nextSlide" aria-label="Next slide">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
    <div class="slide-indicators">
      <span
        v-for="(slide, index) in heroSlides"
        :key="index"
        :class="{ active: index === currentSlideIndex }"
        @click="currentSlideIndex = index"
      ></span>
    </div>
  </section>

  <!-- Notification Section -->
  <Notification :title="notificationTitle" />

  <!-- Future Projects Section -->
  <section
    class="future-projects-section"
    ref="futureSection"
    data-aos="fade-up"
  >
    <h2 class="future-projects-title text-uppercase">
      {{ futureProjectTitle }}
    </h2>
    <div class="future-projects-carousel">
      <div
        class="future-project-item"
        v-for="(project, index) in futureProjects"
        :key="project.name"
        :data-aos="'fade-up'"
        :data-aos-delay="index * 100"
      >
        <div class="project-icon">
          <span>{{ index + 1 }}</span>
        </div>
        <h3 class="future-project-name">{{ project.name }}</h3>
        <span class="future-project-timeline">
          <span class="timeline-icon">📅</span>
          Dự kiến: {{ project.timeline }}
        </span>
        <p class="future-project-description">{{ project.description }}</p>
      </div>
    </div>
  </section>

  <!-- Video Section -->
  <section class="video-section" data-aos="fade-up">
    <h2 class="section-title text-uppercase">{{ firstMeetTitle }}</h2>
    <div class="video-container" v-if="featuredVideo">
      <div class="video-wrapper">
        <video controls preload="metadata">
          <source
            :src="getVideoUrl(featuredVideo.video_path)"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <p class="video-title">{{ featuredVideo.video_name }}</p>
    </div>
    <p v-else class="no-video-message">Chưa có thông tin video nào.</p>
  </section>

  <!-- Feature/Vote Section -->
  <section class="feature-section" data-aos="fade-up">
    <h2 class="feature-section-title text-uppercase">
      {{ todayFeatureTitle }}
    </h2>
    <div class="feature-grid">
      <div
        class="feature-item"
        v-for="(feature, index) in features"
        :key="feature.title"
        @click="vote(index + 1)"
        @mouseover="hoveredFeature = feature.title"
        @mouseleave="hoveredFeature = null"
        :class="{
          hovered: hoveredFeature === feature.title,
          voted: voteStore.userVoteChoice === index + 1,
        }"
        :data-aos="'zoom-in'"
        :data-aos-delay="index * 100"
      >
        <div class="feature-icon-wrapper">
          <n-icon size="64" :class="feature.iconClass">
            <component :is="feature.icon" />
          </n-icon>
        </div>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-description">{{ feature.description }}</p>
        <p v-if="voteResults.totalVotes > 0" class="feature-percentage">
          {{
            (
              Math.round(
                ((voteResults.votesByChoice[index + 1] || 0) /
                  voteResults.totalVotes) *
                  100 *
                  100
              ) / 100
            )
              .toFixed(2)
              .replace(/\.00$/, '')
          }}%
        </p>
      </div>
    </div>
  </section>

  <TheFooter />
</template>

<script setup>
import { ref, markRaw, computed, onMounted } from 'vue';
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
import { Rocket } from '@vicons/ionicons5';
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

const futureProjectTitle = computed(() =>
  categoryStore.getCategoryTitle('2', 'home', 'Dự Án Tương Lai')
);
const firstMeetTitle = computed(() =>
  categoryStore.getCategoryTitle(
    '3',
    'home',
    'Thất Sắc Chi Đạo – Khi Số Phận Gọi Tên'
  )
);
const todayFeatureTitle = computed(() =>
  categoryStore.getCategoryTitle('4', 'home', 'Ý Kiến Của Bạn Quan Trọng!')
);
const notificationTitle = computed(() =>
  categoryStore.getCategoryTitle('1', 'home', 'Theo Dòng Sự Kiện')
);

const voteResults = ref({
  totalVotes: 0,
  votesByChoice: {},
});

const heroSlides = ref([]);
const isHeroSlidesReady = ref(false);
const futureProjects = ref([]);
const featuredVideo = ref(null);

const currentSlideIndex = ref(0);
const nextSlide = () => {
  currentSlideIndex.value =
    (currentSlideIndex.value + 1) % heroSlides.value.length;
};

const prevSlide = () => {
  currentSlideIndex.value =
    (currentSlideIndex.value - 1 + heroSlides.value.length) %
    heroSlides.value.length;
};

const currentBackground = computed(() =>
  isHeroSlidesReady.value
    ? heroSlides.value[currentSlideIndex.value].image_url
    : ''
);
const currentRound = computed(() =>
  isHeroSlidesReady.value ? heroSlides.value[currentSlideIndex.value].round : ''
);
const currentTitle = computed(() =>
  isHeroSlidesReady.value ? heroSlides.value[currentSlideIndex.value].title : ''
);
const currentDescription = computed(() =>
  isHeroSlidesReady.value
    ? heroSlides.value[currentSlideIndex.value].description
    : ''
);
const currentButtonText = computed(() =>
  isHeroSlidesReady.value
    ? heroSlides.value[currentSlideIndex.value].button_text
    : ''
);

const features = ref([]);
const iconMap = {
  StarEmphasis24Filled: markRaw(StarEmphasis24Filled),
  Rocket: markRaw(Rocket),
  Handshake20Filled: markRaw(Handshake20Filled),
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
    message.error(
      error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!'
    );
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
      }, {}),
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

  localStorage.setItem = function (key, value) {
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
        features.value = JSON.parse(value).map((item) => ({
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
    features.value = JSON.parse(featuresData).map((item) => ({
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
  await AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic',
  });
  observeLocalStorageChange();
  loadHeroSlidesFromStorage();
  loadFutureProjectsFromStorage();
  loadFeaturesFromStorage();
  fetchFeaturedVideo();
  if (finalStatus !== 'ok') {
    if (beforeStatus !== 'ok') {
      await loadingStore.fetchDataBeforeLogin(() => {});
    }
  }
  await updateVoteResults();
  if (authStore.isLoggedIn) {
    await voteStore.getUserVote();
  }
});
</script>

<style scoped>
/* ========== MODERN HOME PAGE DESIGN 2025 ========== */

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    'Inter',
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
  line-height: 1.6;
}

/* ========== CUSTOM CTA BUTTON ========== */
.cta-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  padding: 16px 48px;
  font-size: 1.1rem;
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

.cta-button::before {
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

.cta-button:hover::before {
  width: 300px;
  height: 300px;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
  background: linear-gradient(135deg, #0a5a31 0%, #084524 100%);
}

.cta-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(12, 113, 61, 0.3);
}

/* ========== HERO SECTION ========== */
.hero-section {
  position: relative;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  transition: background-image 1s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.85) 0%,
    rgba(12, 113, 61, 0.75) 50%,
    rgba(20, 90, 50, 0.8) 100%
  );
  backdrop-filter: blur(2px);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  padding: 0 20px;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-round {
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  letter-spacing: 3px;
  background: rgba(255, 255, 255, 0.1);
  display: inline-block;
  padding: 8px 24px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 4rem;
  margin: 20px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 800;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.hero-description {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 25px auto 40px;
  line-height: 1.8;
  font-weight: 400;
  max-width: 600px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.prev-btn,
.next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  color: white;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.prev-btn::before,
.next-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.05)
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 50%;
}

.prev-btn:hover::before,
.next-btn:hover::before {
  opacity: 1;
}

.prev-btn {
  left: 40px;
}

.next-btn {
  right: 40px;
}

.prev-btn:hover,
.next-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.prev-btn:active,
.next-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.prev-btn svg,
.next-btn svg {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.prev-btn:hover svg {
  transform: translateX(-3px);
}

.next-btn:hover svg {
  transform: translateX(3px);
}

/* Responsive */
@media (max-width: 768px) {
  .prev-btn,
  .next-btn {
    width: 50px;
    height: 50px;
  }

  .prev-btn {
    left: 20px;
  }

  .next-btn {
    right: 20px;
  }

  .prev-btn svg,
  .next-btn svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .prev-btn,
  .next-btn {
    width: 45px;
    height: 45px;
  }

  .prev-btn {
    left: 15px;
  }

  .next-btn {
    right: 15px;
  }

  .prev-btn svg,
  .next-btn svg {
    width: 18px;
    height: 18px;
  }
}

.slide-indicators {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;
}

.slide-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.slide-indicators span:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.slide-indicators span.active {
  background: white;
  width: 32px;
  border-radius: 6px;
  border-color: rgba(255, 255, 255, 0.3);
}

/* ========== FUTURE PROJECTS SECTION ========== */
.future-projects-section {
  padding: 100px 50px;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  position: relative;
}

.future-projects-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(12, 113, 61, 0.2) 50%,
    transparent 100%
  );
}

.future-projects-title {
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #0c713d;
  font-weight: 800;
  text-align: center;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 20px;
}

.future-projects-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #0c713d, transparent);
  border-radius: 2px;
}

.future-projects-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 35px;
  max-width: 1200px;
  margin: 0 auto;
}

.future-project-item {
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(12, 113, 61, 0.1);
  position: relative;
  overflow: hidden;
}

.future-project-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0c713d, #0a5a31);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.future-project-item:hover::before {
  transform: scaleX(1);
}

.future-project-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 40px rgba(12, 113, 61, 0.15);
  border-color: #0c713d;
}

.project-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0c713d, #0a5a31);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  box-shadow: 0 4px 15px rgba(12, 113, 61, 0.3);
}

.project-icon span {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.future-project-name {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #1a1a1a;
  font-weight: 700;
  text-align: center;
}

.future-project-timeline {
  font-size: 1rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 8px 16px;
  background: #f8f8f8;
  border-radius: 20px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.timeline-icon {
  font-size: 1.1rem;
}

.future-project-description {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #555;
  text-align: center;
}

/* ========== VIDEO SECTION ========== */
.video-section {
  padding: 100px 50px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #0c713d;
  text-align: center;
  font-weight: 800;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 20px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #0c713d, transparent);
  border-radius: 2px;
}

.video-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.video-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  background: #000;
}

video {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
}

.video-title {
  margin-top: 30px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0c713d;
  text-align: center;
  line-height: 1.6;
}

.no-video-message {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  padding: 60px 20px;
}

/* ========== FEATURE/VOTE SECTION ========== */
.feature-section {
  padding: 100px 50px;
  background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
}

.feature-section-title {
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #0c713d;
  font-weight: 800;
  text-align: center;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 20px;
}

.feature-section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #0c713d, transparent);
  border-radius: 2px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 35px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-item {
  position: relative;
  background: white;
  cursor: pointer;
  padding: 45px 35px 70px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  overflow: hidden;
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0c713d, #0a5a31);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.feature-item:hover::before {
  transform: scaleX(1);
}

/* Phần CSS bị dang dở - tiếp tục từ .feature-item:hover */

.feature-item:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
  border-color: rgba(12, 113, 61, 0.3);
}

.feature-item.voted {
  background: linear-gradient(135deg, #f0f8f4 0%, #e8f5ed 100%);
  border-color: #0c713d;
  box-shadow: 0 8px 32px rgba(12, 113, 61, 0.2);
}

.feature-item.voted::before {
  transform: scaleX(1);
}

.feature-icon-wrapper {
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
}

.green-star {
  color: #0c713d;
}

.black-rocket {
  color: #2c3e50;
}

.Handshake {
  color: #3498db;
}

.feature-title {
  font-size: 1.5rem;
  margin: 20px 0 15px 0;
  color: #1a1a1a;
  font-weight: 700;
  text-align: center;
}

.feature-description {
  font-size: 1.05rem;
  margin-bottom: 40px;
  color: #555;
  line-height: 1.8;
  text-align: center;
}

.feature-percentage {
  position: absolute;
  font-size: 1.3rem;
  font-weight: 800;
  color: #0c713d;
  text-align: center;
  background: linear-gradient(135deg, #e8f5ed 0%, #d4edda 100%);
  border-radius: 25px;
  padding: 12px 28px;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.2);
  margin: 0;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid rgba(12, 113, 61, 0.2);
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 992px) {
  .hero-title {
    font-size: 3rem;
  }

  .future-projects-title,
  .section-title,
  .feature-section-title {
    font-size: 2rem;
  }

  .feature-grid,
  .future-projects-carousel {
    grid-template-columns: 1fr;
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 100vh;
  }

  .hero-title {
    font-size: 2.2rem;
    letter-spacing: 1px;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .hero-round {
    font-size: 0.9rem;
    letter-spacing: 2px;
  }

  .cta-button {
    padding: 14px 40px;
    font-size: 1rem;
  }

  .prev-btn,
  .next-btn {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }

  .prev-btn {
    left: 15px;
  }

  .next-btn {
    right: 15px;
  }

  .slide-indicators {
    bottom: 20px;
  }

  .future-projects-section,
  .video-section,
  .feature-section {
    padding: 60px 20px;
  }

  .future-projects-title,
  .section-title,
  .feature-section-title {
    font-size: 1.8rem;
    margin-bottom: 40px;
  }

  .future-project-item {
    padding: 30px 20px;
  }

  .video-container {
    padding: 25px;
  }

  .video-title {
    font-size: 1.1rem;
  }

  .feature-item {
    padding: 35px 25px 65px;
  }

  .feature-title {
    font-size: 1.3rem;
  }

  .feature-description {
    font-size: 1rem;
  }

  .feature-percentage {
    font-size: 1.1rem;
    padding: 10px 22px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .cta-button {
    padding: 12px 32px;
    font-size: 0.95rem;
  }

  .future-projects-title,
  .section-title,
  .feature-section-title {
    font-size: 1.5rem;
  }

  .prev-btn,
  .next-btn {
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
  }
}
</style>
