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
        <img :src="introImage" alt="logo" height="32" width="34" class="me-1" />
        <div class="align-item-center justify-content-center">
          <ul class="m-0 p-0 d-sm-flex">
            <template v-for="item in listItem" :key="item.name">
              <li
                class="nav-item mx-2"
                v-if="
                  (!item.requiresLogin && !item.isAdmin && !item.isManager) ||
                  (authStore.isLoggedIn &&
                    item.requiresLogin &&
                    !item.isAdmin &&
                    !item.isManager) ||
                  (authStore.isManager && !item.isAdmin) ||
                  authStore.isAdmin
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
        <n-space>
          <TheAuth />
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
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import TheMenu from './TheMenu.vue';
import { useAuthStore } from '../stores/auth';
import { useLoadingStore } from '../stores/loadingStore';
import apiLinks from '../services/api-links';
import TheAuth from './TheAuth.vue';

const authStore = useAuthStore();

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
    name: 'Hoạt Hình',
    link: 'animators',
    icon: 'fas fa-film',
    requiresLogin: true,
    isAdmin: false,
  },
  {
    name: 'Hỗ Trợ',
    link: 'support-dashboard',
    icon: 'fas fa-headset',
    requiresLogin: true,
    isAdmin: false,
    isManager: true,
  },

  {
    name: 'Quản Lý',
    link: 'admin-dashboard',
    icon: 'fas fa-user-secret',
    requiresLogin: false,
    isAdmin: true,
    isManager: false,
  },
]);

const showDrawer = () => {
  visible.value = true;
};
const showDrawerUser = () => {
  visible_user.value = true;
};

const loadingStore = useLoadingStore();
const introImage = ref(null);

const fetchIntroImage = async () => {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  const intro = images.find((img) => img.image_name === 'LOGO');

  if (intro) {
    introImage.value = `http://127.0.0.1:8000/storage/${intro.image_path}`;
  } else {
    try {
      const response = await apiLinks.imageManager.getImages();
      localStorage.setItem('images', JSON.stringify(response.data));
      images = response.data || [];
      const updatedIntro = images.find((img) => img.image_name === 'LOGO');
      if (updatedIntro) {
        introImage.value = `http://127.0.0.1:8000/storage/${updatedIntro.image_path}`;
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu hình ảnh:', error);
    }
  }
};

onMounted(() => {
  fetchIntroImage();
});
</script>

<style scoped>
.container-fluid {
  margin: 0;
  /* padding: 0; */
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
