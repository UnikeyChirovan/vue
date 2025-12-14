<template>
  <div class="stories-management-wrapper">
    <a-card class="modern-card" title="Quản Lý Chương">
      <div class="card-header-actions">
        <a-button type="primary" size="large" class="add-chapter-btn">
          <router-link
            :to="{
              name: 'admin-stories-create',
              params: { lastIndex: chapters.length },
            }"
          >
            <i class="fa-solid fa-plus"></i> Thêm Chương Mới
          </router-link>
        </a-button>
      </div>

      <!-- Desktop/Tablet Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="chapters"
          :columns="columns"
          :scroll="scrollOptions"
          :pagination="{ pageSize: 10, showSizeChanger: true }"
          class="modern-table"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-badge">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'title'">
              <span class="chapter-title">{{ record.title }}</span>
            </template>
            <template v-if="column.key === 'author'">
              <span class="author-name">{{ record.author }}</span>
            </template>
            <template v-if="column.key === 'chapter_number'">
              <span class="chapter-number"
                >Chương {{ record.chapter_number }}</span
              >
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{
                    name: 'admin-stories-edit',
                    params: { id: record.id },
                  }"
                >
                  <a-button type="primary" class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a-button>
                </router-link>
                <a-button
                  type="primary"
                  danger
                  class="delete-btn"
                  @click="deleteChapter(record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view">
        <div class="chapters-grid">
          <div
            v-for="(chapter, index) in chapters"
            :key="chapter.id"
            class="chapter-card"
          >
            <div class="chapter-card-header">
              <span class="mobile-index-badge">{{ index + 1 }}</span>
              <span class="mobile-chapter-number"
                >Chương {{ chapter.chapter_number }}</span
              >
            </div>

            <div class="chapter-card-body">
              <h3 class="mobile-chapter-title">{{ chapter.title }}</h3>
              <p class="mobile-author-name">
                <i class="fa-solid fa-user-pen"></i> {{ chapter.author }}
              </p>
            </div>

            <div class="chapter-card-actions">
              <router-link
                :to="{ name: 'admin-stories-edit', params: { id: chapter.id } }"
                class="mobile-action-link"
              >
                <a-button type="primary" class="mobile-edit-btn">
                  <i class="fa-solid fa-pen-to-square"></i> Sửa
                </a-button>
              </router-link>
              <a-button
                type="primary"
                danger
                class="mobile-delete-btn"
                @click="deleteChapter(chapter.id)"
              >
                <i class="fa-solid fa-trash"></i> Xóa
              </a-button>
            </div>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div v-if="chapters.length > 0" class="mobile-pagination">
          <p class="pagination-text">Tổng cộng: {{ chapters.length }} chương</p>
        </div>
      </div>

      <a-modal
        v-model:visible="isModalVisible"
        title="Xác nhận xóa chương"
        @ok="handleOk"
        @cancel="handleCancel"
        okText="Xóa"
        cancelText="Hủy"
        class="delete-modal"
      >
        <p class="modal-text">
          <i class="fa-solid fa-exclamation-triangle"></i>
          Bạn có chắc chắn muốn xóa chương này không? Hành động này không thể
          hoàn tác.
        </p>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';
import { onMounted, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';

const chapters = ref([]);
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
    title: 'Tác Giả',
    dataIndex: 'author',
    key: 'author',
    align: 'center',
  },
  {
    title: 'Chương',
    dataIndex: 'chapter_number',
    key: 'chapter_number',
    align: 'center',
  },
  {
    title: 'Công Cụ',
    key: 'action',
    align: 'center',
  },
];

const getChapters = async () => {
  try {
    const response = await api.get('/story/chapters');
    chapters.value = response.data;
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      message.warning(error.response.data.message);
    }
  }
};

const isModalVisible = ref(false);
const chapterIdToDelete = ref(null);

const deleteChapter = (id) => {
  chapterIdToDelete.value = id;
  isModalVisible.value = true;
};

const handleOk = () => {
  api
    .delete(`/story/chapters/${chapterIdToDelete.value}`)
    .then((res) => {
      if (res.status === 204) {
        message.success('Xóa chương thành công');
        getChapters();
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
  getChapters();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-stories']);
});
</script>

<style scoped>
/* ========== WRAPPER STYLES ========== */
.stories-management-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 40px 20px;
}

/* ========== CARD STYLES ========== */
.modern-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
}

.modern-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-bottom: none;
  padding: 24px 32px;
}

.modern-card :deep(.ant-card-head-title) {
  color: white;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.modern-card :deep(.ant-card-body) {
  padding: 32px;
}

/* ========== HEADER ACTIONS ========== */
.card-header-actions {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
}

.add-chapter-btn {
  height: 48px;
  padding: 0 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-chapter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

.add-chapter-btn a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ========== DESKTOP/TABLET VIEW ========== */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

/* ========== TABLE STYLES ========== */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.modern-table :deep(.ant-table) {
  font-size: 1rem;
}

.modern-table :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #0c713d;
  font-weight: 700;
  font-size: 1.05rem;
  border-bottom: 2px solid #0c713d;
  padding: 16px;
}

.modern-table :deep(.ant-table-tbody > tr) {
  transition: all 0.3s ease;
}

.modern-table :deep(.ant-table-tbody > tr:hover) {
  background: rgba(12, 113, 61, 0.05);
  transform: scale(1.005);
}

.modern-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
}

/* ========== TABLE CELL CONTENT ========== */
.index-badge {
  display: inline-block;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.95rem;
}

.chapter-title {
  color: #333;
  font-weight: 600;
  font-size: 1.05rem;
}

.author-name {
  color: #666;
  font-style: italic;
}

.chapter-number {
  display: inline-block;
  background: rgba(12, 113, 61, 0.1);
  color: #0c713d;
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 600;
}

/* ========== ACTION BUTTONS ========== */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.edit-btn,
.delete-btn {
  height: 40px;
  width: 40px;
  padding: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #0c713d;
  border-color: #0c713d;
}

.edit-btn:hover {
  background: #0a5a31;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

/* ========== MOBILE CARD VIEW ========== */
.chapters-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chapter-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chapter-card:hover {
  border-color: #0c713d;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.15);
  transform: translateY(-2px);
}

.chapter-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e9ecef;
}

.mobile-index-badge {
  display: inline-block;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

.mobile-chapter-number {
  display: inline-block;
  background: rgba(12, 113, 61, 0.1);
  color: #0c713d;
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.chapter-card-body {
  margin-bottom: 16px;
}

.mobile-chapter-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.mobile-author-name {
  font-size: 0.95rem;
  color: #666;
  font-style: italic;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-author-name i {
  color: #0c713d;
}

.chapter-card-actions {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.mobile-action-link {
  flex: 1;
}

.mobile-edit-btn,
.mobile-delete-btn {
  width: 100%;
  height: 42px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.mobile-edit-btn {
  background: #0c713d;
  border-color: #0c713d;
}

.mobile-edit-btn:hover {
  background: #0a5a31;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.mobile-delete-btn {
  flex: 1;
}

.mobile-delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.mobile-pagination {
  margin-top: 24px;
  padding: 16px;
  background: rgba(12, 113, 61, 0.05);
  border-radius: 12px;
  text-align: center;
}

.pagination-text {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0c713d;
}

/* ========== MODAL STYLES ========== */
.delete-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
}

.delete-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 700;
}

.modal-text {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.05rem;
  color: #333;
}

.modal-text i {
  color: #dc2626;
  font-size: 1.5rem;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
  .stories-management-wrapper {
    padding: 30px 15px;
  }

  .modern-card :deep(.ant-card-head-title) {
    font-size: 1.5rem;
  }

  .modern-card :deep(.ant-card-body) {
    padding: 24px;
  }

  .add-chapter-btn {
    height: 44px;
    padding: 0 24px;
    font-size: 0.95rem;
  }

  .modern-table :deep(.ant-table-thead > tr > th) {
    font-size: 1rem;
    padding: 14px;
  }

  .modern-table :deep(.ant-table-tbody > tr > td) {
    padding: 14px;
  }
}

/* Mobile - Switch to Card View (max-width: 767px) */
@media (max-width: 767px) {
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }

  .stories-management-wrapper {
    padding: 20px 10px;
  }

  .modern-card {
    border-radius: 16px;
  }

  .modern-card :deep(.ant-card-head) {
    padding: 20px 16px;
  }

  .modern-card :deep(.ant-card-head-title) {
    font-size: 1.3rem;
  }

  .modern-card :deep(.ant-card-body) {
    padding: 16px;
  }

  .card-header-actions {
    margin-bottom: 16px;
  }

  .add-chapter-btn {
    width: 100%;
    height: 42px;
    padding: 0 20px;
    font-size: 0.9rem;
    justify-content: center;
  }
}

/* Small Mobile (max-width: 480px) */
@media (max-width: 480px) {
  .stories-management-wrapper {
    padding: 15px 8px;
  }

  .modern-card {
    border-radius: 12px;
  }

  .modern-card :deep(.ant-card-head) {
    padding: 16px 12px;
  }

  .modern-card :deep(.ant-card-head-title) {
    font-size: 1.1rem;
  }

  .modern-card :deep(.ant-card-body) {
    padding: 12px;
  }

  .add-chapter-btn {
    height: 40px;
    font-size: 0.85rem;
  }

  .chapter-card {
    padding: 16px;
  }

  .mobile-chapter-title {
    font-size: 1.05rem;
  }

  .mobile-edit-btn,
  .mobile-delete-btn {
    height: 38px;
    font-size: 0.85rem;
  }
}
</style>
