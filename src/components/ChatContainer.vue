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
          :style="{ bottom: `${index * 60}px` }"
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

/* Transitions for chat windows */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s ease;
}

.chat-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Minimized chats */
.minimized-chats {
  position: fixed;
  bottom: 0;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  z-index: 998;
}

.bubble-list {
  position: relative;
}

.chat-bubble {
  position: absolute;
  right: 0;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-bubble:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.chat-bubble:hover .bubble-close {
  opacity: 1;
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
  width: 50px;
  height: 50px;
}

.bubble-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
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

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3b30;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.bubble-close {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: #ff3b30;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}

.bubble-close:hover {
  background: #d32f2f;
}

/* Bubble transitions */
.bubble-enter-active,
.bubble-leave-active {
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
}
</style>
