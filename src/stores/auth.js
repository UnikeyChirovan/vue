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
    rememberMe: false,
  }),

  actions: {
    async login(userData, isAdmin, accessToken, rememberMe) {
      this.isLoggedIn = true;
      this.accessToken = accessToken;
      // Kiểm tra department_id để set quyền
      this.isAdmin = userData.department_id === 1;
      this.isManager = userData.department_id === 3;
      this.rememberMe = rememberMe;
      this.user = userData;

      // Set user online sau khi login thành công
      try {
        await apiLinks.users.setOnline();
        // console.log('✓ Online status set');
      } catch (error) {
        console.error('Failed to set online status:', error);
      }
    },

    async logout() {
      try {
        const token = this.accessToken;

        // Set user offline TRƯỚC KHI logout
        try {
          await apiLinks.users.setOffline();
          // console.log('✓ Offline status set');
        } catch (error) {
          console.error('Failed to set offline status:', error);
        }

        await api.post(
          '/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.clearAuthState();
      } catch (error) {
        console.error('Đăng xuất thất bại:', error);
        // Vẫn clear state ngay cả khi có lỗi
        this.clearAuthState();
      }
    },

    async forceLogout() {
      try {
        // Set offline trước khi force logout
        try {
          await apiLinks.users.setOffline();
        } catch (error) {
          console.error('Failed to set offline:', error);
        }

        const userId = this.user?.id;
        if (userId) {
          await api.post('/auth/force-logout', { user_id: userId });
        }

        this.clearAuthState();
      } catch (error) {
        console.error('Force logout thất bại:', error);
        this.clearAuthState();
      }
    },

    async superForceLogout() {
      try {
        try {
          await apiLinks.users.setOffline();
        } catch (error) {
          console.error('Failed to set offline:', error);
        }

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

        this.clearAuthState();
      } catch (error) {
        console.error('Đăng xuất tất cả thiết bị thất bại:', error);
        this.clearAuthState();
      }
    },

    async selfDeleteAccount() {
      try {
        try {
          await apiLinks.users.setOffline();
        } catch (error) {
          console.error('Failed to set offline:', error);
        }

        const token = this.accessToken;
        await api.delete('/auth/delete-account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.clearAuthState();
      } catch (error) {
        console.error('Lỗi khi xóa tài khoản:', error);
        throw (
          error.response?.data?.message ||
          'Có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại!'
        );
      }
    },

    // Clear toàn bộ auth state và dữ liệu
    clearAuthState() {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.isManager = false;
      this.user = null;
      this.accessToken = null;
      this.rememberMe = false;

      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      // Redirect về trang chủ
      router.push({ name: 'home' });
    },
  },

  persist: {
    storage: localStorage,
    paths: [
      'isLoggedIn',
      'user',
      'isAdmin',
      'isManager',
      'accessToken',
      'rememberMe',
    ],
  },
});
