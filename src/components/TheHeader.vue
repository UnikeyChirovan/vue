<template>
  <div class="container-fluid">
    <div
      class="row align-items-center"
      style="background-color: #0c713d; padding: 1rem"
    >
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawer()"><i class="fa-solid fa-bars"></i></span>
      </div>
      <div
        class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start"
      >
        <img
          src="../assets/logo.png"
          alt="logo"
          height="32"
          width="34"
          class="me-1"
        />
        <div class="align-item-center justify-content-center">
          <ul class="m-0 p-0 d-sm-flex">
            <template v-for="item in listItem" :key="item.name">
              <li
                class="nav-item mx-2"
                v-if="
                  isAdmin ||
                  (isLoggedIn && !item.isAdmin) ||
                  (!isLoggedIn && !item.requiresLogin && !item.isAdmin)
                "
              >
                <router-link
                  class="nav-link text-white"
                  :to="{ name: item.link }"
                >
                  <i :class="item.icon"></i>
                  {{ item.name }}
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div
        class="col-sm-3 d-none d-sm-flex justify-content-center justify-content-sm-end"
      >
        <!-- <div id="user-info" class="mr-2"></div> hiện tên người dùng -->
        <n-space>
          <Register />
          <Login />
        </n-space>
      </div>
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawerUser">X</span>
      </div>
    </div>
  </div>
  <a-drawer v-model:visible="visible" title="DANH MỤC" placement="left">
    <TheMenu />
  </a-drawer>
  <a-drawer v-model:visible="visible_user" title="ADMIN" placement="right">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
<script setup>
import { ref, reactive } from 'vue';
import TheMenu from './TheMenu.vue';
import Login from './Login.vue';
import Register from './Register.vue';

const isLoggedIn = ref(true);
const isAdmin = ref(true);

const visible = ref(false);
const visible_user = ref(false);
const listItem = reactive([
  {
    name: 'Trang Chủ',
    link: 'home',
    icon: 'fas fa-home',
    requiresLogin: false,
    isAdmin: false,
  },
  {
    name: 'Liên Hệ',
    link: 'contact',
    icon: 'fas fa-envelope',
    requiresLogin: false,
    isAdmin: false,
  },
  {
    name: 'Giới Thiệu',
    link: 'about',
    icon: 'fas fa-info-circle',
    requiresLogin: false,
    isAdmin: false,
  },
  {
    name: 'Bản Đồ',
    link: 'maps',
    icon: 'fas fa-map',
    requiresLogin: false,
    isAdmin: false,
  },
  {
    name: 'Đọc Truyện',
    link: 'stories',
    icon: 'fas fa-book',
    requiresLogin: true,
    isAdmin: false,
  },
  {
    name: 'Cài Đặt',
    link: 'settings',
    icon: 'fas fa-cog',
    requiresLogin: true,
    isAdmin: false,
  },
  {
    name: 'Quản Lý',
    link: 'admin-users',
    icon: 'fas fa-user-secret',
    requiresLogin: false,
    isAdmin: true,
  },
]);
const showDrawer = () => {
  visible.value = true;
};
const showDrawerUser = () => {
  visible_user.value = true;
};
const modals = reactive({
  signupModal: false,
  loginModal: false,
});

const form = reactive({
  username: '',
  email: '',
  password: '',
  repassword: '',
  fullname: '',
  nickname: '',
});

const loginForm = reactive({
  input: '',
  password: '',
  rememberMe: false,
});

// const isLoggedIn = ref(false);

function openModal(modalName) {
  modals[modalName] = true;
}

function closeModal(modalName) {
  modals[modalName] = false;
}

function switchToLogin() {
  closeModal('signupModal');
  openModal('loginModal');
}

function switchToRegister() {
  closeModal('loginModal');
  openModal('signupModal');
}

function handleRegister() {
  console.log('Register form data:', form);
  // Xử lý đăng ký
}

function handleLogin() {
  console.log('Login form data:', loginForm);
  // Xử lý đăng nhập
}

function forgotPassword() {
  // Xử lý quên mật khẩu
}

function logout() {
  isLoggedIn.value = false;
  console.log('User logged out');
}
</script>
