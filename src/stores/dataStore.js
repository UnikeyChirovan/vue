import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';

export const useDataStore = defineStore('dataStore', () => {
  const sections = ref(JSON.parse(localStorage.getItem('sections')) || {});
  
  const coverImage = ref(null);
  const avatarImage = ref(null);
  const logoImage = ref(null);
  const introImage = ref(null);

  // Hàm lấy đường dẫn ảnh từ localStorage
  const checkImage = (imageName) => {
    const images = JSON.parse(localStorage.getItem('images')) || [];
    const image = images.find(img => img.image_name === imageName);
    return image ? `http://127.0.0.1:8000/storage/${image.image_path}` : null;
  };

  // Theo dõi tự động khi localStorage thay đổi
  watchEffect(() => {
    sections.value = JSON.parse(localStorage.getItem('sections')) || {};
    coverImage.value = checkImage('TSCĐ');
    avatarImage.value = checkImage('AVATAR');
    logoImage.value = checkImage('LOGO');
    introImage.value = checkImage('INTRO');
  });

  return { sections, coverImage, avatarImage, logoImage, introImage  };
});
