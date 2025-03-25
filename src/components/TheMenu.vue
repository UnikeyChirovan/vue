<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
  >
    <a-menu-item key="admin-users">
      <RouterLink :to="{ name: 'admin-users' }">
        <span><i class="fa-solid fa-user me-1"></i>Quản lý tài khoản</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-mails">
      <RouterLink :to="{ name: 'admin-mails' }">
        <span><i class="fa-solid fa-heart me-1"></i>Danh sách Mails</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-news">
      <RouterLink :to="{ name: 'admin-news' }">
        <span><i class="fa-solid fa-bell me-1"></i> Quản lý thông báo</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-infos">
      <RouterLink :to="{ name: 'admin-infos' }">
        <span><i class="fa-solid fa-envelope me-1"></i>Thông báo qua mail</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-contents">
      <RouterLink :to="{ name: 'admin-contents' }">
        <span><i class="fa-solid fa-indent me-1"></i>Nội dung dài - About</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-company">
      <RouterLink :to="{ name: 'admin-company' }">
        <span><i class="fa-solid fa-layer-group me-1"></i>Thông tin công ty</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-categories">
      <RouterLink :to="{ name: 'admin-categories' }">
        <span><i class="fa-solid fa-list me-1"></i>Danh mục tên</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-stories">
      <RouterLink :to="{ name: 'admin-stories' }">
        <span><i class="fa-solid fa-tag me-1"></i>Quản lý chương truyện</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-images-manager">
      <RouterLink :to="{ name: 'admin-images-manager' }">
        <span><i class="fa-solid fa-images me-1"></i>Danh mục hình ảnh</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-images">
      <RouterLink :to="{ name: 'admin-images' }">
        <span><i class="fa-solid fa-image me-1"></i>Quản lý hình nền</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-videos">
      <RouterLink :to="{ name: 'admin-videos' }">
        <span><i class="fa-solid fa-film me-1"></i>Quản lý Video</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-contacts">
      <RouterLink :to="{ name: 'admin-contacts' }">
        <span><i class="fa-regular fa-paper-plane me-1"></i>Quản lý liên hệ</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-blacklists">
      <RouterLink :to="{ name: 'admin-blacklists' }">
        <span><i class="fa-solid fa-ban me-1"></i>Danh sách bị cấm</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-device-infos">
      <RouterLink :to="{ name: 'admin-device-infos' }">
        <span><i class="fa-solid fa-user-tag me-1"></i>Quản lý thiết bị</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-requests">
      <RouterLink :to="{ name: 'admin-requests' }">
        <span><i class="fa-solid fa-list-ul me-1"></i>Nhật ký Requests</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-settings">
      <RouterLink :to="{ name: 'admin-settings' }">
        <span><i class="fa-solid fa-gear me-1"></i>Cài đặt</span>
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
