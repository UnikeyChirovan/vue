<template>
  <transition name="fade-zoom">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="custom-modal">
        <div class="modal-header">
          <h2 class="title">Khám Phá Người Dùng</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <div v-if="loading" class="loading">Đang tải...</div>

        <div v-else class="explore-list">
          <div
            v-for="user in exploreStore.userList"
            :key="user.id"
            class="user-card"
          >
            <img :src="getAvatarUrl(user)" class="avatar" />
            <p class="user-name">{{ user.name }}</p>
            <div class="user-actions">
              <button class="view-btn" @click="goToProfile(user.id)">
                Chi tiết
              </button>
              <ChatButton
                :user-id="user.id"
                :user-name="user.name"
                :user-avatar="getAvatarUrl(user)"
                :allow-chat="user.allow_messages || false"
                :is-following="user.is_following || false"
              />
            </div>
          </div>
        </div>

        <div class="footer-actions">
          <p>Lượt đổi còn lại: {{ exploreStore.remainingAttempts }}</p>
          <button
            class="refresh-btn"
            :disabled="exploreStore.remainingAttempts === 0"
            @click="refreshList"
          >
            Đổi danh sách
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useExploreStore } from '../stores/exploreStore';
import { useRouter } from 'vue-router';
import ChatButton from './ChatButton.vue';

const exploreStore = useExploreStore();
const router = useRouter();
const showModal = ref(false);
const loading = ref(false);

const backendUrl = 'http://127.0.0.1:8000';

const getAvatarUrl = (user) => {
  if (!user.avatar) return 'https://picsum.photos/100';
  return `${backendUrl}/storage/avatars/${user.id}/${user.avatar}`;
};

const fetchAndSetUsers = async () => {
  if (exploreStore.remainingAttempts === 0) return;
  if (exploreStore.userList.length > 0) return;

  loading.value = true;
  try {
    await exploreStore.fetchRandomUsers();
  } finally {
    loading.value = false;
  }
};

const openModal = () => {
  showModal.value = true;
  fetchAndSetUsers();
};

const closeModal = () => {
  showModal.value = false;
};

const refreshList = () => {
  exploreStore.refreshUserList();
};

const goToProfile = (userId) => {
  router.push(`/profile/${userId}`);
  closeModal();
};

defineExpose({ openModal });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.custom-modal {
  position: relative;
  width: 50vw;
  max-width: 600px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -20px -20px 10px -20px;
  padding: 10px 20px;
  background-color: #0c713d;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  color: white;
}

.title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  flex: 1;
  color: white;
}

.close-btn {
  position: absolute;
  right: 15px;
  background: none;
  border: 2px solid white;
  border-radius: 5px;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.close-btn:hover {
  color: red;
}

.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
}

.explore-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  flex: 1;
  margin: 0;
  font-weight: bold;
}

.user-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.view-btn {
  background-color: #0c713d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.view-btn:hover {
  background-color: #095d32;
}

.footer-actions {
  margin-top: 20px;
  text-align: center;
}

.refresh-btn {
  background-color: #0c713d;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
