// stores/settingsStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const brightness = ref(50);
  const mode = ref('day');
  const yellowLightMode = ref(false);
  const fontFamily = ref('Arial');
  const fontSize = ref(16);
  const backgroundImage = ref('');
  const backgroundColor = ref('#ffffff');
  const lineHeight = ref(1.5);
  const backgroundType = ref('single'); // 'single' hoặc 'gradient'
  const gradientColor = ref('Netflix'); // Tên dải màu đã chọn

  // Lưu tạm các cài đặt để khi người dùng thay đổi không làm ảnh hưởng đến store chính
  const tempSettings = ref({});

  // Các lựa chọn mặc định cho font, hình nền, dải màu
  const fontOptions = ref([
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
  ]);

  const backgroundOptions = ref([
    { label: 'Không', value: '' },
    { label: 'Hình nền 1', value: 'background1.jpg' },
    { label: 'Hình nền 2', value: 'background2.jpg' },
  ]);

  const gradientOptions = ref([
    { label: 'Netflix', value: 'Netflix' },
    { label: 'Vine', value: 'Vine' },
    { label: 'Megatron', value: 'Megatron' },
  ]);

  // Áp dụng cài đặt tạm vào store chính
  const applySettings = () => {
    brightness.value = tempSettings.value.brightness;
    mode.value = tempSettings.value.mode;
    yellowLightMode.value = tempSettings.value.yellowLightMode;
    fontFamily.value = tempSettings.value.fontFamily;
    fontSize.value = tempSettings.value.fontSize;
    backgroundImage.value = tempSettings.value.backgroundImage;
    backgroundColor.value = tempSettings.value.backgroundColor;
    lineHeight.value = tempSettings.value.lineHeight;
    backgroundType.value = tempSettings.value.backgroundType;
    gradientColor.value = tempSettings.value.gradientColor;
  };

  // Khôi phục cài đặt tạm thời
  const resetTempSettings = () => {
    tempSettings.value = {
      brightness: brightness.value,
      mode: mode.value,
      yellowLightMode: yellowLightMode.value,
      fontFamily: fontFamily.value,
      fontSize: fontSize.value,
      backgroundImage: backgroundImage.value,
      backgroundColor: backgroundColor.value,
      lineHeight: lineHeight.value,
      backgroundType: backgroundType.value,
      gradientColor: gradientColor.value,
    };
  };

  return {
    brightness,
    mode,
    yellowLightMode,
    fontFamily,
    fontSize,
    backgroundImage,
    backgroundColor,
    lineHeight,
    backgroundType,
    gradientColor,
    tempSettings,
    fontOptions,
    backgroundOptions,
    gradientOptions,
    applySettings,
    resetTempSettings,
  };
});
