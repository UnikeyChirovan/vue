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

  async function fetchDataBeforeLogin(callback) {
    isDataLoading.value = true;
    loadingProgress.value = 0;

    const updateStepProgress = (step) => {
      loadingProgress.value += step;
    };

    try {
      await Promise.all([
        apiLinks.heroSlides.getAll().then((response) => {
          localStorage.setItem('heroSlides', JSON.stringify(response.data));
          updateStepProgress(20);
        }),
        apiLinks.notifications.getAll().then(async (response) => {
          localStorage.setItem('notifications', JSON.stringify(response.data));
          updateStepProgress(20);

          const notificationId = response.data?.[0]?.id;
          if (notificationId) {
            const detailResponse = await apiLinks.notifications.getDetail(notificationId);
            localStorage.setItem('notification_detail', JSON.stringify(detailResponse.data));
          }
        }),
        apiLinks.futureProjects.getAll().then((response) => {
          localStorage.setItem('futureProjects', JSON.stringify(response.data));
          updateStepProgress(20);
        }),
        apiLinks.features.getAll().then((response) => {
          localStorage.setItem('features', JSON.stringify(response.data));
          updateStepProgress(20);
        })
      ]);

      if (callback) {
        callback();
      }

      const categoriesResponse = await apiLinks.categories.getAll();
      localStorage.setItem('categories', JSON.stringify(categoriesResponse.data));
      updateProgress(100);

      await Promise.all([
        apiLinks.companyInfo.getAll().then((response) => {
          localStorage.setItem('companyInfos', JSON.stringify(response.data));
        }),
        apiLinks.sections.getAll().then((response) => {
          localStorage.setItem('sections', JSON.stringify(response.data));
        }),
        // apiLinks.imageManager.getImages().then((response) => {
        //   localStorage.setItem('images', JSON.stringify(response.data));
        // })
      ]);

      sessionStorage.setItem('Before', 'ok');
    } catch (error) {
      console.error('Error fetching data before login:', error);
      isDataLoading.value = false;
      sessionStorage.setItem('Before', 'false');
    }
  }

  // async function fetchDataAfterLogin() {
  //   isDataLoading.value = true;
  //   loadingProgress.value = 0;
  //   try {
  //     const userVote = await apiLinks.votes.getUserVote();
  //     sessionStorage.setItem('user_vote', JSON.stringify(userVote.data));
  //     updateProgress(100);
  //     sessionStorage.setItem('After', 'ok');
  //   } catch (error) {
  //     console.error('Error fetching data after login:', error);
  //     isDataLoading.value = false;
  //     sessionStorage.setItem('After', 'false');
  //   }
  // }

  async function fetchDataFinalLogin() {
    // const userId = useAuthStore().user?.id;

    try {
      const [
        chapters,
        lastChapter,
        // backgrounds,
        // userSettings,
        // profile,
      ] = await Promise.all([
        apiLinks.story.getChapters(),
        apiLinks.story.getLastReadChapter(),
        // apiLinks.story.getBackgrounds(),
        // apiLinks.story.getSettings(userId),
        // apiLinks.profile.show(userId),
      ]);

      localStorage.setItem('chapters', JSON.stringify(chapters.data));
      
      const chapterId = lastChapter.data?.chapter_id;
      if (chapterId) {
        localStorage.setItem('lastReadChapter', chapterId);
      }

      // sessionStorage.setItem('backgrounds', JSON.stringify(backgrounds.data));
      // sessionStorage.setItem('user_settings_early', JSON.stringify(userSettings.data));
      // sessionStorage.setItem('user_profile', JSON.stringify(profile.data));

      localStorage.setItem('Final', 'ok');
    } catch (error) {
      console.error('Error fetching data final after login:', error);
      localStorage.setItem('Final', 'false');
    }
  }

  return {
    loadingProgress,
    isDataLoading,
    updateProgress,
    fetchDataBeforeLogin,
    // fetchDataAfterLogin,
    fetchDataFinalLogin
  };
}, {
  persist: true,  
});
