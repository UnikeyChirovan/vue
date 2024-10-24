<template>
  <a-card title="Tạo Danh Mục Mới" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Name Input -->
      <div class="mb-3">
        <label for="name">Tên Danh Mục</label>
        <input v-model="form.name" type="text" id="name" required class="form-control" />
      </div>

      <!-- Code Input -->
      <div class="mb-3">
        <label for="code">Mã Số</label>
        <input v-model="form.code" type="text" id="code" required class="form-control" />
      </div>

      <!-- Submit Button -->
      <a-button type="primary" html-type="submit">Gởi</a-button>
    </form>
  </a-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const form = ref({
  name: '',
  code: '',
});

const submitForm = async () => {
  try {
    await api.post('/categories', {
      name: form.value.name,
      code: form.value.code,
    });
    message.success('Danh mục đã được tạo thành công');
    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tạo danh mục');
  }
};

const resetForm = () => {
  form.value.name = '';
  form.value.code = '';
};
onMounted(() => {
    useMenu().onSelectedKey(['admin-categories']);
});
</script>

<style scoped>
.form-control {
  width: 100%;
}
</style>
