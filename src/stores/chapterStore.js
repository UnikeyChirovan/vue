import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useChapterStore = defineStore('chapter', () => {
  const selectedChapter = ref(null);
  const chapterOptions = ref([]);

  const setSelectedChapter = (chapter) => {
    selectedChapter.value = chapter;
  };

  const setChapterOptions = (options) => {
    chapterOptions.value = options;
  };

  return {
    selectedChapter,
    chapterOptions,
    setSelectedChapter,
    setChapterOptions,
  };
});
