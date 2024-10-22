<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
  >
    <a-menu-item key="admin-users">
      <RouterLink :to="{ name: 'admin-users' }">
        <span><i class="fa-solid fa-user me-1"></i>Accounts</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-news">
      <RouterLink :to="{ name: 'admin-news' }">
        <span><i class="fa-solid fa-bell me-1"></i> Notification</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-infos">
      <RouterLink :to="{ name: 'admin-infos' }">
        <span><i class="fa-solid fa-envelope me-1"></i>Newsletters</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-stories">
      <RouterLink :to="{ name: 'admin-stories' }">
        <span><i class="fa-solid fa-tag me-1"></i>Chapters</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-images">
      <RouterLink :to="{ name: 'admin-images' }">
        <span><i class="fa-solid fa-image me-1"></i>Backgrounds</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-contacts">
      <RouterLink :to="{ name: 'admin-contacts' }">
        <span><i class="fa-regular fa-paper-plane me-1"></i>Contacts</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-blacklists">
      <RouterLink :to="{ name: 'admin-blacklists' }">
        <span><i class="fa-solid fa-ban me-1"></i>Blacklists</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-device-infos">
      <RouterLink :to="{ name: 'admin-device-infos' }">
        <span><i class="fa-solid fa-user-tag me-1"></i>Device Infos</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-requests">
      <RouterLink :to="{ name: 'admin-requests' }">
        <span><i class="fa-solid fa-list-ul me-1"></i>Requests</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-settings">
      <RouterLink :to="{ name: 'admin-settings' }">
        <span><i class="fa-solid fa-gear me-1"></i>Settings</span>
      </RouterLink>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMenu } from '../stores/use-menu';
const store = useMenu();
const { selectedKeys, openKeys } = storeToRefs(store);
</script>
