<template>
  <n-card title="Upload Background Images" class="upload-background">
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="backgroundImages" class="form-label">Background Images (Max 10)</label>
        <input 
          type="file" 
          id="backgroundImages" 
          class="form-control" 
          multiple
          @change="handleFileUpload" 
          accept="image/*" 
          required
        />
      </div>

      <!-- Phần hiển thị tên và ảnh xem trước của từng hình -->
      <div v-if="backgroundImages.length > 0" class="mb-3">
        <div v-for="(image, index) in backgroundImages" :key="index" class="mb-4">
          <div class="mb-2">
            <label :for="'backgroundName-' + index" class="form-label me-2">Background Name {{ index + 1 }}</label>
            <input 
              type="text" 
              :id="'backgroundName-' + index" 
              class="form-control" 
              v-model="image.name" 
              required
            />
          </div>

          <img :src="image.previewUrl" alt="Preview" class="img-thumbnail" style="max-width: 100%; height: auto;" />
        </div>
      </div>

      <n-button type="primary" @click="submitForm" html-type="submit" :loading="loading" :disabled="backgroundImages.length === 0">Upload</n-button>
      <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
    </form>
  </n-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenu } from '../../../stores/use-menu';
import api from '../../../services/axiosInterceptor';

// Array để lưu các ảnh được chọn
const backgroundImages = ref([]);
const loading = ref(false);
const message = ref("");

// Hàm xử lý khi người dùng chọn file
const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);

  // Kiểm tra nếu người dùng chọn quá 10 hình
  if (files.length > 10) {
    alert('You can only select a maximum of 10 images.');
    return;
  }

  // Đặt lại mảng chứa hình ảnh trước đó
  backgroundImages.value = files.map(file => ({
    file: file,
    name: '',
    previewUrl: URL.createObjectURL(file) // Tạo URL tạm thời để hiển thị hình ảnh
  }));
};

// Hàm submit form để upload hình ảnh
const submitForm = async () => {
  const formData = new FormData();

  backgroundImages.value.forEach((image) => {
    formData.append('background_names[]', image.name); // Append tên ảnh vào mảng
    formData.append('background_images[]', image.file); // Append file ảnh vào mảng
  });

  loading.value = true;

  try {
    const response = await api.post("/story/upload-background", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.message) {
      message.value = response.data.message;
      backgroundImages.value = [];
    }
  } catch (error) {
    console.error("Upload failed:", error);
    message.value = "Failed to upload backgrounds.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-images']);
});
</script>

<style scoped>
.upload-background {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
