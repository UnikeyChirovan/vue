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

    return true;
  } catch (error) {
    console.error(`Error fetching ${localKey} data:`, error);
    return false;
  }
}

export async function fetchDataBeforeLogin() {
  isDataLoading.value = true;
  loadingProgress.value = 0;

  try {
    const steps = [
      {
        call: () => apiLinks.heroSlides.getAll(),
        key: 'heroSlides',
        progress: 15,
      },
      {
        call: () => apiLinks.futureProjects.getAll(),
        key: 'futureProjects',
        progress: 30,
      },
      { call: () => apiLinks.features.getAll(), key: 'features', progress: 45 },
      {
        call: () => apiLinks.categories.getAll(),
        key: 'categories',
        progress: 60,
      },
      {
        call: () => apiLinks.imageManager.getImages(),
        key: 'images',
        progress: 75,
      },
      {
        call: () => apiLinks.votes.getVoteResults(),
        key: 'total_users_voted',
        progress: 90,
      },
      {
        call: () => apiLinks.companyInfo.getAll(),
        key: 'companyInfos',
        progress: 100,
      },
    ];

    for (const step of steps) {
      const success = await checkAndUpdateData(step.call, step.key);
      if (!success) {
        throw new Error(`Failed to load ${step.key}`);
      }
      updateProgress(step.progress);
    }

    localStorage.setItem('Before', 'ok');
    return { success: true };
  } catch (error) {
    console.error('Error fetching data before login:', error);
    isDataLoading.value = false;
    localStorage.setItem('Before', 'error');
    return { success: false, error };
  }
}

export async function fetchDataAfterLogin() {
  isDataLoading.value = true;
  loadingProgress.value = 0;
  const authStore = useAuthStore();
  const userId = authStore.user?.id;

  if (!userId) {
    console.error('User ID not found');
    isDataLoading.value = false;
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Notifications
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

    // User Vote
    const userVote = await apiLinks.votes.getUserVote();
    sessionStorage.setItem('user_vote', JSON.stringify(userVote.data));
    updateProgress(30);

    // Profile
    const profile = await apiLinks.profile.show(userId);
    sessionStorage.setItem('user_profile', JSON.stringify(profile.data));
    updateProgress(40);

    const profileEdit = await apiLinks.profile.edit(userId);
    sessionStorage.setItem(
      'user_profile_edit',
      JSON.stringify(profileEdit.data)
    );
    updateProgress(50);

    // Story Chapters
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

    // Backgrounds
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

    // User Settings
    const userSettings = await apiLinks.story.getSettings(userId);
    sessionStorage.setItem('user_settings', JSON.stringify(userSettings.data));
    updateProgress(100);

    sessionStorage.setItem('After', 'ok');
    return { success: true };
  } catch (error) {
    console.error('Error fetching data after login:', error);
    isDataLoading.value = false;
    sessionStorage.setItem('After', 'error');
    return { success: false, error };
  }
}

// Clear all data
export function clearAllData() {
  localStorage.clear();
  sessionStorage.clear();
  loadingProgress.value = 0;
  isDataLoading.value = false;
}
