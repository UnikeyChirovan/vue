<template>
  <TheHeader />
  <div class="video-page">
    <div class="content">
      <!-- Phần hiển thị video chính -->
      <div class="video-container" v-if="currentVideo">
        <video ref="videoPlayer" controls class="video-player">
          <source v-if="currentVideo.video_path" :src="BaseURL + '/' + currentVideo.video_path" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
        <!-- Nút điều hướng video -->
        <div class="video-controls">
          <button @click="prevVideo">⏪ Prev</button>
          <button @click="nextVideo">Next ⏩</button>
        </div>
        <!-- Mô tả video -->
        <h2 class="video-title">{{ currentVideo.video_name }}</h2>
        <p class="video-description">{{ currentVideo.description }}</p>
      </div>
      
      <!-- Danh sách video bên phải -->
      <aside class="related-videos">
        <h2 class="playlist-title">Danh Sách Tập Phim</h2>
        <ul>
          <li v-for="video in videoList" :key="video.id" 
              @click="selectVideo(video)" 
              :class="{ 'active-video': video.id === currentVideo.id }">
            <div class="episode-number">{{ video.episode_number }}</div> <!-- Hiển thị số tập -->
            <img v-if="video.thumbnail" :src="BaseURL + '/' + video.thumbnail" class="related-thumbnail" alt="Thumbnail" />
            <div class="video-info">
              <span>{{ video.video_name }}</span>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  </div>
  <TheFooter />
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '../../services/axiosInterceptor';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';

const BaseURL = 'http://127.0.0.1:8000/storage';
const videoList = ref([]);
const currentVideo = ref(null);
const videoPlayer = ref(null);

const fetchVideos = async () => {
  try {
    const response = await api.get('/videos');
    videoList.value = response.data;
    checkLastWatchedEpisode();
  } catch (error) {
    console.error('Lỗi khi tải danh sách video:', error);
  }
};

const checkLastWatchedEpisode = () => {
  const lastWatchEpisode = localStorage.getItem('lastWatchEpisode');
  if (lastWatchEpisode) {
    const lastVideo = videoList.value.find(video => video.id === parseInt(lastWatchEpisode));
    const nextIndex = videoList.value.findIndex(v => v.id === parseInt(lastWatchEpisode)) + 1;
    if (lastVideo && nextIndex < videoList.value.length) {
      if (confirm(`Bạn đã coi đến tập ${lastVideo.episode_number}. Bạn có muốn coi tập tiếp theo không?`)) {
        selectVideo(videoList.value[nextIndex]);
      } else {
        selectVideo(lastVideo, false);
      }
    } else {
      selectVideo(lastVideo, false);
    }
  } else if (videoList.value.length > 0) {
    selectVideo(videoList.value[0]);
  }
};

const selectVideo = async (video, updateLastWatch = true) => {
  currentVideo.value = video;
  if (updateLastWatch) {
    localStorage.setItem('lastWatchEpisode', video.id);
    await saveWatchEpisode(video.id);
  }
  await nextTick();
  if (videoPlayer.value) {
    videoPlayer.value.load();
  }
};

const saveWatchEpisode = async (videoId) => {
  try {
    await api.post('/videos/user-episode', { episode_id: videoId });
  } catch (error) {
    console.error('Lỗi khi lưu tập đã xem:', error);
  }
};

const prevVideo = () => {
  if (!currentVideo.value) return;
  const currentIndex = videoList.value.findIndex(v => v.id === currentVideo.value.id);
  if (currentIndex > 0) {
    selectVideo(videoList.value[currentIndex - 1]);
  }
};

const nextVideo = () => {
  if (!currentVideo.value) return;
  const currentIndex = videoList.value.findIndex(v => v.id === currentVideo.value.id);
  if (currentIndex < videoList.value.length - 1) {
    selectVideo(videoList.value[currentIndex + 1]);
  }
};

onMounted(fetchVideos);
</script>

<style scoped>
.video-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: #111;
  color: #fff;
  min-height: 100vh;
}

.content {
  display: flex;
  width: 80%;
  margin-top: 20px;
}

.video-container {
  flex: 3;
  padding-right: 20px;
  text-align: center;
}

.video-player {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.video-controls {
  margin-top: 10px;
}

.video-controls button {
  background: #0c713d;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.video-controls button:hover {
  background: #0073e6;
}

.video-title {
  font-size: 24px;
  margin-top: 10px;
  text-align: center;
  color:#0c713d;
}

.playlist-title {
  text-align: center;
  color: #0c713d;
  font-weight: bold;
}

.video-description {
  font-size: 16px;
  opacity: 0.8;
  text-align: left;
}

.related-videos {
  flex: 1.5; /* Làm cho danh sách video rộng hơn một chút */
  background: #222;
  padding: 10px;
  border-radius: 10px;
}

.related-videos h2 {
  font-size: 18px;
}

.related-videos ul {
  list-style: none;
  padding: 0;
}

.related-videos li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #444;
  transition: background 0.3s ease-in-out;
}

.related-videos li:hover {
  background: #333;
}

.active-video {
  background: #0c713d !important;
  color: white;
  font-weight: bold;
}

.related-thumbnail {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
}

.video-info {
  font-size: 14px;
  color: white;
  font-weight: bold;
}

.episode-number {
  font-size: 30px;
  color:#0c713d;
  font-weight: bold;
  background-color: white;
  padding: 5px 10px; /* Tăng chiều rộng và chiều cao của background */
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều ngang */
  height: 40px; /* Đặt chiều cao bằng với chiều cao của thumbnail */
  width: auto;
  margin-left: -5px; /* Mở rộng background ra ngoài khoảng 5px */
  margin-right: 5px; /* Mở rộng background ra ngoài khoảng 5px */
}
</style>
