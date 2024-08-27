<template>
  <div>
    <n-button @click="showRegister = true" ghost style="color: white">
      <i class="fa-solid fa-user-plus me-2"></i> Đăng Ký
    </n-button>
    <n-modal
      v-model:show="showRegister"
      class="custom-card"
      preset="card"
      style="width: 400px"
      title="ĐĂNG KÝ TÀI KHOẢN"
      :bordered="false"
      size="small"
      :segmented="segmented"
    >
      <div class="row mb-1">
        <div
          class="d-sm-flex justify-content-sm-between align-items-sm-center mb-2 mb-sm-2"
        >
          <span style="color: red; font-size: medium"
            >Bạn đã có tài khoản?</span
          >
          <n-button @click="openLoginModal" type="error" ghost
            >Đăng nhập ngay</n-button
          >
        </div>
        <n-form
          @submit.prevent="handleRegisterSubmit"
          v-for="(field, index) in formFields"
        >
          <n-form-item :key="index" :label="field.label" :for="field.model">
            <component
              :is="field.component"
              v-model:value="users[field.model]"
              :type="field.type || 'text'"
              :id="field.model"
              :placeholder="field.placeholder"
              :allow-clear="field.allowClear"
            />
          </n-form-item>
          <div v-if="errors[field.model]" class="error">
            {{ errors[field.model][0] }}
          </div>
        </n-form>
        <n-button
          block
          type="primary"
          @click="handleRegisterSubmit"
          :loading="loading"
          html-type="submit"
        >
          Đăng Ký
        </n-button>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
const showRegister = ref(false);
const users = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  nickname: '',
  status_id: 1,
  department_id: 2,
});
const loading = ref(false);
const formFields = [
  {
    label: 'Tên Tài khoản',
    model: 'username',
    component: 'n-input',
    placeholder: 'Tên Tài khoản',
    allowClear: true,
    required: true,
  },
  {
    label: 'Họ và Tên',
    model: 'name',
    component: 'n-input',
    placeholder: 'Họ và Tên',
    allowClear: true,
    required: true,
  },
  {
    label: 'Biệt Danh',
    model: 'nickname',
    component: 'n-input',
    placeholder: 'Tên muốn thể hiện',
    allowClear: true,
    required: true,
  },
  {
    label: 'Email',
    model: 'email',
    component: 'n-input',
    placeholder: 'Email',
    allowClear: true,
    required: true,
  },
  {
    label: 'Mật khẩu',
    model: 'password',
    component: 'n-input',
    placeholder: 'Mật khẩu',
    type: 'password',
    allowClear: true,
    required: true,
  },
  {
    label: 'Xác nhận mật khẩu',
    model: 'password_confirmation',
    component: 'n-input',
    placeholder: 'Xác nhận mật khẩu',
    type: 'password',
    allowClear: true,
    required: true,
  },
];
const errors = ref({});

function handleRegisterSubmit() {
  loading.value = true;
  axios
    .post('http://127.0.0.1:8000/api/users', users)
    .then((res) => {
      if (res.status === 200) {
        message.success('Tạo tài khoản thành công!');
        closeRegisterModal();
      }
    })
    .catch((err) => {
      console.log('lỗi từ backend', err);
      console.error('Lỗi từ backend:', err.response.data.errors); // In ra lỗi để kiểm tra
      errors.value = err.response.data.errors;
      console.log('lỗi', errors.value);
    })
    .finally(() => {
      loading.value = false;
    });
}

const openLoginModal = () => {
  // Implement logic to open login modal
};

const closeRegisterModal = () => {
  showRegister.value = false;
  resetRegisterForm();
};

const resetRegisterForm = () => {
  Object.keys(users).forEach((key) => {
    users[key] = key === 'status_id' || key === 'department_id' ? 2 : '';
  });
  errors.value = {}; // Clear errors as well
};

const segmented = reactive({
  content: 'true',
  footer: 'soft',
});
</script>

<style scoped>
.primary-button {
  background-color: #007bff;
  color: #fff;
}
</style>
