<template>
  <div class="chat-container">
    <!-- Chat windows (tối đa 3 mở) -->
    <transition-group name="chat-slide" tag="div" class="open-chats">
      <ChatWindow
        v-for="(chat, index) in chatStore.openChats"
        :key="chat.id"
        :chat="chat"
        :index="index"
      />
    </transition-group>

    <!-- Minimized chats (dọc bên phải) -->
    <div class="minimized-chats">
      <transition-group name="bubble" tag="div" class="bubble-list">
        <div
          v-for="(chat, index) in chatStore.minimizedChats"
          :key="chat.id"
          :id="`chat-bubble-${chat.id}`"
          class="chat-bubble"
          :style="{ bottom: `${10 + index * 70}px` }"
          @click="reopenChat(chat)"
        >
          <div class="bubble-avatar">
            <img :src="chat.avatar" :alt="chat.name" />
            <span v-if="chat.online" class="online-dot"></span>
            <span v-if="chat.unread > 0" class="unread-badge">{{
              chat.unread
            }}</span>
          </div>
          <button @click.stop="removeChat(chat.id)" class="bubble-close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '../stores/chatStore';
import ChatWindow from './ChatWindow.vue';

const chatStore = useChatStore();

const reopenChat = (chat) => {
  chatStore.openChat({
    id: chat.id,
    name: chat.name,
    avatar: chat.avatar,
    online: chat.online,
  });
};

const removeChat = (chatId) => {
  chatStore.removeMinimizedChat(chatId);
};
</script>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
  pointer-events: none;
}

.chat-container * {
  pointer-events: auto;
}

.open-chats {
  position: relative;
}

/* ========== TRANSITIONS FOR CHAT WINDOWS ========== */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ========== MINIMIZED CHATS ========== */
.minimized-chats {
  position: fixed;
  bottom: 0;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  z-index: 998;
}

.bubble-list {
  position: relative;
}

.chat-bubble {
  position: absolute;
  right: 0;
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dark Mode */
html.dark-mode .chat-bubble {
  background: #2a2a2a;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.chat-bubble:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}

html.dark-mode .chat-bubble:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
}

.chat-bubble:hover .bubble-close {
  opacity: 1;
  visibility: visible;
}

/* Shake animation */
.chat-bubble.shake {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px) rotate(-5deg);
  }
  75% {
    transform: translateX(10px) rotate(5deg);
  }
}

.bubble-avatar {
  position: relative;
  width: 54px;
  height: 54px;
}

.bubble-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0084ff;
}

html.dark-mode .bubble-avatar img {
  border-color: #4da3ff;
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #44b700;
  border: 2px solid white;
  border-radius: 50%;
}

html.dark-mode .online-dot {
  border-color: #2a2a2a;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3b30;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 7px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.4);
}

.bubble-close {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 22px;
  height: 22px;
  background: #ff3b30;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

html.dark-mode .bubble-close {
  border-color: #2a2a2a;
}

.bubble-close:hover {
  background: #d32f2f;
  transform: scale(1.1);
}

/* ========== BUBBLE TRANSITIONS ========== */
.bubble-enter-active,
.bubble-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bubble-enter-from {
  opacity: 0;
  transform: scale(0) translateX(50px);
}

.bubble-leave-to {
  opacity: 0;
  transform: scale(0) translateX(50px);
}

.bubble-move {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 768px) {
  .minimized-chats {
    right: 15px;
  }

  .chat-bubble {
    width: 58px;
    height: 58px;
  }

  .bubble-avatar {
    width: 48px;
    height: 48px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .minimized-chats {
    right: 10px;
  }

  .chat-bubble {
    width: 54px;
    height: 54px;
  }

  .chat-bubble:hover .bubble-close {
    opacity: 1;
    visibility: visible;
  }

  .bubble-avatar {
    width: 44px;
    height: 44px;
  }

  .bubble-avatar img {
    border-width: 2px;
  }

  .online-dot {
    width: 10px;
    height: 10px;
  }

  .unread-badge {
    font-size: 10px;
    padding: 2px 6px;
    min-width: 18px;
  }

  .bubble-close {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
}
</style>
