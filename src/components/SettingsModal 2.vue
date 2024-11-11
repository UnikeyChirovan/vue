<template>
  <div>
    <n-button type="primary" @click="settingsStore.showModal = true" class="settings-button">
      Cài đặt
    </n-button>
    <n-modal v-model:show="settingsStore.showModal" preset="card" title="Cài đặt" style="width: 450px;">
      <n-space vertical>
        <n-form-item label="Độ sáng">
          <i class="fa fa-adjust me-2"></i>
          <n-slider v-model:value="settingsStore.brightness" :min="0" :max="100" />
        </n-form-item>

        <div class="d-flex justify-content-between align-items-center">
          <span>
            <n-form-item label="Chế độ">
              <i class="fa fa-sun me-2"></i>
              <n-switch v-model:value="settingsStore.mode" :checked-value="'night'" :unchecked-value="'day'" class="me-2">
                {{ settingsStore.mode === 'night' ? 'Ánh sáng ban đêm' : 'Ánh sáng ban ngày' }}
              </n-switch>
              <i class="fa fa-moon"></i>
            </n-form-item>
          </span>
          <span>
            <n-form-item label="Ánh sáng vàng">
              <n-switch v-model:value="settingsStore.yellowLightMode">
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
                <input id="full" name="screen-mode" type="radio" v-model="settingsStore.screenMode" value="full" />
                <label for="full">Full</label>

                <input id="partial" name="screen-mode" type="radio" v-model="settingsStore.screenMode" value="partial" />
                <label for="partial">Partial</label>

                <input id="custom" name="screen-mode" type="radio" v-model="settingsStore.screenMode" value="custom" />
                <label for="custom">Custom</label>
              </div>
            </n-form-item>
          </span>
        </div>

        <n-form-item label="Font chữ">
          <i class="fa fa-font me-2"></i>
          <n-select v-model:value="settingsStore.fontFamily" :options="settingsStore.fontOptions" />
        </n-form-item>

        <n-form-item label="Cỡ chữ">
          <i class="fa fa-text-height me-2"></i>
          <n-slider v-model:value="settingsStore.fontSize" :min="12" :max="30" />
        </n-form-item>

        <n-form-item label="Hình nền">
          <n-select v-model:value="settingsStore.backgroundImage" :options="settingsStore.backgroundOptions" />
        </n-form-item>

        <div class="row">
          <div class="col-12 col-md-6">
            <n-form-item label="Kiểu nền">
              <n-radio-group v-model:value="settingsStore.backgroundStyle">
                <n-radio label="Đơn sắc" value="solid">Đơn sắc</n-radio>
                <n-radio label="Dải màu" value="gradient">Dải màu</n-radio>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="settingsStore.backgroundStyle === 'solid'" label="Màu nền">
              <n-color-picker v-model:value="settingsStore.backgroundColor" />
            </n-form-item>
            <n-form-item v-if="settingsStore.backgroundStyle === 'gradient'" label="Dải màu">
              <n-select v-model:value="settingsStore.selectedGradient" :options="settingsStore.gradientOptions" />
            </n-form-item>
            <n-form-item v-if="settingsStore.backgroundStyle === 'gradient'" label="Độ trong suốt dải màu">
              <n-slider v-model:value="settingsStore.backgroundOpacity" :min="0" :max="1" step="0.01" />
            </n-form-item>
          </div>

          <div class="col-12 col-md-6" v-if="settingsStore.screenMode === 'custom'">
            <n-form-item label="Nền tùy chỉnh">
              <n-radio-group v-model:value="settingsStore.customBackgroundStyle">
                <n-radio label="Đơn sắc" value="solid">Đơn sắc</n-radio>
                <n-radio label="Dải màu" value="gradient">Dải màu</n-radio>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="settingsStore.customBackgroundStyle === 'solid'" label="Màu nền">
              <n-color-picker v-model:value="settingsStore.customBackgroundColor" />
            </n-form-item>
            <n-form-item v-if="settingsStore.customBackgroundStyle === 'gradient'" label="Dải màu">
              <n-select v-model:value="settingsStore.customSelectedGradient" :options="settingsStore.customGradientOptions" />
            </n-form-item>
            <n-form-item v-if="settingsStore.customBackgroundStyle === 'gradient'" label="Độ trong suốt dải màu">
              <n-slider v-model:value="settingsStore.customBackgroundOpacity" :min="0" :max="1" step="0.01" />
            </n-form-item>
          </div>
        </div>

        <n-form-item label="Chiều cao dòng">
          <n-icon size="30"><AutoFitHeight20Regular /></n-icon>
          <n-slider v-model:value="settingsStore.lineHeight" :min="1" :max="2" step="0.1" />
        </n-form-item>

        <n-button type="primary" @click="applySettings" style="width: 100%;">Áp dụng</n-button>
      </n-space>
    </n-modal>
  </div>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { useSettingsStore } from '../stores/useSettingsStore';
  import { useAuthStore } from '../stores/auth';
  import AutoFitHeight20Regular from '@vicons/fluent/AutoFitHeight20Regular';
  
  const settingsStore = useSettingsStore();
  const authStore = useAuthStore();
  const showModal = ref(false);

  const applySettings = () => {
    settingsStore.applySettings();
    showModal.value = false;
  };

  onMounted(() => {
    settingsStore.loadSettings(); 
    settingsStore.fetchBackgrounds(); 
    if (authStore.user?.id) {
      settingsStore.fetchUserSettings(authStore.user.id);
    }
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
