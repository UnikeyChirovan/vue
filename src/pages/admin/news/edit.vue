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

      <!-- Nút cập nhật -->
      <div class="button-group">
        <n-button @click="submitText" type="success" ghost round size="large">📝 Cập nhật Text</n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import api from '../../../services/axiosInterceptor';
import { useRoute } from 'vue-router';
import { useMenu } from '../../../stores/use-menu';

const route = useRoute();
const formRef = ref(null);
const message = useMessage();

const form = ref({
  title: '',
  content: [],
});

const id = route.params.id;

onMounted(async () => {
  try {
    const response = await api.get(`/user-notifications/${id}`);
    if (response.status === 200) {
      const notification = response.data;
      form.value.title = notification.title;
      form.value.content = notification.content.split('\n');
    }
  } catch (error) {
    message.error('Failed to load notification data.');
  }
  useMenu().onSelectedKey(['admin-news']);
});

// Thêm nội dung cho phần content
const addParagraph = (index) => {
  form.value.content.splice(index + 1, 0, '');
}

// Xóa nội dung từ phần content
const removeParagraph = (index) => {
  form.value.content.splice(index, 1);
}

// Gởi cập nhật text
const submitText = async () => {
  const formData = new FormData();
  formData.append('title', form.value.title);
  formData.append('content', form.value.content.join('\n'));

  try {
    const response = await api.put(`/user-notifications/${id}/text`, formData);
    if (response.status === 200) {
      message.success('Text updated successfully!');
    } else {
      message.error('Failed to update text.');
    }
  } catch (error) {
    message.error('An error occurred while updating text.');
  }
}
</script>

<style scoped>
.content-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(900px, 1fr)); 
  gap: 20px;
}

.content-card {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.textarea-card {
  width: 100%; /* Mở rộng chiều rộng textarea */
  border-radius: 8px;
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
</style>
