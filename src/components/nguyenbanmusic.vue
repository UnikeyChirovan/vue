<template>
  <div class="music-player-wrapper">
    <!-- Floating Button with Album Cover -->
    <div
      @click="togglePlayer"
      class="music-float-button"
      :class="{
        'is-playing': isPlaying,
        'dark-mode': themeStore.isDarkMode,
      }"
    >
      <!-- Animated Rings for Playing State -->
      <div v-if="isPlaying" class="sound-waves">
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
      </div>

      <!-- Album Cover (Desktop) or Icon (Mobile) -->
      <div class="button-content">
        <!-- Desktop: Album Cover -->
        <img
          v-if="currentTrackCover"
          :src="currentTrackCover"
          alt="Album Cover"
          class="cover-image desktop-only"
        />

        <!-- Mobile: Icons -->
        <i v-if="!isPlaying" class="fas fa-music mobile-only"></i>
        <i v-else class="fas fa-circle-notch fa-spin mobile-only"></i>

        <!-- Desktop: Default Icon when no cover -->
        <i
          v-if="!currentTrackCover"
          class="fas fa-music desktop-only default-icon"
        ></i>
      </div>
    </div>

    <!-- Expanded Player -->
    <Transition name="player-slide">
      <div
        v-if="showPlayer"
        class="music-player-container"
        :class="{ 'dark-mode': themeStore.isDarkMode }"
      >
        <div class="player-header">
          <h3 class="player-title">
            <i class="fas fa-headphones"></i>
            Nhạc nền
          </h3>
          <button @click="showPlayer = false" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="player-body">
          <!-- Current Track Info -->
          <div v-if="currentTrack" class="current-track-info">
            <div class="track-cover">
              <img
                v-if="currentTrackCover"
                :src="currentTrackCover"
                alt="Album Cover"
                class="track-cover-image"
              />
              <i v-else class="fas fa-music"></i>
            </div>
            <div class="track-details">
              <h4 class="track-title">{{ currentTrack.title }}</h4>
              <p class="track-artist">
                {{ currentTrack.artist || 'Unknown Artist' }}
              </p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="currentTrack" class="progress-container">
            <span class="time-label">{{ formatTime(currentTime) }}</span>
            <input
              type="range"
              class="progress-bar"
              :value="currentTime"
              :max="duration"
              @input="seek"
            />
            <span class="time-label">{{ formatTime(duration) }}</span>
          </div>

          <!-- Controls -->
          <div class="player-controls">
            <button
              @click="toggleShuffle"
              class="control-btn shuffle-btn"
              :class="{ active: isShuffleMode }"
              :title="
                isShuffleMode ? 'Tắt phát ngẫu nhiên' : 'Bật phát ngẫu nhiên'
              "
            >
              <i class="fas fa-random"></i>
            </button>

            <button
              @click="playPrevious"
              class="control-btn"
              :disabled="!hasPrevious"
            >
              <i class="fas fa-step-backward"></i>
            </button>

            <button @click="togglePlay" class="control-btn play-btn">
              <i v-if="!isPlaying" class="fas fa-play"></i>
              <i v-else class="fas fa-pause"></i>
            </button>

            <button @click="playNext" class="control-btn" :disabled="!hasNext">
              <i class="fas fa-step-forward"></i>
            </button>

            <button
              @click="toggleRepeat"
              class="control-btn"
              :class="{ active: repeatMode !== 'off' }"
            >
              <i v-if="repeatMode === 'all'" class="fas fa-repeat"></i>
              <i v-else-if="repeatMode === 'one'" class="fas fa-repeat-1"></i>
              <i v-else class="fas fa-repeat"></i>
            </button>

            <button @click="showPlaylistModal = true" class="control-btn">
              <i class="fas fa-list"></i>
            </button>
          </div>

          <!-- Volume Control -->
          <div class="volume-container">
            <i class="fas fa-volume-down"></i>
            <input
              type="range"
              class="volume-slider"
              v-model="volume"
              min="0"
              max="100"
              @input="updateVolume"
            />
            <i class="fas fa-volume-up"></i>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Playlist Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showPlaylistModal"
        class="modal-overlay"
        @click="showPlaylistModal = false"
      >
        <div
          class="modal-container"
          :class="{ 'dark-mode': themeStore.isDarkMode }"
          @click.stop
        >
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-list-music"></i>
              Danh sách nhạc
            </h3>
            <button @click="showPlaylistModal = false" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <!-- Tabs -->
            <div class="playlist-tabs">
              <button
                @click="activeTab = 'favorites'"
                class="tab-button"
                :class="{ active: activeTab === 'favorites' }"
              >
                <i class="fas fa-heart"></i>
                Yêu thích ({{ favorites.length }})
              </button>
              <button
                @click="activeTab = 'albums'"
                class="tab-button"
                :class="{ active: activeTab === 'albums' }"
              >
                <i class="fas fa-compact-disc"></i>
                Albums ({{ albums.length }})
              </button>
            </div>

            <!-- Favorites Tab -->
            <div v-if="activeTab === 'favorites'" class="tab-content">
              <div v-if="favorites.length === 0" class="empty-state">
                <i class="fas fa-music"></i>
                <p>Chưa có bài hát yêu thích</p>
                <p class="hint">Chọn bài hát từ Albums để thêm vào đây</p>
              </div>
              <div v-else class="track-list">
                <div
                  v-for="track in favorites"
                  :key="'fav-' + track.id"
                  class="track-item"
                  :class="{ active: currentTrack?.id === track.id }"
                  @click="playTrack(track, favorites)"
                >
                  <div class="track-info">
                    <i
                      v-if="currentTrack?.id === track.id && isPlaying"
                      class="fas fa-volume-up playing-icon"
                    ></i>
                    <i v-else class="fas fa-music track-icon"></i>
                    <div class="track-text">
                      <span class="track-name">{{ track.title }}</span>
                      <span class="track-artist">{{
                        track.artist || 'Unknown'
                      }}</span>
                    </div>
                  </div>
                  <button
                    @click.stop="removeFavorite(track.id)"
                    class="action-btn remove-btn"
                  >
                    <i class="fas fa-heart-broken"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Albums Tab -->
            <div v-if="activeTab === 'albums'" class="tab-content">
              <div class="albums-list">
                <div
                  v-for="album in albums"
                  :key="album.id"
                  class="album-card"
                  @click="toggleAlbum(album.id)"
                >
                  <div class="album-header">
                    <div class="album-info">
                      <img
                        v-if="album.cover_image"
                        :src="getAlbumCoverUrl(album.cover_image)"
                        alt="Album Cover"
                        class="album-cover-thumb"
                      />
                      <i v-else class="fas fa-compact-disc"></i>
                      <h4>{{ album.name }}</h4>
                    </div>
                    <i
                      class="fas fa-chevron-down expand-icon"
                      :class="{ expanded: expandedAlbum === album.id }"
                    ></i>
                  </div>

                  <Transition name="expand">
                    <div v-if="expandedAlbum === album.id" class="album-tracks">
                      <div
                        v-for="track in album.active_tracks"
                        :key="track.id"
                        class="track-item"
                        :class="{ active: currentTrack?.id === track.id }"
                      >
                        <div
                          class="track-info"
                          @click.stop="playTrack(track, album.active_tracks)"
                        >
                          <i
                            v-if="currentTrack?.id === track.id && isPlaying"
                            class="fas fa-volume-up playing-icon"
                          ></i>
                          <i v-else class="fas fa-music track-icon"></i>
                          <div class="track-text">
                            <span class="track-name">{{ track.title }}</span>
                            <span class="track-artist">{{
                              track.artist || 'Unknown'
                            }}</span>
                          </div>
                        </div>
                        <button
                          @click.stop="toggleFavorite(track)"
                          class="action-btn"
                          :class="{ 'is-favorite': isFavorite(track.id) }"
                        >
                          <i
                            v-if="isFavorite(track.id)"
                            class="fas fa-heart"
                          ></i>
                          <i v-else class="far fa-heart"></i>
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioPlayer"
      @timeupdate="updateTime"
      @loadedmetadata="updateDuration"
      @ended="handleTrackEnd"
    ></audio>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useThemeStore } from '../stores/themeStore';
import api from '../services/axiosInterceptor';
import { useMessage } from 'naive-ui';

const themeStore = useThemeStore();
const message = useMessage();
// UI State
const showPlayer = ref(false);
const showPlaylistModal = ref(false);
const activeTab = ref('favorites');
const expandedAlbum = ref(null);

// Data State
const albums = ref([]);
const favorites = ref([]);
const currentPlaylist = ref([]);
const currentTrack = ref(null);
const currentTrackIndex = ref(-1);

// Player State
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(70);
const repeatMode = ref('off');
const isShuffleMode = ref(false);
const audioPlayer = ref(null);

// Shuffle State
const originalPlaylist = ref([]);
const shuffledPlaylist = ref([]);

// Computed Properties
const hasPrevious = computed(() => currentTrackIndex.value > 0);
const hasNext = computed(
  () => currentTrackIndex.value < currentPlaylist.value.length - 1
);

const currentTrackCover = computed(() => {
  if (!currentTrack.value) return null;

  // Tìm album chứa track hiện tại
  const album = albums.value.find((a) =>
    a.active_tracks?.some((t) => t.id === currentTrack.value.id)
  );

  if (album?.cover_image) {
    return getAlbumCoverUrl(album.cover_image);
  }

  return null;
});

// Helper Functions
const getAlbumCoverUrl = (imagePath) => {
  if (!imagePath) return null;
  return `http://127.0.0.1:8000/storage/${imagePath}`;
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Core Audio Functions
const setAudioSource = (track, playlist) => {
  currentTrack.value = track;

  if (isShuffleMode.value) {
    originalPlaylist.value = playlist;
    if (
      shuffledPlaylist.value.length === 0 ||
      JSON.stringify(playlist) !== JSON.stringify(originalPlaylist.value)
    ) {
      shuffledPlaylist.value = shuffleArray(playlist);
    }
    currentPlaylist.value = shuffledPlaylist.value;
  } else {
    originalPlaylist.value = playlist;
    currentPlaylist.value = playlist;
  }

  currentTrackIndex.value = currentPlaylist.value.findIndex(
    (t) => t.id === track.id
  );

  audioPlayer.value.src = track.file_url;
  audioPlayer.value.load();
};

const playTrack = async (track, playlist) => {
  if (!track || !track.file_url) {
    message.error('Không thể phát bài hát này');
    return;
  }

  setAudioSource(track, playlist);

  try {
    await audioPlayer.value.play();
    isPlaying.value = true;

    localStorage.setItem(
      'lastPlayedTrack',
      JSON.stringify({
        trackId: track.id,
        playlistType: activeTab.value,
      })
    );
  } catch (error) {
    message.error('Lỗi khi phát nhạc');
  }
};

const togglePlay = async () => {
  if (!currentTrack.value || !audioPlayer.value?.src) {
    if (favorites.value.length > 0) {
      await playTrack(favorites.value[0], favorites.value);
      return;
    }

    for (const album of albums.value) {
      if (album.active_tracks?.length > 0) {
        await playTrack(album.active_tracks[0], album.active_tracks);
        return;
      }
    }

    message.warning('Không có bài hát nào để phát');
    return;
  }

  if (isPlaying.value) {
    audioPlayer.value.pause();
    isPlaying.value = false;
  } else {
    try {
      await audioPlayer.value.play();
      isPlaying.value = true;
    } catch (error) {
      message.error('Không thể phát nhạc');
    }
  }
};

const playNext = () => {
  if (!hasNext.value) return;
  playTrack(
    currentPlaylist.value[currentTrackIndex.value + 1],
    originalPlaylist.value
  );
};

const playPrevious = () => {
  if (!hasPrevious.value) return;
  playTrack(
    currentPlaylist.value[currentTrackIndex.value - 1],
    originalPlaylist.value
  );
};

// Shuffle Mode
const toggleShuffle = () => {
  isShuffleMode.value = !isShuffleMode.value;

  if (isShuffleMode.value) {
    message.info('Đã bật phát ngẫu nhiên');

    if (currentTrack.value && originalPlaylist.value.length > 0) {
      shuffledPlaylist.value = shuffleArray(originalPlaylist.value);
      currentPlaylist.value = shuffledPlaylist.value;
      currentTrackIndex.value = currentPlaylist.value.findIndex(
        (t) => t.id === currentTrack.value.id
      );
    }
  } else {
    message.info('Đã tắt phát ngẫu nhiên');

    if (currentTrack.value && originalPlaylist.value.length > 0) {
      currentPlaylist.value = originalPlaylist.value;
      currentTrackIndex.value = currentPlaylist.value.findIndex(
        (t) => t.id === currentTrack.value.id
      );
    }
  }

  localStorage.setItem('shuffleMode', JSON.stringify(isShuffleMode.value));
};

// Audio Event Handlers
const handleTrackEnd = () => {
  if (repeatMode.value === 'one') {
    audioPlayer.value.currentTime = 0;
    audioPlayer.value.play();
    return;
  }

  if (repeatMode.value === 'all') {
    if (hasNext.value) {
      playNext();
    } else if (currentPlaylist.value.length > 0) {
      playTrack(currentPlaylist.value[0], originalPlaylist.value);
    }
    return;
  }

  if (hasNext.value) {
    playNext();
  } else {
    isPlaying.value = false;
  }
};

const updateTime = () => {
  currentTime.value = audioPlayer.value.currentTime;
};

const updateDuration = () => {
  duration.value = audioPlayer.value.duration;
};

const seek = (event) => {
  if (!audioPlayer.value) return;
  audioPlayer.value.currentTime = Number(event.target.value);
};

const updateVolume = () => {
  if (!audioPlayer.value) return;
  audioPlayer.value.volume = volume.value / 100;
  localStorage.setItem('musicVolume', volume.value.toString());
};

// UI Controls
const togglePlayer = () => {
  showPlayer.value = !showPlayer.value;
};

const toggleAlbum = (albumId) => {
  expandedAlbum.value = expandedAlbum.value === albumId ? null : albumId;
};

const toggleRepeat = () => {
  const modes = ['off', 'all', 'one'];
  const currentIndex = modes.indexOf(repeatMode.value);
  repeatMode.value = modes[(currentIndex + 1) % modes.length];

  const modeLabels = {
    off: 'Tắt lặp lại',
    all: 'Lặp tất cả',
    one: 'Lặp một bài',
  };

  message.info(modeLabels[repeatMode.value]);
};

// Favorites Management
const isFavorite = (trackId) => favorites.value.some((f) => f.id === trackId);

const toggleFavorite = async (track) => {
  try {
    if (isFavorite(track.id)) {
      await api.delete(`/music/favorites/${track.id}`);
      message.success('Đã xóa khỏi yêu thích');
    } else {
      await api.post('/music/favorites', { track_id: track.id });
      message.success('Đã thêm vào yêu thích');
    }
    await fetchFavorites();
  } catch (error) {
    message.error('Có lỗi xảy ra');
  }
};

const removeFavorite = async (trackId) => {
  try {
    await api.delete(`/music/favorites/${trackId}`);
    await fetchFavorites();
    message.success('Đã xóa khỏi yêu thích');
  } catch (error) {
    message.error('Không thể xóa khỏi yêu thích');
  }
};

// Data Fetching
const fetchAlbums = async () => {
  try {
    const response = await api.get('/music/albums');
    albums.value = response.data;
  } catch (error) {
    message.error('Không thể tải danh sách albums');
  }
};

const fetchFavorites = async () => {
  try {
    const response = await api.get('/music/favorites');
    favorites.value = response.data;
  } catch (error) {
    message.error('Không thể tải danh sách yêu thích');
  }
};

// State Restoration
const loadLastPlayedTrack = () => {
  const savedTrack = localStorage.getItem('lastPlayedTrack');
  if (!savedTrack) return;

  try {
    const { trackId, playlistType } = JSON.parse(savedTrack);

    if (playlistType === 'favorites') {
      const track = favorites.value.find((t) => t.id === trackId);
      if (track) {
        setAudioSource(track, favorites.value);
        return;
      }
    }

    for (const album of albums.value) {
      const track = album.active_tracks?.find((t) => t.id === trackId);
      if (track) {
        setAudioSource(track, album.active_tracks);
        break;
      }
    }
  } catch (error) {
    localStorage.removeItem('lastPlayedTrack');
  }
};

const loadVolume = () => {
  const savedVolume = localStorage.getItem('musicVolume');
  if (savedVolume) {
    volume.value = parseInt(savedVolume);
    updateVolume();
  }
};

const loadShuffleMode = () => {
  const savedShuffle = localStorage.getItem('shuffleMode');
  if (savedShuffle) {
    isShuffleMode.value = JSON.parse(savedShuffle);
  }
};

// Utility Functions
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Lifecycle Hooks
onMounted(async () => {
  await Promise.all([fetchAlbums(), fetchFavorites()]);
  loadLastPlayedTrack();
  loadVolume();
  loadShuffleMode();
});

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }
});

// Watchers
watch(volume, () => {
  updateVolume();
});
</script>
<style scoped>
/* ========== FLOATING BUTTON - BASE (MOBILE) ========== */
.music-float-button {
  position: fixed;
  bottom: 15px;
  right: 80px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  z-index: 999;
  overflow: visible;
}

.music-float-button .button-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
}

/* Mobile Icons - Hiển thị trên mobile */
.mobile-only {
  display: block;
}

/* Desktop Elements - Ẩn trên mobile */
.desktop-only {
  display: none;
}

/* Sound Waves Animation */
.sound-waves {
  position: absolute;
  inset: -10px;
  z-index: 1;
  pointer-events: none;
}

.wave {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(12, 113, 61, 0.6);
  animation: wave-pulse 2s ease-out infinite;
}

.wave-1 {
  animation-delay: 0s;
}

.wave-2 {
  animation-delay: 0.6s;
}

.wave-3 {
  animation-delay: 1.2s;
}

@keyframes wave-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

.music-float-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 28px rgba(12, 113, 61, 0.5);
}

/* ========== DESKTOP VERSION (≥ 1024px) ========== */
@media (min-width: 1024px) {
  .music-float-button {
    top: 180px;
    right: 90px;
    bottom: auto;
    width: 80px;
    height: 80px;
    background: transparent;
    box-shadow: none;
    border: none;
  }

  /* Ẩn mobile icons trên desktop */
  .mobile-only {
    display: none;
  }

  /* Hiển thị desktop elements */
  .desktop-only {
    display: flex;
  }

  /* Button content là container cho hình tròn */
  .music-float-button .button-content {
    background: transparent;
  }

  /* Album Cover - Hình tròn đầy đủ 80x80px */
  .music-float-button .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #0c713d;
    box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
  }

  /* Default Icon khi không có cover */
  .music-float-button .default-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
    border-radius: 50%;
    font-size: 2rem;
    color: white;
    box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
  }

  /* Quay hình như đĩa CD khi đang phát */
  .music-float-button.is-playing .cover-image {
    animation: spin 7s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Hiệu ứng lan tỏa mạnh hơn trên desktop */
  .music-float-button .wave {
    border-width: 3px;
  }
}

/* ========== RESPONSIVE FOR SPECIFIC DESKTOP SIZES ========== */
/* Từ 1024px đến 1279px */
@media (min-width: 1024px) and (max-width: 1279px) {
  .music-float-button {
    top: 175px;
    right: 70px;
  }
}

/* Từ 1280px đến 1440px */
@media (min-width: 1280px) and (max-width: 1440px) {
  .music-float-button {
    right: 90px;
  }
}

/* ========== PLAYER CONTAINER ========== */
.music-player-container {
  position: fixed;
  bottom: 85px;
  right: 15px;
  width: 380px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 998;
  border: 2px solid rgba(12, 113, 61, 0.1);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
}

.player-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.player-body {
  padding: 20px;
}

/* ========== CURRENT TRACK INFO ========== */
.current-track-info {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
}

.track-cover {
  width: 70px;
  height: 70px;
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.1) 0%,
    rgba(12, 113, 61, 0.05) 100%
  );
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #0c713d;
  overflow: hidden;
}

.track-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-details {
  flex: 1;
  min-width: 0;
}

.track-title {
  margin: 0 0 5px 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== PROGRESS BAR ========== */
.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.time-label {
  font-size: 0.85rem;
  color: #666;
  min-width: 40px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  background: #e9ecef;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0c713d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.progress-bar::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px rgba(12, 113, 61, 0.2);
}

.progress-bar::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0c713d;
  cursor: pointer;
  border: none;
}

/* ========== PLAYER CONTROLS ========== */
.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.control-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid #e9ecef;
  background: white;
  color: #0c713d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: #0c713d;
  color: white;
  border-color: #0c713d;
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-btn.active {
  background: #0c713d;
  color: white;
  border-color: #0c713d;
}

.shuffle-btn {
  position: relative;
}

.shuffle-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
}

.play-btn {
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  font-size: 1.3rem;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.4);
}

/* ========== VOLUME CONTROL ========== */
.volume-container {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #0c713d;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  background: #e9ecef;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #0c713d;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #0c713d;
  cursor: pointer;
  border: none;
}

/* ========== MODAL ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* ========== TABS ========== */
.playlist-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab-button {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #e9ecef;
  background: white;
  color: #666;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-button:hover {
  background: rgba(12, 113, 61, 0.05);
  border-color: #0c713d;
}

.tab-button.active {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border-color: #0c713d;
}

/* ========== TAB CONTENT ========== */
.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #ccc;
}

.empty-state p {
  margin: 8px 0;
  font-size: 1.05rem;
}

.empty-state .hint {
  font-size: 0.9rem;
  color: #bbb;
}

/* ========== TRACK LIST ========== */
.track-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.track-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.track-item:hover {
  background: rgba(12, 113, 61, 0.05);
  border-color: rgba(12, 113, 61, 0.2);
}

.track-item.active {
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.1) 0%,
    rgba(12, 113, 61, 0.05) 100%
  );
  border-color: #0c713d;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.track-icon,
.playing-icon {
  font-size: 1.1rem;
  color: #0c713d;
  flex-shrink: 0;
}

.playing-icon {
  animation: volumePulse 1s ease-in-out infinite;
}

@keyframes volumePulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.track-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.track-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 0.85rem;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-btn {
  background: white;
  border: 2px solid #e9ecef;
  color: #999;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.action-btn:hover {
  background: #0c713d;
  color: white;
  border-color: #0c713d;
}

.action-btn.is-favorite {
  background: #0c713d;
  color: white;
  border-color: #0c713d;
}

.remove-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
}

/* ========== ALBUMS LIST ========== */
.albums-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.album-card {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.album-card:hover {
  border-color: rgba(12, 113, 61, 0.3);
}

.album-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  background: white;
}

.album-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.album-cover-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.album-info i {
  font-size: 1.3rem;
  color: #0c713d;
}

.album-info h4 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #333;
}

.expand-icon {
  color: #666;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.album-tracks {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ========== TRANSITIONS ========== */
.player-slide-enter-active,
.player-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.player-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.player-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from .modal-container {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}

.modal-fade-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}

/* ========== DARK MODE ========== */
.music-float-button.dark-mode {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
  box-shadow: 0 6px 20px rgba(15, 138, 74, 0.4);
}

.music-float-button.dark-mode:hover {
  box-shadow: 0 8px 28px rgba(15, 138, 74, 0.5);
}

@media (min-width: 1024px) {
  .music-float-button.dark-mode {
    background: transparent;
    box-shadow: none;
  }

  .music-float-button.dark-mode .cover-image {
    border-color: var(--dark-accent-green);
    box-shadow: 0 6px 20px rgba(15, 138, 74, 0.4);
  }

  .music-float-button.dark-mode .default-icon {
    background: linear-gradient(
      135deg,
      var(--dark-accent-green) 0%,
      var(--dark-accent-green-light) 100%
    );
    box-shadow: 0 6px 20px rgba(15, 138, 74, 0.4);
  }

  .music-float-button.dark-mode .wave {
    border-color: rgba(15, 138, 74, 0.6);
  }
}

.music-player-container.dark-mode {
  background: var(--dark-bg-card);
  border-color: var(--dark-border);
}

.music-player-container.dark-mode .player-header {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
}

.music-player-container.dark-mode .track-title {
  color: var(--dark-text-primary);
}

.music-player-container.dark-mode .track-artist,
.music-player-container.dark-mode .time-label {
  color: var(--dark-text-secondary);
}

.music-player-container.dark-mode .control-btn {
  background: var(--dark-bg-elevated);
  border-color: var(--dark-border);
  color: var(--dark-accent-green);
}

.music-player-container.dark-mode .control-btn:hover:not(:disabled) {
  background: var(--dark-accent-green);
  color: var(--dark-text-primary);
}

.music-player-container.dark-mode .control-btn.active {
  background: var(--dark-accent-green);
  color: var(--dark-text-primary);
}

.modal-container.dark-mode {
  background: var(--dark-bg-card);
}

.modal-container.dark-mode .modal-header {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
}

.modal-container.dark-mode .tab-button {
  background: var(--dark-bg-elevated);
  border-color: var(--dark-border);
  color: var(--dark-text-secondary);
}

.modal-container.dark-mode .tab-button:hover {
  background: rgba(15, 138, 74, 0.1);
  border-color: var(--dark-accent-green);
}

.modal-container.dark-mode .tab-button.active {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  );
  color: var(--dark-text-primary);
}

.modal-container.dark-mode .track-item {
  background: var(--dark-bg-elevated);
  border-color: transparent;
}

.modal-container.dark-mode .track-item:hover {
  background: rgba(15, 138, 74, 0.1);
  border-color: rgba(15, 138, 74, 0.3);
}

.modal-container.dark-mode .track-item.active {
  background: rgba(15, 138, 74, 0.15);
  border-color: var(--dark-accent-green);
}

.modal-container.dark-mode .track-name {
  color: var(--dark-text-primary);
}

.modal-container.dark-mode .track-artist {
  color: var(--dark-text-muted);
}

.modal-container.dark-mode .action-btn {
  background: var(--dark-bg-card);
  border-color: var(--dark-border);
  color: var(--dark-text-muted);
}

.modal-container.dark-mode .action-btn:hover {
  background: var(--dark-accent-green);
  color: var(--dark-text-primary);
  border-color: var(--dark-accent-green);
}

.modal-container.dark-mode .action-btn.is-favorite {
  background: var(--dark-accent-green);
  color: var(--dark-text-primary);
}

.modal-container.dark-mode .album-card {
  background: var(--dark-bg-elevated);
  border-color: var(--dark-border);
}

.modal-container.dark-mode .album-header {
  background: var(--dark-bg-card);
}

.modal-container.dark-mode .album-info h4 {
  color: var(--dark-text-primary);
}

.modal-container.dark-mode .empty-state {
  color: var(--dark-text-muted);
}

/* ========== MOBILE RESPONSIVE ========== */
@media (max-width: 1023px) {
  .music-float-button {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
  .music-float-button:hover {
    transform: translateX(-50%) translateY(-3px) scale(1.05);
  }

  /* Thêm active state cho mobile */
  .music-float-button:active {
    transform: translateX(-50%) translateY(-1px) scale(1.02);
  }
}

@media (max-width: 767px) {
  .music-float-button {
    bottom: 12px;
    width: 48px;
    height: 48px;
    font-size: 1.1rem;
  }

  .music-player-container {
    bottom: 70px;
    width: calc(100% - 30px);
    max-width: none;
  }

  .modal-container {
    max-width: calc(100% - 40px);
  }

  .playlist-tabs {
    flex-direction: column;
    gap: 8px;
  }

  .track-item {
    padding: 10px 12px;
  }

  .album-header {
    padding: 14px 16px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .music-float-button {
    bottom: 15px;
    width: 48px;
    height: 48px;
    font-size: 1.1rem;
  }

  .music-player-container {
    bottom: 75px;
    right: 15px;
    width: calc(100% - 30px);
    max-width: 350px;
  }
}

@media (max-width: 480px) {
  .music-float-button {
    width: 46px;
    height: 46px;
    font-size: 1rem;
  }

  .player-header,
  .modal-header {
    padding: 14px 16px;
  }

  .player-title,
  .modal-title {
    font-size: 1rem;
  }

  .player-body,
  .modal-body {
    padding: 16px;
  }

  .current-track-info {
    gap: 12px;
  }

  .track-cover {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }

  .track-title {
    font-size: 0.95rem;
  }

  .track-artist {
    font-size: 0.85rem;
  }

  .player-controls {
    gap: 10px;
  }

  .control-btn {
    width: 38px;
    height: 38px;
    font-size: 0.95rem;
  }

  .play-btn {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }
}
</style>
