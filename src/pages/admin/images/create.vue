<template>
Tạo images
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useMenu } from '../../../stores/use-menu';

onMounted(() => {
  useMenu().onSelectedKey(['admin-images']);
});
</script>