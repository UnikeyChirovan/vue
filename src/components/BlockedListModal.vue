<template>
  <transition name="fade-zoom">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="custom-modal">
        <div class="modal-header">
          <h2 class="title">Danh Sách Chặn</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <div v-if="loading" class="loading">Đang tải...</div>

        <div v-else class="block-list">
          <div v-for="user in blockList" :key="user.id" class="user-card">
            <img :src="getAvatarUrl(user)" class="avatar" />
            <p class="user-name">{{ user.name }}</p>
            <button class="unblock-btn" @click="unblockUser(user.id)">Bỏ chặn</button>
          </div>
        </div>

        <div class="refresh-container">
          <button class="refresh-btn" @click="refreshBlockList">Làm mới</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import api from '../services/axiosInterceptor';

const showModal = ref(false);
const loading = ref(false);
const blockList = ref([]);
const message = useMessage();
const backendUrl = 'http://127.0.0.1:8000';
const storageKey = 'user_blocked';

const getAvatarUrl = (user) => {
  return user.avatar ? `${backendUrl}/storage/avatars/${user.id}/${user.avatar}` : 'https://via.placeholder.com/100';
};

const fetchBlockList = async () => {
  loading.value = true;

  const storedData = sessionStorage.getItem(storageKey);
  if (storedData) {
    blockList.value = JSON.parse(storedData);
    loading.value = false;
    return;
  }

  try {
    const response = await api.get('/social/blocked-users');
    if (response.data && Array.isArray(response.data.users)) {
      blockList.value = response.data.users;
      sessionStorage.setItem(storageKey, JSON.stringify(response.data.users));
    } else {
      blockList.value = [];
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách chặn:', error);
  } finally {
    loading.value = false;
  }
};

const refreshBlockList = async () => {
  sessionStorage.removeItem(storageKey);
  await fetchBlockList();
};

const openModal = () => {
  showModal.value = true;
  fetchBlockList();
};

const closeModal = () => {
  showModal.value = false;
};

const unblockUser = async (userId) => {
  try {
    await api.delete(`/social/unblock/${userId}`);
    message.success('Đã bỏ chặn người dùng!');
    refreshBlockList();
  } catch (error) {
    message.error('Lỗi khi bỏ chặn.');
  }
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
  background-color: #d9534f;
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

.block-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
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
  border-radius: 25%;
  object-fit: cover;
}

.user-name {
  flex: 1;
  margin: 0;
  font-weight: bold;
}

.unblock-btn {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.unblock-btn:hover {
  background-color: #c9302c;
}

.refresh-container {
  display: flex;
  justify-content: center;
}

.refresh-btn {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.refresh-btn:hover {
  background-color: #c9302c;
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
