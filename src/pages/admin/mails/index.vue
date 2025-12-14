<template>
  <div class="email-wrapper">
    <a-card class="email-card">
      <template #title>
        <div class="card-header-content">
          <div class="header-left">
            <i class="fa-solid fa-envelope-open-text header-icon"></i>
            <span class="header-title">Danh Sách Email Đăng Ký</span>
          </div>
          <div class="header-right">
            <a-button type="primary" class="export-btn" @click="exportPDF">
              <i class="fa-solid fa-file-pdf"></i>
              <span class="btn-text">Xuất PDF</span>
            </a-button>
          </div>
        </div>
      </template>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="emails"
          :columns="columns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} email`,
          }"
          bordered
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'email'">
              <span class="email-cell">{{ record.email }}</span>
            </template>
            <template v-if="column.key === 'created_at'">
              <span class="date-cell">{{ formatDate(record.created_at) }}</span>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view">
        <div class="emails-cards-container">
          <div
            v-for="(email, index) in emails"
            :key="email.id"
            class="email-card-item"
          >
            <div class="card-item-header">
              <div class="item-number">
                <i class="fa-solid fa-hashtag"></i>
                {{ index + 1 }}
              </div>
              <div class="subscribed-badge">
                <i class="fa-solid fa-check-circle"></i>
                Đã đăng ký
              </div>
            </div>

            <div class="card-item-body">
              <div class="item-info-row">
                <i class="fa-solid fa-at info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Email:</span>
                  <span class="info-value email-text">{{ email.email }}</span>
                </div>
              </div>

              <div class="item-info-row">
                <i class="fa-solid fa-calendar-days info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Ngày đăng ký:</span>
                  <span class="info-value">{{
                    formatDate(email.created_at)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    theme: 'grid',
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [12, 113, 61] },
  });

  doc.save('danh-sach-email.pdf');
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
/* ========== WRAPPER ========== */
.email-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

/* ========== CARD STYLING ========== */
.email-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
}

.email-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-bottom: none;
  padding: 24px 32px;
}

.email-card :deep(.ant-card-head-title) {
  padding: 0;
}

.email-card :deep(.ant-card-body) {
  padding: 32px;
}

/* ========== CARD HEADER ========== */
.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 1.5rem;
  color: white;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.export-btn {
  background: white;
  border: none;
  border-radius: 12px;
  padding: 8px 20px;
  height: auto;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0c713d;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: #f0f0f0;
  color: #0c713d;
}

/* ========== DESKTOP TABLE VIEW ========== */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

.table-container {
  border-radius: 16px;
  overflow: hidden;
  background: white;
}

.table-container :deep(.ant-table) {
  border: 1px solid #e0e0e0;
}

.table-container :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 2px solid #0a5a31 !important;
  padding: 16px 12px;
}

.table-container :deep(.ant-table-tbody > tr) {
  transition: all 0.3s ease;
}

.table-container :deep(.ant-table-tbody > tr:hover) {
  background: rgba(12, 113, 61, 0.05);
}

.table-container :deep(.ant-table-tbody > tr > td) {
  padding: 16px 12px;
  font-size: 0.95rem;
  border-bottom: 1px solid #e0e0e0 !important;
  vertical-align: middle;
}

.index-cell {
  font-weight: 600;
  color: #0c713d;
}

.email-cell {
  font-weight: 600;
  color: #333;
}

.date-cell {
  font-size: 0.9rem;
  color: #666;
}

/* ========== MOBILE CARD VIEW ========== */
.emails-cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.email-card-item {
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.email-card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.15);
  border-color: rgba(12, 113, 61, 0.3);
}

.card-item-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-number {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.subscribed-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-item-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  color: #0c713d;
  font-size: 1.1rem;
  min-width: 24px;
  margin-top: 2px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.info-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
  word-break: break-word;
}

.email-text {
  color: #0c713d;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .email-wrapper {
    padding: 70px 16px 50px;
  }

  .email-card :deep(.ant-card-head) {
    padding: 20px 24px;
  }

  .email-card :deep(.ant-card-body) {
    padding: 24px;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .header-icon {
    font-size: 1.3rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .email-wrapper {
    padding: 60px 12px 40px;
  }

  .email-card {
    border-radius: 16px;
  }

  .email-card :deep(.ant-card-head) {
    padding: 18px 20px;
  }

  .email-card :deep(.ant-card-body) {
    padding: 20px 16px;
  }

  .card-header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
  }

  .header-title {
    font-size: 1.15rem;
  }

  .header-icon {
    font-size: 1.15rem;
  }

  .export-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 20px;
  }

  .btn-text {
    font-size: 0.9rem;
  }

  /* Hide table, show cards */
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .email-wrapper {
    padding: 50px 8px 30px;
  }

  .email-card {
    border-radius: 12px;
  }

  .email-card :deep(.ant-card-head) {
    padding: 16px 16px;
  }

  .email-card :deep(.ant-card-body) {
    padding: 16px 12px;
  }

  .header-title {
    font-size: 1.05rem;
  }

  .header-icon {
    font-size: 1.05rem;
  }

  .export-btn {
    padding: 8px 16px;
    border-radius: 10px;
  }

  .btn-text {
    font-size: 0.85rem;
  }

  .email-card-item {
    border-radius: 12px;
  }

  .card-item-header {
    padding: 12px 14px;
  }

  .item-number {
    font-size: 0.9rem;
  }

  .subscribed-badge {
    font-size: 0.8rem;
    padding: 3px 10px;
  }

  .card-item-body {
    padding: 14px;
    gap: 10px;
  }

  .info-icon {
    font-size: 1rem;
    min-width: 20px;
  }

  .info-label {
    font-size: 0.75rem;
  }

  .info-value {
    font-size: 0.88rem;
  }
}
</style>
