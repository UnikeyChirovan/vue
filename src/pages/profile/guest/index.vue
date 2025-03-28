<template>
  <div class="profile-page">
    <div class="cover-section">
      <div class="cover-container">
        <img 
          :src="coverUrl ? coverUrl : 'https://via.placeholder.com/1200x300'" 
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
        :src="avatarUrl || 'https://via.placeholder.com/150'"
      />
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

      <n-button v-if="Number(id) !== 1"  class="custom-button block-list" size="small" @click="blockUser">
        Chặn
      </n-button>
    </div>

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
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from 'vue-router';
  import { useRouter } from 'vue-router';
  import { useGuestStore } from '../../../stores/guest.js';
  import { useAuthStore } from '../../../stores/auth.js';
  import api from '../../../services/axiosInterceptor.js';
  import dayjs from 'dayjs';
  import { useMessage } from 'naive-ui';
  const message = useMessage();
  const isFollowing = ref(false);
  const auth = useAuthStore();

const router = useRouter();
const followUser = async () => {
  try {
    if (isFollowing.value) {
      await api.delete(`social/unfollow/${id}`);
      isFollowing.value = false;
      message.success("Đã bỏ theo dõi");
    } else {
      await api.post(`social/follow/${id}`);
      isFollowing.value = true;
      message.success("Đã theo dõi");
    }
  } catch (error) {
    message.error(error.response.data.message || "Lỗi thao tác");
  }
};

const blockUser = async () => {
  try {
    await api.post(`social/block/${id}`);
    isFollowing.value = false; 
    message.success("Đã chặn người dùng");
     router.push({ name: 'profile-info' });
  } catch (error) {
    message.error(error.response.data.message || "Lỗi thao tác");
  }
};


  const route = useRoute();

 const id = route.params.id;
  const useGuest = useGuestStore();
  const { cover_position } = storeToRefs(useGuest);
  const { users, avatarUrl, coverUrl } = storeToRefs(useGuest);

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


const lastChapter = ref("");

const getLastChapter = () => {
  api.get(`/story/guest-chapter/${id}`)
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
  api.get(`/videos/guest-episode/${id}`)
    .then(response => {
      console.log('Fetch successful');
      lastEpisode.value = response.data.episode_id;
    })
    .catch(error => {
      console.error('Error fetching the episode:', error);
    });
};

const userId = computed(() => auth.user?.id);
const isOwnProfile = computed(() => userId.value && userId.value == id);

onMounted(() => {
  fetchGuest();
  getLastChapter();
  getlastEpisode();
  getFollowStats(id)
  api.get(`social/is-following/${id}`)
    .then(res => {
      isFollowing.value = res.data.following;
    })
    .catch(e => {
      console.log(e);
    });
  api.get(`/social/is-blocked/${id}`)
    .then(response => {
        if (response.data.blocked) {
        router.push({name:"not-found" })
        } else {
            console.log("Bạn không bị chặn.");
        }
    })
    .catch(error => console.error("Lỗi khi kiểm tra block:", error));

});

const followStats = ref(null);
const getFollowStats = async (userId) => {
  try {
    const response = await api.get(`/social/follow-stats/${userId}`);
    followStats.value = response.data;
    // console.log('Thống kê follow:', response.data);
  } catch (error) {
    console.error('Lỗi khi lấy thống kê follow:', error);
  }
};


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
  background-color: #FFA500;
  color: white;
}
.custom-button.unfollow {
  background-color: #0c713d; 
  color: white;
}

.custom-button.block-list {
  background-color:  #DC3545;
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

.guest-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>

