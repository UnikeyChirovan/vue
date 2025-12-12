import { defineStore } from 'pinia';
import { ref } from 'vue';

export const settingsStore = defineStore('settings', () => {
  const darkMode = ref(false);

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    document.documentElement.classList.toggle('dark', darkMode.value);
  };

  const logoutAllDevices = () => {};

  const deleteAccount = () => {};

  return { darkMode, toggleDarkMode, logoutAllDevices, deleteAccount };
});
