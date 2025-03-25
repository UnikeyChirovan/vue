<template>
  <a-card title="Chỉnh Sửa Video" style="width: 100%">
    <form @submit.prevent="submitForm">
      <div class="mb-3 text-center">
        <video v-if="videoUrl" controls class="video-preview">
          <source :src="videoUrl" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </div>
      <div class="mb-3 text-center">
        <img v-if="thumbnailUrl" :src="thumbnailUrl" class="thumbnail-preview" />
      </div>
      <div class="mb-3">
        <label for="videoName">Tên Video</label>
        <input v-model="form.video_name" type="text" id="videoName" required class="form-control" />
      </div>
      <div class="mb-3">
        <label for="videoDescription">Mô tả</label>
        <textarea v-model="form.description" id="videoDescription" rows="4" class="form-control"></textarea>
      </div>
      <div class="mb-3">
        <label for="videoThumbnail">Chọn Thumbnail Mới</label>
        <input type="file" id="videoThumbnail" class="form-control" @change="handleThumbnailUpload" accept="image/*" />
      </div>
      <div class="button-group">
        <a-button type="primary" html-type="submit">Lưu Thay Đổi</a-button>
        <a-button type="default" @click="cancelEdit" class="ml-2">Hủy</a-button>
      </div>
    </form>
  </a-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const route = useRoute();
const router = useRouter();
const videoId = route.params.id;
const form = ref({
  video_name: '',
  video_path: '',
  description: '',
  thumbnail: '',
});

const thumbnailFile = ref(null);
const BaseURL = 'http://127.0.0.1:8000';
const videoUrl = computed(() => `${BaseURL}/storage/${form.value.video_path}`);
const thumbnailUrl = computed(() => form.value.thumbnail ? `${BaseURL}/storage/${form.value.thumbnail}` : null);

const fetchVideoData = async () => {
  try {
    const response = await api.get(`videos/${videoId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải video.');
  }
};

const handleThumbnailUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    thumbnailFile.value = file;
  }
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    let hasChanges = false;

    // Laravel không hỗ trợ PUT với FormData, nên phải dùng POST + _method=PUT
    formData.append('_method', 'PUT');

    if (form.value.video_name) {
      formData.append('video_name', form.value.video_name);
      hasChanges = true;
    }

    if (form.value.description) {
      formData.append('description', form.value.description);
      hasChanges = true;
    }

    if (thumbnailFile.value) {
      formData.append('thumbnail', thumbnailFile.value);
      hasChanges = true;
    }

    if (!hasChanges) {
      message.info('Không có thay đổi nào để cập nhật.');
      return;
    }

    await api.post(`videos/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    message.success('Video đã được cập nhật thành công.');
    router.push({ name: 'admin-videos' });

  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật video.');
  }
};

const cancelEdit = () => {
  router.push({ name: 'admin-videos' });
};

onMounted(() => {
  fetchVideoData();
  useMenu().onSelectedKey(['admin-videos']);
});
</script>

<style scoped>
.video-preview {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}
.thumbnail-preview {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  display: block;
  margin: 0 auto;
}
.form-control {
  width: 100%;
}
.button-group {
  display: flex;
  gap: 10px;
}
</style>