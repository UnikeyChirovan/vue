// stores/cacheStore.js
import { defineStore } from 'pinia';
import apiLinks from '../services/api-links';
import { useAuthStore } from './auth';

export const useCacheStore = defineStore('cache', {
  state: () => ({
    // Data chung (localStorage)
    heroSlides: null,
    futureProjects: null,
    features: null,
    categories: null,
    images: null,
    companyInfos: null,
    sections: null,

    // Data người dùng (localStorage)
    userProfile: null,
    userProfileEdit: null,
    storyChapters: null,
    storyBackgrounds: null,
    userSettings: null,
    followedUsers: null,
    blockedUsers: null,
    chatSettings: null,
    privacySettings: null,

    // Data session (sessionStorage)
    notifications: null,
    userVote: null,
    voteResults: null,
    conversations: null,
    unreadCount: 0,
    supportConversation: null,
    videos: null,
    lastReadChapter: null,
    lastWatchEpisode: null,

    // Metadata
    lastUpdated: {},
  }),

  getters: {
    // Check if data exists
    hasHeroSlides: (state) => !!state.heroSlides,
    hasUserProfile: (state) => !!state.userProfile,
    hasNotifications: (state) => !!state.notifications,

    // Get specific data
    getHeroSlides: (state) => state.heroSlides || [],
    getFutureProjects: (state) => state.futureProjects || [],
    getFeatures: (state) => state.features || [],
    getCategories: (state) => state.categories || [],
    getImages: (state) => state.images || [],
    getUserProfile: (state) => state.userProfile,
    getNotifications: (state) => state.notifications || [],
    getUserVote: (state) => state.userVote,
    getConversations: (state) => state.conversations || [],

    // Check if data needs refresh (optional - for time-based refresh)
    needsRefresh:
      (state) =>
      (key, maxAge = 3600000) => {
        const lastUpdate = state.lastUpdated[key];
        if (!lastUpdate) return true;
        return Date.now() - lastUpdate > maxAge;
      },
  },

  actions: {
    // ============================================
    // CORE STORAGE FUNCTIONS
    // ============================================

    setData(key, value, useSession = false) {
      this[key] = value;
      this.lastUpdated[key] = Date.now();

      const storage = useSession ? sessionStorage : localStorage;
      storage.setItem(key, JSON.stringify(value));
      storage.setItem(`${key}_timestamp`, Date.now().toString());
    },

    getData(key, useSession = false) {
      if (this[key]) return this[key];

      const storage = useSession ? sessionStorage : localStorage;
      const data = storage.getItem(key);

      if (data) {
        try {
          this[key] = JSON.parse(data);
          const timestamp = storage.getItem(`${key}_timestamp`);
          if (timestamp) {
            this.lastUpdated[key] = parseInt(timestamp);
          }
          return this[key];
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
          return null;
        }
      }
      return null;
    },

    updateData(key, value, useSession = false) {
      this.setData(key, value, useSession);
    },

    deleteData(key, useSession = false) {
      this[key] = null;
      delete this.lastUpdated[key];

      const storage = useSession ? sessionStorage : localStorage;
      storage.removeItem(key);
      storage.removeItem(`${key}_timestamp`);
    },

    clearAllData(keepAuth = true) {
      // Clear state
      Object.keys(this.$state).forEach((key) => {
        if (key !== 'lastUpdated') {
          this[key] = null;
        }
      });
      this.lastUpdated = {};

      // Clear storage
      if (keepAuth) {
        const authData = localStorage.getItem('auth');
        localStorage.clear();
        if (authData) localStorage.setItem('auth', authData);
      } else {
        localStorage.clear();
      }
      sessionStorage.clear();
    },

    // ============================================
    // PUBLIC DATA (localStorage - no auth required)
    // ============================================

    async fetchHeroSlides(force = false) {
      if (!force && this.getData('heroSlides')) return this.heroSlides;

      try {
        const res = await apiLinks.heroSlides.getAll();
        this.setData('heroSlides', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        throw error;
      }
    },

    async fetchFutureProjects(force = false) {
      if (!force && this.getData('futureProjects')) return this.futureProjects;

      try {
        const res = await apiLinks.futureProjects.getAll();
        this.setData('futureProjects', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching future projects:', error);
        throw error;
      }
    },

    async fetchFeatures(force = false) {
      if (!force && this.getData('features')) return this.features;

      try {
        const res = await apiLinks.features.getAll();
        this.setData('features', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching features:', error);
        throw error;
      }
    },

    async fetchCategories(force = false) {
      if (!force && this.getData('categories')) return this.categories;

      try {
        const res = await apiLinks.categories.getAll();
        this.setData('categories', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },

    async fetchImages(force = false) {
      if (!force && this.getData('images')) return this.images;

      try {
        const res = await apiLinks.imageManager.getImages();
        this.setData('images', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
    },

    async fetchCompanyInfo(force = false) {
      if (!force && this.getData('companyInfos')) return this.companyInfos;

      try {
        const res = await apiLinks.companyInfo.getAll();
        this.setData('companyInfos', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching company info:', error);
        throw error;
      }
    },

    async fetchSections(force = false) {
      if (!force && this.getData('sections')) return this.sections;

      try {
        const res = await apiLinks.sections.getAll();
        this.setData('sections', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching sections:', error);
        throw error;
      }
    },

    async fetchVideos(force = false) {
      if (!force && this.getData('videos', true)) return this.videos;

      try {
        const res = await apiLinks.videos.getAll();
        this.setData('videos', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }
    },

    // ============================================
    // USER DATA (localStorage - requires auth)
    // ============================================

    async fetchUserProfile(userId, force = false) {
      if (!force && this.getData('userProfile')) return this.userProfile;

      try {
        const res = await apiLinks.profile.show(userId);
        this.setData('userProfile', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },

    async fetchUserProfileEdit(userId, force = false) {
      if (!force && this.getData('userProfileEdit'))
        return this.userProfileEdit;

      try {
        const res = await apiLinks.profile.edit(userId);
        this.setData('userProfileEdit', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching user profile edit:', error);
        throw error;
      }
    },

    async fetchStoryChapters(force = false) {
      if (!force && this.getData('storyChapters')) return this.storyChapters;

      try {
        const res = await apiLinks.story.getChapters();
        this.setData('storyChapters', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching story chapters:', error);
        throw error;
      }
    },

    async fetchStoryBackgrounds(force = false) {
      if (!force && this.getData('storyBackgrounds'))
        return this.storyBackgrounds;

      try {
        const res = await apiLinks.story.getBackgrounds();
        this.setData('storyBackgrounds', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching backgrounds:', error);
        throw error;
      }
    },

    async fetchUserSettings(userId, force = false) {
      if (!force && this.getData('userSettings')) return this.userSettings;

      try {
        const res = await apiLinks.story.getSettings(userId);
        this.setData('userSettings', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching user settings:', error);
        throw error;
      }
    },

    async fetchFollowedUsers(force = false) {
      if (!force && this.getData('followedUsers')) return this.followedUsers;

      try {
        const res = await apiLinks.social.getFollowedUsers();
        this.setData('followedUsers', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching followed users:', error);
        throw error;
      }
    },

    async fetchBlockedUsers(force = false) {
      if (!force && this.getData('blockedUsers')) return this.blockedUsers;

      try {
        const res = await apiLinks.social.getBlockedUsers();
        this.setData('blockedUsers', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching blocked users:', error);
        throw error;
      }
    },

    async fetchChatSettings(force = false) {
      if (!force && this.getData('chatSettings')) return this.chatSettings;

      try {
        const res = await apiLinks.chat.getSettings();
        this.setData('chatSettings', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching chat settings:', error);
        throw error;
      }
    },

    async fetchPrivacySettings(force = false) {
      if (!force && this.getData('privacySettings'))
        return this.privacySettings;

      try {
        const res = await apiLinks.profile.getPrivacySettings();
        this.setData('privacySettings', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
        throw error;
      }
    },

    // ============================================
    // SESSION DATA (sessionStorage - short-lived)
    // ============================================

    async fetchNotifications(force = false) {
      if (!force && this.getData('notifications', true))
        return this.notifications;

      try {
        const res = await apiLinks.notifications.getAll();
        this.setData('notifications', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
    },

    async fetchUserVote(force = false) {
      if (!force && this.getData('userVote', true)) return this.userVote;

      try {
        const res = await apiLinks.votes.getUserVote();
        this.setData('userVote', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching user vote:', error);
        throw error;
      }
    },

    async fetchVoteResults(force = false) {
      if (!force && this.getData('voteResults', true)) return this.voteResults;

      try {
        const res = await apiLinks.votes.getVoteResults();
        this.setData('voteResults', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching vote results:', error);
        throw error;
      }
    },

    async fetchConversations(force = false) {
      if (!force && this.getData('conversations', true))
        return this.conversations;

      try {
        const res = await apiLinks.chat.getConversations();
        this.setData('conversations', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
    },

    async fetchUnreadCount(force = false) {
      if (!force && this.unreadCount !== 0) return this.unreadCount;

      try {
        const res = await apiLinks.chat.getUnreadCount();
        this.unreadCount = res.data.unread_count || 0;
        sessionStorage.setItem('unreadCount', this.unreadCount.toString());
        return this.unreadCount;
      } catch (error) {
        console.error('Error fetching unread count:', error);
        throw error;
      }
    },

    async fetchSupportConversation(force = false) {
      if (!force && this.getData('supportConversation', true)) {
        return this.supportConversation;
      }

      try {
        const res = await apiLinks.support.getOrCreateConversation();
        this.setData('supportConversation', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching support conversation:', error);
        throw error;
      }
    },

    async fetchLastReadChapter(force = false) {
      if (!force && this.getData('lastReadChapter', true)) {
        return this.lastReadChapter;
      }

      try {
        const res = await apiLinks.story.getLastReadChapter();
        this.setData('lastReadChapter', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching last read chapter:', error);
        throw error;
      }
    },

    async fetchLastWatchEpisode(force = false) {
      if (!force && this.getData('lastWatchEpisode', true)) {
        return this.lastWatchEpisode;
      }

      try {
        const res = await apiLinks.videos.getLastWatchEpisode();
        this.setData('lastWatchEpisode', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching last watch episode:', error);
        throw error;
      }
    },

    // ============================================
    // ADMIN/MANAGER DATA (conditional)
    // ============================================

    async fetchAllUsers(force = false) {
      const authStore = useAuthStore();
      if (!authStore.isAdmin && !authStore.isManager) {
        throw new Error('Unauthorized: Admin/Manager access required');
      }

      if (!force && this.getData('allUsers', true)) return this.allUsers;

      try {
        const res = await apiLinks.users.getAll();
        this.setData('allUsers', res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
      }
    },

    async fetchSupportConversations(type = 'active', force = false) {
      const authStore = useAuthStore();
      if (!authStore.isManager && !authStore.isAdmin) {
        throw new Error('Unauthorized: Manager/Admin access required');
      }

      const key = `supportConversations_${type}`;
      if (!force && this.getData(key, true)) return this[key];

      try {
        const res = await apiLinks.support.getConversations(type);
        this.setData(key, res.data, true);
        return res.data;
      } catch (error) {
        console.error('Error fetching support conversations:', error);
        throw error;
      }
    },

    // ============================================
    // BATCH OPERATIONS
    // ============================================

    async fetchInitialPublicData() {
      const promises = [
        this.fetchHeroSlides(),
        this.fetchFutureProjects(),
        this.fetchFeatures(),
        this.fetchCategories(),
        this.fetchImages(),
        this.fetchCompanyInfo(),
        this.fetchVoteResults(),
      ];

      try {
        await Promise.all(promises);
        return { success: true };
      } catch (error) {
        console.error('Error fetching initial public data:', error);
        return { success: false, error };
      }
    },

    async fetchInitialUserData(userId) {
      const promises = [
        this.fetchNotifications(),
        this.fetchUserVote(),
        this.fetchUserProfile(userId),
        this.fetchUserProfileEdit(userId),
        this.fetchStoryChapters(),
        this.fetchStoryBackgrounds(),
        this.fetchUserSettings(userId),
      ];

      try {
        await Promise.all(promises);
        return { success: true };
      } catch (error) {
        console.error('Error fetching initial user data:', error);
        return { success: false, error };
      }
    },

    // ============================================
    // UPDATE OPERATIONS (with auto-cache update)
    // ============================================

    async updateUserProfile(userId, data) {
      try {
        const res = await apiLinks.profile.update(userId, data);
        this.setData('userProfile', res.data);
        return res.data;
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
    },

    async updateUserSettings(data) {
      try {
        const res = await apiLinks.story.updateSettings(data);
        this.setData('userSettings', res.data);
        return res.data;
      } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
      }
    },

    async updatePrivacySettings(data) {
      try {
        const res = await apiLinks.profile.updatePrivacySettings(data);
        this.setData('privacySettings', res.data);
        return res.data;
      } catch (error) {
        console.error('Error updating privacy settings:', error);
        throw error;
      }
    },

    async createOrUpdateVote(data) {
      try {
        const res = await apiLinks.votes.createOrUpdate(data);
        // Update both user vote and results
        await this.fetchUserVote(true);
        await this.fetchVoteResults(true);
        return res.data;
      } catch (error) {
        console.error('Error updating vote:', error);
        throw error;
      }
    },

    // ============================================
    // INVALIDATION HELPERS
    // ============================================

    invalidateUserData() {
      const userKeys = [
        'userProfile',
        'userProfileEdit',
        'userSettings',
        'notifications',
        'userVote',
        'conversations',
        'followedUsers',
        'blockedUsers',
        'chatSettings',
        'privacySettings',
        'lastReadChapter',
        'lastWatchEpisode',
      ];

      userKeys.forEach((key) => {
        this.deleteData(
          key,
          key.startsWith('user') ||
            [
              'notifications',
              'conversations',
              'lastReadChapter',
              'lastWatchEpisode',
            ].includes(key)
        );
      });
    },

    invalidatePublicData() {
      const publicKeys = [
        'heroSlides',
        'futureProjects',
        'features',
        'categories',
        'images',
        'companyInfos',
        'sections',
        'voteResults',
      ];

      publicKeys.forEach((key) => this.deleteData(key));
    },
  },
});
