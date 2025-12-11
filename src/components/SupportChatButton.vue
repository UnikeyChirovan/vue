<template>
  <div
    v-if="
      authStore.isLoggedIn &&
      shouldShowButton &&
      !supportStore.isOpen &&
      isSupportButtonEnabled
    "
    class="support-button-container"
    :style="buttonStyle"
    @mousedown="startDrag"
  >
    <button class="support-button" @click.stop="handleClick">
      <i class="fa-solid fa-headset"></i>
      <span class="support-text">Hỗ Trợ</span>
      <span v-if="unreadCount > 0" class="support-badge">
        {{ unreadCount }}
      </span>

      <span class="close-support-btn" @click.stop="closeSupportButton">
        <i class="fa-solid fa-xmark"></i>
      </span>
    </button>
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
const hasDragged = ref(false); // Track if actually dragged
const dragStart = ref({ x: 0, y: 0 });
const dragThreshold = 5; // Minimum pixels to consider as drag

// Support button enabled state
const isSupportButtonEnabled = ref(
  localStorage.getItem('supportButtonEnabled') !== 'false'
);

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
  };
});

// Drag functions
const startDrag = (e) => {
  // Ngăn drag nếu click vào nút close
  if (e.target.closest('.close-support-btn')) {
    return;
  }

  isDragging.value = true;
  hasDragged.value = false; // Reset drag flag

  dragStart.value = {
    x: e.clientX - (position.value.x ?? window.innerWidth - 90),
    y: e.clientY - position.value.y,
    startX: e.clientX,
    startY: e.clientY,
  };

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);

  // Prevent text selection during drag
  e.preventDefault();
};

const onDrag = (e) => {
  if (!isDragging.value) return;

  // Calculate distance moved
  const deltaX = Math.abs(e.clientX - dragStart.value.startX);
  const deltaY = Math.abs(e.clientY - dragStart.value.startY);

  // If moved more than threshold, mark as dragged
  if (deltaX > dragThreshold || deltaY > dragThreshold) {
    hasDragged.value = true;
  }

  // Only update position if actually dragging
  if (hasDragged.value) {
    const newX = e.clientX - dragStart.value.x;
    const newY = e.clientY - dragStart.value.y;

    // Constrain to viewport
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 60;

    position.value.x = Math.max(0, Math.min(newX, maxX));
    position.value.y = Math.max(0, Math.min(newY, maxY));

    // Save to localStorage
    localStorage.setItem(
      'supportButtonPosition',
      JSON.stringify(position.value)
    );
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// Handle click - only open if not dragged
const handleClick = () => {
  // Only open chat if we didn't actually drag
  if (!hasDragged.value) {
    openSupportChat();
  }

  // Reset drag flag
  hasDragged.value = false;
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

  // Listen for toggle from settings
  const handleToggle = (event) => {
    isSupportButtonEnabled.value = event.detail;
  };

  window.addEventListener('supportButtonToggle', handleToggle);

  // Load unread count
  supportStore.loadUnreadCount();

  // Subscribe to WebSocket
  supportStore.subscribeToUserChannel();

  // Poll unread count every 30s
  const interval = setInterval(() => {
    if (authStore.isLoggedIn) {
      supportStore.loadUnreadCount();
    }
  }, 30000);

  onUnmounted(() => {
    clearInterval(interval);
    window.removeEventListener('supportButtonToggle', handleToggle);
  });
});
</script>

<style scoped>
.support-button-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  user-select: none;
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

/* Mobile responsive */
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

  .close-support-btn {
    width: 20px;
    height: 20px;
    font-size: 10px;
    top: -5px;
    right: -5px;
  }
}
</style>
