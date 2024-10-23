import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    accessToken: null,
  }),
  actions: {
    async login(userData, isAdmin, accessToken, rememberMe) {
      this.isLoggedIn = true;
      this.accessToken = accessToken;
      this.isAdmin = isAdmin;
      this.rememberMe = rememberMe;
      this.user = userData;
    },
    async logout() {
      try {
        const token = this.accessToken;

        await api.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.isLoggedIn = false;
        this.isAdmin = false;
        this.user = null;
        this.accessToken = null;
        localStorage.clear();
        sessionStorage.clear(); 
        router.push({ name: 'home' });
      } catch (error) {
        console.error('Đăng xuất thất bại:', error);
      }
    },
    async forceLogout() {
      try {
        const userId = this.user.id;
        await api.post('/auth/force-logout', { user_id: userId });
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.user = null;
        this.accessToken = null;
        localStorage.clear();
        sessionStorage.clear(); 
        router.push({ name: 'home' });
      } catch (error) {
        console.log(error)
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['isLoggedIn', 'user', 'isAdmin', 'accessToken'],
  },
});
