<template>
  <div v-if="dataStore.introImage" class="about-image-wrapper">
    <div class="about-image-container">
      <img
        :src="dataStore.introImage"
        alt="Về Selorson Tales"
        class="about-image"
        loading="lazy"
      />
      <div class="image-overlay"></div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from '../../stores/dataStore';
const dataStore = useDataStore();
</script>

<style scoped>
/* ========== MODERN ABOUT IMAGE DESIGN ========== */
.about-image-wrapper {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.about-image-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(12, 113, 61, 0.3) 100%
  );
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.about-image-container:hover .about-image {
  transform: scale(1.05);
}

.about-image-container:hover .image-overlay {
  opacity: 0.7;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .about-image-container {
    height: 350px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .about-image-container {
    height: 300px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .about-image-container {
    height: 250px;
  }
}
</style>
