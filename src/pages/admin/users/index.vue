<template>
  <a-card title="Tài Khoản" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary">
          <router-link :to="{ name: 'admin-users-create' }">
            <i class="fa-solid fa-plus"></i>
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="users" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'status'">
              <span
                :class="record.status_id === 1 ? 'text-primary' : 'text-danger'"
                >{{ record.status }}</span
              >
            </template>
            <template v-if="column.key === 'action'">
              <router-link
                :to="{ name: 'admin-users-edit', params: { id: record.id } }"
              >
                <a-button type="primary" class="me-sm-2 me-2 mb-2">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="deleteUsers(record.id)">
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-card>
  <a-modal
    v-model:visible="isModalVisible"
    title="Xác nhận xóa tài khoản"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>Bạn có chắc chắn muốn xóa tài khoản này không?</p>
  </a-modal>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import axiosInstance from '../../../axiosInterceptor';
const users = ref([]);
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
    title: 'Avatar',
    key: 'avatar',
    align: 'center',
    responsive: ['sm'],
  },
  {
    title: 'Tài khoản',
    dataIndex: 'username',
    key: 'username',
    sorter: (a, b) => a.username.length - b.username.length,
    ellipsis: true,
    align: 'center',
  },
  {
    title: 'Họ Tên',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Biệt Danh',
    dataIndex: 'nickname',
    key: 'nickname',
    align: 'center',
  },
  {
    title: 'Phòng ban',
    dataIndex: 'departments',
    key: 'departments',
    align: 'center',
  },
  // {
  //   title: 'Vai trò',
  //   key: 'roles',
  //   align: 'center',
  //   responsive: ['md'],
  // },
  {
    title: 'Tình trạng',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: 'Công cụ',
    key: 'action',
    // fixed: isMobile ? 'none' : 'right',
    // width: isMobile ? 100 : 150,
    align: 'center',
  },
];
const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/auth/users');
    users.value = response.data;
  } catch (error) {
    console.error(error);
    if(error.response.status===429){
      message.warning(error.response.data.message)
    }
  }
};
const isModalVisible = ref(false);
const userIdToDelete = ref(null);

const deleteUsers = (id) => {
  userIdToDelete.value = id;
  isModalVisible.value = true; 
};

const handleOk = () => {
  axiosInstance
    .delete(`/auth/users/${userIdToDelete.value}`)
    .then((res) => {
      if (res.status == 200) {
        message.success('Xóa tài khoản thành công');
        getUsers();
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
  getUsers();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-users']);
});
</script>
