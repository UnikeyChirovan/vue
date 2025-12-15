<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    class="profile-menu"
  >
    <a-menu-item key="profile-info" class="menu-item">
      <RouterLink :to="{ name: 'profile-info' }" class="menu-link">
        <i class="fa-solid fa-user menu-icon"></i>
        <span class="menu-text">Tài Khoản</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="profile-edit" class="menu-item">
      <RouterLink :to="{ name: 'profile-edit' }" class="menu-link">
        <i class="fa-solid fa-pen-to-square menu-icon"></i>
        <span class="menu-text">Thay Đổi Thông Tin</span>
      </RouterLink>
    </a-menu-item>
    <a-menu-item key="profile-settings" class="menu-item">
      <RouterLink :to="{ name: 'profile-settings' }" class="menu-link">
        <i class="fa-solid fa-gear menu-icon"></i>
        <span class="menu-text">Cài Đặt</span>
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

<style scoped>
/* ========== PROFILE MENU STYLING ========== */
.profile-menu {
  background: transparent !important;
  border-right: none !important;
}

/* Light Mode Menu */
.profile-menu :deep(.ant-menu-item) {
  margin: 10px 0;
  border-radius: 14px;
  padding: 16px 20px !important;
  height: auto !important;
  line-height: 1.5 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
}

html.dark-mode .profile-menu :deep(.ant-menu-item) {
  background: #1e293b;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.profile-menu :deep(.ant-menu-item:hover) {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
  transform: translateX(10px) scale(1.02);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.2);
  border-color: #0c713d;
}

html.dark-mode .profile-menu :deep(.ant-menu-item:hover) {
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%) !important;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
  border-color: #10b981;
}

.profile-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%) !important;
  box-shadow: 0 6px 24px rgba(12, 113, 61, 0.35);
  border-color: #0c713d;
  transform: scale(1.03);
}

html.dark-mode .profile-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  box-shadow: 0 6px 24px rgba(16, 185, 129, 0.45);
  border-color: #10b981;
}

.profile-menu :deep(.ant-menu-item-selected .menu-link) {
  color: white !important;
}

.profile-menu :deep(.ant-menu-item-selected .menu-icon) {
  color: white !important;
  transform: scale(1.15);
}

/* Menu Link Styling */
.menu-link {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s ease;
}

html.dark-mode .menu-link {
  color: #e2e8f0;
}

.menu-icon {
  font-size: 20px;
  min-width: 28px;
  text-align: center;
  color: #0c713d;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(12, 113, 61, 0.1);
  border-radius: 10px;
}

html.dark-mode .menu-icon {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
}

.menu-text {
  flex: 1;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Hover State for Non-Selected Items */
.profile-menu
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .menu-link) {
  color: #0c713d;
}

html.dark-mode
  .profile-menu
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .menu-link) {
  color: #10b981;
}

.profile-menu
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .menu-icon) {
  color: white;
  background: #0c713d;
  transform: rotate(5deg) scale(1.1);
}

html.dark-mode
  .profile-menu
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .menu-icon) {
  background: #10b981;
}

/* Selected State Icon */
.profile-menu :deep(.ant-menu-item-selected .menu-icon) {
  background: rgba(255, 255, 255, 0.2);
}

/* Remove default Ant Design styles */
.profile-menu :deep(.ant-menu-item::after) {
  display: none !important;
}

.profile-menu :deep(.ant-menu-item-active) {
  background: transparent !important;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .profile-menu :deep(.ant-menu-item) {
    padding: 14px 18px !important;
    margin: 8px 0;
    border-radius: 12px;
  }

  .menu-link {
    gap: 14px;
    font-size: 0.95rem;
  }

  .menu-icon {
    font-size: 18px;
    width: 36px;
    height: 36px;
    min-width: 36px;
  }

  .menu-text {
    font-size: 0.95rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .profile-menu :deep(.ant-menu-item) {
    padding: 12px 16px !important;
    margin: 8px 0;
    border-radius: 10px;
  }

  .menu-link {
    gap: 12px;
    font-size: 0.9rem;
  }

  .menu-icon {
    font-size: 16px;
    width: 34px;
    height: 34px;
    min-width: 34px;
    border-radius: 8px;
  }

  .menu-text {
    font-size: 0.9rem;
  }

  .profile-menu :deep(.ant-menu-item:hover) {
    transform: translateX(6px) scale(1.01);
  }

  .profile-menu :deep(.ant-menu-item-selected) {
    transform: scale(1.02);
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .profile-menu :deep(.ant-menu-item) {
    padding: 10px 14px !important;
    margin: 6px 0;
    border-radius: 8px;
  }

  .menu-link {
    gap: 10px;
    font-size: 0.875rem;
  }

  .menu-icon {
    font-size: 15px;
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 7px;
  }

  .menu-text {
    font-size: 0.875rem;
  }

  .profile-menu :deep(.ant-menu-item:hover) {
    transform: translateX(4px) scale(1);
  }

  .profile-menu :deep(.ant-menu-item-selected) {
    transform: scale(1.01);
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .profile-menu :deep(.ant-menu-item) {
    padding: 8px 12px !important;
    margin: 5px 0;
  }

  .menu-link {
    gap: 8px;
    font-size: 0.825rem;
  }

  .menu-icon {
    font-size: 14px;
    width: 30px;
    height: 30px;
    min-width: 30px;
  }

  .menu-text {
    font-size: 0.825rem;
  }
}
</style>
