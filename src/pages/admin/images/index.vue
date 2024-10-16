<template>
  <a-card title="Quản Lý Hình Nền" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary">
          <router-link :to="{ name: 'admin-images-create' }">
            <i class="fa-solid fa-plus"></i> Thêm Hình Nền
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="backgrounds" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <!-- Hiển thị chỉ số hình nền -->
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <!-- Hiển thị tên hình nền -->
            <template v-if="column.key === 'background_image_name'">
              <span>{{ record.background_image_name }}</span>
            </template>
            <!-- Hiển thị hình ảnh -->
            <template v-if="column.key === 'background_image'">
              <img :src="getImageUrl(record.background_image_path)" alt="Background" style="width: 100px; height: auto;" />
            </template>
            <!-- Hiển thị công cụ chỉnh sửa và xóa -->
            <template v-if="column.key === 'action'">
              <router-link :to="{ name: 'admin-images-edit', params: { id: record.id } }">
                <a-button type="primary" class="me-sm-2 me-2 mb-2">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="deleteBackground(record.id)">
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <a-modal v-model:visible="isModalVisible" title="Xác nhận xóa hình nền" @ok="handleOk" @cancel="handleCancel">
      <p>Bạn có chắc chắn muốn xóa hình nền này không?</p>
    </a-modal>
  </a-card>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

// Dữ liệu của danh sách hình nền
const backgrounds = ref([]);
const isMobile = ref(window.innerWidth < 600);
const scrollOptions = computed(() => {
  return isMobile.value ? { x: 1200 } : { x: 576 };
});
const BaseURL = 'http://127.0.0.1:8000'
// Cấu hình cột cho bảng
const columns = [
  {
    title: '#',
    key: 'index',
    width: 50,
    align: 'center',
  },
  {
    title: 'Tên Hình Nền',
    dataIndex: 'background_image_name',
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

// Lấy URL của hình ảnh từ đường dẫn
const getImageUrl = (path) => {
  return `${BaseURL}/storage/${path}`;
};

// Lấy danh sách hình nền từ API
const getBackgrounds = async () => {
  try {
    const response = await api.get('/story/backgrounds');
    backgrounds.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Lỗi khi lấy danh sách hình nền.');
  }
};

// Quản lý Modal và ID hình nền cần xóa
const isModalVisible = ref(false);
const backgroundIdToDelete = ref(null);

// Xóa hình nền
const deleteBackground = (id) => {
  backgroundIdToDelete.value = id;
  isModalVisible.value = true; // Hiển thị modal xác nhận
};

// Xác nhận xóa hình nền
const handleOk = async () => {
  try {
    await api.delete(`/story/backgrounds/${backgroundIdToDelete.value}`);
    message.success('Xóa hình nền thành công');
    getBackgrounds(); // Lấy lại danh sách sau khi xóa
  } catch (error) {
    message.error('Lỗi khi xóa hình nền');
  } finally {
    isModalVisible.value = false;
  }
};

// Hủy xóa
const handleCancel = () => {
  isModalVisible.value = false;
};

// Khi component được khởi tạo
onMounted(() => {
  getBackgrounds();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-images']);
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
