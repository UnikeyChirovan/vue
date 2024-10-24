<template>
  <a-card title="Quản Lý Danh Mục" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary">
          <router-link :to="{ name: 'admin-categories-create', params: { lastIndex: categories.length } }">
            <i class="fa-solid fa-plus"></i> Thêm Danh Mục
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="categories" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'name'">
              <span>{{ record.name }}</span>
            </template>
            <template v-if="column.key === 'code'">
              <span>{{ record.code }}</span> <!-- Hiển thị mã số -->
            </template>
            <template v-if="column.key === 'action'">
              <router-link :to="{ name: 'admin-categories-edit', params: { id: record.id } }">
                <a-button type="primary" class="me-sm-2 me-2 mb-2">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="deleteCategory(record.id)">
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa danh mục"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
    </a-modal>
  </a-card>
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
    title: 'Mã Số', // Thêm cột mã số
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
    const response = await api.get('/categories'); // Endpoint để lấy danh mục
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
    .delete(`/categories/${categoryIdToDelete.value}`) // Endpoint để xóa danh mục
    .then((res) => {
      if (res.status === 200) {
        message.success('Xóa danh mục thành công');
        getCategories(); // Cập nhật danh sách danh mục sau khi xóa
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
  getCategories(); // Gọi hàm lấy danh mục khi component được mount
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600; // Theo dõi kích thước màn hình
  });
  useMenu().onSelectedKey(['admin-categories']);
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
