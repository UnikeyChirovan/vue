<template>
  <div>
    <n-button
      type="primary"
      @click="showModal = true"
      class="settings-button"
      :class="{ 'dark-mode': themeStore.isDarkMode }"
    >
      <span class="button-text">Cài đặt</span>
      <i class="fas fa-cog mobile-icon"></i>
    </n-button>
    <n-modal
      v-model:show="showModal"
      preset="card"
      title="Cài đặt"
      :style="modalStyle"
      class="settings-modal"
      :class="{ 'dark-mode': themeStore.isDarkMode }"
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
import { useThemeStore } from '../stores/themeStore';
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
const themeStore = useThemeStore();
const userId = useAuthStore().user?.id;
const showModal = ref(false);
const hasSettings = ref(false);
const backgroundStoryId = ref('');
const BaseURL = `http://127.0.0.1:8000`;

// Auto scroll state
const autoScrollEnabled = ref(false);
const scrollInterval = ref(3);
const scrollAmount = ref(300);
const scrollDelay = ref(5);
const isScrolling = ref(false);
let scrollTimer = null;
let scrollTimeout = null;

const modalStyle = computed(() => {
  const width = window.innerWidth;

  if (width <= 480) {
    return {
      width: '95vw',
      maxWidth: '95vw',
      maxHeight: '90vh',
      overflowY: 'auto',
    };
  } else if (width <= 768) {
    return {
      width: '90vw',
      maxWidth: '90vw',
      maxHeight: '85vh',
      overflowY: 'auto',
    };
  } else if (width <= 1024) {
    return {
      width: '80vw',
      maxWidth: '900px',
      maxHeight: '90vh',
      overflowY: 'auto',
    };
  } else if (width <= 1440) {
    return {
      width: '70vw',
      maxWidth: '1000px',
      maxHeight: '90vh',
      overflowY: 'auto',
    };
  } else {
    return {
      width: '60vw',
      maxWidth: '1200px',
      maxHeight: '90vh',
      overflowY: 'auto',
    };
  }
});

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

const backgroundOptions = ref([{ label: 'Mặc Định', value: 'none' }]);

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
    brightness: brightness.value,
    mode: mode.value,
    yellowLightMode: yellowLightMode.value,
    screenMode: screenMode.value,
    backgroundStyle: backgroundStyle.value,
    backgroundColor: backgroundColor.value,
    selectedGradient: selectedGradient.value,
    backgroundOpacity: backgroundOpacity.value,
    customBackgroundStyle: customBackgroundStyle.value,
    customBackgroundColor: customBackgroundColor.value,
    customSelectedGradient: customSelectedGradient.value,
    customBackgroundOpacity: customBackgroundOpacity.value,
  };
};

const hasSettingsChanged = () => {
  return (
    backgroundStoryId.value !== initialSettings.backgroundStoryId ||
    fontFamily.value !== initialSettings.fontFamily ||
    fontSize.value !== initialSettings.fontSize ||
    lineHeight.value !== initialSettings.lineHeight ||
    brightness.value !== initialSettings.brightness ||
    mode.value !== initialSettings.mode ||
    yellowLightMode.value !== initialSettings.yellowLightMode ||
    screenMode.value !== initialSettings.screenMode ||
    backgroundStyle.value !== initialSettings.backgroundStyle ||
    backgroundColor.value !== initialSettings.backgroundColor ||
    selectedGradient.value !== initialSettings.selectedGradient ||
    backgroundOpacity.value !== initialSettings.backgroundOpacity ||
    customBackgroundStyle.value !== initialSettings.customBackgroundStyle ||
    customBackgroundColor.value !== initialSettings.customBackgroundColor ||
    customSelectedGradient.value !== initialSettings.customSelectedGradient ||
    customBackgroundOpacity.value !== initialSettings.customBackgroundOpacity
  );
};

const startAutoScroll = () => {
  if (!autoScrollEnabled.value || isScrolling.value) return;

  stopAutoScroll();

  scrollTimeout = setTimeout(() => {
    isScrolling.value = true;

    const performScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;

      if (currentScroll + windowHeight >= scrollHeight - 10) {
        stopAutoScroll();
        return;
      }

      window.scrollBy({
        top: scrollAmount.value,
        behavior: 'smooth',
      });

      if (autoScrollEnabled.value && isScrolling.value) {
        scrollTimer = setTimeout(performScroll, scrollInterval.value * 1000);
      }
    };

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

const getBackgroundModeForBackend = () => {
  if (!backgroundStoryId.value || selectedBackground.value === 'none') {
    return 'none';
  }

  if (
    !backgroundImage.value ||
    selectedBackground.value === null ||
    selectedBackground.value === 'null'
  ) {
    return 'no-image';
  }

  return 'with-image';
};

const saveSettings = async () => {
  if (!hasSettingsChanged()) return;

  const settingsData = {
    background_story_id: backgroundStoryId.value || null,
    background_mode: getBackgroundModeForBackend(),
    screen_mode: screenMode.value,
    font_family: fontFamily.value,
    font_size: fontSize.value,
    line_height: lineHeight.value,
    brightness: brightness.value,
    mode: mode.value,
    yellow_light_mode: yellowLightMode.value,
    background_style: backgroundStyle.value,
    background_color: backgroundColor.value,
    selected_gradient: selectedGradient.value || null,
    background_opacity: backgroundOpacity.value,
    custom_background_style: customBackgroundStyle.value,
    custom_background_color: customBackgroundColor.value,
    custom_selected_gradient: customSelectedGradient.value || null,
    custom_background_opacity: customBackgroundOpacity.value,
  };

  try {
    if (hasSettings.value) {
      await api.put('/story/settings', settingsData);
    } else {
      await api.post('/story/save-settings', settingsData);
    }
    saveInitialSettings();
    await fetchUserSettings(userId);
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
  const customBackgroundLayer = document.querySelector(
    '.custom-background-layer'
  );
  const customSolidLayer = document.querySelector('.custom-solid-layer');

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
    if (customBackgroundLayer) {
      customBackgroundLayer.style.backgroundColor = '';
      customBackgroundLayer.style.backgroundImage = '';
      customBackgroundLayer.style.opacity = '0';
    }
    if (customSolidLayer) {
      customSolidLayer.style.backgroundColor = '';
      customSolidLayer.style.opacity = '0';
    }
  };

  if (route.path === '/stories') {
    if (settings.selectedBackground === 'none') {
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
    } else if (!settings.backgroundImage) {
      reset();

      if (settings.mode === 'night') {
        if (storyContainer) {
          storyContainer.style.backgroundColor = '#2c2c2c';
        }
        if (readingWrapper) {
          readingWrapper.style.background = '#2c2c2c';
        }
      } else {
        if (storyContainer) {
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

        if (readingWrapper) {
          if (screenMode.value === 'custom') {
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
          if (customSolidLayer) {
            if (settings.mode === 'night') {
              customSolidLayer.style.opacity = '0';
            } else {
              customSolidLayer.style.opacity = '1';
              customSolidLayer.style.backgroundColor = '#ffffff';
            }
          } else {
            readingWrapper.style.background = 'transparent';
          }
        }
        if (customSolidLayer) {
          if (settings.mode === 'night') {
            customSolidLayer.style.opacity = '0';
          } else {
            customSolidLayer.style.opacity = '1';
            customSolidLayer.style.backgroundColor = '#ffffff';
          }
        }
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

        case 'custom':
          reset();

          if (backgroundImageContainer) {
            backgroundImageContainer.style.width = '66.6667%';
            backgroundImageContainer.style.backgroundImage = 'none';
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

          if (customBackgroundLayer) {
            if (settings.mode === 'night') {
              customBackgroundLayer.style.opacity = '0';
            } else {
              customBackgroundLayer.style.opacity = '0.2';
              customBackgroundLayer.style.backgroundColor = '#ffffff';
              customBackgroundLayer.style.backgroundImage = `url(${settings.backgroundImage})`;
              customBackgroundLayer.style.backgroundSize = 'cover';
              customBackgroundLayer.style.backgroundPosition = 'center center';
              customBackgroundLayer.style.backgroundRepeat = 'no-repeat';
            }
          }

          if (customSolidLayer) {
            if (settings.mode === 'night') {
              customSolidLayer.style.opacity = '0';
            } else {
              customSolidLayer.style.opacity = '1';
              customSolidLayer.style.backgroundColor = '#ffffff';
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

  if (autoScrollEnabled.value && !isScrolling.value) {
    startAutoScroll();
  } else if (!autoScrollEnabled.value) {
    stopAutoScroll();
  }

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
      { label: 'Mặc Định', value: 'none' },
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

    if (selected.value === null || selected.value === 'null') {
      backgroundImage.value = '';
    } else {
      backgroundImage.value = `${BaseURL}/storage/${selected.value}`;
    }
  }
};

const fetchUserSettings = async (userId) => {
  try {
    const response = await api.get(`/story/${userId}/settings`);
    const settings = response.data.settings;

    fontFamily.value = settings.font_family;
    fontSize.value = settings.font_size;
    lineHeight.value = settings.line_height;
    brightness.value = settings.brightness ?? 100;
    mode.value = settings.mode ?? 'day';
    yellowLightMode.value = settings.yellow_light_mode ?? false;
    backgroundStyle.value = settings.background_style ?? 'solid';
    backgroundColor.value = settings.background_color ?? '#ffffff';
    selectedGradient.value = settings.selected_gradient ?? '';
    backgroundOpacity.value = settings.background_opacity ?? 1;
    customBackgroundStyle.value = settings.custom_background_style ?? 'solid';
    customBackgroundColor.value = settings.custom_background_color ?? '#ffffff';
    customSelectedGradient.value = settings.custom_selected_gradient ?? '';
    customBackgroundOpacity.value = settings.custom_background_opacity ?? 1;
    screenMode.value = settings.screen_mode ?? 'full';

    if (settings.background_story_id) {
      backgroundStoryId.value = settings.background_story_id;

      if (settings.background_story?.background_image_path) {
        selectedBackground.value =
          settings.background_story.background_image_path;
        backgroundImage.value = `${BaseURL}/storage/${settings.background_story.background_image_path}`;
      } else {
        const matchingOption = backgroundOptions.value.find(
          (option) => option.backgroundStoryId === settings.background_story_id
        );

        if (matchingOption) {
          selectedBackground.value = matchingOption.value;
        } else {
          selectedBackground.value = `Không Hình Nền`;
        }
        backgroundImage.value = '';
      }
    } else {
      backgroundStoryId.value = '';
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
  await fetchUserSettings(userId);
  saveInitialSettings();
  await fetchBackgrounds();
  applySettings();

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
/* ========== SETTINGS BUTTON ========== */
.settings-button {
  position: fixed;
  top: 95px;
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

/* ========== MODAL CONTENT ========== */
.settings-modal :deep(.n-card) {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.settings-modal :deep(.n-card__content) {
  padding: 25px 30px;
}

.settings-modal :deep(.n-card-header) {
  padding: 20px 30px;
  font-size: 1.5rem;
  font-weight: 700;
  border-bottom: 2px solid #f0f0f0;
}

/* ========== FORM ITEMS ========== */
.form-item-content {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.icon-left {
  flex-shrink: 0;
  color: #0c713d;
  font-size: 1.2rem;
}

:deep(.n-form-item) {
  margin-bottom: 20px;
}

:deep(.n-form-item-label) {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
}

:deep(.n-slider) {
  flex: 1;
}

/* ========== SETTINGS ROW ========== */
.settings-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: flex-start;
  margin: 20px 0;
}

.mode-item,
.yellow-light-item,
.range-item {
  width: 100%;
}

.mode-switch {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mode-switch i {
  font-size: 1.1rem;
  color: #0c713d;
}

/* ========== BACKGROUND SETTINGS ========== */
.background-settings-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin: 25px 0;
}

.background-col {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

/* ========== SWITCH TOGGLE ========== */
.switch-toggle {
  display: inline-flex;
  background: #242729;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.switch-toggle input {
  position: absolute;
  opacity: 0;
}

.switch-toggle input + label {
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  user-select: none;
}

.switch-toggle input:checked + label {
  background: #0c713d;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-toggle input + label:hover {
  background: rgba(12, 113, 61, 0.7);
}

.switch-toggle input:checked + label:hover {
  background: #0a5a31;
}

/* ========== AUTOSCROLL SECTION ========== */
.autoscroll-section {
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.05) 0%,
    rgba(12, 113, 61, 0.02) 100%
  );
  border-radius: 12px;
  border: 2px solid rgba(12, 113, 61, 0.1);
}

.autoscroll-section :deep(.n-divider) {
  margin: 0 0 20px 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: #0c713d;
}

.scroll-status {
  margin-top: 20px;
  border-radius: 8px;
}

.scroll-status i {
  font-size: 1.2rem;
}

/* ========== APPLY BUTTON ========== */
.apply-button {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
  transition: all 0.3s ease;
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.4);
}

/* ========== DARK MODE STYLES ========== */

/* Settings Button Dark Mode */
.dark-mode .settings-button {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  ) !important;
  color: var(--dark-text-primary) !important;
  border: 1px solid var(--dark-border) !important;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.4) !important;
}

.dark-mode .settings-button:hover {
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.5) !important;
}

/* Modal Dark Mode */
.dark-mode .settings-modal :deep(.n-card) {
  background-color: var(--dark-bg-card) !important;
  border: 1px solid var(--dark-border) !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6) !important;
}

.dark-mode .settings-modal :deep(.n-card-header) {
  background-color: var(--dark-bg-elevated) !important;
  color: var(--dark-text-primary) !important;
  border-bottom: 2px solid var(--dark-border) !important;
}

.dark-mode .settings-modal :deep(.n-card__content) {
  background-color: var(--dark-bg-card) !important;
  color: var(--dark-text-primary) !important;
}

/* Form Items Dark Mode */
.dark-mode .icon-left {
  color: var(--dark-accent-green-light) !important;
}

.dark-mode :deep(.n-form-item-label) {
  color: var(--dark-text-primary) !important;
}

/* Mode Switch Dark Mode */
.dark-mode .mode-switch i {
  color: var(--dark-accent-green-light) !important;
}

/* Background Col Dark Mode */
.dark-mode .background-col {
  background: var(--dark-bg-elevated) !important;
  border: 1px solid var(--dark-border) !important;
}

/* Switch Toggle Dark Mode */
.dark-mode .switch-toggle {
  background: var(--dark-bg-elevated) !important;
  border: 1px solid var(--dark-border) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important;
}

.dark-mode .switch-toggle input + label {
  color: var(--dark-text-secondary) !important;
}

.dark-mode .switch-toggle input:checked + label {
  background: var(--dark-accent-green) !important;
  color: var(--dark-text-primary) !important;
}

.dark-mode .switch-toggle input + label:hover {
  background: rgba(15, 138, 74, 0.7) !important;
}

.dark-mode .switch-toggle input:checked + label:hover {
  background: var(--dark-accent-green-light) !important;
}

/* Autoscroll Section Dark Mode */
.dark-mode .autoscroll-section {
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.15) 0%,
    rgba(12, 113, 61, 0.08) 100%
  ) !important;
  border: 2px solid rgba(12, 113, 61, 0.3) !important;
}

.dark-mode .autoscroll-section :deep(.n-divider) {
  color: var(--dark-accent-green-light) !important;
}

.dark-mode .autoscroll-section :deep(.n-divider__line) {
  background-color: var(--dark-border) !important;
}

/* Apply Button Dark Mode */
.dark-mode .apply-button {
  background: linear-gradient(
    135deg,
    var(--dark-accent-green) 0%,
    var(--dark-accent-green-light) 100%
  ) !important;
  color: var(--dark-text-primary) !important;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.5) !important;
}

.dark-mode .apply-button:hover {
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.6) !important;
}

/* Naive UI Components Dark Mode */
.dark-mode :deep(.n-slider-rail) {
  background-color: var(--dark-bg-elevated) !important;
}

.dark-mode :deep(.n-slider-rail__fill) {
  background-color: var(--dark-accent-green) !important;
}

.dark-mode :deep(.n-slider-handle) {
  border-color: var(--dark-accent-green) !important;
  background-color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-slider-handle):hover {
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.3) !important;
}

.dark-mode :deep(.n-slider-mark-text) {
  color: var(--dark-text-secondary) !important;
}

.dark-mode :deep(.n-switch) {
  background-color: var(--dark-bg-elevated) !important;
}

.dark-mode :deep(.n-switch--active) {
  background-color: var(--dark-accent-green) !important;
}

.dark-mode :deep(.n-switch__rail) {
  background-color: var(--dark-bg-elevated) !important;
}

.dark-mode :deep(.n-switch--active .n-switch__rail) {
  background-color: var(--dark-accent-green) !important;
}

.dark-mode :deep(.n-switch__button) {
  background-color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-select) {
  background-color: var(--dark-bg-elevated) !important;
  border-color: var(--dark-border) !important;
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-base-selection) {
  background-color: var(--dark-bg-elevated) !important;
  border-color: var(--dark-border) !important;
}

.dark-mode :deep(.n-base-selection:hover) {
  border-color: var(--dark-accent-green) !important;
}

.dark-mode :deep(.n-base-selection--active) {
  border-color: var(--dark-accent-green) !important;
  box-shadow: 0 0 0 2px rgba(12, 113, 61, 0.2) !important;
}

.dark-mode :deep(.n-base-selection-label) {
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-base-selection-placeholder) {
  color: var(--dark-text-muted) !important;
}

.dark-mode :deep(.n-base-select-menu) {
  background-color: var(--dark-bg-elevated) !important;
  border: 1px solid var(--dark-border) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5) !important;
}

.dark-mode :deep(.n-base-select-option) {
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-base-select-option:hover) {
  background-color: var(--dark-bg-card) !important;
}

.dark-mode :deep(.n-base-select-option--selected) {
  background-color: rgba(12, 113, 61, 0.2) !important;
  color: var(--dark-accent-green-light) !important;
}

.dark-mode :deep(.n-base-select-option--pending) {
  background-color: var(--dark-bg-card) !important;
}

.dark-mode :deep(.n-color-picker-trigger) {
  background-color: var(--dark-bg-elevated) !important;
  border-color: var(--dark-border) !important;
}

.dark-mode :deep(.n-color-picker-trigger:hover) {
  border-color: var(--dark-accent-green) !important;
}

.dark-mode :deep(.n-color-picker-panel) {
  background-color: var(--dark-bg-card) !important;
  border: 1px solid var(--dark-border) !important;
}

.dark-mode :deep(.n-radio) {
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-radio__dot) {
  border-color: var(--dark-border) !important;
  background-color: var(--dark-bg-elevated) !important;
}

.dark-mode :deep(.n-radio:hover .n-radio__dot) {
  border-color: var(--dark-accent-green) !important;
}

.dark-mode :deep(.n-radio--checked .n-radio__dot) {
  border-color: var(--dark-accent-green) !important;
  background-color: var(--dark-accent-green) !important;
}

.dark-mode :deep(.n-radio--checked .n-radio__dot-inner) {
  background-color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-radio__label) {
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-radio-group) {
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-alert) {
  background-color: var(--dark-bg-elevated) !important;
  border: 1px solid var(--dark-border) !important;
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-alert--info) {
  background-color: rgba(33, 150, 243, 0.1) !important;
  border-color: rgba(33, 150, 243, 0.3) !important;
}

.dark-mode :deep(.n-alert__icon) {
  color: var(--dark-accent-green-light) !important;
}

.dark-mode :deep(.n-alert__content) {
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-divider) {
  background-color: var(--dark-border) !important;
}

.dark-mode :deep(.n-divider__title) {
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-space) {
  color: var(--dark-text-primary) !important;
}

.dark-mode :deep(.n-modal-mask) {
  background-color: rgba(0, 0, 0, 0.8) !important;
}

.dark-mode :deep(.n-scrollbar-rail) {
  background-color: var(--dark-bg-primary) !important;
}

.dark-mode :deep(.n-scrollbar-rail__scrollbar) {
  background-color: var(--dark-bg-elevated) !important;
}

.dark-mode :deep(.n-scrollbar-rail__scrollbar:hover) {
  background-color: var(--dark-border) !important;
}

/* Disabled States Dark Mode */
.dark-mode :deep(.n-select.n-select--disabled),
.dark-mode :deep(.n-slider.n-slider--disabled),
.dark-mode :deep(.n-color-picker.n-color-picker--disabled),
.dark-mode :deep(.n-switch.n-switch--disabled),
.dark-mode :deep(.n-radio.n-radio--disabled) {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.dark-mode :deep(.n-base-selection--disabled) {
  cursor: not-allowed !important;
  opacity: 0.5 !important;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large Desktop (1440px+) */
@media (min-width: 1441px) {
  .settings-button {
    top: 95px;
    right: 80px;
  }

  .background-settings-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  .settings-row {
    gap: 30px;
  }

  :deep(.n-form-item-label) {
    font-size: 1.05rem;
  }
}

/* Desktop (1280px - 1440px) */
@media (min-width: 1280px) and (max-width: 1440px) {
  .settings-button {
    top: 95px;
    right: 80px;
  }

  .background-settings-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }

  .settings-row {
    gap: 20px;
  }
}

/* Small Laptop (1024px - 1279px) */
@media (min-width: 1024px) and (max-width: 1279px) {
  .settings-button {
    top: 80px;
    right: 60px;
    min-width: 100px;
    padding: 9px 18px;
  }

  .button-text {
    display: inline;
  }

  .mobile-icon {
    display: none;
  }

  .settings-modal :deep(.n-card__content) {
    padding: 20px 25px;
  }

  .settings-modal :deep(.n-card-header) {
    padding: 18px 25px;
    font-size: 1.3rem;
  }

  .settings-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .range-item {
    grid-column: 1 / -1;
  }

  .background-settings-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .background-col {
    padding: 18px;
  }

  .autoscroll-section {
    padding: 20px;
  }

  :deep(.n-form-item-label) {
    font-size: 0.95rem;
  }
}

/* Tablet (768px - 1023px) */
@media (max-width: 1023px) {
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
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.2rem;
  }

  .settings-modal :deep(.n-card__content) {
    padding: 15px 20px;
  }

  .settings-modal :deep(.n-card-header) {
    padding: 15px 20px;
    font-size: 1.2rem;
  }

  .settings-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .mode-item,
  .yellow-light-item,
  .range-item {
    width: 100%;
  }

  .background-settings-row {
    gap: 15px;
    grid-template-columns: 1fr;
  }

  .background-col {
    padding: 15px;
  }

  .switch-toggle input + label {
    padding: 7px 12px;
    font-size: 0.9rem;
  }

  .autoscroll-section {
    padding: 18px;
  }

  .form-item-content {
    gap: 12px;
  }

  .icon-left {
    font-size: 1.1rem;
  }

  :deep(.n-form-item) {
    margin-bottom: 15px;
  }

  :deep(.n-form-item-label) {
    font-size: 0.9rem;
  }

  .apply-button {
    padding: 12px;
    font-size: 1rem;
  }
}

/* Mobile (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .settings-button {
    bottom: 100px;
    right: 15px;
    width: 48px;
    height: 48px;
  }

  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.2rem;
  }
}

/* Small Mobile (361px - 480px) */
@media (max-width: 480px) {
  .settings-button {
    bottom: 95px;
    right: 12px;
    width: 48px;
    height: 48px;
  }

  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.15rem;
  }

  .settings-modal :deep(.n-card__content) {
    padding: 12px 15px;
  }

  .settings-modal :deep(.n-card-header) {
    padding: 12px 15px;
    font-size: 1.1rem;
  }

  .settings-row {
    gap: 10px;
  }

  .background-settings-row {
    gap: 12px;
  }

  .background-col {
    padding: 12px;
  }

  .switch-toggle input + label {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .autoscroll-section {
    padding: 15px;
  }

  .form-item-content {
    gap: 10px;
  }

  .icon-left {
    font-size: 1rem;
  }

  :deep(.n-form-item) {
    margin-bottom: 12px;
  }

  :deep(.n-form-item-label) {
    font-size: 0.85rem;
  }

  .apply-button {
    padding: 10px;
    font-size: 0.95rem;
  }

  :deep(.n-slider) {
    margin: 0 5px;
  }
}

/* Extra Small Mobile (≤360px) */
@media (max-width: 360px) {
  .settings-button {
    bottom: 90px;
    right: 10px;
    width: 45px;
    height: 45px;
  }

  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.1rem;
  }

  .settings-modal :deep(.n-card__content) {
    padding: 10px 12px;
  }

  .settings-modal :deep(.n-card-header) {
    padding: 10px 12px;
    font-size: 1rem;
  }

  .background-col {
    padding: 10px;
  }

  .switch-toggle input + label {
    padding: 5px 8px;
    font-size: 0.8rem;
  }

  .autoscroll-section {
    padding: 12px;
  }

  .form-item-content {
    gap: 8px;
  }

  :deep(.n-form-item-label) {
    font-size: 0.8rem;
  }

  .apply-button {
    padding: 9px;
    font-size: 0.9rem;
  }
}
</style>
