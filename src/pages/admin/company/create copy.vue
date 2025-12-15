<template>
  <a-card title="Tạo Thông Tin Công Ty" style="width: 100%">
    <form @submit.prevent="submitForm">
      <!-- Webname Input -->
      <div class="mb-3">
        <label for="webname">Tên Công Ty</label>
        <input v-model="form.webname" type="text" id="webname" required class="form-control" />
      </div>

      <!-- Address Input -->
      <div class="mb-3">
        <label for="address">Địa Chỉ</label>
        <input v-model="form.address" type="text" id="address" required class="form-control" />
      </div>

      <!-- Phone Input -->
      <div class="mb-3">
        <label for="phone">Số Điện Thoại</label>
        <input v-model="form.phone" type="text" id="phone" required class="form-control" />
      </div>

      <!-- Email Input -->
      <div class="mb-3">
        <label for="email">Email</label>
        <input v-model="form.email" type="email" id="email" required class="form-control" />
      </div>

      <!-- Social Media Links -->
      <div class="mb-3">
        <label for="facebook">Facebook</label>
        <input v-model="form.facebook" type="url" id="facebook" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="twitter">Twitter</label>
        <input v-model="form.twitter" type="url" id="twitter" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="linkedin">LinkedIn</label>
        <input v-model="form.linkedin" type="url" id="linkedin" class="form-control" />
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
  webname: '',
  address: '',
  phone: '',
  email: '',
  facebook: '',
  twitter: '',
  linkedin: '',
});

const submitForm = async () => {
  try {
    await api.post('/company-info', form.value);
    message.success('Thông tin công ty đã được tạo thành công');
    resetForm();
  } catch (error) {
    console.error(error);
    message.error('Đã xảy ra lỗi khi tạo thông tin công ty');
  }
};

const resetForm = () => {
  form.value = {
    webname: '',
    address: '',
    phone: '',
    email: '',
    facebook: '',
    twitter: '',
    linkedin: '',
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
