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
            </div>

            <div
              class="card-image"
              v-if="currentNotification?.image_paths.length > 0"
            >
              <img
                :src="`http://127.0.0.1:8000/storage/${currentNotification.image_paths[0]}`"
                alt="Notification Image"
                loading="lazy"
              />
              <div class="image-overlay"></div>
            </div>

            <div class="card-body">
              <p
                class="card-content"
                v-html="currentNotificationFormattedContent"
              ></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Dots -->
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import apiLinks from '../services/api-links';

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

const currentNotificationFormattedContent = computed(() => {
  if (currentNotification.value && currentNotification.value.content) {
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

const loadAllNotificationDetails = async (allNotifications) => {
  try {
    for (const notification of allNotifications) {
      const id = notification.id;

      if (!notificationDetails.value[id]) {
        const response = await apiLinks.notifications.getDetail(id);
        notificationDetails.value[id] = response.data;
      }
    }
    localStorage.setItem(
      'notification_detail',
      JSON.stringify(notificationDetails.value)
    );

    if (notifications.value.length > 0) {
      currentNotification.value =
        notificationDetails.value[notifications.value[0].id];
    }
  } catch (error) {
    console.error(
      'Không thể tải nội dung chi tiết của tất cả thông báo:',
      error
    );
  }
};

const goToSlide = (index) => {
  currentIndex.value = index;
  const targetId = notifications.value[index].id;
  currentNotification.value = notificationDetails.value[targetId] || null;
};

const nextNotification = () => {
  currentIndex.value = (currentIndex.value + 1) % notifications.value.length;
  const nextId = notifications.value[currentIndex.value].id;
  currentNotification.value = notificationDetails.value[nextId] || null;
};

const prevNotification = () => {
  currentIndex.value =
    (currentIndex.value - 1 + notifications.value.length) %
    notifications.value.length;
  const prevId = notifications.value[currentIndex.value].id;
  currentNotification.value = notificationDetails.value[prevId] || null;
};

onMounted(() => {
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
  }

  .card-title {
    font-size: 1.8rem;
  }

  .card-image {
    height: 350px;
  }

  .card-body {
    padding: 35px;
  }

  .card-content {
    font-size: 1.1rem;
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

  .card-image {
    height: 300px;
  }

  .card-body {
    padding: 30px 25px;
  }

  .card-content {
    font-size: 1.05rem;
  }

  .arrow-controls {
    gap: 15px;
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

  .card-image {
    height: 250px;
  }

  .card-body {
    padding: 25px 20px;
  }

  .card-content {
    font-size: 1rem;
    line-height: 1.7;
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
