<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
  >
    <a-menu-item key="admin-users">
      <RouterLink :to="{ name: 'admin-users' }">
        <span><i class="fa-solid fa-user me-1"></i>Tài Khoản</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-roles">
      <RouterLink :to="{ name: 'admin-roles' }">
        <span><i class="fa-solid fa-tag me-1"></i>Vai Trò</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-settings">
      <RouterLink :to="{ name: 'admin-settings' }">
        <span><i class="fa-solid fa-gear me-1"></i>Cài Đặt</span>
      </RouterLink>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMenu } from '../store/use-menu';
const store = useMenu();
const { selectedKeys, openKeys } = storeToRefs(store);
</script>
