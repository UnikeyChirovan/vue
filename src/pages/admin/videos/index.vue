<template>
  <div class="videos-wrapper">
    <div class="videos-container">
      <!-- Card Header Outside -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fa-solid fa-film"></i>
            Quản Lý Video
          </h1>
          <p class="page-subtitle">Tổng cộng: {{ videos.length }} video</p>
        </div>
        <button class="add-btn">
          <router-link :to="{ name: 'admin-videos-create' }" class="add-link">
            <i class="fa-solid fa-plus"></i>
            <span class="btn-text">Thêm Video</span>
          </router-link>
        </button>
      </div>

      <!-- Content Card -->
      <a-card class="videos-card">
        <!-- Desktop/Tablet Table View -->
        <div class="table-wrapper desktop-view">
          <a-table
            :dataSource="videos"
            :columns="columns"
            :scroll="scrollOptions"
            :pagination="{ pageSize: 10 }"
            class="videos-table"
          >
            <template #bodyCell="{ column, index, record }">
              <template v-if="column.key === 'index'">
                <span class="index-cell">{{ index + 1 }}</span>
              </template>

              <template v-if="column.key === 'featured'">
                <div class="featured-cell">
                  <a-radio
                    :checked="!!record.is_featured"
                    @change="confirmSetFeatured(record.id)"
                    class="featured-radio"
                  ></a-radio>
                  <span v-if="record.is_featured" class="featured-badge">
                    <i class="fa-solid fa-star"></i>
                  </span>
                </div>
              </template>

              <template v-if="column.key === 'video_name'">
                <div class="name-cell">
                  <span class="video-name">{{ record.video_name }}</span>
                  <span class="episode-number"
                    >Tập {{ record.episode_number }}</span
                  >
                </div>
              </template>

              <template v-if="column.key === 'video'">
                <div class="video-cell">
                  <video
                    :src="getVideoUrl(record.video_path)"
                    controls
                    class="video-thumbnail"
                  ></video>
                </div>
              </template>

              <template v-if="column.key === 'action'">
                <div class="action-cell">
                  <router-link
                    :to="{
                      name: 'admin-videos-edit',
                      params: { id: record.id },
                    }"
                  >
                    <button class="action-btn edit-btn">
                      <i class="fa-solid fa-pen-to-square"></i>
                      <span class="btn-text-action">Sửa</span>
                    </button>
                  </router-link>
                  <button
                    @click="deleteVideo(record.id)"
                    class="action-btn delete-btn"
                  >
                    <i class="fa-solid fa-trash"></i>
                    <span class="btn-text-action">Xóa</span>
                  </button>
                </div>
              </template>
            </template>
          </a-table>
        </div>

        <!-- Mobile Card View -->
        <div class="mobile-view">
          <div class="video-cards">
            <div
              v-for="(video, index) in videos"
              :key="video.id"
              class="video-card"
            >
              <!-- Card Header -->
              <div class="card-header-mobile">
                <div class="card-number">#{{ index + 1 }}</div>
                <div class="featured-mobile">
                  <a-radio
                    :checked="!!video.is_featured"
                    @change="confirmSetFeatured(video.id)"
                  ></a-radio>
                  <span v-if="video.is_featured" class="featured-badge-mobile">
                    <i class="fa-solid fa-star"></i>
                  </span>
                </div>
              </div>

              <!-- Video Preview -->
              <div class="card-video">
                <video
                  :src="getVideoUrl(video.video_path)"
                  controls
                  class="video-mobile"
                ></video>
              </div>

              <!-- Video Info -->
              <div class="card-info">
                <h3 class="card-title">{{ video.video_name }}</h3>
                <span class="card-episode">Tập {{ video.episode_number }}</span>
              </div>

              <!-- Card Actions -->
              <div class="card-actions">
                <router-link
                  :to="{ name: 'admin-videos-edit', params: { id: video.id } }"
                >
                  <button class="card-btn edit-btn-mobile">
                    <i class="fa-solid fa-pen-to-square"></i>
                    Chỉnh sửa
                  </button>
                </router-link>
                <button
                  @click="deleteVideo(video.id)"
                  class="card-btn delete-btn-mobile"
                >
                  <i class="fa-solid fa-trash"></i>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </a-card>

      <!-- Delete Confirmation Modal -->
      <a-modal
        v-model:visible="isModalVisible"
        title="Xác nhận xóa video"
        @ok="handleOk"
        @cancel="handleCancel"
        okText="Xóa"
        cancelText="Hủy"
        class="delete-modal"
      >
        <div class="modal-content">
          <i class="fa-solid fa-triangle-exclamation warning-icon"></i>
          <p>Bạn có chắc chắn muốn xóa video này không?</p>
          <p class="warning-text">Hành động này không thể hoàn tác!</p>
        </div>
      </a-modal>

      <!-- Featured Confirmation Modal -->
      <a-modal
        v-model:visible="isFeaturedModalVisible"
        title="Xác nhận"
        @ok="setFeaturedVideo"
        @cancel="isFeaturedModalVisible = false"
        okText="Đồng ý"
        cancelText="Hủy"
        class="featured-modal"
      >
        <div class="modal-content">
          <i class="fa-solid fa-star featured-icon"></i>
          <p>Bạn có chắc chắn muốn đặt video này làm video đặc biệt?</p>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const videos = ref([]);
const isMobile = ref(window.innerWidth < 600);
const scrollOptions = computed(() => {
  return isMobile.value ? { x: 1200 } : { x: 576 };
});
const BaseURL = 'http://127.0.0.1:8000';

const columns = [
  { title: '#', key: 'index', width: 70, align: 'center' },
  { title: 'Đặc Biệt', key: 'featured', width: 110, align: 'center' },
  {
    title: 'Tên Video',
    dataIndex: 'video_name',
    key: 'video_name',
    width: 250,
    align: 'left',
  },
  { title: 'Xem Trước', key: 'video', width: 200, align: 'center' },
  { title: 'Thao Tác', key: 'action', width: 200, align: 'center' },
];

const getVideoUrl = (path) => `${BaseURL}/storage/${path}`;

const getVideos = async () => {
  try {
    const response = await api.get('videos/');
    videos.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Lỗi khi lấy danh sách video.');
  }
};

const isModalVisible = ref(false);
const videoIdToDelete = ref(null);

const deleteVideo = (id) => {
  videoIdToDelete.value = id;
  isModalVisible.value = true;
};

const handleOk = async () => {
  try {
    await api.delete(`videos/${videoIdToDelete.value}`);
    message.success('Xóa video thành công');
    getVideos();
  } catch (error) {
    message.error('Lỗi khi xóa video');
  } finally {
    isModalVisible.value = false;
  }
};

const handleCancel = () => {
  isModalVisible.value = false;
};

const isFeaturedModalVisible = ref(false);
const videoIdToFeature = ref(null);

const confirmSetFeatured = (id) => {
  videoIdToFeature.value = id;
  isFeaturedModalVisible.value = true;
};

const setFeaturedVideo = async () => {
  try {
    await api.put(`videos/${videoIdToFeature.value}/set-featured`);
    message.success('Video đặc biệt đã được cập nhật!');
    getVideos();
  } catch (error) {
    message.error('Lỗi khi cập nhật video đặc biệt.');
  } finally {
    isFeaturedModalVisible.value = false;
  }
};

onMounted(() => {
  getVideos();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-videos']);
});
</script>

<style scoped>
/* ========== VIDEOS PAGE WRAPPER ========== */
.videos-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  padding: 80px 20px 60px;
}

.videos-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* ========== PAGE HEADER - OUTSIDE CARD ========== */
.page-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 30px 35px;
  border-radius: 24px 24px 0 0;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.2);
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-subtitle {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
}

.add-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  color: #0c713d;
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.add-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(12, 113, 61, 0.1);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.add-btn:hover::before {
  width: 300px;
  height: 300px;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.add-link {
  color: #0c713d;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  position: relative;
  z-index: 1;
}

/* ========== VIDEOS CARD ========== */
.videos-card {
  background: white;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 10px 40px rgba(12, 113, 61, 0.1);
  border: 1px solid rgba(12, 113, 61, 0.1);
  border-top: none;
  overflow: hidden;
}

/* Override ant-design card styles */
.videos-card :deep(.ant-card-head) {
  display: none;
}

.videos-card :deep(.ant-card-body) {
  padding: 0;
}

/* ========== DESKTOP TABLE VIEW ========== */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

.table-wrapper {
  padding: 10px;
}

.videos-table :deep(.ant-table) {
  border-radius: 12px;
  overflow: hidden;
}

.videos-table :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  padding: 16px 12px;
}

.videos-table :deep(.ant-table-tbody > tr) {
  transition: all 0.3s ease;
}

.videos-table :deep(.ant-table-tbody > tr:hover) {
  background: linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%);
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.1);
}

.videos-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

/* ========== TABLE CELL STYLES ========== */
.index-cell {
  font-weight: 700;
  color: #0c713d;
  font-size: 1.1rem;
}

.featured-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.featured-badge {
  color: #ffd700;
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.name-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
}

.video-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  line-height: 1.4;
}

.episode-number {
  font-size: 0.85rem;
  color: #0c713d;
  font-weight: 500;
  background: #e8f5e9;
  padding: 3px 10px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
}

.video-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-thumbnail {
  width: 150px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.video-thumbnail:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.action-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 18px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  min-width: 85px;
}

.edit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* ========== MOBILE CARD VIEW ========== */
.video-cards {
  display: grid;
  gap: 20px;
  padding: 10px;
}

.video-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(12, 113, 61, 0.1);
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.15);
}

.card-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 2px solid rgba(12, 113, 61, 0.1);
}

.card-number {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0c713d;
}

.featured-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.featured-badge-mobile {
  color: #ffd700;
  font-size: 1.3rem;
  animation: pulse 2s infinite;
}

.card-video {
  width: 100%;
  background: #000;
}

.video-mobile {
  width: 100%;
  height: auto;
  display: block;
}

.card-info {
  padding: 20px;
  background: white;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.card-episode {
  display: inline-block;
  font-size: 0.9rem;
  color: #0c713d;
  font-weight: 600;
  background: #e8f5e9;
  padding: 4px 12px;
  border-radius: 20px;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-top: 2px solid rgba(12, 113, 61, 0.1);
}

.card-btn {
  padding: 16px;
  border: none;
  background: white;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.edit-btn-mobile {
  border-right: 1px solid rgba(12, 113, 61, 0.1);
  color: #0c713d;
}

.edit-btn-mobile:hover {
  background: linear-gradient(135deg, #e8f5e9 0%, #d4edda 100%);
}

.delete-btn-mobile {
  color: #dc3545;
}

.delete-btn-mobile:hover {
  background: linear-gradient(135deg, #ffe6e6 0%, #ffd1d1 100%);
}

.card-btn:active {
  transform: scale(0.98);
}

/* ========== MODAL STYLES ========== */
.modal-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 3rem;
  color: #ff4d4f;
  margin-bottom: 15px;
}

.featured-icon {
  font-size: 3rem;
  color: #ffd700;
  margin-bottom: 15px;
}

.modal-content p {
  font-size: 1.05rem;
  margin: 10px 0;
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
  .videos-wrapper {
    padding: 70px 20px 50px;
  }

  .page-header {
    padding: 25px 30px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .add-btn {
    padding: 10px 24px;
  }

  .add-link {
    font-size: 0.95rem;
  }

  .video-thumbnail {
    width: 130px;
  }

  .action-btn {
    padding: 9px 16px;
    font-size: 0.9rem;
    min-width: 80px;
  }
}

/* Mobile - Switch to Card View */
@media (max-width: 768px) {
  .videos-wrapper {
    padding: 60px 15px 40px;
  }

  .page-header {
    padding: 20px 20px;
    border-radius: 16px 16px 0 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .page-title {
    font-size: 1.5rem;
    gap: 10px;
  }

  .page-subtitle {
    font-size: 0.95rem;
  }

  .add-btn {
    width: 100%;
    padding: 12px 20px;
  }

  .btn-text {
    font-size: 0.95rem;
  }

  .videos-card {
    border-radius: 0 0 16px 16px;
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
  .videos-wrapper {
    padding: 50px 10px 30px;
  }

  .page-header {
    padding: 15px 15px;
  }

  .page-title {
    font-size: 1.3rem;
    gap: 8px;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .add-btn {
    padding: 10px 16px;
  }

  .add-link {
    font-size: 0.9rem;
    gap: 6px;
  }

  .video-cards {
    gap: 16px;
    padding: 5px;
  }

  .card-header-mobile {
    padding: 12px 16px;
  }

  .card-number {
    font-size: 1.1rem;
  }

  .card-info {
    padding: 16px;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-episode {
    font-size: 0.85rem;
    padding: 3px 10px;
  }

  .card-btn {
    padding: 14px;
    font-size: 0.95rem;
  }

  .modal-content {
    padding: 15px 0;
  }

  .warning-icon,
  .featured-icon {
    font-size: 2.5rem;
  }

  .modal-content p {
    font-size: 0.95rem;
  }

  .warning-text {
    font-size: 0.85rem;
  }
}
</style>
