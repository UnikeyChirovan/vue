<template>
  <TheHeader />
  <n-layout>
    <div class="container">
      <div class="gioi-thieu">
        <h1 class="text-uppercase">Chào Mừng Đến Với Bản Đồ Thế Giới Selorson</h1>
        <p>Selorson là một thế giới rộng lớn, huyền bí, và đầy những vùng đất chưa được khám phá. Bản đồ này sẽ giúp bạn khám phá từ toàn bộ thế giới đến những vùng đất cụ thể, mỗi vùng đều ẩn chứa những câu chuyện, nền văn hóa và truyền thuyết riêng.</p>
      </div>
      <div class="map-container">
        <h2 class="text-uppercase">Selorson World's Map</h2>
        <p>Khám phá toàn bộ thế giới Selorson từ các đỉnh núi cao nhất đến những đại dương sâu thẳm.</p>
        <img src="../../assets/img/map.jpg" alt="Bản Đồ Thế Giới Selorson" class="map-image" />
      </div>
      <div class="map-container">
        <h2 class="text-uppercase">Annamland</h2>
        <p>Annamland là một trong những vùng đất cổ xưa nhất, với những cánh rừng bí ẩn và những thành phố bị lãng quên từ lâu, của những con người chân chất và kiên cường.</p>
        <img src="../../assets/img/annamland.jpg" alt="Bản Đồ Annamland" class="map-image" />
      </div>
      <div class="map-container">
        <h2 class="text-uppercase">thánh địa Skyland</h2>
        <p>Skyland, vùng đất trên những đám mây, nơi ở linh thiêng của các vị thần. Vùng đất này chứa đựng những bí ẩn của trời cao và phép thuật cổ xưa.</p>
        <img src="../../assets/img/skyland.png" alt="Bản Đồ Skyland" class="map-image" />
      </div>
      <div class="map-container">
        <h2 class="text-uppercase">tử địa devilland</h2>
        <p>Devilland là vùng đất của bóng tối và sự hỗn loạn, lãnh địa của những thế lực hắc ám và sinh vật quái dị, một nơi mà sự sống và hy vọng đều bị bóp nghẹt bởi ma thuật tà ác.</p>
        <img src="../../assets/img/devilland.png" alt="Bản Đồ Devilland" class="map-image" />
      </div>
    </div>
  </n-layout>
</template>

<script setup>
import TheHeader from '../../components/TheHeader.vue';
</script>

<style scoped>
.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 20px;
}

.gioi-thieu {
  text-align: center;
  margin-bottom: 40px;
}

.gioi-thieu h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.gioi-thieu p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.map-container {
  margin-bottom: 40px;
  text-align: center;
}

.map-container h2 {
  font-size: 2rem;
  color: #34495e;
  margin-bottom: 10px;
}

.map-container p {
  font-size: 1.1rem;
  color: #95a5a6;
  margin-bottom: 20px;
}

.map-image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
p{
  text-align: left;
  text-indent: 3rem;
}
</style>
