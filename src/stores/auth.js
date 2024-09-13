import { defineStore } from 'pinia';
import api from '../axiosInterceptor';

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
  } catch (error) {
    console.error('Đăng xuất thất bại:', error);
  }
}


  },
  persist: {
    storage: localStorage,
    paths: ['isLoggedIn', 'user', 'isAdmin', 'accessToken'],
  },
});