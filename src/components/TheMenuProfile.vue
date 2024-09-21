<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
  >
    <a-menu-item key="profile-info">
      <RouterLink :to="{ name: 'profile-info' }">
        <span><i class="fa-solid fa-user me-1"></i>Tài Khoản</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="profile-edit">
      <RouterLink :to="{ name: 'profile-edit' }">
        <span><i class="fa-solid fa-pen-to-square me-1"></i>Thay Đổi Thông Tin</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="profile-settings">
      <RouterLink :to="{ name: 'profile-settings' }">
        <span><i class="fa-solid fa-gear me-1"></i>Cài Đặt</span>
      </RouterLink>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMenuProfile } from '../stores/use-menu-profile';
const storepro = useMenuProfile();
const { selectedKeys, openKeys } = storeToRefs(storepro);
</script>
