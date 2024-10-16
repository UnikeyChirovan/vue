<template>
  <a-card title="Chỉnh Sửa Hình Nền" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Hiển thị hình ảnh hiện tại -->
      <div class="mb-3 text-center">
        <img :src="imageUrl" alt="Background Image" class="img-thumbnail" style="max-width: 300px;" />
      </div>

      <!-- Input để chỉnh sửa tên hình nền -->
      <div class="mb-3">
        <label for="backgroundName">Tên Hình Nền</label>
        <input v-model="form.background_image_name" type="text" id="backgroundName" required class="form-control" />
      </div>

      <!-- Submit Button -->
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

// Lấy ID từ tham số URL
const route = useRoute();
const router = useRouter();
const backgroundId = route.params.id;

// State chứa thông tin hình nền
const form = ref({
  background_image_name: '', // Tên hình nền
  background_image_path: '', // Đường dẫn của hình nền
});

const BaseURL = 'http://127.0.0.1:8000';

// Hàm tính toán URL đầy đủ của hình nền
const imageUrl = computed(() => {
  return `${BaseURL}/storage/${form.value.background_image_path}`;
});

// Lấy thông tin hình nền từ API
const fetchBackgroundData = async () => {
  try {
    // Gửi request GET để lấy thông tin chi tiết của hình nền
    const response = await api.get(`/story/backgrounds/${backgroundId}`);
    form.value = response.data; // Điền dữ liệu hình nền vào form
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải hình nền.');
  }
};

// Gửi request để cập nhật tên hình nền
const submitForm = async () => {
  try {
    await api.put(`/story/backgrounds/${backgroundId}`, { background_image_name: form.value.background_image_name });
    message.success('Hình nền đã được cập nhật thành công.');
    router.push({ name: 'admin-images' }); // Điều hướng về danh sách hình nền sau khi lưu
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật hình nền.');
  }
};

// Khi component được khởi tạo
onMounted(() => {
  fetchBackgroundData();
  useMenu().onSelectedKey(['admin-images']);
});
</script>

<style scoped>
.img-thumbnail {
  border: 1px solid #ddd; /* Đường viền */
  border-radius: 4px; /* Bo tròn */
  padding: 5px; /* Khoảng cách giữa hình và viền */
}
.form-control {
  width: 100%;
}
</style>
