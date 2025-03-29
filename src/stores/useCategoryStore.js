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
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    const parsedCategories = JSON.parse(storedCategories);
    const foundCategory = parsedCategories.find((cat) => cat.code === code && cat.page === page);
    if (foundCategory) return foundCategory.name;
  }
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
