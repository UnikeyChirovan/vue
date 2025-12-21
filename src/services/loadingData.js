// utils/loadingData.js
import { ref } from 'vue';
import { useCacheStore } from '../stores/cacheStore';
import { useAuthStore } from '../stores/auth';

export const loadingProgress = ref(0);
export const isDataLoading = ref(false);
export const loadingMessage = ref('');

function updateProgress(percent, message = '') {
  loadingProgress.value = percent;
  loadingMessage.value = message;

  if (percent === 100) {
    setTimeout(() => {
      isDataLoading.value = false;
      loadingMessage.value = '';
    }, 500);
  }
}

/**
 * Fetch essential public data before login
 * This data is cached in localStorage and reused across sessions
 */
export async function fetchDataBeforeLogin(forceRefresh = false) {
  isDataLoading.value = true;
  loadingProgress.value = 0;

  const cacheStore = useCacheStore();

  try {
    // ⭐ Kiểm tra xem đã fetch thành công trước đó chưa
    const beforeStatus = localStorage.getItem('Before');

    // Nếu đã OK và không force refresh, kiểm tra data có đủ không
    if (!forceRefresh && beforeStatus === 'ok') {
      const hasAllData =
        cacheStore.getData('heroSlides') &&
        cacheStore.getData('futureProjects') &&
        cacheStore.getData('features') &&
        cacheStore.getData('categories') &&
        cacheStore.getData('images') &&
        cacheStore.getData('companyInfos') &&
        cacheStore.getData('voteResults', true);

      if (hasAllData) {
        updateProgress(100, 'Data loaded from cache');
        return { success: true, fromCache: true };
      } else {
        // ⚠️ Data thiếu, cần fetch lại
        console.warn('⚠️ Public data incomplete, re-fetching...');
      }
    }

    // ⭐ Fetch từng loại data, track success/fail
    const results = {
      heroSlides: false,
      futureProjects: false,
      features: false,
      categories: false,
      images: false,
      voteResults: false,
      companyInfos: false,
    };

    // Fetch data step by step with progress updates
    try {
      updateProgress(0, 'Loading hero slides...');
      await cacheStore.fetchHeroSlides();
      results.heroSlides = true;
    } catch (err) {
      console.error('Failed to fetch heroSlides:', err);
    }

    try {
      updateProgress(15, 'Loading projects...');
      await cacheStore.fetchFutureProjects();
      results.futureProjects = true;
    } catch (err) {
      console.error('Failed to fetch futureProjects:', err);
    }

    try {
      updateProgress(30, 'Loading features...');
      await cacheStore.fetchFeatures();
      results.features = true;
    } catch (err) {
      console.error('Failed to fetch features:', err);
    }

    try {
      updateProgress(45, 'Loading categories...');
      await cacheStore.fetchCategories();
      results.categories = true;
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }

    try {
      updateProgress(60, 'Loading images...');
      await cacheStore.fetchImages();
      results.images = true;
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }

    try {
      updateProgress(75, 'Loading vote results...');
      await cacheStore.fetchVoteResults();
      results.voteResults = true;
    } catch (err) {
      console.error('Failed to fetch voteResults:', err);
    }

    try {
      updateProgress(90, 'Loading company info...');
      await cacheStore.fetchCompanyInfo();
      results.companyInfos = true;
    } catch (err) {
      console.error('Failed to fetch companyInfo:', err);
    }

    updateProgress(100, 'Complete!');

    // ⭐ Kiểm tra xem tất cả data đã load thành công chưa
    const allSuccess = Object.values(results).every((v) => v === true);

    if (allSuccess) {
      localStorage.setItem('Before', 'ok');
      return { success: true, fromCache: false, results };
    } else {
      // ⚠️ Một số data failed
      localStorage.setItem('Before', 'partial');
      console.warn('⚠️ Some public data failed to load:', results);
      return { success: false, partial: true, results };
    }
  } catch (error) {
    console.error('Error fetching data before login:', error);
    isDataLoading.value = false;
    loadingMessage.value = 'Error loading data';
    localStorage.setItem('Before', 'error');
    return { success: false, error };
  }
}

/**
 * Fetch user-specific data after login
 * Most data is cached in localStorage for persistence
 * Session-sensitive data (votes, notifications) uses sessionStorage
 */
export async function fetchDataAfterLogin(forceRefresh = false) {
  isDataLoading.value = true;
  loadingProgress.value = 0;

  const authStore = useAuthStore();
  const cacheStore = useCacheStore();
  const userId = authStore.user?.id;

  if (!userId) {
    console.error('User ID not found');
    isDataLoading.value = false;
    return { success: false, error: 'User not authenticated' };
  }

  // ⭐ CHECK: Nếu không có accessToken thì không call API
  if (!authStore.accessToken) {
    console.error('No access token found');
    isDataLoading.value = false;
    return { success: false, error: 'No access token' };
  }

  try {
    // ⭐ Kiểm tra xem đã fetch thành công trước đó chưa
    const afterStatus = sessionStorage.getItem('After');

    // Nếu đã OK và không force refresh, kiểm tra data có đủ không
    if (!forceRefresh && afterStatus === 'ok') {
      const hasUserData =
        cacheStore.getData('userProfile') &&
        cacheStore.getData('storyChapters') &&
        cacheStore.getData('storyBackgrounds') &&
        cacheStore.getData('userSettings');

      if (hasUserData) {
        // Still fetch session data (notifications, votes) vì có thể thay đổi
        updateProgress(50, 'Refreshing session data...');
        try {
          await Promise.all([
            cacheStore.fetchNotifications(true),
            cacheStore.fetchUserVote(true),
          ]);
        } catch (err) {
          console.error('Failed to refresh session data:', err);
        }
        updateProgress(100, 'Complete!');
        return { success: true, fromCache: true };
      } else {
        // ⚠️ Data thiếu, cần fetch lại
        console.warn('⚠️ User data incomplete, re-fetching...');
      }
    }

    // ⭐ Fetch từng loại data, track success/fail
    const results = {
      notifications: false,
      userVote: false,
      userProfile: false,
      userProfileEdit: false,
      storyChapters: false,
      storyBackgrounds: false,
      userSettings: false,
    };

    // Fetch all user data với error handling riêng
    try {
      updateProgress(10, 'Loading notifications...');
      await cacheStore.fetchNotifications();
      results.notifications = true;
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }

    try {
      updateProgress(20, 'Loading user vote...');
      await cacheStore.fetchUserVote();
      results.userVote = true;
    } catch (err) {
      console.error('Failed to fetch userVote:', err);
    }

    try {
      updateProgress(35, 'Loading profile...');
      await cacheStore.fetchUserProfile(userId);
      results.userProfile = true;
    } catch (err) {
      console.error('Failed to fetch userProfile:', err);
    }

    try {
      updateProgress(50, 'Loading profile settings...');
      await cacheStore.fetchUserProfileEdit(userId);
      results.userProfileEdit = true;
    } catch (err) {
      console.error('Failed to fetch userProfileEdit:', err);
    }

    try {
      updateProgress(65, 'Loading story chapters...');
      await cacheStore.fetchStoryChapters();
      results.storyChapters = true;
    } catch (err) {
      console.error('Failed to fetch storyChapters:', err);
    }

    try {
      updateProgress(80, 'Loading backgrounds...');
      await cacheStore.fetchStoryBackgrounds();
      results.storyBackgrounds = true;
    } catch (err) {
      console.error('Failed to fetch storyBackgrounds:', err);
    }

    try {
      updateProgress(95, 'Loading user settings...');
      await cacheStore.fetchUserSettings(userId);
      results.userSettings = true;
    } catch (err) {
      console.error('Failed to fetch userSettings:', err);
    }

    updateProgress(100, 'Complete!');

    // ⭐ Kiểm tra xem các data QUAN TRỌNG đã load thành công chưa
    const criticalSuccess =
      results.userProfile && results.storyChapters && results.storyBackgrounds;

    if (criticalSuccess) {
      // Critical data OK, các data khác fail cũng không sao
      sessionStorage.setItem('After', 'ok');
      return { success: true, fromCache: false, results };
    } else {
      // ⚠️ Critical data failed
      sessionStorage.setItem('After', 'partial');
      console.warn('⚠️ Some critical user data failed to load:', results);
      return { success: false, partial: true, results };
    }
  } catch (error) {
    console.error('Error fetching data after login:', error);
    isDataLoading.value = false;
    loadingMessage.value = 'Error loading user data';
    sessionStorage.setItem('After', 'error');
    return { success: false, error };
  }
}

/**
 * Load page-specific data
 * Call this in onMounted of each page to ensure data is available
 */
export async function loadPageData(pageType, options = {}) {
  const cacheStore = useCacheStore();
  const authStore = useAuthStore();

  const { force = false, showProgress = false } = options;

  if (showProgress) {
    isDataLoading.value = true;
    loadingProgress.value = 0;
  }

  try {
    switch (pageType) {
      case 'home':
        // Home page needs: heroSlides, features, futureProjects
        await Promise.all([
          cacheStore.fetchHeroSlides(force),
          cacheStore.fetchFeatures(force),
          cacheStore.fetchFutureProjects(force),
        ]);
        break;

      case 'profile':
        // Profile page needs: userProfile, userProfileEdit
        if (!authStore.user?.id) throw new Error('User not authenticated');
        await Promise.all([
          cacheStore.fetchUserProfile(authStore.user.id, force),
          cacheStore.fetchUserProfileEdit(authStore.user.id, force),
        ]);
        break;

      case 'story':
        // Story page needs: chapters, backgrounds, userSettings, lastReadChapter
        if (!authStore.user?.id) throw new Error('User not authenticated');
        await Promise.all([
          cacheStore.fetchStoryChapters(force),
          cacheStore.fetchStoryBackgrounds(force),
          cacheStore.fetchUserSettings(authStore.user.id, force),
          cacheStore.fetchLastReadChapter(force),
        ]);
        break;

      case 'chat':
        // Chat page needs: conversations, chatSettings, unreadCount
        await Promise.all([
          cacheStore.fetchConversations(force),
          cacheStore.fetchChatSettings(force),
          cacheStore.fetchUnreadCount(force),
        ]);
        break;

      case 'support':
        // Support page needs: supportConversation
        await cacheStore.fetchSupportConversation(force);
        break;

      case 'social':
        // Social page needs: followedUsers, blockedUsers
        await Promise.all([
          cacheStore.fetchFollowedUsers(force),
          cacheStore.fetchBlockedUsers(force),
        ]);
        break;

      case 'videos':
        // Videos page needs: videos, lastWatchEpisode
        await Promise.all([
          cacheStore.fetchVideos(force),
          cacheStore.fetchLastWatchEpisode(force),
        ]);
        break;

      case 'vote':
        // Vote page needs: userVote, voteResults
        await Promise.all([
          cacheStore.fetchUserVote(force),
          cacheStore.fetchVoteResults(force),
        ]);
        break;

      case 'admin':
        // Admin page needs: allUsers (check permissions)
        if (!authStore.isAdmin && !authStore.isManager) {
          throw new Error('Unauthorized access');
        }
        await cacheStore.fetchAllUsers(force);
        break;

      case 'categories':
        // Categories page needs: categories, images
        await Promise.all([
          cacheStore.fetchCategories(force),
          cacheStore.fetchImages(force),
        ]);
        break;

      case 'sections':
        // Sections page needs: sections
        await cacheStore.fetchSections(force);
        break;

      default:
        console.warn(`Unknown page type: ${pageType}`);
    }

    if (showProgress) {
      updateProgress(100, 'Data loaded');
    }
    return { success: true };
  } catch (error) {
    console.error(`Error loading page data for ${pageType}:`, error);
    if (showProgress) {
      isDataLoading.value = false;
      loadingMessage.value = `Error loading ${pageType} data`;
    }
    return { success: false, error };
  }
}

/**
 * Refresh specific data type
 * Useful for manual refresh or after updates
 */
export async function refreshData(dataType) {
  const cacheStore = useCacheStore();
  const authStore = useAuthStore();

  try {
    switch (dataType) {
      case 'notifications':
        return await cacheStore.fetchNotifications(true);
      case 'conversations':
        return await cacheStore.fetchConversations(true);
      case 'votes':
        await cacheStore.fetchUserVote(true);
        return await cacheStore.fetchVoteResults(true);
      case 'profile':
        if (!authStore.user?.id) throw new Error('User not authenticated');
        return await cacheStore.fetchUserProfile(authStore.user.id, true);
      case 'social':
        await cacheStore.fetchFollowedUsers(true);
        return await cacheStore.fetchBlockedUsers(true);
      case 'unreadCount':
        return await cacheStore.fetchUnreadCount(true);
      default:
        console.warn(`Unknown data type: ${dataType}`);
        return null;
    }
  } catch (error) {
    console.error(`Error refreshing ${dataType}:`, error);
    throw error;
  }
}

/**
 * Clear all cached data
 * Use this on logout or when needed
 */
export function clearAllData(keepPublicData = false) {
  const cacheStore = useCacheStore();

  if (keepPublicData) {
    // Only clear user-specific data
    cacheStore.invalidateUserData();
    sessionStorage.clear();
  } else {
    // Clear everything
    cacheStore.clearAllData(false);
  }

  loadingProgress.value = 0;
  isDataLoading.value = false;
  loadingMessage.value = '';

  localStorage.removeItem('Before');
  sessionStorage.removeItem('After');
}

/**
 * Check if initial data is ready
 */
export function isInitialDataReady() {
  const status = localStorage.getItem('Before');
  return status === 'ok' || status === 'partial';
}

/**
 * Check if user data is ready
 */
export function isUserDataReady() {
  const status = sessionStorage.getItem('After');
  return status === 'ok' || status === 'partial';
}

/**
 * Get missing public data and retry
 */
export async function retryMissingPublicData() {
  const cacheStore = useCacheStore();
  const missing = [];

  if (!cacheStore.getData('heroSlides')) missing.push('heroSlides');
  if (!cacheStore.getData('futureProjects')) missing.push('futureProjects');
  if (!cacheStore.getData('features')) missing.push('features');
  if (!cacheStore.getData('categories')) missing.push('categories');
  if (!cacheStore.getData('images')) missing.push('images');
  if (!cacheStore.getData('companyInfos')) missing.push('companyInfos');
  if (!cacheStore.getData('voteResults', true)) missing.push('voteResults');

  if (missing.length === 0) {
    return { success: true, message: 'All data present' };
  }

  console.log('🔄 Retrying missing public data:', missing);

  const results = {};
  for (const key of missing) {
    try {
      switch (key) {
        case 'heroSlides':
          await cacheStore.fetchHeroSlides(true);
          break;
        case 'futureProjects':
          await cacheStore.fetchFutureProjects(true);
          break;
        case 'features':
          await cacheStore.fetchFeatures(true);
          break;
        case 'categories':
          await cacheStore.fetchCategories(true);
          break;
        case 'images':
          await cacheStore.fetchImages(true);
          break;
        case 'companyInfos':
          await cacheStore.fetchCompanyInfo(true);
          break;
        case 'voteResults':
          await cacheStore.fetchVoteResults(true);
          break;
      }
      results[key] = true;
    } catch (err) {
      console.error(`Failed to retry ${key}:`, err);
      results[key] = false;
    }
  }

  const allSuccess = Object.values(results).every((v) => v === true);
  if (allSuccess) {
    localStorage.setItem('Before', 'ok');
  }

  return { success: allSuccess, results };
}

/**
 * Get missing user data and retry
 */
export async function retryMissingUserData() {
  const authStore = useAuthStore();
  const cacheStore = useCacheStore();
  const userId = authStore.user?.id;

  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  const missing = [];
  if (!cacheStore.getData('userProfile')) missing.push('userProfile');
  if (!cacheStore.getData('userProfileEdit')) missing.push('userProfileEdit');
  if (!cacheStore.getData('storyChapters')) missing.push('storyChapters');
  if (!cacheStore.getData('storyBackgrounds')) missing.push('storyBackgrounds');
  if (!cacheStore.getData('userSettings')) missing.push('userSettings');

  if (missing.length === 0) {
    return { success: true, message: 'All data present' };
  }

  console.log('🔄 Retrying missing user data:', missing);

  const results = {};
  for (const key of missing) {
    try {
      switch (key) {
        case 'userProfile':
          await cacheStore.fetchUserProfile(userId, true);
          break;
        case 'userProfileEdit':
          await cacheStore.fetchUserProfileEdit(userId, true);
          break;
        case 'storyChapters':
          await cacheStore.fetchStoryChapters(true);
          break;
        case 'storyBackgrounds':
          await cacheStore.fetchStoryBackgrounds(true);
          break;
        case 'userSettings':
          await cacheStore.fetchUserSettings(userId, true);
          break;
      }
      results[key] = true;
    } catch (err) {
      console.error(`Failed to retry ${key}:`, err);
      results[key] = false;
    }
  }

  const criticalSuccess =
    results.userProfile !== false && results.storyChapters !== false;

  if (criticalSuccess) {
    sessionStorage.setItem('After', 'ok');
  }

  return { success: criticalSuccess, results };
}

/**
 * Preload data for next page (optional optimization)
 */
export async function preloadPageData(pageType) {
  // Load in background without showing progress
  await loadPageData(pageType, { force: false, showProgress: false });
}
