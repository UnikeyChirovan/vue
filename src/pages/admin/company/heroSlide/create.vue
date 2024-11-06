<template>
  <a-card title="Tạo HeroSlide" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Title Input -->
      <div class="mb-3">
        <label for="title">Tiêu Đề</label>
        <input v-model="form.title" type="text" id="title" required class="form-control" />
      </div>

      <!-- Image URL Input -->
      <div class="mb-3">
        <label for="image">Link Hình Ảnh</label>
        <input v-model="form.image_url" type="url" id="image" class="form-control" />
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
  image_url: '',
  description: '',
  round: '',
  button_text: '',
});

const submitForm = async () => {
    if (!form.value.image_url) {
    form.value.image_url = "default-image-url"; 
  }
  try {
    await api.post('/hero-slides', form.value);
    message.success('HeroSlide đã được tạo thành công');
    resetForm();
  } catch (error) {
    console.error(error);
  useMenu().onSelectedKey(['admin-company']);
  }
};

const resetForm = () => {
  form.value = {
    title: '',
    image_url: '',
    description: '',
    round: '',
    button_text: '',
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
