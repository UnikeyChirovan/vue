<template>
  <a-card title="Danh Sách Request Log" style="width: 100%">
    <div class="row">
      <div class="col-12">
        <a-table
          :dataSource="requestLogs"
          :columns="columns"
          :scroll="scrollOptions"
        >
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
            <template v-if="column.key === 'request_count'">
              <span>{{ record.request_count }}</span>
            </template>
            <template v-if="column.key === 'last_request_at'">
              <span>{{ record.last_request_at }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button
                type="primary"
                @click="confirmTransfer(record.id)"
                class="me-sm-2 me-2 mb-2"
              >
                <i class="fa-solid fa-arrow-right me-2"></i> Chuyển
              </a-button>
              <a-button type="primary" danger @click="confirmDelete(record.id)">
                <i class="fa-solid fa-trash me-2"></i> Xóa
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
      <p>Bạn có chắc chắn muốn xóa bản ghi này không?</p>
    </a-modal>
    <a-modal
      v-model:visible="isTransferModalVisible"
      title="Xác nhận chuyển vào blacklist"
      @ok="handleTransfer"
      @cancel="handleTransferCancel"
    >
      <p>
        Bạn có chắc chắn muốn chuyển địa chỉ IP
        <strong>{{ ipToTransfer }}</strong> vào blacklist không?
      </p>
    </a-modal>
    <a-modal
      v-model:visible="isModalVisibleAll"
      title="Xác nhận xóa tất cả"
      @ok="handleDeleteAll"
      @cancel="handleCancelAll"
    >
      <p>Bạn có chắc chắn muốn xóa tất cả bản ghi không?</p>
    </a-modal>
    <a-button type="primary" danger @click="confirmDeleteAll" class="mt-2">
      <i class="fa-solid fa-trash me-2"></i> Xóa Tất Cả
    </a-button>
  </a-card>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const requestLogs = ref([]);
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
    title: 'Số Lượng Yêu Cầu',
    dataIndex: 'request_count',
    key: 'request_count',
    align: 'center',
  },
  {
    title: 'Thời Gian Yêu Cầu Cuối',
    dataIndex: 'last_request_at',
    key: 'last_request_at',
    align: 'center',
  },
  {
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];

const isModalVisible = ref(false);
const isModalVisibleAll = ref(false);
const isTransferModalVisible = ref(false);
const idToDelete = ref(null);
const idToTransfer = ref(null);
const ipToTransfer = ref('');

const getRequestLogs = async () => {
  try {
    const response = await api.get('/users/request-logs');
    requestLogs.value = response.data.request_logs;
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

const confirmTransfer = (id) => {
  const record = requestLogs.value.find((log) => log.id === id);
  if (record) {
    idToTransfer.value = id;
    ipToTransfer.value = record.ip_address;
    isTransferModalVisible.value = true;
  }
};

const handleTransfer = async () => {
  try {
    const response = await api.post(
      `users/transfer-from-request-log/${idToTransfer.value}`
    );
    message.success(response.data.message);
    getRequestLogs();
  } catch (error) {
    message.error('Lỗi khi chuyển vào blacklist');
  } finally {
    isTransferModalVisible.value = false;
  }
};
const confirmDelete = (id) => {
  idToDelete.value = id;
  isModalVisible.value = true;
};
const handleDelete = () => {
  api
    .delete(`users/request-log/${idToDelete.value}`)
    .then((res) => {
      if (res.status === 200) {
        message.success('Xóa bản ghi thành công');
        getRequestLogs();
      }
    })
    .catch((err) => {
      message.error('Lỗi khi xóa');
    })
    .finally(() => {
      isModalVisible.value = false;
    });
};

const confirmDeleteAll = () => {
  isModalVisibleAll.value = true;
};

const handleDeleteAll = () => {
  api
    .delete('users/request-logs')
    .then((res) => {
      if (res.status === 200) {
        message.success('Đã xóa tất cả bản ghi');
        getRequestLogs();
      }
    })
    .catch((err) => {
      message.error('Lỗi khi xóa tất cả');
    })
    .finally(() => {
      isModalVisibleAll.value = false;
    });
};
const handleCancel = () => {
  isModalVisible.value = false;
};
const handleCancelAll = () => {
  isModalVisibleAll.value = false;
};
const handleTransferCancel = () => {
  isTransferModalVisible.value = false;
};
onMounted(() => {
  getRequestLogs();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-requests']);
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
