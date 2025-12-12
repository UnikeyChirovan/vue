<template>
  <div class="profile-page">
    <div class="cover-section">
      <div class="cover-container">
        <img
          :src="coverUrl ? coverUrl : 'https://picsum.photos/1200x300'"
          alt="Cover Image"
          class="cover-img"
          :style="coverStyle"
        />
      </div>
    </div>
    <div class="avatar-section">
      <n-image
        class="avatar-img"
        alt="User Profile"
        :src="avatarUrl || 'https://picsum.photos/150'"
      />
      <span v-if="userOnlineStatus" class="profile-online-dot"></span>
    </div>
    <h1 class="username">{{ users.name }}</h1>
    <div class="rate-container">
      <n-rate color="#4fb233" readonly :default-value="5" />
    </div>
    <div class="profile-pages">
      <div class="guest-buttons" v-if="!isOwnProfile">
        <n-button
          class="custom-button"
          :class="isFollowing ? 'follow' : 'unfollow'"
          size="small"
          @click="followUser"
        >
          {{ isFollowing ? 'Bỏ theo dõi' : 'Theo dõi' }}
        </n-button>
        <n-button
          v-if="Number(id) !== 1"
          class="custom-button block-list"
          size="small"
          @click="blockUser"
        >
          Chặn
        </n-button>

        <!-- Nút nhắn tin hiển thị theo logic mới -->
        <n-button
          v-if="showChatButton"
          class="custom-button chat-button"
          size="small"
          @click="openChatWithUser"
          :loading="chatLoading"
        >
          <i class="fa-solid fa-comment"></i>
          Nhắn Tin
        </n-button>
      </div>
    </div>
    <div class="profile">
      <div class="info-card card">
        <h2 class="section-title">Thông Tin Cá Nhân</h2>
        <p v-if="users.occupation">
          <strong>Nghề nghiệp:</strong> {{ users.occupation }}
        </p>
        <p v-if="users.gender">
          <strong>Giới tính:</strong> {{ users.gender }}
        </p>
        <p v-if="users.birthday">
          <strong>Ngày sinh:</strong> {{ formattedBirthday }}
        </p>
        <p v-if="users.address">
          <strong>Địa chỉ:</strong> {{ users.address }}
        </p>
        <p v-if="users.hobbies">
          <strong>Sở thích:</strong> {{ users.hobbies }}
        </p>
        <p v-if="users.biography">
          <strong>Tiểu sử:</strong> {{ users.biography }}
        </p>
        <p v-if="users.phone_number">
          <strong>Điện Thoại:</strong> {{ users.phone_number }}
        </p>
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
          <p>
            Chương đọc gần nhất: <span>{{ lastChapter - 1 }}</span>
          </p>
        </div>
        <div class="last-episode-section">
          <p>
            Tập coi gần nhất: <span>{{ lastEpisode - 1 }}</span>
          </p>
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

// Chat related states
const allowChat = ref(false);
const isMutualFollow = ref(false);
const chatLoading = ref(false);

const userOnlineStatus = ref(false);

// Logic hiển thị nút chat
const showChatButton = computed(() => {
  // Trường hợp 1: Người được xem BẬT allow_messages -> luôn hiện
  if (allowChat.value) {
    return true;
  }

  // Trường hợp 2: Người được xem TẮT allow_messages NHƯNG follow lẫn nhau -> vẫn hiện
  if (!allowChat.value && isMutualFollow.value) {
    return true;
  }

  // Các trường hợp khác: ẩn
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

    // Cập nhật lại trạng thái mutual follow
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
const getLastChapter = () => {
  api
    .get(`/story/guest-chapter/${id}`)
    .then((response) => {
      lastChapter.value = response.data.chapter_id;
    })
    .catch((error) => {
      console.error('Error fetching the chapter:', error);
    });
};

const lastEpisode = ref('');
const getlastEpisode = () => {
  api
    .get(`/videos/guest-episode/${id}`)
    .then((response) => {
      lastEpisode.value = response.data.episode_id;
    })
    .catch((error) => {
      console.error('Error fetching the episode:', error);
    });
};

const userId = computed(() => auth.user?.id);
const isOwnProfile = computed(() => userId.value && userId.value == id);

const followStats = ref(null);
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

    // Kiểm tra block status
    const blockResponse = await apiLinks.social.isBlocked(id);
    if (blockResponse.data.blocked) {
      router.push({ name: 'not-found' });
      return;
    }

    // Kiểm tra following status
    const followResponse = await apiLinks.social.isFollowing(id);
    isFollowing.value = followResponse.data.following;

    // Kiểm tra mutual follow
    await checkMutualFollow();

    // Lấy cài đặt chat của người được xem
    const chatSettingsResponse = await apiLinks.chat.getUserSettings(id);
    allowChat.value = chatSettingsResponse.data.allow_messages || false;
    // Lấy online status
    try {
      const statusRes = await apiLinks.users.getOnlineStatus(id);
      userOnlineStatus.value = statusRes.data.online;
      //console.log(`✓ User ${id} online:`, statusRes.data.online);
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
.profile-page {
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #f7f7f7;

  /* Cover Section */
  .cover-section {
    position: relative;
    height: 300px;
    background-color: #282c34;
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

  .profile-pages {
    max-width: 800px;
    margin: 30px auto;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.custom-button {
  padding: 16px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.custom-button.follow {
  background-color: #ffa500;
  color: white;
}
.custom-button.unfollow {
  background-color: #0c713d;
  color: white;
}

.custom-button.block-list {
  background-color: #dc3545;
  color: white;
}

.custom-button.chat-button {
  background-color: #0084ff;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-button.chat-button:hover {
  background-color: #006bcc;
}

.custom-button:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}

.custom-button:active {
  transform: translateY(0);
  box-shadow: none;
}

.guest-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
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
</style>
