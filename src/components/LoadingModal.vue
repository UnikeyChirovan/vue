<template>
  <div v-if="loadingStore.isDataLoading" class="loading-overlay">
    <n-space vertical align="center">
      <n-progress
        v-if="loadingStore.loadingProgress < 100"
        type="circle"
        :percentage="loadingStore.loadingProgress"
      />
      <n-progress
        v-else
        type="circle"
        status="success"
        :percentage="loadingStore.loadingProgress"
      />
      <p v-if="loadingStore.loadingProgress < 100">
        Đang tải dữ liệu... {{ loadingStore.loadingProgress }}%
      </p>
    </n-space>
  </div>
</template>

<script setup>
import { useLoadingStore } from '../stores/loadingStore';
const loadingStore = useLoadingStore();
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  z-index: 1000;
}
</style>
