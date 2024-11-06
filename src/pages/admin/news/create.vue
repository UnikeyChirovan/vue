<template>
  <a-card title="Tạo File Mới" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- File Title Input -->
      <div class="mb-3">
        <label for="title">Tiêu đề file</label>
        <input v-model="form.title" type="text" id="title" required class="form-control" />
      </div>

            <!-- Page Dropdown -->
      <div class="mb-3">
        <label for="page">Trang</label>
        <select v-model="form.page" id="page" required class="form-control">
          <option value="">Chọn trang</option>
          <option v-for="option in pageOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </div>
      <!-- File Upload -->
      <div class="mb-3">
        <label for="file">Chọn tệp .txt để tải lên</label>
        <input @change="handleFileUpload" type="file" id="file" accept=".txt" class="form-control" />
      </div>

      <!-- Image Upload -->
      <div class="mb-3">
        <label for="images">Tải lên hình ảnh</label>
        <input @change="handleImageUpload" type="file" id="images" accept="image/*" multiple class="form-control" />
      </div>

      <!-- Display Selected Images -->
      <div class="mb-3" v-if="imagePreviews.length > 0">
        <label>Hình ảnh đã chọn</label>
        <div class="d-flex flex-wrap">
          <div v-for="(image, index) in imagePreviews" :key="index" class="me-2 mb-2">
            <img :src="image" alt="Image Preview" class="image-preview"/>
          </div>
        </div>
      </div>

      <!-- Content Sections -->
      <div v-for="(section, index) in form.content" :key="index" class="mb-3">
        <label>Đoạn {{ index + 1 }}</label>
        <textarea v-model="form.content[index]" rows="3" class="form-control"></textarea>
        <a-button @click="removeSection(index)" danger class="mt-2">Xóa đoạn</a-button>
      </div>
      <a-button @click="addSection" class="mb-3">Thêm đoạn</a-button>
      <a-button @click="showConfirmDelete" danger class="mb-3 ms-3">Xóa Toàn Bộ</a-button>
      <a-button type="primary" html-type="submit">Gởi</a-button>
    </form>
    <a-modal
      v-model:visible="isConfirmVisible"
      title="Xác Nhận Xóa Toàn Bộ"
      @ok="removeAllSections"
      @cancel="handleCancelDelete"
    >
      <p>Bạn có chắc chắn muốn xóa toàn bộ nội dung các đoạn không?</p>
    </a-modal>

    <!-- Scroll Buttons -->
    <ScrollButtons>
      <template v-slot:top-button>
        <a-button type="primary"><i class="fa-solid fa-arrow-down"></i></a-button>
      </template>
      <template v-slot:bottom-button>
        <a-button type="primary"><i class="fa-solid fa-arrow-up"></i></a-button>
      </template>
    </ScrollButtons>
  </a-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenu } from '../../../stores/use-menu';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import ScrollButtons from '../../../components/ScrollButtons.vue';

const form = ref({
  title: '',
  content: [''],
  images: [],
  page: '',  
});

const imagePreviews = ref([]); 
const isConfirmVisible = ref(false);

const pageOptions = ref([]);

const fetchPageOptions = async () => {
  try {
    const response = await api.get('/user-notifications/page-options');
    pageOptions.value = response.data.pageOptions;
  } catch (error) {
    message.error('Không thể lấy danh sách trang');
  }
};

const addSection = () => {
  form.value.content.push('');
};

const removeSection = (index) => {
  form.value.content.splice(index, 1);
};

const showConfirmDelete = () => {
  isConfirmVisible.value = true;
};

const removeAllSections = () => {
  form.value.content = [''];
  message.success('Đã xóa toàn bộ nội dung các đoạn');
  isConfirmVisible.value = false; 
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result.split('\n\n');
      form.value.content = content;
      message.success('Nội dung của tệp đã được nhập vào dưới dạng các đoạn');
    };
    reader.readAsText(file);
  }
};

const handleImageUpload = (event) => {
  const files = event.target.files;
  form.value.images = Array.from(files); // Lưu trữ file ảnh

  imagePreviews.value = [];
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result); // Lưu URL ảnh để hiển thị
    };
    reader.readAsDataURL(files[i]);
  }
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append('title', form.value.title);
  formData.append('content', form.value.content.join('\n\n'));
  formData.append('page', form.value.page);

  form.value.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });

  try {
    await api.post('/user-notifications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    message.success('File đã được tạo thành công');
    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tạo file');
  }
};

const resetForm = () => {
  form.value = {
    title: '',
    content: [''],
    images: [],
    page: '', 
  };
  imagePreviews.value = [];
};

const handleCancelDelete = () => {
  isConfirmVisible.value = false;
};

onMounted(() => {
  fetchPageOptions();
  useMenu().onSelectedKey(['admin-news']);
});
</script>

<style scoped>
.form-control {
  width: 100%;
}
.image-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style> 