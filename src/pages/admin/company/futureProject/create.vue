<template>
  <a-card title="Tạo Future Project" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Name Input -->
      <div class="mb-3">
        <label for="name">Tên Dự Án</label>
        <input v-model="form.name" type="text" id="name" required class="form-control" />
      </div>

      <!-- Timeline Input -->
      <div class="mb-3">
        <label for="timeline">Thời Gian</label>
        <input v-model="form.timeline" type="text" id="timeline" required class="form-control" />
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
  name: '',
  timeline: '',
  description: '',
});

const submitForm = async () => {
  try {
    await api.post('/future-projects', form.value);
    message.success('Future Project đã được tạo thành công');
    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tạo Future Project');
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    timeline: '',
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
