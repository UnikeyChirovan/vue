<template>
  <a-card title="Quản Lý Chương" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary">
          <router-link :to="{ name: 'admin-stories-create' }">
            <i class="fa-solid fa-plus"></i> Thêm Chương
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="chapters" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <!-- Hiển thị chỉ số chương -->
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <!-- Hiển thị tiêu đề chương -->
            <template v-if="column.key === 'title'">
              <span>{{ record.title }}</span>
            </template>
            <!-- Hiển thị tên tác giả -->
            <template v-if="column.key === 'author'">
              <span>{{ record.author }}</span>
            </template>
            <!-- Hiển thị số thứ tự chương -->
            <template v-if="column.key === 'chapter_number'">
              <span>{{ record.chapter_number }}</span>
            </template>
            <!-- Hiển thị công cụ chỉnh sửa và xóa chương -->
            <template v-if="column.key === 'action'">
              <router-link :to="{ name: 'admin-stories-edit', params: { id: record.id } }">
                <a-button type="primary" class="me-sm-2 me-2 mb-2">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="deleteChapter(record.id)">
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa chương"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>Bạn có chắc chắn muốn xóa chương này không?</p>
    </a-modal>
  </a-card>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
const chapters = ref([]);
const isMobile = ref(window.innerWidth < 600);
const scrollOptions = computed(() => {
  return isMobile.value ? { x: 1200 } : { x: 576 };
});

// Cấu hình cột cho bảng
const columns = [
  {
    title: '#',
    key: 'index',
    width: 50,
    align: 'center',
  },
  {
    title: 'Tiêu Đề',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
  },
  {
    title: 'Tác Giả',
    dataIndex: 'author',
    key: 'author',
    align: 'center',
  },
  {
    title: 'Số Thứ Tự Chương',
    dataIndex: 'chapter_number',
    key: 'chapter_number',
    align: 'center',
  },
  {
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];

// Lấy danh sách các chương từ API
const getChapters = async () => {
  try {
    const response = await api.get('/story/chapters');
    chapters.value = response.data; 
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

const isModalVisible = ref(false);
const chapterIdToDelete = ref(null);

// Hàm xóa chương
const deleteChapter = (id) => {
  chapterIdToDelete.value = id;
  isModalVisible.value = true; 
};

// Xác nhận xóa chương
const handleOk = () => {
  api
    .delete(`/story/chapters/${chapterIdToDelete.value}`) // Đảm bảo đường dẫn đúng
    .then((res) => {
      console.log('dữ liệu', res)
      if (res.status === 204) {
        message.success('Xóa chương thành công');
        getChapters(); 
      }
    })
    .catch((err) => {
      message.error('Lỗi');
    })
    .finally(() => {
      isModalVisible.value = false;
    });
};

// Hủy xóa
const handleCancel = () => {
  isModalVisible.value = false;
};

// Khi component được khởi tạo
onMounted(() => {
  getChapters();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-stories']);
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
