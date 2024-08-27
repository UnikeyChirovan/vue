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
        <span class="d-none d-sm-flex" style="color: white">QUẢN TRỊ</span>
      </div>
      <div
        class="col-sm-3 d-none d-sm-flex justify-content-center justify-content-sm-end"
      >
        <span>Admin</span>
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
import { ref } from 'vue';
import TheMenu from './TheMenu.vue';

const visible = ref(false);
const visible_user = ref(false);

const showDrawer = () => {
  visible.value = true;
};
const showDrawerUser = () => {
  visible_user.value = true;
};
</script>
