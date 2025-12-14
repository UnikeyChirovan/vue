<template>
  <div class="blacklist-wrapper">
    <a-card class="blacklist-card">
      <template #title>
        <div class="card-header-content">
          <div class="header-left">
            <i class="fa-solid fa-ban header-icon"></i>
            <span class="header-title">Danh Sách Blacklist</span>
          </div>
        </div>
      </template>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="blacklist"
          :columns="columns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} địa chỉ IP`,
          }"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'ip_address'">
              <span class="ip-cell">{{ record.ip_address }}</span>
            </template>
            <template v-if="column.key === 'user_agent'">
              <span class="agent-cell">{{ record.user_agent }}</span>
            </template>
            <template v-if="column.key === 'reason'">
              <span class="reason-cell">{{ record.reason }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button
                type="primary"
                danger
                class="delete-btn"
                @click="confirmDelete(record.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span class="btn-text">Xóa</span>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view">
        <div class="blacklist-cards-container">
          <div
            v-for="(item, index) in blacklist"
            :key="item.id"
            class="blacklist-card-item"
          >
            <div class="card-item-header">
              <div class="item-number">
                <i class="fa-solid fa-hashtag"></i>
                {{ index + 1 }}
              </div>
              <div class="blocked-badge">
                <i class="fa-solid fa-shield-halved"></i>
                Bị chặn
              </div>
            </div>

            <div class="card-item-body">
              <div class="item-info-row">
                <i class="fa-solid fa-network-wired info-icon"></i>
                <div class="info-content">
                  <span class="info-label">IP Address:</span>
                  <span class="info-value ip-text">{{ item.ip_address }}</span>
                </div>
              </div>

              <div class="item-info-row">
                <i class="fa-solid fa-desktop info-icon"></i>
                <div class="info-content">
                  <span class="info-label">User Agent:</span>
                  <span class="info-value agent-text">{{
                    item.user_agent
                  }}</span>
                </div>
              </div>

              <div class="item-info-row">
                <i class="fa-solid fa-circle-exclamation info-icon reason"></i>
                <div class="info-content">
                  <span class="info-label">Lý do:</span>
                  <span class="info-value reason-text">{{ item.reason }}</span>
                </div>
              </div>
            </div>

            <div class="card-item-actions">
              <a-button
                type="primary"
                danger
                class="delete-btn-mobile"
                @click="confirmDelete(item.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa khỏi Blacklist</span>
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- Delete Modal -->
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa"
      @ok="handleDelete"
      @cancel="handleCancel"
      okText="Xác nhận"
      cancelText="Hủy"
      class="delete-modal"
    >
      <div class="modal-content">
        <i class="fa-solid fa-circle-exclamation warning-icon"></i>
        <p>Bạn có chắc chắn muốn xóa mục này khỏi blacklist không?</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const blacklist = ref([]);
const isMobile = ref(window.innerWidth < 600);
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
    title: 'Địa Chỉ IP',
    dataIndex: 'ip_address',
    key: 'ip_address',
    align: 'center',
  },
  {
    title: 'User Agent',
    dataIndex: 'user_agent',
    key: 'user_agent',
    align: 'center',
  },
  {
    title: 'Lý Do',
    dataIndex: 'reason',
    key: 'reason',
    align: 'center',
  },
  {
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];

const isModalVisible = ref(false);
const idToDelete = ref(null);

const getBlacklist = async () => {
  try {
    const response = await api.get('/users/blacklist');
    blacklist.value = response.data.blacklist;
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

const confirmDelete = (id) => {
  idToDelete.value = id;
  isModalVisible.value = true;
};

const handleDelete = () => {
  api
    .delete(`users/blacklist/${idToDelete.value}`)
    .then((res) => {
      if (res.status === 204) {
        message.success('Xóa blacklist thành công');
        getBlacklist();
      }
    })
    .catch((err) => {
      message.error('Lỗi khi xóa');
    })
    .finally(() => {
      isModalVisible.value = false;
    });
};

const handleCancel = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  getBlacklist();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-blacklists']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.blacklist-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

/* ========== CARD STYLING ========== */
.blacklist-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
}

.blacklist-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-bottom: none;
  padding: 24px 32px;
}

.blacklist-card :deep(.ant-card-head-title) {
  padding: 0;
}

.blacklist-card :deep(.ant-card-body) {
  padding: 32px;
}

/* ========== CARD HEADER ========== */
.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.table-container :deep(.ant-table-tbody > tr > td) {
  padding: 16px 12px;
  font-size: 0.95rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.index-cell {
  font-weight: 600;
  color: #0c713d;
}

.ip-cell {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #d32f2f;
}

.agent-cell {
  font-size: 0.85rem;
  color: #666;
}

.reason-cell {
  font-size: 0.9rem;
  color: #ff6b6b;
  font-weight: 500;
}

/* ========== ACTION BUTTONS ========== */
.delete-btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 6px 16px;
  height: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

/* ========== MOBILE CARD VIEW ========== */
.blacklist-cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blacklist-card-item {
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(211, 47, 47, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.blacklist-card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(211, 47, 47, 0.2);
  border-color: rgba(211, 47, 47, 0.3);
}

.card-item-header {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-number {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.blocked-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-item-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-info-row {
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

.info-icon.reason {
  color: #ff6b6b;
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

.ip-text {
  font-family: 'Courier New', monospace;
  color: #d32f2f;
  font-weight: 700;
}

.agent-text {
  font-size: 0.85rem;
  color: #666;
  font-weight: 400;
}

.reason-text {
  color: #ff6b6b;
  font-weight: 500;
}

.card-item-actions {
  padding: 12px 16px;
  background: #fff5f5;
  border-top: 1px solid rgba(211, 47, 47, 0.1);
}

.delete-btn-mobile {
  width: 100%;
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

.delete-btn-mobile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
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

.modal-content {
  text-align: center;
  padding: 20px 0;
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

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .blacklist-wrapper {
    padding: 70px 16px 50px;
  }

  .blacklist-card :deep(.ant-card-head) {
    padding: 20px 24px;
  }

  .blacklist-card :deep(.ant-card-body) {
    padding: 24px;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .header-icon {
    font-size: 1.3rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .blacklist-wrapper {
    padding: 60px 12px 40px;
  }

  .blacklist-card {
    border-radius: 16px;
  }

  .blacklist-card :deep(.ant-card-head) {
    padding: 18px 20px;
  }

  .blacklist-card :deep(.ant-card-body) {
    padding: 20px 16px;
  }

  .header-title {
    font-size: 1.15rem;
  }

  .header-icon {
    font-size: 1.15rem;
  }

  /* Hide table, show cards */
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .blacklist-wrapper {
    padding: 50px 8px 30px;
  }

  .blacklist-card {
    border-radius: 12px;
  }

  .blacklist-card :deep(.ant-card-head) {
    padding: 16px 16px;
  }

  .blacklist-card :deep(.ant-card-body) {
    padding: 16px 12px;
  }

  .header-title {
    font-size: 1.05rem;
  }

  .header-icon {
    font-size: 1.05rem;
  }

  .blacklist-card-item {
    border-radius: 12px;
  }

  .card-item-header {
    padding: 12px 14px;
  }

  .item-number {
    font-size: 0.9rem;
  }

  .blocked-badge {
    font-size: 0.8rem;
    padding: 3px 10px;
  }

  .card-item-body {
    padding: 14px;
    gap: 10px;
  }

  .info-icon {
    font-size: 1rem;
    min-width: 20px;
  }

  .info-label {
    font-size: 0.75rem;
  }

  .info-value {
    font-size: 0.88rem;
  }

  .agent-text {
    font-size: 0.8rem;
  }

  .card-item-actions {
    padding: 10px 14px;
  }

  .delete-btn-mobile {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
}
</style>
