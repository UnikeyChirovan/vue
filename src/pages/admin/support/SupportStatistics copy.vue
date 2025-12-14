<template>
  <div class="support-statistics">
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="fa-solid fa-chart-line"></i>
          Thống Kê Hỗ Trợ Khách Hàng
        </h1>
        <p>Theo dõi hiệu suất và chất lượng dịch vụ</p>
      </div>
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
        <div class="stat-card conversations">
          <div class="stat-icon">
            <i class="fa-solid fa-comments"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Tổng hội thoại</p>
            <h2 class="stat-value">{{ statistics.total_conversations }}</h2>
          </div>
        </div>

        <div class="stat-card resolved">
          <div class="stat-icon">
            <i class="fa-solid fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Đã giải quyết</p>
            <h2 class="stat-value">{{ statistics.resolved_conversations }}</h2>
          </div>
        </div>

        <div class="stat-card pending">
          <div class="stat-icon">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Đang chờ</p>
            <h2 class="stat-value">{{ statistics.pending_conversations }}</h2>
          </div>
        </div>

        <div class="stat-card active">
          <div class="stat-icon">
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
        <h2 class="section-title">
          <i class="fa-solid fa-gauge-high"></i>
          Hiệu Suất
        </h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon bolt">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <div class="metric-content">
              <p class="metric-label">Thời gian phản hồi TB</p>
              <h3 class="metric-value">
                {{ formatDuration(statistics.avg_response_time) }}
              </h3>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon hourglass">
              <i class="fa-solid fa-hourglass-half"></i>
            </div>
            <div class="metric-content">
              <p class="metric-label">Thời gian giải quyết TB</p>
              <h3 class="metric-value">
                {{ formatDuration(statistics.avg_resolution_time) }}
              </h3>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon star">
              <i class="fa-solid fa-star"></i>
            </div>
            <div class="metric-content">
              <p class="metric-label">Đánh giá trung bình</p>
              <h3 class="metric-value">{{ statistics.avg_rating }} / 5</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Managers - Desktop Table View -->
      <div class="managers-section desktop-view">
        <h2 class="section-title">
          <i class="fa-solid fa-trophy"></i>
          Top Managers
        </h2>
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
            <span class="col-rank">
              <span
                v-if="index < 3"
                class="rank-badge"
                :class="`rank-${index + 1}`"
              >
                {{ index + 1 }}
              </span>
              <span v-else class="rank-number">{{ index + 1 }}</span>
            </span>
            <div class="col-manager">
              <img
                :src="getAvatarUrl(manager.manager.id, manager.manager.avatar)"
                :alt="manager.manager.name"
                class="manager-avatar"
              />
              <span class="manager-name">{{ manager.manager.name }}</span>
            </div>
            <span class="col-stat">{{ manager.total_conversations }}</span>
            <span class="col-stat">{{
              formatDuration(manager.avg_response_time)
            }}</span>
            <span class="col-stat">{{
              formatDuration(manager.avg_resolution_time)
            }}</span>
            <span class="col-stat rating-col">
              <span class="rating-value">{{ manager.avg_rating }}</span>
              <i class="fa-solid fa-star rating-icon"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- Top Managers - Mobile Card View -->
      <div class="managers-section mobile-view">
        <h2 class="section-title">
          <i class="fa-solid fa-trophy"></i>
          Top Managers
        </h2>
        <div class="managers-cards">
          <div
            v-for="(manager, index) in statistics.top_managers"
            :key="manager.manager.id"
            class="manager-card"
            @click="viewManagerDetail(manager.manager.id)"
          >
            <div class="card-rank">
              <span
                v-if="index < 3"
                class="rank-badge"
                :class="`rank-${index + 1}`"
              >
                #{{ index + 1 }}
              </span>
              <span v-else class="rank-number">#{{ index + 1 }}</span>
            </div>
            <div class="card-header">
              <img
                :src="getAvatarUrl(manager.manager.id, manager.manager.avatar)"
                :alt="manager.manager.name"
                class="manager-avatar-large"
              />
              <h3 class="manager-name">{{ manager.manager.name }}</h3>
            </div>
            <div class="card-stats">
              <div class="stat-row">
                <span class="stat-label">
                  <i class="fa-solid fa-comments"></i>
                  Hội thoại
                </span>
                <span class="stat-value">{{
                  manager.total_conversations
                }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">
                  <i class="fa-solid fa-bolt"></i>
                  Phản hồi
                </span>
                <span class="stat-value">{{
                  formatDuration(manager.avg_response_time)
                }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">
                  <i class="fa-solid fa-hourglass-half"></i>
                  Giải quyết
                </span>
                <span class="stat-value">{{
                  formatDuration(manager.avg_resolution_time)
                }}</span>
              </div>
              <div class="stat-row rating-row">
                <span class="stat-label">
                  <i class="fa-solid fa-star"></i>
                  Đánh giá
                </span>
                <span class="stat-value rating-value">
                  {{ manager.avg_rating }}
                  <i class="fa-solid fa-star rating-icon"></i>
                </span>
              </div>
            </div>
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
/* ========== WRAPPER ========== */
.support-statistics {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

/* ========== PAGE HEADER ========== */
.page-header {
  max-width: 1400px;
  margin: 0 auto 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 40px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 40px rgba(12, 113, 61, 0.3);
  gap: 20px;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  letter-spacing: 0.5px;
}

.header-content h1 i {
  font-size: 2.2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.header-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.period-selector {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.period-btn {
  padding: 10px 24px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.period-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.period-btn.active {
  background: white;
  color: #0c713d;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ========== LOADING ========== */
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
  font-size: 4rem;
  color: #0c713d;
}

.loading-container p {
  font-size: 1.1rem;
  font-weight: 500;
}

/* ========== STATISTICS CONTENT ========== */
.statistics-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ========== OVERVIEW CARDS ========== */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0c713d, #0a5a31);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.stat-card.conversations::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.stat-card.resolved::before {
  background: linear-gradient(90deg, #4caf50, #2e7d32);
}

.stat-card.pending::before {
  background: linear-gradient(90deg, #ff9800, #f57c00);
}

.stat-card.active::before {
  background: linear-gradient(90deg, #2196f3, #1565c0);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  flex-shrink: 0;
}

.conversations .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.resolved .stat-icon {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
}

.pending .stat-icon {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.active .stat-icon {
  background: linear-gradient(135deg, #2196f3 0%, #1565c0 100%);
}

.stat-info {
  flex: 1;
}

.stat-label {
  margin: 0 0 6px 0;
  font-size: 0.95rem;
  color: #888;
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 800;
  color: #333;
}

/* ========== PERFORMANCE SECTION ========== */
.performance-section {
  background: white;
  padding: 35px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
}

.section-title {
  margin: 0 0 30px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(12, 113, 61, 0.1);
}

.section-title i {
  color: #0c713d;
  font-size: 1.7rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: white;
  flex-shrink: 0;
}

.metric-icon.bolt {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.metric-icon.hourglass {
  background: linear-gradient(135deg, #2196f3 0%, #1565c0 100%);
}

.metric-icon.star {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.metric-content {
  flex: 1;
}

.metric-label {
  margin: 0 0 6px 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.metric-value {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

/* ========== MANAGERS SECTION - DESKTOP ========== */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

@media (min-width: 769px) {
  .mobile-view {
    display: none !important;
  }
  .desktop-view {
    display: block !important;
  }
}

.managers-section {
  background: white;
  padding: 35px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
}

.managers-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 80px 1fr repeat(4, 140px);
  gap: 20px;
  align-items: center;
  padding: 18px 20px;
}

.table-header {
  font-weight: 700;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.table-row {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.table-row:hover {
  background: linear-gradient(135deg, #f8faf9 0%, #f0f5f3 100%);
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(12, 113, 61, 0.1);
}

.col-rank {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rank-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.3rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  animation: shine 2s ease-in-out infinite;
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #c0c0c0 0%, #dcdcdc 100%);
  color: #333;
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #cd7f32 0%, #d4a574 100%);
  color: white;
}

@keyframes shine {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.6);
  }
}

.rank-number {
  font-weight: 700;
  color: #0c713d;
  font-size: 1.3rem;
}

.col-manager {
  display: flex;
  align-items: center;
  gap: 14px;
}

.manager-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0c713d;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.manager-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.col-stat {
  text-align: center;
  font-size: 0.95rem;
  color: #555;
  font-weight: 500;
}

.rating-col {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.rating-value {
  font-weight: 700;
  color: #ffc107;
  font-size: 1.1rem;
}

.rating-icon {
  color: #ffc107;
  font-size: 1rem;
}

/* ========== MANAGERS SECTION - MOBILE ========== */
.managers-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.manager-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
}

.manager-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(12, 113, 61, 0.2);
  border-color: #0c713d;
}

.card-rank {
  position: absolute;
  top: 15px;
  right: 15px;
}

.card-rank .rank-badge {
  width: 45px;
  height: 45px;
  font-size: 1.2rem;
}

.card-rank .rank-number {
  display: inline-block;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(12, 113, 61, 0.1);
}

.manager-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #0c713d;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card-header .manager-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin: 0;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.stat-row .stat-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.stat-row .stat-label i {
  color: #0c713d;
  font-size: 1rem;
}

.stat-row .stat-value {
  font-weight: 700;
  color: #333;
  font-size: 1rem;
}

.rating-row {
  background: linear-gradient(135deg, #fff9e6 0%, #fff5cc 100%);
}

.rating-row .stat-value {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ffc107;
  font-size: 1.1rem;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .support-statistics {
    padding: 30px 15px;
  }

  .page-header {
    padding: 25px 30px;
  }

  .header-content h1 {
    font-size: 1.7rem;
  }

  .header-content h1 i {
    font-size: 1.9rem;
  }

  .period-btn {
    padding: 8px 20px;
    font-size: 0.9rem;
  }

  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .stat-card {
    padding: 24px;
  }

  .performance-section,
  .managers-section {
    padding: 30px 30px;
  }

  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 70px 1fr repeat(4, 120px);
    gap: 16px;
    padding: 16px 18px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .support-statistics {
    padding: 20px 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
    gap: 16px;
  }

  .header-content h1 {
    font-size: 1.4rem;
  }

  .header-content h1 i {
    font-size: 1.6rem;
  }

  .header-content p {
    font-size: 0.9rem;
  }

  .period-selector {
    width: 100%;
    justify-content: center;
  }

  .period-btn {
    flex: 1;
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    font-size: 1.6rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .performance-section,
  .managers-section {
    padding: 25px 20px;
    border-radius: 16px;
  }

  .section-title {
    font-size: 1.3rem;
    margin-bottom: 25px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .metric-card {
    padding: 20px;
  }

  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .support-statistics {
    padding: 15px 8px;
  }

  .page-header {
    padding: 15px;
    border-radius: 12px;
  }

  .header-content h1 {
    font-size: 1.2rem;
  }

  .header-content h1 i {
    font-size: 1.4rem;
  }

  .header-content p {
    font-size: 0.85rem;
  }

  .period-selector {
    padding: 4px;
    gap: 4px;
  }

  .period-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .overview-cards {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .stat-card {
    padding: 18px;
    gap: 16px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .stat-value {
    font-size: 1.8rem;
  }

  .performance-section,
  .managers-section {
    padding: 20px 15px;
    border-radius: 12px;
  }

  .section-title {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  .section-title i {
    font-size: 1.4rem;
  }

  .metric-card {
    padding: 18px;
    gap: 16px;
  }

  .metric-icon {
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
  }

  .metric-label {
    font-size: 0.85rem;
  }

  .metric-value {
    font-size: 1.6rem;
  }

  .manager-card {
    padding: 20px;
    border-radius: 16px;
  }

  .card-rank .rank-badge,
  .card-rank .rank-number {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .manager-avatar-large {
    width: 70px;
    height: 70px;
  }

  .card-header .manager-name {
    font-size: 1.2rem;
  }

  .stat-row {
    padding: 10px 14px;
  }

  .stat-row .stat-label {
    font-size: 0.9rem;
  }

  .stat-row .stat-value {
    font-size: 0.95rem;
  }
}
</style>
