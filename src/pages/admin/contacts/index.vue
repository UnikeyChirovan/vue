<template>
  <a-card title="Danh sách Liên Hệ" style="width: 100%">
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="contacts" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'contacted_at'">
              <span>{{ record.contacted_at }}</span>
            </template>
            <template v-if="column.key === 'message'">
              <n-ellipsis style="max-width: 240px">{{ record.message }}</n-ellipsis>
            </template>
            <template v-if="column.key === 'action'">
              <router-link
                :to="{ name: 'admin-contacts-reply', params: { id: record.id }, query: { email: record.email, message: record.message } }"
              >
                <a-button type="primary" class="me-sm-2 me-2 mb-2">
                  Phản hồi
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="deleteContact(record.id)">
                Xóa
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-card>

  <!-- Modal Xóa -->
  <a-modal
    v-model:visible="isModalVisible"
    title="Xác nhận xóa liên hệ"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>Bạn có chắc chắn muốn xóa liên hệ này không?</p>
  </a-modal>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { NEllipsis } from 'naive-ui'; 
import { useMenu } from '../../../stores/use-menu';
const contacts = ref([]);
const isMobile = ref(window.innerWidth < 600);
const scrollOptions = computed(() => {
  return isMobile.value ? { x: 1200 } : { x: 576 };
});

// Định nghĩa cột cho bảng
const columns = [
  {
    title: '#',
    key: 'index',
    width: 50,
    align: 'center',
  },
  {
    title: 'Họ Tên',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    align: 'center',
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
  },
  {
    title: 'Nội dung',
    dataIndex: 'message',
    key: 'message',
    align: 'center',
  },
  {
    title: 'Thời gian Liên hệ',
    dataIndex: 'contacted_at',
    key: 'contacted_at',
    align: 'center',
  },
  {
    title: 'Công cụ',
    key: 'action',
    align: 'center',
  },
];

// Hàm lấy danh sách liên hệ từ server
const getContacts = async () => {
  try {
    const response = await api.get('/noauth/contacts');
    contacts.value = response.data;
  } catch (error) {
    message.error('Không thể tải danh sách liên hệ');
  }
};

// Modal xác nhận xóa
const isModalVisible = ref(false);
const contactIdToDelete = ref(null);

const deleteContact = (id) => {
  contactIdToDelete.value = id;
  isModalVisible.value = true; 
};

// Xác nhận xóa liên hệ
const handleOk = () => {
  api
    .delete(`/noauth/contacts/${contactIdToDelete.value}`)
    .then((res) => {
      if (res.status === 200) {
        message.success('Xóa liên hệ thành công');
        getContacts();
      }
    })
    .catch((err) => {
      message.error('Lỗi xóa liên hệ');
    })
    .finally(() => {
      isModalVisible.value = false;
    });
};

// Hủy bỏ xóa
const handleCancel = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  getContacts();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-contacts']);
});
</script>
