<template>
  <TheHeader/>
  <div class="container">
    <div v-for="notification in notifications" :key="notification.id" class="map-container">
      <h2 class="text-uppercase title-centered">{{ notificationDetails[notification.id]?.title }}</h2>
      <div v-if="notificationDetails[notification.id]?.content">
        <p v-for="(paragraph, index) in formattedContent(notificationDetails[notification.id].content)" 
           :key="index" 
           class="text-left indented-paragraph">
          {{ paragraph }}
        </p>
      </div>
      <img v-if="notificationDetails[notification.id]?.image_paths.length > 0"
           :src="`http://127.0.0.1:8000/storage/${notificationDetails[notification.id].image_paths[0]}`" 
           :alt="`Image for ${notificationDetails[notification.id]?.title}`" 
           class="map-image"
           loading="lazy" />
    </div>
  </div>
  <TheFooter/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiLinks from '../../services/api-links';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';

const notifications = ref([]);
const notificationDetails = ref(JSON.parse(localStorage.getItem('notification_detail')) || {});

const formattedContent = (content) => {
  return content.split(/\n+/).map(paragraph => paragraph.trim()).filter(paragraph => paragraph);
};

const fetchNotifications = async () => {
  try {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.value = storedNotifications.filter((notification) => notification.page === 'maps');

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
      localStorage.setItem('notifications', JSON.stringify(notifications.value));

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

    localStorage.setItem('notification_detail', JSON.stringify(notificationDetails.value));
  } catch (error) {
    console.error(`Không thể tải nội dung thông báo ${id}:`, error);
  }
};

onMounted(() => {
  fetchNotifications();
});
</script>

<style scoped>
.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 20px;
}

.map-container {
  margin-bottom: 40px;
  text-align: center;
}

.title-centered {
  text-align: center;
  font-size: 2rem;
  color: #0c713d;
  margin-bottom: 10px;
}

.text-left {
  text-align: left;
  font-size: 1.1rem;
  color: black;
}
p{
  margin-top: 0px;
  margin-bottom: 7px;
}

.indented-paragraph {
  text-indent: 2em;
}

.map-image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
