import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    accessToken: null,
  }),
  actions: {
    login(userData, isAdmin, accessToken) {
      this.isLoggedIn = true;
      this.accessToken = accessToken;
      this.isAdmin = isAdmin;
      this.user = userData;
    },
    logout() {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.user = null;
      this.accessToken = null;
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ['isLoggedIn', 'user', 'isAdmin', 'accessToken'],
  },
});
