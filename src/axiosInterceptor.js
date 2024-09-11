import axios from 'axios';
import { useAuthStore } from './stores/auth'; // Import store Pinia để quản lý trạng thái

// Tạo một instance mới của Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Axios interceptor cho mỗi request
api.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore();

    if (authStore.isLoggedIn && authStore.accessToken) {
      config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor cho mỗi response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi là 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Nếu request ban đầu không phải là yêu cầu refresh token
      if (!originalRequest._retry && originalRequest.url !== '/auth/refresh') {
        originalRequest._retry = true;
        try {
          // Gọi API để làm mới access token
          const response = await api.post('/auth/refresh');

          // Lưu lại token mới vào store
          const newAccessToken = response.data.access_token;
          authStore.accessToken = newAccessToken;

          // Gán lại token vào request và gửi lại
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Nếu refresh token không hợp lệ hoặc có lỗi, người dùng cần đăng xuất
          console.error('Làm mới token thất bại:', refreshError);
          authStore.logout(); // Đăng xuất người dùng
          return Promise.reject(refreshError);
        }
      }

      // Nếu token làm mới không hợp lệ hoặc quá trình refresh thất bại, yêu cầu logout
      if (originalRequest.url === '/auth/logout') {
        console.log('Token đã hết hạn, đăng xuất người dùng.');
        authStore.logout();
      }
    }

    // Nếu request là 405 Method Not Allowed (sai phương thức)
    if (error.response && error.response.status === 405) {
      console.error('Phương thức không hợp lệ:', error);
    }

    return Promise.reject(error);
  }
);

export default api;
