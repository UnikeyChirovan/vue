<template>
  <div>
    <!-- Drop Zone - chỉ hiện khi đang kéo trên mobile/tablet -->
    <div
      v-if="isDragging && isMobileOrTablet"
      class="drop-zone"
      :class="{ 'drop-zone-active': isOverDropZone }"
    >
      <div class="drop-zone-content">
        <i class="fa-solid fa-trash-can"></i>
        <span class="drop-zone-text">Thả vào đây để tắt</span>
      </div>
    </div>

    <!-- Support Button -->
    <div
      v-if="
        authStore.isLoggedIn &&
        shouldShowButton &&
        !supportStore.isOpen &&
        isSupportButtonEnabled
      "
      class="support-button-container"
      :class="{ dragging: isDragging }"
      :style="buttonStyle"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <button class="support-button">
        <i class="fa-solid fa-headset"></i>
        <span class="support-text">Hỗ Trợ</span>
        <span v-if="unreadCount > 0" class="support-badge">
          {{ unreadCount }}
        </span>

        <!-- Close button - chỉ hiện trên desktop khi hover -->
        <span
          v-if="!isMobileOrTablet"
          class="close-support-btn"
          @click.stop="closeSupportButton"
        >
          <i class="fa-solid fa-xmark"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSupportChatStore } from '../stores/supportChatStore';
import { useMessage } from 'naive-ui';

const authStore = useAuthStore();
const supportStore = useSupportChatStore();
const route = useRoute();
const message = useMessage();

// Position state
const position = ref({
  x: null,
  y: window.innerHeight / 2 - 30,
});

const isDragging = ref(false);
const hasDragged = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const dragThreshold = 5;
const isOverDropZone = ref(false);

// Support button enabled state
const isSupportButtonEnabled = ref(
  localStorage.getItem('supportButtonEnabled') !== 'false'
);

// Detect mobile/tablet
const isMobileOrTablet = ref(window.innerWidth <= 1023);

// Drop zone area (bottom center)
const dropZone = {
  x: window.innerWidth / 2 - 60, // center - half width of zone
  y: window.innerHeight - 120,
  width: 120,
  height: 80,
};

// Update drop zone on resize
const updateDropZone = () => {
  dropZone.x = window.innerWidth / 2 - 60;
  dropZone.y = window.innerHeight - 120;
};

// Check if position is over drop zone
const checkDropZone = (x, y) => {
  const buttonCenterX = x + 40; // approximate button center
  const buttonCenterY = y + 30;

  return (
    buttonCenterX >= dropZone.x &&
    buttonCenterX <= dropZone.x + dropZone.width &&
    buttonCenterY >= dropZone.y &&
    buttonCenterY <= dropZone.y + dropZone.height
  );
};

// Constrain position
const constrainPosition = () => {
  const minVisiblePart = 30;
  const buttonHeight = 60;

  const minX = 0;
  const maxX = window.innerWidth - minVisiblePart;
  const minY = 70;
  const maxY = window.innerHeight - buttonHeight;

  if (position.value.x !== null) {
    if (position.value.x < minX) {
      position.value.x = minX;
    } else if (position.value.x > maxX) {
      position.value.x = maxX;
    }
  }

  if (position.value.y < minY) {
    position.value.y = minY;
  } else if (position.value.y > maxY) {
    position.value.y = maxY;
  }

  localStorage.setItem('supportButtonPosition', JSON.stringify(position.value));
};

// Handle resize
const handleResize = () => {
  isMobileOrTablet.value = window.innerWidth <= 1023;
  updateDropZone();
  constrainPosition();
};

// Unread count
const unreadCount = computed(() => supportStore.unreadCount);

// Check if button should show on current route
const shouldShowButton = computed(() => {
  const hiddenRoutes = [
    'profile-info',
    'profile-guest',
    'profile-settings',
    'profile-followed-list',
    'profile-blocked-list',
    'support-dashboard',
    'support-statistics',
  ];

  const routeName = route.name;

  if (routeName && routeName.toString().startsWith('admin-')) {
    return false;
  }

  if (hiddenRoutes.includes(routeName)) {
    return false;
  }

  return true;
});

// Button style
const buttonStyle = computed(() => {
  const x = position.value.x ?? window.innerWidth - 90;
  return {
    transform: `translate(${x}px, ${position.value.y}px)`,
    cursor: isDragging.value ? 'grabbing' : 'grab',
    opacity: isOverDropZone.value ? 0.6 : 1,
  };
});

// Start drag
const startDrag = (e) => {
  if (e.target.closest('.close-support-btn')) {
    return;
  }

  isDragging.value = true;
  hasDragged.value = false;

  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

  dragStart.value = {
    x: clientX - (position.value.x ?? window.innerWidth - 90),
    y: clientY - position.value.y,
    startX: clientX,
    startY: clientY,
  };

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('touchend', stopDrag);

  e.preventDefault();
};

// On drag
const onDrag = (e) => {
  if (!isDragging.value) return;

  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

  const deltaX = Math.abs(clientX - dragStart.value.startX);
  const deltaY = Math.abs(clientY - dragStart.value.startY);

  if (deltaX > dragThreshold || deltaY > dragThreshold) {
    hasDragged.value = true;
  }

  if (hasDragged.value) {
    const newX = clientX - dragStart.value.x;
    const newY = clientY - dragStart.value.y;

    const minVisiblePart = 30;
    const buttonHeight = 60;

    const minX = 0;
    const maxX = window.innerWidth - minVisiblePart;
    const minY = 70;
    const maxY = window.innerHeight - buttonHeight;

    position.value.x = Math.max(minX, Math.min(newX, maxX));
    position.value.y = Math.max(minY, Math.min(newY, maxY));

    // Check if over drop zone (only on mobile/tablet)
    if (isMobileOrTablet.value) {
      isOverDropZone.value = checkDropZone(position.value.x, position.value.y);
    }

    localStorage.setItem(
      'supportButtonPosition',
      JSON.stringify(position.value)
    );
  }

  e.preventDefault();
};

// Stop drag
const stopDrag = () => {
  // Check if dropped in drop zone on mobile/tablet
  if (isMobileOrTablet.value && isOverDropZone.value && hasDragged.value) {
    closeSupportButton();
    isOverDropZone.value = false;
    isDragging.value = false;
    hasDragged.value = false;

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
    return;
  }

  if (!hasDragged.value) {
    openSupportChat();
  }

  isDragging.value = false;
  isOverDropZone.value = false;

  setTimeout(() => {
    hasDragged.value = false;
  }, 50);

  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', stopDrag);
};

// Open support chat
const openSupportChat = () => {
  supportStore.openChat();
};

// Close support button
const closeSupportButton = () => {
  isSupportButtonEnabled.value = false;
  localStorage.setItem('supportButtonEnabled', 'false');

  window.dispatchEvent(
    new CustomEvent('supportButtonToggle', { detail: false })
  );

  message.info('Đã tắt nút Hỗ Trợ. Bạn có thể bật lại trong phần Cài Đặt.');
};

// Export method to enable from settings
window.enableSupportButton = () => {
  isSupportButtonEnabled.value = true;
  localStorage.setItem('supportButtonEnabled', 'true');
};

// Load position from localStorage
onMounted(() => {
  const saved = localStorage.getItem('supportButtonPosition');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      position.value = parsed;
    } catch (e) {
      console.error('Error parsing saved position:', e);
    }
  } else {
    position.value.x = window.innerWidth - 90;
  }

  constrainPosition();
  updateDropZone();
  window.addEventListener('resize', handleResize);

  const handleToggle = (event) => {
    isSupportButtonEnabled.value = event.detail;
  };

  window.addEventListener('supportButtonToggle', handleToggle);

  supportStore.loadUnreadCount();
  supportStore.subscribeToUserChannel();

  // const interval = setInterval(() => {
  //   if (authStore.isLoggedIn) {
  //     supportStore.loadUnreadCount();
  //   }
  // }, 30000);

  onUnmounted(() => {
    // clearInterval(interval);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('supportButtonToggle', handleToggle);
  });
});
</script>

<style scoped>
/* Drop Zone */
.drop-zone {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  width: 120px;
  height: 80px;
  background: rgba(255, 59, 48, 0.1);
  border: 2px dashed rgba(255, 59, 48, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 998;
  transition: all 0.3s ease;
  pointer-events: none;
}

.drop-zone-active {
  background: rgba(255, 59, 48, 0.2);
  border-color: rgba(255, 59, 48, 0.8);
  border-width: 3px;
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 8px 24px rgba(255, 59, 48, 0.3);
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #ff3b30;
}

.drop-zone-content i {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.drop-zone-active .drop-zone-content i {
  transform: scale(1.2);
  animation: shake 0.5s ease-in-out;
}

.drop-zone-text {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

@keyframes shake {
  0%,
  100% {
    transform: scale(1.2) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(-10deg);
  }
  75% {
    transform: scale(1.2) rotate(10deg);
  }
}

/* Support Button Container */
.support-button-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  user-select: none;
  will-change: transform;
  touch-action: none;
  transition: opacity 0.3s ease;
}

.support-button-container.dragging {
  z-index: 1000;
}

.support-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
}

.close-support-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 59, 48, 0.95);
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.8);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(255, 59, 48, 0.4);
  z-index: 10;
}

.support-button:hover .close-support-btn {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

.close-support-btn:hover {
  background: #ff3b30;
  transform: scale(1.15);
  box-shadow: 0 3px 12px rgba(255, 59, 48, 0.6);
}

.close-support-btn:active {
  transform: scale(0.95);
}

.support-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.support-button:active {
  transform: translateY(0);
}

.support-button i {
  font-size: 18px;
}

.support-text {
  white-space: nowrap;
}

.support-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff3b30;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 7px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 59, 48, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet (769px - 1023px) */
@media (max-width: 1023px) {
  .support-button {
    padding: 11px 18px;
    font-size: 13px;
  }

  .drop-zone {
    width: 110px;
    height: 75px;
    bottom: 15px;
  }

  .drop-zone-text {
    font-size: 10px;
  }
}

/* Mobile (481px - 768px) */
@media (max-width: 768px) {
  .support-button {
    padding: 10px 16px;
    font-size: 13px;
  }

  .support-text {
    display: none;
  }

  .support-button i {
    font-size: 20px;
  }

  .support-badge {
    top: -6px;
    right: -6px;
    font-size: 10px;
    padding: 2px 6px;
  }

  .drop-zone {
    width: 100px;
    height: 70px;
  }

  .drop-zone-content i {
    font-size: 22px;
  }
}

/* Small Mobile (361px - 480px) */
@media (max-width: 480px) {
  .support-button {
    padding: 9px 14px;
    font-size: 12px;
  }

  .support-button i {
    font-size: 18px;
  }

  .support-badge {
    top: -5px;
    right: -5px;
    font-size: 9px;
    padding: 2px 5px;
    min-width: 18px;
  }

  .drop-zone {
    width: 90px;
    height: 65px;
  }

  .drop-zone-content i {
    font-size: 20px;
  }

  .drop-zone-text {
    font-size: 9px;
  }
}

/* Extra Small Mobile (≤360px) */
@media (max-width: 360px) {
  .support-button {
    padding: 8px 12px;
    font-size: 12px;
  }

  .support-button i {
    font-size: 17px;
  }

  .support-badge {
    top: -4px;
    right: -4px;
    font-size: 8px;
    padding: 1px 4px;
    min-width: 16px;
  }

  .drop-zone {
    width: 85px;
    height: 60px;
  }

  .drop-zone-content i {
    font-size: 18px;
  }

  .drop-zone-text {
    font-size: 8px;
  }
}
</style>
