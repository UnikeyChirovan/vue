import { defineStore } from 'pinia';

export const useGeneralStore = defineStore('general', {
  state: () => ({
    isPostOverlay: false,
    isCropperModal: false,
    isCoverCropperModal: false,
    isImageDisplay: null,
    avatarUpdated: false,
    coverUpdated: false,
  }),

  actions: {
    setAvatarUpdated(value) {
      this.avatarUpdated = value;
    },

    setCoverUpdated(value) {
      this.coverUpdated = value;
    },
  },

  persist: true,
});
