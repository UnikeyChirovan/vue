<template>
  <div>
    <n-button type="primary" @click="showModal = true" class="settings-button">
      <span class="button-text">Cài đặt</span>
      <i class="fas fa-cog mobile-icon"></i>
    </n-button>
    <n-modal
      v-model:show="showModal"
      preset="card"
      title="Cài đặt"
      :style="modalStyle"
      class="settings-modal"
    >
      <n-space vertical>
        <n-form-item label="Độ sáng">
          <div class="form-item-content">
            <i class="fa fa-adjust icon-left"></i>
            <n-slider v-model:value="brightness" :min="0" :max="100" />
          </div>
        </n-form-item>

        <div class="settings-row">
          <n-form-item label="Chế độ" class="mode-item">
            <div class="mode-switch">
              <i class="fa fa-sun"></i>
              <n-switch
                v-model:value="mode"
                :checked-value="'night'"
                :unchecked-value="'day'"
              />
              <i class="fa fa-moon"></i>
            </div>
          </n-form-item>

          <n-form-item label="Ánh sáng vàng" class="yellow-light-item">
            <n-switch v-model:value="yellowLightMode">
              <template #checked>Bật</template>
              <template #unchecked>Tắt</template>
            </n-switch>
          </n-form-item>

          <n-form-item label="Phạm vi" class="range-item">
            <div class="switch-toggle switch-3 switch-candy">
              <input
                id="full"
                name="screen-mode"
                type="radio"
                v-model="screenMode"
                value="full"
              />
              <label for="full">Full</label>

              <input
                id="partial"
                name="screen-mode"
                type="radio"
                v-model="screenMode"
                value="partial"
              />
              <label for="partial">Partial</label>

              <input
                id="custom"
                name="screen-mode"
                type="radio"
                v-model="screenMode"
                value="custom"
              />
              <label for="custom">Custom</label>
            </div>
          </n-form-item>
        </div>

        <n-form-item label="Hình nền">
          <n-select
            v-model:value="selectedBackground"
            :options="backgroundOptions"
            @update:value="handleBackgroundSelection"
            :disabled="mode === 'night'"
          />
        </n-form-item>

        <div class="background-settings-row">
          <div class="background-col">
            <n-form-item label="Kiểu nền">
              <n-radio-group
                v-model:value="backgroundStyle"
                :disabled="mode === 'night'"
              >
                <n-radio value="solid">Đơn sắc</n-radio>
                <n-radio value="gradient">Dải màu</n-radio>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="backgroundStyle === 'solid'" label="Màu nền">
              <n-color-picker
                v-model:value="backgroundColor"
                :disabled="mode === 'night'"
              />
            </n-form-item>
            <n-form-item v-if="backgroundStyle === 'gradient'" label="Dải màu">
              <n-select
                v-model:value="selectedGradient"
                :options="gradientOptions"
                :disabled="mode === 'night'"
              />
            </n-form-item>
            <n-form-item
              v-if="backgroundStyle === 'gradient'"
              label="Độ trong suốt"
            >
              <n-slider
                v-model:value="backgroundOpacity"
                :min="0"
                :max="1"
                :step="0.01"
                :disabled="mode === 'night'"
              />
            </n-form-item>
          </div>

          <div class="background-col" v-if="screenMode === 'custom'">
            <n-form-item label="Nền tùy chỉnh">
              <n-radio-group
                v-model:value="customBackgroundStyle"
                :disabled="mode === 'night'"
              >
                <n-radio value="solid">Đơn sắc</n-radio>
                <n-radio value="gradient">Dải màu</n-radio>
              </n-radio-group>
            </n-form-item>
            <n-form-item
              v-if="customBackgroundStyle === 'solid'"
              label="Màu nền"
            >
              <n-color-picker
                v-model:value="customBackgroundColor"
                :disabled="mode === 'night'"
              />
            </n-form-item>
            <n-form-item
              v-if="customBackgroundStyle === 'gradient'"
              label="Dải màu"
            >
              <n-select
                v-model:value="customSelectedGradient"
                :options="customGradientOptions"
                :disabled="mode === 'night'"
              />
            </n-form-item>
            <n-form-item
              v-if="customBackgroundStyle === 'gradient'"
              label="Độ trong suốt"
            >
              <n-slider
                v-model:value="customBackgroundOpacity"
                :min="0"
                :max="1"
                :step="0.01"
                :disabled="mode === 'night'"
              />
            </n-form-item>
          </div>
        </div>

        <!-- AUTO SCROLL SECTION -->
        <div class="autoscroll-section">
          <n-divider>Tự động cuộn</n-divider>

          <n-form-item label="Bật tự động cuộn">
            <n-switch v-model:value="autoScrollEnabled">
              <template #checked>Bật</template>
              <template #unchecked>Tắt</template>
            </n-switch>
          </n-form-item>

          <n-form-item
            label="Khoảng cách cuộn mỗi lần (giây)"
            v-if="autoScrollEnabled"
          >
            <div class="form-item-content">
              <i class="fa fa-clock icon-left"></i>
              <n-slider
                v-model:value="scrollInterval"
                :min="1"
                :max="10"
                :step="1"
                :marks="{
                  1: '1s',
                  3: '3s',
                  5: '5s',
                  10: '10s',
                }"
              />
            </div>
          </n-form-item>

          <n-form-item label="Số pixel cuộn mỗi lần" v-if="autoScrollEnabled">
            <div class="form-item-content">
              <i class="fa fa-arrows-up-down icon-left"></i>
              <n-slider
                v-model:value="scrollAmount"
                :min="100"
                :max="1000"
                :step="50"
                :marks="{
                  100: '100px',
                  300: '300px',
                  500: '500px',
                  1000: '1000px',
                }"
              />
            </div>
          </n-form-item>

          <n-form-item
            label="Thời gian chờ trước khi bắt đầu (giây)"
            v-if="autoScrollEnabled"
          >
            <div class="form-item-content">
              <i class="fa fa-hourglass-start icon-left"></i>
              <n-slider
                v-model:value="scrollDelay"
                :min="3"
                :max="10"
                :step="1"
              />
            </div>
          </n-form-item>

          <n-alert
            v-if="autoScrollEnabled && isScrolling"
            type="info"
            class="scroll-status"
          >
            <template #icon>
              <i class="fa fa-circle-notch fa-spin"></i>
            </template>
            Đang tự động cuộn... Nhấn ESC hoặc cuộn chuột để dừng
          </n-alert>
        </div>

        <n-form-item label="Font chữ">
          <div class="form-item-content">
            <i class="fa fa-font icon-left"></i>
            <n-select v-model:value="fontFamily" :options="fontOptions" />
          </div>
        </n-form-item>

        <n-form-item label="Cỡ chữ">
          <div class="form-item-content">
            <i class="fa fa-text-height icon-left"></i>
            <n-slider v-model:value="fontSize" :min="12" :max="30" />
          </div>
        </n-form-item>

        <n-form-item label="Chiều cao dòng">
          <div class="form-item-content">
            <n-icon size="30" class="icon-left"
              ><AutoFitHeight20Regular
            /></n-icon>
            <n-slider
              v-model:value="lineHeight"
              :min="1"
              :max="2"
              :step="0.1"
            />
          </div>
        </n-form-item>

        <n-button type="primary" @click="applySettings" class="apply-button">
          Áp dụng
        </n-button>
      </n-space>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import {
  NButton,
  NModal,
  NSlider,
  NSwitch,
  NSelect,
  NColorPicker,
  NFormItem,
  NSpace,
  NRadioGroup,
  NRadio,
  NIcon,
  NDivider,
  NAlert,
} from 'naive-ui';
import AutoFitHeight20Regular from '@vicons/fluent/AutoFitHeight20Regular';
import api from '../services/axiosInterceptor';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useRoute, onBeforeRouteLeave } from 'vue-router';

const route = useRoute();
const settingsStore = useSettingsStore();
const userId = useAuthStore().user?.id;
const showModal = ref(false);
const hasSettings = ref(false);
const backgroundStoryId = ref('');
const BaseURL = `http://127.0.0.1:8000`;

// Auto scroll state
const autoScrollEnabled = ref(false);
const scrollInterval = ref(3); // Bao lâu cuộn 1 lần (giây)
const scrollAmount = ref(300); // Mỗi lần cuộn bao nhiêu pixel
const scrollDelay = ref(5); // Thời gian chờ trước khi bắt đầu
const isScrolling = ref(false);
let scrollTimer = null;
let scrollTimeout = null;

const modalStyle = computed(() => ({
  width:
    window.innerWidth <= 480
      ? '95vw'
      : window.innerWidth <= 768
        ? '90vw'
        : '500px',
  maxHeight: window.innerWidth <= 768 ? '85vh' : 'auto',
  overflowY: window.innerWidth <= 768 ? 'auto' : 'visible',
}));

const fontOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
];

const gradientOptions = [
  { label: 'Netflix', value: 'netflix' },
  { label: 'Vine', value: 'vine' },
  { label: 'Megatron', value: 'megatron' },
];

const customGradientOptions = [
  { label: 'Netflix', value: 'netflix' },
  { label: 'Vine', value: 'vine' },
  { label: 'Megatron', value: 'megatron' },
];

const backgroundOptions = ref([{ label: 'Không có', value: 'none' }]);

const createComputedProperty = (key) =>
  computed({
    get: () => settingsStore[key],
    set: (val) => settingsStore.updateSetting(key, val),
  });

const brightness = createComputedProperty('brightness');
const mode = createComputedProperty('mode');
const yellowLightMode = createComputedProperty('yellowLightMode');
const screenMode = createComputedProperty('screenMode');
const fontFamily = createComputedProperty('fontFamily');
const fontSize = createComputedProperty('fontSize');
const lineHeight = createComputedProperty('lineHeight');
const backgroundColor = createComputedProperty('backgroundColor');
const customBackgroundColor = createComputedProperty('customBackgroundColor');
const backgroundStyle = createComputedProperty('backgroundStyle');
const customBackgroundStyle = createComputedProperty('customBackgroundStyle');
const customSelectedGradient = createComputedProperty('customSelectedGradient');
const customBackgroundOpacity = createComputedProperty(
  'customBackgroundOpacity'
);
const selectedGradient = createComputedProperty('selectedGradient');
const backgroundImage = createComputedProperty('backgroundImage');
const backgroundOpacity = createComputedProperty('backgroundOpacity');
const selectedBackground = createComputedProperty('selectedBackground');

let initialSettings = {};

const saveInitialSettings = () => {
  initialSettings = {
    backgroundStoryId: backgroundStoryId.value,
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    lineHeight: lineHeight.value,
  };
};

const hasSettingsChanged = () => {
  return (
    backgroundStoryId.value !== initialSettings.backgroundStoryId ||
    fontFamily.value !== initialSettings.fontFamily ||
    fontSize.value !== initialSettings.fontSize ||
    lineHeight.value !== initialSettings.lineHeight
  );
};

// Auto scroll functions
const startAutoScroll = () => {
  if (!autoScrollEnabled.value || isScrolling.value) return;

  // Clear any existing timers
  stopAutoScroll();

  // Wait for delay before starting
  scrollTimeout = setTimeout(() => {
    isScrolling.value = true;

    const performScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;

      // Check if reached bottom
      if (currentScroll + windowHeight >= scrollHeight - 10) {
        stopAutoScroll();
        return;
      }

      // Smooth scroll by amount
      window.scrollBy({
        top: scrollAmount.value,
        behavior: 'smooth',
      });

      // Schedule next scroll
      if (autoScrollEnabled.value && isScrolling.value) {
        scrollTimer = setTimeout(performScroll, scrollInterval.value * 1000);
      }
    };

    // Start first scroll
    performScroll();
  }, scrollDelay.value * 1000);
};

const stopAutoScroll = () => {
  if (scrollTimer) {
    clearTimeout(scrollTimer);
    scrollTimer = null;
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
  }
  isScrolling.value = false;
};

// Event listeners to stop scrolling
const handleUserInteraction = () => {
  if (isScrolling.value) {
    stopAutoScroll();
  }
};

const handleKeyPress = (e) => {
  if (e.key === 'Escape' && isScrolling.value) {
    stopAutoScroll();
  }
};

const saveSettings = async () => {
  if (!hasSettingsChanged()) return;

  const settingsData = {
    background_story_id: backgroundStoryId.value,
    font_family: fontFamily.value,
    font_size: fontSize.value,
    line_height: lineHeight.value,
  };
  try {
    if (hasSettings.value) {
      await api.put('/story/settings', settingsData);
    } else {
      await api.post('/story/save-settings', settingsData);
    }
    saveInitialSettings();
    fetchUserSettings(userId);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

const applySettings = () => {
  const settings = {
    brightness: settingsStore.brightness,
    mode: settingsStore.mode,
    yellowLightMode: settingsStore.yellowLightMode,
    fontFamily: settingsStore.fontFamily,
    fontSize: settingsStore.fontSize,
    backgroundImage: settingsStore.backgroundImage,
    backgroundColor: settingsStore.backgroundColor,
    lineHeight: settingsStore.lineHeight,
    backgroundStyle: settingsStore.backgroundStyle,
    selectedGradient: settingsStore.selectedGradient,
    customBackgroundStyle: settingsStore.customBackgroundStyle,
    customBackgroundColor: settingsStore.customBackgroundColor,
    customSelectedGradient: settingsStore.customSelectedGradient,
    backgroundOpacity: settingsStore.backgroundOpacity,
    customBackgroundOpacity: settingsStore.customBackgroundOpacity,
    selectedBackground: settingsStore.selectedBackground,
  };

  const contentContainer = document.querySelector('.chapter-content');
  const storyContainer = document.querySelector('.container');
  const backgroundImageContainer = document.querySelector(
    '.background-image-container'
  );
  const parentComponent = document.querySelector('body');
  const readingWrapper = document.querySelector('.reading-wrapper');

  const reset = () => {
    if (backgroundImageContainer)
      backgroundImageContainer.style.backgroundImage = 'none';
    if (parentComponent) {
      parentComponent.style.backgroundColor = '';
      parentComponent.style.backgroundImage = '';
      parentComponent.style.filter = '';
    }
    if (storyContainer) {
      storyContainer.style.backgroundColor = '';
      storyContainer.style.backgroundImage = '';
    }
    if (readingWrapper) {
      readingWrapper.style.backgroundImage = '';
      readingWrapper.style.backgroundColor = '';
    }
  };

  if (route.path === '/stories') {
    if (settings.selectedBackground === 'none' || !settings.backgroundImage) {
      reset();
      if (storyContainer) {
        storyContainer.style.backgroundColor =
          settings.mode === 'night' ? '#2c2c2c' : 'rgba(255, 255, 255, 0.98)';
      }
      if (readingWrapper) {
        readingWrapper.style.background =
          settings.mode === 'night'
            ? '#2c2c2c'
            : 'linear-gradient(180deg, rgba(250, 250, 250, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)';
      }
    } else {
      switch (screenMode.value) {
        case 'full':
          reset();
          if (backgroundImageContainer) {
            backgroundImageContainer.style.width = '100%';
            backgroundImageContainer.style.backgroundImage =
              settings.mode === 'night'
                ? 'none'
                : `url(${settings.backgroundImage})`;
          }

          if (readingWrapper) {
            if (settings.mode === 'night') {
              readingWrapper.style.background = '#2c2c2c';
            } else {
              readingWrapper.style.background = 'transparent';
            }
          }

          if (storyContainer) {
            if (settings.mode === 'night') {
              storyContainer.style.backgroundColor = '#2c2c2c';
            } else {
              if (settings.backgroundStyle === 'solid') {
                storyContainer.style.backgroundColor = settings.backgroundColor;
              } else if (settings.backgroundStyle === 'gradient') {
                storyContainer.style.backgroundColor = 'transparent';
                storyContainer.style.backgroundImage = getGradient(
                  settings.selectedGradient,
                  settings.backgroundOpacity
                );
              }
            }
          }
          break;

        case 'partial':
          reset();
          if (backgroundImageContainer) {
            backgroundImageContainer.style.width = '66.6667%';
            backgroundImageContainer.style.backgroundImage =
              settings.mode === 'night'
                ? 'none'
                : `url(${settings.backgroundImage})`;
          }

          if (readingWrapper) {
            readingWrapper.style.background =
              settings.mode === 'night' ? '#2c2c2c' : 'transparent';
          }

          if (storyContainer) {
            if (settings.mode === 'night') {
              storyContainer.style.backgroundColor = '#2c2c2c';
            } else {
              if (settings.backgroundStyle === 'solid') {
                storyContainer.style.backgroundColor = settings.backgroundColor;
              } else if (settings.backgroundStyle === 'gradient') {
                storyContainer.style.backgroundColor = 'transparent';
                storyContainer.style.backgroundImage = getGradient(
                  settings.selectedGradient,
                  settings.backgroundOpacity
                );
              }
            }
          }
          break;

        case 'custom':
          reset();
          if (backgroundImageContainer) {
            backgroundImageContainer.style.width = '66.6667%';
            backgroundImageContainer.style.backgroundImage =
              settings.mode === 'night'
                ? 'none'
                : `url(${settings.backgroundImage})`;
          }

          if (readingWrapper) {
            if (settings.mode === 'night') {
              readingWrapper.style.background = '#2c2c2c';
            } else {
              if (settings.customBackgroundStyle === 'solid') {
                readingWrapper.style.backgroundColor =
                  settings.customBackgroundColor;
                readingWrapper.style.backgroundImage = 'none';
              } else if (settings.customBackgroundStyle === 'gradient') {
                readingWrapper.style.backgroundColor = 'transparent';
                readingWrapper.style.backgroundImage = getGradient(
                  settings.customSelectedGradient,
                  settings.customBackgroundOpacity
                );
              }
            }
          }

          if (storyContainer) {
            if (settings.mode === 'night') {
              storyContainer.style.backgroundColor = '#2c2c2c';
            } else {
              if (settings.backgroundStyle === 'solid') {
                storyContainer.style.backgroundColor = settings.backgroundColor;
                storyContainer.style.backgroundImage = 'none';
              } else if (settings.backgroundStyle === 'gradient') {
                storyContainer.style.backgroundColor = 'transparent';
                storyContainer.style.backgroundImage = getGradient(
                  settings.selectedGradient,
                  settings.backgroundOpacity
                );
              }
            }
          }
          break;
      }
    }
  }

  if (contentContainer) {
    contentContainer.style.fontFamily = settings.fontFamily;
    contentContainer.style.fontSize = `${settings.fontSize}px`;
    contentContainer.style.lineHeight = settings.lineHeight;
  }

  if (storyContainer) {
    storyContainer.style.filter = settings.yellowLightMode
      ? 'sepia(70%) brightness(100%)'
      : `brightness(${settings.brightness}%)`;
  }

  if (parentComponent) {
    parentComponent.style.color =
      settings.mode === 'night' ? '#ffffff' : '#000000';
  }

  saveSettings();

  // Handle autoscroll based on state
  if (autoScrollEnabled.value && !isScrolling.value) {
    // Only start if enabled and not already scrolling
    startAutoScroll();
  } else if (!autoScrollEnabled.value) {
    // Only stop if disabled
    stopAutoScroll();
  }
  // If enabled and already scrolling, don't interrupt

  showModal.value = false;
};

const getGradient = (gradientName, opacity) => {
  const gradientOpacity = `rgba(255, 255, 255, ${opacity})`;
  switch (gradientName) {
    case 'netflix':
      return `linear-gradient(to left, ${gradientOpacity}, rgba(142, 14, 0, ${opacity}))`;
    case 'vine':
      return `linear-gradient(to left, ${gradientOpacity}, rgba(0, 191, 143, ${opacity}))`;
    case 'megatron':
      return `linear-gradient(to left, ${gradientOpacity}, rgba(251, 215, 134, ${opacity}), rgba(198, 255, 221, ${opacity}))`;
    default:
      return 'none';
  }
};

const fetchBackgrounds = async () => {
  try {
    const response = await api.get('/story/backgrounds');
    const backgrounds = response.data.map((background) => ({
      label: background.background_image_name,
      value: background.background_image_path,
      backgroundStoryId: background.id,
    }));
    backgroundOptions.value = [
      { label: 'Không có', value: 'none' },
      ...backgrounds,
    ];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hình nền:', error);
  }
};

const handleBackgroundSelection = (selectedValue) => {
  if (selectedValue === 'none') {
    backgroundStoryId.value = '';
    selectedBackground.value = 'none';
    backgroundImage.value = '';
    return;
  }

  const selected = backgroundOptions.value.find(
    (option) => option.value === selectedValue
  );
  if (selected) {
    backgroundStoryId.value = selected.backgroundStoryId;
    selectedBackground.value = selected.value;
    backgroundImage.value = `${BaseURL}/storage/${selected.value}`;
  }
};

const fetchUserSettings = async (userId) => {
  try {
    const response = await api.get(`/story/${userId}/settings`);
    const settings = response.data.settings;
    fontFamily.value = settings.font_family;
    fontSize.value = settings.font_size;
    lineHeight.value = settings.line_height;

    if (settings.background_story?.background_image_path) {
      selectedBackground.value =
        settings.background_story.background_image_path;
      backgroundImage.value = `${BaseURL}/storage/${settings.background_story.background_image_path}`;
    } else {
      selectedBackground.value = 'none';
      backgroundImage.value = '';
    }

    hasSettings.value = true;
    settingsStore.saveSettings();
  } catch (error) {
    console.error('Lỗi khi lấy cài đặt người dùng:', error);
  }
};

const resetSettings = () => {
  const parentComponent = document.querySelector('body');
  const readingWrapper = document.querySelector('.reading-wrapper');
  const backgroundImageContainer = document.querySelector(
    '.background-image-container'
  );

  if (parentComponent) {
    parentComponent.style.backgroundColor = '';
    parentComponent.style.backgroundImage = '';
    parentComponent.style.color = '';
    parentComponent.style.filter = '';
  }
  if (readingWrapper) {
    readingWrapper.style.backgroundColor = '';
    readingWrapper.style.backgroundImage = '';
  }
  if (backgroundImageContainer) {
    backgroundImageContainer.style.backgroundImage = 'none';
  }
};

// Watch for autoscroll toggle changes
watch(autoScrollEnabled, (enabled) => {
  if (enabled && !isScrolling.value) {
    startAutoScroll();
  } else if (!enabled) {
    stopAutoScroll();
  }
});

onBeforeRouteLeave((to, from) => {
  if (from.path === '/stories') {
    resetSettings();
    stopAutoScroll();
  }
});

onMounted(async () => {
  const savedSettings = sessionStorage.getItem('user-settings');
  if (savedSettings) {
    settingsStore.loadSettings();
  } else {
    await fetchUserSettings(userId);
    settingsStore.saveSettings();
  }
  saveInitialSettings();
  applySettings();
  await fetchBackgrounds();

  // Add event listeners for user interaction
  window.addEventListener('wheel', handleUserInteraction, { passive: true });
  window.addEventListener('touchmove', handleUserInteraction, {
    passive: true,
  });
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  stopAutoScroll();
  window.removeEventListener('wheel', handleUserInteraction);
  window.removeEventListener('touchmove', handleUserInteraction);
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.settings-button {
  position: fixed;
  top: 80px;
  right: 80px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  min-width: 110px;
  padding: 10px 20px;
}

.settings-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.button-text {
  display: inline;
}

.mobile-icon {
  display: none;
}

.form-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.icon-left {
  flex-shrink: 0;
}

.settings-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-start;
}

.mode-item,
.yellow-light-item,
.range-item {
  flex: 1;
  min-width: 120px;
}

.mode-switch {
  display: flex;
  align-items: center;
  gap: 10px;
}

.background-settings-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.background-col {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.switch-toggle {
  display: inline-flex;
  background: #242729;
  border-radius: 6px;
  overflow: hidden;
}

.switch-toggle input {
  position: absolute;
  opacity: 0;
}

.switch-toggle input + label {
  padding: 7px 12px;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 0.9rem;
}

.switch-toggle input:checked + label {
  background: #0c713d;
}

.autoscroll-section {
  margin: 20px 0;
  padding: 15px;
  background: rgba(12, 113, 61, 0.05);
  border-radius: 8px;
}

.scroll-status {
  margin-top: 15px;
}

.apply-button {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  font-weight: 600;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .settings-button {
    top: 80px;
    right: 60px;
    min-width: 100px;
    padding: 9px 18px;
  }

  .background-settings-row {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .settings-button {
    top: auto;
    bottom: 100px;
    right: 15px;
    min-width: 48px;
    width: 48px;
    height: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .button-text {
    display: none;
  }

  .mobile-icon {
    display: inline;
    font-size: 1.2rem;
  }

  .settings-row {
    flex-direction: column;
    gap: 12px;
  }

  .mode-item,
  .yellow-light-item,
  .range-item {
    width: 100%;
    min-width: auto;
  }

  .background-settings-row {
    gap: 15px;
  }

  .switch-toggle input + label {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  :deep(.n-form-item-label) {
    font-size: 0.9rem;
  }

  :deep(.n-space) {
    gap: 12px !important;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .settings-button {
    bottom: 95px;
    right: 12px;
    width: 48px;
    height: 48px;
  }

  .mobile-icon {
    font-size: 1.15rem;
  }

  .form-item-content {
    gap: 8px;
  }

  .settings-row {
    gap: 10px;
  }

  .background-settings-row {
    gap: 12px;
  }

  .switch-toggle input + label {
    padding: 5px 8px;
    font-size: 0.8rem;
  }

  .apply-button {
    padding: 10px;
    font-size: 0.9rem;
  }

  :deep(.n-form-item-label) {
    font-size: 0.85rem;
  }

  :deep(.n-slider) {
    margin: 0 8px;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .settings-button {
    bottom: 90px;
    right: 10px;
    width: 45px;
    height: 45px;
  }

  .mobile-icon {
    font-size: 1.1rem;
  }

  .switch-toggle input + label {
    padding: 4px 6px;
    font-size: 0.75rem;
  }

  :deep(.n-form-item-label) {
    font-size: 0.8rem;
  }
}
</style>
