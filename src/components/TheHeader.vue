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
          <div class="logo-container">
            <img :src="introImage" alt="logo" class="logo-image" />
          </div>

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
          <TheAuth />
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
          <TheAuth />
        </div>
      </div>
    </nav>
  </div>

  <!-- Drawer for Navigation Menu (Mobile/Tablet) -->
  <a-drawer
    v-model:visible="visible"
    title="DANH MỤC"
    placement="left"
    :width="drawerWidth"
  >
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
          </router-link>
        </li>
      </template>
    </ul>
  </a-drawer>

  <!-- Drawer for Auth (only when NOT logged in) -->
  <a-drawer
    v-if="!authStore.isLoggedIn"
    v-model:visible="visible_user"
    title="ĐĂNG NHẬP / ĐĂNG KÝ"
    placement="right"
    :width="drawerWidth"
  >
    <div class="mobile-auth-container">
      <TheAuth />
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useLoadingStore } from '../stores/loadingStore';
import apiLinks from '../services/api-links';
import TheAuth from './TheAuth.vue';

const authStore = useAuthStore();

const visible = ref(false);
const visible_user = ref(false);

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
    name: 'Liên Hệ',
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

/* ===== DESKTOP NAVIGATION ===== */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 0;
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

.nav-link:hover .nav-icon {
  transform: scale(1.15) rotate(5deg);
  color: #ffd700;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-weight: 600;
  box-shadow: inset 0 -3px 0 #ffd700;
}

.nav-link.router-link-active .nav-icon,
.nav-link.router-link-exact-active .nav-icon {
  color: #ffd700;
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

.mobile-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
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

/* ===== MOBILE DRAWER NAVIGATION ===== */
.mobile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-item {
  margin-bottom: 0.5rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: #f5f5f5;
}

.mobile-nav-link:hover {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  color: #ffffff;
  transform: translateX(5px);
}

.mobile-nav-link.router-link-active,
.mobile-nav-link.router-link-exact-active {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(12, 113, 61, 0.3);
}

.mobile-nav-icon {
  font-size: 1.25rem;
  min-width: 24px;
  text-align: center;
}

.mobile-nav-text {
  flex: 1;
}

/* ===== MOBILE AUTH CONTAINER ===== */
.mobile-auth-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
    padding: 0.875rem;
    font-size: 0.9375rem;
  }

  .mobile-nav-icon {
    font-size: 1.125rem;
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

  /* Hide desktop auth and menu */
  .desktop-auth,
  .desktop-menu {
    display: none !important;
  }

  /* Show mobile toggles */
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

  /* Reset brand-section for desktop */
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

  /* Reset brand-section for desktop */
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

/* Large Desktop (1440px+) */
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
