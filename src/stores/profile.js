import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';
import { ref } from 'vue';

// export const useProfileStore = defineStore('profile', {
//   state: () => ({
//     users: {},
//     avatarUrl: '',  // Thêm thuộc tính này để lưu đường dẫn ảnh
//   }),
//   actions: {
//     async fetchProfile(id) {
//       try {
//         const response = await api.get(`/profile/${id}`);
//         this.users = response.data;
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     },
//     updatePosition(payload) {
//       this.users.cover_position = payload.cover_position;
//     },
//     updateAvatarUrl(url) {  // Thêm hành động để cập nhật đường dẫn ảnh
//       this.avatarUrl = url;
//     },
//   },
// });
export const useProfileStore = defineStore('profile', () => {
  const avatarUrl = ref('');
  const coverUrl = ref('');
  const users = ref({});
  const backendUrl = "http://127.0.0.1:8000";

  const getProfile = async (id) => {
    try {
      const response = await api.get(`/profile/${id}`);
      users.value = response.data;
      if (users.value.avatar) {
        avatarUrl.value = `${backendUrl}/storage/avatars/${id}/${users.value.avatar}`;
      }
      if (users.value.cover) {
        coverUrl.value = `${backendUrl}/storage/covers/${id}/${users.value.cover}`;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateAvatarUrl = (newUrl) => {
    avatarUrl.value = `${backendUrl}${newUrl}`;
  };

  return {
    users,
    avatarUrl,
    coverUrl,
    getProfile,
    updateAvatarUrl,
  };
});

