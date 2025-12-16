<template>
  <div>
    <button @click="showModal = true" class="settings-button">
      <span class="button-text">Cài đặt</span>
      <i class="fas fa-cog mobile-icon"></i>
    </button>

    <transition name="modal">
      <div v-if="showModal" class="modal-backdrop" @click="showModal = false">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3>Cài đặt</h3>
            <button @click="showModal = false" class="close-button">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <!-- Độ sáng -->
            <div class="form-item">
              <label class="form-label">Độ sáng</label>
              <div class="form-item-content">
                <i class="fa fa-adjust icon-left"></i>
                <input
                  type="range"
                  v-model="brightness"
                  min="0"
                  max="100"
                  class="slider"
                />
                <span class="slider-value">{{ brightness }}%</span>
              </div>
            </div>

            <!-- Settings Row -->
            <div class="settings-row">
              <!-- Chế độ -->
              <div class="form-item">
                <label class="form-label">Chế độ</label>
                <div class="mode-switch">
                  <i class="fa fa-sun"></i>
                  <label class="switch">
                    <input
                      type="checkbox"
                      v-model="isNightMode"
                      @change="toggleMode"
                    />
                    <span class="switch-slider"></span>
                  </label>
                  <i class="fa fa-moon"></i>
                </div>
              </div>

              <!-- Ánh sáng vàng -->
              <div class="form-item">
                <label class="form-label">Ánh sáng vàng</label>
                <label class="switch">
                  <input type="checkbox" v-model="yellowLightMode" />
                  <span class="switch-slider"></span>
                </label>
              </div>

              <!-- Phạm vi -->
              <div class="form-item">
                <label class="form-label">Phạm vi</label>
                <div class="switch-toggle">
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
              </div>
            </div>

            <!-- Hình nền -->
            <div class="form-item">
              <label class="form-label">Hình nền</label>
              <select
                v-model="selectedBackground"
                @change="handleBackgroundSelection"
                :disabled="mode === 'night'"
                class="select-input"
              >
                <option
                  v-for="option in backgroundOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Background Settings Row -->
            <div class="background-settings-row">
              <div class="background-col">
                <div class="form-item">
                  <label class="form-label">Kiểu nền</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input
                        type="radio"
                        v-model="backgroundStyle"
                        value="solid"
                        :disabled="mode === 'night'"
                      />
                      <span>Đơn sắc</span>
                    </label>
                    <label class="radio-label">
                      <input
                        type="radio"
                        v-model="backgroundStyle"
                        value="gradient"
                        :disabled="mode === 'night'"
                      />
                      <span>Dải màu</span>
                    </label>
                  </div>
                </div>

                <div v-if="backgroundStyle === 'solid'" class="form-item">
                  <label class="form-label">Màu nền</label>
                  <input
                    type="color"
                    v-model="backgroundColor"
                    :disabled="mode === 'night'"
                    class="color-input"
                  />
                </div>

                <div v-if="backgroundStyle === 'gradient'" class="form-item">
                  <label class="form-label">Dải màu</label>
                  <select
                    v-model="selectedGradient"
                    :disabled="mode === 'night'"
                    class="select-input"
                  >
                    <option
                      v-for="option in gradientOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div v-if="backgroundStyle === 'gradient'" class="form-item">
                  <label class="form-label">Độ trong suốt</label>
                  <input
                    type="range"
                    v-model="backgroundOpacity"
                    min="0"
                    max="1"
                    step="0.01"
                    :disabled="mode === 'night'"
                    class="slider"
                  />
                  <span class="slider-value"
                    >{{ (backgroundOpacity * 100).toFixed(0) }}%</span
                  >
                </div>
              </div>

              <div class="background-col" v-if="screenMode === 'custom'">
                <div class="form-item">
                  <label class="form-label">Nền tùy chỉnh</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input
                        type="radio"
                        v-model="customBackgroundStyle"
                        value="solid"
                        :disabled="mode === 'night'"
                      />
                      <span>Đơn sắc</span>
                    </label>
                    <label class="radio-label">
                      <input
                        type="radio"
                        v-model="customBackgroundStyle"
                        value="gradient"
                        :disabled="mode === 'night'"
                      />
                      <span>Dải màu</span>
                    </label>
                  </div>
                </div>

                <div v-if="customBackgroundStyle === 'solid'" class="form-item">
                  <label class="form-label">Màu nền</label>
                  <input
                    type="color"
                    v-model="customBackgroundColor"
                    :disabled="mode === 'night'"
                    class="color-input"
                  />
                </div>

                <div
                  v-if="customBackgroundStyle === 'gradient'"
                  class="form-item"
                >
                  <label class="form-label">Dải màu</label>
                  <select
                    v-model="customSelectedGradient"
                    :disabled="mode === 'night'"
                    class="select-input"
                  >
                    <option
                      v-for="option in customGradientOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div
                  v-if="customBackgroundStyle === 'gradient'"
                  class="form-item"
                >
                  <label class="form-label">Độ trong suốt</label>
                  <input
                    type="range"
                    v-model="customBackgroundOpacity"
                    min="0"
                    max="1"
                    step="0.01"
                    :disabled="mode === 'night'"
                    class="slider"
                  />
                  <span class="slider-value"
                    >{{ (customBackgroundOpacity * 100).toFixed(0) }}%</span
                  >
                </div>
              </div>
            </div>

            <!-- Auto Scroll Section -->
            <div class="autoscroll-section">
              <div class="section-divider">Tự động cuộn</div>

              <div class="form-item">
                <label class="form-label">Bật tự động cuộn</label>
                <label class="switch">
                  <input type="checkbox" v-model="autoScrollEnabled" />
                  <span class="switch-slider"></span>
                </label>
              </div>

              <div v-if="autoScrollEnabled" class="form-item">
                <label class="form-label"
                  >Khoảng cách cuộn mỗi lần (giây)</label
                >
                <div class="form-item-content">
                  <i class="fa fa-clock icon-left"></i>
                  <input
                    type="range"
                    v-model="scrollInterval"
                    min="1"
                    max="10"
                    step="1"
                    class="slider"
                  />
                  <span class="slider-value">{{ scrollInterval }}s</span>
                </div>
              </div>

              <div v-if="autoScrollEnabled" class="form-item">
                <label class="form-label">Số pixel cuộn mỗi lần</label>
                <div class="form-item-content">
                  <i class="fa fa-arrows-up-down icon-left"></i>
                  <input
                    type="range"
                    v-model="scrollAmount"
                    min="100"
                    max="1000"
                    step="50"
                    class="slider"
                  />
                  <span class="slider-value">{{ scrollAmount }}px</span>
                </div>
              </div>

              <div v-if="autoScrollEnabled" class="form-item">
                <label class="form-label"
                  >Thời gian chờ trước khi bắt đầu (giây)</label
                >
                <div class="form-item-content">
                  <i class="fa fa-hourglass-start icon-left"></i>
                  <input
                    type="range"
                    v-model="scrollDelay"
                    min="3"
                    max="10"
                    step="1"
                    class="slider"
                  />
                  <span class="slider-value">{{ scrollDelay }}s</span>
                </div>
              </div>

              <div
                v-if="autoScrollEnabled && isScrolling"
                class="scroll-status"
              >
                <i class="fa fa-circle-notch fa-spin"></i>
                <span
                  >Đang tự động cuộn... Nhấn ESC hoặc cuộn chuột để dừng</span
                >
              </div>
            </div>

            <!-- Font chữ -->
            <div class="form-item">
              <label class="form-label">Font chữ</label>
              <div class="form-item-content">
                <i class="fa fa-font icon-left"></i>
                <select v-model="fontFamily" class="select-input">
                  <option
                    v-for="option in fontOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Cỡ chữ -->
            <div class="form-item">
              <label class="form-label">Cỡ chữ</label>
              <div class="form-item-content">
                <i class="fa fa-text-height icon-left"></i>
                <input
                  type="range"
                  v-model="fontSize"
                  min="12"
                  max="30"
                  class="slider"
                />
                <span class="slider-value">{{ fontSize }}px</span>
              </div>
            </div>

            <!-- Chiều cao dòng -->
            <div class="form-item">
              <label class="form-label">Chiều cao dòng</label>
              <div class="form-item-content">
                <i class="fa fa-text-height icon-left"></i>
                <input
                  type="range"
                  v-model="lineHeight"
                  min="1"
                  max="2"
                  step="0.1"
                  class="slider"
                />
                <span class="slider-value">{{ lineHeight.toFixed(1) }}</span>
              </div>
            </div>

            <button @click="applySettings" class="apply-button">Áp dụng</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
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
const scrollInterval = ref(3);
const scrollAmount = ref(300);
const scrollDelay = ref(5);
const isScrolling = ref(false);
let scrollTimer = null;
let scrollTimeout = null;

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

const isNightMode = computed({
  get: () => mode.value === 'night',
  set: (val) => {
    mode.value = val ? 'night' : 'day';
  },
});

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

const toggleMode = () => {
  mode.value = isNightMode.value ? 'night' : 'day';
};

// Auto scroll functions
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

          if (customBackgroundLayer) {
            customBackgroundLayer.style.opacity = '0';
          }
          if (customSolidLayer) {
            customSolidLayer.style.opacity = '0';
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

          if (customBackgroundLayer) {
            customBackgroundLayer.style.opacity = '0';
          }
          if (customSolidLayer) {
            customSolidLayer.style.opacity = '0';
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
              customBackgroundLayer.style.opacity = '0.5';
              customBackgroundLayer.style.backgroundColor = '#ffffff';

              if (settings.backgroundImage) {
                customBackgroundLayer.style.backgroundImage = `url(${settings.backgroundImage})`;
                customBackgroundLayer.style.backgroundSize = 'cover';
                customBackgroundLayer.style.backgroundPosition =
                  'center center';
                customBackgroundLayer.style.backgroundRepeat = 'no-repeat';
              } else {
                customBackgroundLayer.style.backgroundImage = 'none';
              }
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
      { label: 'Không có', value: 'none' },
      ...backgrounds,
    ];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hình nền:', error);
  }
};

const handleBackgroundSelection = (event) => {
  const selectedValue = event.target.value;
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
  top: 185px;
  right: 80px;
  z-index: 1000;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
  min-width: 110px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.settings-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
}

.settings-button:active {
  transform: translateY(0);
}

.button-text {
  display: inline;
}

.mobile-icon {
  display: none;
}

/* ========== MODAL ========== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  border-bottom: 2px solid #f0f0f0;
  background: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 25px 30px;
  overflow-y: auto;
  flex: 1;
}

/* ========== FORM ITEMS ========== */
.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
}

.form-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.icon-left {
  flex-shrink: 0;
  color: #0c713d;
  font-size: 1.2rem;
}

/* ========== INPUTS ========== */
.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0c713d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: #0a5a31;
  transform: scale(1.2);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0c713d;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  background: #0a5a31;
  transform: scale(1.2);
}

.slider-value {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: #0c713d;
  font-size: 0.95rem;
}

.select-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-input:hover {
  border-color: #0c713d;
}

.select-input:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

.select-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.color-input {
  width: 60px;
  height: 40px;
  border: 2px solid #d0d0d0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-input:hover {
  border-color: #0c713d;
}

.color-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========== SWITCH ========== */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 26px;
}

.switch-slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.switch input:checked + .switch-slider {
  background-color: #0c713d;
}

.switch input:checked + .switch-slider:before {
  transform: translateX(24px);
}

/* ========== SETTINGS ROW ========== */
.settings-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
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

/* ========== RADIO GROUP ========== */
.radio-group {
  display: flex;
  gap: 16px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
}

.radio-label input[type='radio'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0c713d;
}

.radio-label input[type='radio']:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.section-divider {
  margin: 0 0 20px 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: #0c713d;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(12, 113, 61, 0.2);
}

.scroll-status {
  margin-top: 15px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-left: 4px solid #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #1e40af;
  font-weight: 600;
}

.scroll-status i {
  font-size: 1.2rem;
  color: #2563eb;
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
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
  transition: all 0.3s ease;
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.4);
  background: linear-gradient(135deg, #0a5a31 0%, #084428 100%);
}

.apply-button:active {
  transform: translateY(0);
}

/* ========== MODAL ANIMATION ========== */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

/* ========== SCROLLBAR ========== */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* ========== DARK MODE - APP-WIDE ========== */
html.dark-mode .modal-container {
  background: var(--dark-bg-card);
}

html.dark-mode .modal-header {
  background: var(--dark-bg-elevated);
  border-bottom-color: var(--dark-border);
}

html.dark-mode .modal-header h3 {
  color: var(--dark-text-primary);
}

html.dark-mode .close-button {
  color: var(--dark-text-secondary);
}

html.dark-mode .close-button:hover {
  background: var(--dark-bg-card);
  color: var(--dark-text-primary);
}

html.dark-mode .form-label {
  color: var(--dark-text-primary);
}

html.dark-mode .select-input {
  background: var(--dark-bg-elevated);
  border-color: var(--dark-border);
  color: var(--dark-text-primary);
}

html.dark-mode .select-input:hover {
  border-color: var(--dark-accent-green);
}

html.dark-mode .select-input:focus {
  border-color: var(--dark-accent-green);
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.2);
}

html.dark-mode .select-input:disabled {
  background: var(--dark-bg-primary);
}

html.dark-mode .color-input {
  border-color: var(--dark-border);
}

html.dark-mode .color-input:hover {
  border-color: var(--dark-accent-green);
}

html.dark-mode .slider {
  background: var(--dark-bg-elevated);
}

html.dark-mode .slider::-webkit-slider-thumb {
  background: var(--dark-accent-green);
}

html.dark-mode .slider::-webkit-slider-thumb:hover {
  background: var(--dark-accent-green-light);
}

html.dark-mode .slider::-moz-range-thumb {
  background: var(--dark-accent-green);
}

html.dark-mode .slider::-moz-range-thumb:hover {
  background: var(--dark-accent-green-light);
}

html.dark-mode .slider-value {
  color: var(--dark-accent-green-light);
}

html.dark-mode .switch-slider {
  background-color: var(--dark-bg-elevated);
}

html.dark-mode .switch input:checked + .switch-slider {
  background-color: var(--dark-accent-green);
}

html.dark-mode .background-col {
  background: var(--dark-bg-elevated);
  border-color: var(--dark-border);
}

html.dark-mode .autoscroll-section {
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.1) 0%,
    rgba(12, 113, 61, 0.05) 100%
  );
  border-color: rgba(12, 113, 61, 0.2);
}

html.dark-mode .section-divider {
  color: var(--dark-accent-green-light);
  border-bottom-color: rgba(12, 113, 61, 0.3);
}

html.dark-mode .scroll-status {
  background: linear-gradient(
    135deg,
    rgba(37, 99, 235, 0.2) 0%,
    rgba(37, 99, 235, 0.1) 100%
  );
  border-left-color: #3b82f6;
  color: #93c5fd;
}

html.dark-mode .scroll-status i {
  color: #60a5fa;
}

html.dark-mode .radio-label {
  color: var(--dark-text-primary);
}

html.dark-mode .modal-body::-webkit-scrollbar-track {
  background: var(--dark-bg-primary);
}

html.dark-mode .modal-body::-webkit-scrollbar-thumb {
  background: var(--dark-bg-elevated);
}

html.dark-mode .modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--dark-border);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large Desktop (1440px+) */
@media (min-width: 1441px) {
  .settings-button {
    top: 95px;
    right: 80px;
  }

  .modal-container {
    max-width: 1000px;
  }
}

/* Desktop (1280px - 1440px) */
@media (min-width: 1280px) and (max-width: 1440px) {
  .settings-button {
    top: 95px;
    right: 80px;
  }

  .modal-container {
    max-width: 900px;
  }
}

/* Small Laptop (1024px - 1279px) - VẪN DESKTOP MODE */
@media (min-width: 1024px) and (max-width: 1279px) {
  .settings-button {
    top: 80px;
    right: 60px;
    min-width: 100px;
    padding: 9px 18px;
  }

  /* VẪN GIỮ NGUYÊN TEXT, ẨN ICON */
  .button-text {
    display: inline;
  }

  .mobile-icon {
    display: none;
  }

  .modal-container {
    max-width: 800px;
  }

  .modal-header {
    padding: 18px 25px;
  }

  .modal-header h3 {
    font-size: 1.3rem;
  }

  .modal-body {
    padding: 20px 25px;
  }

  .settings-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .settings-row .form-item:last-child {
    grid-column: 1 / -1;
  }

  .background-settings-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Tablet (768px - 1023px) - CHUYỂN SANG MOBILE MODE */
@media (max-width: 1023px) {
  .settings-button {
    top: auto;
    bottom: 100px;
    right: 15px;
    min-width: 48px;
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 50%;
  }

  /* ẨN TEXT, HIỆN ICON */
  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.2rem;
  }

  .modal-container {
    max-width: 90vw;
  }

  .modal-header {
    padding: 15px 20px;
  }

  .modal-header h3 {
    font-size: 1.2rem;
  }

  .modal-body {
    padding: 15px 20px;
  }

  .settings-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .background-settings-row {
    grid-template-columns: 1fr;
    gap: 15px;
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

  .form-item {
    margin-bottom: 15px;
  }

  .form-label {
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

  /* ĐẢM BẢO ICON VẪN HIỆN */
  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.2rem;
  }

  .modal-container {
    max-width: 95vw;
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

  /* ĐẢM BẢO ICON VẪN HIỆN */
  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.15rem;
  }

  .modal-backdrop {
    padding: 10px;
  }

  .modal-container {
    max-width: 100%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 12px 15px;
  }

  .modal-header h3 {
    font-size: 1.1rem;
  }

  .modal-body {
    padding: 12px 15px;
  }

  .form-item {
    margin-bottom: 12px;
  }

  .form-label {
    font-size: 0.85rem;
  }

  .form-item-content {
    gap: 10px;
  }

  .icon-left {
    font-size: 1rem;
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

  .section-divider {
    font-size: 1rem;
  }

  .apply-button {
    padding: 10px;
    font-size: 0.95rem;
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

  /* ĐẢM BẢO ICON VẪN HIỆN */
  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.1rem;
  }

  .modal-header {
    padding: 10px 12px;
  }

  .modal-header h3 {
    font-size: 1rem;
  }

  .modal-body {
    padding: 10px 12px;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .form-item-content {
    gap: 8px;
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

  .apply-button {
    padding: 9px;
    font-size: 0.9rem;
  }
}
</style>
