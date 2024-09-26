import { defineStore } from 'pinia';
export const useGeneralStore = defineStore('general', {
  state: () => ({
    isPostOverlay: false,
    isCropperModal: false,
    isImageDisplay: null,
    avatarUpdated: false, // Trạng thái avatar được cập nhật
  }),
  actions: {
    setAvatarUpdated(value) {
      this.avatarUpdated = value;
    },
  },
  persist: true,
});
