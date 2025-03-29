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
    },
    async superForceLogout() {
      try {
        const token = this.accessToken;

        await api.post('/auth/super-force-logout', {}, {
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
        console.error('Đăng xuất tất cả thiết bị thất bại:', error);
      }
    },
    async selfDeleteAccount() {
      try {
        const token = this.accessToken;
        await api.delete('/auth/delete-account', {
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
        console.error('Lỗi khi xóa tài khoản:', error);
        throw error.response?.data?.message || 'Có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại!';
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['isLoggedIn', 'user', 'isAdmin', 'accessToken'],
  },
});
