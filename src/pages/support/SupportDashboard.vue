<template>
  <TheHeader />
  <ToastNotification ref="toastNotification" />

  <div class="support-dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1>Hỗ Trợ Khách Hàng</h1>
        <p class="header-subtitle">Quản lý và phản hồi các yêu cầu hỗ trợ</p>
      </div>
      <button @click="refreshAll" class="refresh-btn" :disabled="loading">
        <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
        <span class="btn-text">Làm mới</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        :class="['tab', { active: activeTab === 'pending' }]"
        @click="activeTab = 'pending'"
      >
        <span class="tab-label">Đang chờ</span>
        <span v-if="pendingCount > 0" class="tab-badge">{{
          pendingCount
        }}</span>
      </button>
      <button
        :class="['tab', { active: activeTab === 'my_active' }]"
        @click="activeTab = 'my_active'"
      >
        <span class="tab-label">Của tôi</span>
        <span v-if="myActiveCount > 0" class="tab-badge">{{
          myActiveCount
        }}</span>
      </button>
      <button
        v-if="authStore.isAdmin"
        :class="['tab', { active: activeTab === 'all_active' }]"
        @click="activeTab = 'all_active'"
      >
        <span class="tab-label">Tất cả</span>
        <span v-if="allActiveCount > 0" class="tab-badge">{{
          allActiveCount
        }}</span>
      </button>
    </div>

    <!-- Conversations List -->
    <div class="conversations-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="currentConversations.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-inbox"></i>
        </div>
        <p class="empty-message">{{ emptyMessage }}</p>
      </div>

      <div
        v-else
        v-for="conv in currentConversations"
        :key="conv.id"
        class="conversation-card"
        @click="openConversation(conv)"
      >
        <div class="conv-avatar">
          <img
            :src="getAvatarUrl(conv.user.id, conv.user.avatar)"
            :alt="conv.user.name"
          />
          <span v-if="conv.unread_count > 0" class="unread-badge">
            {{ conv.unread_count }}
          </span>
        </div>
        <div class="conv-info">
          <div class="conv-header">
            <h3>{{ conv.user.name }}</h3>
            <span class="conv-time">{{
              formatTime(conv.last_message_at)
            }}</span>
          </div>
          <p class="conv-message">
            {{ conv.last_message?.message || 'Bắt đầu cuộc hội thoại' }}
          </p>
          <div class="conv-meta">
            <span :class="['status-badge', conv.status]">
              {{ getStatusText(conv.status) }}
            </span>
            <span v-if="conv.assigned_manager" class="assigned-to">
              <i class="fa-solid fa-user"></i>
              {{ conv.assigned_manager.name }}
            </span>
          </div>
        </div>
        <button
          v-if="activeTab === 'pending'"
          @click.stop="claimConversation(conv.id)"
          class="claim-btn"
          :disabled="claimingIds.has(conv.id)"
        >
          <i
            v-if="claimingIds.has(conv.id)"
            class="fa-solid fa-spinner fa-spin"
          ></i>
          <span v-else>Nhận</span>
        </button>
      </div>
    </div>

    <!-- Conversation Detail Modal -->
    <ConversationDetailModal
      v-if="selectedConversation"
      :conversation="selectedConversation"
      @close="selectedConversation = null"
    />
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useSupportChatStore } from '../../stores/supportChatStore';
import { useAuthStore } from '../../stores/auth';
import ConversationDetailModal from '../../components/ConversationDetailModal.vue';
import ToastNotification from '../../components/ToastNotification.vue';
import { useToast } from '../../stores/useToast';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';

const toast = useToast();
const supportStore = useSupportChatStore();
const authStore = useAuthStore();

const activeTab = ref('pending');
const loading = ref(false);
const selectedConversation = ref(null);
const claimingIds = ref(new Set());

const backendUrl = 'http://127.0.0.1:8000';

const getAvatarUrl = (userId, avatar) => {
  if (!avatar) return 'https://picsum.photos/50';
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }
  return `${backendUrl}/storage/avatars/${userId}/${avatar}`;
};

// Computed
const pendingCount = computed(() => supportStore.pendingConversations.length);
const myActiveCount = computed(() => supportStore.myActiveConversations.length);
const allActiveCount = computed(
  () => supportStore.allActiveConversations.length
);

const currentConversations = computed(() => {
  if (activeTab.value === 'pending') {
    return supportStore.pendingConversations;
  } else if (activeTab.value === 'my_active') {
    return supportStore.myActiveConversations;
  } else {
    return supportStore.allActiveConversations;
  }
});

const emptyMessage = computed(() => {
  if (activeTab.value === 'pending') {
    return 'Không có cuộc hội thoại đang chờ';
  } else if (activeTab.value === 'my_active') {
    return 'Bạn chưa nhận cuộc hội thoại nào';
  } else {
    return 'Không có cuộc hội thoại đang hoạt động';
  }
});

// Methods
const loadConversations = async () => {
  loading.value = true;
  try {
    await supportStore.loadManagerConversations(activeTab.value);
  } catch (error) {
    console.error('Error loading conversations:', error);
    if (toast) toast.error('Lỗi khi tải danh sách hội thoại');
  } finally {
    loading.value = false;
  }
};

// ✅ Chỉ gọi khi user click button refresh
const refreshAll = async () => {
  loading.value = true;
  try {
    await supportStore.refreshManagerConversations();
    if (toast) toast.success('Đã làm mới');
  } catch (error) {
    console.error('Error refreshing:', error);
    if (toast) toast.error('Lỗi khi làm mới');
  } finally {
    loading.value = false;
  }
};

const claimConversation = async (conversationId) => {
  if (claimingIds.value.has(conversationId)) {
    return;
  }

  claimingIds.value.add(conversationId);

  try {
    await supportStore.claimConversation(conversationId);
    if (toast) toast.success('Đã nhận cuộc hội thoại');

    // ✅ Tự động switch sang tab my_active sau khi claim
    activeTab.value = 'my_active';
  } catch (error) {
    console.error('Error claiming conversation:', error);
    if (toast) toast.error('Không thể nhận cuộc hội thoại');
  } finally {
    claimingIds.value.delete(conversationId);
  }
};

const openConversation = (conv) => {
  selectedConversation.value = conv;
};

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Đang chờ',
    active: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    closed: 'Đã đóng',
  };
  return statusMap[status] || status;
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Vừa xong';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

// Watch tab changes
watch(activeTab, () => {
  loadConversations();
});

// Mount
onMounted(() => {
  loadConversations();
  supportStore.subscribeToManagerChannel();

  // ✅ OPTIMIZED: Tăng interval lên 2 phút (thay vì 30s)
  // Vì realtime updates đã handle hầu hết, chỉ cần refresh định kỳ để đồng bộ
  const interval = setInterval(() => {
    // Chỉ refresh tab hiện tại thay vì tất cả
    loadConversations();
  }, 120000); // 2 phút

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<style scoped>
/* ========== MODERN SUPPORT DASHBOARD ========== */
.support-dashboard {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 80px 20px 60px;
}

html.dark-mode .support-dashboard {
  background: linear-gradient(180deg, #0a0a0a 0%, #121212 100%);
}

.dashboard-header {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.1);
  border-left: 5px solid #0c713d;
}

html.dark-mode .dashboard-header {
  background: #1e1e1e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  border-left-color: #0f8a4a;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #0c713d;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

html.dark-mode .header-content h1 {
  color: #0f8a4a;
}

.header-subtitle {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

html.dark-mode .header-subtitle {
  color: #b0b0b0;
}

/* ========== BUTTON STANDARD STYLE ========== */
.refresh-btn,
.claim-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

html.dark-mode .refresh-btn,
html.dark-mode .claim-btn {
  background: linear-gradient(135deg, #0f8a4a 0%, #0c713d 100%);
  box-shadow: 0 4px 20px rgba(15, 138, 74, 0.3);
}

.refresh-btn::before,
.claim-btn::before {
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

.refresh-btn:hover:not(:disabled)::before,
.claim-btn:hover:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.refresh-btn:hover:not(:disabled),
.claim-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

html.dark-mode .refresh-btn:hover:not(:disabled),
html.dark-mode .claim-btn:hover:not(:disabled) {
  box-shadow: 0 8px 30px rgba(15, 138, 74, 0.4);
}

.refresh-btn:active,
.claim-btn:active {
  transform: translateY(0);
}

.refresh-btn:disabled,
.claim-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.claim-btn {
  flex-shrink: 0;
  padding: 12px 28px;
}

/* ========== TABS ========== */
.tabs {
  max-width: 1200px;
  margin: 0 auto 30px;
  display: flex;
  gap: 12px;
  background: white;
  padding: 8px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

html.dark-mode .tabs {
  background: #1e1e1e;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.tab {
  position: relative;
  flex: 1;
  padding: 14px 24px;
  background: transparent;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

html.dark-mode .tab {
  color: #b0b0b0;
}

.tab:hover {
  background: rgba(12, 113, 61, 0.05);
  color: #0c713d;
}

html.dark-mode .tab:hover {
  background: rgba(15, 138, 74, 0.1);
  color: #0f8a4a;
}

.tab.active {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

html.dark-mode .tab.active {
  background: linear-gradient(135deg, #0f8a4a 0%, #0c713d 100%);
  box-shadow: 0 4px 12px rgba(15, 138, 74, 0.3);
}

.tab-badge {
  padding: 3px 8px;
  background: #ff3b30;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 10px;
  min-width: 22px;
  text-align: center;
}

.tab.active .tab-badge {
  background: white;
  color: #0c713d;
}

html.dark-mode .tab-badge {
  background: #ff3b30;
  color: white;
}

/* Dark mode - tab active badge xanh nền tối */
html.dark-mode .tab.active .tab-badge {
  background: rgba(250, 150, 0, 0.99);
  color: #22c55e;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
}
/* ========== CONVERSATIONS ========== */
.conversations-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

html.dark-mode .loading-state,
html.dark-mode .empty-state {
  background: #1e1e1e;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(12, 113, 61, 0.1);
  border-top-color: #0c713d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

html.dark-mode .loading-spinner {
  border-color: rgba(15, 138, 74, 0.2);
  border-top-color: #0f8a4a;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

html.dark-mode .empty-icon {
  color: #444;
}

.empty-message {
  font-size: 1.1rem;
  color: #888;
  margin: 0;
}

html.dark-mode .empty-message {
  color: #666;
}

.conversation-card {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
}

html.dark-mode .conversation-card {
  background: #1e1e1e;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.conversation-card:hover {
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.15);
  transform: translateY(-3px);
  border-left-color: #0c713d;
}

html.dark-mode .conversation-card:hover {
  box-shadow: 0 8px 24px rgba(15, 138, 74, 0.2);
  border-left-color: #0f8a4a;
}

.conv-avatar {
  position: relative;
  flex-shrink: 0;
}

.conv-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

html.dark-mode .conv-avatar img {
  border-color: #2a2a2a;
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff3b30;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 22px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.3);
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.conv-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

html.dark-mode .conv-header h3 {
  color: #e0e0e0;
}

.conv-time {
  font-size: 0.85rem;
  color: #999;
  flex-shrink: 0;
}

html.dark-mode .conv-time {
  color: #666;
}

.conv-message {
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

html.dark-mode .conv-message {
  color: #b0b0b0;
}

.conv-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe7a0 100%);
  color: #856404;
}

html.dark-mode .status-badge.pending {
  background: linear-gradient(135deg, #332800 0%, #443300 100%);
  color: #ffa726;
}

.status-badge.active {
  background: linear-gradient(135deg, #d1ecf1 0%, #b8e6f0 100%);
  color: #0c5460;
}

html.dark-mode .status-badge.active {
  background: linear-gradient(135deg, #1a2332 0%, #253545 100%);
  color: #7cb3ff;
}

.status-badge.resolved {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
}

html.dark-mode .status-badge.resolved {
  background: linear-gradient(135deg, #1a2e1a 0%, #254025 100%);
  color: #81c784;
}

.assigned-to {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #0c713d;
  font-weight: 500;
}

html.dark-mode .assigned-to {
  color: #0f8a4a;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .support-dashboard {
    padding: 70px 20px 50px;
  }

  .dashboard-header {
    padding: 25px;
  }

  .header-content h1 {
    font-size: 1.8rem;
  }

  .conversation-card {
    padding: 20px;
  }

  .conv-avatar img {
    width: 55px;
    height: 55px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .support-dashboard {
    padding: 60px 15px 40px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 15px;
  }

  .header-content h1 {
    font-size: 1.6rem;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .btn-text {
    display: inline;
  }

  .tabs {
    flex-direction: column;
    gap: 8px;
  }

  .tab {
    width: 100%;
  }

  .conversation-card {
    flex-direction: column;
    padding: 18px;
    gap: 15px;
  }

  .conv-avatar {
    align-self: flex-start;
  }

  .conv-avatar img {
    width: 50px;
    height: 50px;
  }

  .conv-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .conv-time {
    font-size: 0.8rem;
  }

  .conv-message {
    font-size: 0.9rem;
  }

  .claim-btn {
    width: 100%;
    padding: 14px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .support-dashboard {
    padding: 50px 10px 30px;
  }

  .dashboard-header {
    padding: 18px;
    margin-bottom: 30px;
  }

  .header-content h1 {
    font-size: 1.4rem;
  }

  .header-subtitle {
    font-size: 0.85rem;
  }

  .tabs {
    padding: 6px;
  }

  .tab {
    padding: 12px 16px;
    font-size: 0.9rem;
  }

  .tab-label {
    font-size: 0.9rem;
  }

  .conversation-card {
    padding: 16px;
  }

  .conv-header h3 {
    font-size: 1rem;
  }

  .conv-message {
    font-size: 0.85rem;
  }

  .status-badge {
    font-size: 0.75rem;
    padding: 5px 12px;
  }

  .assigned-to {
    font-size: 0.85rem;
  }
}
</style>
