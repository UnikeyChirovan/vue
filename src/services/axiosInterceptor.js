// import axios from 'axios';
// import { useAuthStore } from '../stores/auth'; 

// const api = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api',
//   withCredentials: true,
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use(
//   async (config) => {
//     const authStore = useAuthStore();

//     if (authStore.isLoggedIn && authStore.accessToken) {
//       config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const authStore = useAuthStore();
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401) {
//       if (!originalRequest._retry && originalRequest.url !== '/auth/refresh') {
//         originalRequest._retry = true;
//         try {
//           const response = await api.post('/auth/refresh');
//           const newAccessToken = response.data.access_token;
//           authStore.accessToken = newAccessToken;
//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         } catch (refreshError) {
//           if (refreshError.response && refreshError.response.status === 403) {
//             await authStore.forceLogout();
//             return Promise.reject(refreshError);
//           }
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
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
const pendingRequests = new Map();

api.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore();

    if (authStore.isLoggedIn && authStore.accessToken) {
      config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
    }
    const requestKey = `${config.method}-${config.url}`;
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }
    const requestPromise = Promise.resolve(config);
    pendingRequests.set(requestKey, requestPromise);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(requestKey); 
    return response;
  },
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;
    const requestKey = `${originalRequest.method}-${originalRequest.url}`;
    pendingRequests.delete(requestKey);

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
