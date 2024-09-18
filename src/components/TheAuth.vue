<template>
  <div>
    <!-- Nút Đăng Ký -->
    <n-button
      v-if="!auth.isLoggedIn"
      @click="showRegister = true"
      ghost
      style="color: white"
      class="me-1"
    >
      <i class="fa-solid fa-user-plus me-2"></i> Đăng Ký
    </n-button>

    <!-- Modal Đăng Ký -->
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
          <n-button @click="openLoginModal" type="error" ghost>
            Đăng nhập ngay
          </n-button>
        </div>
        <!-- Form đăng ký -->
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
            v-bind="field.type === 'password' ? { 'show-password-on': 'click' } : {}"
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

    <!-- Nút Đăng Nhập -->
    <n-button
      v-if="!auth.isLoggedIn"
      @click="showLogin = true"
      ghost
      style="color: white"
    >
      <i class="fa-solid fa-arrow-right-to-bracket me-2"></i> Đăng Nhập
    </n-button>

    <!-- Modal Đăng Nhập -->
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
          <n-button @click="openRegisterModal" type="error" ghost>
            Đăng ký ngay
          </n-button>
        </div>
        <!-- Form đăng nhập -->
        <n-form
          @submit.prevent="handleLoginSubmit"
          @keyup.enter="handleLoginSubmit"
        >
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
              placeholder="nhập password"
              show-password-on="click"
            />
          </n-form-item>
          <div v-if="errorsLogin.password" class="error">
            {{ errorsLogin.password[0] }}
          </div>
          <div class="row mb-2">
            <div class="col-12 col-sm-6">
              <n-checkbox v-model:checked="rememberMe">
                Remember me
              </n-checkbox>
            </div>
            <div class="col-12 col-sm-6 d-sm-flex justify-content-sm-center">
              <router-link to="/password-reset-request">Quên mật khẩu?</router-link>
            </div>
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
    <div class="profile m-0 p-0" v-if="auth.isLoggedIn">
      <span class="me-2 text-danger">
        {{ 'Welcome, ' + auth.user.nickname }}
      </span>
      <n-dropdown :options="options" @select="handleSelect">
        <n-button type="error"><i class="fa-regular fa-user"></i></n-button>
      </n-dropdown>
    </div>
  </div>

</template>

<script setup>
  import { ref, reactive } from 'vue';
  import { useMessage } from 'naive-ui';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  const auth = useAuthStore();

  const router = useRouter();

  const showRegister = ref(false);
  const showLogin = ref(false);
  const users = reactive({
    username: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    nickname: '',
    status_id: 5,
    department_id: 2,
  });
  const loading = ref(false);
  const errors = ref({});
  const errorsLogin = ref({});
  const usernameOrEmail = ref('');
  const password = ref('');
  const rememberMe = ref(false);
  const message = useMessage();

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

  function handleRegisterSubmit() {
    loading.value = true;
    
    // Gọi API đăng ký
    axios.post('http://127.0.0.1:8000/api/auth/register', users)
      .then((res) => {
        console.log("user: ", users);
        console.log(res)
        if (res.status === 200) {
          message.success(res.data.message);
          resetRegisterForm();
          closeRegisterModal();
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          console.log('Lỗi validation:', err.response.data.errors); // Hiển thị chi tiết lỗi validation
          errors.value = err.response.data.errors;
        } else {
          console.log('Lỗi đăng ký', err); // Hiển thị lỗi khác nếu có
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
        username_or_email: usernameOrEmail.value,
        password: password.value,
        rememberMe: rememberMe.value,
      });
      console.log('dữ liệu', response)
      const accessToken = response.data.access_token;
      const user = response.data.user;
      const isAdmin = response.data.isAdmin;
      // const rememberMe = response.data.rememberMe;
      auth.login(user, isAdmin, accessToken, rememberMe.value);
      message.success('Đăng nhập thành công!');
      resetLoginForm();
      closeLoginModal();
      router.push({ name: 'home' });
    } catch (error) {
      console.log('Lỗi backend', error);
      if (error.response) {
        if (error.response.data && error.response.data.errors) {
          errorsLogin.value = error.response.data.errors;
          console.log('Lỗi chi tiết:', errorsLogin.value);
        } else {
          errorsLogin.value = {};
        }
        if (error.response.status === 401) {
          message.warning('Tài khoản hoặc mật khẩu không chính xác');
        } else if (error.response.status === 403) {
          message.error(error.response.data.message);
          resetLoginForm();
          closeLoginModal();
        } else {
          message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
      } else {
        message.error('Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.');
      }
    }
  };


  function openLoginModal() {
    showRegister.value = false;
    showLogin.value = true;
  }

  function openRegisterModal() {
    showLogin.value = false;
    showRegister.value = true;
  }

  function closeRegisterModal() {
    showRegister.value = false;
    // resetRegisterForm();
  }

  function closeLoginModal() {
    showLogin.value = false;
    // resetLoginForm();
  }

  function resetRegisterForm() {
    Object.keys(users).forEach((key) => {
      users[key] = key === 'status_id' ? 5 : key === 'department_id' ? 2 : '';
    });
    errors.value = {};
  }

  function resetLoginForm() {
    usernameOrEmail.value = '';
    password.value = '';
    errorsLogin.value = {};
  }

  const segmented = reactive({
    content: true,
    footer: 'soft',
  });

  import { h } from 'vue';
  import { NIcon } from 'naive-ui';
  import {
    Settings as SettingsIcon,
    LogOutOutline as LogoutIcon,
    PersonCircleOutline as UserIcon,
  } from '@vicons/ionicons5';

  function renderIcon(icon) {
    return () => {
      return h(NIcon, null, {
        default: () => h(icon),
      });
    };
  }

  const options = [
    {
      label: 'Profile',
      key: 'profile',
      icon: renderIcon(UserIcon),
    },
    {
      label: 'Settings',
      key: 'settings',
      icon: renderIcon(SettingsIcon),
    },
    {
      label: 'Logout',
      key: 'logout',
      icon: renderIcon(LogoutIcon),
    },
  ];

  async function handleSelect(key) {
    const authStore = useAuthStore();

    switch (key) {
      case 'profile':
        router.push({ name: 'profile' });
        break;
      case 'settings':
        router.push({ name: 'settings' });
        break;
      case 'logout':
        try {
          await authStore.logout(); 
          router.push({ name: 'home' });
          message.success('Đăng xuất thành công, hẹn gặp lại!')
        } catch (error) {
          message.error("Xin lỗi về sự bất tiện")
        }
        break;
      default:
        router.push({ name: 'home' });
        break;
    }
  }


</script>

<style scoped>
.primary-button {
  background-color: #007bff;
  color: #fff;
}
</style>
