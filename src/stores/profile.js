import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';
import { ref } from 'vue';
export const useProfileStore = defineStore('profile', () => {
  const avatarUrl = ref('');
  const coverUrl = ref('');
  const cover_position = ref(0); // Dùng để lưu vị trí cover
  const users = ref({});
  const backendUrl = "http://127.0.0.1:8000";

  const getProfile = async (id) => {
    try {
      const response = await api.get(`/profile/${id}`);
      users.value = response.data;

      if (users.value.cover_position !== undefined) {
        cover_position.value = users.value.cover_position;
      }

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
    avatarUrl.value = newUrl.startsWith('http') ? newUrl : `${backendUrl}${newUrl}`;
  };
  // Cập nhật vị trí của cover
  const updateCoverPosition = (position) => {
    cover_position.value = Number(position);
    users.value.cover_position = Number(position);
  };
  const updateCoverUrl = (newUrl) => {
    coverUrl.value = newUrl.startsWith('http') ? newUrl : `${backendUrl}${newUrl}`;
  };

  return {
    avatarUrl,
    coverUrl,
    cover_position,
    users,
    getProfile,
    updateAvatarUrl,
    updateCoverPosition,
    updateCoverUrl,
  };
});
