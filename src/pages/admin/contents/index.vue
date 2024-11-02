<template>
  <a-card title="Quản Lý Phần" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary">
          <router-link :to="{ name: 'admin-contents-create', params: { lastIndex: sections.length } }">
            <i class="fa-solid fa-plus"></i> Thêm Phần
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="sections" :columns="columns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'title'">
              <span>{{ record.title }}</span>
            </template>
            <template v-if="column.key === 'section_number'">
              <span>{{ record.section_number }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <router-link :to="{ name: 'admin-contents-edit', params: { id: record.id } }">
                <a-button type="primary" class="me-sm-2 me-2 mb-2">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="deleteSection(record.id)">
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa phần"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>Bạn có chắc chắn muốn xóa phần này không?</p>
    </a-modal>
  </a-card>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
const sections = ref([]);
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
    title: 'Số Phần',
    dataIndex: 'section_number',
    key: 'section_number',
    align: 'center',
  },
  {
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];
const getSections = async () => {
  try {
    const response = await api.get('/sections'); // Đổi endpoint thành sections
    sections.value = response.data.sections; 
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

const isModalVisible = ref(false);
const sectionIdToDelete = ref(null);
const deleteSection = (id) => {
  sectionIdToDelete.value = id;
  isModalVisible.value = true; 
};
const handleOk = () => {
  api
    .delete(`/sections/${sectionIdToDelete.value}`) // Đổi endpoint thành sections
    .then((res) => {
      if (res.status === 204) {
        message.success('Xóa phần thành công');
        getSections(); 
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
  getSections();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-contents']);
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
