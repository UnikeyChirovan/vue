import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiLinks from '../services/api-links';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from './auth';

window.Pusher = Pusher;

export const useChatStore = defineStore('chat', () => {
  // State
  const openChats = ref([]);
  const minimizedChats = ref([]);
  const chatHistory = ref([]);
  const unreadCount = ref(0);
  const echo = ref(null);
  const notificationAudio = ref(null);
  const audioInitialized = ref(false);
  const backendUrl = 'http://127.0.0.1:8000';

  // Constants
  const MAX_OPEN_CHATS = 3;
  const MAX_MINIMIZED_CHATS = 5;

  // Getters
  const totalUnreadMessages = computed(() => {
    return chatHistory.value.reduce(
      (total, chat) => total + (chat.unread || 0),
      0
    );
  });

  // Helper function to get avatar URL
  const getAvatarUrl = (userId, avatar) => {
    if (!avatar) return 'https://picsum.photos/50';

    // Nếu avatar đã là full URL thì dùng luôn
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }

    // Nếu chỉ là filename thì ghép với backendUrl
    return `${backendUrl}/storage/avatars/${userId}/${avatar}`;
  };

  // Initialize audio on first user interaction
  const initAudio = () => {
    if (audioInitialized.value) return;

    try {
      notificationAudio.value = new Audio('/sounds/notification.mp3');
      notificationAudio.value.volume = 0.3;
      notificationAudio.value.load();

      // Test play để unlock audio (volume = 0 để không nghe thấy)
      notificationAudio.value.volume = 0;
      const testPlay = notificationAudio.value.play();

      if (testPlay !== undefined) {
        testPlay
          .then(() => {
            notificationAudio.value.pause();
            notificationAudio.value.currentTime = 0;
            notificationAudio.value.volume = 0.3;
            audioInitialized.value = true;
          })
          .catch(() => {
            // Sẽ retry khi có interaction tiếp theo
          });
      }
    } catch (error) {
      console.error('Audio init failed:', error);
    }
  };

  // Actions
  const openChat = async (user) => {
    // Initialize audio on first interaction
    if (!audioInitialized.value) {
      initAudio();
    }

    const existingOpenIndex = openChats.value.findIndex(
      (chat) => chat.id === user.id
    );
    const existingMinimizedIndex = minimizedChats.value.findIndex(
      (chat) => chat.id === user.id
    );

    // Nếu chat đã mở, chỉ cần đưa lên đầu và mark as read
    if (existingOpenIndex !== -1) {
      const [chat] = openChats.value.splice(existingOpenIndex, 1);
      openChats.value.unshift(chat);
      // Mark as read khi mở lại chat
      markAsRead(chat.id);
      return;
    }

    // Nếu chat đang minimized, mở ra và mark as read
    if (existingMinimizedIndex !== -1) {
      const [chat] = minimizedChats.value.splice(existingMinimizedIndex, 1);
      openChats.value.unshift({ ...chat, minimized: false });

      // Mark as read ngay khi mở từ minimized
      markAsRead(chat.id);

      if (openChats.value.length > MAX_OPEN_CHATS) {
        const lastChat = openChats.value.pop();
        minimizedChats.value.unshift({ ...lastChat, minimized: true });
      }
      return;
    }

    // Create or get conversation
    try {
      const response = await apiLinks.chat.getOrCreateConversation(user.id);
      const conversation = response.data.conversation;

      const newChat = {
        id: conversation.user_id,
        conversationId: conversation.id,
        name: user.name || conversation.name,
        avatar: getAvatarUrl(
          conversation.user_id,
          user.avatar || conversation.avatar
        ),
        messages: [],
        unread: 0,
        minimized: false,
        online: false,
        typing: false,
      };
      // Fetch online status của user
      try {
        const statusRes = await apiLinks.users.getOnlineStatus(
          conversation.user_id
        );
        newChat.online = statusRes.data.online;
      } catch (error) {
        console.error('Error fetching online status:', error);
      }

      // Load messages
      await loadMessages(newChat);

      // Add to history if not exists
      if (!chatHistory.value.find((c) => c.id === user.id)) {
        chatHistory.value.unshift(newChat);
      }

      if (openChats.value.length >= MAX_OPEN_CHATS) {
        const lastChat = openChats.value.pop();
        minimizedChats.value.unshift({ ...lastChat, minimized: true });

        if (minimizedChats.value.length > MAX_MINIMIZED_CHATS) {
          minimizedChats.value.pop();
        }
      }

      openChats.value.unshift(newChat);

      // Mark as read ngay sau khi mở chat mới
      if (newChat.conversationId) {
        markAsRead(newChat.id);
      }
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const loadMessages = async (chat) => {
    try {
      const response = await apiLinks.chat.getMessages(chat.conversationId);
      chat.messages = response.data.messages.map((msg) => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender_id === chat.id ? chat.id : 'me',
        timestamp: msg.timestamp,
        read: msg.is_read,
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const closeChat = (chatId) => {
    const index = openChats.value.findIndex((chat) => chat.id === chatId);
    if (index !== -1) {
      const [chat] = openChats.value.splice(index, 1);
      minimizedChats.value.unshift({ ...chat, minimized: true });

      if (minimizedChats.value.length > MAX_MINIMIZED_CHATS) {
        minimizedChats.value.pop();
      }
    }
  };

  const minimizeChat = (chatId) => {
    const index = openChats.value.findIndex((chat) => chat.id === chatId);
    if (index !== -1) {
      const [chat] = openChats.value.splice(index, 1);
      minimizedChats.value.unshift({ ...chat, minimized: true });

      if (minimizedChats.value.length > MAX_MINIMIZED_CHATS) {
        minimizedChats.value.pop();
      }
    }
  };

  const removeMinimizedChat = (chatId) => {
    const index = minimizedChats.value.findIndex((chat) => chat.id === chatId);
    if (index !== -1) {
      minimizedChats.value.splice(index, 1);
    }
  };

  const sendMessage = async (chatId, message) => {
    // Initialize audio on first interaction
    if (!audioInitialized.value) {
      initAudio();
    }

    const chat =
      openChats.value.find((c) => c.id === chatId) ||
      minimizedChats.value.find((c) => c.id === chatId);

    if (!chat) return;

    try {
      const response = await apiLinks.chat.sendMessage(chatId, message);
      const newMessage = response.data.message;

      const formattedMessage = {
        id: newMessage.id,
        text: newMessage.message,
        sender: 'me',
        timestamp: newMessage.timestamp,
        read: false,
      };

      chat.messages.push(formattedMessage);

      // Update history
      const historyChat = chatHistory.value.find((c) => c.id === chatId);
      if (historyChat) {
        historyChat.lastMessage = message;
        historyChat.lastMessageTime = new Date();

        const index = chatHistory.value.findIndex((c) => c.id === chatId);
        if (index > 0) {
          const [movedChat] = chatHistory.value.splice(index, 1);
          chatHistory.value.unshift(movedChat);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const receiveMessage = (data) => {
    const { sender_id, message, timestamp, sender, conversation_id } = data;

    let chat = openChats.value.find((c) => c.id === sender_id);
    let isMinimized = false;

    if (!chat) {
      chat = minimizedChats.value.find((c) => c.id === sender_id);
      isMinimized = true;
    }

    if (!chat) {
      chat = {
        id: sender_id,
        conversationId: conversation_id,
        name: sender.name,
        avatar: getAvatarUrl(sender_id, sender.avatar),
        messages: [],
        unread: 0,
        minimized: true,
      };
      minimizedChats.value.unshift(chat);
      isMinimized = true;
    }

    const newMessage = {
      id: data.id,
      text: message,
      sender: sender_id,
      timestamp: timestamp,
      read: false,
    };

    chat.messages.push(newMessage);

    // CHỈ tăng unread và phát âm thanh khi chat KHÔNG được mở (minimized hoặc closed)
    const isOpen = openChats.value.find((c) => c.id === sender_id);

    if (!isOpen) {
      // Chat đang minimized hoặc chưa mở
      chat.unread = (chat.unread || 0) + 1;
      unreadCount.value++;

      playNotificationSound();
      triggerBubbleShake(sender_id);
    } else {
      // Chat đang mở - mark as read ngay
      markAsRead(sender_id);
    }

    updateChatHistory(sender_id, message, timestamp, sender, !isOpen);
  };

  const updateChatHistory = (
    userId,
    lastMessage,
    timestamp,
    sender,
    shouldIncreaseUnread = false
  ) => {
    let historyChat = chatHistory.value.find((c) => c.id === userId);

    if (!historyChat) {
      historyChat = {
        id: userId,
        name: sender?.name || 'Unknown',
        avatar: getAvatarUrl(userId, sender?.avatar),
        lastMessage: lastMessage,
        lastMessageTime: new Date(timestamp),
        unread: shouldIncreaseUnread ? 1 : 0,
      };
      chatHistory.value.unshift(historyChat);
    } else {
      historyChat.lastMessage = lastMessage;
      historyChat.lastMessageTime = new Date(timestamp);

      // Chỉ tăng unread nếu chat không được mở
      if (shouldIncreaseUnread) {
        historyChat.unread = (historyChat.unread || 0) + 1;
      }

      const index = chatHistory.value.findIndex((c) => c.id === userId);
      if (index > 0) {
        const [chat] = chatHistory.value.splice(index, 1);
        chatHistory.value.unshift(chat);
      }
    }
  };

  const markAsRead = async (chatId) => {
    const chat =
      openChats.value.find((c) => c.id === chatId) ||
      minimizedChats.value.find((c) => c.id === chatId);

    if (!chat || !chat.conversationId) return;

    // Lấy số unread hiện tại trước khi gọi API
    const currentUnread = chat.unread || 0;

    if (currentUnread > 0) {
      try {
        await apiLinks.chat.markAsRead(chat.conversationId);

        // Giảm tổng unread count
        unreadCount.value -= currentUnread;
        if (unreadCount.value < 0) unreadCount.value = 0;

        // Reset unread của chat
        chat.unread = 0;

        // Mark tất cả messages là đã đọc
        chat.messages.forEach((msg) => {
          if (!msg.read && msg.sender !== 'me') {
            msg.read = true;
          }
        });

        // Update history
        const historyChat = chatHistory.value.find((c) => c.id === chatId);
        if (historyChat) {
          historyChat.unread = 0;
        }
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await apiLinks.chat.getConversations();
      chatHistory.value = response.data.conversations.map((conv) => ({
        id: conv.user_id,
        conversationId: conv.id,
        name: conv.name,
        avatar: getAvatarUrl(conv.user_id, conv.avatar),
        lastMessage: conv.last_message,
        lastMessageTime: conv.last_message_time
          ? new Date(conv.last_message_time)
          : null,
        unread: conv.unread || 0,
        online: conv.online || false,
      }));

      // Calculate total unread
      unreadCount.value = chatHistory.value.reduce(
        (total, chat) => total + chat.unread,
        0
      );
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const playNotificationSound = () => {
    if (!audioInitialized.value || !notificationAudio.value) {
      return;
    }

    try {
      // Clone audio để có thể play nhiều lần đồng thời
      const audio = notificationAudio.value.cloneNode();
      audio.volume = 0.3;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Bỏ qua lỗi autoplay
        });
      }
    } catch (error) {
      // Bỏ qua lỗi
    }
  };

  const triggerBubbleShake = (chatId) => {
    const bubble = document.getElementById(`chat-bubble-${chatId}`);
    if (bubble) {
      bubble.classList.add('shake');
      setTimeout(() => {
        bubble.classList.remove('shake');
      }, 500);
    }
  };

  // ===== CHỨC NĂNG XÓA TIN NHẮN =====

  // Xóa một tin nhắn
  const deleteMessage = async (chatId, messageId) => {
    try {
      await apiLinks.chat.deleteMessage(messageId);

      // Xóa khỏi state
      const chat =
        openChats.value.find((c) => c.id === chatId) ||
        minimizedChats.value.find((c) => c.id === chatId);

      if (chat) {
        chat.messages = chat.messages.filter((m) => m.id !== messageId);
      }

      // Cập nhật chat history - load lại tin nhắn cuối cùng
      const historyChat = chatHistory.value.find((c) => c.id === chatId);
      if (historyChat && chat) {
        const lastMsg = chat.messages[chat.messages.length - 1];
        if (lastMsg) {
          historyChat.lastMessage = lastMsg.text;
          historyChat.lastMessageTime = lastMsg.timestamp;
        } else {
          historyChat.lastMessage = null;
          historyChat.lastMessageTime = null;
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  // Xóa toàn bộ tin nhắn
  const deleteAllMessages = async (chatId) => {
    try {
      const chat =
        openChats.value.find((c) => c.id === chatId) ||
        minimizedChats.value.find((c) => c.id === chatId);

      if (!chat || !chat.conversationId) {
        throw new Error('Conversation not found');
      }

      await apiLinks.chat.deleteAllMessages(chat.conversationId);

      // Xóa tất cả tin nhắn khỏi state
      if (chat) {
        chat.messages = [];
      }

      // Cập nhật chat history
      const historyChat = chatHistory.value.find((c) => c.id === chatId);
      if (historyChat) {
        historyChat.lastMessage = null;
        historyChat.lastMessageTime = null;
      }
    } catch (error) {
      console.error('Error deleting all messages:', error);
      throw error;
    }
  };

  const connectWebSocket = () => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    const userId = authStore.user?.id;

    if (!token) {
      console.error('No access token found');
      return;
    }

    if (!userId) {
      console.error('No user ID found');
      return;
    }

    echo.value = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
      wsPort: import.meta.env.VITE_REVERB_PORT || 8081,
      wssPort: import.meta.env.VITE_REVERB_PORT || 8081,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    // Listen for incoming messages
    echo.value.private(`chat.${userId}`).listen('.message.sent', (data) => {
      receiveMessage(data);
    });

    // Listen for user online status
    echo.value.channel('user.status').listen('.user.status', (data) => {
      setUserOnlineStatus(data.user_id, data.online);
    });

    // Load chat history
    loadChatHistory();

    // Initialize audio on ANY user interaction
    const initOnInteraction = () => {
      if (!audioInitialized.value) {
        initAudio();
        document.removeEventListener('click', initOnInteraction);
        document.removeEventListener('keypress', initOnInteraction);
        document.removeEventListener('touchstart', initOnInteraction);
      }
    };

    document.addEventListener('click', initOnInteraction);
    document.addEventListener('keypress', initOnInteraction);
    document.addEventListener('touchstart', initOnInteraction);

    // Thử init sớm (có thể bị block)
    setTimeout(() => {
      if (!audioInitialized.value) {
        initAudio();
      }
    }, 1000);
  };

  const disconnectWebSocket = () => {
    if (echo.value) {
      echo.value.disconnect();
      echo.value = null;
    }
  };

  const setUserOnlineStatus = (userId, online) => {
    const chat =
      openChats.value.find((c) => c.id === userId) ||
      minimizedChats.value.find((c) => c.id === userId);
    if (chat) {
      chat.online = online;
    }

    const historyChat = chatHistory.value.find((c) => c.id === userId);
    if (historyChat) {
      historyChat.online = online;
    }
  };

  const setTypingStatus = (userId, typing) => {
    const chat = openChats.value.find((c) => c.id === userId);
    if (chat) {
      chat.typing = typing;
    }
  };

  return {
    // State
    openChats,
    minimizedChats,
    chatHistory,
    unreadCount,

    // Getters
    totalUnreadMessages,

    // Actions
    openChat,
    closeChat,
    minimizeChat,
    removeMinimizedChat,
    sendMessage,
    receiveMessage,
    markAsRead,
    loadChatHistory,
    connectWebSocket,
    disconnectWebSocket,
    setUserOnlineStatus,
    setTypingStatus,
    playNotificationSound,
    triggerBubbleShake,

    // Delete actions
    deleteMessage,
    deleteAllMessages,
  };
});
