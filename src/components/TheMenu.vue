<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    class="admin-menu"
  >
    <a-menu-item key="admin-support-statistics" class="menu-item">
      <RouterLink :to="{ name: 'admin-support-statistics' }" class="menu-link">
        <i class="fa-solid fa-headset menu-icon"></i>
        <span class="menu-text">QUẢN LÝ CSKH</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-users" class="menu-item">
      <RouterLink :to="{ name: 'admin-users' }" class="menu-link">
        <i class="fa-solid fa-user menu-icon"></i>
        <span class="menu-text">Quản lý tài khoản</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-mails" class="menu-item">
      <RouterLink :to="{ name: 'admin-mails' }" class="menu-link">
        <i class="fa-solid fa-heart menu-icon"></i>
        <span class="menu-text">Danh sách Mails</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-news" class="menu-item">
      <RouterLink :to="{ name: 'admin-news' }" class="menu-link">
        <i class="fa-solid fa-bell menu-icon"></i>
        <span class="menu-text">Quản lý thông báo</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-infos" class="menu-item">
      <RouterLink :to="{ name: 'admin-infos' }" class="menu-link">
        <i class="fa-solid fa-envelope menu-icon"></i>
        <span class="menu-text">Thông báo qua mail</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-contents" class="menu-item">
      <RouterLink :to="{ name: 'admin-contents' }" class="menu-link">
        <i class="fa-solid fa-indent menu-icon"></i>
        <span class="menu-text">Nội dung dài - About</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-company" class="menu-item">
      <RouterLink :to="{ name: 'admin-company' }" class="menu-link">
        <i class="fa-solid fa-layer-group menu-icon"></i>
        <span class="menu-text">Thông tin công ty</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-categories" class="menu-item">
      <RouterLink :to="{ name: 'admin-categories' }" class="menu-link">
        <i class="fa-solid fa-list menu-icon"></i>
        <span class="menu-text">Danh mục tên</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-stories" class="menu-item">
      <RouterLink :to="{ name: 'admin-stories' }" class="menu-link">
        <i class="fa-solid fa-tag menu-icon"></i>
        <span class="menu-text">Quản lý chương truyện</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-images-manager" class="menu-item">
      <RouterLink :to="{ name: 'admin-images-manager' }" class="menu-link">
        <i class="fa-solid fa-images menu-icon"></i>
        <span class="menu-text">Danh mục hình ảnh</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-images" class="menu-item">
      <RouterLink :to="{ name: 'admin-images' }" class="menu-link">
        <i class="fa-solid fa-image menu-icon"></i>
        <span class="menu-text">Quản lý hình nền</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-videos" class="menu-item">
      <RouterLink :to="{ name: 'admin-videos' }" class="menu-link">
        <i class="fa-solid fa-film menu-icon"></i>
        <span class="menu-text">Quản lý Video</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-music-albums" class="menu-item">
      <RouterLink :to="{ name: 'admin-music-albums' }" class="menu-link">
        <i class="fa-solid fa-compact-disc menu-icon"></i>
        <span class="menu-text">Quản lý Album nhạc</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-music-tracks" class="menu-item">
      <RouterLink :to="{ name: 'admin-music-tracks' }" class="menu-link">
        <i class="fa-solid fa-music menu-icon"></i>
        <span class="menu-text">Quản lý Bài hát</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-contacts" class="menu-item">
      <RouterLink :to="{ name: 'admin-contacts' }" class="menu-link">
        <i class="fa-regular fa-paper-plane menu-icon"></i>
        <span class="menu-text">Quản lý liên lạc</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-blacklists" class="menu-item">
      <RouterLink :to="{ name: 'admin-blacklists' }" class="menu-link">
        <i class="fa-solid fa-ban menu-icon"></i>
        <span class="menu-text">Danh sách bị cấm</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-device-infos" class="menu-item">
      <RouterLink :to="{ name: 'admin-device-infos' }" class="menu-link">
        <i class="fa-solid fa-user-tag menu-icon"></i>
        <span class="menu-text">Quản lý thiết bị</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-requests" class="menu-item">
      <RouterLink :to="{ name: 'admin-requests' }" class="menu-link">
        <i class="fa-solid fa-list-ul menu-icon"></i>
        <span class="menu-text">Nhật ký Requests</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="admin-settings" class="menu-item">
      <RouterLink :to="{ name: 'admin-settings' }" class="menu-link">
        <i class="fa-solid fa-gear menu-icon"></i>
        <span class="menu-text">Cài đặt</span>
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

<style scoped>
/* ========== ADMIN MENU STYLING ========== */
.admin-menu {
  background: transparent !important;
  border-right: none !important;
}

/* Light Mode Menu */
.admin-menu :deep(.ant-menu-item) {
  margin: 8px 0;
  border-radius: 12px;
  padding: 12px 16px !important;
  height: auto !important;
  line-height: 1.5 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

html.dark-mode .admin-menu :deep(.ant-menu-item) {
  background: #1e293b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.admin-menu :deep(.ant-menu-item:hover) {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.15);
}

html.dark-mode .admin-menu :deep(.ant-menu-item:hover) {
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%) !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.admin-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%) !important;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.3);
}

html.dark-mode .admin-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
}

.admin-menu :deep(.ant-menu-item-selected .menu-link) {
  color: white !important;
}

.admin-menu :deep(.ant-menu-item-selected .menu-icon) {
  color: white !important;
}

/* Menu Link Styling */
.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

html.dark-mode .menu-link {
  color: #e2e8f0;
}

.menu-icon {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
  color: #0c713d;
  transition: all 0.3s ease;
}

html.dark-mode .menu-icon {
  color: #10b981;
}

.menu-text {
  flex: 1;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Hover State for Non-Selected Items */
.admin-menu
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .menu-link) {
  color: #0c713d;
}

html.dark-mode
  .admin-menu
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .menu-link) {
  color: #10b981;
}

.admin-menu
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .menu-icon) {
  color: #0c713d;
  transform: scale(1.1);
}

html.dark-mode
  .admin-menu
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .menu-icon) {
  color: #10b981;
}

/* Remove default Ant Design styles */
.admin-menu :deep(.ant-menu-item::after) {
  display: none !important;
}

.admin-menu :deep(.ant-menu-item-active) {
  background: transparent !important;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .admin-menu :deep(.ant-menu-item) {
    padding: 10px 14px !important;
    margin: 6px 0;
  }

  .menu-icon {
    font-size: 16px;
    min-width: 22px;
  }

  .menu-text {
    font-size: 0.9rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .admin-menu :deep(.ant-menu-item) {
    padding: 10px 12px !important;
    margin: 6px 0;
    border-radius: 10px;
  }

  .menu-link {
    gap: 10px;
  }

  .menu-icon {
    font-size: 16px;
    min-width: 20px;
  }

  .menu-text {
    font-size: 0.875rem;
  }

  .admin-menu :deep(.ant-menu-item:hover) {
    transform: translateX(4px);
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .admin-menu :deep(.ant-menu-item) {
    padding: 8px 10px !important;
    margin: 5px 0;
    border-radius: 8px;
  }

  .menu-link {
    gap: 8px;
  }

  .menu-icon {
    font-size: 14px;
    min-width: 18px;
  }

  .menu-text {
    font-size: 0.825rem;
  }
}
</style>
