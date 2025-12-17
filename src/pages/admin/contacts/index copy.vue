<template>
  <div class="contacts-wrapper">
    <a-card class="contacts-card">
      <template #title>
        <div class="card-header-content">
          <div class="header-left">
            <i class="fa-solid fa-envelope header-icon"></i>
            <span class="header-title">Danh Sách liên lạc</span>
          </div>
        </div>
      </template>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="contacts"
          :columns="columns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} liên lạc`,
          }"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'contacted_at'">
              <span class="time-cell">{{ record.contacted_at }}</span>
            </template>
            <template v-if="column.key === 'message'">
              <n-ellipsis style="max-width: 240px" class="message-cell">{{
                record.message
              }}</n-ellipsis>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{
                    name: 'admin-contacts-reply',
                    params: { id: record.id },
                    query: { email: record.email, message: record.message },
                  }"
                >
                  <a-button type="primary" class="reply-btn">
                    <i class="fa-solid fa-reply"></i>
                    <span class="btn-text">Phản hồi</span>
                  </a-button>
                </router-link>
                <a-button
                  type="primary"
                  danger
                  class="delete-btn"
                  @click="deleteContact(record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span class="btn-text">Xóa</span>
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view">
        <div class="contacts-cards-container">
          <div
            v-for="(contact, index) in contacts"
            :key="contact.id"
            class="contact-card"
          >
            <div class="contact-card-header">
              <div class="contact-number">
                <i class="fa-solid fa-hashtag"></i>
                {{ index + 1 }}
              </div>
              <div class="contact-time">
                <i class="fa-solid fa-clock"></i>
                {{ contact.contacted_at }}
              </div>
            </div>

            <div class="contact-card-body">
              <div class="contact-info-row">
                <i class="fa-solid fa-user info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Họ tên:</span>
                  <span class="info-value">{{ contact.name }}</span>
                </div>
              </div>

              <div class="contact-info-row">
                <i class="fa-solid fa-envelope info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Email:</span>
                  <span class="info-value email-text">{{ contact.email }}</span>
                </div>
              </div>

              <div class="contact-info-row">
                <i class="fa-solid fa-heading info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Tiêu đề:</span>
                  <span class="info-value">{{ contact.title }}</span>
                </div>
              </div>

              <div class="contact-info-row">
                <i class="fa-solid fa-message info-icon"></i>
                <div class="info-content">
                  <span class="info-label">Nội dung:</span>
                  <span class="info-value message-text">{{
                    contact.message
                  }}</span>
                </div>
              </div>
            </div>

            <div class="contact-card-actions">
              <router-link
                :to="{
                  name: 'admin-contacts-reply',
                  params: { id: contact.id },
                  query: { email: contact.email, message: contact.message },
                }"
                style="flex: 1"
              >
                <a-button type="primary" class="reply-btn-mobile">
                  <i class="fa-solid fa-reply"></i>
                  <span>Phản hồi</span>
                </a-button>
              </router-link>
              <a-button
                type="primary"
                danger
                class="delete-btn-mobile"
                @click="deleteContact(contact.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa</span>
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- Delete Modal -->
    <a-modal
      v-model:visible="isModalVisible"
      title="Xác nhận xóa liên lạc"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="Xác nhận"
      cancelText="Hủy"
      class="delete-modal"
    >
      <div class="modal-content">
        <i class="fa-solid fa-circle-exclamation warning-icon"></i>
        <p>Bạn có chắc chắn muốn xóa liên lạc này không?</p>
      </div>
    </a-modal>
  </div>
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
    title: 'Thời gian liên lạc',
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

const getContacts = async () => {
  try {
    const response = await api.get('/noauth/contacts');
    contacts.value = response.data;
  } catch (error) {
    message.error('Không thể tải danh sách liên lạc');
  }
};

const isModalVisible = ref(false);
const contactIdToDelete = ref(null);

const deleteContact = (id) => {
  contactIdToDelete.value = id;
  isModalVisible.value = true;
};

const handleOk = () => {
  api
    .delete(`/noauth/contacts/${contactIdToDelete.value}`)
    .then((res) => {
      if (res.status === 200) {
        message.success('Xóa liên lạc thành công');
        getContacts();
      }
    })
    .catch((err) => {
      message.error('Lỗi xóa liên lạc');
    })
    .finally(() => {
      isModalVisible.value = false;
    });
};

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

<style scoped>
/* ========== WRAPPER ========== */
.contacts-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

/* ========== CARD STYLING ========== */
.contacts-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
}

.contacts-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-bottom: none;
  padding: 24px 32px;
}

.contacts-card :deep(.ant-card-head-title) {
  padding: 0;
}

.contacts-card :deep(.ant-card-body) {
  padding: 32px;
}

/* ========== CARD HEADER ========== */
.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.table-container :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: none;
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
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.index-cell {
  font-weight: 600;
  color: #0c713d;
}

.time-cell {
  font-size: 0.9rem;
  color: #666;
}

.message-cell {
  color: #555;
  font-size: 0.9rem;
}

/* ========== ACTION BUTTONS ========== */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.reply-btn,
.delete-btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 6px 16px;
  height: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.reply-btn {
  background: #0c713d;
  border-color: #0c713d;
}

.reply-btn:hover {
  background: #0a5a31;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

/* ========== MOBILE CARD VIEW ========== */
.contacts-cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-card {
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contact-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.15);
  border-color: rgba(12, 113, 61, 0.3);
}

.contact-card-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-number {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-time {
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

.contact-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-info-row {
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

.message-text {
  font-weight: 400;
  color: #555;
  line-height: 1.5;
}

.contact-card-actions {
  padding: 12px 16px;
  background: #f8f8f8;
  display: flex;
  gap: 10px;
  border-top: 1px solid rgba(12, 113, 61, 0.1);
}

.reply-btn-mobile,
.delete-btn-mobile {
  flex: 1;
  border-radius: 10px;
  font-weight: 600;
  padding: 10px 16px;
  height: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
}

.reply-btn-mobile {
  background: #0c713d;
  border-color: #0c713d;
  width: 100%;
}

.reply-btn-mobile:hover {
  background: #0a5a31;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.delete-btn-mobile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

/* ========== MODAL STYLING ========== */
.delete-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #ff4d4f 0%, #d32f2f 100%);
  border-bottom: none;
  border-radius: 16px 16px 0 0;
}

.delete-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

.delete-modal :deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
}

.modal-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 3rem;
  color: #ff4d4f;
  margin-bottom: 16px;
}

.modal-content p {
  font-size: 1.05rem;
  margin-bottom: 8px;
  color: #333;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .contacts-wrapper {
    padding: 70px 16px 50px;
  }

  .contacts-card :deep(.ant-card-head) {
    padding: 20px 24px;
  }

  .contacts-card :deep(.ant-card-body) {
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
  .contacts-wrapper {
    padding: 60px 12px 40px;
  }

  .contacts-card {
    border-radius: 16px;
  }

  .contacts-card :deep(.ant-card-head) {
    padding: 18px 20px;
  }

  .contacts-card :deep(.ant-card-body) {
    padding: 20px 16px;
  }

  .header-title {
    font-size: 1.15rem;
  }

  .header-icon {
    font-size: 1.15rem;
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
  .contacts-wrapper {
    padding: 50px 8px 30px;
  }

  .contacts-card {
    border-radius: 12px;
  }

  .contacts-card :deep(.ant-card-head) {
    padding: 16px 16px;
  }

  .contacts-card :deep(.ant-card-body) {
    padding: 16px 12px;
  }

  .header-title {
    font-size: 1.05rem;
  }

  .header-icon {
    font-size: 1.05rem;
  }

  .contact-card {
    border-radius: 12px;
  }

  .contact-card-header {
    padding: 12px 14px;
  }

  .contact-number {
    font-size: 0.9rem;
  }

  .contact-time {
    font-size: 0.8rem;
    padding: 3px 10px;
  }

  .contact-card-body {
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

  .contact-card-actions {
    padding: 10px 14px;
    gap: 8px;
  }

  .reply-btn-mobile,
  .delete-btn-mobile {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
}
</style>
