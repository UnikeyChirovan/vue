import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';
import { ref } from 'vue';

export const useGuestStore = defineStore('guest', () => {
  const avatarUrl = ref('');
  const coverUrl = ref('');
  const cover_position = ref(0);
  const users = ref({});
  const backendUrl = "http://127.0.0.1:8000";

  const syncWithStorage = () => {
    sessionStorage.setItem('user_guest', JSON.stringify(users.value));
  };

  const getGuest = async (id) => {
    sessionStorage.removeItem('user_guest');
    const storedGuest = sessionStorage.getItem('user_guest');
    if (storedGuest) {
      users.value = JSON.parse(storedGuest);
      
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
        const response = await api.get(`/guest/${id}`);
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
        
        sessionStorage.setItem('user_guest', JSON.stringify(users.value));
      } catch (error) {
        console.error(error);
      }
    }
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
    getGuest,
    updateUser,
  };
});
