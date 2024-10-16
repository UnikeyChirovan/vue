// import { defineStore } from 'pinia';
// import background1 from '../assets/img/1.jpg';

// export const useSettingsStore = defineStore('settings', {
//   state: () => ({
//     showModal: false,
//     screenMode: 'full',
//     backgroundStyle: 'solid',
//     selectedGradient: '',
//     brightness: 100,
//     mode: 'day',  // 'day' hoặc 'night'
//     yellowLightMode: false,
//     fontFamily: 'Arial',
//     fontSize: 20,
//     backgroundImage: '',
//     backgroundColor: '#ffffff',
//     lineHeight: 1.5,
//     customBackgroundStyle: 'solid',
//     customBackgroundColor: '#ffffff',
//     customSelectedGradient: '',
//     backgroundOpacity: 1,
//     customBackgroundOpacity: 1,
//     fontOptions: [
//       { label: 'Arial', value: 'Arial' },
//       { label: 'Times New Roman', value: 'Times New Roman' },
//       { label: 'Courier New', value: 'Courier New' },
//     ],
//     gradientOptions: [
//       { label: 'Netflix', value: 'netflix' },
//       { label: 'Vine', value: 'vine' },
//       { label: 'Megatron', value: 'megatron' },
//     ],
//     customGradientOptions: [
//       { label: 'Netflix', value: 'netflix' },
//       { label: 'Vine', value: 'vine' },
//       { label: 'Megatron', value: 'megatron' },
//     ],
//     backgroundOptions: [
//       { label: 'Không', value: '' },
//       { label: 'Hình nền 1', value: background1 },
//       { label: 'Hình nền 2', value: 'background2.jpg' },
//     ],
//   }),
//   actions: {
//     applySettings() {
//       const settings = {
//         brightness: this.brightness,
//         mode: this.mode,
//         yellowLightMode: this.yellowLightMode,
//         fontFamily: this.fontFamily,
//         fontSize: this.fontSize,
//         backgroundImage: this.backgroundImage,
//         backgroundColor: this.backgroundColor,
//         lineHeight: this.lineHeight,
//         backgroundStyle: this.backgroundStyle,
//         selectedGradient: this.selectedGradient,
//         customBackgroundStyle: this.customBackgroundStyle,
//         customBackgroundColor: this.customBackgroundColor,
//         customSelectedGradient: this.customSelectedGradient,
//         backgroundOpacity: this.backgroundOpacity,
//         customBackgroundOpacity: this.customBackgroundOpacity,
//       };

//       const contentContainer = document.querySelector('.chapter-content');
//       const storyContainer = document.querySelector('.container');
//       const backgroundImageContainer = document.querySelector('.background-image-container');
//       const parentComponent = document.querySelector('body');
//       const customComponent = document.querySelector('.background-custom');

//       const reset = () => {
//         backgroundImageContainer.style.backgroundImage = 'none';
//         parentComponent.style.backgroundColor = '';
//         parentComponent.style.backgroundImage = '';
//         parentComponent.style.filter = '';
//         storyContainer.style.backgroundColor = '';
//         storyContainer.style.backgroundImage = '';
//       };

//       // Xử lý logic cho từng chế độ màn hình
//       switch (this.screenMode) {
//         case 'full':
//           reset();
//           backgroundImageContainer.style.width = '100%';
//           if (settings.mode === 'night') {
//             // Ở chế độ ban đêm, vô hiệu hóa màu nền và gradient
//             backgroundImageContainer.style.backgroundImage = 'none';
//             parentComponent.style.backgroundColor = '#2c2c2c';
//             parentComponent.style.backgroundImage = 'none';
//           } else {
//             // Áp dụng màu nền và gradient khi không ở chế độ ban đêm
//             backgroundImageContainer.style.backgroundImage = `url(${settings.backgroundImage})`;
//             if (settings.backgroundStyle === 'solid') {
//               parentComponent.style.backgroundColor = settings.backgroundColor;
//             } else if (settings.backgroundStyle === 'gradient') {
//               parentComponent.style.backgroundImage = this.getGradient(settings.selectedGradient, settings.backgroundOpacity);
//             }
//           }
//           break;

//         case 'partial':
//           reset();
//           backgroundImageContainer.style.width = '66.666667%';
//           if (settings.mode === 'night') {
//             // Ở chế độ ban đêm, vô hiệu hóa màu nền và gradient
//             backgroundImageContainer.style.backgroundImage = 'none';
//             storyContainer.style.backgroundColor = '#2c2c2c';
//             storyContainer.style.backgroundImage = 'none';
//           } else {
//             // Áp dụng màu nền và gradient khi không ở chế độ ban đêm
//             backgroundImageContainer.style.backgroundImage = `url(${settings.backgroundImage})`;
//             if (settings.backgroundStyle === 'solid') {
//               storyContainer.style.backgroundColor = settings.backgroundColor;
//             } else if (settings.backgroundStyle === 'gradient') {
//               storyContainer.style.backgroundImage = this.getGradient(settings.selectedGradient, settings.backgroundOpacity);
//             }
//           }
//           break;

//         case 'custom':
//           reset();
//           backgroundImageContainer.style.width = '66.666667%';
//           if (settings.mode === 'night') {
//             // Ở chế độ ban đêm, vô hiệu hóa cả 2 cài đặt màu nền và gradient
//             backgroundImageContainer.style.backgroundImage = 'none';
//             storyContainer.style.backgroundColor = '#2c2c2c';
//             storyContainer.style.backgroundImage = 'none';
//             parentComponent.style.backgroundColor = '#2c2c2c';
//             parentComponent.style.backgroundImage = 'none';
//           } else {
//             // Áp dụng màu nền và gradient khi không ở chế độ ban đêm
//             backgroundImageContainer.style.backgroundImage = `url(${settings.backgroundImage})`;
//             if (settings.backgroundStyle === 'solid') {
//               storyContainer.style.backgroundColor = settings.backgroundColor;
//             } else if (settings.backgroundStyle === 'gradient') {
//               storyContainer.style.backgroundImage = this.getGradient(settings.selectedGradient, settings.backgroundOpacity);
//             }
//             if (settings.customBackgroundStyle === 'solid') {
//               parentComponent.style.backgroundColor = settings.customBackgroundColor;
//             } else if (settings.customBackgroundStyle === 'gradient') {
//               parentComponent.style.backgroundImage = this.getGradient(settings.customSelectedGradient, settings.customBackgroundOpacity);
//             }
//           }
//           break;
//       }

//       // Áp dụng cài đặt font, cỡ chữ, line height
//       if (contentContainer) {
//         contentContainer.style.fontFamily = settings.fontFamily;
//         contentContainer.style.fontSize = `${settings.fontSize}px`;
//         contentContainer.style.lineHeight = settings.lineHeight;
//       }

//       // Áp dụng ánh sáng vàng và độ sáng
//       if (storyContainer) {
//         storyContainer.style.filter = settings.yellowLightMode ? 'sepia(70%) brightness(100%)' : `brightness(${settings.brightness}%)`;
//       }

//       // Áp dụng màu nền và màu chữ theo chế độ ban đêm
//       parentComponent.style.color = settings.mode === 'night' ? '#ffffff' : '#000000';

//       this.showModal = false;
//     },

//     // Hàm phụ để lấy gradient theo tên
//     getGradient(gradientName, opacity) {
//       const gradientOpacity = `rgba(255, 255, 255, ${opacity})`;
//       switch (gradientName) {
//         case 'netflix':
//           return `linear-gradient(to left, ${gradientOpacity}, rgba(142, 14, 0, ${opacity}))`;
//         case 'vine':
//           return `linear-gradient(to left, ${gradientOpacity}, rgba(0, 191, 143, ${opacity}))`;
//         case 'megatron':
//           return `linear-gradient(to left, ${gradientOpacity}, rgba(251, 215, 134, ${opacity}), rgba(198, 255, 221, ${opacity}))`;
//         default:
//           return 'none';
//       }
//     },
//   },
// });


// Phiên bản composition api:
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import background1 from '../assets/img/1.jpg';

export const useSettingsStore = defineStore('settings', () => {
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

  const fontOptions = ref([
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
  ]);

  const gradientOptions = ref([
    { label: 'Netflix', value: 'netflix' },
    { label: 'Vine', value: 'vine' },
    { label: 'Megatron', value: 'megatron' },
  ]);

  const customGradientOptions = ref([
    { label: 'Netflix', value: 'netflix' },
    { label: 'Vine', value: 'vine' },
    { label: 'Megatron', value: 'megatron' },
  ]);

  const backgroundOptions = ref([
    { label: 'Không', value: '' },
    { label: 'Hình nền 1', value: background1 },
    { label: 'Hình nền 2', value: 'background2.jpg' },
  ]);

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

  return {
    showModal,
    screenMode,
    backgroundStyle,
    selectedGradient,
    brightness,
    mode,
    yellowLightMode,
    fontFamily,
    fontSize,
    backgroundImage,
    backgroundColor,
    lineHeight,
    customBackgroundStyle,
    customBackgroundColor,
    customSelectedGradient,
    backgroundOpacity,
    customBackgroundOpacity,
    fontOptions,
    gradientOptions,
    customGradientOptions,
    backgroundOptions,
    applySettings,
    getGradient,
  };
});
