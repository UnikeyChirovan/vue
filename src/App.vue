<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <n-config-provider>
        <n-message-provider>
          <router-view></router-view>
          </n-message-provider>
    </n-config-provider>
 </div>
</template>
<style>
.n-card-header {
  background-color: rgb(240, 236, 221) !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.n-base-icon {
  position: relative; /* Đảm bảo container có relative để icon được định vị đúng */
}

/* .n-base-icon svg {
  height: 200%;
  width: 200%;
  background-color: red;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
} */
.n-form-item-f.n-form-item.n-form-item-feedback-wrapper {
  min-height: 8px;
}
.error {
  color: red;
  margin-top: -4px !important;
  margin-bottom: 4px !important;
}
</style>
