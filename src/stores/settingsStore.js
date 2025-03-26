import { defineStore } from 'pinia';
import { ref } from 'vue';

export const settingsStore = defineStore('settings', () => {
  const darkMode = ref(false);

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    document.documentElement.classList.toggle('dark', darkMode.value);
  };

  const logoutAllDevices = () => {
    console.log('Logging out from all devices...');
    // Gọi API đăng xuất khỏi tất cả thiết bị
  };

  const deleteAccount = () => {
    console.log('Deleting account...');
    // Gọi API xóa tài khoản
  };

  return { darkMode, toggleDarkMode, logoutAllDevices, deleteAccount };
});