<template>
  <TheHeader />
  <div class="game-layout">
    <RouterView />
  </div>
  <TheFooter />
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  // Kiểm tra authentication
  if (!authStore.isLoggedIn) {
    router.push({ name: 'home' });
  }
});
</script>

<style scoped>
.game-layout {
  min-height: 100vh;
  width: 100%;
}
</style>
