import axios from 'axios';
import { useAuthStore } from './stores/auth';
import router from './router';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, 
});

axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn && authStore.accessToken) {
    config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const authStore = useAuthStore();

  if (error.response && error.response.status === 401 && !error.config._retry) {
    error.config._retry = true;
    try {
      const response = await axiosInstance.post('/auth/refresh');
      authStore.login(response.data.user, response.data.isAdmin, response.data.access_token);

      // Cập nhật lại Authorization cho yêu cầu cũ
      error.config.headers['Authorization'] = `Bearer ${response.data.access_token}`;
      
      // Thử lại yêu cầu ban đầu với access token mới
      return axiosInstance(error.config);
    } catch (refreshError) {
      await authStore.logout();
      router.push({ name: 'home' });
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
});

export default axiosInstance;
