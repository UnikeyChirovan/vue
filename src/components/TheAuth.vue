<template>
  <div class="auth-wrapper">
    <!-- Not Logged In - Buttons -->
    <div v-if="!auth.isLoggedIn" class="auth-buttons">
      <button @click="emit('openRegister')" class="auth-btn register-btn">
        <i class="fa-solid fa-user-plus"></i>
        <span class="btn-text">Đăng Ký</span>
      </button>

      <button @click="emit('openLogin')" class="auth-btn login-btn">
        <i class="fa-solid fa-arrow-right-to-bracket"></i>
        <span class="btn-text">Đăng Nhập</span>
      </button>
    </div>

    <!-- Logged In - Profile Menu with Dropdown -->
    <div class="profile-section" v-if="auth.isLoggedIn">
      <span class="welcome-text">
        <i class="fa-solid fa-hand-wave"></i>
        Xin chào, {{ auth.user.nickname }}
      </span>

      <div class="profile-dropdown" ref="dropdownRef">
        <button @click="toggleDropdown" class="profile-btn">
          <img
            :src="displayAvatar"
            alt="User Avatar"
            class="profile-avatar"
            @error="handleAvatarError"
          />
        </button>

        <!-- FIXED: Sử dụng Teleport để đưa dropdown ra ngoài stacking context -->
        <Teleport to="body">
          <transition name="dropdown-fade">
            <div
              v-if="dropdownOpen"
              class="dropdown-menu"
              :style="dropdownStyle"
            >
              <button @click="handleSelect('profile')" class="dropdown-item">
                <i class="fa-regular fa-user"></i>
                <span>Profile</span>
              </button>
              <button @click="handleSelect('settings')" class="dropdown-item">
                <i class="fa-solid fa-gear"></i>
                <span>Settings</span>
              </button>
              <div class="dropdown-divider"></div>
              <button
                @click="handleSelect('logout')"
                class="dropdown-item logout"
              >
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            </div>
          </transition>
        </Teleport>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useProfileStore } from '../stores/profile';
import { useMessage } from 'naive-ui';

const emit = defineEmits(['openRegister', 'openLogin']);

const auth = useAuthStore();
const profileStore = useProfileStore();
const router = useRouter();
const message = useMessage();

const dropdownOpen = ref(false);
const dropdownRef = ref(null);
const dropdownStyle = ref({});

// Computed để hiển thị avatar - ưu tiên avatar từ profileStore
const displayAvatar = computed(() => {
  if (profileStore.avatarUrl) {
    return profileStore.avatarUrl;
  }

  return (
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(auth.user?.nickname || 'User') +
    '&background=0c713d&color=fff&size=128'
  );
});

function handleAvatarError(e) {
  e.target.src =
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(auth.user?.nickname || 'User') +
    '&background=0c713d&color=fff&size=128';
}

function updateDropdownPosition() {
  if (dropdownRef.value && dropdownOpen.value) {
    const rect = dropdownRef.value.getBoundingClientRect();
    dropdownStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 12}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  }
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
  if (dropdownOpen.value) {
    setTimeout(updateDropdownPosition, 0);
  }
}

function closeDropdown() {
  dropdownOpen.value = false;
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    const dropdown = document.querySelector('.dropdown-menu');
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown();
    }
  }
}

// Load profile khi user đăng nhập
watch(
  () => auth.isLoggedIn,
  async (isLoggedIn) => {
    if (isLoggedIn && auth.user?.id) {
      await profileStore.getProfile(auth.user.id);
    }
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', updateDropdownPosition);
  window.addEventListener('resize', updateDropdownPosition);

  if (auth.isLoggedIn && auth.user?.id) {
    profileStore.getProfile(auth.user.id);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', updateDropdownPosition);
  window.removeEventListener('resize', updateDropdownPosition);
});

async function handleSelect(key) {
  closeDropdown();
  switch (key) {
    case 'profile':
      router.push({ name: 'profile-info' });
      break;
    case 'settings':
      router.push({ name: 'settings' });
      break;
    case 'logout':
      try {
        await auth.logout();
        message.success('Đăng xuất thành công, hẹn gặp lại!');
      } catch (error) {
        message.error('Xin lỗi về sự bất tiện');
      }
      break;
    default:
      router.push({ name: 'home' });
      break;
  }
}
</script>

<style scoped>
/* ===== AUTH WRAPPER ===== */
.auth-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* ===== AUTH BUTTONS (Not Logged In) ===== */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: nowrap;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.9375rem;
  font-weight: 500;
}

.auth-btn:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.auth-btn i {
  font-size: 1rem;
}

/* ===== PROFILE SECTION (Logged In) ===== */
.profile-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.welcome-text {
  color: white;
  font-size: 0.9375rem;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

html.dark-mode .welcome-text {
  color: #4ade80;
}

.welcome-text i {
  font-size: 1rem;
  animation: wave 1.5s ease-in-out infinite;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-20deg);
  }
}

/* ===== PROFILE DROPDOWN ===== */
.profile-dropdown {
  position: relative;
}

.profile-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.profile-btn::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #0c713d, #4ade80);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.profile-btn:hover::before {
  opacity: 1;
}

.profile-btn:hover {
  transform: scale(1.1) rotate(5deg);
  border-color: transparent;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* ===== DROPDOWN MENU - FIXED WITH TELEPORT ===== */
.dropdown-menu {
  /* position và top, right sẽ được set bằng inline style */
  background: white;
  border-radius: 16px;
  padding: 0.5rem;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 10000; /* CAO HƠN settings (1000) và table of content (1000/1001) */
  border: 1px solid rgba(12, 113, 61, 0.1);
}

html.dark-mode .dropdown-menu {
  background: #2a2a2a;
  border-color: rgba(74, 222, 128, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
  text-align: left;
}

html.dark-mode .dropdown-item {
  color: #e5e5e5;
}

.dropdown-item:hover {
  background: rgba(12, 113, 61, 0.1);
  color: #0c713d;
  transform: translateX(4px);
}

html.dark-mode .dropdown-item:hover {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.dropdown-item.logout {
  color: #d03050;
}

html.dark-mode .dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: rgba(208, 48, 80, 0.1);
  color: #d03050;
}

html.dark-mode .dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.dropdown-item i {
  font-size: 1.125rem;
  width: 24px;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 0.5rem 0;
}

html.dark-mode .dropdown-divider {
  background: linear-gradient(90deg, transparent, #3a3a3a, transparent);
}

/* ===== MOBILE AUTH CONTAINER ===== */
.mobile-auth-container {
  padding: 0;
}

.mobile-auth-container .auth-buttons {
  flex-direction: column;
  width: 100%;
  gap: 1rem;
}

.mobile-auth-container .auth-btn {
  width: 100%;
  justify-content: center;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1rem;
}

html.dark-mode .mobile-auth-container .auth-btn {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #0d0d0d;
}

.mobile-auth-container .auth-btn .btn-text {
  font-weight: 700;
}

.mobile-auth-container .auth-btn:hover {
  background: linear-gradient(135deg, #0a5c32 0%, #084426 100%);
}

html.dark-mode .mobile-auth-container .auth-btn:hover {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

/* ===== TRANSITIONS ===== */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 479px) {
  .welcome-text {
    display: none;
  }

  .profile-btn {
    width: 40px;
    height: 40px;
  }

  .dropdown-menu {
    right: 10px !important;
    left: 10px !important;
    max-width: none;
    min-width: auto;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .welcome-text {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .welcome-text {
    display: none;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .welcome-text {
    font-size: 0.875rem;
  }
}

@media (min-width: 1280px) {
  .auth-btn {
    padding: 0.5rem 1.125rem;
  }
}
</style>
