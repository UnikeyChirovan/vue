<template>
  <n-card title="Trang Upload Video" class="upload-video">
    <form @submit.prevent="submitForm">
      <div class="mb-3 mt-4">
        <label for="videoFile" class="form-label me-2">Chọn Video</label>
        <input 
          type="file" 
          id="videoFile" 
          class="form-control" 
          @change="handleFileUpload" 
          accept="video/*" 
          required
        />
      </div>

      <div class="mb-3">
        <label for="thumbnailFile" class="form-label me-2">Chọn Thumbnail</label>
        <input 
          type="file" 
          id="thumbnailFile" 
          class="form-control" 
          @change="handleThumbnailUpload" 
          accept="image/*" 
        />
      </div>

      <div v-if="thumbnailPreviewUrl" class="mb-3">
        <img :src="thumbnailPreviewUrl" class="thumbnail-preview" alt="Thumbnail Preview" />
      </div>

      <div class="mb-3">
        <label for="videoDescription" class="form-label me-2">Mô tả Video</label>
        <textarea 
          id="videoDescription" 
          class="form-control description-box" 
          v-model="videoDescription"
        ></textarea>
      </div>

      <div v-if="videoFile" class="mb-3">
        <div class="mb-4 block">
          <div class="mb-2">
            <label for="videoName" class="form-label me-2">Tên Video</label>
            <input 
              type="text" 
              id="videoName" 
              class="form-control" 
              v-model="videoName" 
              required
            />
          </div>
          <div class="preview">
            <video :src="videoPreviewUrl" controls class="video-thumbnail" style="max-width: 100%; height: auto;"></video>
          </div>
          <div class="d-flex justify-content-center m-0 p-0 mt-2">
            <n-button type="error" style="width: 50%;" @click="removeVideo">Xóa</n-button>
          </div>
          <hr/>
        </div>
      </div>

      <n-button type="primary" @click="submitForm" html-type="submit" :loading="loading" :disabled="!videoFile">Upload</n-button>
      <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
    </form>
  </n-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenu } from '../../../stores/use-menu';
import api from '../../../services/axiosInterceptor';

const videoFile = ref(null);
const videoName = ref("");
const videoPreviewUrl = ref("");
const videoDescription = ref("");
const thumbnailFile = ref(null);
const thumbnailPreviewUrl = ref("");
const loading = ref(false);
const message = ref("");

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  videoFile.value = file;
  videoName.value = file.name.split('.').slice(0, -1).join('.');
  videoPreviewUrl.value = URL.createObjectURL(file);
};

const handleThumbnailUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  thumbnailFile.value = file;
  thumbnailPreviewUrl.value = URL.createObjectURL(file);
};

const removeVideo = () => {
  videoFile.value = null;
  videoName.value = "";
  videoPreviewUrl.value = "";
  videoDescription.value = "";
  thumbnailFile.value = null;
  thumbnailPreviewUrl.value = "";
};

const submitForm = async () => {
  if (!videoFile.value) {
    alert("Vui lòng chọn video trước khi upload.");
    return;
  }

  const formData = new FormData();
  formData.append("videos[]", videoFile.value);
  formData.append("video_names[]", videoName.value);
  formData.append("descriptions[]", videoDescription.value);
  if (thumbnailFile.value) {
    formData.append("thumbnails[]", thumbnailFile.value);
  }

  loading.value = true;

  try {
    const response = await api.post("/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.message) {
      message.value = response.data.message;
      removeVideo();
    }
  } catch (error) {
    console.error("Upload thất bại:", error);
    message.value = "Không thể tải lên video.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-videos']);
});
</script>

<style scoped>
.upload-video {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.preview {
  border: 3px solid teal;
}
.thumbnail-preview {
  max-width: 100%;
  height: auto;
  border: 2px solid #ddd;
  border-radius: 5px;
  margin-top: 10px;
}
.description-box {
  width: 100%;
  height: 120px;
  resize: vertical;
}
</style>