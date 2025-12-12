<template>
  <div class="support-statistics">
    <div class="page-header">
      <h1>Thống Kê Hỗ Trợ Khách Hàng</h1>
      <div class="period-selector">
        <button
          v-for="p in periods"
          :key="p.value"
          :class="['period-btn', { active: period === p.value }]"
          @click="changePeriod(p.value)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Đang tải thống kê...</p>
    </div>

    <div v-else class="statistics-content">
      <!-- Overview Cards -->
      <div class="overview-cards">
        <div class="stat-card">
          <div class="stat-icon conversations">
            <i class="fa-solid fa-comments"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Tổng hội thoại</p>
            <h2 class="stat-value">{{ statistics.total_conversations }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon resolved">
            <i class="fa-solid fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Đã giải quyết</p>
            <h2 class="stat-value">{{ statistics.resolved_conversations }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Đang chờ</p>
            <h2 class="stat-value">{{ statistics.pending_conversations }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active">
            <i class="fa-solid fa-user-headset"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Đang xử lý</p>
            <h2 class="stat-value">{{ statistics.active_conversations }}</h2>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="performance-section">
        <h2 class="section-title">Hiệu Suất</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <i class="fa-solid fa-bolt"></i>
            <div>
              <p class="metric-label">Thời gian phản hồi TB</p>
              <h3 class="metric-value">
                {{ formatDuration(statistics.avg_response_time) }}
              </h3>
            </div>
          </div>

          <div class="metric-card">
            <i class="fa-solid fa-hourglass-half"></i>
            <div>
              <p class="metric-label">Thời gian giải quyết TB</p>
              <h3 class="metric-value">
                {{ formatDuration(statistics.avg_resolution_time) }}
              </h3>
            </div>
          </div>

          <div class="metric-card">
            <i class="fa-solid fa-star"></i>
            <div>
              <p class="metric-label">Đánh giá trung bình</p>
              <h3 class="metric-value">{{ statistics.avg_rating }} / 5</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Managers -->
      <div class="managers-section">
        <h2 class="section-title">Top Managers</h2>
        <div class="managers-table">
          <div class="table-header">
            <span class="col-rank">#</span>
            <span class="col-manager">Manager</span>
            <span class="col-stat">Hội thoại</span>
            <span class="col-stat">Phản hồi</span>
            <span class="col-stat">Giải quyết</span>
            <span class="col-stat">Đánh giá</span>
          </div>
          <div
            v-for="(manager, index) in statistics.top_managers"
            :key="manager.manager.id"
            class="table-row"
            @click="viewManagerDetail(manager.manager.id)"
          >
            <span class="col-rank">{{ index + 1 }}</span>
            <div class="col-manager">
              <img
                :src="getAvatarUrl(manager.manager.id, manager.manager.avatar)"
                :alt="manager.manager.name"
                class="manager-avatar"
              />
              <span>{{ manager.manager.name }}</span>
            </div>
            <span class="col-stat">{{ manager.total_conversations }}</span>
            <span class="col-stat">{{
              formatDuration(manager.avg_response_time)
            }}</span>
            <span class="col-stat">{{
              formatDuration(manager.avg_resolution_time)
            }}</span>
            <span class="col-stat">
              <span class="rating-value">{{ manager.avg_rating }}</span>
              <i class="fa-solid fa-star rating-icon"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Manager Detail Modal -->
    <ManagerDetailModal
      v-if="selectedManagerId"
      :managerId="selectedManagerId"
      :period="period"
      @close="selectedManagerId = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import supportApi from '../../../services/support-api';
import ManagerDetailModal from '../../../components/ManagerDetailModal.vue';
import { useMessage } from 'naive-ui';
import { useMenu } from '../../../stores/use-menu';

const message = useMessage();

const period = ref('today');
const loading = ref(false);
const statistics = ref({
  total_conversations: 0,
  resolved_conversations: 0,
  pending_conversations: 0,
  active_conversations: 0,
  avg_response_time: 0,
  avg_resolution_time: 0,
  avg_rating: 0,
  top_managers: [],
});

const selectedManagerId = ref(null);

// Backend URL
const backendUrl = 'http://127.0.0.1:8000';

const getAvatarUrl = (userId, avatar) => {
  if (!avatar) return 'https://picsum.photos/50';

  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  return `${backendUrl}/storage/avatars/${userId}/${avatar}`;
};

const periods = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'all', label: 'Tất cả' },
];

// Methods
const loadStatistics = async () => {
  loading.value = true;
  try {
    const response = await supportApi.getStatistics(period.value);
    statistics.value = response.data;
  } catch (error) {
    console.error('Error loading statistics:', error);
    message.error('Lỗi khi tải thống kê');
  } finally {
    loading.value = false;
  }
};

const changePeriod = (newPeriod) => {
  period.value = newPeriod;
  loadStatistics();
};

const viewManagerDetail = (managerId) => {
  selectedManagerId.value = managerId;
};

const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '-';

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

onMounted(() => {
  loadStatistics();
  useMenu().onSelectedKey(['admin-support-statistics']);
});
</script>

<style scoped>
.support-statistics {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.period-selector {
  display: flex;
  gap: 8px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 8px;
}

.period-btn {
  padding: 8px 20px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:hover {
  color: #667eea;
}

.period-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  color: #888;
  gap: 16px;
}

.loading-container i {
  font-size: 64px;
}

.statistics-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Overview Cards */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.conversations {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.resolved {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.stat-icon.active {
  background: linear-gradient(135deg, #2196f3 0%, #1565c0 100%);
}

.stat-info {
  flex: 1;
}

.stat-label {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #888;
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

/* Performance Section */
.performance-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.metric-card i {
  font-size: 32px;
  color: #667eea;
}

.metric-label {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #888;
}

.metric-value {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

/* Managers Section */
.managers-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.managers-table {
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 50px 1fr repeat(4, 120px);
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
}

.table-header {
  font-weight: 700;
  color: #666;
  font-size: 13px;
  text-transform: uppercase;
  border-bottom: 2px solid #e0e0e0;
}

.table-row {
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.col-rank {
  font-weight: 700;
  color: #667eea;
  font-size: 18px;
}

.col-manager {
  display: flex;
  align-items: center;
  gap: 12px;
}

.manager-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.col-stat {
  text-align: center;
  font-size: 14px;
  color: #333;
}

.rating-value {
  font-weight: 700;
  color: #ffc107;
}

.rating-icon {
  color: #ffc107;
  margin-left: 4px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .overview-cards {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 40px 1fr 80px;
    font-size: 12px;
  }

  .col-stat:nth-child(4),
  .col-stat:nth-child(5) {
    display: none;
  }
}
</style>
