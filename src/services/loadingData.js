import { ref } from 'vue';
import apiLinks from '../services/api-links';
import { useAuthStore } from '../stores/auth';

export const loadingProgress = ref(0);
export const isDataLoading = ref(false);

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
    }
    if (fetchNewData) {
      localStorage.setItem(localKey, JSON.stringify(data[localKey]));
      localStorage.setItem(`${localKey}_last_updated`, serverTimestamp);
    }
  } catch (error) {
    console.error(`Error fetching ${localKey} data:`, error);
  }
}

export async function fetchDataBeforeLogin() {
  isDataLoading.value = true;
  loadingProgress.value = 0;

  try {
    await checkAndUpdateData(apiLinks.heroSlides.getAll, 'heroSlides');
    updateProgress(15);
    await checkAndUpdateData(apiLinks.futureProjects.getAll, 'futureProjects');
    updateProgress(30);
    await checkAndUpdateData(apiLinks.features.getAll, 'features');
    updateProgress(45);
    await checkAndUpdateData(apiLinks.categories.getAll, 'categories');
    updateProgress(60);
    await checkAndUpdateData(apiLinks.imageManager.getImages, 'images');
    updateProgress(75);
    await checkAndUpdateData(
      apiLinks.votes.getVoteResults,
      'total_users_voted'
    );
    updateProgress(90);
    await checkAndUpdateData(apiLinks.companyInfo.getAll, 'companyInfos');
    updateProgress(100);
    localStorage.setItem('Before', 'ok');
  } catch (error) {
    console.error('Error fetching data before login:', error);
    isDataLoading.value = false;
    localStorage.setItem('Before', 'false');
  }
}

export async function fetchDataAfterLogin() {
  isDataLoading.value = true;
  loadingProgress.value = 0;
  const userId = useAuthStore().user?.id;

  try {
    const notifications = await apiLinks.notifications.getAll();
    sessionStorage.setItem('notifications', JSON.stringify(notifications.data));
    updateProgress(10);
    const notificationId = notifications.data[0]?.id;

    if (notificationId) {
      const notificationDetail =
        await apiLinks.notifications.getDetail(notificationId);
      sessionStorage.setItem(
        'notification_detail',
        JSON.stringify(notificationDetail.data)
      );
      updateProgress(20);
    }

    const userVote = await apiLinks.votes.getUserVote();
    sessionStorage.setItem('user_vote', JSON.stringify(userVote.data));
    updateProgress(30);

    const profile = await apiLinks.profile.show(userId);
    sessionStorage.setItem('user_profile', JSON.stringify(profile.data));
    updateProgress(40);

    const profileEdit = await apiLinks.profile.edit(userId);
    sessionStorage.setItem(
      'user_profile_edit',
      JSON.stringify(profileEdit.data)
    );
    updateProgress(50);

    const chapters = await apiLinks.story.getChapters();
    sessionStorage.setItem('story_chapters', JSON.stringify(chapters.data));
    updateProgress(60);
    const chapterId = chapters.data[0]?.id;

    if (chapterId) {
      const chapterDetail = await apiLinks.story.getChapter(chapterId);
      sessionStorage.setItem(
        'chapter_detail',
        JSON.stringify(chapterDetail.data)
      );
      updateProgress(70);
    }

    const backgrounds = await apiLinks.story.getBackgrounds();
    sessionStorage.setItem(
      'story_backgrounds',
      JSON.stringify(backgrounds.data)
    );
    updateProgress(80);
    const backgroundId = backgrounds.data[0]?.id;

    if (backgroundId) {
      const backgroundImage = await apiLinks.story.getImage(backgroundId);
      sessionStorage.setItem(
        'background_image',
        JSON.stringify(backgroundImage.data)
      );
      updateProgress(90);
    }

    const userSettings = await apiLinks.story.getSettings(userId);
    sessionStorage.setItem('user_settings', JSON.stringify(userSettings.data));
    updateProgress(100);

    sessionStorage.setItem('After', 'ok');
  } catch (error) {
    console.error('Error fetching data after login:', error);
    isDataLoading.value = false;
    sessionStorage.setItem('After', 'false');
  }
}
