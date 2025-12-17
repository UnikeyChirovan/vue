import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    brightness: 100,
    mode: 'day',
    yellowLightMode: false,
    screenMode: 'full',
    fontFamily: 'Arial',
    fontSize: 20,
    backgroundMode: 'none',
    backgroundImage: '',
    backgroundColor: '#ffffff',
    lineHeight: 1.5,
    customBackgroundStyle: 'solid',
    customBackgroundColor: '#ffffff',
    customSelectedGradient: '',
    backgroundOpacity: 1,
    customBackgroundOpacity: 1,
    backgroundStyle: 'solid',
    selectedGradient: '',
    selectedBackground: 'none',
  }),
  actions: {
    loadSettings() {
      const savedSettings = sessionStorage.getItem('user-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        Object.keys(parsed).forEach((key) => {
          if (this.$state.hasOwnProperty(key)) {
            this.$state[key] = parsed[key];
          }
        });
      }
    },
    saveSettings() {
      sessionStorage.setItem('user-settings', JSON.stringify(this.$state));
    },
    updateSetting(key, value) {
      this.$state[key] = value;
      this.saveSettings();
    },
  },
});
