<template>
  <a-card title="Danh Sách Blacklist" style="width: 100%">
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="blacklist" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'ip_address'">
              <span>{{ record.ip_address }}</span>
            </template>
            <template v-if="column.key === 'user_agent'">
              <span>{{ record.user_agent }}</span>
            </template>
            <template v-if="column.key === 'reason'">
              <span>{{ record.reason }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="primary" danger @click="confirmDelete(record.id)">
                <i class="fa-solid fa-trash"></i> Xóa
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa"
      @ok="handleDelete"
      @cancel="handleCancel"
    >
      <p>Bạn có chắc chắn muốn xóa mục này khỏi blacklist không?</p>
    </a-modal>
  </a-card>
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
.container {
  max-width: 800px;
}
</style>
