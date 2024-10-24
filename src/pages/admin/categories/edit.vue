<template>
  <a-card title="Sửa Danh Mục" style="width: 100%">
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
      <a-button type="primary" html-type="submit">Cập Nhật</a-button>
    </form>
  </a-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useMenu } from '../../../stores/use-menu';
import api from '../../../services/axiosInterceptor';

const route = useRoute();
const router = useRouter();

const form = ref({
  name: '',
  code: '',
});

const getCategory = async () => {
  try {
    const response = await api.get(`/categories/${route.params.id}`);
    form.value.name = response.data.name;
    form.value.code = response.data.code; // Lấy mã số từ API
  } catch (error) {
    console.error(error);
    message.error('Không thể lấy thông tin danh mục');
  }
};

const submitForm = async () => {
  try {
    await api.put(`/categories/${route.params.id}`, {
      name: form.value.name,
      code: form.value.code,
    });
    message.success('Danh mục đã được cập nhật thành công');
    await router.push({ name: 'admin-categories' });
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật danh mục');
  }
};

onMounted(() => {
  getCategory();
  useMenu().onSelectedKey(['admin-categories']);
});
</script>

<style scoped>
.form-control {
  width: 100%;
}
</style>
