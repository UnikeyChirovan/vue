<template>
  <div class="container">
    <div class="row">
      <div class="col-12 header">
        <n-upload
          ref="uploadCoverRef"
          :action="uploadCoverUrl"
          :headers="uploadHeaders"
          show-upload-list="false"
          accept="image/*"
          :before-upload="beforeUpload"
        >
          <div class="cover" @click="handleCoverClick">
            <img v-if="coverUrl" :src="coverUrl" alt="cover" class="img-cover" :style="coverStyle"/>
            <div v-else class="upload-prompt">Nhấn để tải ảnh bìa lên</div>
          </div>
        </n-upload>
      </div>
    </div>
    <div class="row dem"></div>
    <div class="row">
      <div class="col-12 col-sm-3 sidebar m-0 p-0">
        <div style="height: 100px;"></div>
        <h1>{{ users.name }}</h1>
        <h2>{{ users.occupation }}</h2>
        <n-rate color="#4fb233" readonly :default-value="5" />
        <div class="info">
          <p v-if="users.gender">
            <i class="fa-solid fa-mars-and-venus me-1"></i> {{ users.gender }}
          </p>
          <p v-if="users.phone_number">
            <i class="fa-solid fa-square-phone me-1"></i> {{ users.phone_number }}
          </p>
          <p v-if="users.email">
            <i class="fa-solid fa-envelope me-1"></i> {{ users.email }}
          </p>
          <p v-if="users.address">
            <i class="fa-solid fa-location-dot me-1"></i> {{ users.address }}
          </p>
          <p v-if="formattedBirthday">
            <i class="fa-solid fa-cake-candles me-1"></i> {{ formattedBirthday }}
          </p>
        </div>
      </div>
      <div class="col-12 col-sm-9 content m-0 p-0">
        Content</div>
    </div>
    <n-upload
      ref="uploadRef"
      :action="uploadAvatarUrl"
      :headers="uploadHeaders"
      show-upload-list="false"
      accept="image/*"
      :before-upload="beforeUpload"
    >
      <div class="avatar" @click="handleAvatarClick">
        <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" class="img-cover" :style="avatarStyle" />
        <div v-else class="upload-prompt">Nhấn để tải avatar lên</div>
      </div>
    </n-upload>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useMessage } from 'naive-ui';
import api from '../../../services/axiosInterceptor.js';
import { useAuthStore } from "../../../stores/auth.js";
import { useMenuProfile } from "../../../stores/use-menu-profile.js";
import { useProfileStore } from "../../../stores/profile.js";
import dayjs from 'dayjs';


const backendUrl = "http://127.0.0.1:8000"
const profileStore = useProfileStore();
const authStore = useAuthStore();
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${authStore.accessToken}`,
}));
const uploadCoverUrl = `${api.defaults.baseURL}/link/upload/cover`;
const uploadAvatarUrl = `${api.defaults.baseURL}/link/upload/avatar`;
const id = authStore.user?.id;
const users = ref({});
const avatarUrl = ref(null); 
const coverUrl = ref(null);  
const uploadRef = ref(null);
const uploadCoverRef = ref(null);
const message = useMessage();

const formattedBirthday = computed(() => {
  if (users.value.birthday) {
    return dayjs(users.value.birthday).format('DD-MM');
  }
  return '';
});

const avatarStyle = ref({
  transform: 'translateY(0px)',
});
const coverStyle = ref({
  transform: 'translateY(0px)',
});
const getProfile = async () => {
  try {
    await profileStore.fetchProfile(id);
    users.value = profileStore.users;

    if (users.value.avatar) {
      avatarUrl.value = `${backendUrl}/storage/avatars/${id}/${users.value.avatar}`;
    }
    if (users.value.cover) {
      coverUrl.value = `${backendUrl}/storage/covers/${id}/${users.value.cover}`;
    }

    // Cập nhật styles dựa trên vị trí và phóng to
    avatarStyle.value.transform = `translateY(${users.value.avatar_position * 2.5}px)`;
    coverStyle.value.transform = `translateY(${users.value.cover_position * 2.5}px)`;
  } catch (error) {
    console.error(error);
    if(error.response && error.response.status === 429){
      message.warning(error.response.data.message)
    }
  }
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("Vui lòng chọn một tệp hình ảnh!");
  }
  return isImage;
};

const handleAvatarClick = () => {
  if (uploadRef.value && typeof uploadRef.value.handleClick === 'function') {
    uploadRef.value.handleClick(); 
  }
};

const handleCoverClick = () => {
  if (uploadCoverRef.value && typeof uploadCoverRef.value.handleClick === 'function') {
    uploadCoverRef.value.handleClick(); 
  }
};

onMounted(() => {
  useMenuProfile().onSelectedKey(['profile-info']);
  getProfile();
});
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  margin: 0;
  position: relative;
  box-sizing: border-box;
  text-align: center;

  .row {
    margin: 0;
    padding: 0;

    .header {
      height: 30vh;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .sidebar {
      // background-color: rgb(215, 203, 66);
      height: 50vh;
      box-sizing: border-box;

      .info {
        padding: 0px;
        margin: 0px;
        text-align: left;
        margin-left: 15px;
      }
    }

    .content {
      background-color: lightgreen;
      box-sizing: border-box;
    }

    .footer {
      background-color: lightcoral;
      box-sizing: border-box;
    }
  }
}

.cover {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightgray;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center; /* Căn giữa hình ảnh */
}


.upload-prompt {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 20px solid green;
  position: absolute;
  top: calc(30vh - 100px);
  left: calc((100% / 12) * 1.5 - 100px); 
  z-index: 10;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease; /* Thêm transition */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.img-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dem{
  height: 2vh;
  box-sizing: border-box;
  background-color: green;
}
</style>

