<template>
  <n-button @click="showLogin = true" ghost style="color: white">
    <i class="fa-solid fa-arrow-right-to-bracket me-2"></i> Đăng Nhập
  </n-button>
  <n-modal
    v-model:show="showLogin"
    class="custom-card"
    preset="card"
    style="width: 400px"
    title="ĐĂNG NHẬP TÀI KHOẢN"
    :bordered="false"
    size="small"
    :segmented="segmented"
  >
    <div class="row mb-1">
      <div
        class="d-sm-flex justify-content-sm-between align-items-sm-center mb-2 mb-sm-2"
      >
        <span style="color: red; font-size: medium"
          >Bạn chưa có tài khoản?</span
        >
        <n-button @click="showRegister" type="error" ghost
          >Đăng ký ngay</n-button
        >
      </div>
      <n-form @submit.prevent="handleLoginSubmit" class="form-spacing">
        <n-form-item label="Username hoặc Email:">
          <n-input
            v-model:value="usernameOrEmail"
            type="text"
            placeholder="Nhập username hoặc email"
          />
        </n-form-item>
        <div v-if="errorsLogin.username_or_email" class="error">
          {{ errorsLogin.username_or_email[0] }}
        </div>
        <n-form-item label="Password:">
          <n-input
            v-model:value="password"
            type="password"
            placeholder="******"
          />
        </n-form-item>
        <div v-if="errorsLogin.password" class="error">
          {{ errorsLogin.password[0] }}
        </div>
        <n-button
          block
          type="primary"
          @click="handleLoginSubmit"
          html-type="submit"
        >
          Đăng Nhập
        </n-button>
      </n-form>
    </div>
  </n-modal>
</template>

<script setup>
import { useMessage } from 'naive-ui';
import { ref, reactive } from 'vue';
import axios from 'axios'; // Đảm bảo bạn đã import axios

const message = useMessage();
const errorsLogin = ref({}); // Khởi tạo là đối tượng rỗng

const showLogin = ref(false);
// const rememberMe = ref(false);
const usernameOrEmail = ref('');
const password = ref('');

const handleLoginSubmit = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      username_or_email: usernameOrEmail.value,
      password: password.value,
    });
    message.success('Đăng nhập thành công!');
    closeModal();
  } catch (error) {
    console.log('lỗi backend', error);
    if (error.response && error.response.data && error.response.data.errors) {
      errorsLogin.value = error.response.data.errors;
      console.log('lỗi', errorsLogin.value);
    } else {
      errorsLogin.value = {}; // Nếu không có lỗi, đặt đối tượng lỗi thành rỗng
    }

    if (error.response && error.response.data && error.response.data.error) {
      // Xử lý lỗi nếu có
    }
    if (error.response && error.response.status === 401) {
      message.warning('Tài khoản hoặc mật khẩu không chính xác');
      resetForm();
    } else {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      resetForm();
    }
  }
};

function showRegister() {
  console.log('Chuyển sang form đăng ký');
}

function resetForm() {
  usernameOrEmail.value = '';
  password.value = '';
  // rememberMe.value = false;
}

function closeModal() {
  showLogin.value = false;
  resetForm();
}

const segmented = reactive({
  content: true,
  footer: 'soft',
});
</script>
