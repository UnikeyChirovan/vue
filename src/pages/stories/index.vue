<template>
  <div class="reading-page-wrapper">
    <div class="background-image-container"></div>
    <TheHeader />
    <div class="reading-wrapper">
      <div class="custom-solid-layer"></div>
      <div class="custom-background-layer"></div>
      <div class="container text-center">
        <div class="story-header">
          <h1 class="story-title">{{ storyName }}</h1>
          <hr class="custom-hr" />
          <h2 class="author-name">
            <em>{{ authorName }}</em>
          </h2>
        </div>

        <!-- Navigation Controls - Giống Index2 -->
        <div class="navigation-controls">
          <n-button
            @click="prevChapter"
            :disabled="
              chapterStore.selectedChapter ===
              chapterStore.chapterOptions[0]?.value
            "
            type="primary"
            class="nav-button"
          >
            <span class="nav-text">Chương trước</span>
            <i class="fas fa-chevron-left mobile-icon"></i>
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
            :disabled="
              chapterStore.selectedChapter ===
              chapterStore.chapterOptions.length
            "
            type="primary"
            class="nav-button"
          >
            <span class="nav-text">Chương tiếp</span>
            <i class="fas fa-chevron-right mobile-icon"></i>
          </n-button>
        </div>

        <div class="text-center snowflake-divider">
          <span class="snowflake">&#10052;</span>
          <span class="snowflake">&#10052;</span>
          <span class="snowflake">&#10052;</span>
        </div>

        <div class="chapter-section">
          <h3 class="chapter-title">{{ currentChapterTitle }}</h3>
          <div v-if="chapterContent.length" class="chapter-content">
            <p
              v-for="(paragraph, index) in chapterContent"
              :key="index"
              class="paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
          <div v-else class="loading-content">
            <div class="spinner"></div>
            <p>Đang tải nội dung...</p>
          </div>
        </div>

        <div class="text-center snowflake-divider">
          <span class="snowflake">&#10052;</span>
          <span class="snowflake">&#10052;</span>
          <span class="snowflake">&#10052;</span>
        </div>

        <div class="navigation-controls bottom">
          <n-button
            @click="prevChapter"
            :disabled="
              chapterStore.selectedChapter ===
              chapterStore.chapterOptions[0]?.value
            "
            type="primary"
            class="nav-button"
          >
            <span class="nav-text">Chương trước</span>
            <i class="fas fa-chevron-left mobile-icon"></i>
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
            :disabled="
              chapterStore.selectedChapter ===
              chapterStore.chapterOptions.length
            "
            type="primary"
            class="nav-button"
          >
            <span class="nav-text">Chương tiếp</span>
            <i class="fas fa-chevron-right mobile-icon"></i>
          </n-button>
        </div>
      </div>
    </div>
    <SettingsModal />
    <TableofContent />
    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useChapterStore } from '../../stores/chapterStore';
import { NButton, NSelect } from 'naive-ui';
import TheHeader from '../../components/TheHeader.vue';
import api from '../../services/axiosInterceptor';
import SettingsModal from '../../components/SettingsModal.vue';
import TableofContent from '../../components/TableofContent.vue';
import TheFooter from '../../components/TheFooter.vue';

const chapterStore = useChapterStore();
const storyName = ref('');
const authorName = ref('');
const chapterContent = ref([]);
const currentChapterTitle = ref('');

const isFetching = ref(false);

const fetchChapterContent = async (chapterNumber) => {
  let chapterDetail = JSON.parse(localStorage.getItem('chapter_detail')) || [];
  if (!Array.isArray(chapterDetail)) {
    chapterDetail = [];
  }
  const cachedChapter = chapterDetail.find(
    (chapter) => chapter[`chapter-${chapterNumber}`]
  );

  if (cachedChapter) {
    const { title, content } = cachedChapter[`chapter-${chapterNumber}`];
    chapterContent.value = content;
    currentChapterTitle.value = title;
    if (chapterStore.selectedChapter !== chapterNumber) {
      chapterStore.setSelectedChapter(chapterNumber);
    }
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
    chapterDetail.push({ [`chapter-${chapterNumber}`]: { title, content } });
    localStorage.setItem('chapter_detail', JSON.stringify(chapterDetail));

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
    let chapters = localStorage.getItem('chapters');
    if (chapters) {
      chapters = JSON.parse(chapters);
    } else {
      const response = await api.get('/story/chapters');
      chapters = response.data;
      localStorage.setItem('chapters', JSON.stringify(chapters));
    }

    const options = chapters.map((chapter) => ({
      label: `Chương ${chapter.chapter_number}`,
      value: chapter.id,
      title: chapter.title,
    }));
    chapterStore.setChapterOptions(options);

    const story = chapters[0]?.story_name || 'Tên truyện không xác định';
    const author = chapters[0]?.author || 'Tác giả không xác định';
    storyName.value = story;
    authorName.value = author;
    localStorage.setItem('storyName', story);
    localStorage.setItem('authorName', author);

    if (chapterStore.selectedChapter === null && options.length) {
      chapterStore.setSelectedChapter(options[0].value);
    }
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

const fetchLastReadChapter = async () => {
  try {
    const lastChapterId = localStorage.getItem('lastReadChapter');

    if (lastChapterId) {
      chapterStore.setSelectedChapter(lastChapterId);
      fetchChapterContent(lastChapterId);
      return;
    }

    const response = await api.get(`/story/user-chapter`);
    if (response.data) {
      const chapterId = response.data?.chapter_id;
      chapterStore.setSelectedChapter(chapterId);
      fetchChapterContent(chapterId);
    }
  } catch (error) {
    console.error('Lỗi khi lấy chương cuối cùng:', error);
  }
};

const saveChapterProgress = async (chapterId) => {
  try {
    await api.post(`/story/user-chapter`, { chapter_id: chapterId });
  } catch (error) {
    console.error('Lỗi khi lưu chương:', error);
  }
};

watch(
  () => chapterStore.selectedChapter,
  (newChapter, oldChapter) => {
    if (newChapter !== oldChapter && newChapter !== null) {
      fetchChapterContent(newChapter);
      localStorage.setItem('lastReadChapter', newChapter);
      saveChapterProgress(newChapter);
    }
  }
);

onMounted(() => {
  const lastReadChapter = localStorage.getItem('lastReadChapter');
  const savedStoryName = localStorage.getItem('storyName');
  const savedAuthorName = localStorage.getItem('authorName');

  if (savedStoryName) {
    storyName.value = savedStoryName;
  }

  if (savedAuthorName) {
    authorName.value = savedAuthorName;
  }
  if (lastReadChapter) {
    const chapterNumber = Number(lastReadChapter);
    chapterStore.setSelectedChapter(chapterNumber);
    fetchChapterContent(chapterNumber);
    fetchChaptersList();
  } else {
    fetchChaptersList();
    fetchLastReadChapter();
  }
});
</script>
<style>
/* Wrap all styles in .reading-page-wrapper to avoid conflicts */

/* ========== BACKGROUND ========== */
.reading-page-wrapper body {
  will-change: filter;
}

.reading-page-wrapper .background-image-container {
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
  transition: width 0.3s ease;
}

/* ========== MAIN WRAPPER ========== */
.reading-page-wrapper .reading-wrapper {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(250, 250, 250, 0.95) 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  padding: 80px 20px 60px;
  transition: background 0.3s ease;
}

.reading-page-wrapper .container {
  position: relative;
  z-index: 1;
  max-width: 66.67%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  padding: 50px 60px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(12, 113, 61, 0.1);
  transition: all 0.3s ease;
}

/* ========== STORY HEADER ========== */
.reading-page-wrapper .story-header {
  margin-bottom: 40px;
}

.reading-page-wrapper .story-title {
  display: inline-block;
  font-size: 3.5rem;
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  color: transparent;
  background: linear-gradient(
    to right,
    #ff0000,
    #ffa500,
    #ffff00,
    #00ff00,
    #90ee90,
    #0000ff,
    #4b0082,
    #800080,
    #ff00bf,
    #ff0000
  );
  -webkit-background-clip: text;
  background-clip: text;
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.reading-page-wrapper .custom-hr {
  height: 5px;
  width: 60%;
  margin: 20px auto;
  background-image: url('../../assets/img/gachchan.jpg');
  background-repeat: repeat-x;
  background-size: contain;
  background-position: center;
  border: none;
}

.reading-page-wrapper .author-name {
  font-size: 1.3rem;
  color: #0c713d;
  margin: 20px 0 0 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

/* ========== NAVIGATION ========== */
.reading-page-wrapper .navigation-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 30px 0;
}

.reading-page-wrapper .navigation-controls.bottom {
  margin-top: 50px;
}

.reading-page-wrapper .nav-button {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;
  padding: 14px 24px !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%) !important;
  border: none !important;
  color: white !important;
  cursor: pointer;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.2) !important;
}

.reading-page-wrapper .nav-button:hover:not(:disabled) {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.3) !important;
}

.reading-page-wrapper .nav-button:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  background: #ccc !important;
}

.reading-page-wrapper .nav-button i {
  font-size: 0.9rem;
}

.reading-page-wrapper .mobile-icon {
  display: none;
}

.reading-page-wrapper .nav-text {
  display: inline;
}

.reading-page-wrapper .chapter-select-container {
  flex: 1;
  max-width: 250px;
  min-width: 180px;
}

.reading-page-wrapper .chapter-select {
  width: 100%;
  border-radius: 12px !important;
}

/* ========== SNOWFLAKE DIVIDER ========== */
.reading-page-wrapper .snowflake-divider {
  margin: 40px 0;
}

.reading-page-wrapper .snowflake {
  color: #0c713d;
  font-size: 1.8rem;
  margin: 0 15px;
  opacity: 0.6;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  transition: color 0.3s ease;
}

.reading-page-wrapper .snowflake:nth-child(2) {
  animation-delay: 0.5s;
}

.reading-page-wrapper .snowflake:nth-child(3) {
  animation-delay: 1s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* ========== CHAPTER SECTION ========== */
.reading-page-wrapper .chapter-section {
  margin: 50px 0;
}

.reading-page-wrapper .chapter-title {
  text-align: center;
  font-size: 2rem;
  color: #cd0c10;
  margin: 30px 0;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 2px rgba(205, 12, 16, 0.1);
  transition: color 0.3s ease;
}

.reading-page-wrapper .chapter-content {
  text-align: left;
  font-size: 1.25rem;
  line-height: 2;
  color: #333;
  transition:
    font-size 0.3s ease,
    font-family 0.3s ease,
    line-height 0.3s ease,
    color 0.3s ease;
}

.reading-page-wrapper .paragraph {
  text-indent: 2.5em;
  margin-bottom: 1.5rem;
  text-align: justify;
  transition: color 0.3s ease;
}

.reading-page-wrapper .paragraph:hover {
  color: #0c713d;
}

.reading-page-wrapper .loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
}

.reading-page-wrapper .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(12, 113, 61, 0.1);
  border-top-color: #0c713d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========== BACKGROUND LAYERS ========== */
.reading-page-wrapper .custom-background-layer {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 66.67%;
  max-width: 66.67%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  border-radius: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.reading-page-wrapper .custom-solid-layer {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 66.67%;
  max-width: 66.67%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  border-radius: 0;
}

/* ========== DARK MODE - NIGHT MODE FROM SETTINGS ========== */
body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .reading-wrapper,
body[style*='color:#ffffff'] .reading-page-wrapper .reading-wrapper {
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 0.95) 0%,
    rgba(10, 10, 10, 0.95) 100%
  ) !important;
}

body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .container,
body[style*='color:#ffffff'] .reading-page-wrapper .container {
  background: rgba(26, 26, 26, 0.98) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
}

body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .author-name,
body[style*='color:#ffffff'] .reading-page-wrapper .author-name {
  color: #4ade80 !important;
}

body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .chapter-title,
body[style*='color:#ffffff'] .reading-page-wrapper .chapter-title {
  color: #f87171 !important;
  text-shadow: 1px 1px 2px rgba(248, 113, 113, 0.2) !important;
}

body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .chapter-content,
body[style*='color:#ffffff'] .reading-page-wrapper .chapter-content {
  color: #e5e5e5 !important;
}

body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .paragraph,
body[style*='color:#ffffff'] .reading-page-wrapper .paragraph {
  color: #e5e5e5 !important;
}

/* BỎ hiệu ứng hover ở night mode */
body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .paragraph:hover,
body[style*='color:#ffffff'] .reading-page-wrapper .paragraph:hover {
  color: #e5e5e5 !important;
}

body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .snowflake,
body[style*='color:#ffffff'] .reading-page-wrapper .snowflake {
  color: #4ade80 !important;
}

body[style*='color: rgb(255, 255, 255)'] .reading-page-wrapper .spinner,
body[style*='color:#ffffff'] .reading-page-wrapper .spinner {
  border: 4px solid rgba(74, 222, 128, 0.2) !important;
  border-top-color: #4ade80 !important;
}

/* ========== DARK MODE - APP-WIDE ========== */
html.dark-mode .reading-page-wrapper .reading-wrapper {
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 0.95) 0%,
    rgba(10, 10, 10, 0.95) 100%
  ) !important;
}

html.dark-mode .reading-page-wrapper .container {
  background: rgba(26, 26, 26, 0.98) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
}

html.dark-mode .reading-page-wrapper .author-name {
  color: #4ade80 !important;
}

html.dark-mode .reading-page-wrapper .chapter-title {
  color: #f87171 !important;
  text-shadow: 1px 1px 2px rgba(248, 113, 113, 0.2) !important;
}

html.dark-mode .reading-page-wrapper .chapter-content {
  color: #e5e5e5 !important;
}

html.dark-mode .reading-page-wrapper .paragraph {
  color: #e5e5e5 !important;
}

html.dark-mode .reading-page-wrapper .paragraph:hover {
  color: #e5e5e5 !important;
}

html.dark-mode .reading-page-wrapper .snowflake {
  color: #4ade80 !important;
}

html.dark-mode .reading-page-wrapper .spinner {
  border: 4px solid rgba(74, 222, 128, 0.2) !important;
  border-top-color: #4ade80 !important;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .reading-page-wrapper .reading-wrapper {
    padding: 70px 20px 50px;
  }

  .reading-page-wrapper .container {
    max-width: 80%;
    padding: 40px 50px;
  }

  .reading-page-wrapper .story-title {
    font-size: 3rem;
  }

  .reading-page-wrapper .author-name {
    font-size: 1.2rem;
  }

  .reading-page-wrapper .chapter-title {
    font-size: 1.8rem;
  }

  .reading-page-wrapper .chapter-content {
    font-size: 1.2rem;
    line-height: 1.9;
  }

  .reading-page-wrapper .nav-button {
    min-width: 120px;
    padding: 12px 20px !important;
  }

  .reading-page-wrapper .custom-background-layer,
  .reading-page-wrapper .custom-solid-layer {
    width: 80%;
    max-width: 80%;
    top: 70px;
    height: calc(100vh - 120px);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .reading-page-wrapper .reading-wrapper {
    padding: 50px 10px 30px;
  }

  .reading-page-wrapper .container {
    max-width: 95%;
    padding: 20px 15px;
    border-radius: 16px;
  }

  .reading-page-wrapper .story-header {
    margin-bottom: 20px;
  }

  .reading-page-wrapper .story-title {
    font-size: 2.2rem;
    margin: 0 0 15px 0;
  }

  .reading-page-wrapper .custom-hr {
    width: 80%;
    height: 4px;
    margin: 12px auto;
  }

  .reading-page-wrapper .author-name {
    font-size: 1.05rem;
    margin: 12px 0 0 0;
  }

  .reading-page-wrapper .navigation-controls {
    gap: 8px;
    margin: 20px 0;
  }

  .reading-page-wrapper .nav-button {
    min-width: auto;
    padding: 10px 12px !important;
    font-size: 0.9rem !important;
  }

  .reading-page-wrapper .nav-button i {
    font-size: 1rem;
  }

  .reading-page-wrapper .nav-text {
    display: none;
  }

  .reading-page-wrapper .mobile-icon {
    display: inline;
    font-size: 1.1rem;
  }

  .reading-page-wrapper .chapter-select-container {
    flex: 1;
    max-width: 180px;
    min-width: 120px;
  }

  .reading-page-wrapper .snowflake-divider {
    margin: 20px 0;
  }

  .reading-page-wrapper .snowflake {
    font-size: 1.3rem;
    margin: 0 8px;
  }

  .reading-page-wrapper .chapter-section {
    margin: 25px 0;
  }

  .reading-page-wrapper .chapter-title {
    font-size: 1.5rem;
    margin: 15px 0;
  }

  .reading-page-wrapper .chapter-content {
    font-size: 1.1rem;
    line-height: 1.75;
  }

  .reading-page-wrapper .paragraph {
    text-indent: 1.8em;
    margin-bottom: 1rem;
  }

  .reading-page-wrapper .custom-background-layer,
  .reading-page-wrapper .custom-solid-layer {
    width: 95%;
    max-width: 95%;
    top: 60px;
    height: calc(100vh - 100px);
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .reading-page-wrapper .reading-wrapper {
    padding: 45px 5px 20px;
  }

  .reading-page-wrapper .container {
    max-width: 100%;
    padding: 15px 12px;
    border-radius: 12px;
  }

  .reading-page-wrapper .story-header {
    margin-bottom: 15px;
  }

  .reading-page-wrapper .story-title {
    font-size: 1.8rem;
    margin: 0 0 10px 0;
  }

  .reading-page-wrapper .custom-hr {
    width: 80%;
    height: 3px;
    margin: 10px auto;
  }

  .reading-page-wrapper .author-name {
    font-size: 0.95rem;
    margin: 10px 0 0 0;
  }

  .reading-page-wrapper .navigation-controls {
    gap: 5px;
    margin: 15px 0;
  }

  .reading-page-wrapper .nav-button {
    padding: 8px 10px !important;
    font-size: 0.85rem !important;
  }

  .reading-page-wrapper .chapter-select-container {
    flex: 1;
    min-width: 90px;
    max-width: 120px;
  }

  .reading-page-wrapper .snowflake-divider {
    margin: 15px 0;
  }

  .reading-page-wrapper .snowflake {
    font-size: 1.1rem;
    margin: 0 6px;
  }

  .reading-page-wrapper .chapter-section {
    margin: 20px 0;
  }

  .reading-page-wrapper .chapter-title {
    font-size: 1.3rem;
    margin: 12px 0;
  }

  .reading-page-wrapper .chapter-content {
    font-size: 1.05rem;
    line-height: 1.65;
  }

  .reading-page-wrapper .paragraph {
    text-indent: 1.5em;
    margin-bottom: 0.85rem;
  }

  .reading-page-wrapper .custom-background-layer,
  .reading-page-wrapper .custom-solid-layer {
    width: 100%;
    max-width: 100%;
    top: 50px;
    height: calc(100vh - 80px);
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .reading-page-wrapper .reading-wrapper {
    padding: 40px 3px 15px;
  }

  .reading-page-wrapper .container {
    padding: 12px 10px;
  }

  .reading-page-wrapper .story-header {
    margin-bottom: 12px;
  }

  .reading-page-wrapper .story-title {
    font-size: 1.6rem;
    margin: 0 0 8px 0;
  }

  .reading-page-wrapper .custom-hr {
    margin: 8px auto;
    height: 2px;
    width: 75%;
  }

  .reading-page-wrapper .author-name {
    font-size: 0.85rem;
    margin: 8px 0 0 0;
  }

  .reading-page-wrapper .navigation-controls {
    gap: 4px;
    margin: 12px 0;
  }

  .reading-page-wrapper .nav-button {
    padding: 6px 8px !important;
    font-size: 0.8rem !important;
  }

  .reading-page-wrapper .mobile-icon {
    font-size: 0.9rem !important;
  }

  .reading-page-wrapper .chapter-select-container {
    min-width: 80px;
    max-width: 100px;
  }

  .reading-page-wrapper .snowflake-divider {
    margin: 12px 0;
  }

  .reading-page-wrapper .snowflake {
    font-size: 1rem;
    margin: 0 5px;
  }

  .reading-page-wrapper .chapter-section {
    margin: 15px 0;
  }

  .reading-page-wrapper .chapter-title {
    font-size: 1.2rem;
    margin: 10px 0;
  }

  .reading-page-wrapper .chapter-content {
    font-size: 1rem;
    line-height: 1.6;
  }

  .reading-page-wrapper .paragraph {
    text-indent: 1.2em;
    margin-bottom: 0.75rem;
  }
}
</style>
