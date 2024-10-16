import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    brightness: 100,
    mode: 'day',
    yellowLightMode: false,
    screenMode: 'full',
    fontFamily: 'Arial',
    fontSize: 20,
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
    selectedBackground: '',
  }),
  actions: {
    loadSettings() {
      const savedSettings = sessionStorage.getItem('user-settings')
      if (savedSettings) {
        Object.assign(this.$state, JSON.parse(savedSettings))
      }
    },
    saveSettings() {
      sessionStorage.setItem('user-settings', JSON.stringify(this.$state))
    },
    updateSetting(key, value) {
      this.$state[key] = value
      this.saveSettings()
    }
  }
})
