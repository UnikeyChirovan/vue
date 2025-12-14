<template>
  <div class="profile-page">
    <!-- Cover Section - Từ code cũ -->
    <div class="cover-section">
      <div class="cover-container" v-show="!showChange && !showEdit">
        <img
          :src="coverUrl ? coverUrl : 'https://picsum.photos/1200x300'"
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
          :style="{ cursor: 'grab' }"
          @mousedown="startDrag($event, 'cover')"
          v-if="newCoverUrl"
        >
          <img
            :src="newCoverUrl"
            class="img-cover-custom"
            alt="Cover"
            :style="coverStyle"
          />
        </div>

        <n-space class="slider-container">
          <n-slider
            v-model:value="coverPosition"
            :min="-1000"
            :max="0"
            vertical
          >
            <template #thumb>
              <n-icon-wrapper :size="24" :border-radius="12">
                <n-icon :size="18" :component="AnimalCat24Regular" />
              </n-icon-wrapper>
            </template>
          </n-slider>
        </n-space>
        <n-button @click="cancelChange" class="cancel-button" type="error"
          >Hủy</n-button
        >
        <n-button @click="saveNewCover" class="save-button" type="info"
          >Lưu</n-button
        >
      </div>

      <div class="cover-edit" v-if="showEdit">
        <div
          class="custom-cover"
          :style="{ cursor: 'grab' }"
          @mousedown="startDrag($event, 'cover')"
          v-if="coverUrl"
        >
          <img
            :src="coverUrl"
            class="img-cover-custom"
            alt="Cover"
            :style="coverStyle"
          />
        </div>
        <n-space class="slider-container">
          <n-slider
            v-model:value="coverPosition"
            :min="-1000"
            :max="0"
            vertical
          />
        </n-space>
        <n-button @click="cancelEdit" class="cancel-button" type="error"
          >Hủy</n-button
        >
        <n-button @click="saveEditedCover" class="save-button" type="info"
          >Lưu</n-button
        >
      </div>

      <div class="edit-cover-btn" v-if="authStore.user?.id === users.id">
        <n-dropdown :options="options" @select="handleSelect">
          <n-button strong secondary round type="primary">
            <i class="fa-solid fa-gear"></i>
          </n-button>
        </n-dropdown>
      </div>
    </div>

    <!-- Avatar Section - Từ code cũ -->
    <div class="avatar-section">
      <n-image
        class="avatar-img"
        alt="User Profile"
        :src="avatarUrl || 'https://picsum.photos/150'"
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

    <!-- Profile Header - Từ code mới -->
    <div class="profile-header-content">
      <h1 class="username-title">{{ users.name }}</h1>
      <div class="rating-stars">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons-group">
        <button class="action-btn explore-btn" @click="openExploreModal">
          <i class="fas fa-compass"></i>
          <span>Khám Phá</span>
        </button>
        <button class="action-btn list-btn" @click="openFollowingModal">
          <i class="fas fa-list"></i>
          <span>Danh Sách</span>
        </button>
        <button class="action-btn inbox-btn" @click="openChatInbox">
          <i class="fas fa-envelope"></i>
          <span>Hộp Thư</span>
          <span v-if="chatStore.totalUnreadMessages > 0" class="badge-count">
            {{ chatStore.totalUnreadMessages }}
          </span>
        </button>
      </div>
    </div>

    <!-- Profile Content Cards - Từ code mới -->
    <div class="profile-content-wrapper">
      <!-- Personal Info Card -->
      <div class="profile-card">
        <div class="card-header-green">
          <i class="fas fa-user-circle"></i>
          <span>Thông Tin Cá Nhân</span>
        </div>
        <div class="card-body-white">
          <div class="info-row" v-if="users.occupation">
            <i class="fas fa-briefcase icon-label"></i>
            <div class="info-content">
              <strong>Nghề nghiệp:</strong>
              <span>{{ users.occupation }}</span>
            </div>
          </div>
          <div class="info-row" v-if="users.gender">
            <i class="fas fa-venus-mars icon-label"></i>
            <div class="info-content">
              <strong>Giới tính:</strong>
              <span>{{ users.gender }}</span>
            </div>
          </div>
          <div class="info-row" v-if="users.birthday">
            <i class="fas fa-birthday-cake icon-label"></i>
            <div class="info-content">
              <strong>Ngày sinh:</strong>
              <span>{{ formattedBirthday }}</span>
            </div>
          </div>
          <div class="info-row" v-if="users.address">
            <i class="fas fa-map-marker-alt icon-label"></i>
            <div class="info-content">
              <strong>Địa chỉ:</strong>
              <span>{{ users.address }}</span>
            </div>
          </div>
          <div class="info-row" v-if="users.hobbies">
            <i class="fas fa-heart icon-label"></i>
            <div class="info-content">
              <strong>Sở thích:</strong>
              <span>{{ users.hobbies }}</span>
            </div>
          </div>
          <div class="info-row" v-if="users.biography">
            <i class="fas fa-book icon-label"></i>
            <div class="info-content">
              <strong>Tiểu sử:</strong>
              <span>{{ users.biography }}</span>
            </div>
          </div>
          <div class="info-row" v-if="users.phone_number">
            <i class="fas fa-phone icon-label"></i>
            <div class="info-content">
              <strong>Điện Thoại:</strong>
              <span>{{ users.phone_number }}</span>
            </div>
          </div>
          <div class="info-row" v-if="users.email">
            <i class="fas fa-envelope icon-label"></i>
            <div class="info-content">
              <strong>Email:</strong>
              <span>{{ users.email }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Card -->
      <div class="profile-card" v-if="followStats">
        <div class="card-header-green">
          <i class="fas fa-chart-bar"></i>
          <span>Thống Kê Tài Khoản</span>
        </div>
        <div class="card-body-white">
          <div class="stats-grid-content">
            <div class="stat-circle-item">
              <div class="stat-circle purple-circle">
                <i class="fas fa-file-alt"></i>
              </div>
              <h3 class="stat-number">150</h3>
              <p class="stat-label">Bài đăng</p>
            </div>
            <div class="stat-circle-item">
              <div class="stat-circle pink-circle">
                <i class="fas fa-users"></i>
              </div>
              <h3 class="stat-number">{{ followStats.followers_count }}</h3>
              <p class="stat-label">Người theo dõi</p>
            </div>
            <div class="stat-circle-item">
              <div class="stat-circle blue-circle">
                <i class="fas fa-user-friends"></i>
              </div>
              <h3 class="stat-number">{{ followStats.following_count }}</h3>
              <p class="stat-label">Đang theo dõi</p>
            </div>
          </div>
        </div>
      </div>

      <!-- History Card -->
      <div class="profile-card">
        <div class="card-header-green">
          <i class="fas fa-history"></i>
          <span>Lịch Sử Gần Đây</span>
        </div>
        <div class="card-body-white">
          <div class="history-item-box">
            <i class="fas fa-play-circle history-icon"></i>
            <div class="history-text">
              <span>Chương đọc gần nhất:</span>
              <strong class="history-number">{{ lastChapter - 1 }}</strong>
            </div>
          </div>
          <div class="history-item-box">
            <i class="fas fa-play-circle history-icon"></i>
            <div class="history-text">
              <span>Tập coi gần nhất:</span>
              <strong class="history-number">{{ lastEpisode - 1 }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Links Card -->
      <div class="profile-card">
        <div class="card-header-green">
          <i class="fas fa-share-alt"></i>
          <span>Kết Nối Mạng Xã Hội</span>
        </div>
        <div class="card-body-white">
          <div class="social-icons-row">
            <a href="#" class="social-circle facebook-color">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-circle twitter-color">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-circle linkedin-color">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="social-circle youtube-color">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <ExploreModal ref="exploreModalRef" />
    <FollowingListModal ref="followingModalRef" />
    <ChatInboxModal ref="chatInboxModalRef" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import { useMessage } from 'naive-ui';
import { useAuthStore } from '../../../stores/auth.js';
import { useMenuProfile } from '../../../stores/use-menu-profile.js';
import { useProfileStore } from '../../../stores/profile.js';
import { useGeneralStore } from '../../../stores/general';
import { useChatStore } from '../../../stores/chatStore.js';
import api from '../../../services/axiosInterceptor.js';
import dayjs from 'dayjs';
import AnimalCat24Regular from '@vicons/fluent/AnimalCat24Regular';
import ExploreModal from '../../../components/ExploreModal.vue';
import FollowingListModal from '../../../components/FollowingListModal.vue';
import ChatInboxModal from '../../../components/ChatInboxModal.vue';
import { h } from 'vue';
import { NIcon } from 'naive-ui';
import { Pencil, Eye, CloudUpload } from '@vicons/ionicons5';

const chatInboxModalRef = ref(null);
const chatStore = useChatStore();
const exploreModalRef = ref(null);
const followingModalRef = ref(null);

const openChatInbox = () => chatInboxModalRef.value.openModal();
const openExploreModal = () => exploreModalRef.value.openModal();
const openFollowingModal = () => followingModalRef.value.openModal();

const authStore = useAuthStore();
const useGeneral = useGeneralStore();
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
      useProfile.updateAvatarUrl(`${useProfile.avatarUrl}`);
      useGeneral.setAvatarUpdated(false);
    }
  }
);

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const options = [
  { label: 'Coi Hình', key: 'viewcover', icon: renderIcon(Eye) },
  { label: 'Thay Hình', key: 'changecover', icon: renderIcon(CloudUpload) },
  { label: 'Sửa Hình', key: 'settingcover', icon: renderIcon(Pencil) },
];

const uploadHeaders = { Authorization: `Bearer ${authStore.accessToken}` };

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
  if (event.key === 'Escape' && dragging.value) cancelDrag();
};

const startDrag = (event) => {
  dragging.value = true;
  startY = event.clientY;
  originalCoverPosition = cover_position.value;
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
};

const stopDrag = () => {
  dragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('keydown', onKeyDown);
};

const cancelDrag = () => {
  users.cover_position = originalCoverPosition;
  coverStyle.value.transform = `translateY(${users.cover_position}px)`;
  stopDrag();
  message.info('Thao tác kéo đã bị hủy và vị trí đã được khôi phục.');
};

const newCoverFile = ref(null);
const newCoverUrl = ref(null);

const handleUpload = ({ file }) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    newCoverUrl.value = event.target.result;
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
  api
    .post(`link/upload/cover`, formData, {
      headers: { ...uploadHeaders, 'Content-Type': 'multipart/form-data' },
    })
    .then((response) => {
      if (response.status === 200) {
        useProfile.updateCoverPosition(response.data.positionY);
        useProfile.updateCoverUrl(response.data.url);
        showChange.value = false;
        message.success('Cover đã được lưu thành công!');
      }
    })
    .catch(() => message.error('Lưu hình cover thất bại!'));
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

const handleSelect = (key) => {
  if (key === 'viewcover') showViewModal.value = true;
  else if (key === 'changecover') {
    showChange.value = true;
    showEdit.value = false;
  } else if (key === 'settingcover') {
    showEdit.value = true;
    showChange.value = false;
  }
};

const saveEditedCover = () => {
  api
    .patch(
      `link/update/cover-position`,
      { position: cover_position.value },
      { headers: uploadHeaders }
    )
    .then((response) => {
      if (response.status === 200) {
        useProfile.updateCoverPosition(response.data.positionY);
        showEdit.value = false;
        message.success('Vị trí cover đã được lưu thành công!');
      }
    })
    .catch(() => message.error('Lưu vị trí cover thất bại!'));
};

const lastChapter = ref('');
const lastEpisode = ref('');
const followStats = ref(null);

const getLastChapter = () => {
  api
    .get(`/story/user-chapter`)
    .then((r) => (lastChapter.value = r.data.chapter_id))
    .catch(console.error);
};

const getlastEpisode = () => {
  api
    .get(`/videos/user-episode`)
    .then((r) => (lastEpisode.value = r.data.episode_id))
    .catch(console.error);
};

const getFollowStats = async (userId) => {
  try {
    const response = await api.get(`/social/follow-stats/${userId}`);
    followStats.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê follow:', error);
  }
};

onMounted(() => {
  useMenuProfile().onSelectedKey(['profile-info']);
  fetchProfile();
  getFollowStats(id);
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
/* ========== COVER & AVATAR - Từ code cũ ========== */
.profile-page {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #e8ecf1 0%, #f5f7fa 100%);
  min-height: 100vh;
  padding-bottom: 40px;

  .cover-section {
    position: relative;
    height: 300px;
    background-color: #282c34;
    overflow: hidden;

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
      width: 40px;
      height: 40px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;

      &:hover {
        background-color: #cbd5e1;
      }
      i {
        color: #333;
      }
    }
  }
}

.custom-cover {
  width: 100%;
  height: auto;
  position: relative;
  user-select: none;

  .img-cover-custom {
    width: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }
}

.upload-container {
  position: absolute;
  top: 10px;
  right: -10px;
}

.save-button {
  position: absolute;
  bottom: 3.5rem;
  right: 3rem;
  width: 15%;
  max-width: 20%;
  z-index: 10;
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

/* ========== PROFILE HEADER - Từ code mới ========== */
.profile-header-content {
  text-align: center;
  max-width: 900px;
  margin: 20px auto 40px;
  padding: 0 20px;
}

.username-title {
  font-size: 36px;
  font-weight: 800;
  color: #2d3748;
  margin: 0 0 12px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 25px;

  i {
    color: #16a34a;
    font-size: 22px;
  }
}

/* ========== ACTION BUTTONS ========== */
.action-buttons-group {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.list-btn {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }
}

.inbox-btn {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(8, 145, 178, 0.4);
  }
}

.badge-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 7px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* ========== PROFILE CARDS (FULL WIDTH) ========== */
.profile-content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 100%;
}

.card-header-green {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;

  i {
    font-size: 22px;
  }
}

.card-body-white {
  background: white;
  padding: 28px;
}

/* Info Rows */
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  .icon-label {
    font-size: 20px;
    color: #16a34a;
    width: 24px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .info-content {
    flex: 1;

    strong {
      display: inline;
      color: #1f2937;
      font-size: 15px;
      margin-right: 6px;
    }

    span {
      color: #6b7280;
      font-size: 15px;
    }
  }
}

/* Stats Grid */
.stats-grid-content {
  display: flex;
  justify-content: space-around;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-circle-item {
  text-align: center;
  flex: 1;
  min-width: 120px;
}

.stat-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.purple-circle {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.pink-circle {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.blue-circle {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 6px 0;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* History Items */
.history-item-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 14px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  border-left: 4px solid #16a34a;

  &:last-child {
    margin-bottom: 0;
  }

  .history-icon {
    font-size: 24px;
    color: #16a34a;
  }

  .history-text {
    flex: 1;

    span {
      color: #374151;
      font-size: 15px;
      margin-right: 8px;
    }

    .history-number {
      color: #dc2626;
      font-size: 18px;
      font-weight: 700;
    }
  }
}

/* Social Icons */
.social-icons-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.social-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }
}

.facebook-color {
  background: #3b5998;
}
.twitter-color {
  background: #1da1f2;
}
.linkedin-color {
  background: #0077b5;
}
.youtube-color {
  background: #ff0000;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large Tablet */
@media (max-width: 1024px) {
  .username-title {
    font-size: 28px;
  }

  .profile-content-wrapper {
    max-width: 800px;
    padding: 0 16px;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .profile-header-content {
    padding: 0 16px;
  }

  .username-title {
    font-size: 24px;
  }

  .rating-stars {
    margin-bottom: 20px;

    i {
      font-size: 20px;
    }
  }

  .action-buttons-group {
    flex-direction: column;
    max-width: 320px;
    margin: 0 auto;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
    padding: 14px 24px;
  }

  .profile-content-wrapper {
    padding: 0 16px;
    gap: 20px;
  }

  .card-header-green {
    padding: 16px 20px;
    font-size: 16px;

    i {
      font-size: 20px;
    }
  }

  .card-body-white {
    padding: 22px;
  }

  .stats-grid-content {
    flex-direction: column;
    gap: 20px;
  }

  .stat-circle-item {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 16px;
    background: #f9fafb;
    border-radius: 12px;
    gap: 20px;
  }

  .stat-circle {
    margin: 0;
    width: 70px;
    height: 70px;
    font-size: 24px;
  }

  .social-icons-row {
    gap: 16px;
  }

  .social-circle {
    width: 55px;
    height: 55px;
    font-size: 22px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .profile-page {
    padding-bottom: 30px;
  }

  .profile-header-content {
    margin: 16px auto 32px;
    padding: 0 12px;
  }

  .username-title {
    font-size: 22px;
  }

  .rating-stars {
    margin-bottom: 18px;

    i {
      font-size: 18px;
    }
  }

  .action-btn {
    padding: 12px 20px;
    font-size: 14px;
    gap: 6px;
  }

  .badge-count {
    top: -6px;
    right: -6px;
    font-size: 10px;
    padding: 2px 6px;
  }

  .profile-content-wrapper {
    padding: 0 12px;
    gap: 18px;
  }

  .card-header-green {
    padding: 14px 18px;
    font-size: 15px;

    i {
      font-size: 18px;
    }
  }

  .card-body-white {
    padding: 20px;
  }

  .info-row {
    padding: 12px 0;
    gap: 12px;

    .icon-label {
      font-size: 18px;
      width: 20px;
    }

    .info-content {
      strong {
        font-size: 14px;
      }
      span {
        font-size: 14px;
      }
    }
  }

  .stat-circle-item {
    padding: 14px;
  }

  .stat-circle {
    width: 60px;
    height: 60px;
    font-size: 20px;
  }

  .stat-number {
    font-size: 24px;
  }

  .stat-label {
    font-size: 13px;
  }

  .history-item-box {
    padding: 14px;
    gap: 12px;

    .history-icon {
      font-size: 20px;
    }

    .history-text {
      span {
        font-size: 14px;
      }
      .history-number {
        font-size: 16px;
      }
    }
  }

  .social-circle {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .username-title {
    font-size: 20px;
  }

  .action-btn {
    padding: 10px 16px;
    font-size: 13px;
  }

  .card-header-green {
    padding: 12px 16px;
    font-size: 14px;
  }

  .card-body-white {
    padding: 18px;
  }
}
</style>
