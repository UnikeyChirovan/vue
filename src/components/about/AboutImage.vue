<template>
  <div v-if="dataStore.introImage" class="about-image-container">
    <img :src="dataStore.introImage" alt="Về Selorson Tales" class="about-image" />
  </div>
</template>

<script setup>
import { useDataStore } from '../../stores/dataStore';
const dataStore = useDataStore();

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
