<template>
  <a-card title="Sửa Chương" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Title Input -->
      <div class="mb-3">
        <label for="title">Tiêu đề</label>
        <input v-model="form.title" type="text" id="title" required class="form-control" />
      </div>

      <!-- Author Input -->
      <div class="mb-3">
        <label for="author">Tác giả</label>
        <input v-model="form.author" type="text" id="author" required class="form-control" />
      </div>

      <!-- Chapter Number -->
      <div class="mb-3">
        <label for="chapterNumber">Chương số</label>
        <input v-model="form.chapter_number" type="number" id="chapterNumber" required class="form-control" />
      </div>

      <!-- File Upload -->
      <div class="mb-3">
        <label for="file">Chọn tệp .txt để nhập nội dung</label>
        <input @change="handleFileUpload" type="file" id="file" accept=".txt" class="form-control" />
      </div>

      <!-- Content Sections -->
      <div v-for="(section, index) in form.content" :key="index" class="mb-3">
        <label>Đoạn {{ index + 1 }}</label>
        <textarea v-model="form.content[index]" rows="3" class="form-control"></textarea>
        <a-button @click="removeSection(index)" danger class="mt-2">Xóa đoạn</a-button>
      </div>
      <a-button @click="addSection" class="mb-3">Thêm đoạn</a-button>

      <!-- "Xóa Toàn Bộ" Button -->
      <a-button @click="showConfirmDelete" danger class="mb-3 ms-3">Xóa Toàn Bộ</a-button>

      <!-- Submit Button -->
      <a-button type="primary" html-type="submit">Lưu thay đổi</a-button>
    </form>

    <!-- Confirm Delete Modal -->
    <a-modal
      v-model:visible="isConfirmVisible"
      title="Xác Nhận Xóa Toàn Bộ"
      @ok="removeAllSections"
      @cancel="handleCancelDelete"
    >
      <p>Bạn có chắc chắn muốn xóa toàn bộ nội dung các đoạn không?</p>
    </a-modal>
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
import ScrollButtons from '../../../components/ScrollButtons.vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useRoute } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';

// Get chapter id from the route
const route = useRoute();
const chapterId = route.params.id; // Assuming the chapter ID is passed as a route parameter

// Initialize the form structure
const form = ref({
  title: '',
  author: '',
  chapter_number: 1,
  content: [''], // Initial content section
});

// State for the confirmation modal
const isConfirmVisible = ref(false);

// Fetch the chapter data to prefill the form
const fetchChapterData = async () => {
  try {
    // Gửi request GET để lấy dữ liệu chương
    const response = await api.get(`/story/chapters/${chapterId}`);
    form.value = response.data; // Điền dữ liệu vào form
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải chương');
  }
};
// Hàm resetForm
const resetForm = () => {
  form.value = {
    title: '',
    author: '',
    chapter_number: 1,
    content: [''], // Reset nội dung chương về một đoạn rỗng
  };
};


// Fetch the data when the component is mounted
onMounted(() => {
  fetchChapterData();
  useMenu().onSelectedKey(['admin-stories']);
});
// Add a new content section
const addSection = () => {
  form.value.content.push('');
};

// Remove a specific content section
const removeSection = (index) => {
  form.value.content.splice(index, 1);
};

// Show the confirmation modal before deleting all sections
const showConfirmDelete = () => {
  isConfirmVisible.value = true;
};

// Remove all content sections
const removeAllSections = () => {
  form.value.content = ['']; // Reset content to have one empty section
  message.success('Đã xóa toàn bộ nội dung các đoạn');
  isConfirmVisible.value = false; // Close the modal
};

// Handle file upload, splitting content by paragraph
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result.split('\n\n'); // Split by paragraphs
      form.value.content = content;
      message.success('Nội dung của tệp đã được nhập vào');
    };
    reader.readAsText(file);
  }
};

// Submit the form
const submitForm = async () => {
  try {
    await api.put(`/story/chapters/${chapterId}`, form.value);
    message.success('Chương đã được cập nhật thành công');
    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật chương');
  }
};


// Handle cancel delete action
const handleCancelDelete = () => {
  isConfirmVisible.value = false; // Close the modal
};
</script>

<style scoped>
.form-control {
  width: 100%;
}
</style>
