<template>
  <a-card title="Chỉnh Sửa Hình Nền" style="width: 100%">
    <form @submit.prevent="submitForm">
      <div class="mb-3 text-center">
        <img :src="imageUrl" alt="Background Image" class="img-thumbnail" style="max-width: 300px;" />
      </div>
      <div class="mb-3">
        <label for="backgroundName">Tên Hình Nền</label>
        <input v-model="form.background_image_name" type="text" id="backgroundName" required class="form-control" />
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
const backgroundId = route.params.id;
const form = ref({
  background_image_name: '', 
  background_image_path: '', 
});

const BaseURL = 'http://127.0.0.1:8000';
const imageUrl = computed(() => {
  return `${BaseURL}/storage/${form.value.background_image_path}`;
});
const fetchBackgroundData = async () => {
  try {
    const response = await api.get(`/story/backgrounds/${backgroundId}`);
    form.value = response.data; 
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải hình nền.');
  }
};
const submitForm = async () => {
  try {
    await api.put(`/story/backgrounds/${backgroundId}`, { background_image_name: form.value.background_image_name });
    message.success('Hình nền đã được cập nhật thành công.');
    router.push({ name: 'admin-images' }); 
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật hình nền.');
  }
};

onMounted(() => {
  fetchBackgroundData();
  useMenu().onSelectedKey(['admin-images']);
});
</script>

<style scoped>
.img-thumbnail {
  border: 1px solid #ddd; 
  border-radius: 4px; 
  padding: 5px; 
}
.form-control {
  width: 100%;
}
</style>
