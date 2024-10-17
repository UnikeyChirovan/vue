import { defineStore } from 'pinia';
export const useGeneralStore = defineStore('general', {
  state: () => ({
    isPostOverlay: false,
    isCropperModal: false,
    isImageDisplay: null,
    avatarUpdated: false, 
  }),
  actions: {
    setAvatarUpdated(value) {
      this.avatarUpdated = value;
    },
  },
  persist: true,
});
