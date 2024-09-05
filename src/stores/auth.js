import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    accessToken: null,
  }),
  actions: {
    async login(userData, isAdmin, accessToken) {
      this.isLoggedIn = true;
      this.accessToken = accessToken;
      this.isAdmin = isAdmin;
      this.user = userData;
    },
    async logout() {
      try {
        const token = this.accessToken; 

        await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });

        this.isLoggedIn = false;
        this.isAdmin = false;
        this.user = null;
        this.accessToken = null;

        sessionStorage.clear(); 
      } catch (error) {
        console.error('Đăng xuất thất bại:', error);
      }
    },

  },
  persist: {
    storage: sessionStorage,
    paths: ['isLoggedIn', 'user', 'isAdmin', 'accessToken'],
  },
});
