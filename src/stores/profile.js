import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';
import { ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
  const avatarUrl = ref('');
  const coverUrl = ref('');
  const cover_position = ref(0);
  const users = ref({});
  const backendUrl = 'http://127.0.0.1:8000';

  const syncWithStorage = () => {
    sessionStorage.setItem('user_profile', JSON.stringify(users.value));
  };

  const getProfile = async (id) => {
    const storedProfile = sessionStorage.getItem('user_profile');
    if (storedProfile) {
      users.value = JSON.parse(storedProfile);

      if (users.value.cover_position !== undefined) {
        cover_position.value = users.value.cover_position;
      }

      if (users.value.avatar) {
        avatarUrl.value = `${backendUrl}/storage/avatars/${id}/${users.value.avatar}`;
      }
      if (users.value.cover) {
        coverUrl.value = `${backendUrl}/storage/covers/${id}/${users.value.cover}`;
      }
    } else {
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

        sessionStorage.setItem('user_profile', JSON.stringify(users.value));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateAvatarUrl = (newUrl) => {
    avatarUrl.value = newUrl.startsWith('http')
      ? newUrl
      : `${backendUrl}${newUrl}`;
    const avatarFileName = newUrl.split('/').pop();
    users.value.avatar = avatarFileName;
    syncWithStorage();
  };

  const updateCoverPosition = (position) => {
    cover_position.value = Number(position);
    users.value.cover_position = Number(position);
    syncWithStorage();
  };

  const updateCoverUrl = (newUrl) => {
    coverUrl.value = newUrl.startsWith('http')
      ? newUrl
      : `${backendUrl}${newUrl}`;
    const coverFileName = newUrl.split('/').pop();
    users.value.cover = coverFileName;
    syncWithStorage();
  };

  const updateUser = (newUserData) => {
    users.value = { ...users.value, ...newUserData };
    syncWithStorage();
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
    updateUser,
  };
});
