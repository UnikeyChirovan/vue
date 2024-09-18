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

    if (error.response && error.response.status === 401) {
      if (!originalRequest._retry && originalRequest.url !== '/auth/refresh') {
        originalRequest._retry = true;
        try {
          const response = await api.post('/auth/refresh');
          const newAccessToken = response.data.access_token;
          authStore.accessToken = newAccessToken;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          if (refreshError.response && refreshError.response.status === 403) {
            await authStore.forceLogout();
            return Promise.reject(refreshError);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);



export default api;
