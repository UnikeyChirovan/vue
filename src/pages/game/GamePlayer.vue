<template>
  <div class="game-player-container">
    <!-- Game Header -->
    <div class="game-header">
      <div class="game-info">
        <button class="btn-back" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          Quay lại Hub
        </button>
        <h2 class="game-name">{{ gameName }}</h2>
      </div>
      <div class="game-controls">
        <button
          class="btn-control"
          @click="toggleFullscreen"
          title="Toàn màn hình"
        >
          <i class="fas fa-expand"></i>
        </button>
        <button class="btn-control" @click="toggleSound" title="Âm thanh">
          <i
            :class="soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute'"
          ></i>
        </button>
        <button
          class="btn-control"
          @click="showSettings = true"
          title="Cài đặt"
        >
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </div>

    <!-- Game Loading Screen -->
    <div v-if="isLoading" class="game-loading">
      <div class="loading-spinner"></div>
      <p>Đang tải game...</p>
      <div class="loading-bar">
        <div
          class="loading-progress"
          :style="{ width: loadingProgress + '%' }"
        ></div>
      </div>
      <p class="loading-percentage">{{ loadingProgress }}%</p>
    </div>

    <!-- Game iFrame Container -->
    <div v-show="!isLoading" class="game-frame-wrapper">
      <iframe
        ref="gameFrame"
        :src="gameUrl"
        class="game-iframe"
        frameborder="0"
        allowfullscreen
        @load="onGameLoaded"
      ></iframe>
    </div>

    <!-- Settings Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showSettings"
        class="settings-modal-overlay"
        @click="showSettings = false"
      >
        <div class="settings-modal" @click.stop>
          <div class="modal-header">
            <h3>
              <i class="fas fa-cog"></i>
              Cài Đặt Game
            </h3>
            <button class="btn-close" @click="showSettings = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="setting-item">
              <label>
                <i class="fas fa-volume-up"></i>
                Âm lượng
              </label>
              <input
                v-model="volume"
                type="range"
                min="0"
                max="100"
                class="volume-slider"
              />
              <span>{{ volume }}%</span>
            </div>
            <div class="setting-item">
              <label>
                <i class="fas fa-tachometer-alt"></i>
                Chất lượng đồ họa
              </label>
              <select v-model="graphicsQuality" class="quality-select">
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
                <option value="ultra">Siêu cao</option>
              </select>
            </div>
            <div class="setting-item">
              <label>
                <i class="fas fa-language"></i>
                Ngôn ngữ
              </label>
              <select v-model="language" class="language-select">
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </div>
            <div class="setting-item checkbox">
              <label>
                <input v-model="autoSave" type="checkbox" />
                <i class="fas fa-save"></i>
                Tự động lưu
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-save" @click="saveSettings">
              <i class="fas fa-check"></i>
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const gameFrame = ref(null);
const isLoading = ref(true);
const loadingProgress = ref(0);
const showSettings = ref(false);
const soundEnabled = ref(true);
const volume = ref(80);
const graphicsQuality = ref('high');
const language = ref('vi');
const autoSave = ref(true);

// Game type từ route params
const gameType = computed(() => route.params.type || 'spirit-legends');

// Chỉ có 1 game duy nhất
const gameName = computed(() => 'Spirit Legends');

// Game URL - CHỈ CÓ 1 GAME
const gameUrl = computed(() => {
  // URL đến Unity WebGL build của game duy nhất
  return '/unity-build/spirit-legends/index.html';
});

// Simulate loading progress
const simulateLoading = () => {
  const interval = setInterval(() => {
    loadingProgress.value += 10;
    if (loadingProgress.value >= 90) {
      clearInterval(interval);
    }
  }, 200);
};

const onGameLoaded = () => {
  loadingProgress.value = 100;
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

const goBack = () => {
  if (confirm('Bạn có chắc muốn thoát game? Tiến độ chưa lưu sẽ mất.')) {
    router.push({ name: 'game-hub' });
  }
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
  // Send message to game iframe
  sendMessageToGame({ type: 'TOGGLE_SOUND', enabled: soundEnabled.value });
};

const saveSettings = () => {
  // Send settings to game iframe
  sendMessageToGame({
    type: 'UPDATE_SETTINGS',
    settings: {
      volume: volume.value,
      quality: graphicsQuality.value,
      language: language.value,
      autoSave: autoSave.value,
    },
  });

  // Save to localStorage
  localStorage.setItem(
    'gameSettings',
    JSON.stringify({
      volume: volume.value,
      quality: graphicsQuality.value,
      language: language.value,
      autoSave: autoSave.value,
    })
  );

  showSettings.value = false;
};

// Communication với Unity/Game Engine
const sendMessageToGame = (message) => {
  if (gameFrame.value?.contentWindow) {
    gameFrame.value.contentWindow.postMessage(message, '*');
  }
};

// Listen for messages from game
const handleGameMessage = (event) => {
  // Verify origin for security
  // if (event.origin !== window.location.origin) return;

  const { type, data } = event.data || {};

  switch (type) {
    case 'GAME_READY':
      console.log('Game is ready');
      break;
    case 'SAVE_DATA':
      console.log('Saving game data:', data);
      // TODO: Save to backend API
      break;
    case 'LOAD_DATA':
      console.log('Loading game data');
      // TODO: Load from backend API
      break;
    case 'ACHIEVEMENT_UNLOCKED':
      console.log('Achievement unlocked:', data);
      break;
  }
};

onMounted(() => {
  simulateLoading();
  window.addEventListener('message', handleGameMessage);

  // Load saved settings
  const savedSettings = localStorage.getItem('gameSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    volume.value = settings.volume || 80;
    graphicsQuality.value = settings.quality || 'high';
    language.value = settings.language || 'vi';
    autoSave.value = settings.autoSave !== undefined ? settings.autoSave : true;
  }
});

onUnmounted(() => {
  window.removeEventListener('message', handleGameMessage);
});
</script>

<style scoped>
.game-player-container {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

/* ===== GAME HEADER ===== */
.game-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

html.dark-mode .game-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
}

.game-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-back {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-4px);
}

.game-name {
  color: white;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.game-controls {
  display: flex;
  gap: 0.5rem;
}

.btn-control {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.btn-control:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* ===== GAME LOADING ===== */
.game-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 2rem;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #0c713d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

html.dark-mode .loading-spinner {
  border-top-color: #4ade80;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-bar {
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #0c713d 0%, #4ade80 100%);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.loading-percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c713d;
}

html.dark-mode .loading-percentage {
  color: #4ade80;
}

/* ===== GAME IFRAME ===== */
.game-frame-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* ===== SETTINGS MODAL ===== */
.settings-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.settings-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

html.dark-mode .settings-modal {
  background: #2a2a2a;
}

.modal-header {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

html.dark-mode .modal-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
}

.modal-header h3 {
  color: white;
  margin: 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-close {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item.checkbox {
  flex-direction: row;
  align-items: center;
}

.setting-item label {
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

html.dark-mode .setting-item label {
  color: #e5e5e5;
}

.volume-slider,
.quality-select,
.language-select {
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

html.dark-mode .volume-slider,
html.dark-mode .quality-select,
html.dark-mode .language-select {
  background: #1a1a1a;
  border-color: #404040;
  color: #e5e5e5;
}

.volume-slider {
  cursor: pointer;
}

.modal-footer {
  padding: 1.5rem;
  background: #f8f9fa;
  display: flex;
  justify-content: flex-end;
}

html.dark-mode .modal-footer {
  background: #1a1a1a;
}

.btn-save {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

html.dark-mode .btn-save {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #0d0d0d;
}

.btn-save:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.4);
}

html.dark-mode .btn-save:hover {
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
}

/* ===== MODAL TRANSITIONS ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .game-header {
    padding: 0.75rem 1rem;
  }

  .game-name {
    font-size: 1rem;
    display: none;
  }

  .btn-back {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn-control {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .settings-modal {
    width: 95%;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .loading-bar {
    width: 250px;
  }
}
</style>
