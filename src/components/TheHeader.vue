<template>
  <div class="container-fluid">
    <div
      class="row align-items-center"
      style="background-color: #0c713d; padding: 1rem"
    >
      <div class="col-1 d-flex d-sm-none align-items-center justify-content-center">
        <span @click="showDrawer()"><i class="fa-solid fa-bars"></i></span>
      </div>
      <div class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start">
        <img :src="introImage" alt="logo" height="32" width="34" class="me-1" />
        <div class="align-item-center justify-content-center">
          <ul class="m-0 p-0 d-sm-flex">
            <template v-for="item in listItem" :key="item.name">
              <li
                class="nav-item mx-2"
                v-if="
                  authStore.isAdmin ||
                  (authStore.isLoggedIn && !item.isAdmin) ||
                  (!authStore.isLoggedIn && !item.requiresLogin && !item.isAdmin)
                "
              >
                <router-link class="nav-link text-white" :to="{ name: item.link }">
                  <i :class="item.icon"></i>
                  {{ item.name }}
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div class="col-sm-3 d-none d-sm-flex justify-content-center justify-content-sm-end">
        <n-space>
          <TheAuth />
        </n-space>
      </div>
      <div class="col-1 d-flex d-sm-none align-items-center justify-content-center">
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
  { name: 'Trang Chủ', link: 'home', icon: 'fas fa-home', requiresLogin: false, isAdmin: false },
  { name: 'Liên Hệ', link: 'contact', icon: 'fas fa-envelope', requiresLogin: false, isAdmin: false },
  { name: 'Giới Thiệu', link: 'about', icon: 'fas fa-info-circle', requiresLogin: false, isAdmin: false },
  { name: 'Bản Đồ', link: 'maps', icon: 'fas fa-map', requiresLogin: false, isAdmin: false },
  { name: 'Đọc Truyện', link: 'stories', icon: 'fas fa-book', requiresLogin: true, isAdmin: false },
  { name: 'Quản Lý', link: 'admin-users', icon: 'fas fa-user-secret', requiresLogin: false, isAdmin: true },
]);

const showDrawer = () => {
  visible.value = true;
};
const showDrawerUser = () => {
  visible_user.value = true;
};


const loadingStore = useLoadingStore();
const introImage = ref(null); 
let checkCount = 0;
const maxChecks = 10; 
const intervalTime = 1000; 

const checkIntroImage = async () => {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  const intro = images.find(img => img.image_name === 'LOGO');
  
  if (intro) {
    introImage.value = `http://127.0.0.1:8000/storage/${intro.image_path}`;
    clearInterval(intervalId);
  } else if (checkCount >= maxChecks) {
    await loadingStore.checkAndUpdateData(apiLinks.imageManager.getImages, 'images');
    images = JSON.parse(localStorage.getItem('images')) || [];
    const updatedIntro = images.find(img => img.image_name === 'LOGO');
    
    if (updatedIntro) {
      introImage.value = `http://127.0.0.1:8000/storage/${updatedIntro.image_path}`;
    }
    clearInterval(intervalId); 
  }
  checkCount++;
};

let intervalId;
onMounted(() => {
  intervalId = setInterval(checkIntroImage, intervalTime);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
<style scoped>
.container-fluid{
  margin: 0;
  /* padding: 0; */
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>