<template>
  <div v-if="authStore.isLoggedIn" class="notification-container">
    <div class="row align-items-center">
      <div class="col-12 col-md-1 d-flex justify-content-center">
        <button class="control-button h-90" @click="prevNotification">Trước</button>
      </div>
      <div class="col-12 col-md-10">
        <h2 class="notification-title">Theo Dòng Sự Kiện</h2>
        <div class="carousel">
          <div class="carousel-item" v-for="(notification, index) in notifications" :key="notification.id" :class="{ active: index === currentIndex }">
            <div class="notification-content" v-if="currentNotification">
              <h3>{{ currentNotification.title }}</h3>
              <div class="notification-image">
                <img v-if="currentNotification.image_paths.length > 0" :src="`http://127.0.0.1:8000/storage/${currentNotification.image_paths[0]}`" alt="Notification Image" />
              </div>
              <!-- Sử dụng v-html để hiển thị nội dung có thẻ HTML -->
              <p v-html="currentNotificationFormattedContent"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-1 d-flex justify-content-center">
        <button class="control-button h-90" @click="nextNotification">Tiếp theo</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/axiosInterceptor';

const authStore = useAuthStore();
const notifications = ref([]);
const currentIndex = ref(0);
const currentNotification = ref(null);

const notificationDetails = ref({});

// Tạo hàm computed để chuyển đổi xuống dòng sang thẻ <br>
const currentNotificationFormattedContent = computed(() => {
  if (currentNotification.value && currentNotification.value.content) {
    return currentNotification.value.content.replace(/\n/g, '<br>');
  }
  return '';
});

const fetchNotifications = async () => {
  try {
    const storedNotifications = sessionStorage.getItem('notifications');
    if (storedNotifications) {
      notifications.value = JSON.parse(storedNotifications);
    } else {
      const response = await api.get('/user-notifications');
      notifications.value = response.data;
      sessionStorage.setItem('notifications', JSON.stringify(notifications.value));
    }

    if (notifications.value.length > 0) {
      await loadNotificationDetail(notifications.value[currentIndex.value].id);
    }
  } catch (error) {
    console.error('Không thể tải thông báo:', error);
  }
};

const loadNotificationDetail = async (id) => {
  if (notificationDetails.value[id]) {
    currentNotification.value = notificationDetails.value[id];
  } else {
    try {
      const response = await api.get(`/user-notifications/${id}`);
      currentNotification.value = response.data;
      notificationDetails.value[id] = currentNotification.value;
    } catch (error) {
      console.error('Không thể tải nội dung thông báo:', error);
    }
  }
};

const nextNotification = async () => {
  currentIndex.value = (currentIndex.value + 1) % notifications.value.length;
  await loadNotificationDetail(notifications.value[currentIndex.value].id);
};

const prevNotification = async () => {
  currentIndex.value = (currentIndex.value - 1 + notifications.value.length) % notifications.value.length;
  await loadNotificationDetail(notifications.value[currentIndex.value].id);
};

onMounted(() => {
  if (authStore.isLoggedIn) {
    fetchNotifications();
  }
});
</script>

<style scoped>
.notification-container {
  width: 100%;
  margin: auto;
  background-color: rgba(220, 197, 223, 0.6);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 0;
  margin-bottom: 0;
  position: relative;
}

.notification-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}

.carousel-item {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  width: 100%;
}

.carousel-item.active {
  opacity: 1;
  position: relative;
}

.notification-content {
  padding: 20px;
  text-align: center;
}

.notification-image {
  height: 200px;
  overflow: hidden;
}

.notification-image img {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.notification-content h3 {
  color: #34495e;
  margin: -1rem 0 10px 0;
  font-size: 1.5rem;
}

.notification-content p {
  color: #555;
  margin: 10px 0;
  font-size: 1.2rem; 

}

.control-button {
  background-color: #ecf0f1;
  color: #34495e;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 90%;
  width: 100%;
}

.control-button:hover {
  background-color: #bdc3c7;
}

</style>
