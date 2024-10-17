import axios from 'axios';
import { useAuthStore } from '../stores/auth'; 

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

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
