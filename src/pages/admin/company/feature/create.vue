<template>
  <a-card title="Tạo Feature" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Title Input -->
      <div class="mb-3">
        <label for="title">Tiêu Đề</label>
        <input v-model="form.title" type="text" id="title" required class="form-control" />
      </div>

      <!-- Icon Input -->
      <div class="mb-3">
        <label for="icon">Icon</label>
        <input v-model="form.icon" type="text" id="icon" required class="form-control" />
      </div>

      <!-- Icon Class Input -->
      <div class="mb-3">
        <label for="icon_class">Icon Class</label>
        <input v-model="form.icon_class" type="text" id="icon_class" required class="form-control" />
      </div>

      <!-- Description Input -->
      <div class="mb-3">
        <label for="description">Mô Tả</label>
        <textarea v-model="form.description" id="description" required class="form-control"></textarea>
      </div>

      <!-- Submit Button -->
      <a-button type="primary" html-type="submit">Gởi</a-button>
    </form>
  </a-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../../services/axiosInterceptor';
import { useMenu } from '../../../../stores/use-menu';

const form = ref({
  title: '',
  icon: '',
  icon_class: '',
  description: '',
});

const submitForm = async () => {
  try {
    await api.post('/features', form.value);
    message.success('Feature đã được tạo thành công');
    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tạo Feature');
  }
};

const resetForm = () => {
  form.value = {
    title: '',
    icon: '',
    icon_class: '',
    description: '',
  };
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-company']);
});
</script>

<style scoped>
.form-control {
  width: 100%;
}
</style>
