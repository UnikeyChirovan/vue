<template>
  <div class="about-image-container">
    <img 
      src="../../assets/intro6.png" 
      alt="Về Selorson Tales" 
      class="about-image"
    />
    <div class="about-text"><h1>Một Chút Về Selorson Tales</h1></div>
  </div>
</template>

<script setup>
// Bạn có thể thêm logic hoặc props nếu cần
</script>

<style scoped>
.about-image-container {
  text-align: center; /* Canh giữa nội dung */
}

.about-image {
  width: 100%;
  height: 300px;
  object-fit: fill; /* Đảm bảo hình ảnh không bị méo */
}

.about-text {
  margin-top: 10px; /* Khoảng cách giữa hình ảnh và chữ */
  font-size: 1.5rem;
  font-weight: bold; /* Làm chữ đậm */
}
</style>
