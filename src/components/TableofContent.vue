<template>
  <div>
    <n-dropdown
      trigger="click"
      placement="bottom"
      :options="chapterOptions"
      @select="selectChapter"
      style="max-height: 500px; overflow-y: auto;"
    >
      <n-button type="error" class="table-of-content">Mục Lục</n-button>
    </n-dropdown>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useChapterStore } from '../stores/chapterStore';
import { NButton, NDropdown } from 'naive-ui';

const chapterStore = useChapterStore();

const chapterOptions = computed(() =>
  chapterStore.chapterOptions.map(chapter => ({
    label: `${chapter.label}: ${chapter.title}`,
    key: chapter.value,
    type: chapterStore.selectedChapter === chapter.value ? 'active' : null, 
    props: { style: chapterStore.selectedChapter === chapter.value ? 'background-color: #f0f0f0; color: #1890ff;' : '' }, 
  }))
);

const selectChapter = (chapter) => {
  chapterStore.setSelectedChapter(chapter);
};
</script>

<style scoped>
.table-of-content {
  position: fixed;
  top: 120px; 
  right: 80px;
  z-index: 1000; 
}

.n-dropdown-menu-item {
  padding: 10px 15px;
  cursor: pointer;
}

.n-dropdown-menu-item.active {
  background-color: #f0f0f0;
  color: #1890ff; 
}

</style>
