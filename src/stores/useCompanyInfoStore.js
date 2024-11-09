// stores/useCompanyInfoStore.js
import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';

export const useCompanyInfoStore = defineStore('companyInfoStore', () => {
  const companyInfo = ref(
    JSON.parse(localStorage.getItem('companyInfos'))?.[0] || {
      webname: 'Tiêu đề mặc định',
      address: 'Địa chỉ mặc định',
      phone: 'Số điện thoại mặc định',
      email: 'Email mặc định',
      facebook: '#',
      twitter: '#',
      linkedin: '#',
    }
  );

  // Tự động cập nhật từ `localStorage`
  watchEffect(() => {
    const storedCompanyInfos = JSON.parse(localStorage.getItem('companyInfos'));
    if (storedCompanyInfos) {
      companyInfo.value = storedCompanyInfos[0];
    }
  });

  return {
    companyInfo,
  };
});
