<template>
  <div class="profile-page">
    <!-- Cover Section -->
    <div class="cover-section">
      <div class="cover-container">
        <img
          :src="coverUrl ? coverUrl : 'https://picsum.photos/1200/300'"
          alt="Cover Image"
          class="cover-img"
          :style="coverStyle"
        />
      </div>
    </div>

    <!-- Avatar Section -->
    <div class="avatar-section">
      <n-image
        class="avatar-img"
        alt="User Profile"
        :src="avatarUrl || 'https://picsum.photos/150'"
      />
      <span v-if="userOnlineStatus" class="profile-online-dot"></span>
    </div>

    <!-- Profile Header -->
    <div class="profile-header-content">
      <h1 class="username-title">{{ users.name }}</h1>
      <div class="rating-stars">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </div>

      <!-- Guest Action Buttons -->
      <div class="action-buttons-group" v-if="!isOwnProfile">
        <button
          @click="followUser"
          :class="['action-btn', isFollowing ? 'unfollow-btn' : 'follow-btn']"
        >
          <i
            :class="isFollowing ? 'fas fa-user-check' : 'fas fa-user-plus'"
          ></i>
          <span>{{ isFollowing ? 'Bỏ theo dõi' : 'Theo dõi' }}</span>
        </button>

        <button
          v-if="Number(id) !== 1"
          class="action-btn block-btn"
          @click="blockUser"
        >
          <i class="fas fa-ban"></i>
          <span>Chặn</span>
        </button>

        <button
          v-if="showChatButton"
          class="action-btn chat-btn"
          @click="openChatWithUser"
          :disabled="chatLoading"
        >
          <i class="fa-solid fa-comment"></i>
          <span>{{ chatLoading ? 'Đang mở...' : 'Nhắn Tin' }}</span>
        </button>
      </div>
    </div>

    <!-- Profile Content Cards -->
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
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGuestStore } from '../../../stores/guest.js';
import { useAuthStore } from '../../../stores/auth.js';
import { useChatStore } from '../../../stores/chatStore.js';
import api from '../../../services/axiosInterceptor.js';
import apiLinks from '../../../services/api-links.js';
import dayjs from 'dayjs';
import { useMessage } from 'naive-ui';

const message = useMessage();
const isFollowing = ref(false);
const auth = useAuthStore();
const chatStore = useChatStore();
const router = useRouter();
const route = useRoute();

const id = route.params.id;
const useGuest = useGuestStore();
const { cover_position } = storeToRefs(useGuest);
const { users, avatarUrl, coverUrl } = storeToRefs(useGuest);

const allowChat = ref(false);
const isMutualFollow = ref(false);
const chatLoading = ref(false);
const userOnlineStatus = ref(false);

const showChatButton = computed(() => {
  if (allowChat.value) return true;
  if (!allowChat.value && isMutualFollow.value) return true;
  return false;
});

const followUser = async () => {
  try {
    if (isFollowing.value) {
      await apiLinks.social.unfollow(id);
      isFollowing.value = false;
      message.success('Đã bỏ theo dõi');
    } else {
      await apiLinks.social.follow(id);
      isFollowing.value = true;
      message.success('Đã theo dõi');
    }
    await checkMutualFollow();
  } catch (error) {
    message.error(error.response?.data?.message || 'Lỗi thao tác');
  }
};

const blockUser = async () => {
  try {
    await apiLinks.social.block(id);
    isFollowing.value = false;
    message.success('Đã chặn người dùng');
    router.push({ name: 'profile-info' });
  } catch (error) {
    message.error(error.response?.data?.message || 'Lỗi thao tác');
  }
};

const openChatWithUser = async () => {
  chatLoading.value = true;
  try {
    await chatStore.openChat({
      id: Number(id),
      name: users.value.name,
      avatar: avatarUrl.value || 'https://picsum.photos/150',
      online: userOnlineStatus.value,
    });
  } catch (error) {
    console.error('Error opening chat:', error);
    message.error('Không thể mở chat. Vui lòng thử lại.');
  } finally {
    chatLoading.value = false;
  }
};

const formattedBirthday = computed(() => {
  if (users.value.birthday) {
    return dayjs(users.value.birthday).format('DD-MM');
  }
  return '';
});

const fetchGuest = async () => {
  await useGuest.getGuest(id);
};

const coverStyle = computed(() => ({
  transform: `translateY(${cover_position.value}px)`,
}));

const lastChapter = ref('');
const lastEpisode = ref('');
const followStats = ref(null);

const getLastChapter = () => {
  api
    .get(`/story/guest-chapter/${id}`)
    .then((r) => (lastChapter.value = r.data.chapter_id))
    .catch(console.error);
};

const getlastEpisode = () => {
  api
    .get(`/videos/guest-episode/${id}`)
    .then((r) => (lastEpisode.value = r.data.episode_id))
    .catch(console.error);
};

const userId = computed(() => auth.user?.id);
const isOwnProfile = computed(() => userId.value && userId.value == id);

const getFollowStats = async (userId) => {
  try {
    const response = await apiLinks.social.getFollowStats(userId);
    followStats.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê follow:', error);
  }
};

const checkMutualFollow = async () => {
  try {
    const response = await apiLinks.social.isMutualFollow(id);
    isMutualFollow.value = response.data.is_mutual;
  } catch (error) {
    console.error('Lỗi khi kiểm tra mutual follow:', error);
  }
};

onMounted(async () => {
  try {
    await fetchGuest();
    getLastChapter();
    getlastEpisode();
    await getFollowStats(id);

    const blockResponse = await apiLinks.social.isBlocked(id);
    if (blockResponse.data.blocked) {
      router.push({ name: 'not-found' });
      return;
    }

    const followResponse = await apiLinks.social.isFollowing(id);
    isFollowing.value = followResponse.data.following;

    await checkMutualFollow();

    const chatSettingsResponse = await apiLinks.chat.getUserSettings(id);
    allowChat.value = chatSettingsResponse.data.allow_messages || false;

    try {
      const statusRes = await apiLinks.users.getOnlineStatus(id);
      userOnlineStatus.value = statusRes.data.online;
    } catch (error) {
      console.error('Error fetching online status:', error);
      userOnlineStatus.value = false;
    }
  } catch (error) {
    console.error('Error during mount:', error);
  }
});
</script>

<style lang="scss" scoped>
/* ========== BASE LAYOUT ========== */
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

    .cover-img {
      width: 100%;
      border-radius: 12px;
      object-fit: cover;
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
  }

  .profile-online-dot {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 24px;
    height: 24px;
    background: #44b700;
    border: 4px solid white;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(68, 183, 0, 0.7);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(68, 183, 0, 0);
    }
  }
}

/* ========== PROFILE HEADER ========== */
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.follow-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
  }
}

.unfollow-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  }
}

.block-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
  }
}

.chat-btn {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(8, 145, 178, 0.4);
  }
}

/* ========== PROFILE CARDS ========== */
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
    font-size: 32px;
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
    font-size: 28px;
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
    font-size: 24px;
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
