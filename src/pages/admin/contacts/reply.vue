<template>
  <div class="container mt-5">
    <h1 class="text-center" style="color: red;">TRANG PHẢN HỒI EMAIL</h1>
    
    <!-- Nội dung liên hệ đưa lên trên cùng, độ rộng 100% -->
    <div class="form-group">
      <label>Nội dung liên hệ:</label>
      <textarea class="form-control contact-message" rows="5" v-model="contactMessage" readonly></textarea>
    </div>

    <form @submit.prevent="submitForm" class="mt-4" style="position: relative;">
      
      <!-- Trường Email nhận phản hồi, độ rộng 30% -->
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
      
      <!-- Trường Nội dung phản hồi -->
      <div class="ckeditor">
        <CKEditor v-model="responseMessage" />
      </div>

      <!-- Nút gửi -->
      <div class="button-submit">
        <button type="submit" class="btn btn-primary">Gửi</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CKEditor from '../../../components/CKEditor.vue';
import axios from 'axios';
import { useMessage } from 'naive-ui';

const messagenaive = useMessage();
const route = useRoute();
const router = useRouter();

// Khai báo các biến lưu thông tin
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

    // Gửi API để phản hồi email
    const response = await axios.post('http://127.0.0.1:8000/api/noauth/reply-email', formData);
    messagenaive.success(response.data.message);
      router.push({ name: 'admin-contacts' });
  } catch (error) {
    console.error(error);
    messagenaive.error('Phản hồi không thành công!');
  }
        router.push({ name: 'admin-contacts' });
};
</script>

<style scoped>
.container {
  width: 100%;
}

/* Nội dung liên hệ sẽ chiếm toàn bộ chiều rộng */
.contact-message {
  width: 100%;
  margin-bottom: 20px;
}

/* Trường email sẽ chiếm 30% chiều rộng */
.email-input {
  width: 30%;
}

/* Định dạng lại khung editor */
.ckeditor {
  margin-bottom: 20px;
}

.button-submit {
  position: absolute;
  bottom: 10px;
  right: 30px;   
}
</style>
