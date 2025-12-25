<template>
  <div class="albums-management-wrapper">
    <a-card class="modern-card" title="Quản Lý Albums Nhạc">
      <div class="card-header-actions">
        <a-button
          type="primary"
          size="large"
          class="add-button"
          @click="showCreateModal = true"
        >
          <i class="fa-solid fa-plus"></i> Thêm Album Mới
        </a-button>
      </div>

      <!-- Desktop/Tablet Table -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="albums"
          :columns="columns"
          :pagination="{ pageSize: 10, showSizeChanger: true }"
          :loading="loading"
          class="modern-table"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-badge">{{ index + 1 }}</span>
            </template>

            <template v-if="column.key === 'cover'">
              <div v-if="record.cover_image" class="cover-preview">
                <img
                  :src="`${BaseURL}/storage/${record.cover_image}`"
                  alt="Cover"
                />
              </div>
              <span v-else class="no-cover">Không có ảnh</span>
            </template>

            <template v-if="column.key === 'name'">
              <span class="album-name">{{ record.name }}</span>
            </template>

            <template v-if="column.key === 'tracks_count'">
              <span class="tracks-count">{{ record.tracks_count }} bài</span>
            </template>

            <template v-if="column.key === 'status'">
              <a-tag :color="record.is_active ? 'green' : 'red'">
                {{ record.is_active ? 'Hoạt động' : 'Ẩn' }}
              </a-tag>
            </template>

            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <a-button
                  type="primary"
                  class="edit-btn"
                  @click="editAlbum(record)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
                <a-button
                  type="primary"
                  danger
                  class="delete-btn"
                  @click="confirmDelete(record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Cards -->
      <div class="mobile-view">
        <div class="albums-grid">
          <div
            v-for="(album, index) in albums"
            :key="album.id"
            class="album-card"
          >
            <div class="album-card-header">
              <span class="mobile-index-badge">{{ index + 1 }}</span>
              <a-tag :color="album.is_active ? 'green' : 'red'">
                {{ album.is_active ? 'Hoạt động' : 'Ẩn' }}
              </a-tag>
            </div>

            <div class="album-card-body">
              <div v-if="album.cover_image" class="mobile-cover">
                <img
                  :src="`${BaseURL}/storage/${album.cover_image}`"
                  alt="Cover"
                />
              </div>
              <h3 class="mobile-album-name">{{ album.name }}</h3>
              <p class="mobile-description">
                {{ album.description || 'Không có mô tả' }}
              </p>
              <p class="mobile-tracks-count">
                <i class="fa-solid fa-music"></i> {{ album.tracks_count }} bài
                hát
              </p>
            </div>

            <div class="album-card-actions">
              <a-button
                type="primary"
                class="mobile-edit-btn"
                @click="editAlbum(album)"
              >
                <i class="fa-solid fa-pen-to-square"></i> Sửa
              </a-button>
              <a-button
                type="primary"
                danger
                class="mobile-delete-btn"
                @click="confirmDelete(album.id)"
              >
                <i class="fa-solid fa-trash"></i> Xóa
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- Create/Edit Modal -->
    <a-modal
      v-model:visible="showCreateModal"
      :title="editingAlbum ? 'Sửa Album' : 'Thêm Album Mới'"
      @ok="handleSubmit"
      @cancel="handleCancel"
      okText="Lưu"
      cancelText="Hủy"
      width="600px"
      class="album-modal"
    >
      <a-form layout="vertical">
        <a-form-item label="Tên Album" required>
          <a-input
            v-model:value="form.name"
            placeholder="Nhạc không lời, Nhạc vàng..."
          />
        </a-form-item>

        <a-form-item label="Mô tả">
          <a-textarea
            v-model:value="form.description"
            :rows="3"
            placeholder="Mô tả ngắn về album..."
          />
        </a-form-item>

        <a-form-item label="Ảnh bìa">
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            list-type="picture-card"
            :max-count="1"
            accept="image/*"
          >
            <div v-if="fileList.length < 1">
              <i class="fa-solid fa-plus"></i>
              <div>Upload</div>
            </div>
          </a-upload>
          <div
            v-if="
              editingAlbum && editingAlbum.cover_image && fileList.length === 0
            "
            class="current-cover"
          >
            <img
              :src="`${BaseURL}/storage/${editingAlbum.cover_image}`"
              alt="Current cover"
            />
          </div>
        </a-form-item>

        <a-form-item label="Thứ tự">
          <a-input-number
            v-model:value="form.order"
            :min="0"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="Trạng thái">
          <a-switch
            v-model:checked="form.is_active"
            checked-children="Hiện"
            un-checked-children="Ẩn"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Delete Confirmation -->
    <a-modal
      v-model:visible="showDeleteModal"
      title="Xác nhận xóa"
      @ok="handleDelete"
      @cancel="showDeleteModal = false"
      okText="Xóa"
      cancelText="Hủy"
      ok-type="danger"
    >
      <p>
        <i class="fa-solid fa-exclamation-triangle"></i> Bạn có chắc chắn muốn
        xóa album này? Tất cả bài hát trong album cũng sẽ bị xóa.
      </p>
    </a-modal>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const BaseURL = 'http://127.0.0.1:8000';

const albums = ref([]);
const loading = ref(false);
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const editingAlbum = ref(null);
const deleteId = ref(null);

const form = ref({
  name: '',
  description: '',
  order: 0,
  is_active: true,
});

const fileList = ref([]);

const columns = [
  { title: '#', key: 'index', width: 60, align: 'center' },
  { title: 'Ảnh bìa', key: 'cover', width: 100, align: 'center' },
  { title: 'Tên Album', key: 'name', align: 'center' },
  { title: 'Số bài hát', key: 'tracks_count', width: 120, align: 'center' },
  { title: 'Trạng thái', key: 'status', width: 120, align: 'center' },
  { title: 'Công cụ', key: 'action', width: 150, align: 'center' },
];

const fetchAlbums = async () => {
  loading.value = true;
  try {
    const response = await api.get('/admin/music/albums');
    albums.value = response.data;
  } catch (error) {
    console.error('Error fetching albums:', error);
    message.error('Không thể tải danh sách albums');
  } finally {
    loading.value = false;
  }
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('Chỉ cho phép upload file ảnh!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
    return false;
  }
  return false; // Prevent auto upload
};

const editAlbum = (album) => {
  editingAlbum.value = album;
  form.value = {
    name: album.name,
    description: album.description || '',
    order: album.order || 0,
    is_active: album.is_active,
  };
  fileList.value = [];
  showCreateModal.value = true;
};

const handleCancel = () => {
  showCreateModal.value = false;
  editingAlbum.value = null;
  form.value = {
    name: '',
    description: '',
    order: 0,
    is_active: true,
  };
  fileList.value = [];
};

const handleSubmit = async () => {
  if (!form.value.name) {
    message.error('Vui lòng nhập tên album');
    return;
  }

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('description', form.value.description || '');
  formData.append('order', form.value.order);
  formData.append('is_active', form.value.is_active ? '1' : '0');

  if (fileList.value.length > 0) {
    formData.append('cover_image', fileList.value[0].originFileObj);
  }

  try {
    if (editingAlbum.value) {
      formData.append('_method', 'PUT');
      await api.post(`/admin/music/albums/${editingAlbum.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Cập nhật album thành công');
    } else {
      await api.post('/admin/music/albums', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Tạo album thành công');
    }

    handleCancel();
    await fetchAlbums();
  } catch (error) {
    console.error('Error saving album:', error);
    message.error('Có lỗi xảy ra khi lưu album');
  }
};

const confirmDelete = (id) => {
  deleteId.value = id;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    await api.delete(`/admin/music/albums/${deleteId.value}`);
    message.success('Xóa album thành công');
    showDeleteModal.value = false;
    await fetchAlbums();
  } catch (error) {
    console.error('Error deleting album:', error);
    message.error('Có lỗi xảy ra khi xóa album');
  }
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-music-albums']);
  fetchAlbums();
});
</script>
<style scoped>
.albums-management-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 40px 20px;
}

.modern-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
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
}

.modern-card :deep(.ant-card-body) {
  padding: 32px;
}

.card-header-actions {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
}

.add-button {
  height: 48px;
  padding: 0 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

/* Table Styles */
.modern-table :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #0c713d;
  font-weight: 700;
  font-size: 1.05rem;
  border-bottom: 2px solid #0c713d;
  padding: 16px;
}

.modern-table :deep(.ant-table-tbody > tr:hover) {
  background: rgba(12, 113, 61, 0.05);
}

.index-badge {
  display: inline-block;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
}

.cover-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-cover {
  color: #999;
  font-size: 0.9rem;
}

.album-name {
  font-weight: 600;
  color: #333;
  font-size: 1.05rem;
}

.tracks-count {
  color: #0c713d;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.edit-btn,
.delete-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Mobile Cards */
.albums-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.album-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.album-card:hover {
  border-color: #0c713d;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.15);
}

.album-card-header {
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

.album-card-body {
  margin-bottom: 16px;
  text-align: center;
}

.mobile-cover {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto 16px;
}

.mobile-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-album-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.mobile-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 8px 0;
}

.mobile-tracks-count {
  color: #0c713d;
  font-weight: 600;
  margin: 0;
}

.album-card-actions {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.mobile-edit-btn,
.mobile-delete-btn {
  flex: 1;
  height: 42px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.mobile-edit-btn {
  background: #0c713d;
  border-color: #0c713d;
}

/* Modal */
.current-cover {
  margin-top: 12px;
}

.current-cover img {
  max-width: 200px;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 1024px) {
  .albums-management-wrapper {
    padding: 30px 15px;
  }

  .modern-card :deep(.ant-card-body) {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }

  .albums-management-wrapper {
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

  .add-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .album-card {
    padding: 16px;
  }

  .mobile-cover {
    width: 100px;
    height: 100px;
  }

  .mobile-album-name {
    font-size: 1.05rem;
  }
}
</style>
