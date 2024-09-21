import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMenuProfile = defineStore('menuProfileId', () => {
  const selectedKeys = ref([]);
  const openKeys = ref([]);

  const onSelectedKey = (data) => {
    selectedKeys.value = data;
  };

  const onOpenKeys = (data) => {
    openKeys.value = data;
  };

  return {
    selectedKeys,
    openKeys,
    onSelectedKey,
    onOpenKeys,
  };
});
