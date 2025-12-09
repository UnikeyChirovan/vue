import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';
import apiLinks from '../services/api-links';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    isManager: false,
    user: null,
    accessToken: null,
  }),
  actions: {
    async login(userData, isAdmin, accessToken, rememberMe) {
      this.isLoggedIn = true;
      this.accessToken = accessToken;
      this.isAdmin = isAdmin;
      this.isManager = userData.department_id === 3;
      this.rememberMe = rememberMe;
      this.user = userData;

      // ===== THÊM PHẦN NÀY =====
      // Set user online sau khi login thành công
      try {
        await apiLinks.users.setOnline();
        console.log('✓ Online status set');
      } catch (error) {
        console.error('Failed to set online status:', error);
      }
      // ===== KẾT THÚC THÊM =====
    },

    async logout() {
      try {
        const token = this.accessToken;

        // ===== THÊM PHẦN NÀY =====
        // Set user offline TRƯỚC KHI logout
        try {
          await apiLinks.users.setOffline();
          console.log('✓ Offline status set');
        } catch (error) {
          console.error('Failed to set offline status:', error);
        }
        // ===== KẾT THÚC THÊM =====

        await api.post(
          '/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.isLoggedIn = false;
        this.isAdmin = false;
        this.isManager = false;
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
        // ===== THÊM PHẦN NÀY =====
        // Set offline trước khi force logout
        try {
          await apiLinks.users.setOffline();
        } catch (error) {
          console.error('Failed to set offline:', error);
        }
        // ===== KẾT THÚC THÊM =====

        const userId = this.user.id;
        await api.post('/auth/force-logout', { user_id: userId });
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.isManager = false;
        this.user = null;
        this.accessToken = null;
        localStorage.clear();
        sessionStorage.clear();
        router.push({ name: 'home' });
      } catch (error) {
        console.log(error);
      }
    },

    async superForceLogout() {
      try {
        // ===== THÊM PHẦN NÀY =====
        try {
          await apiLinks.users.setOffline();
        } catch (error) {
          console.error('Failed to set offline:', error);
        }
        // ===== KẾT THÚC THÊM =====

        const token = this.accessToken;
        await api.post(
          '/auth/super-force-logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.isLoggedIn = false;
        this.isAdmin = false;
        this.isManager = false;
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
        // ===== THÊM PHẦN NÀY =====
        try {
          await apiLinks.users.setOffline();
        } catch (error) {
          console.error('Failed to set offline:', error);
        }
        // ===== KẾT THÚC THÊM =====

        const token = this.accessToken;
        await api.delete('/auth/delete-account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.isLoggedIn = false;
        this.isAdmin = false;
        this.isManager = false;
        this.user = null;
        this.accessToken = null;
        localStorage.clear();
        sessionStorage.clear();
        router.push({ name: 'home' });
      } catch (error) {
        console.error('Lỗi khi xóa tài khoản:', error);
        throw (
          error.response?.data?.message ||
          'Có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại!'
        );
      }
    },
  },
  persist: {
    storage: localStorage,
    paths: ['isLoggedIn', 'user', 'isAdmin', 'isManager', 'accessToken'],
  },
});
