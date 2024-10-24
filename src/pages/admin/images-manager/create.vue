<template>
  <n-card title="Trang Cập Nhật Hình Ảnh" class="upload-background">
    <form @submit.prevent="submitForm">
      <div class="mb-3 mt-4">
        <label for="backgroundImages" class="form-label me-2">Chọn tối đa 10 hình</label>
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
      <div v-if="backgroundImages.length > 0" class="mb-3">
        <div v-for="(image, index) in backgroundImages" :key="index" class="mb-4 block">
          <div class="mb-2">
            <label :for="'backgroundName-' + index" class="form-label me-2">Image Name {{ index + 1 }}</label>
            <input 
              type="text" 
              :id="'backgroundName-' + index" 
              class="form-control" 
              v-model="image.name" 
              required
            />
          </div>
          <div class="preview"><img :src="image.previewUrl" alt="Preview" class="img-thumbnail" style="max-width: 100%; height: auto;" /></div>
          <div class="d-flex justify-content-center m-0 p-0 mt-2"><n-button type="error" style="width: 50%;" @click="removeImage(index)">Xóa</n-button></div>
          <hr/>
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
const backgroundImages = ref([]);
const loading = ref(false);
const message = ref("");
const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 10) {
    alert('You can only select a maximum of 10 images.');
    return;
  }
  backgroundImages.value = files.map(file => ({
    file: file,
    name: '',
    previewUrl: URL.createObjectURL(file) 
  }));
};
const removeImage = (index) => {
  backgroundImages.value.splice(index, 1);
};
const submitForm = async () => {
  const formData = new FormData();

  backgroundImages.value.forEach((image) => {
    formData.append('image_names[]', image.name); 
    formData.append('images[]', image.file); 
  });

  loading.value = true;

  try {
    const response = await api.post("/image-manager/upload", formData, {
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
  useMenu().onSelectedKey(['admin-images-manager']);
});
</script>

<style scoped>
.upload-background {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.preview{
  border: 3px solid teal;
}
</style>