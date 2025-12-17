<template>
  <div class="navbar-wrapper">
    <nav class="navbar-container">
      <div class="navbar-content">
        <!-- Mobile Menu Toggle (Navigation Items) -->
        <button class="mobile-toggle nav-toggle" @click="showDrawer()">
          <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Logo & Brand -->
        <div class="brand-section">
          <router-link class="logo-container" :to="{ name: 'home' }">
            <img :src="introImage" alt="logo" class="logo-image" />
          </router-link>

          <!-- Desktop Navigation -->
          <ul class="nav-menu desktop-menu">
            <template v-for="item in listItem" :key="item.name">
              <li
                class="nav-item"
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
                <router-link class="nav-link" :to="{ name: item.link }">
                  <i :class="item.icon" class="nav-icon"></i>
                  <span class="nav-text">{{ item.name }}</span>
                </router-link>
              </li>
            </template>
          </ul>
        </div>

        <!-- Auth Section (Desktop only >= 1024px) -->
        <div class="auth-section desktop-auth">
          <TheAuth
            @openRegister="showRegister = true"
            @openLogin="showLogin = true"
          />
        </div>

        <!-- Mobile/Tablet Auth Toggle (< 1024px, only when NOT logged in) -->
        <button
          v-if="!authStore.isLoggedIn"
          class="mobile-toggle mobile-auth-toggle"
          @click="showDrawerUser"
        >
          <i class="fa-solid fa-user-lock"></i>
        </button>

        <!-- Mobile/Tablet User Section (when logged in, < 1024px) -->
        <div v-if="authStore.isLoggedIn" class="mobile-user-section">
          <TheAuth
            @openRegister="showRegister = true"
            @openLogin="showLogin = true"
          />
        </div>
      </div>
    </nav>
  </div>

  <!-- Custom Drawer for Navigation Menu (Mobile/Tablet) -->
  <Transition name="drawer-fade">
    <div v-if="visible" class="drawer-overlay" @click="visible = false">
      <Transition name="drawer-slide">
        <div
          v-if="visible"
          class="custom-drawer drawer-left"
          :style="{ width: drawerWidth }"
          @click.stop
        >
          <div class="drawer-header">
            <h3 class="drawer-title">
              <i class="fa-solid fa-list-ul"></i>
              DANH MỤC
            </h3>
            <button class="drawer-close" @click="visible = false">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="drawer-body">
            <ul class="mobile-nav-list">
              <template v-for="item in listItem" :key="item.name">
                <li
                  class="mobile-nav-item"
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
                    class="mobile-nav-link"
                    :to="{ name: item.link }"
                    @click="visible = false"
                  >
                    <i :class="item.icon" class="mobile-nav-icon"></i>
                    <span class="mobile-nav-text">{{ item.name }}</span>
                    <i class="fa-solid fa-chevron-right mobile-nav-arrow"></i>
                  </router-link>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Custom Drawer for Auth (only when NOT logged in) -->
  <Transition name="drawer-fade">
    <div
      v-if="!authStore.isLoggedIn && visible_user"
      class="drawer-overlay"
      @click="visible_user = false"
    >
      <Transition name="drawer-slide-right">
        <div
          v-if="visible_user"
          class="custom-drawer drawer-right"
          :style="{ width: drawerWidth }"
          @click.stop
        >
          <div class="drawer-header">
            <h3 class="drawer-title">
              <i class="fa-solid fa-user-lock"></i>
              ĐĂNG NHẬP / ĐĂNG KÝ
            </h3>
            <button class="drawer-close" @click="visible_user = false">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="drawer-body">
            <div class="mobile-auth-container">
              <TheAuth
                @openRegister="showRegister = true"
                @openLogin="showLogin = true"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Auth Modals (Using Teleport - renders at body level) -->
  <AuthModals
    v-model:showRegister="showRegister"
    v-model:showLogin="showLogin"
  />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useLoadingStore } from '../stores/loadingStore';
import apiLinks from '../services/api-links';
import TheAuth from './TheAuth.vue';
import AuthModals from './AuthModals.vue';

const authStore = useAuthStore();

const visible = ref(false);
const visible_user = ref(false);
const showRegister = ref(false);
const showLogin = ref(false);

// Responsive drawer width
const drawerWidth = computed(() => {
  if (window.innerWidth < 480) return '85%';
  if (window.innerWidth < 768) return '70%';
  return '400px';
});

const listItem = reactive([
  {
    name: 'Trang Chủ',
    link: 'home',
    icon: 'fas fa-home',
    requiresLogin: false,
    isAdmin: false,
  },
  {
    name: 'Liên Lạc',
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
/* ===== BASE STYLES ===== */
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

/* Dark Mode for Navbar */
html.dark-mode .navbar-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

/* ===== LOGO SECTION ===== */
.brand-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 0;
  background: transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.logo-image {
  height: 48px;
  width: 50px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

html.dark-mode .logo-image {
  filter: drop-shadow(0 2px 6px rgba(255, 255, 255, 0.3));
}

/* ===== DESKTOP NAVIGATION ===== */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.5rem;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 400;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link:hover {
  color: #ffd700;
  transform: translateY(-2px);
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

html.dark-mode .nav-link:hover {
  color: #4ade80;
  text-shadow: 0 2px 8px rgba(74, 222, 128, 0.4);
}

.nav-link:hover .nav-icon {
  transform: scale(1.15) rotate(5deg);
  color: #ffd700;
}

html.dark-mode .nav-link:hover .nav-icon {
  color: #4ade80;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-weight: 600;
  box-shadow: inset 0 -3px 0 #ffd700;
}

html.dark-mode .nav-link.router-link-active,
html.dark-mode .nav-link.router-link-exact-active {
  background: rgba(74, 222, 128, 0.15);
  box-shadow: inset 0 -3px 0 #4ade80;
}

.nav-link.router-link-active .nav-icon,
.nav-link.router-link-exact-active .nav-icon {
  color: #ffd700;
}

html.dark-mode .nav-link.router-link-active .nav-icon,
html.dark-mode .nav-link.router-link-exact-active .nav-icon {
  color: #4ade80;
}

.nav-icon {
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-text {
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* ===== AUTH SECTION ===== */
.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ===== MOBILE TOGGLE BUTTONS ===== */
.mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  z-index: 10;
}

html.dark-mode .mobile-toggle {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.mobile-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

html.dark-mode .mobile-toggle:hover {
  background: rgba(74, 222, 128, 0.2);
}

.mobile-toggle:active {
  transform: scale(0.95);
}

/* ===== MOBILE USER SECTION (when logged in) ===== */
.mobile-user-section {
  display: none;
  align-items: center;
  flex-shrink: 0;
  z-index: 10;
}

/* Logo always centered when mobile auth toggle is visible (not logged in) */
.navbar-content:has(.mobile-auth-toggle) .brand-section {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  flex: 0;
  gap: 0;
}

/* Logo always centered when logged in on mobile/tablet */
.navbar-content:has(.mobile-user-section) .brand-section {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  flex: 0;
  gap: 0;
}

/* ===== CUSTOM DRAWER STYLES ===== */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  backdrop-filter: blur(4px);
}

html.dark-mode .drawer-overlay {
  background: rgba(0, 0, 0, 0.7);
}

.custom-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  background: #ffffff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  z-index: 2001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

html.dark-mode .custom-drawer {
  background: #1a1a1a;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
}

.drawer-left {
  left: 0;
}

.drawer-right {
  right: 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark-mode .drawer-header {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-title {
  margin: 0;
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: 0.5px;
}

html.dark-mode .drawer-title {
  color: #4ade80;
}

.drawer-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

html.dark-mode .drawer-close {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.drawer-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

html.dark-mode .drawer-close:hover {
  background: rgba(74, 222, 128, 0.2);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Custom scrollbar for drawer */
.drawer-body::-webkit-scrollbar {
  width: 8px;
}

.drawer-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

html.dark-mode .drawer-body::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.drawer-body::-webkit-scrollbar-thumb {
  background: #0c713d;
  border-radius: 4px;
}

html.dark-mode .drawer-body::-webkit-scrollbar-thumb {
  background: #4ade80;
}

.drawer-body::-webkit-scrollbar-thumb:hover {
  background: #0a5c32;
}

html.dark-mode .drawer-body::-webkit-scrollbar-thumb:hover {
  background: #22c55e;
}

/* ===== MOBILE DRAWER NAVIGATION ===== */
.mobile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-item {
  margin-bottom: 0.625rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: #333;
  text-decoration: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;
}

html.dark-mode .mobile-nav-link {
  background: #2a2a2a;
  color: #e5e5e5;
}

.mobile-nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #0c713d 0%, #0a5c32 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

html.dark-mode .mobile-nav-link::before {
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
}

.mobile-nav-link:hover {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  color: #ffffff;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

html.dark-mode .mobile-nav-link:hover {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #0d0d0d;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
}

.mobile-nav-link:hover::before {
  transform: scaleY(1);
}

.mobile-nav-link.router-link-active,
.mobile-nav-link.router-link-exact-active {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.4);
}

html.dark-mode .mobile-nav-link.router-link-active,
html.dark-mode .mobile-nav-link.router-link-exact-active {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #0d0d0d;
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.4);
}

.mobile-nav-link.router-link-active::before,
.mobile-nav-link.router-link-exact-active::before {
  transform: scaleY(1);
}

.mobile-nav-icon {
  font-size: 1.25rem;
  min-width: 24px;
  text-align: center;
  transition: transform 0.3s ease;
}

.mobile-nav-link:hover .mobile-nav-icon {
  transform: scale(1.2) rotate(5deg);
}

.mobile-nav-text {
  flex: 1;
}

.mobile-nav-arrow {
  font-size: 0.875rem;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.mobile-nav-link:hover .mobile-nav-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* ===== MOBILE AUTH CONTAINER ===== */
.mobile-auth-container {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== DRAWER TRANSITIONS ===== */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-enter-from {
  transform: translateX(-100%);
}

.drawer-slide-leave-to {
  transform: translateX(-100%);
}

.drawer-slide-right-enter-active,
.drawer-slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-right-enter-from {
  transform: translateX(100%);
}

.drawer-slide-right-leave-to {
  transform: translateX(100%);
}

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* Small Mobile (< 480px) */
@media (max-width: 479px) {
  .navbar-content {
    padding: 0.625rem 0.75rem;
  }

  .desktop-menu,
  .desktop-auth {
    display: none !important;
  }

  .mobile-toggle {
    display: flex;
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }

  .mobile-user-section {
    display: flex;
  }

  .logo-image {
    height: 40px;
    width: 42px;
  }

  .mobile-nav-link {
    padding: 0.875rem 1rem;
    font-size: 0.9375rem;
  }

  .mobile-nav-icon {
    font-size: 1.125rem;
  }

  .drawer-header {
    padding: 1rem 1.25rem;
  }

  .drawer-title {
    font-size: 1rem;
  }

  .drawer-body {
    padding: 0.75rem;
  }
}

/* Mobile (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .navbar-content {
    padding: 0.75rem 1rem;
  }

  .desktop-menu,
  .desktop-auth {
    display: none !important;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-user-section {
    display: flex;
  }

  .logo-image {
    height: 44px;
    width: 46px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .navbar-content {
    padding: 0.875rem 1.25rem;
  }

  .desktop-auth,
  .desktop-menu {
    display: none !important;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-user-section {
    display: flex;
  }

  .brand-section {
    gap: 1rem;
  }

  .logo-image {
    height: 46px;
    width: 48px;
  }
}

/* Small Laptop (1024px - 1279px) */
@media (min-width: 1024px) and (max-width: 1279px) {
  .navbar-content {
    padding: 0.875rem 1.5rem;
  }

  .mobile-toggle {
    display: none !important;
  }

  .mobile-user-section {
    display: none !important;
  }

  .desktop-menu,
  .desktop-auth {
    display: flex !important;
  }

  .brand-section {
    position: static !important;
    transform: none !important;
    flex: 1 !important;
    gap: 1rem !important;
  }

  .nav-menu {
    gap: 0;
  }

  .nav-link {
    padding: 0.5rem 0.4rem;
    font-size: 0.875rem;
    gap: 0.3rem;
  }

  .nav-icon {
    font-size: 0.9375rem;
  }
}

/* Desktop (1280px+) */
@media (min-width: 1280px) {
  .mobile-toggle {
    display: none !important;
  }

  .mobile-user-section {
    display: none !important;
  }

  .desktop-menu,
  .desktop-auth {
    display: flex !important;
  }

  .brand-section {
    position: static !important;
    transform: none !important;
    flex: 1 !important;
    gap: 1rem !important;
  }

  .nav-menu {
    gap: 0;
  }

  .nav-link {
    padding: 0.5rem 0.5rem;
  }
}

/* Large Desktop (1440px+) - Phần còn thiếu */
@media (min-width: 1440px) {
  .navbar-content {
    padding: 1rem 2rem;
  }

  .brand-section {
    gap: 1.5rem !important;
  }

  .nav-menu {
    gap: 0.125rem;
  }

  .nav-link {
    padding: 0.625rem 0.75rem;
    font-size: 1rem;
    gap: 0.5rem;
  }

  .nav-icon {
    font-size: 1.125rem;
  }

  .logo-image {
    height: 52px;
    width: 54px;
  }
}

/* ===== ANIMATIONS ===== */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-item {
  animation: slideIn 0.3s ease forwards;
}

.nav-item:nth-child(1) {
  animation-delay: 0.05s;
}
.nav-item:nth-child(2) {
  animation-delay: 0.1s;
}
.nav-item:nth-child(3) {
  animation-delay: 0.15s;
}
.nav-item:nth-child(4) {
  animation-delay: 0.2s;
}
.nav-item:nth-child(5) {
  animation-delay: 0.25s;
}
.nav-item:nth-child(6) {
  animation-delay: 0.3s;
}
.nav-item:nth-child(7) {
  animation-delay: 0.35s;
}
.nav-item:nth-child(8) {
  animation-delay: 0.4s;
}
</style>
