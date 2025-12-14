<template>
  <div class="scroll-buttons-container">
    <button
      class="scroll-button scroll-top"
      @click="scrollToBottom"
      :class="{ visible: showButtons }"
    >
      <slot name="top-button"></slot>
    </button>
    <button
      class="scroll-button scroll-bottom"
      @click="scrollToTop"
      :class="{ visible: showButtons }"
    >
      <slot name="bottom-button"></slot>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showButtons = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
};

const handleScroll = () => {
  showButtons.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-buttons-container {
  position: fixed;
  right: 0;
  z-index: 1000;
}

.scroll-button {
  position: fixed;
  right: 15px;
  padding: 0;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  visibility: hidden;
  transform: scale(0.8);
  overflow: hidden;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-button.visible {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

.scroll-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.scroll-button:hover::before {
  width: 100px;
  height: 100px;
}

.scroll-button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.5);
}

.scroll-button:active {
  transform: scale(0.95);
}

.scroll-top {
  top: 168px;
}

.scroll-bottom {
  bottom: 15px;
}

/* Style cho nút bên trong slot */
.scroll-button :deep(.ant-btn) {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-button :deep(.ant-btn):hover {
  background: transparent !important;
}

.scroll-button :deep(.ant-btn i) {
  font-size: 1.3rem;
  color: white;
  position: relative;
  z-index: 1;
}

/* Animation cho icon */
.scroll-top :deep(.ant-btn i) {
  animation: bounce-down 2s ease-in-out infinite;
}

.scroll-bottom :deep(.ant-btn i) {
  animation: bounce-up 2s ease-in-out infinite;
}

@keyframes bounce-down {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}

@keyframes bounce-up {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .scroll-button {
    width: 46px;
    height: 46px;
    right: 15px;
  }

  .scroll-top {
    top: 158px;
  }

  .scroll-bottom {
    bottom: 15px;
  }

  .scroll-button :deep(.ant-btn i) {
    font-size: 1.2rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .scroll-button {
    width: 48px;
    height: 48px;
    right: 15px;
  }

  .scroll-top {
    top: 148px;
  }

  .scroll-bottom {
    bottom: 168px;
  }

  .scroll-button :deep(.ant-btn i) {
    font-size: 1.15rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .scroll-button {
    width: 48px;
    height: 48px;
    right: 12px;
  }

  .scroll-top {
    top: 138px;
  }

  .scroll-bottom {
    bottom: 158px;
  }

  .scroll-button :deep(.ant-btn i) {
    font-size: 1.1rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .scroll-button {
    width: 45px;
    height: 45px;
    right: 10px;
  }

  .scroll-top {
    top: 128px;
  }

  .scroll-bottom {
    bottom: 148px;
  }

  .scroll-button :deep(.ant-btn i) {
    font-size: 1rem;
  }
}
</style>
