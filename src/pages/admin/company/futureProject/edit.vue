<template>
  <a-card title="Sửa Future Project" style="width: 100%">
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
      <a-button type="primary" html-type="submit">Lưu thay đổi</a-button>
    </form>
  </a-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../../services/axiosInterceptor';
import { useRoute } from 'vue-router';
import { useMenu } from '../../../../stores/use-menu';

const route = useRoute();
const projectId = route.params.id;

const form = ref({
  name: '',
  timeline: '',
  description: '',
});

const fetchProjectData = async () => {
  try {
    const response = await api.get(`/future-projects/${projectId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải dữ liệu Future Project');
  }
};

onMounted(() => {
  fetchProjectData();
  useMenu().onSelectedKey(['admin-company']);
});

const submitForm = async () => {
  try {
    await api.put(`/future-projects/${projectId}`, form.value);
    message.success('Future Project đã được cập nhật thành công');
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật Future Project');
  }
};
</script>

<style scoped>
.form-control {
  width: 100%;
}
</style>
