<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
        >
          <div class="toast-icon">
            <i :class="getIcon(toast.type)"></i>
          </div>
          <div class="toast-content">
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button @click="removeToast(toast.id)" class="toast-close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);

const addToast = (message, type = 'info', duration = 3000) => {
  const id = Date.now() + Math.random();
  const newToast = { id, message, type };

  toasts.value.push(newToast);

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
};

const removeToast = (id) => {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const getIcon = (type) => {
  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info',
  };
  return icons[type] || icons.info;
};

// Expose methods
defineExpose({
  success: (msg, duration) => addToast(msg, 'success', duration),
  error: (msg, duration) => addToast(msg, 'error', duration),
  warning: (msg, duration) => addToast(msg, 'warning', duration),
  info: (msg, duration) => addToast(msg, 'info', duration),
});
</script>

<style scoped>
/* ========== TOAST CONTAINER ========== */
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

/* ========== TOAST ========== */
.toast {
  min-width: 320px;
  max-width: 420px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  border-left: 4px solid;
  animation: slideIn 0.3s ease;
}

html.dark-mode .toast {
  background: #2a2a2a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.toast-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  color: #333;
  word-wrap: break-word;
}

html.dark-mode .toast-message {
  color: #e0e0e0;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #999;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

html.dark-mode .toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

/* ========== TOAST TYPES ========== */
.toast-success {
  border-left-color: #4caf50;
}

.toast-success .toast-icon {
  color: #4caf50;
}

.toast-error {
  border-left-color: #f44336;
}

.toast-error .toast-icon {
  color: #f44336;
}

.toast-warning {
  border-left-color: #ff9800;
}

.toast-warning .toast-icon {
  color: #ff9800;
}

.toast-info {
  border-left-color: #2196f3;
}

.toast-info .toast-icon {
  color: #2196f3;
}

/* ========== ANIMATIONS ========== */
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active {
  animation: slideIn 0.3s ease;
}

.toast-leave-active {
  animation: slideOut 0.3s ease;
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .toast-container {
    top: 70px;
    right: 15px;
    left: 15px;
  }

  .toast {
    min-width: auto;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .toast-container {
    top: 60px;
    right: 10px;
    left: 10px;
  }

  .toast {
    padding: 14px 16px;
    gap: 12px;
  }

  .toast-icon {
    width: 24px;
    height: 24px;
    font-size: 1.2rem;
  }

  .toast-message {
    font-size: 0.9rem;
  }

  .toast-close {
    width: 22px;
    height: 22px;
    font-size: 0.9rem;
  }
}
</style>
