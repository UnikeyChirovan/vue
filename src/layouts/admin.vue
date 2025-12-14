<template>
  <TheHeader />
  <div class="profile-layout">
    <div class="layout-container">
      <!-- Mobile Dropdown Toggle Button -->
      <button
        class="mobile-menu-toggle"
        @click="isMenuOpen = !isMenuOpen"
        :class="{ active: isMenuOpen }"
      >
        <i class="fas fa-sliders-h"></i>
        <span>Bảng Điều Khiển</span>
        <i class="fas fa-chevron-down toggle-icon"></i>
      </button>

      <!-- Sidebar/Dropdown -->
      <aside class="sidebar" :class="{ 'mobile-open': isMenuOpen }">
        <div class="sidebar-header">
          <i class="fas fa-sliders-h"></i>
          <h3>Bảng Điều Khiển</h3>
        </div>
        <div class="menu-wrapper" @click="handleMenuClick">
          <TheMenu />
        </div>
      </aside>

      <!-- Overlay for mobile -->
      <div
        class="mobile-overlay"
        :class="{ active: isMenuOpen }"
        @click="isMenuOpen = false"
      ></div>

      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref } from 'vue';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import TheMenu from '../components/TheMenu.vue';

const isMenuOpen = ref(false);

const handleMenuClick = () => {
  // Close menu on mobile when clicking a menu item
  if (window.innerWidth <= 768) {
    isMenuOpen.value = false;
  }
};
</script>

<style scoped>
.profile-layout {
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.layout-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  position: relative;
}

/* ========== MOBILE TOGGLE BUTTON ========== */
.mobile-menu-toggle {
  display: none;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 20px;
  width: 100%;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.mobile-menu-toggle i:first-child {
  font-size: 20px;
}

.mobile-menu-toggle span {
  flex: 1;
  text-align: left;
}

.mobile-menu-toggle .toggle-icon {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.mobile-menu-toggle.active .toggle-icon {
  transform: rotate(180deg);
}

.mobile-menu-toggle:hover {
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.4);
  transform: translateY(-2px);
}

.mobile-menu-toggle:active {
  transform: translateY(0);
}

/* ========== MOBILE OVERLAY ========== */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-overlay.active {
  opacity: 1;
  pointer-events: all;
}

/* ========== SIDEBAR ========== */
.sidebar {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: fit-content;
  position: sticky;
  top: 100px;
  transition: all 0.3s ease;
}

.sidebar-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-header i {
  font-size: 24px;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.menu-wrapper {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

/* ========== MAIN CONTENT ========== */
.main-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 600px;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large Tablet and Below */
@media (max-width: 1024px) {
  .layout-container {
    grid-template-columns: 240px 1fr;
    gap: 20px;
  }

  .sidebar {
    top: 90px;
  }

  .sidebar-header {
    padding: 20px 16px;
  }

  .sidebar-header h3 {
    font-size: 16px;
  }
}

/* Tablet - Switch to Dropdown */
@media (max-width: 768px) {
  .profile-layout {
    padding: 15px;
  }

  .layout-container {
    grid-template-columns: 1fr;
    gap: 0;
  }

  /* Show mobile toggle button */
  .mobile-menu-toggle {
    display: flex;
  }

  /* Show overlay when menu is open */
  .mobile-overlay {
    display: block;
  }

  /* Transform sidebar into dropdown */
  .sidebar {
    position: fixed;
    top: -100%;
    left: 15px;
    right: 15px;
    z-index: 999;
    max-height: 70vh;
    opacity: 0;
    pointer-events: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .sidebar.mobile-open {
    top: 80px;
    opacity: 1;
    pointer-events: all;
  }

  .sidebar-header {
    padding: 16px;
  }

  .sidebar-header i {
    font-size: 20px;
  }

  .sidebar-header h3 {
    font-size: 15px;
  }

  .menu-wrapper {
    max-height: calc(70vh - 60px);
  }

  .main-content {
    min-height: 400px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .profile-layout {
    padding: 10px;
  }

  .mobile-menu-toggle {
    padding: 14px 16px;
    font-size: 15px;
    margin-bottom: 12px;
  }

  .mobile-menu-toggle i:first-child {
    font-size: 18px;
  }

  .sidebar {
    left: 10px;
    right: 10px;
    max-height: 80vh;
  }

  .sidebar.mobile-open {
    top: 70px;
  }

  .sidebar-header {
    padding: 14px 12px;
  }

  .sidebar-header i {
    font-size: 18px;
  }

  .sidebar-header h3 {
    font-size: 14px;
  }

  .menu-wrapper {
    max-height: calc(80vh - 55px);
  }

  .main-content {
    border-radius: 12px;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .mobile-menu-toggle {
    padding: 12px 14px;
    font-size: 14px;
  }

  .sidebar-header {
    padding: 12px 10px;
  }

  .sidebar-header h3 {
    font-size: 13px;
  }
}
</style>
