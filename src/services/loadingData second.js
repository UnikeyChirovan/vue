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
export async function fetchDataBeforeLogin() {
  isDataLoading.value = true;
  loadingProgress.value = 0;

  const cacheStore = useCacheStore();

  try {
    // Check if we already have all data
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
      localStorage.setItem('Before', 'ok');
      return { success: true, fromCache: true };
    }

    // Fetch data step by step with progress updates
    updateProgress(0, 'Loading hero slides...');
    await cacheStore.fetchHeroSlides();
    updateProgress(15, 'Loading projects...');

    await cacheStore.fetchFutureProjects();
    updateProgress(30, 'Loading features...');

    await cacheStore.fetchFeatures();
    updateProgress(45, 'Loading categories...');

    await cacheStore.fetchCategories();
    updateProgress(60, 'Loading images...');

    await cacheStore.fetchImages();
    updateProgress(75, 'Loading vote results...');

    await cacheStore.fetchVoteResults();
    updateProgress(90, 'Loading company info...');

    await cacheStore.fetchCompanyInfo();
    updateProgress(100, 'Complete!');

    localStorage.setItem('Before', 'ok');
    return { success: true, fromCache: false };
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
export async function fetchDataAfterLogin() {
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
    // Check if we have most user data cached
    const hasUserData =
      cacheStore.getData('userProfile') &&
      cacheStore.getData('storyChapters') &&
      cacheStore.getData('storyBackgrounds') &&
      cacheStore.getData('userSettings');

    if (hasUserData) {
      // Still fetch session data (notifications, votes)
      updateProgress(50, 'Refreshing session data...');
      await Promise.all([
        cacheStore.fetchNotifications(true),
        cacheStore.fetchUserVote(true),
      ]);
      updateProgress(100, 'Complete!');
      sessionStorage.setItem('After', 'ok');
      return { success: true, fromCache: true };
    }

    // Fetch all user data
    updateProgress(10, 'Loading notifications...');
    await cacheStore.fetchNotifications();

    updateProgress(20, 'Loading user vote...');
    await cacheStore.fetchUserVote();

    updateProgress(35, 'Loading profile...');
    await cacheStore.fetchUserProfile(userId);

    updateProgress(50, 'Loading profile settings...');
    await cacheStore.fetchUserProfileEdit(userId);

    updateProgress(65, 'Loading story chapters...');
    await cacheStore.fetchStoryChapters();

    updateProgress(80, 'Loading backgrounds...');
    await cacheStore.fetchStoryBackgrounds();

    updateProgress(95, 'Loading user settings...');
    await cacheStore.fetchUserSettings(userId);

    updateProgress(100, 'Complete!');

    sessionStorage.setItem('After', 'ok');
    return { success: true, fromCache: false };
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
  return localStorage.getItem('Before') === 'ok';
}

/**
 * Check if user data is ready
 */
export function isUserDataReady() {
  return sessionStorage.getItem('After') === 'ok';
}

/**
 * Preload data for next page (optional optimization)
 */
export async function preloadPageData(pageType) {
  // Load in background without showing progress
  await loadPageData(pageType, { force: false, showProgress: false });
}
