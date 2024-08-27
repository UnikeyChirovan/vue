<template>
  <div>
    <n-button
      @click="openRegisterModal"
      ghost
      style="color: white"
      class="me-1"
    >
      <i class="fa-solid fa-user-plus me-2"></i> Đăng Ký
    </n-button>
    <n-button @click="openLoginModal" ghost style="color: white">
      <i class="fa-solid fa-arrow-right-to-bracket me-2"></i> Đăng Nhập
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
          ref="registerFormRef"
          :rules="registerRules"
          @submit="handleRegisterSubmit"
          class="form-spacing"
        >
          <n-form-item
            v-for="(field, index) in registerFields"
            :key="index"
            :label="field.label"
            :path="field.path"
          >
            <n-input
              v-model:value="registerForm[field.model]"
              :type="field.type || 'text'"
              :placeholder="field.placeholder"
            />
          </n-form-item>
        </n-form>
        <n-button block type="primary" @click="handleRegisterSubmit"
          >Đăng Ký</n-button
        >
      </div>
    </n-modal>
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
          <n-button @click="openRegisterModal" type="error" ghost
            >Đăng ký ngay</n-button
          >
        </div>
        <n-form
          ref="loginFormRef"
          :rules="loginRules"
          @submit="handleLoginSubmit"
          class="form-spacing"
        >
          <n-form-item label="Username hoặc Email:" path="identifier">
            <n-input
              v-model:value="loginForm.identifier"
              :type="'text'"
              placeholder="Nhập username hoặc email"
            />
          </n-form-item>
          <n-form-item label="Password:" path="password">
            <n-input
              v-model:value="loginForm.password"
              :type="'password'"
              placeholder="******"
            />
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="rememberMe">Nhớ tôi</n-checkbox>
          </n-form-item>
          <n-button block type="primary" @click="handleLoginSubmit"
            >Đăng Nhập</n-button
          >
        </n-form>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const showRegister = ref(false);
const showLogin = ref(false);
const rememberMe = ref(false);

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  repassword: '',
  fullname: '',
  nickname: '',
});

const registerFields = reactive([
  {
    label: 'Username:',
    path: 'username',
    model: 'username',
    placeholder: 'nhập username',
  },
  {
    label: 'Email address:',
    path: 'email',
    model: 'email',
    type: 'email',
    placeholder: 'nhập email',
  },
  {
    label: 'Password:',
    path: 'password',
    model: 'password',
    type: 'password',
    placeholder: '******',
  },
  {
    label: 'Nhập lại Password:',
    path: 'repassword',
    model: 'repassword',
    type: 'password',
    placeholder: '******',
  },
  {
    label: 'Họ tên:',
    path: 'fullname',
    model: 'fullname',
    placeholder: 'nhập họ tên',
  },
  {
    label: 'Tên hiển thị:',
    path: 'nickname',
    model: 'nickname',
    placeholder: 'nhập tên bạn muốn hiển thị',
  },
]);

const registerRules = {
  username: { required: true, message: 'Username is required' },
  email: { required: true, message: 'Email is required' },
  password: { required: true, message: 'Password is required' },
  repassword: { required: true, message: 'Repassword is required' },
  fullname: { required: true, message: 'Fullname is required' },
  nickname: { required: true, message: 'Nickname is required' },
};
const loginForm = ref({
  identifier: '',
  password: '',
});

const loginRules = {
  identifier: { required: true, message: 'Username or Email is required' },
  password: { required: true, message: 'Password is required' },
};

const registerFormRef = ref(null);
const loginFormRef = ref(null);

function handleRegisterSubmit() {
  registerFormRef.value.validate().then(() => {
    console.log('Register form data:', registerForm.value);
    closeRegisterModal();
  });
}

function handleLoginSubmit() {
  loginFormRef.value.validate().then(() => {
    console.log('Login form data:', loginForm.value);
    console.log('Remember Me:', rememberMe.value);
    closeLoginModal();
  });
}

function openRegisterModal() {
  showLogin.value = false;
  showRegister.value = true;
}

function openLoginModal() {
  showRegister.value = false;
  showLogin.value = true;
}

function closeRegisterModal() {
  showRegister.value = false;
  resetRegisterForm();
}

function closeLoginModal() {
  showLogin.value = false;
  resetLoginForm();
}

function resetRegisterForm() {
  registerForm.value = {
    username: '',
    email: '',
    password: '',
    repassword: '',
    fullname: '',
    nickname: '',
  };
}

function resetLoginForm() {
  loginForm.value = {
    identifier: '',
    password: '',
  };
  rememberMe.value = false;
}

const segmented = reactive({
  content: 'true',
  footer: 'soft',
});
</script>
