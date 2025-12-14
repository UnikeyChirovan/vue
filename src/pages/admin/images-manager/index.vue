<template>
  <div class="images-wrapper">
    <a-card class="images-card">
      <template #title>
        <div class="card-header-content">
          <div class="header-left">
            <i class="fa-solid fa-images header-icon"></i>
            <span class="header-title">Quản Lý Hình Ảnh</span>
          </div>
          <div class="header-right">
            <a-button type="primary" class="add-button">
              <router-link :to="{ name: 'admin-images-manager-create' }">
                <i class="fa-solid fa-plus"></i>
                <span class="btn-text">Thêm Hình</span>
              </router-link>
            </a-button>
          </div>
        </div>
      </template>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="backgrounds"
          :columns="columns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} hình ảnh`,
          }"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>

            <template v-if="column.key === 'background_image_name'">
              <span class="name-cell">{{ record.image_name }}</span>
            </template>

            <template v-if="column.key === 'background_image'">
              <div class="image-preview-container">
                <img
                  :src="getImageUrl(record.image_path)"
                  alt="Background"
                  class="table-image"
                />
              </div>
            </template>

            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{
                    name: 'admin-images-manager-edit',
                    params: { id: record.id },
                  }"
                >
                  <a-button type="primary" class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span class="btn-text">Sửa</span>
                  </a-button>
                </router-link>
                <a-button
                  type="primary"
                  danger
                  class="delete-btn"
                  @click="deleteBackground(record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span class="btn-text">Xóa</span>
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view">
        <div class="images-cards-container">
          <div
            v-for="(image, index) in backgrounds"
            :key="image.id"
            class="image-card"
          >
            <div class="image-card-header">
              <div class="image-number">
                <i class="fa-solid fa-hashtag"></i>
                {{ index + 1 }}
              </div>
            </div>

            <div class="image-card-preview">
              <img
                :src="getImageUrl(image.image_path)"
                :alt="image.image_name"
                class="preview-image"
              />
            </div>

            <div class="image-card-body">
              <div class="image-info-row">
                <i class="fa-solid fa-signature info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Tên hình:</span>
                  <span class="info-value">{{ image.image_name }}</span>
                </div>
              </div>
            </div>

            <div class="image-card-actions">
              <router-link
                :to="{
                  name: 'admin-images-manager-edit',
                  params: { id: image.id },
                }"
                style="flex: 1"
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
                @click="deleteBackground(image.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa</span>
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- Delete Modal -->
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa hình ảnh"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="Xác nhận"
      cancelText="Hủy"
      class="delete-modal"
    >
      <div class="modal-content">
        <i class="fa-solid fa-circle-exclamation warning-icon"></i>
        <p>Bạn có chắc chắn muốn xóa hình ảnh này không?</p>
        <p class="warning-text">Hành động này không thể hoàn tác!</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const backgrounds = ref([]);
const isMobile = ref(window.innerWidth < 600);
const scrollOptions = computed(() => {
  return isMobile.value ? { x: 1200 } : { x: 576 };
});
const BaseURL = 'http://127.0.0.1:8000';

const columns = [
  {
    title: '#',
    key: 'index',
    width: 50,
    align: 'center',
  },
  {
    title: 'Tên Hình',
    dataIndex: 'image_name',
    key: 'background_image_name',
    align: 'center',
  },
  {
    title: 'Hình Ảnh',
    key: 'background_image',
    align: 'center',
  },
  {
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];

const getImageUrl = (path) => {
  return `${BaseURL}/storage/${path}`;
};

const getBackgrounds = async () => {
  try {
    const response = await api.get('image-manager');
    backgrounds.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Lỗi khi lấy danh sách hình ảnh.');
  }
};

const isModalVisible = ref(false);
const backgroundIdToDelete = ref(null);

const deleteBackground = (id) => {
  backgroundIdToDelete.value = id;
  isModalVisible.value = true;
};

const handleOk = async () => {
  try {
    await api.delete(`/image-manager/${backgroundIdToDelete.value}`);
    message.success('Xóa hình ảnh thành công');
    getBackgrounds();
  } catch (error) {
    message.error('Lỗi khi xóa hình ảnh');
  } finally {
    isModalVisible.value = false;
  }
};

const handleCancel = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  getBackgrounds();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-images-manager']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.images-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

/* ========== CARD STYLING ========== */
.images-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
}

.images-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-bottom: none;
  padding: 24px 32px;
}

.images-card :deep(.ant-card-head-title) {
  padding: 0;
}

.images-card :deep(.ant-card-body) {
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

.name-cell {
  font-weight: 600;
  color: #333;
}

.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.table-image:hover {
  transform: scale(1.15);
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
.images-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.image-card {
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.image-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(12, 113, 61, 0.2);
  border-color: rgba(12, 113, 61, 0.3);
}

.image-card-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-number {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.image-card-preview {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-card:hover .preview-image {
  transform: scale(1.1);
}

.image-card-body {
  padding: 16px;
  flex: 1;
}

.image-info-row {
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
  gap: 4px;
  flex: 1;
}

.info-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #333;
  font-weight: 600;
  word-break: break-word;
}

.image-card-actions {
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
  width: 100%;
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

.warning-text {
  color: #ff4d4f;
  font-weight: 600;
  font-size: 0.95rem;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .images-wrapper {
    padding: 70px 16px 50px;
  }

  .images-card :deep(.ant-card-head) {
    padding: 20px 24px;
  }

  .images-card :deep(.ant-card-body) {
    padding: 24px;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .header-icon {
    font-size: 1.3rem;
  }

  .images-cards-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .images-wrapper {
    padding: 60px 12px 40px;
  }

  .images-card {
    border-radius: 16px;
  }

  .images-card :deep(.ant-card-head) {
    padding: 18px 20px;
  }

  .images-card :deep(.ant-card-body) {
    padding: 20px 16px;
  }

  .card-header-content {
    flex-direction: column;
    align-items: flex-start;
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
    padding: 10px 20px;
  }

  .add-button a {
    justify-content: center;
  }

  /* Hide table, show cards */
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }

  .images-cards-container {
    grid-template-columns: 1fr;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .images-wrapper {
    padding: 50px 8px 30px;
  }

  .images-card {
    border-radius: 12px;
  }

  .images-card :deep(.ant-card-head) {
    padding: 16px 16px;
  }

  .images-card :deep(.ant-card-body) {
    padding: 16px 12px;
  }

  .header-title {
    font-size: 1.05rem;
  }

  .header-icon {
    font-size: 1.05rem;
  }

  .add-button {
    padding: 8px 16px;
  }

  .image-card {
    border-radius: 12px;
  }

  .image-card-header {
    padding: 10px 14px;
  }

  .image-number {
    font-size: 0.9rem;
  }

  .image-card-preview {
    height: 180px;
  }

  .image-card-body {
    padding: 14px;
  }

  .info-icon {
    font-size: 1rem;
    min-width: 20px;
  }

  .info-label {
    font-size: 0.75rem;
  }

  .info-value {
    font-size: 0.9rem;
  }

  .image-card-actions {
    padding: 10px 14px;
    gap: 8px;
  }

  .edit-btn-mobile,
  .delete-btn-mobile {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
}
</style>
