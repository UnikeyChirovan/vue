import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMenu = defineStore('menuId', () => {
  const selectedKeys = ref([]);
  const openKeys = ref([]);

  const onSelectedKey = (data) => {
    selectedKeys.value = data;
  };

  const onOpenKeys = (data) => {
    openKeys.value = data;
  };

  const clearSelectedKey = () => {
    selectedKeys.value = [];
  };

  return {
    selectedKeys,
    openKeys,
    onSelectedKey,
    onOpenKeys,
    clearSelectedKey,
  };
});
