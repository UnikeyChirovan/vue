<template>
  <div class="container mt-5">
    <h1 class="text-center" style="color: red;">TRANG PHẢN HỒI EMAIL</h1>
    <div class="form-group">
      <label>Nội dung liên hệ:</label>
      <textarea class="form-control contact-message" rows="5" v-model="contactMessage" readonly></textarea>
    </div>
    <form @submit.prevent="submitForm" class="mt-4" style="position: relative;">
      <div class="row mb-3">
        <div class="col-sm-2 text-start text-sm-end">
          <label for="email" class="form-label">
            <span class="text-danger me-1">*</span>
            <span>Email:</span>
          </label>
        </div>
        <div class="col-sm-10">
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control email-input"
            placeholder="Email người nhận"
            required
            readonly
          >
        </div>
      </div>
      <div class="ckeditor">
        <CKEditor v-model="responseMessage" />
      </div>
      <div class="button-submit">
        <button type="submit" class="btn btn-primary">Gởi</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CKEditor from '../../../components/CKEditor.vue';
import api from '../../../services/axiosInterceptor';
import { useMessage } from 'naive-ui';

const messagenaive = useMessage();
const route = useRoute();
const router = useRouter();
const email = ref('');
const responseMessage = ref('');
const contactMessage = ref('');

onMounted(() => {
  email.value = route.query.email;
  contactMessage.value = route.query.message;
});

const submitForm = async () => {
  try {
    const formData = {
      email: email.value,
      message: responseMessage.value,
    };
    const response = await api.post('/noauth/reply-email', formData);
    sessionStorage.setItem(`replyStatus-${route.params.id}`, 'success');
    messagenaive.success(response.data.message);
    router.push({ name: 'admin-contacts' });
  } catch (error) {
    console.error(error);
    sessionStorage.setItem(`replyStatus-${route.params.id}`, 'error');
    messagenaive.error('Phản hồi không thành công!');
  }
};
</script>

<style scoped>
.container {
  width: 100%;
}
.contact-message {
  width: 100%;
  margin-bottom: 20px;
}
.email-input {
  width: 30%;
}
.ckeditor {
  margin-bottom: 20px;
}

.button-submit {
  position: absolute;
  bottom: 10px;
  right: 30px;   
}
</style>
