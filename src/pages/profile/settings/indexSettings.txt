<template>
  <div class="settings-page">
    <div class="header">
      <h2>Cài đặt hiển thị thông tin cá nhân</h2>
    </div>
    <n-form>
      <div class="toggle-all-wrapper">
        <n-button @click="openBlockedModal" class="block-list-btn">Danh Sách Chặn</n-button>
        <n-button @click="toggleAll" :class="['toggle-all-btn', isAllEnabled ? 'off' : 'on']">
          {{ isAllEnabled ? 'Tắt Hết' : 'Bật Hết' }}
        </n-button>
      </div>
      <BlockedListModal ref="blockedModalRef" />
      
      <div v-for="(value, key) in visibility" :key="key" class="form-item">
        <label class="form-label">{{ labels[key] }}</label>
        <n-switch v-model:value="visibility[key]" />
      </div>

      <div class="button-wrapper">
        <n-button type="primary" @click="saveSettings" class="save-btn">Lưu thay đổi</n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup>
import { useMenuProfile } from '../../../stores/use-menu-profile';
useMenuProfile().onSelectedKey(['profile-settings']);
import { ref, onMounted, computed } from 'vue';
import { useMessage } from 'naive-ui';
import api from '../../../services/axiosInterceptor';
import { useAuthStore } from '../../../stores/auth';
import { useProfileStore } from '../../../stores/profile';
import BlockedListModal from '../../../components/BlockedListModal.vue';

  // modal
  const blockedModalRef = ref(null);

  const openBlockedModal = () => {
    blockedModalRef.value.openModal();
  };


const auth = useAuthStore();
const profile = useProfileStore();
const id = auth.user?.id;
const message = useMessage();

const isAllEnabled = computed(() => {
  return Object.values(visibility.value).every(v => v === true);
});

const toggleAll = () => {
  const newState = !isAllEnabled.value;
  for (const key in visibility.value) {
    visibility.value[key] = newState;
  }
};



const visibility = ref({
  email: true,
  phone_number: true,
  occupation: true,
  biography: true,
  hobbies: true,
  birthday: true,
  gender: true,
  address: true
});

const labels = {
  email: 'Email',
  phone_number: 'Số điện thoại',
  occupation: 'Nghề nghiệp',
  biography: 'Tiểu sử (Bio)',
  hobbies: 'Sở thích',
  birthday: 'Ngày sinh',
  gender: 'Giới tính',
  address: 'Địa chỉ'
};

onMounted(async () => {
  const res = await api.get('/private/settings');
  visibility.value = res.data;
});

const saveSettings = async () => {
  try {
    await api.post('/private/settings', visibility.value);
    message.success('Đã lưu cài đặt!');
    sessionStorage.removeItem('user_profile');
    profile.getProfile(id);
  } catch (error) {
    message.error('Lỗi khi lưu cài đặt.');
  }
};
</script>

<style scoped>
.settings-page {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f4f6f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #dee1e5;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: black;
  font-weight: 600;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 10px;
}

.form-label {
  flex: 1;
  text-align: left;
  font-weight: 500;
  padding-left: 10px;
}

.n-switch {
  flex-shrink: 0;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.save-btn {
  padding: 12px 24px;
  background-color: #0c713d;
  color: white;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: teal;
}

.toggle-all-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 10px;
}

.block-list-btn {
  font-weight: 600;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 16px;
  background-color: #d9534f;
  color: white;
  border: 2px solid #d43f3a;
  transition: background-color 0.3s, color 0.3s;
}

.block-list-btn:hover {
  background-color: #c9302c;
}

.toggle-all-btn {
  font-weight: 600;
  border-radius: 6px;
  padding: 8px 16px;
  transition: background-color 0.3s, color 0.3s;
  font-size: 16px;
  border: 2px solid black;
}

.toggle-all-btn.on {
  background-color: black;   
  color: white;      
}

.toggle-all-btn.off {
  background-color: white; 
  color: black;   
}

.toggle-all-btn:hover.on {
  background-color: #333;  
}

.toggle-all-btn:hover.off {
  background-color: #f0f0f0;
}
</style>
