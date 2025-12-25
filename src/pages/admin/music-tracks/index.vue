<template>
  <div class="tracks-management-wrapper">
    <a-card class="modern-card" title="Quản Lý Bài Hát">
      <div class="card-header-actions">
        <a-button
          type="primary"
          size="large"
          class="add-button"
          @click="showCreateModal = true"
        >
          <i class="fa-solid fa-plus"></i> Thêm Bài Hát Mới
        </a-button>
      </div>

      <!-- Desktop Table -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="tracks"
          :columns="columns"
          :pagination="{ pageSize: 10, showSizeChanger: true }"
          :loading="loading"
          class="modern-table"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-badge">{{ index + 1 }}</span>
            </template>

            <template v-if="column.key === 'title'">
              <div class="track-info">
                <span class="track-title">{{ record.title }}</span>
                <span class="track-artist">{{
                  record.artist || 'Unknown'
                }}</span>
              </div>
            </template>

            <template v-if="column.key === 'album'">
              <a-tag color="blue">{{ record.album?.name }}</a-tag>
            </template>

            <template v-if="column.key === 'duration'">
              <span>{{ formatDuration(record.duration) }}</span>
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
                  @click="editTrack(record)"
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
        <div class="tracks-grid">
          <div
            v-for="(track, index) in tracks"
            :key="track.id"
            class="track-card"
          >
            <div class="track-card-header">
              <span class="mobile-index-badge">{{ index + 1 }}</span>
              <a-tag :color="track.is_active ? 'green' : 'red'">
                {{ track.is_active ? 'Hoạt động' : 'Ẩn' }}
              </a-tag>
            </div>

            <div class="track-card-body">
              <h3 class="mobile-track-title">{{ track.title }}</h3>
              <p class="mobile-track-artist">
                <i class="fa-solid fa-user"></i>
                {{ track.artist || 'Unknown Artist' }}
              </p>
              <p class="mobile-track-album">
                <i class="fa-solid fa-compact-disc"></i> {{ track.album?.name }}
              </p>
              <p class="mobile-track-duration">
                <i class="fa-solid fa-clock"></i>
                {{ formatDuration(track.duration) }}
              </p>
            </div>

            <div class="track-card-actions">
              <a-button
                type="primary"
                class="mobile-edit-btn"
                @click="editTrack(track)"
              >
                <i class="fa-solid fa-pen-to-square"></i> Sửa
              </a-button>
              <a-button
                type="primary"
                danger
                class="mobile-delete-btn"
                @click="confirmDelete(track.id)"
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
      :title="editingTrack ? 'Sửa Bài Hát' : 'Thêm Bài Hát Mới'"
      @ok="handleSubmit"
      @cancel="handleCancel"
      okText="Lưu"
      cancelText="Hủy"
      width="600px"
    >
      <a-form layout="vertical">
        <a-form-item label="Album" required>
          <a-select v-model:value="form.album_id" placeholder="Chọn album">
            <a-select-option
              v-for="album in albums"
              :key="album.id"
              :value="album.id"
            >
              {{ album.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Tên bài hát" required>
          <a-input
            v-model:value="form.title"
            placeholder="Nhập tên bài hát..."
          />
        </a-form-item>

        <a-form-item label="Ca sĩ/Nghệ sĩ">
          <a-input
            v-model:value="form.artist"
            placeholder="Nhập tên ca sĩ..."
          />
        </a-form-item>

        <a-form-item label="File nhạc (MP3)" :required="!editingTrack">
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            accept=".mp3,.wav"
            :max-count="1"
          >
            <a-button> <i class="fa-solid fa-upload"></i> Chọn file </a-button>
          </a-upload>
          <p
            v-if="editingTrack && !fileList.length"
            style="margin-top: 8px; color: #999; font-size: 0.9rem"
          >
            Bỏ trống nếu không muốn thay đổi file
          </p>
        </a-form-item>

        <a-form-item label="Thời lượng (giây)">
          <a-input-number
            v-model:value="form.duration"
            :min="0"
            style="width: 100%"
            placeholder="Tự động"
          />
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
        xóa bài hát này?
      </p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const tracks = ref([]);
const albums = ref([]);
const loading = ref(false);
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const editingTrack = ref(null);
const deleteId = ref(null);

const form = ref({
  album_id: null,
  title: '',
  artist: '',
  duration: null,
  order: 0,
  is_active: true,
});

const fileList = ref([]);

const columns = [
  { title: '#', key: 'index', width: 60, align: 'center' },
  { title: 'Bài hát', key: 'title', align: 'center' },
  { title: 'Album', key: 'album', width: 150, align: 'center' },
  { title: 'Thời lượng', key: 'duration', width: 120, align: 'center' },
  { title: 'Trạng thái', key: 'status', width: 120, align: 'center' },
  { title: 'Công cụ', key: 'action', width: 150, align: 'center' },
];

const formatDuration = (seconds) => {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const fetchTracks = async () => {
  loading.value = true;
  try {
    const response = await api.get('/admin/music/tracks');
    tracks.value = response.data;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    message.error('Không thể tải danh sách bài hát');
  } finally {
    loading.value = false;
  }
};

const fetchAlbums = async () => {
  try {
    const response = await api.get('/admin/music/albums');
    albums.value = response.data.filter((a) => a.is_active);
  } catch (error) {
    console.error('Error fetching albums:', error);
  }
};

const beforeUpload = (file) => {
  const isAudio =
    file.type === 'audio/mpeg' ||
    file.type === 'audio/wav' ||
    file.name.endsWith('.mp3');
  if (!isAudio) {
    message.error('Chỉ cho phép upload file MP3/WAV!');
    return false;
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error('Kích thước file phải nhỏ hơn 10MB!');
    return false;
  }
  return false;
};

const editTrack = (track) => {
  editingTrack.value = track;
  form.value = {
    album_id: track.album_id,
    title: track.title,
    artist: track.artist || '',
    duration: track.duration,
    order: track.order || 0,
    is_active: track.is_active,
  };
  fileList.value = [];
  showCreateModal.value = true;
};

const handleCancel = () => {
  showCreateModal.value = false;
  editingTrack.value = null;
  form.value = {
    album_id: null,
    title: '',
    artist: '',
    duration: null,
    order: 0,
    is_active: true,
  };
  fileList.value = [];
};

const handleSubmit = async () => {
  if (!form.value.album_id || !form.value.title) {
    message.error('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  if (!editingTrack.value && fileList.value.length === 0) {
    message.error('Vui lòng chọn file nhạc');
    return;
  }

  const formData = new FormData();
  formData.append('album_id', form.value.album_id);
  formData.append('title', form.value.title);
  formData.append('artist', form.value.artist || '');
  formData.append('order', form.value.order);
  formData.append('is_active', form.value.is_active ? '1' : '0');

  if (form.value.duration) {
    formData.append('duration', form.value.duration);
  }

  if (fileList.value.length > 0) {
    formData.append('file', fileList.value[0].originFileObj);
  }

  try {
    if (editingTrack.value) {
      formData.append('_method', 'PUT');
      await api.post(`/admin/music/tracks/${editingTrack.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Cập nhật bài hát thành công');
    } else {
      await api.post('/admin/music/tracks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Thêm bài hát thành công');
    }

    handleCancel();
    await fetchTracks();
  } catch (error) {
    console.error('Error saving track:', error);
    message.error('Có lỗi xảy ra khi lưu bài hát');
  }
};

const confirmDelete = (id) => {
  deleteId.value = id;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    await api.delete(`/admin/music/tracks/${deleteId.value}`);
    message.success('Xóa bài hát thành công');
    showDeleteModal.value = false;
    await fetchTracks();
  } catch (error) {
    console.error('Error deleting track:', error);
    message.error('Có lỗi xảy ra khi xóa bài hát');
  }
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-music-tracks']);
  fetchAlbums();
  fetchTracks();
});
</script>

<style scoped>
.tracks-management-wrapper {
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

.track-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-title {
  font-weight: 600;
  color: #333;
  font-size: 1.05rem;
}

.track-artist {
  font-size: 0.9rem;
  color: #666;
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
.tracks-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.track-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.track-card:hover {
  border-color: #0c713d;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.15);
}

.track-card-header {
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

.track-card-body {
  margin-bottom: 16px;
}

.mobile-track-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.mobile-track-artist,
.mobile-track-album,
.mobile-track-duration {
  font-size: 0.9rem;
  color: #666;
  margin: 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-track-artist i,
.mobile-track-album i,
.mobile-track-duration i {
  color: #0c713d;
}

.track-card-actions {
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

/* Responsive */
@media (max-width: 1024px) {
  .tracks-management-wrapper {
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

  .tracks-management-wrapper {
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
  .track-card {
    padding: 16px;
  }

  .mobile-track-title {
    font-size: 1.05rem;
  }
}
</style>
