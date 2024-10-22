<template>
  <a-card title="Quản Lý Thông Báo" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary">
          <router-link :to="{ name: 'admin-infos-create' }">
            <i class="fa-solid fa-plus"></i> Thêm Thông Báo
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="notifications" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'title'">
              <span>{{ record.title }}</span>
            </template>
            <template v-if="column.key === 'content'">
              <span>{{ record.content }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="primary" danger @click="deleteNotification(record.id)">
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa thông báo"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>Bạn có chắc chắn muốn xóa thông báo này không?</p>
    </a-modal>
  </a-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const notifications = ref([]);
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
    title: 'Tiêu Đề',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
  },
  {
    title: 'Nội Dung',
    dataIndex: 'content',
    key: 'content',
    align: 'center',
  },
  {
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];

const getNotifications = async () => {
  try {
    const response = await api.get('/newsletter/notifications');
    notifications.value = response.data; 
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

const isModalVisible = ref(false);
const notificationIdToDelete = ref(null);
const deleteNotification = (id) => {
  notificationIdToDelete.value = id;
  isModalVisible.value = true; 
};

const handleOk = () => {
  api
    .delete(`/newsletter/notifications/${notificationIdToDelete.value}`) 
    .then((res) => {
      if (res.status === 200) {
        message.success('Xóa thông báo thành công');
        getNotifications(); 
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
  getNotifications();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
    useMenu().onSelectedKey(['admin-infos']);
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
