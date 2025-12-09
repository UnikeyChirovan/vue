import { useChatStore } from '../stores/chatStore';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.heartbeatInterval = null;
  }

  connect(userId) {
    // TODO: Thay đổi URL khi có backend thực
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${userId}`;

    console.log('Attempting WebSocket connection...');

    // Tượng trưng: Không thực sự kết nối
    this.simulateConnection(userId);

    /* 
    // Code thực khi có backend:
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopHeartbeat();
        this.attemptReconnect(userId);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
    */
  }

  simulateConnection(userId) {
    console.log(`[Simulated] WebSocket connected for user ${userId}`);

    const chatStore = useChatStore();

    // Giả lập một số user online
    const onlineUsers = [1, 2, 3, 4, 5];
    onlineUsers.forEach((id) => {
      if (id !== userId) {
        chatStore.setUserOnline(id, true);
      }
    });

    // Giả lập nhận tin nhắn sau 5 giây
    setTimeout(() => {
      this.simulateIncomingMessage();
    }, 5000);

    // Giả lập typing indicator
    setTimeout(() => {
      chatStore.setTyping(2, true);
      setTimeout(() => {
        chatStore.setTyping(2, false);
      }, 2000);
    }, 3000);
  }

  simulateIncomingMessage() {
    const chatStore = useChatStore();

    const mockMessage = {
      senderId: 2,
      senderName: 'Test User',
      senderAvatar: 'avatar.jpg',
      content: 'Xin chào! Đây là tin nhắn mô phỏng từ WebSocket.',
      timestamp: new Date().toISOString(),
    };

    chatStore.receiveMessage(mockMessage);
    console.log('[Simulated] Received message:', mockMessage);
  }

  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      const chatStore = useChatStore();

      switch (message.type) {
        case 'message':
          chatStore.receiveMessage(message.data);
          break;

        case 'typing':
          chatStore.setTyping(message.userId, message.isTyping);
          break;

        case 'online':
          chatStore.setUserOnline(message.userId, true);
          break;

        case 'offline':
          chatStore.setUserOnline(message.userId, false);
          break;

        case 'read':
          // Handle read receipt
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  sendMessage(recipientId, content) {
    console.log('[Simulated] Sending message:', { recipientId, content });

    /*
    // Code thực khi có backend:
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        recipientId,
        content,
        timestamp: new Date().toISOString()
      };
      
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
    */
  }

  sendTyping(recipientId, isTyping) {
    console.log('[Simulated] Sending typing status:', {
      recipientId,
      isTyping,
    });

    /*
    // Code thực khi có backend:
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'typing',
        recipientId,
        isTyping
      };
      
      this.ws.send(JSON.stringify(message));
    }
    */
  }

  markAsRead(senderId, messageId) {
    console.log('[Simulated] Marking as read:', { senderId, messageId });

    /*
    // Code thực khi có backend:
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'read',
        senderId,
        messageId
      };
      
      this.ws.send(JSON.stringify(message));
    }
    */
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  attemptReconnect(userId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      setTimeout(() => {
        this.connect(userId);
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.stopHeartbeat();
      this.ws.close();
      this.ws = null;
      console.log('WebSocket disconnected');
    }
  }
}

// Export singleton instance
export default new WebSocketService();

/*
===========================================
HƯỚNG DẪN TÍCH HỢP BACKEND
===========================================

1. CÀI ĐẶT DEPENDENCIES (Laravel)
   composer require beyondcode/laravel-websockets
   php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider"

2. TẠO WEBSOCKET ENDPOINT
   File: routes/channels.php
   
   Broadcast::channel('chat.{userId}', function ($user, $userId) {
       return (int) $user->id === (int) $userId;
   });

3. TẠO MESSAGE EVENT
   File: app/Events/MessageSent.php
   
   class MessageSent implements ShouldBroadcast
   {
       public $message;
       
       public function __construct($message)
       {
           $this->message = $message;
       }
       
       public function broadcastOn()
       {
           return new PrivateChannel('chat.' . $this->message->recipient_id);
       }
   }

4. DATABASE SCHEMA
   CREATE TABLE messages (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       sender_id BIGINT NOT NULL,
       recipient_id BIGINT NOT NULL,
       content TEXT NOT NULL,
       read_at TIMESTAMP NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (sender_id) REFERENCES users(id),
       FOREIGN KEY (recipient_id) REFERENCES users(id)
   );
   
   CREATE INDEX idx_messages_recipient ON messages(recipient_id, created_at);
   CREATE INDEX idx_messages_sender ON messages(sender_id, created_at);

5. API ENDPOINTS CẦN THIẾT
   GET  /api/messages/{userId}           - Lấy lịch sử chat
   POST /api/messages                    - Gửi tin nhắn
   POST /api/messages/read/{messageId}   - Đánh dấu đã đọc
   GET  /api/conversations               - Lấy danh sách hội thoại

6. WEBSOCKET CONFIGURATION
   File: config/broadcasting.php
   
   'connections' => [
       'pusher' => [
           'driver' => 'pusher',
           'key' => env('PUSHER_APP_KEY'),
           'secret' => env('PUSHER_APP_SECRET'),
           'app_id' => env('PUSHER_APP_ID'),
           'options' => [
               'host' => '127.0.0.1',
               'port' => 6001,
               'scheme' => 'http'
           ],
       ],
   ]

7. CHẠY WEBSOCKET SERVER
   php artisan websockets:serve

8. CẬP NHẬT FRONTEND CODE
   - Bỏ comment trong method connect()
   - Thay wsUrl bằng URL thực của server
   - Remove simulateConnection() và các simulate methods
*/
