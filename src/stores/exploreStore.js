import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/axiosInterceptor';

export const useExploreStore = defineStore('exploreStore', () => {
  const userList = ref([]);
  const remainingAttempts = ref(3); // Số lượt còn lại
  const lastRefreshTime = ref(null); // Thời gian cập nhật danh sách cuối cùng

  // Hàm gọi API để lấy danh sách người dùng
  const fetchRandomUsers = async () => {
    if (remainingAttempts.value === 0) return; // Nếu hết lượt thì không làm gì
    if (userList.value.length > 0) return; // Nếu đã có danh sách rồi thì không gọi API nữa

    try {
      const response = await api.get('/users/explore');
      userList.value = response.data.users;
      remainingAttempts.value = response.data.remainingAttempts;
      lastRefreshTime.value = Date.now(); // Cập nhật thời gian gọi API

    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      userList.value = []; // Xóa danh sách nếu có lỗi
      remainingAttempts.value = 0; // Đặt số lượt còn lại về 0 nếu lỗi
    }
  };

  // Hàm để "Đổi danh sách" (giảm lượt và gọi lại API)
  const refreshUserList = async () => {
    if (remainingAttempts.value === 0) return; // Nếu hết lượt thì không làm gì

    try {
      const response = await api.get('/users/explore');
      userList.value = response.data.users;
      remainingAttempts.value = response.data.remainingAttempts;
    } catch (error) {
      console.error('Lỗi khi đổi danh sách người dùng:', error);
    }
  };

  return {
    userList,
    remainingAttempts,
    fetchRandomUsers,
    refreshUserList,
  };
});
