<template>
  <a-card title="Sửa Phần" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Title Input -->
      <div class="mb-3">
        <label for="title">Tiêu đề</label>
        <input v-model="form.title" type="text" id="title" required class="form-control" />
      </div>

      <!-- Section Number -->
      <div class="mb-3">
        <label for="sectionNumber">Phần số</label>
        <input v-model="form.section_number" type="number" id="sectionNumber" required class="form-control" />
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
      <a-button @click="showConfirmDelete" danger class="mb-3 ms-3">Xóa Toàn Bộ</a-button>
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
import ScrollButtons from '../../../components/ScrollButtons.vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useRoute } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';

const route = useRoute();
const sectionId = route.params.id;

const form = ref({
  title: '',
  section_number: 1,
  content: [''],
});

const isConfirmVisible = ref(false);

const fetchSectionData = async () => {
  try {
    const response = await api.get(`/sections/${sectionId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải phần');
  }
};

const resetForm = () => {
  form.value = {
    title: '',
    section_number: 1,
    content: [''],
  };
};

onMounted(() => {
  fetchSectionData();
  useMenu().onSelectedKey(['admin-contents']);
});

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
      message.success('Nội dung của tệp đã được nhập vào');
    };
    reader.readAsText(file);
  }
};

const submitForm = async () => {
  try {
    await api.put(`/sections/${sectionId}`, form.value);
    message.success('Phần đã được cập nhật thành công');
    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật phần');
  }
};

const handleCancelDelete = () => {
  isConfirmVisible.value = false;
};
</script>

<style scoped>
.form-control {
  width: 100%;
}
</style>
