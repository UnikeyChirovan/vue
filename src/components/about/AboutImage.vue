<template>
  <div v-if="introImage" class="about-image-container">
    <img :src="introImage" alt="Về Selorson Tales" class="about-image" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLoadingStore } from '../../stores/loadingStore';
import apiLinks from '../../services/api-links';

const loadingStore = useLoadingStore();
const introImage = ref(null); // Biến lưu đường dẫn của ảnh tên "Intro"
let checkCount = 0;
const maxChecks = 20; // Số lần kiểm tra tối đa (20 lần)
const intervalTime = 500; // Thời gian mỗi lần kiểm tra là 0.5 giây

// Hàm kiểm tra và lấy ảnh "Intro" từ local storage
const checkIntroImage = async () => {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  const intro = images.find(img => img.image_name === 'INTRO');
  
  if (intro) {
    introImage.value = `http://127.0.0.1:8000/storage/${intro.image_path}`;
    clearInterval(intervalId); // Dừng kiểm tra khi tìm thấy ảnh
  } else if (checkCount >= maxChecks) {
    // Nếu sau 20 lần (10 giây) mà vẫn không có, gọi API để lấy ảnh
    await loadingStore.checkAndUpdateData(apiLinks.imageManager.getImages, 'images');
    images = JSON.parse(localStorage.getItem('images')) || [];
    const updatedIntro = images.find(img => img.image_name === 'INTRO');
    
    if (updatedIntro) {
      introImage.value = `http://127.0.0.1:8000/storage/${updatedIntro.image_path}`;
    }
    clearInterval(intervalId); // Dừng kiểm tra sau khi đã gọi API
  }
  checkCount++;
};

// Tạo và bắt đầu interval khi component mounted
let intervalId;
onMounted(() => {
  intervalId = setInterval(checkIntroImage, intervalTime);
});

// Xóa interval khi component unmounted để tránh lỗi bộ nhớ
onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.about-image-container {
  text-align: center; 
}

.about-image {
  width: 100%;
  height: 300px;
  object-fit: fill; 
}
</style>
