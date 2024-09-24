import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    users: {},
  }),
  actions: {
    async fetchProfile(id) {
      try {
        const response = await api.get(`/profile/${id}`);
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },
    updatePosition(payload) {
      this.users.avatar_position = payload.avatar_position;
      this.users.cover_position = payload.cover_position;
    },
  },
});
