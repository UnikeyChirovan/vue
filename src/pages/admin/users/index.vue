<template>
  <div class="users-page-wrapper">
    <a-card class="users-card">
      <template #title>
        <div class="card-header-content">
          <div class="header-left">
            <i class="fa-solid fa-users header-icon"></i>
            <span class="header-title">Quản Lý Tài Khoản</span>
          </div>
          <div class="header-right">
            <a-button type="primary" class="add-button">
              <router-link :to="{ name: 'admin-users-create' }">
                <i class="fa-solid fa-plus"></i>
                <span class="btn-text">Thêm Mới</span>
              </router-link>
            </a-button>
          </div>
        </div>
      </template>

      <!-- Desktop/Tablet Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="users"
          :columns="columns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tài khoản`,
          }"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag
                :color="record.status_id === 1 ? 'success' : 'error'"
                class="status-tag"
              >
                {{ record.status }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{ name: 'admin-users-edit', params: { id: record.id } }"
                >
                  <a-button type="primary" class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span class="btn-action-text">Sửa</span>
                  </a-button>
                </router-link>
                <a-button
                  type="primary"
                  danger
                  class="delete-btn"
                  @click="deleteUsers(record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span class="btn-action-text">Xóa</span>
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view">
        <div class="users-cards-container">
          <div v-for="(user, index) in users" :key="user.id" class="user-card">
            <div class="user-card-header">
              <div class="user-number">
                <i class="fa-solid fa-hashtag"></i>
                {{ index + 1 }}
              </div>
              <a-tag
                :color="user.status_id === 1 ? 'success' : 'error'"
                class="status-tag-mobile"
              >
                {{ user.status }}
              </a-tag>
            </div>

            <div class="user-card-body">
              <div class="user-info-row">
                <i class="fa-solid fa-user info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Tài khoản:</span>
                  <span class="info-value">{{ user.username }}</span>
                </div>
              </div>

              <div class="user-info-row">
                <i class="fa-solid fa-id-card info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Họ tên:</span>
                  <span class="info-value">{{ user.name }}</span>
                </div>
              </div>

              <div class="user-info-row">
                <i class="fa-solid fa-signature info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Biệt danh:</span>
                  <span class="info-value">{{ user.nickname }}</span>
                </div>
              </div>

              <div class="user-info-row">
                <i class="fa-solid fa-building info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Phòng ban:</span>
                  <span class="info-value">{{ user.departments }}</span>
                </div>
              </div>
            </div>

            <div class="user-card-actions">
              <router-link
                :to="{ name: 'admin-users-edit', params: { id: user.id } }"
              >
                <a-button type="primary" class="edit-btn-mobile">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span>Chỉnh sửa</span>
                </a-button>
              </router-link>
              <a-button
                type="primary"
                danger
                class="delete-btn-mobile"
                @click="deleteUsers(user.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa</span>
              </a-button>
            </div>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div class="mobile-pagination">
          <a-pagination
            v-model:current="currentPage"
            :total="users.length"
            :pageSize="pageSize"
            :showSizeChanger="false"
            :showTotal="(total) => `Tổng ${total} tài khoản`"
          />
        </div>
      </div>
    </a-card>

    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa tài khoản"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="Xác nhận"
      cancelText="Hủy"
      class="delete-modal"
    >
      <div class="modal-content">
        <i class="fa-solid fa-circle-exclamation warning-icon"></i>
        <p>Bạn có chắc chắn muốn xóa tài khoản này không?</p>
        <p class="warning-text">Hành động này không thể hoàn tác!</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';

const users = ref([]);
const isMobile = ref(window.innerWidth < 600);
const currentPage = ref(1);
const pageSize = ref(10);

const scrollOptions = computed(() => {
  return isMobile.value ? { x: 1200 } : { x: 576 };
});

const columns = [
  {
    title: '#',
    key: 'index',
    width: 50,
    align: 'center',
  },
  {
    title: 'Avatar',
    key: 'avatar',
    align: 'center',
    responsive: ['sm'],
  },
  {
    title: 'Tài khoản',
    dataIndex: 'username',
    key: 'username',
    sorter: (a, b) => a.username.length - b.username.length,
    ellipsis: true,
    align: 'center',
  },
  {
    title: 'Họ Tên',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Biệt Danh',
    dataIndex: 'nickname',
    key: 'nickname',
    align: 'center',
  },
  {
    title: 'Phòng ban',
    dataIndex: 'departments',
    key: 'departments',
    align: 'center',
  },
  {
    title: 'Tình trạng',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: 'Công cụ',
    key: 'action',
    align: 'center',
  },
];

const getUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

const isModalVisible = ref(false);
const userIdToDelete = ref(null);

const deleteUsers = (id) => {
  userIdToDelete.value = id;
  isModalVisible.value = true;
};

const handleOk = () => {
  api
    .delete(`/users/${userIdToDelete.value}`)
    .then((res) => {
      if (res.status == 200) {
        message.success('Xóa tài khoản thành công');
        getUsers();
      }
    })
    .catch((err) => {
      message.error('Lỗi');
    })
    .finally(() => {
      isModalVisible.value = false;
    });
};

const handleCancel = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  getUsers();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-users']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.users-page-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

/* ========== CARD STYLING ========== */
.users-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
}

.users-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-bottom: none;
  padding: 24px 32px;
}

.users-card :deep(.ant-card-head-title) {
  padding: 0;
}

.users-card :deep(.ant-card-body) {
  padding: 32px;
}

/* ========== CARD HEADER ========== */
.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 1.5rem;
  color: white;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.add-button {
  background: white;
  border: none;
  border-radius: 12px;
  padding: 8px 20px;
  height: auto;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: #f0f0f0;
}

.add-button a {
  color: #0c713d;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-text {
  font-size: 0.95rem;
}

/* ========== DESKTOP TABLE VIEW ========== */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

.table-container {
  border-radius: 16px;
  overflow: hidden;
  background: white;
}

.table-container :deep(.ant-table) {
  border-radius: 16px;
}

.table-container :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: none;
  padding: 16px 12px;
}

.table-container :deep(.ant-table-tbody > tr) {
  transition: all 0.3s ease;
}

.table-container :deep(.ant-table-tbody > tr:hover) {
  background: rgba(12, 113, 61, 0.05);
  transform: scale(1.005);
}

.table-container :deep(.ant-table-tbody > tr > td) {
  padding: 16px 12px;
  font-size: 0.95rem;
  border-bottom: 1px solid #f0f0f0;
}

.index-cell {
  font-weight: 600;
  color: #0c713d;
}

.status-tag {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 8px;
}

/* ========== ACTION BUTTONS ========== */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.edit-btn,
.delete-btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 6px 16px;
  height: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.edit-btn {
  background: #0c713d;
  border-color: #0c713d;
}

.edit-btn:hover {
  background: #0a5a31;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

/* ========== MOBILE CARD VIEW ========== */
.users-cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-card {
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.15);
  border-color: rgba(12, 113, 61, 0.3);
}

.user-card-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-number {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-tag-mobile {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
}

.user-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  color: #0c713d;
  font-size: 1.1rem;
  min-width: 24px;
  margin-top: 2px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.info-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
  word-break: break-word;
}

.user-card-actions {
  padding: 12px 16px;
  background: #f8f8f8;
  display: flex;
  gap: 10px;
  border-top: 1px solid rgba(12, 113, 61, 0.1);
}

.edit-btn-mobile,
.delete-btn-mobile {
  flex: 1;
  border-radius: 10px;
  font-weight: 600;
  padding: 10px 16px;
  height: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
}

.edit-btn-mobile {
  background: #0c713d;
  border-color: #0c713d;
}

.edit-btn-mobile:hover {
  background: #0a5a31;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.delete-btn-mobile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.mobile-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.mobile-pagination :deep(.ant-pagination) {
  display: flex;
  justify-content: center;
}

/* ========== MODAL STYLING ========== */
.delete-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #ff4d4f 0%, #d32f2f 100%);
  border-bottom: none;
  border-radius: 16px 16px 0 0;
}

.delete-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

.delete-modal :deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
}

.delete-modal :deep(.ant-modal-body) {
  padding: 32px;
}

.modal-content {
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  color: #ff4d4f;
  margin-bottom: 16px;
}

.modal-content p {
  font-size: 1.05rem;
  margin-bottom: 8px;
  color: #333;
}

.warning-text {
  color: #ff4d4f;
  font-weight: 600;
  font-size: 0.95rem;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .users-page-wrapper {
    padding: 70px 16px 50px;
  }

  .users-card :deep(.ant-card-head) {
    padding: 20px 24px;
  }

  .users-card :deep(.ant-card-body) {
    padding: 24px;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .header-icon {
    font-size: 1.3rem;
  }

  .table-container :deep(.ant-table-thead > tr > th),
  .table-container :deep(.ant-table-tbody > tr > td) {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
}

/* Mobile - Switch to Card View */
@media (max-width: 768px) {
  .users-page-wrapper {
    padding: 60px 12px 40px;
  }

  .users-card {
    border-radius: 16px;
  }

  .users-card :deep(.ant-card-head) {
    padding: 16px 18px;
  }

  .users-card :deep(.ant-card-body) {
    padding: 18px 14px;
  }

  .card-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
  }

  .header-title {
    font-size: 1.15rem;
  }

  .header-icon {
    font-size: 1.15rem;
  }

  .add-button {
    width: 100%;
    justify-content: center;
    padding: 9px 18px;
  }

  .add-button a {
    justify-content: center;
  }

  .btn-text {
    font-size: 0.88rem;
  }

  /* Hide table, show cards */
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }

  .user-card {
    border-radius: 14px;
  }

  .user-card-header {
    padding: 13px 15px;
  }

  .user-number {
    font-size: 0.95rem;
  }

  .status-tag-mobile {
    font-size: 0.82rem;
    padding: 3px 11px;
  }

  .user-card-body {
    padding: 15px;
    gap: 11px;
  }

  .info-icon {
    font-size: 1.05rem;
    min-width: 22px;
  }

  .info-label {
    font-size: 0.78rem;
  }

  .info-value {
    font-size: 0.92rem;
  }

  .user-card-actions {
    padding: 11px 15px;
    gap: 9px;
  }

  .edit-btn-mobile,
  .delete-btn-mobile {
    padding: 9px 15px;
    font-size: 0.87rem;
  }
}

/* Medium Mobile */
@media (max-width: 600px) {
  .users-page-wrapper {
    padding: 55px 10px 35px;
  }

  .users-card :deep(.ant-card-head) {
    padding: 15px 16px;
  }

  .users-card :deep(.ant-card-body) {
    padding: 16px 12px;
  }

  .header-title {
    font-size: 1.1rem;
  }

  .header-icon {
    font-size: 1.1rem;
  }

  .add-button {
    padding: 8px 16px;
  }

  .btn-text {
    font-size: 0.85rem;
  }

  .user-card {
    border-radius: 13px;
  }

  .user-card-header {
    padding: 12px 14px;
  }

  .user-number {
    font-size: 0.92rem;
  }

  .status-tag-mobile {
    font-size: 0.8rem;
    padding: 3px 10px;
  }

  .user-card-body {
    padding: 14px;
    gap: 10px;
  }

  .info-icon {
    font-size: 1.02rem;
    min-width: 21px;
  }

  .info-label {
    font-size: 0.76rem;
  }

  .info-value {
    font-size: 0.9rem;
  }

  .user-card-actions {
    padding: 10px 14px;
    gap: 8px;
  }

  .edit-btn-mobile,
  .delete-btn-mobile {
    padding: 8px 14px;
    font-size: 0.85rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .users-page-wrapper {
    padding: 50px 8px 30px;
  }

  .users-card {
    border-radius: 12px;
  }

  .users-card :deep(.ant-card-head) {
    padding: 14px 14px;
  }

  .users-card :deep(.ant-card-body) {
    padding: 14px 10px;
  }

  .header-title {
    font-size: 1.05rem;
  }

  .header-icon {
    font-size: 1.05rem;
  }

  .add-button {
    padding: 7px 14px;
    border-radius: 10px;
  }

  .btn-text {
    font-size: 0.82rem;
  }

  .user-card {
    border-radius: 12px;
  }

  .user-card-header {
    padding: 11px 13px;
  }

  .user-number {
    font-size: 0.9rem;
  }

  .status-tag-mobile {
    font-size: 0.78rem;
    padding: 2px 9px;
  }

  .user-card-body {
    padding: 13px;
    gap: 9px;
  }

  .info-icon {
    font-size: 1rem;
    min-width: 20px;
  }

  .info-label {
    font-size: 0.74rem;
  }

  .info-value {
    font-size: 0.88rem;
  }

  .user-card-actions {
    padding: 9px 13px;
    gap: 7px;
  }

  .edit-btn-mobile,
  .delete-btn-mobile {
    padding: 7px 12px;
    font-size: 0.82rem;
  }

  .modal-content p {
    font-size: 0.95rem;
  }

  .warning-icon {
    font-size: 2.5rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .users-page-wrapper {
    padding: 45px 6px 25px;
  }

  .users-card :deep(.ant-card-head) {
    padding: 12px 12px;
  }

  .users-card :deep(.ant-card-body) {
    padding: 12px 8px;
  }

  .header-title {
    font-size: 1rem;
  }

  .header-icon {
    font-size: 1rem;
  }

  .add-button {
    padding: 6px 12px;
  }

  .btn-text {
    font-size: 0.8rem;
  }

  .user-card {
    border-radius: 10px;
  }

  .user-card-header {
    padding: 10px 12px;
  }

  .user-number {
    font-size: 0.85rem;
  }

  .status-tag-mobile {
    font-size: 0.75rem;
    padding: 2px 8px;
  }

  .user-card-body {
    padding: 12px;
    gap: 8px;
  }

  .info-icon {
    font-size: 0.95rem;
    min-width: 18px;
  }

  .info-label {
    font-size: 0.72rem;
  }

  .info-value {
    font-size: 0.85rem;
  }

  .user-card-actions {
    padding: 8px 12px;
    gap: 6px;
  }

  .edit-btn-mobile,
  .delete-btn-mobile {
    padding: 6px 10px;
    font-size: 0.78rem;
  }

  .modal-content p {
    font-size: 0.9rem;
  }

  .warning-icon {
    font-size: 2.2rem;
  }
}
</style>
