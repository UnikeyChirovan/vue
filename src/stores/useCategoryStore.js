// stores/useCategoryStore.js
import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';

export const useCategoryStore = defineStore('categoryStore', () => {
  const categories = ref(JSON.parse(localStorage.getItem('categories')) || []);
  const isCategoriesReady = ref(categories.value.length > 0);

  // Tự động cập nhật từ `localStorage`
  watchEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories) {
      categories.value = storedCategories;
      isCategoriesReady.value = true;
    }
  });

  const getCategoryTitle = (code, page, defaultTitle) => {
    return isCategoriesReady.value
      ? categories.value.find((cat) => cat.code === code && cat.page === page)?.name || defaultTitle
      : defaultTitle;
  };

  return {
    categories,
    isCategoriesReady,
    getCategoryTitle,
  };
});
