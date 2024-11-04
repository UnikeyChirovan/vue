<template>
  <div class="background-image-container"></div>
  <TheHeader />
  <div class="container text-center">
    <h1 class="mb-0" style="font-family:'Palatino Linotype', 'Book Antiqua', Palatino, serif;">{{ storyName }}</h1>
    <hr class="custom-hr" />
    <h2 class="author-name" style="color: #2C9359FF;"><em>{{ authorName }}</em></h2>
    
    <div class="d-flex justify-content-center my-3">
      <n-button
        @click="prevChapter"
        :disabled="chapterStore.selectedChapter === chapterStore.chapterOptions[0]?.value"
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
    <h3 class="chapter-title" style="font-size: 1.8rem; color: #CD0C10E6;">{{ currentChapterTitle }}</h3>
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
        :disabled="chapterStore.selectedChapter === chapterStore.chapterOptions[0]?.value"
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
  <TableofContent/>
  <ScrollButtons>
    <template v-slot:top-button>
      <a-button type="primary"><i class="fa-solid fa-arrow-down"></i></a-button>
    </template>
    <template v-slot:bottom-button>
      <a-button type="primary"><i class="fa-solid fa-arrow-up"></i></a-button>
    </template>
  </ScrollButtons>
  <TheFooter/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useChapterStore } from '../../stores/chapterStore';
import { NButton, NSelect } from 'naive-ui';
import TheHeader from '../../components/TheHeader.vue';
import api from '../../services/axiosInterceptor';
import SettingsModal from '../../components/SettingsModal.vue';
import ScrollButtons from '../../components/ScrollButtons.vue';
import TableofContent from '../../components/TableofContent.vue';
import TheFooter from '../../components/TheFooter.vue';

const chapterStore = useChapterStore();
const storyName = ref('');
const authorName = ref('');
const chapterContent = ref([]);
const currentChapterTitle = ref('');

const isFetching = ref(false);

const fetchChapterContent = async (chapterNumber) => {
  // Lấy chapter_detail từ localStorage và kiểm tra xem có dữ liệu chưa
  let chapterDetail = JSON.parse(localStorage.getItem('chapter_detail')) || [];

  // Đảm bảo chapterDetail là một mảng
  if (!Array.isArray(chapterDetail)) {
    chapterDetail = [];
  }

  // Tìm kiếm chương trong chapterDetail
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

  // Nếu không có trong cache, gọi API để lấy nội dung chương
  try {
    if (isFetching.value) return;
    isFetching.value = true;

    const response = await api.get(`/story/chapters/${chapterNumber}`);
    const { content, title } = response.data;

    chapterContent.value = content;
    currentChapterTitle.value = title;

    // Thêm chương mới vào chapter_detail
    chapterDetail.push({ [`chapter-${chapterNumber}`]: { title, content } });

    // Cập nhật lại localStorage với chapter_detail mới
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
    
    // Nếu đã có dữ liệu trong localStorage thì dùng nó, không cần gọi API
    if (chapters) {
      chapters = JSON.parse(chapters);
    } else {
      // Nếu chưa có, gọi API và lưu vào localStorage
      const response = await api.get('/story/chapters');
      chapters = response.data;
      localStorage.setItem('chapters', JSON.stringify(chapters));
    }

    // Tạo options từ dữ liệu chapters
    const options = chapters.map((chapter) => ({
      label: `Chương ${chapter.chapter_number}`,
      value: chapter.id,
      title: chapter.title,
    }));
    chapterStore.setChapterOptions(options);

    // Cập nhật thông tin truyện
    const story = chapters[0]?.story_name || 'Tên truyện không xác định';
    const author = chapters[0]?.author || 'Tác giả không xác định';
    storyName.value = story;
    authorName.value = author;
    localStorage.setItem('storyName', story);
    localStorage.setItem('authorName', author);

    // Chọn chương đầu tiên nếu chưa có chương nào được chọn
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
    const lastChapterId = sessionStorage.getItem('lastReadChapter');

    if (lastChapterId) {
      chapterStore.setSelectedChapter(lastChapterId);
      fetchChapterContent(lastChapterId);
      return; // Kết thúc hàm nếu đã có lastChapterId
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
      sessionStorage.setItem('lastReadChapter', newChapter); 
      saveChapterProgress(newChapter);
    }
  }
);



onMounted(() => {
  const lastReadChapter = sessionStorage.getItem('lastReadChapter');
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


<style scoped>
@media only screen and (max-width: 780px) {
  .custom-hr{
    display: none;
  }
}
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

.custom-hr {
  margin-top: -0.5rem;
    height: 5px;
    width: 60%; 
    background-image: url('../../assets/img/gachchan.jpg');
    background-repeat: repeat-x; 
    background-size: contain; 
    background-position: center;
}
h1 {
  display: inline-block;
  font-size: 4rem;
  color: transparent;
  background-color: teal;
  background-image: linear-gradient(
    to right,
    rgb(255, 0, 0),
    rgb(255, 165, 0),
    rgb(255, 255, 0),
    rgb(0, 255, 0),
    rgb(144, 238, 144),
    rgb(0, 0, 255),
    rgb(75, 0, 130),
    rgb(128, 0, 128),
    rgb(255, 0, 191),
    rgb(255, 0, 0)
  );
  -webkit-background-clip: text;
}
</style>
