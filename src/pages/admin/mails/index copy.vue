<template>
  <a-card title="Danh Sách Email Đăng Ký" style="width: 100%">
    <div class="d-flex justify-content-end mb-2">
      <a-button type="primary" @click="exportPDF">
        <i class="fa-solid fa-file-pdf"></i> Xuất PDF
      </a-button>
    </div>
    <a-table
      :dataSource="emails"
      :columns="columns"
      :scroll="scrollOptions"
      bordered
    >
      <template #bodyCell="{ column, index, record }">
        <template v-if="column.key === 'index'">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-if="column.key === 'email'">
          <span>{{ record.email }}</span>
        </template>
        <template v-if="column.key === 'created_at'">
          <span>{{ formatDate(record.created_at) }}</span>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportPDF = () => {
  const doc = new jsPDF();

  // Tiêu đề
  doc.setFontSize(16);
  doc.text('Email Subscription List', 14, 15);

  // Dữ liệu bảng
  const tableData = emails.value.map((item, index) => [
    index + 1,
    item.email,
    dayjs(item.created_at).format('DD/MM/YYYY HH:mm'),
  ]);

  autoTable(doc, {
    startY: 20,
    head: [['#', 'Email', 'Subscribed At']],
    body: tableData,
    theme: 'grid', // Kiểu bảng có đường kẻ
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [22, 160, 133] }, // Màu header (xanh ngọc)
  });

  // Xuất file
  doc.save('danh-sach-email.pdf');
};

const emails = ref([]);
const isMobile = ref(window.innerWidth < 600);
const scrollOptions = computed(() => {
  return isMobile.value ? { x: 800 } : { x: 400 };
});
const columns = [
  { title: '#', key: 'index', width: 50, align: 'center' },
  { title: 'Email', key: 'email', align: 'center' },
  { title: 'Ngày Đăng Ký', key: 'created_at', align: 'center' },
];

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const getEmails = async () => {
  try {
    const response = await api.get('/newsletter/emails');
    emails.value = response.data.emails;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getEmails();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-mails']);
});
</script>

<style scoped>
::v-deep(.ant-table) {
  border: 1px solid #ddd;
}

::v-deep(.ant-table-thead > tr > th) {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd !important;
  text-align: center;
}

::v-deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #ddd !important;
  text-align: center;
}
</style>
