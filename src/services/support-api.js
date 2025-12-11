// services/support-api.js
import api from './axiosInterceptor';

const supportApi = {
  // ============================================
  // USER APIS
  // ============================================

  // Lấy hoặc tạo conversation
  getOrCreateConversation: () => api.get('/support/conversation'),

  // Gửi tin nhắn
  sendMessage: (conversationId, message) =>
    api.post('/support/messages/send', {
      conversation_id: conversationId,
      message: message,
    }),

  // Đánh dấu đã đọc
  markAsRead: (conversationId) =>
    api.post(`/support/conversations/${conversationId}/mark-read`),

  // Lấy số tin nhắn chưa đọc
  getUnreadCount: () => api.get('/support/unread-count'),

  // Đánh giá conversation
  rateConversation: (conversationId, rating, comment) =>
    api.post(`/support/conversations/${conversationId}/rate`, {
      rating: rating,
      comment: comment,
    }),

  // Kiểm tra support online
  checkSupportOnline: () => api.get('/support/check-online'),

  // ============================================
  // MANAGER/ADMIN APIS
  // ============================================

  // Lấy danh sách conversations
  getConversations: (type) =>
    api.get('/support/manage/conversations', { params: { type } }),

  // Thêm vào supportApi object
  getConversationMessages: (conversationId) =>
    api.get(`/support/manage/conversations/${conversationId}/messages`),

  // Claim conversation
  claimConversation: (conversationId) =>
    api.post(`/support/manage/conversations/${conversationId}/claim`),

  // Gửi tin nhắn as support
  sendManagerMessage: (conversationId, message) =>
    api.post('/support/manage/messages/send', {
      conversation_id: conversationId,
      message: message,
    }),

  // Đánh dấu đã đọc (manager)
  markAsReadByManager: (conversationId) =>
    api.post(`/support/manage/conversations/${conversationId}/mark-read`),

  // Transfer conversation
  transferConversation: (conversationId, newManagerId) =>
    api.post(`/support/manage/conversations/${conversationId}/transfer`, {
      new_manager_id: newManagerId,
    }),

  // Resolve conversation
  resolveConversation: (conversationId) =>
    api.post(`/support/manage/conversations/${conversationId}/resolve`),

  // Lấy thống kê manager
  getManagerStatistics: (managerId, period) =>
    api.get(`/support/manage/statistics/manager/${managerId}`, {
      params: { period },
    }),

  // Lấy danh sách managers
  getManagers: () => api.get('/support/manage/managers'),

  // ============================================
  // ADMIN ONLY APIS
  // ============================================

  // Lấy thống kê tổng quan
  getStatistics: (period) =>
    api.get('/support/admin/statistics', { params: { period } }),
};

export default supportApi;
