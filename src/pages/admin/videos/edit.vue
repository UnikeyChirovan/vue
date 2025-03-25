<template>
  <a-card title="Chỉnh Sửa Video" style="width: 100%">
    <form @submit.prevent="submitForm">
      <div class="mb-3 text-center">
        <video v-if="videoUrl" controls class="video-preview">
          <source :src="videoUrl" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </div>
      <div class="mb-3">
        <label for="videoName">Tên Video</label>
        <input v-model="form.video_name" type="text" id="videoName" required class="form-control" />
      </div>
      <a-button type="primary" html-type="submit">Lưu Thay Đổi</a-button>
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
});

const BaseURL = 'http://127.0.0.1:8000';
const videoUrl = computed(() => {
  return `${BaseURL}/storage/${form.value.video_path}`;
});

const fetchVideoData = async () => {
  try {
    const response = await api.get(`videos/${videoId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải video.');
  }
};

const submitForm = async () => {
  try {
    await api.put(`videos/${videoId}`, { video_name: form.value.video_name });
    message.success('Video đã được cập nhật thành công.');
    router.push({ name: 'admin-videos' });
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật video.');
  }
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
.form-control {
  width: 100%;
}
</style>
