<template>
  <n-card title="Chỉnh sửa thông báo" size="large">
    <n-form ref="formRef" :model="form" label-placement="top" size="large">
      <!-- Tiêu đề -->
      <n-form-item label="Title">
        <n-input v-model:value="form.title" placeholder="Enter title" />
      </n-form-item>

      <!-- Nội dung thông báo -->
      <n-form-item label="Content">
        <div class="content-list">
          <div v-for="(paragraph, index) in form.content" :key="index" class="content-card">
            <n-input
              type="textarea"
              v-model:value="form.content[index]"
              placeholder="Enter content"
              :rows="4"
              class="textarea-card"
            />
            <div class="content-buttons">
              <n-button @click="removeParagraph(index)" type="error" ghost round size="small">🗑️</n-button>
              <n-button @click="addParagraph(index)" type="info" ghost round size="small">➕</n-button>
            </div>
          </div>
        </div>
      </n-form-item>

      <!-- Hiển thị hình ảnh hiện tại -->
      <n-form-item label="Hình Hiện Tại">
        <div v-if="imageUrl" class="image-container">
          <img :src="imageUrl" class="current-image" />
        </div>
      </n-form-item>

      <!-- Chọn hình ảnh mới -->
      <n-form-item label="Hình Mới">
        <div class="upload-wrapper image-container">
          <div v-if="previewImage" class="image-container">
            <img :src="previewImage" class="preview-image" />
          </div>
          <label class="upload-label">
            📷 Chọn hình mới
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden-file-input"
            >
          </label>
        </div>
      </n-form-item>

      <n-form-item label="Trang">
        <n-select v-model:value="form.page" :options="pageOptions" placeholder="Chọn trang" />
      </n-form-item>
      <!-- Nút cập nhật -->
      <div class="button-group">
        <n-button @click="submitText" type="success" ghost round size="large">📝 Cập nhật Text</n-button>
      </div>
    </n-form>
  </n-card>
</template>

<style scoped>
.content-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(900px, 1fr)); 
  gap: 20px;
  max-width: 100%; /* Tối đa chiều rộng của toàn bộ grid */
}

.content-card {
  display: flex;
  justify-items: center;
  align-items: center;  
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%; /* Đảm bảo rằng card này chiếm toàn bộ không gian có sẵn */
}


.textarea-card {
  width: 100%; 
  max-width: 100%; /* Đảm bảo chiều rộng tối đa của textarea giống như input title */
  border-radius: 8px;
  font-size: 16px; /* Giữ font giống như input */
  padding: 12px; /* Tăng độ rộng padding cho textarea để nhìn thoải mái hơn */
}


.content-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 20px;
}
.image-container {
  text-align: center;
  margin: 0px auto;
}

.current-image, .preview-image {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.hidden-file-input {
  display: none;
}

.upload-label {
  display: inline-block;
  cursor: pointer;
  padding: 8px 16px;
  background-color: #409EFF;
  color: white;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.upload-label:hover {
  background-color: #66b1ff;
}
.upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px; /* khoảng cách giữa ảnh và label */
}

</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import api from '../../../services/axiosInterceptor';
import { useRoute } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';
import { useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const formRef = ref(null);
const message = useMessage();
const backendUrl = 'http://127.0.0.1:8000';

const form = ref({
  title: '',
  content: [],
  page: '',
  image_paths: [],
});

const imageUrl = ref(null);
const previewImage = ref(null);
const imageFile = ref(null);

const id = route.params.id;

onMounted(async () => {
  try {
    const response = await api.get(`/user-notifications/${id}`);
    if (response.status === 200) {
      const notificationDetail = response.data;
      form.value.title = notificationDetail.title;
      form.value.content = notificationDetail.content.split('\n');
      form.value.page = notificationDetail.page;
      form.value.image_paths = notificationDetail.image_paths;
      if (notificationDetail.image_paths.length > 0) {
        imageUrl.value = `${backendUrl}/storage/${notificationDetail.image_paths[0]}`;
      }
    }
  } catch (error) {
    message.error('Failed to load notification data.');
  }
  await fetchPageOptions();
  useMenu().onSelectedKey(['admin-news']);
});

const pageOptions = ref([]);

const fetchPageOptions = async () => {
  try {
    const response = await api.get('/user-notifications/page-options');
    if (response.status === 200) {
      pageOptions.value = response.data.pageOptions;
    } else {
      message.error('Không thể tải danh sách trang.');
    }
  } catch (error) {
    message.error('Lỗi khi tải danh sách trang.');
  }
};

const addParagraph = (index) => {
  form.value.content.splice(index + 1, 0, '');
};

const removeParagraph = (index) => {
  form.value.content.splice(index, 1);
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

const submitText = async () => {
  const formData = new FormData();
  formData.append('_method', 'PUT');

  formData.append('title', form.value.title);
  formData.append('content', form.value.content.join('\n'));
  formData.append('page', form.value.page);

  if (imageFile.value) {
    formData.append('images[]', imageFile.value); 
  }

  try {
    const response = await api.post(`/user-notifications/${id}/text`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.status === 200) {
      message.success('Cập nhật thành công!');
      router.push({ name: 'admin-news' });
    } else {
      message.error('Cập nhật thất bại.');
    }
  } catch (error) {
    message.error('Lỗi khi cập nhật.');
  }
};

</script>