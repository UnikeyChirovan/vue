import axios from 'axios';
import { defineStore } from 'pinia';
import api from '../axiosInterceptor';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    rememberMe: false,
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
        this.rememberMe = false;
        this.user = null;
        this.accessToken = null;
        localStorage.clear();
      } catch (error) {
        console.error('Đăng xuất thất bại:', error);
      }
    },
    // Thêm hàm forceLogout
    async forceLogout() {
      try {
        // Lấy user_id từ user trong auth store
        const userId = this.user.id;
        
        // Gửi yêu cầu tới API force-logout
        await api.post('/auth/force-logout', { user_id: userId });

        // Xóa trạng thái người dùng
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.rememberMe = false;
        this.user = null;
        this.accessToken = null;
        localStorage.clear();
        
        console.log('Đã cưỡng chế đăng xuất và xóa thông tin thiết bị');
      } catch (error) {
        console.error('Cưỡng chế đăng xuất thất bại:', error);
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['isLoggedIn', 'user', 'isAdmin', 'accessToken', 'rememberMe'],
  },
});
