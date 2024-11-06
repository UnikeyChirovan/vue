import { ref, onMounted, onUnmounted } from 'vue';
import { defineStore } from 'pinia';

export const useIntroImageStore = defineStore('introImage', () => {
  const introImage = ref(null);
  const originalSetItem = localStorage.setItem;

  // Hàm để cập nhật introImage từ localStorage
  const updateIntroImage = () => {
    const images = JSON.parse(localStorage.getItem('images')) || [];
    const intro = images.find(img => img.image_name === 'LOGO');
    if (intro) {
      introImage.value = `http://127.0.0.1:8000/storage/${intro.image_path}`;
    }
  };

  // Quan sát sự thay đổi của localStorage
  const observeLocalStorageChange = () => {
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'images') {
        updateIntroImage();
      }
    };
  };

  // Khởi chạy khi store được sử dụng trong component
  onMounted(() => {
    observeLocalStorageChange();
    updateIntroImage();
  });

  onUnmounted(() => {
    // Khôi phục lại localStorage.setItem ban đầu khi component bị hủy
    localStorage.setItem = originalSetItem;
  });

  return {
    introImage,
    updateIntroImage,
  };
});
