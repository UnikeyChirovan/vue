// stores/loadingStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiLinks from '../services/api-links';
import { useAuthStore } from './auth';

export const useLoadingStore = defineStore('loading', () => {
  const loadingProgress = ref(0);
  const isDataLoading = ref(false);

  function updateProgress(percent) {
    loadingProgress.value = percent;
    if (percent === 100) {
      setTimeout(() => {
        isDataLoading.value = false;
      }, 500);
    }
  }

  async function checkAndUpdateData(apiCall, localKey) {
    const localTimestamp = localStorage.getItem(`${localKey}_last_updated`);
    let fetchNewData = true;

    try {
      const response = await apiCall();
      const data = response.data;
      const serverTimestamp = data.last_updated;
      if (localTimestamp === serverTimestamp) {
        fetchNewData = false;
        console.log(`${localKey} data is up-to-date.`);
      }
      if (fetchNewData) {
        localStorage.setItem(localKey, JSON.stringify(data[localKey]));
        localStorage.setItem(`${localKey}_last_updated`, serverTimestamp);
        console.log(`${localKey} data updated.`);
      }
    } catch (error) {
      console.error(`Error fetching ${localKey} data:`, error);
    }
  }

  async function fetchDataBeforeLogin(callback) {
    isDataLoading.value = true;
    loadingProgress.value = 0;

    try {
      await checkAndUpdateData(apiLinks.heroSlides.getAll, 'heroSlides');
      updateProgress(20);
      await checkAndUpdateData(apiLinks.notifications.getAll, 'notifications');
      const notificationId = JSON.parse(localStorage.getItem('notifications'))?.[0]?.id;
      if (notificationId) {
          await checkAndUpdateData(() => apiLinks.notifications.getDetail(notificationId), 'notification_detail');
      }
      updateProgress(40);
      await checkAndUpdateData(apiLinks.futureProjects.getAll, 'futureProjects');
      updateProgress(60);
      await checkAndUpdateData(apiLinks.features.getAll, 'features');
      updateProgress(80);
      if (callback) {
        callback();
      }
      await checkAndUpdateData(apiLinks.categories.getAll, 'categories');
      updateProgress(100);
      sessionStorage.setItem('Before', 'ok');
      await checkAndUpdateData(apiLinks.companyInfo.getAll, 'companyInfos');
      await checkAndUpdateData(apiLinks.sections.getAll, 'sections');
      await checkAndUpdateData(apiLinks.imageManager.getImages, 'images');
      sessionStorage.setItem('Before_2', 'ok');
    } catch (error) {
      console.error('Error fetching data before login:', error);
      isDataLoading.value = false;
      sessionStorage.setItem('Before', 'false');
    }
  }

async function fetchDataAfterLogin() {
  isDataLoading.value = true;
  loadingProgress.value = 0;
  try {

    const userVote = await apiLinks.votes.getUserVote();
    sessionStorage.setItem('user_vote', JSON.stringify(userVote.data));
    updateProgress(100);
    sessionStorage.setItem('After', 'ok');
  } catch (error) {
    console.error('Error fetching data after login:', error);
    isDataLoading.value = false;
    sessionStorage.setItem('After', 'false');
  }
}

async function fetchDataFinalLogin() {
  const userId = useAuthStore().user?.id;

  try {
    const profile = await apiLinks.profile.show(userId);
    sessionStorage.setItem('user_profile', JSON.stringify(profile.data));

    const profileEdit = await apiLinks.profile.edit(userId);
    sessionStorage.setItem('user_profile_edit', JSON.stringify(profileEdit.data));

    const chapters = await apiLinks.story.getChapters();
    sessionStorage.setItem('story_chapters', JSON.stringify(chapters.data));
    const chapterId = chapters.data[0]?.id;

    if (chapterId) {
      const chapterDetail = await apiLinks.story.getChapter(chapterId);
      sessionStorage.setItem('chapter_detail', JSON.stringify(chapterDetail.data));
    }

    const backgrounds = await apiLinks.story.getBackgrounds();
    sessionStorage.setItem('story_backgrounds', JSON.stringify(backgrounds.data));
    const backgroundId = backgrounds.data[0]?.id;

    if (backgroundId) {
      const backgroundImage = await apiLinks.story.getImage(backgroundId);
      sessionStorage.setItem('background_image', JSON.stringify(backgroundImage.data));
    }

    const userSettings = await apiLinks.story.getSettings(userId);
    sessionStorage.setItem('user_settings', JSON.stringify(userSettings.data));

    sessionStorage.setItem('Final', 'ok');
  } catch (error) {
    console.error('Error fetching data final after login:', error);
    sessionStorage.setItem('Final', 'false');
  }
}

  return {
    loadingProgress,
    isDataLoading,
    updateProgress,
    checkAndUpdateData,
    fetchDataBeforeLogin,
    fetchDataAfterLogin,
    fetchDataFinalLogin
  };
}, {
  persist: true,  // Kích hoạt tính năng lưu trữ cho store
});
