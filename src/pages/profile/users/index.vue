<template>
  <div class="profile-page">
    <div class="cover-section">
      <div class="cover-container" v-show="!showChange&&!showEdit">
        <img 
          :src="coverUrl ? coverUrl : 'https://via.placeholder.com/1200x300'" 
          alt="Cover Image" 
          class="cover-img"
          :style="coverStyle"
        />
      </div>

      <div class="cover-change" v-if="showChange">
        <n-upload
          :headers="uploadHeaders"
          :max-file="1"
          accept="image/*"
          @change="handleUpload"
          class="upload-container"
          :show-file-list="false"
        >
          <n-button type="primary" class="select-image-btn">Chọn hình</n-button>
        </n-upload>

        <div
          class="custom-cover"
          :style="{ cursor: 'grab'}"
          @mousedown="startDrag($event, 'cover')"
          v-if="newCoverUrl"
        >
          <img
            :src="newCoverUrl" class="img-cover-custom"
            alt="Cover"
            :style="coverStyle"
          />
        </div>

        <n-space class="slider-container">
          <n-slider v-model:value="coverPosition" :min="-1000" :max="0" vertical ><template #thumb>
            <n-icon-wrapper :size="24" :border-radius="12">
              <n-icon :size="18" :component="AnimalCat24Regular" />
            </n-icon-wrapper>
          </template></n-slider>
        </n-space>
        <n-button @click="cancelChange" class="cancel-button" type="error">Hủy</n-button>
        <n-button @click="saveNewCover" class="save-button" type="info">Lưu</n-button>
      </div>
      <div class="cover-edit" v-if="showEdit">
        <div class="custom-cover" :style="{ cursor: 'grab'}" @mousedown="startDrag($event, 'cover')" v-if="coverUrl">
          <img :src="coverUrl" class="img-cover-custom" alt="Cover" :style="coverStyle" />
        </div>
        <n-space class="slider-container">
          <n-slider v-model:value="coverPosition" :min="-1000" :max="0" vertical />
        </n-space>
        <n-button @click="cancelEdit" class="cancel-button" type="error">Hủy</n-button>
        <n-button @click="saveEditedCover" class="save-button" type="info">Lưu</n-button>
      </div>


      <div class="edit-cover-btn" v-if="authStore.user?.id === users.id">
        <n-dropdown :options="options" @select="handleSelect">
          <n-button strong secondary round type="primary">
            <i class="fa-solid fa-gear"></i>
          </n-button>
        </n-dropdown>
      </div>
    </div>
    <div class="avatar-section">
      <n-image
        class="avatar-img"
        alt="User Profile"
        :src="avatarUrl || 'https://via.placeholder.com/150'"
      />
      <button
        v-if="authStore.user?.id === users.id"
        @click="handleCameraClick"
        class="camera-btn"
      >
        <i class="fa-solid fa-camera"></i>
      </button>
    </div>
    <n-modal v-model:show="showViewModal" title="Xem hình cover">
      <n-image :src="coverUrl" class="full-cover-img" />
    </n-modal>  
    <h1 class="username">{{ users.name }}</h1>
    <div class="rate-container">
      <n-rate color="#4fb233" readonly :default-value="5" />
    </div>
    <div class="profile-pages">
      <div class="explore-buttons">
        <n-button class="custom-button explore" @click="openExploreModal">Khám Phá</n-button>
        <n-button class="custom-button follow-list" @click="openFollowingModal">Danh Sách</n-button>
      </div>
      <ExploreModal ref="exploreModalRef" />
      <FollowingListModal ref="followingModalRef" />
    </div> 
    <div class="profile">
      <div class="info-card card">
        <h2 class="section-title">Thông Tin Cá Nhân</h2>
        <p v-if="users.occupation"><strong>Nghề nghiệp:</strong> {{ users.occupation }}</p>
        <p v-if="users.gender"><strong>Giới tính:</strong> {{ users.gender }}</p>
        <p v-if="users.birthday"><strong>Ngày sinh:</strong> {{ formattedBirthday }}</p>
        <p v-if="users.address"><strong>Địa chỉ:</strong> {{ users.address }}</p>
        <p v-if="users.hobbies"><strong>Sở thích:</strong> {{ users.hobbies }}</p>
        <p v-if="users.biography"><strong>Tiểu sử:</strong> {{ users.biography }}</p>
        <p v-if="users.phone_number"><strong>Điện Thoại:</strong> {{ users.phone_number }}</p>
        <p v-if="users.email"><strong>Email:</strong> {{ users.email }}</p>
      </div>
      <div class="stats card" v-if="followStats">
        <h2 class="section-title">Thống kê tài khoản</h2>
        <div class="stats-content">
          <div class="stat">
            <h3>150</h3>
            <p>Bài đăng</p>
          </div>
          <div class="stat">
            <h3>{{ followStats.followers_count }}</h3>
            <p>Người theo dõi</p>
          </div>
          <div class="stat">
            <h3>{{ followStats.following_count }}</h3>
            <p>Đang theo dõi</p>
          </div>
        </div>
      </div>

      <div class="history card">
        <h2 class="section-title">Lịch sử gần đây</h2>
      <div class="last-chapter-section">
        <p>Chương đọc gần nhất: <span>{{ lastChapter - 1 }}</span></p>
      </div>
      <div class="last-episode-section">
        <p>Tập coi gần nhất: <span>{{ lastEpisode - 1 }}</span></p>
      </div>
      </div>
      <div class="social-links card">
        <h2 class="section-title">Kết nối mạng xã hội</h2>
        <div class="icons">
          <i class="fab fa-facebook-f"></i>
          <i class="fab fa-twitter"></i>
          <i class="fab fa-linkedin-in"></i>
          <i class="fab fa-youtube"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
  import { useMessage } from 'naive-ui';
  import { useAuthStore } from "../../../stores/auth.js";
  import { useMenuProfile } from "../../../stores/use-menu-profile.js";
  import { useProfileStore } from '../../../stores/profile.js';
  import { useGeneralStore } from '../../../stores/general';
  import api from '../../../services/axiosInterceptor.js';
  import dayjs from 'dayjs';
  import AnimalCat24Regular from '@vicons/fluent/AnimalCat24Regular'
  import ExploreModal from '../../../components/ExploreModal.vue';
  import FollowingListModal from '../../../components/FollowingListModal.vue';
  import { useRoute } from 'vue-router';
  const route = useRoute();

  // modal
  const exploreModalRef = ref(null);

  const openExploreModal = () => {
    exploreModalRef.value.openModal();
  };

  const followingModalRef = ref(null);

  const openFollowingModal = () => {
    followingModalRef.value.openModal();
  };

  // 

  const authStore = useAuthStore();
  const useGeneral = useGeneralStore()
  const useProfile = useProfileStore();
  const { cover_position } = storeToRefs(useProfile);
  const { isCropperModal, avatarUpdated } = storeToRefs(useGeneral);

  const id = authStore.user?.id;
  const { users, avatarUrl, coverUrl } = storeToRefs(useProfile);
  const message = useMessage();

  const handleCameraClick = () => {
    isCropperModal.value = true;
  };

  const formattedBirthday = computed(() => {
    if (users.value.birthday) {
      return dayjs(users.value.birthday).format('DD-MM');
    }
    return '';
  });

const fetchProfile = async () => {
  await useProfile.getProfile(id); 
};

  watch(
  () => avatarUpdated.value,
  (newValue) => {
    if (newValue) {
      // console.log('Avatar updated, updating avatarUrl in profile store...');
      useProfile.updateAvatarUrl(`${useProfile.avatarUrl}`);
      useGeneral.setAvatarUpdated(false); 
    }
  }
);

  //
  import { h } from "vue";
import { NIcon } from "naive-ui";
import {
  Pencil, Eye, CloudUpload
} from "@vicons/ionicons5";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const options = [
  {
    label: "Coi Hình",
    key: "viewcover",
    icon: renderIcon(Eye),
  },
  {
    label: "Thay Hình",
    key: "changecover",
    icon: renderIcon(CloudUpload),
  },
  {
    label: "Sửa Hình",
    key: "settingcover",
    icon: renderIcon(Pencil),
  }
];


const uploadHeaders = {
  Authorization: `Bearer ${authStore.accessToken}`,
};

const dragging = ref(false); 
let startY = 0;
let originalCoverPosition = 0;

const coverStyle = computed(() => ({
  transform: `translateY(${cover_position.value}px)`,
}));

const coverPosition = computed({
  get() {
    return cover_position.value;
  },
  set(value) {
    cover_position.value = value;
    coverStyle.value.transform = `translateY(${cover_position.value}px)`;
  },
});
const onKeyDown = (event) => {
  if (event.key === 'Escape' && dragging.value) {
    cancelDrag();
  }
};

const startDrag = (event) => {
  dragging.value = true;
  startY = event.clientY;
  // originalCoverPosition = useProfile.users.cover_position;
  originalCoverPosition = cover_position.value;
  // console.log('Drag started. Original cover position:', originalCoverPosition);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('keydown', onKeyDown);
};

const onDrag = (event) => {
  if (!dragging.value) return;
  const currentY = event.clientY;
  const deltaY = currentY - startY;
  startY = currentY;

  cover_position.value += deltaY;
  coverStyle.value.transform = `translateY(${cover_position.value}px)`;
      // console.log('Dragging... Current cover position:', useProfile.users.cover_position);
    // console.log('Cover style transform:', cover_position.value);
};

const stopDrag = () => {
  dragging.value = false;
      // console.log('Drag stopped. Final cover position:', useProfile.users.cover_position);

  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('keydown', onKeyDown);
};

const cancelDrag = () => {
  users.cover_position = originalCoverPosition;
  coverStyle.value.transform = `translateY(${users.cover_position}px)`;
      // console.log('Drag cancelled. Restoring cover position:', originalCoverPosition);

  stopDrag();
  message.info('Thao tác kéo đã bị hủy và vị trí đã được khôi phục.');
};
const newCoverFile = ref(null); 

const handleUpload = ({ file }) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    newCoverUrl.value = event.target.result;
            // console.log('New cover URL set:', newCoverUrl.value);
  };
  newCoverFile.value = file.file; 
  reader.readAsDataURL(file.file);
};

const saveNewCover = () => {
  if (!newCoverFile.value) {
    message.error('Vui lòng chọn một tệp hình ảnh!');
    return;
  }

  const formData = new FormData();
  formData.append('file', newCoverFile.value); 
  formData.append('position', cover_position.value); 

  api.post(`link/upload/cover`, formData, {
    headers: {
      ...uploadHeaders,
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => {
    // console.log('res', response)
    if (response.status === 200) {
      useProfile.updateCoverPosition(response.data.positionY);
      useProfile.updateCoverUrl(response.data.url);
      showChange.value = false;
      message.success('Cover đã được lưu thành công!');
    }
  }).catch(error => {
    // console.error('Error saving new cover:', error);
    message.error('Lưu hình cover thất bại!');
  });
};
const cancelChange = () => {
  showChange.value = false;
  newCoverUrl.value = null; 
  message.info('Đã hủy thao tác thay đổi hình cover.');
};

const cancelEdit = () => {
  showEdit.value = false;
  cover_position.value = originalCoverPosition; 
  message.info('Đã hủy thao tác chỉnh sửa hình cover.');
};


const showViewModal = ref(false);
const showChange = ref(false);
const showEdit = ref(false);
const newCoverUrl = ref(null);

const handleSelect = (key) => {
  switch (key) {
    case 'viewcover':
      showViewModal.value = true;
      break;
    case 'changecover':
      showChange.value = true;
      showEdit.value = false;
      break;
    case 'settingcover':
      showEdit.value = true;
      showChange.value = false; 
      break;
    default:
      break;
  }
};



const saveEditedCover = () => {
  const payload = {
    position: cover_position.value, 
  };
  api.patch(`link/update/cover-position`, payload, {
    headers: uploadHeaders,
  })
  .then(response => {
    console.log(response)
    if (response.status === 200) {
      useProfile.updateCoverPosition(response.data.positionY);
      showEdit.value = false; 
      message.success('Vị trí cover đã được lưu thành công!');
    }
  })
  .catch(error => {
    console.error('Error saving cover position:', error);
    message.error('Lưu vị trí cover thất bại!');
  });
};

const lastChapter = ref("");

const getLastChapter = () => {
  api.get(`/story/user-chapter`)
    .then(response => {
      console.log('Fetch successful');
      lastChapter.value = response.data.chapter_id;
    })
    .catch(error => {
      console.error('Error fetching the chapter:', error);
    });
};
const lastEpisode = ref("");

const getlastEpisode = () => {
  api.get(`/videos/user-episode`)
    .then(response => {
      console.log('Fetch successful');
      lastEpisode.value = response.data.episode_id;
    })
    .catch(error => {
      console.error('Error fetching the episode:', error);
    });
};


const followStats = ref(null);
const userId = route.params.id;
const getFollowStats = async (userId) => {
  try {
    const response = await api.get(`/social/follow-stats/${userId}`);
    followStats.value = response.data;
    // console.log('Thống kê follow:', response.data);
  } catch (error) {
    console.error('Lỗi khi lấy thống kê follow:', error);
  }
};

  onMounted(() => {
    useMenuProfile().onSelectedKey(['profile-info']);
    fetchProfile();
    getFollowStats(userId)
    getLastChapter();
    getlastEpisode();
  });

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('keydown', onKeyDown);
});


</script>

<style lang="scss" scoped>
.profile-page {
  font-family: "Arial", sans-serif;
  color: #333;
  background-color: #f7f7f7;

  /* Cover Section */
  .cover-section {
    position: relative;
    height: 300px;
    background-color: #282c34;

    .cover-container,
    .cover-change,
    .cover-edit {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;

      .cover-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        object-fit: cover;
      }
    }

    .edit-cover-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
  }
  .avatar-section {
    position: relative;
    margin-top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 9;

    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
    }

    .camera-btn {
      position: absolute;
      right: 0;
      top: 150px;
      background-color: #e2e8f0;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #cbd5e1;
      }
    }
  }

.profile-pages {
  max-width: 800px;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cover-section {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.avatar-name-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: -60px;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border: 4px solid white;
  border-radius: 50%;
  object-fit: cover;
  background: white;
}

.username {
  font-size: 24px;
  font-weight: 600;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-top: 20px;
}

.info-card p {
  margin: 5px 0;
}

.section-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #0c713d; 
  text-transform: uppercase; 
  margin-bottom: 20px; 
}

.stats {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-top: 20px;
}


.stats-content {
  display: flex;
  justify-content: space-around; 
  gap: 20px; 
}

.stat {
  text-align: center;
  width: 100%;
}

.stat h3 {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}

.stat p {
  margin-top: 5px;
  color: #777;
}


.history p {
  margin: 5px 0;
}

.social-links .icons {
  display: flex;
  justify-content: space-around;
  font-size: 20px;
}

}

.username {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-top: 10px;
}
.rate-container {
display: flex;
justify-content: center;
margin-top: 5px;
margin-bottom: 10px;
}

  
.custom-cover {
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  &.grabbing {
    cursor: grabbing;
  }

  .img-cover-custom {
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.2s ease;
  }
}


.upload-container {
  position: absolute;
  top: 10px;
  right: -10px;
}

.select-image-btn,
.save-button {
  z-index: 10;
}

.save-button {
  position: absolute;
  bottom: 3.5rem;
  right: 3rem;
  width: 15%;
  max-width: 20%;
}

.cancel-button {
  position: absolute;
  bottom: 1rem;
  right: 3rem;
  width: 15%;
  max-width: 20%;
}


.slider-container {
  position: absolute;
  right: 20px;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
}
.last-chapter-section,
    .last-episode-section {
      margin: 10px auto;
      padding: 5px 10px;
      background-color: #fdfdfd;
      border-radius: 10px;
      border-left: 5px solid #4fb233;
      border-right: 5px solid #4fb233;
      text-align: left;
      max-width: 500px;

        span {
          font-weight: bold;
          color: #fb411c;
        }
    }

.profile {
  max-width: 700px; 
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.explore-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.custom-button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.custom-button.explore {
  background-color: #0c713d; 
  color: white;
}

.custom-button.follow-list {
  background-color: #007BFF;
  color: white;
}

.custom-button:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}

.custom-button:active {
  transform: translateY(0);
  box-shadow: none;
}

</style>

