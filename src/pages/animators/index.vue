<template>
  <TheHeader />
  <div class="video-wrapper">
    <div class="video-page">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fa-solid fa-film"></i>
          HOẠT HÌNH
        </h1>
        <p class="page-subtitle">Thưởng thức các tập phim đặc sắc</p>
      </div>

      <div class="content" v-if="currentVideo">
        <!-- Video Player Section -->
        <div class="video-section">
          <div class="video-player-wrapper">
            <video ref="videoPlayer" controls class="video-player">
              <source
                v-if="currentVideo.video_path"
                :src="BaseURL + '/' + currentVideo.video_path"
                type="video/mp4"
              />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>

          <!-- Video Controls -->
          <div class="video-controls">
            <button
              @click="prevVideo"
              :disabled="!canGoPrev"
              class="control-btn prev-btn"
            >
              <i class="fa-solid fa-backward"></i>
              <span class="btn-label">Tập trước</span>
            </button>
            <button
              @click="nextVideo"
              :disabled="!canGoNext"
              class="control-btn next-btn"
            >
              <span class="btn-label">Tập tiếp</span>
              <i class="fa-solid fa-forward"></i>
            </button>
          </div>

          <!-- Video Info -->
          <div class="video-info-card">
            <div class="video-header">
              <h2 class="video-title">{{ currentVideo.video_name }}</h2>
              <span class="episode-badge"
                >Tập {{ currentVideo.episode_number }}</span
              >
            </div>
            <p class="video-description">{{ currentVideo.description }}</p>
          </div>
        </div>

        <!-- Playlist Section -->
        <aside class="playlist-section">
          <div class="playlist-header">
            <h2 class="playlist-title">
              <i class="fa-solid fa-list"></i>
              Danh Sách Tập
            </h2>
            <span class="playlist-count">{{ videoList.length }} tập</span>
          </div>
          <ul class="playlist">
            <li
              v-for="video in videoList"
              :key="video.id"
              @click="selectVideo(video)"
              :class="[
                'playlist-item',
                { active: video.id === currentVideo.id },
              ]"
            >
              <div class="episode-info">
                <div class="episode-number-badge">
                  {{ video.episode_number }}
                </div>
                <img
                  v-if="video.thumbnail"
                  :src="BaseURL + '/' + video.thumbnail"
                  class="playlist-thumbnail"
                  alt="Thumbnail"
                />
                <div class="playlist-video-info">
                  <span class="playlist-video-name">{{
                    video.video_name
                  }}</span>
                  <span class="playlist-episode"
                    >Tập {{ video.episode_number }}</span
                  >
                </div>
              </div>
              <i
                v-if="video.id === currentVideo.id"
                class="fa-solid fa-play playing-icon"
              ></i>
            </li>
          </ul>
        </aside>
      </div>

      <!-- Loading State -->
      <div v-else class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải video...</p>
      </div>
    </div>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import api from '../../services/axiosInterceptor';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';

const BaseURL = 'http://127.0.0.1:8000/storage';
const videoList = ref([]);
const currentVideo = ref(null);
const videoPlayer = ref(null);

const canGoPrev = computed(() => {
  if (!currentVideo.value) return false;
  const currentIndex = videoList.value.findIndex(
    (v) => v.id === currentVideo.value.id
  );
  return currentIndex > 0;
});

const canGoNext = computed(() => {
  if (!currentVideo.value) return false;
  const currentIndex = videoList.value.findIndex(
    (v) => v.id === currentVideo.value.id
  );
  return currentIndex < videoList.value.length - 1;
});

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
    const lastVideo = videoList.value.find(
      (video) => video.id === parseInt(lastWatchEpisode)
    );
    const nextIndex =
      videoList.value.findIndex((v) => v.id === parseInt(lastWatchEpisode)) + 1;
    if (lastVideo && nextIndex < videoList.value.length) {
      if (
        confirm(
          `Bạn đã coi đến tập ${lastVideo.episode_number}. Bạn có muốn coi tập tiếp theo không?`
        )
      ) {
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
  const currentIndex = videoList.value.findIndex(
    (v) => v.id === currentVideo.value.id
  );
  if (currentIndex > 0) {
    selectVideo(videoList.value[currentIndex - 1]);
  }
};

const nextVideo = () => {
  if (!currentVideo.value) return;
  const currentIndex = videoList.value.findIndex(
    (v) => v.id === currentVideo.value.id
  );
  if (currentIndex < videoList.value.length - 1) {
    selectVideo(videoList.value[currentIndex + 1]);
  }
};

onMounted(fetchVideos);
</script>

<style scoped>
/* ========== VIDEO PAGE MODERN DESIGN ========== */
.video-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 80px 20px 60px;
}

.video-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* ========== PAGE HEADER ========== */
.page-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(12, 113, 61, 0.3);
}

.page-title {
  font-size: 3rem;
  color: #0c713d;
  font-weight: 800;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-shadow: 0 0 20px rgba(12, 113, 61, 0.5);
}

.page-title i {
  font-size: 2.8rem;
}

.page-subtitle {
  font-size: 1.15rem;
  color: #b8e6d5;
  margin: 0;
  font-weight: 500;
}

/* ========== CONTENT LAYOUT ========== */
.content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
  align-items: start;
}

/* ========== VIDEO SECTION ========== */
.video-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.video-player-wrapper {
  position: relative;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(12, 113, 61, 0.3);
  background: #000;
}

.video-player-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
  z-index: 1;
}

.video-player {
  display: block;
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
}

/* ========== VIDEO CONTROLS (STANDARD BUTTON STYLE) ========== */
.video-controls {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.control-btn {
  flex: 1;
  max-width: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.control-btn::before {
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

.control-btn:hover:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-btn i {
  font-size: 1.1rem;
}

/* ========== VIDEO INFO CARD ========== */
.video-info-card {
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(12, 113, 61, 0.2);
}

.video-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.video-title {
  font-size: 1.8rem;
  color: #b8e6d5;
  margin: 0;
  font-weight: 700;
  flex: 1;
}

.episode-badge {
  padding: 8px 18px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.video-description {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #d4e9e2;
  margin: 0;
}

/* ========== PLAYLIST SECTION ========== */
.playlist-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(12, 113, 61, 0.2);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  position: sticky;
  top: 100px;
}

.playlist-section::-webkit-scrollbar {
  width: 8px;
}

.playlist-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.playlist-section::-webkit-scrollbar-thumb {
  background: #0c713d;
  border-radius: 10px;
}

.playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(12, 113, 61, 0.3);
}

.playlist-title {
  font-size: 1.3rem;
  color: #b8e6d5;
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.playlist-count {
  padding: 6px 14px;
  background: rgba(12, 113, 61, 0.3);
  color: #b8e6d5;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* ========== PLAYLIST ITEMS ========== */
.playlist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlist-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.playlist-item:hover {
  background: rgba(12, 113, 61, 0.15);
  border-color: rgba(12, 113, 61, 0.3);
  transform: translateX(5px);
}

.playlist-item.active {
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.3) 0%,
    rgba(10, 90, 49, 0.3) 100%
  );
  border-color: #0c713d;
  box-shadow: 0 4px 16px rgba(12, 113, 61, 0.4);
}

.episode-info {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.episode-number-badge {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.4);
}

.playlist-thumbnail {
  width: 80px;
  height: 50px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.playlist-video-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.playlist-video-name {
  font-size: 0.95rem;
  color: #d4e9e2;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.playlist-episode {
  font-size: 0.8rem;
  color: #8fc7b3;
  font-weight: 500;
}

.playing-icon {
  font-size: 1.2rem;
  color: #0c713d;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* ========== LOADING STATE ========== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 24px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(12, 113, 61, 0.1);
  border-top-color: #0c713d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  font-size: 1.1rem;
  color: #b8e6d5;
  margin: 0;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet & Small Desktop */
@media (max-width: 1200px) {
  .content {
    grid-template-columns: 1fr 340px;
    gap: 24px;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .video-title {
    font-size: 1.6rem;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .video-wrapper {
    padding: 70px 20px 50px;
  }

  .page-header {
    padding: 35px 25px;
    margin-bottom: 40px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .page-title i {
    font-size: 2.2rem;
  }

  .content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .playlist-section {
    max-height: 600px;
    position: static;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .video-wrapper {
    padding: 60px 15px 40px;
  }

  .page-header {
    padding: 30px 20px;
    margin-bottom: 30px;
    border-radius: 20px;
  }

  .page-title {
    font-size: 1.8rem;
    flex-direction: column;
    gap: 10px;
  }

  .page-title i {
    font-size: 1.8rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .video-section {
    gap: 20px;
  }

  .video-player-wrapper {
    border-radius: 16px;
  }

  .video-controls {
    flex-direction: column;
    gap: 12px;
  }

  .control-btn {
    max-width: 100%;
    width: 100%;
  }

  .video-info-card {
    padding: 24px;
    border-radius: 16px;
  }

  .video-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .video-title {
    font-size: 1.4rem;
  }

  .episode-badge {
    font-size: 0.85rem;
  }

  .video-description {
    font-size: 1rem;
  }

  .playlist-section {
    padding: 20px;
    border-radius: 16px;
    max-height: 500px;
  }

  .playlist-title {
    font-size: 1.2rem;
  }

  .playlist-item {
    padding: 14px;
  }

  .episode-number-badge {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }

  .playlist-thumbnail {
    width: 70px;
    height: 45px;
  }

  .btn-label {
    font-size: 0.95rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .video-wrapper {
    padding: 50px 10px 30px;
  }

  .page-header {
    padding: 25px 18px;
    margin-bottom: 25px;
    border-radius: 16px;
  }

  .page-title {
    font-size: 1.6rem;
  }

  .page-title i {
    font-size: 1.6rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
  }

  .video-player-wrapper {
    border-radius: 14px;
  }

  .control-btn {
    padding: 14px 24px;
    font-size: 0.95rem;
  }

  .control-btn i {
    font-size: 1rem;
  }

  .video-info-card {
    padding: 20px;
    border-radius: 14px;
  }

  .video-title {
    font-size: 1.25rem;
  }

  .episode-badge {
    padding: 6px 14px;
    font-size: 0.8rem;
  }

  .video-description {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .playlist-section {
    padding: 18px;
    border-radius: 14px;
    max-height: 450px;
  }

  .playlist-header {
    margin-bottom: 16px;
    padding-bottom: 14px;
  }

  .playlist-title {
    font-size: 1.1rem;
    gap: 8px;
  }

  .playlist-count {
    font-size: 0.8rem;
    padding: 5px 12px;
  }

  .playlist-item {
    padding: 12px;
    gap: 10px;
  }

  .episode-info {
    gap: 12px;
  }

  .episode-number-badge {
    width: 40px;
    height: 40px;
    font-size: 1rem;
    border-radius: 10px;
  }

  .playlist-thumbnail {
    width: 60px;
    height: 40px;
    border-radius: 8px;
  }

  .playlist-video-name {
    font-size: 0.9rem;
  }

  .playlist-episode {
    font-size: 0.75rem;
  }

  .playing-icon {
    font-size: 1.1rem;
  }
}
</style>
