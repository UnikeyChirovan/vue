<template>
  <TheHeader />
  <div class="maps-wrapper">
    <div class="maps-container">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="map-section"
        data-aos="fade-up"
      >
        <h2 class="map-title">
          {{ notificationDetails[notification.id]?.title }}
        </h2>
        <div
          v-if="notificationDetails[notification.id]?.content"
          class="map-content"
        >
          <p
            v-for="(paragraph, index) in formattedContent(
              notificationDetails[notification.id].content
            )"
            :key="index"
            class="content-paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
        <div
          v-if="notificationDetails[notification.id]?.image_paths.length > 0"
          class="map-image-container"
        >
          <img
            :src="`http://127.0.0.1:8000/storage/${notificationDetails[notification.id].image_paths[0]}`"
            :alt="`Image for ${notificationDetails[notification.id]?.title}`"
            class="map-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiLinks from '../../services/api-links';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

const notifications = ref([]);
const notificationDetails = ref(
  JSON.parse(localStorage.getItem('notification_detail')) || {}
);

const formattedContent = (content) => {
  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph);
};

const fetchNotifications = async () => {
  try {
    const storedNotifications =
      JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.value = storedNotifications.filter(
      (notification) => notification.page === 'maps'
    );

    if (notifications.value.length > 0) {
      await Promise.all(
        notifications.value.map(async (notification) => {
          await loadNotificationDetail(notification.id);
        })
      );
    } else {
      const response = await apiLinks.notifications.getAll();
      notifications.value = response.data.notifications.filter(
        (notification) => notification.page === 'maps'
      );
      localStorage.setItem(
        'notifications',
        JSON.stringify(notifications.value)
      );

      await Promise.all(
        notifications.value.map(async (notification) => {
          await loadNotificationDetail(notification.id);
        })
      );
    }
  } catch (error) {
    console.error('Không thể tải thông báo:', error);
  }
};

const loadNotificationDetail = async (id) => {
  if (notificationDetails.value[id]) {
    return;
  }

  try {
    const response = await apiLinks.notifications.getDetail(id);
    const detail = response.data.notification_detail;
    notificationDetails.value[id] = detail;

    localStorage.setItem(
      'notification_detail',
      JSON.stringify(notificationDetails.value)
    );
  } catch (error) {
    console.error(`Không thể tải nội dung thông báo ${id}:`, error);
  }
};

onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic',
  });
  fetchNotifications();
});
</script>

<style scoped>
/* ========== MODERN MAPS PAGE DESIGN ========== */
.maps-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

.maps-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

/* ========== MAP SECTION ========== */
.map-section {
  background: white;
  padding: 50px 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.map-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0c713d, #0a5a31);
}

.map-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(12, 113, 61, 0.15);
}

.map-title {
  text-align: center;
  font-size: 2.2rem;
  color: #0c713d;
  margin-bottom: 35px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 20px;
}

.map-title::after {
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

.map-content {
  margin-bottom: 40px;
}

.content-paragraph {
  font-size: 1.15rem;
  line-height: 1.9;
  color: #333;
  margin-bottom: 18px;
  text-indent: 2em;
  text-align: justify;
  transition: color 0.3s ease;
}

.content-paragraph:hover {
  color: #0c713d;
}

.map-image-container {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
}

.map-image-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
  z-index: 1;
}

.map-image {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.map-image-container:hover .map-image {
  transform: scale(1.05);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .maps-wrapper {
    padding: 70px 20px 50px;
  }

  .maps-container {
    gap: 50px;
  }

  .map-section {
    padding: 40px 35px;
  }

  .map-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  .content-paragraph {
    font-size: 1.1rem;
    line-height: 1.8;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .maps-wrapper {
    padding: 60px 15px 40px;
  }

  .maps-container {
    gap: 40px;
  }

  .map-section {
    padding: 35px 25px;
  }

  .map-title {
    font-size: 1.7rem;
    margin-bottom: 25px;
  }

  .content-paragraph {
    font-size: 1.05rem;
    line-height: 1.7;
    text-indent: 1.5em;
  }

  .map-content {
    margin-bottom: 30px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .maps-wrapper {
    padding: 50px 10px 30px;
  }

  .maps-container {
    gap: 35px;
  }

  .map-section {
    padding: 30px 20px;
    border-radius: 16px;
  }

  .map-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .map-title::after {
    width: 60px;
    height: 3px;
  }

  .content-paragraph {
    font-size: 1rem;
    line-height: 1.6;
    text-indent: 1.2em;
    margin-bottom: 15px;
  }

  .map-content {
    margin-bottom: 25px;
  }

  .map-image-container {
    border-radius: 12px;
  }
}
</style>
