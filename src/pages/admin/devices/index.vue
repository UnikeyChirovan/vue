<template>
  <a-card title="Quản Lý Thiết Bị" style="width: 100%">
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="devices" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <!-- Hiển thị chỉ số thiết bị -->
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <!-- Hiển thị địa chỉ IP -->
            <template v-if="column.key === 'ip_address'">
              <span>{{ record.ip_address }}</span>
            </template>
            <!-- Hiển thị thông tin user agent -->
            <template v-if="column.key === 'user_agent'">
              <span>{{ record.user_agent }}</span>
            </template>
            <!-- Hiển thị nút chuyển -->
            <template v-if="column.key === 'action'">
              <a-button type="primary" @click="openTransferModal(record.id)">
                <i class="fa-solid fa-exchange-alt"></i> Chuyển
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Modal để điền lý do chuyển -->
    <a-modal
      v-model:visible="isModalVisible"
      title="Chuyển vào Blacklist"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>Bạn có chắc chắn muốn chuyển thiết bị này vào blacklist không?</p>
      <textarea v-model="reason" placeholder="Lý do chuyển" :rows="4" style="width: 100%"></textarea>
    </a-modal>
  </a-card>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';

const devices = ref([]);
const isMobile = ref(window.innerWidth < 600);
const scrollOptions = computed(() => {
  return isMobile.value ? { x: 1200 } : { x: 576 };
});

const isModalVisible = ref(false);
const reason = ref('');  // Lý do chuyển
const deviceIdToTransfer = ref(null);

// Cấu hình cột cho bảng
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
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];

// Lấy danh sách thiết bị từ API
const getDevices = async () => {
  try {
    const response = await api.get('/users/device-info');
    devices.value = response.data.device_infos;
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

// Mở modal chuyển thiết bị
const openTransferModal = (id) => {
  deviceIdToTransfer.value = id;
  isModalVisible.value = true;
};

// Gửi yêu cầu chuyển thiết bị vào blacklist
const handleOk = () => {
  if (!reason.value) {
    message.warning('Vui lòng nhập lý do');
    return;
  }

  api
    .post(`/users/transfer-to-blacklist/${deviceIdToTransfer.value}`, { reason: reason.value })
    .then((res) => {
      if (res.status === 200) {
        message.success('Chuyển vào blacklist thành công');
        getDevices();  // Cập nhật lại danh sách thiết bị
      }
    })
    .catch((err) => {
      message.error('Lỗi khi chuyển thiết bị');
    })
    .finally(() => {
      isModalVisible.value = false;
      reason.value = '';  // Reset lý do sau khi chuyển
    });
};

// Hủy chuyển
const handleCancel = () => {
  isModalVisible.value = false;
  reason.value = '';
};

// Khi component được khởi tạo
onMounted(() => {
  getDevices();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
