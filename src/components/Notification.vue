<template>
  <div v-if="notifications.length > 0" class="notification-container">
    <div class="notification-wrapper">
      <h2 class="notification-title text-uppercase">{{ title }}</h2>

      <div class="notification-carousel">
        <div
          class="carousel-track"
          v-for="(notification, index) in notifications"
          :key="notification.id"
        >
          <div
            class="notification-card"
            v-if="index === currentIndex"
            :class="{ active: index === currentIndex }"
          >
            <div class="card-header">
              <h3 class="card-title">{{ currentNotification?.title }}</h3>
              <span
                v-if="currentNotification?.type === 'voting'"
                class="voting-badge"
              >
                <i class="fa-solid fa-poll"></i> Bình Chọn
              </span>
            </div>

            <div
              class="card-image"
              v-if="currentNotification?.image_paths?.length > 0"
            >
              <img
                :src="`http://127.0.0.1:8000/storage/${currentNotification.image_paths[0]}`"
                alt="Notification Image"
                loading="lazy"
              />
              <div class="image-overlay"></div>
            </div>

            <!-- Normal Content -->
            <div
              class="card-body"
              v-if="currentNotification?.type === 'normal'"
            >
              <p
                class="card-content"
                v-html="currentNotificationFormattedContent"
              ></p>
            </div>

            <!-- Voting Content -->
            <div
              class="card-body voting-section"
              v-if="currentNotification?.type === 'voting'"
            >
              <div class="voting-question">
                <i class="fa-solid fa-circle-question"></i>
                <p>{{ currentNotification?.vote?.question }}</p>
              </div>

              <!-- Voting Options (if user hasn't voted) -->
              <div
                v-if="!currentVoteData?.user_vote && isAuthenticated"
                class="voting-options"
              >
                <button
                  v-for="option in currentNotification?.vote?.options"
                  :key="option.id"
                  @click="submitVote(option.id)"
                  :disabled="isVoting"
                  class="vote-option"
                >
                  <span class="option-text">{{ option.text }}</span>
                  <i class="fa-solid fa-check-circle"></i>
                </button>
              </div>

              <!-- Login prompt if not authenticated -->
              <div v-if="!isAuthenticated" class="login-prompt">
                <i class="fa-solid fa-lock"></i>
                <p>Vui lòng đăng nhập để bình chọn</p>
              </div>

              <!-- Voting Results -->
              <div
                v-if="isAuthenticated && currentVoteData?.user_vote"
                class="voting-results"
              >
                <div class="results-header">
                  <i class="fa-solid fa-chart-bar"></i>
                  <span>Kết Quả Bình Chọn</span>
                  <span class="total-votes"
                    >({{ currentVoteData?.total_votes || 0 }} lượt)</span
                  >
                </div>

                <div
                  v-for="result in currentVoteData?.results"
                  :key="result.id"
                  class="result-item"
                  :class="{
                    'user-voted': result.id === currentVoteData?.user_vote,
                  }"
                >
                  <div class="result-header">
                    <span class="result-text">{{ result.text }}</span>
                    <span class="result-percentage"
                      >{{ result.percentage }}%</span
                    >
                  </div>
                  <div class="result-bar-container">
                    <div
                      class="result-bar"
                      :style="{ width: result.percentage + '%' }"
                    ></div>
                  </div>
                  <div class="result-count">{{ result.count }} lượt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Controls -->
      <div class="navigation-controls">
        <div class="dots-indicator">
          <button
            v-for="(notification, index) in notifications"
            :key="index"
            class="dot"
            :class="{ active: index === currentIndex }"
            @click="goToSlide(index)"
            :aria-label="`Đi tới thông báo ${index + 1}`"
          ></button>
        </div>

        <div class="arrow-controls">
          <button
            class="arrow-btn prev"
            @click="prevNotification"
            aria-label="Thông báo trước"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span class="slide-counter"
            >{{ currentIndex + 1 }} / {{ notifications.length }}</span
          >
          <button
            class="arrow-btn next"
            @click="nextNotification"
            aria-label="Thông báo tiếp theo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useMessage } from 'naive-ui';
import apiLinks from '../services/api-links';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const message = useMessage();
const props = defineProps({
  title: {
    type: String,
    default: 'Theo Dòng Sự Kiện',
  },
});

const notifications = ref([]);
const currentIndex = ref(0);
const currentNotification = ref(null);
const notificationDetails = ref(
  JSON.parse(localStorage.getItem('notification_detail')) || {}
);
const voteData = ref({});
const currentVoteData = ref(null);
const isVoting = ref(false);
const isAuthenticated = ref(false);

// Check if user is authenticated
const checkAuth = () => {
  isAuthenticated.value = authStore.isLoggedIn;
};

const currentNotificationFormattedContent = computed(() => {
  if (
    currentNotification.value?.type === 'normal' &&
    currentNotification.value?.content
  ) {
    return currentNotification.value.content.replace(/\n/g, '<br>');
  }
  return '';
});

const fetchNotifications = async () => {
  try {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const allNotifications = JSON.parse(storedNotifications);
      notifications.value = allNotifications.filter(
        (notification) => notification.page === 'home'
      );

      if (notifications.value.length > 0) {
        await loadAllNotificationDetails(allNotifications);
      }
    } else {
      const response = await apiLinks.notifications.getAll();
      const allNotifications = response.data;
      notifications.value = allNotifications.filter(
        (notification) => notification.page === 'home'
      );
      localStorage.setItem('notifications', JSON.stringify(allNotifications));

      if (notifications.value.length > 0) {
        await loadAllNotificationDetails(allNotifications);
      }
    }
  } catch (error) {
    console.error('Không thể tải thông báo:', error);
  }
};
const reloadVoteData = async () => {
  for (const notification of notifications.value) {
    if (notification.type === 'voting') {
      await loadVoteResults(notification.id);
    }
  }

  // Cập nhật currentVoteData nếu đang xem notification voting
  if (currentNotification.value?.type === 'voting') {
    currentVoteData.value = voteData.value[currentNotification.value.id];
  }
};
const loadAllNotificationDetails = async (allNotifications) => {
  try {
    for (const notification of allNotifications) {
      const id = notification.id;

      if (!notificationDetails.value[id]) {
        const response = await apiLinks.notifications.getDetail(id);
        notificationDetails.value[id] = response.data;
      }

      // Load vote data if it's a voting notification
      if (notification.type === 'voting') {
        await loadVoteResults(id);
      }
    }
    localStorage.setItem(
      'notification_detail',
      JSON.stringify(notificationDetails.value)
    );

    if (notifications.value.length > 0) {
      currentNotification.value =
        notificationDetails.value[notifications.value[0].id];
      currentVoteData.value = voteData.value[notifications.value[0].id];
    }
  } catch (error) {
    console.error(
      'Không thể tải nội dung chi tiết của tất cả thông báo:',
      error
    );
  }
};

const loadVoteResults = async (notificationId) => {
  try {
    const response =
      await apiLinks.notifications.getVoteResults(notificationId);
    voteData.value[notificationId] = response.data;
  } catch (error) {
    console.error('Không thể tải kết quả vote:', error);
  }
};

const submitVote = async (optionId) => {
  if (!isAuthenticated.value) {
    message.warning('Vui lòng đăng nhập để bình chọn');
    return;
  }

  if (isVoting.value) return;
  isVoting.value = true;

  try {
    const notificationId = currentNotification.value.id;
    const response = await apiLinks.notifications.submitVote(notificationId, {
      option_id: optionId,
    });

    voteData.value[notificationId] = {
      results: response.data.results,
      user_vote: response.data.user_vote,
      total_votes: response.data.total_votes,
    };

    currentVoteData.value = voteData.value[notificationId];
    message.success('Bình chọn thành công!');
  } catch (error) {
    if (error.response?.status === 400) {
      message.error(error.response.data.message);
    } else {
      message.error('Không thể gửi bình chọn. Vui lòng thử lại.');
    }
  } finally {
    isVoting.value = false;
  }
};

const goToSlide = (index) => {
  currentIndex.value = index;
  const targetId = notifications.value[index].id;
  currentNotification.value = notificationDetails.value[targetId] || null;
  currentVoteData.value = voteData.value[targetId] || null;
};

const nextNotification = () => {
  currentIndex.value = (currentIndex.value + 1) % notifications.value.length;
  const nextId = notifications.value[currentIndex.value].id;
  currentNotification.value = notificationDetails.value[nextId] || null;
  currentVoteData.value = voteData.value[nextId] || null;
};

const prevNotification = () => {
  currentIndex.value =
    (currentIndex.value - 1 + notifications.value.length) %
    notifications.value.length;
  const prevId = notifications.value[currentIndex.value].id;
  currentNotification.value = notificationDetails.value[prevId] || null;
  currentVoteData.value = voteData.value[prevId] || null;
};
watch(
  () => authStore.isLoggedIn,
  (newValue, oldValue) => {
    isAuthenticated.value = newValue;

    // Nếu vừa đăng nhập (false -> true), reload vote data
    if (newValue && !oldValue) {
      reloadVoteData();
    }
  }
);
onMounted(() => {
  checkAuth();

  const checkDataInterval = setInterval(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      notifications.value = JSON.parse(storedNotifications).filter(
        (notification) => notification.page === 'home'
      );
      if (notifications.value.length > 0) {
        clearInterval(checkDataInterval);
        fetchNotifications();
      }
    }
  }, 500);

  onUnmounted(() => {
    clearInterval(checkDataInterval);
  });
});
</script>

<style scoped>
/* ========== MODERN NOTIFICATION REDESIGN ========== */
.notification-container {
  width: 100%;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px;
  position: relative;
}

.dark-mode .notification-container {
  background: linear-gradient(
    180deg,
    var(--dark-bg-primary) 0%,
    var(--dark-bg-secondary) 100%
  );
}

.notification-container::before {
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

.dark-mode .notification-container::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--dark-border) 50%,
    transparent 100%
  );
}

.notification-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.notification-title {
  text-align: center;
  color: #0c713d;
  margin-bottom: 50px;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 20px;
}

.dark-mode .notification-title {
  color: var(--dark-accent-green-light);
}

.notification-title::after {
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

.dark-mode .notification-title::after {
  background: linear-gradient(
    90deg,
    transparent,
    var(--dark-accent-green),
    transparent
  );
}

/* Carousel */
.notification-carousel {
  position: relative;
  margin-bottom: 40px;
}

.carousel-track {
  width: 100%;
}

.notification-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode .notification-card {
  background: var(--dark-bg-card);
  border-color: var(--dark-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.notification-card.active {
  opacity: 1;
  transform: scale(1);
}

.card-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 30px 40px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.dark-mode .card-header {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
}

.card-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-30px, -30px);
  }
}

.card-title {
  color: white;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.voting-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  z-index: 1;
  position: relative;
}

.card-image {
  position: relative;
  height: 400px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.dark-mode .card-image {
  background: linear-gradient(
    135deg,
    var(--dark-bg-elevated) 0%,
    var(--dark-bg-secondary) 100%
  );
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.notification-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(255, 255, 255, 1), transparent);
  pointer-events: none;
}

.dark-mode .image-overlay {
  background: linear-gradient(to top, var(--dark-bg-card), transparent);
}

.card-body {
  padding: 40px;
}

.card-content {
  color: #444;
  font-size: 1.15rem;
  line-height: 1.8;
  margin: 0;
  text-align: center;
}

.dark-mode .card-content {
  color: var(--dark-text-secondary);
}

/* ========== VOTING SECTION STYLES ========== */
.voting-section {
  padding: 50px 40px;
}

.voting-question {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 35px;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border-left: 5px solid #0c713d;
}

.dark-mode .voting-question {
  background: linear-gradient(
    135deg,
    var(--dark-bg-elevated) 0%,
    var(--dark-bg-secondary) 100%
  );
  border-left-color: var(--dark-accent-green);
}

.voting-question i {
  font-size: 2rem;
  color: #0c713d;
  flex-shrink: 0;
  margin-top: 5px;
}

.dark-mode .voting-question i {
  color: var(--dark-accent-green-light);
}

.voting-question p {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  line-height: 1.6;
}

.dark-mode .voting-question p {
  color: var(--dark-text-primary);
}

/* Voting Options */
.voting-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.vote-option {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  padding: 20px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  position: relative;
  overflow: hidden;
}

.dark-mode .vote-option {
  background: var(--dark-bg-elevated);
  border-color: var(--dark-border);
  color: var(--dark-text-primary);
}

.vote-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(12, 113, 61, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.vote-option:hover::before {
  left: 100%;
}

.vote-option:hover {
  border-color: #0c713d;
  transform: translateX(5px);
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.2);
}

.dark-mode .vote-option:hover {
  border-color: var(--dark-accent-green);
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.4);
}

.vote-option:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vote-option i {
  color: #0c713d;
  font-size: 1.5rem;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.dark-mode .vote-option i {
  color: var(--dark-accent-green-light);
}

.vote-option:hover i {
  opacity: 1;
  transform: scale(1);
}

.option-text {
  flex: 1;
  text-align: left;
}

/* Login Prompt */
.login-prompt {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 16px;
  border: 2px dashed #ffc107;
}

.dark-mode .login-prompt {
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.2) 0%,
    rgba(255, 234, 167, 0.2) 100%
  );
  border-color: rgba(255, 193, 7, 0.5);
}

.login-prompt i {
  font-size: 3rem;
  color: #ff9800;
  margin-bottom: 15px;
}

.login-prompt p {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #856404;
}

.dark-mode .login-prompt p {
  color: var(--dark-text-primary);
}

/* Voting Results */
.voting-results {
  margin-top: 30px;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0c713d;
}

.dark-mode .results-header {
  color: var(--dark-accent-green-light);
}

.results-header i {
  font-size: 1.5rem;
}

.total-votes {
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  margin-left: auto;
}

.dark-mode .total-votes {
  color: var(--dark-text-secondary);
}

.result-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.dark-mode .result-item {
  background: var(--dark-bg-elevated);
}

.result-item.user-voted {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 2px solid #0c713d;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.2);
}

.dark-mode .result-item.user-voted {
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.2) 0%,
    rgba(12, 113, 61, 0.1) 100%
  );
  border-color: var(--dark-accent-green);
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.4);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.dark-mode .result-text {
  color: var(--dark-text-primary);
}

.result-percentage {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0c713d;
}

.dark-mode .result-percentage {
  color: var(--dark-accent-green-light);
}

.result-bar-container {
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.dark-mode .result-bar-container {
  background: var(--dark-bg-secondary);
}

.result-bar {
  height: 100%;
  background: linear-gradient(90deg, #0c713d 0%, #0a5a31 100%);
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.dark-mode .result-bar {
  background: linear-gradient(
    90deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
}

.result-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer-bar 2s infinite;
}

@keyframes shimmer-bar {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.result-count {
  font-size: 0.9rem;
  color: #666;
  text-align: right;
}

.dark-mode .result-count {
  color: var(--dark-text-secondary);
}

/* Navigation Controls */
.navigation-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.dots-indicator {
  display: flex;
  gap: 12px;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(12, 113, 61, 0.2);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dark-mode .dot {
  background: rgba(12, 113, 61, 0.4);
}

.dot:hover {
  background: rgba(12, 113, 61, 0.4);
  transform: scale(1.2);
}

.dark-mode .dot:hover {
  background: rgba(12, 113, 61, 0.6);
}

.dot.active {
  width: 40px;
  border-radius: 6px;
  background: linear-gradient(90deg, #0c713d, #0a5a31);
}

.dark-mode .dot.active {
  background: linear-gradient(
    90deg,
    var(--dark-accent-green),
    var(--dark-accent-green-light)
  );
}

.arrow-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.arrow-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.3);
}

.dark-mode .arrow-btn {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.5);
}

.arrow-btn:hover {
  background: linear-gradient(135deg, #0a5a31 0%, #084524 100%);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

.dark-mode .arrow-btn:hover {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green-light) 0%,
    var(--dark-accent-hover) 100%
  );
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.6);
}

.arrow-btn:active {
  transform: scale(0.95);
}

.arrow-btn svg {
  transition: transform 0.3s ease;
}

.arrow-btn.prev:hover svg {
  transform: translateX(-2px);
}

.arrow-btn.next:hover svg {
  transform: translateX(2px);
}

.slide-counter {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0c713d;
  min-width: 60px;
  text-align: center;
}

.dark-mode .slide-counter {
  color: var(--dark-accent-green-light);
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1024px) {
  .notification-container {
    padding: 70px 20px;
  }

  .notification-title {
    font-size: 2.2rem;
    margin-bottom: 45px;
  }

  .card-header {
    padding: 25px 35px;
    flex-direction: column;
    align-items: center;
  }

  .card-title {
    font-size: 1.8rem;
  }

  .voting-badge {
    font-size: 0.85rem;
    padding: 6px 12px;
  }

  .card-image {
    height: 350px;
  }

  .voting-section {
    padding: 40px 35px;
  }

  .voting-question {
    padding: 20px;
  }

  .voting-question p {
    font-size: 1.2rem;
  }

  .vote-option {
    padding: 18px 22px;
    font-size: 1.05rem;
  }
}

@media (max-width: 768px) {
  .notification-container {
    padding: 60px 15px;
  }

  .notification-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }

  .card-header {
    padding: 25px 30px;
  }

  .card-title {
    font-size: 1.6rem;
  }

  .voting-badge {
    font-size: 0.8rem;
    padding: 5px 10px;
  }

  .card-image {
    height: 300px;
  }

  .voting-section {
    padding: 35px 25px;
  }

  .voting-question {
    flex-direction: column;
    padding: 18px;
  }

  .voting-question i {
    font-size: 1.8rem;
  }

  .voting-question p {
    font-size: 1.15rem;
  }

  .vote-option {
    padding: 16px 20px;
    font-size: 1rem;
  }

  .results-header {
    font-size: 1.2rem;
    flex-wrap: wrap;
  }

  .result-item {
    padding: 18px;
  }

  .result-text {
    font-size: 1.05rem;
  }

  .result-percentage {
    font-size: 1.2rem;
  }

  .arrow-btn {
    width: 44px;
    height: 44px;
  }

  .slide-counter {
    font-size: 1rem;
    min-width: 50px;
  }
}

@media (max-width: 480px) {
  .notification-container {
    padding: 50px 10px;
  }

  .notification-title {
    font-size: 1.6rem;
    margin-bottom: 35px;
  }

  .notification-title::after {
    width: 80px;
    height: 3px;
  }

  .notification-card {
    border-radius: 20px;
  }

  .card-header {
    padding: 20px 25px;
  }

  .card-title {
    font-size: 1.4rem;
  }

  .voting-badge {
    font-size: 0.75rem;
    padding: 4px 8px;
  }

  .card-image {
    height: 250px;
  }

  .voting-section {
    padding: 25px 20px;
  }

  .voting-question {
    padding: 15px;
    gap: 12px;
  }

  .voting-question i {
    font-size: 1.6rem;
  }

  .voting-question p {
    font-size: 1.05rem;
  }

  .vote-option {
    padding: 14px 18px;
    font-size: 0.95rem;
  }

  .vote-option i {
    font-size: 1.3rem;
  }

  .login-prompt {
    padding: 30px 20px;
  }

  .login-prompt i {
    font-size: 2.5rem;
  }

  .login-prompt p {
    font-size: 1.1rem;
  }

  .results-header {
    font-size: 1.1rem;
  }

  .results-header i {
    font-size: 1.3rem;
  }

  .total-votes {
    font-size: 0.9rem;
    width: 100%;
    text-align: left;
    margin-top: 5px;
  }

  .result-item {
    padding: 15px;
  }

  .result-text {
    font-size: 1rem;
  }

  .result-percentage {
    font-size: 1.1rem;
  }

  .result-bar-container {
    height: 10px;
  }

  .result-count {
    font-size: 0.85rem;
  }

  .dots-indicator {
    gap: 10px;
  }

  .dot {
    width: 10px;
    height: 10px;
  }

  .dot.active {
    width: 32px;
  }

  .arrow-controls {
    gap: 12px;
  }

  .arrow-btn {
    width: 40px;
    height: 40px;
  }

  .arrow-btn svg {
    width: 18px;
    height: 18px;
  }

  .slide-counter {
    font-size: 0.95rem;
    min-width: 45px;
  }
}
</style>
