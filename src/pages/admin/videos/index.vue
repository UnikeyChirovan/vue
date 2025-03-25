<template>
  <a-card title="Quản Lý Video" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary">
          <router-link :to="{ name: 'admin-videos-create' }">
            <i class="fa-solid fa-plus"></i> Thêm Video
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="videos" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'featured'">
              <a-radio :checked="!!record.is_featured" @change="confirmSetFeatured(record.id)"></a-radio>
            </template>
            <template v-if="column.key === 'video_name'">
              <span>{{ record.video_name }}</span>
            </template>
            <template v-if="column.key === 'video'">
              <video :src="getVideoUrl(record.video_path)" controls style="width: 150px; height: auto;"></video>
            </template>
            <template v-if="column.key === 'action'">
              <router-link :to="{ name: 'admin-videos-edit', params: { id: record.id } }">
                <a-button type="primary" class="me-sm-2 me-2 mb-2">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="deleteVideo(record.id)">
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal v-model:visible="isModalVisible" title="Xác nhận xóa video" @ok="handleOk" @cancel="handleCancel">
      <p>Bạn có chắc chắn muốn xóa video này không?</p>
    </a-modal>
    <a-modal v-model:visible="isFeaturedModalVisible" title="Xác nhận" @ok="setFeaturedVideo" @cancel="isFeaturedModalVisible = false">
      <p>Bạn có chắc chắn muốn đặt video này làm video đặc biệt?</p>
    </a-modal>
  </a-card>
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
  { title: '#', key: 'index', width: 50, align: 'center' },
  { title: 'Push', key: 'featured', align: 'center' },
  { title: 'Tên Video', dataIndex: 'video_name', key: 'video_name', align: 'center' },
  { title: 'Video', key: 'video', align: 'center' },
  { title: 'Công Cụ', key: 'action', align: 'center' }
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
.container {
  max-width: 800px;
}
</style>