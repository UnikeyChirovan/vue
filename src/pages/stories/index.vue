<template>
  <div class="background-image-container"></div>
  <TheHeader />
  <div class="container text-center">
    <h2>{{ storyName }}</h2>
    <p class="author-name"><em>{{ authorName }}</em></p>
    <div class="d-flex justify-content-center my-3">
      <n-button
        @click="prevChapter"
        :disabled="chapterStore.selectedChapter === 0"
        type="primary"
        class="mx-2"
      >
        Chương trước
      </n-button>
      <div class="chapter-select-container">
        <n-select
          v-model:value="chapterStore.selectedChapter"
          :options="chapterStore.chapterOptions"
          @update:value="updateChapterAndFetchContent"
          class="chapter-select"
        />
      </div>
      <n-button
        @click="nextChapter"
        :disabled="chapterStore.selectedChapter === chapterStore.chapterOptions.length"
        type="primary"
        class="mx-2"
      >
        Chương tiếp
      </n-button>
    </div>
    <div class="text-center">
      <span class="snowflake">&#10052;</span>
      <span class="snowflake">&#10052;</span>
      <span class="snowflake">&#10052;</span>
    </div>
    <h3 class="chapter-title">{{ currentChapterTitle }}</h3>
    <div v-if="chapterContent.length" class="chapter-content my-5">
      <p v-for="(paragraph, index) in chapterContent" :key="index" class="paragraph">{{ paragraph }}</p>
    </div>
    <div class="text-center">
      <span class="snowflake">&#10052;</span>
      <span class="snowflake">&#10052;</span>
      <span class="snowflake">&#10052;</span>
    </div>
    <div class="d-flex justify-content-center my-3">
      <n-button
        @click="prevChapter"
        :disabled="chapterStore.selectedChapter === 0"
        type="primary"
        class="mx-2"
      >
        Chương trước
      </n-button>
      <div class="chapter-select-container">
        <n-select
          v-model:value="chapterStore.selectedChapter"
          :options="chapterStore.chapterOptions"
          @update:value="updateChapterAndFetchContent"
          class="chapter-select"
        />
      </div>
      <n-button
        @click="nextChapter"
        :disabled="chapterStore.selectedChapter === chapterStore.chapterOptions.length"
        type="primary"
        class="mx-2"
      >
        Chương tiếp
      </n-button>
    </div>
  </div>
  <SettingsModal/>
  <ScrollButtons>
    <template v-slot:top-button>
      <a-button type="primary"><i class="fa-solid fa-arrow-down"></i></a-button>
    </template>
    <template v-slot:bottom-button>
      <a-button type="primary"><i class="fa-solid fa-arrow-up"></i></a-button>
    </template>
  </ScrollButtons>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useChapterStore } from '../../stores/chapterStore';
import { NButton, NSelect } from 'naive-ui';
import TheHeader from '../../components/TheHeader.vue';
import api from '../../services/axiosInterceptor';
import SettingsModal from '../../components/SettingsModal.vue';
import ScrollButtons from '../../components/ScrollButtons.vue';

const chapterStore = useChapterStore();
const storyName = ref('');
const authorName = ref('');
const chapterContent = ref([]);
const currentChapterTitle = ref('');

const isFetching = ref(false);

const fetchChapterContent = async (chapterNumber) => {
  const cachedChapter = sessionStorage.getItem(`chapter-${chapterNumber}`);
  if (cachedChapter) {
    const { title, content } = JSON.parse(cachedChapter);
    chapterContent.value = content;
    currentChapterTitle.value = title;
    window.scrollTo(0, 0);
    return;
  }

  try {
    if (isFetching.value) return;
    isFetching.value = true;

    const response = await api.get(`/story/chapters/${chapterNumber}`);
    const { content, title } = response.data;

    chapterContent.value = content;
    currentChapterTitle.value = title;

    sessionStorage.setItem(`chapter-${chapterNumber}`, JSON.stringify({ title, content }));

    if (chapterStore.selectedChapter !== chapterNumber) {
      chapterStore.setSelectedChapter(chapterNumber);
    }

    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Lỗi khi lấy nội dung chương:', error);
  } finally {
    isFetching.value = false;
  }
};

const fetchChaptersList = async () => {
  try {
    const response = await api.get('/story/chapters');
    const options = response.data.map((chapter) => ({
      label: `Chương ${chapter.chapter_number}`,
      value: chapter.id,
    }));
    chapterStore.setChapterOptions(options);

    if (chapterStore.selectedChapter === null && options.length) {
      chapterStore.setSelectedChapter(options[0].value);
    }
    storyName.value = response.data[0]?.story_name || 'Tên truyện không xác định';
    authorName.value = response.data[0]?.author || 'Tác giả không xác định';
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chương:', error);
  }
};

const prevChapter = () => {
  if (chapterStore.selectedChapter > 0) {
    chapterStore.setSelectedChapter(chapterStore.selectedChapter - 1);
  }
};

const nextChapter = () => {
  if (chapterStore.selectedChapter < chapterStore.chapterOptions.length) {
    chapterStore.setSelectedChapter(chapterStore.selectedChapter + 1);
  }
};

const updateChapterAndFetchContent = (newChapter) => {
  if (chapterStore.selectedChapter !== newChapter) {
    chapterStore.setSelectedChapter(newChapter);
  }
};

watch(
  () => chapterStore.selectedChapter,
  (newChapter, oldChapter) => {
    if (newChapter !== oldChapter && newChapter !== null) {
      fetchChapterContent(newChapter);
    }
  }
);

onMounted(() => {
  fetchChaptersList();
});
</script>


<style scoped>
body {
  will-change: filter;
}

.background-image-container {
  position: fixed;
  top: 0;
  left: 50%;
  width: 66.6667%;
  height: 100vh; 
  transform: translateX(-50%); 
  z-index: -1;
  opacity: 0.2; 
  background-size: cover; 
  background-position: top center;
  overflow: hidden;
}
.background-custom{
  position: relative;
  width: 100%;
  height: 100%;
  z-index: -10;
}
.container {
  max-width: 66.67%;
  margin: 0 auto;
  height: auto;
  transition: background-color 0.3s ease, filter 0.3s ease;
}
.chapter-content {
  text-align: left;
  font-size: 1.25rem;
  line-height: 1.6;
  transition: font-size 0.3s ease, font-family 0.3s ease, line-height 0.3s ease;
}
.paragraph {
  text-indent: 40px;
  margin-bottom: 1.2rem;
}
.settings-button {
  position: fixed;
  top: 20px;
  right: 20px;
}
.author-name {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}
.chapter-select-container {
  display: flex;
  align-items: center;
}
.snowflake {
  color: #a2d2ff;
  font-size: 1.5rem;
  margin: 0 5px;
}
.chapter-select {
  width: 150px;
}
.chapter-title {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 20px;
}
.chapter-content {
  text-align: left;
  font-size: 1.25rem;
  line-height: 1.6;
}
.paragraph {
  text-indent: 40px;
  margin-bottom: 1.2rem;
}
</style>
