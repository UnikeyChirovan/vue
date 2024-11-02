<template>
  <a-card title="Sửa HeroSlide" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Title Input -->
      <div class="mb-3">
        <label for="title">Tiêu Đề</label>
        <input v-model="form.title" type="text" id="title" required class="form-control" />
      </div>

      <!-- Image URL Input -->
      <div class="mb-3">
        <label for="image">Link Hình Ảnh</label>
        <input v-model="form.image" type="url" id="image" class="form-control" />
      </div>

      <!-- Description Input -->
      <div class="mb-3">
        <label for="description">Mô Tả</label>
        <textarea v-model="form.description" id="description" required class="form-control"></textarea>
      </div>

      <div class="mb-3">
        <label for="round">Vòng</label>
        <textarea v-model="form.round" id="round" class="form-control"></textarea>
      </div>

      <div class="mb-3">
        <label for="button_text">Nút</label>
        <textarea v-model="form.button_text" id="button_text" required class="form-control"></textarea>
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
const heroSlideId = route.params.id;

const form = ref({
  title: '',
  image_url: '',
  description: '',
  round: '',
  button_text: '',
});

const fetchHeroSlideData = async () => {
  try {
    const response = await api.get(`/hero-slides/${heroSlideId}`);
    form.value = response.data;
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tải dữ liệu HeroSlide');
  }
};

onMounted(() => {
  fetchHeroSlideData();
  useMenu().onSelectedKey(['admin-company']);
});

const submitForm = async () => {
  try {
    await api.put(`/hero-slides/${heroSlideId}`, form.value);
    message.success('HeroSlide đã được cập nhật thành công');
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi cập nhật HeroSlide');
  }
};
</script>

<style scoped>
.form-control {
  width: 100%;
}
</style>
