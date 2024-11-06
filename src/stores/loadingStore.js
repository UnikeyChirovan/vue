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

      const updateStepProgress = (step) => {
        loadingProgress.value += step;
      };

      try {
        // Tạo các promise và cập nhật tiến trình sau khi từng promise hoàn tất
        await Promise.all([
          checkAndUpdateData(apiLinks.heroSlides.getAll, 'heroSlides').then(() => updateStepProgress(20)),
          checkAndUpdateData(apiLinks.notifications.getAll, 'notifications').then(async () => {
            updateStepProgress(20);
            const notificationId = JSON.parse(localStorage.getItem('notifications'))?.[0]?.id;
            if (notificationId) {
              await checkAndUpdateData(() => apiLinks.notifications.getDetail(notificationId), 'notification_detail');
            }
          }),
          checkAndUpdateData(apiLinks.futureProjects.getAll, 'futureProjects').then(() => updateStepProgress(20)),
          checkAndUpdateData(apiLinks.features.getAll, 'features').then(() => updateStepProgress(20))
        ]);

        if (callback) {
          callback();
        }

        await checkAndUpdateData(apiLinks.categories.getAll, 'categories');
        updateProgress(100);
        sessionStorage.setItem('Before', 'ok');

        // Các lời gọi API cuối cùng sau khi hoàn tất phần trên
        await Promise.all([
          checkAndUpdateData(apiLinks.companyInfo.getAll, 'companyInfos'),
          checkAndUpdateData(apiLinks.sections.getAll, 'sections'),
          checkAndUpdateData(apiLinks.imageManager.getImages, 'images')
        ]);

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
    const [
      chapters,
      lastChapter,
      backgrounds,
      userSettings,
      profile,
    ] = await Promise.all([
      apiLinks.story.getChapters(),
      apiLinks.story.getLastReadChapter(),
      apiLinks.story.getBackgrounds(),
      apiLinks.story.getSettings(userId),
      apiLinks.profile.show(userId),
    ]);

    localStorage.setItem('chapters', JSON.stringify(chapters.data));
    
    const chapterId = lastChapter.data?.chapter_id;
    if (chapterId) {
      sessionStorage.setItem('lastReadChapter', chapterId);
    }

    sessionStorage.setItem('backgrounds', JSON.stringify(backgrounds.data));
    sessionStorage.setItem('user_settings_early', JSON.stringify(userSettings.data));
    sessionStorage.setItem('user_profile', JSON.stringify(profile.data));

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
  persist: true,  
});
