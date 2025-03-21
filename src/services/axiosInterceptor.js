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

let isRefreshing = false;
let refreshSubscribers = [];

// Hàm thêm các lệnh đợi khi refresh token
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

// Gọi các lệnh đợi với token mới
function onRefreshed(newAccessToken) {
  refreshSubscribers.map(callback => callback(newAccessToken));
  refreshSubscribers = [];
}

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
      // Kiểm tra nếu đã thử gọi refresh token
      if (!originalRequest._retry && originalRequest.url !== '/auth/refresh') {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const response = await api.post('/auth/refresh');
            const newAccessToken = response.data.access_token;
            authStore.accessToken = newAccessToken;

            // Đặt Authorization cho lệnh gốc và thực hiện lại lệnh
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            onRefreshed(newAccessToken);
            isRefreshing = false;

            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            if (refreshError.response && refreshError.response.status === 403) {
              await authStore.forceLogout();
              return Promise.reject(refreshError);
            }
          }
        }

        // Đợi cho đến khi refresh token hoàn tất
        return new Promise((resolve) => {
          subscribeTokenRefresh((newAccessToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
