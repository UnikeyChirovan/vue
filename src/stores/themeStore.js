// stores/themeStore.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDarkMode = ref(false);

  // Actions
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;

    if (savedTheme === 'dark') {
      isDarkMode.value = true;
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      isDarkMode.value = false;
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
    }
  };

  const toggleTheme = (value) => {
    isDarkMode.value = value;
    const html = document.documentElement;

    if (value) {
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }

    // Emit event để các component khác biết (compatibility với code cũ)
    window.dispatchEvent(
      new CustomEvent('themeChanged', { detail: value ? 'dark' : 'light' })
    );
  };

  const setDarkMode = (value) => {
    toggleTheme(value);
  };

  // Watch để sync với localStorage changes từ tab khác
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        isDarkMode.value = e.newValue === 'dark';
      }
    });
  }

  return {
    isDarkMode,
    initializeTheme,
    toggleTheme,
    setDarkMode,
  };
});
