<template>
  <transition name="fade-zoom">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="custom-modal">
        <div class="modal-header">
          <div class="header-content">
            <i class="fa-solid fa-ban"></i>
            <h2 class="title">Danh Sách Chặn</h2>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Đóng">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="loading" class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Đang tải...</p>
          </div>

          <div v-else-if="blockList.length === 0" class="empty-state">
            <i class="fa-solid fa-user-check"></i>
            <p>Không có người dùng bị chặn</p>
            <span class="empty-hint">Danh sách chặn của bạn đang trống</span>
          </div>

          <div v-else class="block-list">
            <div v-for="user in blockList" :key="user.id" class="user-card">
              <div class="user-info">
                <img
                  :src="getAvatarUrl(user)"
                  class="avatar"
                  :alt="user.name"
                />
                <div class="user-details">
                  <p class="user-name">{{ user.name }}</p>
                  <span class="blocked-badge">
                    <i class="fa-solid fa-ban"></i> Đã chặn
                  </span>
                </div>
              </div>
              <button class="unblock-btn" @click="unblockUser(user.id)">
                <i class="fa-solid fa-unlock"></i>
                <span class="btn-text">Bỏ chặn</span>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="footer-info">
            <i class="fa-solid fa-shield-halved"></i>
            <span
              >Tổng: <strong>{{ blockList.length }}</strong> người</span
            >
          </div>
          <button class="refresh-btn" @click="refreshBlockList">
            <i class="fa-solid fa-rotate"></i>
            <span>Làm mới</span>
          </button>
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
  return user.avatar
    ? `${backendUrl}/storage/avatars/${user.id}/${user.avatar}`
    : 'https://picsum.photos/100';
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
/* ========== MODAL OVERLAY ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* ========== CUSTOM MODAL ========== */
.custom-modal {
  position: relative;
  width: 100%;
  max-width: 650px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

/* Dark Mode */
html.dark-mode .custom-modal {
  background: #1e1e1e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* ========== MODAL HEADER ========== */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(135deg, #d9534f 0%, #c9302c 100%);
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
}

.header-content i {
  font-size: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

/* ========== MODAL BODY ========== */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  min-height: 200px;
}

/* Dark Mode */
html.dark-mode .modal-body {
  background: #1e1e1e;
}

/* ========== LOADING STATE ========== */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading i {
  font-size: 48px;
  color: #d9534f;
}

html.dark-mode .loading i {
  color: #e57373;
}

.loading p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

html.dark-mode .loading p {
  color: #aaa;
}

/* ========== EMPTY STATE ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
}

.empty-state i {
  font-size: 64px;
  color: #ccc;
  margin-bottom: 8px;
}

html.dark-mode .empty-state i {
  color: #555;
}

.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  font-weight: 600;
}

html.dark-mode .empty-state p {
  color: #aaa;
}

.empty-hint {
  font-size: 0.95rem;
  color: #999;
  font-style: italic;
}

html.dark-mode .empty-hint {
  color: #777;
}

/* ========== BLOCK LIST ========== */
.block-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ========== USER CARD ========== */
.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 14px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

html.dark-mode .user-card {
  background: #2a2a2a;
  border-color: #3a3a3a;
}

.user-card:hover {
  background: #ffffff;
  border-color: #d9534f;
  box-shadow: 0 4px 16px rgba(217, 83, 79, 0.1);
  transform: translateY(-2px);
}

html.dark-mode .user-card:hover {
  background: #333333;
  border-color: #e57373;
  box-shadow: 0 4px 16px rgba(229, 115, 115, 0.2);
}

/* ========== USER INFO ========== */
.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #d9534f;
  flex-shrink: 0;
}

html.dark-mode .avatar {
  border-color: #e57373;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

html.dark-mode .user-name {
  color: #e0e0e0;
}

.blocked-badge {
  font-size: 0.85rem;
  color: #d9534f;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

html.dark-mode .blocked-badge {
  color: #e57373;
}

.blocked-badge i {
  font-size: 0.75rem;
}

/* ========== UNBLOCK BUTTON ========== */
.unblock-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #d9534f 0%, #c9302c 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.unblock-btn:hover {
  background: linear-gradient(135deg, #c9302c 0%, #b52b27 100%);
  box-shadow: 0 4px 12px rgba(217, 83, 79, 0.3);
  transform: translateY(-2px);
}

html.dark-mode .unblock-btn {
  background: linear-gradient(135deg, #e57373 0%, #ef5350 100%);
}

html.dark-mode .unblock-btn:hover {
  background: linear-gradient(135deg, #ef5350 0%, #f44336 100%);
}

.unblock-btn i {
  font-size: 0.95rem;
}

/* ========== MODAL FOOTER ========== */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  gap: 16px;
}

html.dark-mode .modal-footer {
  background: #252525;
  border-top-color: #3a3a3a;
}

/* ========== FOOTER INFO ========== */
.footer-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #666;
}

html.dark-mode .footer-info {
  color: #aaa;
}

.footer-info i {
  font-size: 1.1rem;
  color: #d9534f;
}

html.dark-mode .footer-info i {
  color: #e57373;
}

.footer-info strong {
  color: #d9534f;
  font-weight: 700;
}

html.dark-mode .footer-info strong {
  color: #e57373;
}

/* ========== REFRESH BUTTON ========== */
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #d9534f 0%, #c9302c 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #c9302c 0%, #b52b27 100%);
  box-shadow: 0 6px 20px rgba(217, 83, 79, 0.3);
  transform: translateY(-2px);
}

html.dark-mode .refresh-btn {
  background: linear-gradient(135deg, #e57373 0%, #ef5350 100%);
}

html.dark-mode .refresh-btn:hover {
  background: linear-gradient(135deg, #ef5350 0%, #f44336 100%);
}

.refresh-btn i {
  font-size: 1rem;
}

/* ========== ANIMATIONS ========== */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-zoom-enter-active .custom-modal,
.fade-zoom-leave-active .custom-modal {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-zoom-enter-from .custom-modal,
.fade-zoom-leave-to .custom-modal {
  transform: scale(0.9) translateY(20px);
}

/* ========== SCROLLBAR STYLING ========== */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

html.dark-mode .modal-body::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #d9534f;
  border-radius: 10px;
}

html.dark-mode .modal-body::-webkit-scrollbar-thumb {
  background: #e57373;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #c9302c;
}

html.dark-mode .modal-body::-webkit-scrollbar-thumb:hover {
  background: #ef5350;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 15px;
  }

  .custom-modal {
    max-width: 100%;
    border-radius: 16px;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .header-content i {
    font-size: 1.3rem;
  }

  .title {
    font-size: 1.3rem;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .modal-body {
    padding: 20px;
  }

  .user-card {
    padding: 14px;
    gap: 12px;
  }

  .avatar {
    width: 50px;
    height: 50px;
  }

  .user-name {
    font-size: 1rem;
  }

  .unblock-btn {
    padding: 9px 14px;
    font-size: 0.85rem;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
    padding: 18px 20px;
  }

  .footer-info {
    justify-content: center;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }

  .custom-modal {
    border-radius: 14px;
    max-height: 95vh;
  }

  .modal-header {
    padding: 18px 20px;
  }

  .header-content i {
    font-size: 1.2rem;
  }

  .title {
    font-size: 1.2rem;
  }

  .close-btn {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .user-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  .user-info {
    width: 100%;
  }

  .avatar {
    width: 48px;
    height: 48px;
  }

  .user-name {
    font-size: 0.95rem;
  }

  .blocked-badge {
    font-size: 0.8rem;
  }

  .unblock-btn {
    width: 100%;
    justify-content: center;
    padding: 10px;
    font-size: 0.85rem;
  }

  .modal-footer {
    padding: 16px;
  }

  .footer-info {
    font-size: 0.9rem;
  }

  .refresh-btn {
    padding: 11px 20px;
    font-size: 0.9rem;
  }

  .loading,
  .empty-state {
    padding: 40px 15px;
  }

  .loading i,
  .empty-state i {
    font-size: 40px;
  }

  .loading p,
  .empty-state p {
    font-size: 0.95rem;
  }

  .empty-hint {
    font-size: 0.85rem;
  }
}

/* Very Small Mobile */
@media (max-width: 360px) {
  .title {
    font-size: 1.1rem;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .footer-info {
    font-size: 0.85rem;
  }

  .refresh-btn {
    font-size: 0.85rem;
    padding: 10px 16px;
  }

  .btn-text {
    display: none;
  }

  .unblock-btn i {
    font-size: 1rem;
  }
}
</style>
