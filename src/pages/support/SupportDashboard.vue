<template>
  <TheHeader />
  <div class="support-dashboard">
    <div class="dashboard-header">
      <h1>Hỗ Trợ Khách Hàng</h1>
      <button @click="refreshAll" class="refresh-btn" :disabled="loading">
        <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
        Làm mới
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        :class="['tab', { active: activeTab === 'pending' }]"
        @click="activeTab = 'pending'"
      >
        Đang chờ
        <span v-if="pendingCount > 0" class="tab-badge">{{
          pendingCount
        }}</span>
      </button>
      <button
        :class="['tab', { active: activeTab === 'my_active' }]"
        @click="activeTab = 'my_active'"
      >
        Của tôi
        <span v-if="myActiveCount > 0" class="tab-badge">{{
          myActiveCount
        }}</span>
      </button>
      <button
        v-if="authStore.isAdmin"
        :class="['tab', { active: activeTab === 'all_active' }]"
        @click="activeTab = 'all_active'"
      >
        Tất cả
        <span v-if="allActiveCount > 0" class="tab-badge">{{
          allActiveCount
        }}</span>
      </button>
    </div>

    <!-- Conversations List -->
    <div class="conversations-container">
      <div v-if="loading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Đang tải...</p>
      </div>

      <div v-else-if="currentConversations.length === 0" class="empty-state">
        <i class="fa-solid fa-inbox"></i>
        <p>{{ emptyMessage }}</p>
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
      @refresh="refreshAll"
    />
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useSupportChatStore } from '../../stores/supportChatStore';
import { useAuthStore } from '../../stores/auth';
import ConversationDetailModal from '../../components/ConversationDetailModal.vue';
import { useMessage } from 'naive-ui';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';

const message = useMessage();
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
    message.error('Lỗi khi tải danh sách hội thoại');
  } finally {
    loading.value = false;
  }
};

const refreshAll = async () => {
  loading.value = true;
  try {
    await supportStore.refreshManagerConversations();
    message.success('Đã làm mới');
  } catch (error) {
    console.error('Error refreshing:', error);
    message.error('Lỗi khi làm mới');
  } finally {
    loading.value = false;
  }
};

const claimConversation = async (conversationId) => {
  if (claimingIds.value.has(conversationId)) {
    return; // Đang xử lý, không cho click lại
  }

  claimingIds.value.add(conversationId);

  try {
    await supportStore.claimConversation(conversationId);
    message.success('Đã nhận cuộc hội thoại');
  } catch (error) {
    console.error('Error claiming conversation:', error);
    message.error('Không thể nhận cuộc hội thoại');
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

  // Auto refresh every 30s
  const interval = setInterval(() => {
    supportStore.refreshManagerConversations();
  }, 30000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<style scoped>
.support-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;
}

.tab {
  position: relative;
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.tab:hover {
  color: #667eea;
}

.tab.active {
  color: #667eea;
  border-bottom: 3px solid #667eea;
}

.tab-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #ff3b30;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.conversations-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #888;
  gap: 16px;
}

.loading-state i,
.empty-state i {
  font-size: 64px;
}

.conversation-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;
}

.conversation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.conv-avatar {
  position: relative;
  flex-shrink: 0;
}

.conv-avatar img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff3b30;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 7px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.conv-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-time {
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
  margin-left: 12px;
}

.conv-message {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.active {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.resolved {
  background: #d4edda;
  color: #155724;
}

.assigned-to {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #667eea;
}

.claim-btn {
  flex-shrink: 0;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.claim-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.claim-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .tabs {
    overflow-x: auto;
  }

  .conversation-card {
    flex-direction: column;
  }

  .claim-btn {
    width: 100%;
  }
}
</style>
