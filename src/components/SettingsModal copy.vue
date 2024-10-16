<template>
  <div>
    <n-button type="primary" @click="showModal = true" class="settings-button">
      Cài đặt
    </n-button>
    <n-modal v-model:show="showModal" preset="card" title="Cài đặt" style="width: 450px;">
      <n-space vertical>
        <n-form-item label="Độ sáng">
          <i class="fa fa-adjust me-2"></i>
          <n-slider v-model:value="brightness" :min="0" :max="100" />
        </n-form-item>
        
        <div class="d-flex justify-content-between align-items-center m-0 p-0">
          <span>
            <n-form-item label="Chế độ">
              <i class="fa fa-sun me-2"></i>
              <n-switch v-model:value="mode" :checked-value="'night'" :unchecked-value="'day'" class="me-2">
                {{ mode === 'night' ? 'Ánh sáng ban đêm' : 'Ánh sáng ban ngày' }}
              </n-switch>
              <i class="fa fa-moon"></i>
            </n-form-item>
          </span>
          <span>
            <n-form-item label="Ánh sáng vàng">
              <n-switch v-model:value="yellowLightMode">
                <template #checked>
                  Bật
                </template>
                <template #unchecked>
                  Tắt
                </template>
              </n-switch>
            </n-form-item>
          </span>
          <span>
            <n-form-item label="Phạm vi">
              <div class="switch-toggle switch-3 switch-candy">
                <input id="full" name="screen-mode" type="radio" v-model="screenMode" value="full" />
                <label for="full">Full</label>

                <input id="partial" name="screen-mode" type="radio" v-model="screenMode" value="partial" />
                <label for="partial">Partial</label>

                <input id="custom" name="screen-mode" type="radio" v-model="screenMode" value="custom" />
                <label for="custom" >Custom</label>
              </div>
            </n-form-item>
          </span>
        </div>

        <n-form-item label="Font chữ">
          <i class="fa fa-font me-2"></i>
          <n-select v-model:value="fontFamily" :options="fontOptions" />
        </n-form-item>
        
        <n-form-item label="Cỡ chữ">
          <i class="fa fa-text-height me-2"></i>
          <n-slider v-model:value="fontSize" :min="12" :max="30" />
        </n-form-item>

        <n-form-item label="Hình nền">
          <n-select v-model:value="backgroundImage" :options="backgroundOptions" />
        </n-form-item>
        <div class="row m-0 p-0">
          <div class="col-12 col-md-6">
            <n-form-item label="Kiểu nền">
              <n-radio-group v-model:value="backgroundStyle">
                <n-radio label="Đơn sắc" value="solid">Đơn sắc</n-radio>
                <n-radio label="Dải màu" value="gradient">Dải màu</n-radio>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="backgroundStyle === 'solid'" label="Màu nền">
              <n-color-picker v-model:value="backgroundColor" />
            </n-form-item>
            <n-form-item v-if="backgroundStyle === 'gradient'" label="Dải màu">
              <n-select v-model:value="selectedGradient" :options="gradientOptions" />
            </n-form-item>
            <n-form-item v-if="backgroundStyle === 'gradient'" label="Độ trong suốt dải màu">
              <n-slider v-model:value="backgroundOpacity" :min="0" :max="1" step="0.01" />
            </n-form-item>
          </div>
          <div class="col-12 col-md-6" v-if="screenMode === 'custom'">
            <n-form-item label="Nền tùy chỉnh">
              <n-radio-group v-model:value="customBackgroundStyle">
                <n-radio label="Đơn sắc" value="solid">Đơn sắc</n-radio>
                <n-radio label="Dải màu" value="gradient">Dải màu</n-radio>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="customBackgroundStyle === 'solid'" label="Màu nền">
              <n-color-picker v-model:value="customBackgroundColor" />
            </n-form-item>
            <n-form-item v-if="customBackgroundStyle === 'gradient'" label="Dải màu">
              <n-select v-model:value="customSelectedGradient" :options="customGradientOptions" />
            </n-form-item>
            <n-form-item v-if="customBackgroundStyle === 'gradient'" label="Độ trong suốt dải màu">
              <n-slider v-model:value="customBackgroundOpacity" :min="0" :max="1" step="0.01" />
            </n-form-item>
          </div>
        </div>
        <n-form-item label="Chiều cao dòng">
          <n-icon size="30"><AutoFitHeight20Regular /></n-icon>
          <n-slider v-model:value="lineHeight" :min="1" :max="2" step="0.1" />
        </n-form-item>
        <n-button type="primary" @click="applySettings" style="width: 100%;">Áp dụng</n-button>
      </n-space>
    </n-modal>
  </div>
</template>
<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { NButton, NModal, NSlider, NSwitch, NSelect, NColorPicker, NFormItem, NSpace, NRadioGroup } from 'naive-ui';
  import AutoFitHeight20Regular from '@vicons/fluent/AutoFitHeight20Regular';
  import api from '../services/axiosInterceptor';

  const userId = useAuthStore().user?.id;

  const showModal = ref(false);
  const screenMode = ref('full');
  const backgroundStyle = ref('solid');
  const selectedGradient = ref('');
  const brightness = ref(100);
  const mode = ref('day');
  const yellowLightMode = ref(false);
  const fontFamily = ref('Arial');
  const fontSize = ref(20);
  const backgroundImage = ref('');
  const backgroundColor = ref('#ffffff');
  const lineHeight = ref(1.5);
  const customBackgroundStyle = ref('solid');
  const customBackgroundColor = ref('#ffffff');
  const customSelectedGradient = ref('');
  const backgroundOpacity = ref(1);
  const customBackgroundOpacity = ref(1);
  const hasSettings  = ref(false);
  const backgroundStoryId =  ref('');

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

  const backgroundOptions = ref([]);
  const saveSettings = async () => {
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
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  const applySettings = () => {
    const settings = {
      brightness: brightness.value,
      mode: mode.value,
      yellowLightMode: yellowLightMode.value,
      fontFamily: fontFamily.value,
      fontSize: fontSize.value,
      backgroundImage: backgroundImage.value,
      backgroundColor: backgroundColor.value,
      lineHeight: lineHeight.value,
      backgroundStyle: backgroundStyle.value,
      selectedGradient: selectedGradient.value,
      customBackgroundStyle: customBackgroundStyle.value,
      customBackgroundColor: customBackgroundColor.value,
      customSelectedGradient: customSelectedGradient.value,
      backgroundOpacity: backgroundOpacity.value,
      customBackgroundOpacity: customBackgroundOpacity.value,
    };

    const contentContainer = document.querySelector('.chapter-content');
    const storyContainer = document.querySelector('.container');
    const backgroundImageContainer = document.querySelector('.background-image-container');
    const parentComponent = document.querySelector('body');

    const reset = () => {
      backgroundImageContainer.style.backgroundImage = 'none';
      parentComponent.style.backgroundColor = '';
      parentComponent.style.backgroundImage = '';
      parentComponent.style.filter = '';
      storyContainer.style.backgroundColor = '';
      storyContainer.style.backgroundImage = '';
    };

    switch (screenMode.value) {
      case 'full':
        reset();
        backgroundImageContainer.style.width = '100%';
        if (settings.mode === 'night') {
          backgroundImageContainer.style.backgroundImage = 'none';
          parentComponent.style.backgroundColor = '#2c2c2c';
        } else {
          backgroundImageContainer.style.backgroundImage = `url(${settings.backgroundImage})`;
          if (settings.backgroundStyle === 'solid') {
            parentComponent.style.backgroundColor = settings.backgroundColor;
          } else if (settings.backgroundStyle === 'gradient') {
            parentComponent.style.backgroundImage = getGradient(settings.selectedGradient, settings.backgroundOpacity);
          }
        }
        break;

      case 'partial':
        reset();
        backgroundImageContainer.style.width = '66.666667%';
        if (settings.mode === 'night') {
          backgroundImageContainer.style.backgroundImage = 'none';
          storyContainer.style.backgroundColor = '#2c2c2c';
        } else {
          backgroundImageContainer.style.backgroundImage = `url(${settings.backgroundImage})`;
          if (settings.backgroundStyle === 'solid') {
            storyContainer.style.backgroundColor = settings.backgroundColor;
          } else if (settings.backgroundStyle === 'gradient') {
            storyContainer.style.backgroundImage = getGradient(settings.selectedGradient, settings.backgroundOpacity);
          }
        }
        break;

      case 'custom':
        reset();
        backgroundImageContainer.style.width = '66.666667%';
        if (settings.mode === 'night') {
          backgroundImageContainer.style.backgroundImage = 'none';
          storyContainer.style.backgroundColor = '#2c2c2c';
          parentComponent.style.backgroundColor = '#2c2c2c';
        } else {
          backgroundImageContainer.style.backgroundImage = `url(${settings.backgroundImage})`;
          if (settings.backgroundStyle === 'solid') {
            storyContainer.style.backgroundColor = settings.backgroundColor;
          } else if (settings.backgroundStyle === 'gradient') {
            storyContainer.style.backgroundImage = getGradient(settings.selectedGradient, settings.backgroundOpacity);
          }
          if (settings.customBackgroundStyle === 'solid') {
            parentComponent.style.backgroundColor = settings.customBackgroundColor;
          } else if (settings.customBackgroundStyle === 'gradient') {
            parentComponent.style.backgroundImage = getGradient(settings.customSelectedGradient, settings.customBackgroundOpacity);
          }
        }
        break;
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

    parentComponent.style.color = settings.mode === 'night' ? '#ffffff' : '#000000';
    saveSettings();
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
      backgroundOptions.value = response.data.map((background) => ({
        label: background.background_image_name,
        value: background.background_image_path,
        backgroundStoryId: background.id,
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hình nền:', error);
    } 
  };

  const fetchUserSettings = async (userId) => {
    try {
      const response = await api.get(`/story/${userId}/settings`);
      const settings = response.data.settings;
      fontFamily.value = settings.font_family;
      fontSize.value = settings.font_size;
      lineHeight.value = settings.line_height;
      backgroundImage.value = settings.backgroundStory?.background_image_path || '';
      hasSettings.value = true; 
    } catch (error) {
      console.error('Lỗi khi lấy cài đặt người dùng:', error);
    }
  };
  onMounted(() => {
    fetchBackgrounds();
    fetchUserSettings(userId);
  });
</script>

<style scoped>
.settings-button {
  position: fixed;
  top: 80px;
  right: 80px;
  z-index: 1000;
}

.n-modal {
  width: 400px !important;
}

.n-space {
  width: 100%;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.me-2 {
  margin-right: 8px;
}

.ms-2 {
  margin-left: 8px;
}
.switch-toggle {
  float: left;
  background: #242729;
}

.switch-toggle input {
  position: absolute;
  opacity: 0;
}

.switch-toggle input + label {
  padding: 7px;
  float: left;
  color: #fff;
  cursor: pointer;
}

.switch-toggle input:checked + label {
  background: green;
}

.settings-button {
  margin-bottom: 10px;
}
</style>
