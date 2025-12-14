<template>
  <div class="categories-management-wrapper">
    <a-card class="management-card">
      <template #title>
        <div class="card-header">
          <h1 class="header-title">
            <i class="fa-solid fa-list"></i>
            Quản Lý Danh Mục
          </h1>
        </div>
      </template>

      <div class="action-bar">
        <button class="add-button">
          <router-link
            :to="{
              name: 'admin-categories-create',
              params: { lastIndex: categories.length },
            }"
          >
            <span class="button-content">
              <i class="fa-solid fa-plus"></i>
              <span class="button-text">Thêm Danh Mục</span>
            </span>
          </router-link>
        </button>
      </div>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="categories"
          :columns="columns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} danh mục`,
          }"
          class="modern-table"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'name'">
              <span class="name-cell">{{ record.name }}</span>
            </template>
            <template v-if="column.key === 'code'">
              <span class="code-cell">{{ record.code }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{
                    name: 'admin-categories-edit',
                    params: { id: record.id },
                  }"
                >
                  <button class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span class="btn-text">Sửa</span>
                  </button>
                </router-link>
                <button class="delete-btn" @click="deleteCategory(record.id)">
                  <i class="fa-solid fa-trash"></i>
                  <span class="btn-text">Xóa</span>
                </button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="cards-container mobile-view">
        <div
          v-for="(category, index) in categories"
          :key="category.id"
          class="category-card"
        >
          <div class="card-number">#{{ index + 1 }}</div>
          <div class="card-content">
            <h3 class="card-title">{{ category.name }}</h3>
            <div class="card-info">
              <span class="info-label">Mã số:</span>
              <span class="info-value">{{ category.code }}</span>
            </div>
            <div class="card-actions">
              <router-link
                :to="{
                  name: 'admin-categories-edit',
                  params: { id: category.id },
                }"
              >
                <button class="card-edit-btn">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span>Sửa</span>
                </button>
              </router-link>
              <button
                class="card-delete-btn"
                @click="deleteCategory(category.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa danh mục"
      @ok="handleOk"
      @cancel="handleCancel"
      class="delete-modal"
    >
      <div class="modal-content">
        <i class="fa-solid fa-triangle-exclamation warning-icon"></i>
        <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
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

const categories = ref([]);
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
    title: 'Tên Danh Mục',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Mã Số',
    dataIndex: 'code',
    key: 'code',
    align: 'center',
  },
  {
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];

const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    categories.value = response.data;
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

const isModalVisible = ref(false);
const categoryIdToDelete = ref(null);
const deleteCategory = (id) => {
  categoryIdToDelete.value = id;
  isModalVisible.value = true;
};

const handleOk = () => {
  api
    .delete(`/categories/${categoryIdToDelete.value}`)
    .then((res) => {
      if (res.status === 200) {
        message.success('Xóa danh mục thành công');
        getCategories();
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
  getCategories();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-categories']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.categories-management-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

/* ========== CARD STYLING ========== */
.management-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
}

.management-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  padding: 30px;
}

.management-card :deep(.ant-card-body) {
  padding: 30px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  color: white;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  letter-spacing: 0.5px;
}

.header-title i {
  font-size: 2.2rem;
}

/* ========== ACTION BAR ========== */
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}

.add-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  border-radius: 50px;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.add-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.add-button:hover::before {
  width: 300px;
  height: 300px;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.add-button:active {
  transform: translateY(0);
}

.add-button a {
  color: white;
  text-decoration: none;
  display: block;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.add-button i {
  font-size: 1.2rem;
}

/* ========== DESKTOP TABLE VIEW ========== */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

@media (min-width: 769px) {
  .mobile-view {
    display: none !important;
  }

  .desktop-view {
    display: block !important;
  }
}

.table-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.modern-table :deep(.ant-table) {
  border-radius: 12px;
  overflow: hidden;
}

.modern-table :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  padding: 18px 16px;
}

.modern-table :deep(.ant-table-tbody > tr) {
  transition: all 0.3s ease;
}

.modern-table :deep(.ant-table-tbody > tr:hover) {
  background: rgba(12, 113, 61, 0.05);
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.modern-table :deep(.ant-table-tbody > tr > td) {
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.index-cell {
  font-weight: 700;
  color: #0c713d;
  font-size: 1.1rem;
}

.name-cell,
.code-cell {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

/* ========== ACTION BUTTONS (Desktop) ========== */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.edit-btn,
.delete-btn {
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 0.95rem;
}

.edit-btn::before,
.delete-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.edit-btn:hover::before,
.delete-btn:hover::before {
  width: 200px;
  height: 200px;
}

.edit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 77, 79, 0.4);
}

.edit-btn:active,
.delete-btn:active {
  transform: translateY(0);
}

.edit-btn a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

/* ========== MOBILE CARD VIEW ========== */
.cards-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  padding: 20px;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(12, 113, 61, 0.2);
}

.card-number {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.card-content {
  padding-top: 10px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0c713d;
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(12, 113, 61, 0.05);
  border-radius: 8px;
}

.info-label {
  font-weight: 600;
  color: #0c713d;
  font-size: 0.95rem;
}

.info-value {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.card-actions {
  display: flex;
  gap: 10px;
  width: 100%;
}

.card-edit-btn,
.card-delete-btn {
  flex: 1;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 0.95rem;
}

.card-edit-btn::before,
.card-delete-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.card-edit-btn:hover::before,
.card-delete-btn:hover::before {
  width: 200px;
  height: 200px;
}

.card-edit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.card-edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.4);
}

.card-delete-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.card-delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 77, 79, 0.4);
}

.card-edit-btn:active,
.card-delete-btn:active {
  transform: translateY(0);
}

.card-edit-btn a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

/* ========== MODAL STYLING ========== */
.delete-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  border: none;
}

.delete-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 700;
}

.modal-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 4rem;
  color: #ff4d4f;
  margin-bottom: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.modal-content p {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .categories-management-wrapper {
    padding: 30px 15px;
  }

  .header-title {
    font-size: 1.7rem;
  }

  .header-title i {
    font-size: 1.9rem;
  }

  .button-content {
    padding: 12px 28px;
    font-size: 0.95rem;
  }

  .management-card :deep(.ant-card-body) {
    padding: 25px;
  }

  .table-container {
    padding: 15px;
  }
}

/* Mobile - Switch to Card View */
@media (max-width: 768px) {
  .categories-management-wrapper {
    padding: 20px 10px;
  }

  .management-card :deep(.ant-card-head) {
    padding: 20px;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-title i {
    font-size: 1.7rem;
  }

  .action-bar {
    justify-content: center;
    margin-bottom: 20px;
  }

  .add-button {
    width: 100%;
    max-width: 300px;
  }

  .button-content {
    padding: 12px 24px;
    font-size: 0.9rem;
    justify-content: center;
  }

  .management-card :deep(.ant-card-body) {
    padding: 20px 15px;
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
  .categories-management-wrapper {
    padding: 15px 8px;
  }

  .management-card {
    border-radius: 12px;
  }

  .management-card :deep(.ant-card-head) {
    padding: 15px;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .header-title i {
    font-size: 1.5rem;
  }

  .button-content {
    padding: 10px 20px;
    font-size: 0.85rem;
  }

  .add-button i {
    font-size: 1rem;
  }

  .management-card :deep(.ant-card-body) {
    padding: 15px 10px;
  }

  .category-card {
    border-radius: 12px;
    padding: 15px;
  }

  .card-number {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }

  .card-title {
    font-size: 1.05rem;
    margin-bottom: 12px;
  }

  .card-info {
    padding: 10px;
  }

  .info-label {
    font-size: 0.9rem;
  }

  .info-value {
    font-size: 0.95rem;
  }

  .card-actions {
    gap: 8px;
  }

  .card-edit-btn,
  .card-delete-btn {
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .warning-icon {
    font-size: 3rem;
  }

  .modal-content p {
    font-size: 1rem;
  }
}
</style>
