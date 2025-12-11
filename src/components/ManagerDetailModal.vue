<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="manager-detail-modal">
      <div class="modal-header">
        <div v-if="!loading" class="manager-info">
          <img
            :src="
              getAvatarUrl(
                managerStats.manager?.id,
                managerStats.manager?.avatar
              )
            "
            :alt="managerStats.manager?.name"
            class="manager-avatar"
          />
          <div>
            <h2>{{ managerStats.manager?.name }}</h2>
            <p>Chi tiết hiệu suất {{ periodLabel }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Đang tải...</p>
      </div>

      <div v-else class="modal-content">
        <!-- Statistics Cards -->
        <div class="stats-grid">
          <div class="stat-item">
            <i class="fa-solid fa-comments stat-icon"></i>
            <div>
              <p class="stat-label">Hội thoại xử lý</p>
              <h3 class="stat-value">
                {{ managerStats.handled_conversations }}
              </h3>
            </div>
          </div>

          <div class="stat-item">
            <i class="fa-solid fa-check-circle stat-icon"></i>
            <div>
              <p class="stat-label">Đã giải quyết</p>
              <h3 class="stat-value">
                {{ managerStats.resolved_conversations }}
              </h3>
            </div>
          </div>

          <div class="stat-item">
            <i class="fa-solid fa-bolt stat-icon"></i>
            <div>
              <p class="stat-label">Thời gian phản hồi TB</p>
              <h3 class="stat-value">
                {{ formatDuration(managerStats.avg_response_time) }}
              </h3>
            </div>
          </div>

          <div class="stat-item">
            <i class="fa-solid fa-hourglass-half stat-icon"></i>
            <div>
              <p class="stat-label">Thời gian giải quyết TB</p>
              <h3 class="stat-value">
                {{ formatDuration(managerStats.avg_resolution_time) }}
              </h3>
            </div>
          </div>

          <div class="stat-item">
            <i class="fa-solid fa-message stat-icon"></i>
            <div>
              <p class="stat-label">Tổng tin nhắn</p>
              <h3 class="stat-value">{{ managerStats.total_messages }}</h3>
            </div>
          </div>

          <div class="stat-item">
            <i class="fa-solid fa-star stat-icon"></i>
            <div>
              <p class="stat-label">Đánh giá trung bình</p>
              <h3 class="stat-value">
                {{ managerStats.avg_rating }}
                <i class="fa-solid fa-star rating-icon"></i>
              </h3>
            </div>
          </div>
        </div>

        <!-- Transfer Info -->
        <div v-if="managerStats.transferred_count > 0" class="transfer-info">
          <i class="fa-solid fa-share"></i>
          <span>
            Đã nhận {{ managerStats.transferred_count }} cuộc hội thoại được
            chuyển tiếp
          </span>
        </div>

        <!-- Performance Indicators -->
        <div class="performance-indicators">
          <h3>Đánh giá hiệu suất</h3>
          <div class="indicators-list">
            <div class="indicator">
              <span class="indicator-label">Tốc độ phản hồi:</span>
              <div class="indicator-bar">
                <div
                  :class="[
                    'bar-fill',
                    getResponseSpeedClass(managerStats.avg_response_time),
                  ]"
                  :style="{
                    width:
                      getResponseSpeedPercent(managerStats.avg_response_time) +
                      '%',
                  }"
                ></div>
              </div>
              <span class="indicator-value">{{
                getResponseSpeedLabel(managerStats.avg_response_time)
              }}</span>
            </div>

            <div class="indicator">
              <span class="indicator-label">Chất lượng dịch vụ:</span>
              <div class="indicator-bar">
                <div
                  :class="['bar-fill', getRatingClass(managerStats.avg_rating)]"
                  :style="{ width: (managerStats.avg_rating / 5) * 100 + '%' }"
                ></div>
              </div>
              <span class="indicator-value">{{
                getRatingLabel(managerStats.avg_rating)
              }}</span>
            </div>

            <div class="indicator">
              <span class="indicator-label">Tỷ lệ giải quyết:</span>
              <div class="indicator-bar">
                <div
                  :class="['bar-fill', getResolutionRateClass(resolutionRate)]"
                  :style="{ width: resolutionRate + '%' }"
                ></div>
              </div>
              <span class="indicator-value">{{ resolutionRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import supportApi from '../services/support-api';

const props = defineProps({
  managerId: {
    type: Number,
    required: true,
  },
  period: {
    type: String,
    default: 'today',
  },
});

const emit = defineEmits(['close']);

const loading = ref(false);
const managerStats = ref({
  manager: null,
  handled_conversations: 0,
  resolved_conversations: 0,
  avg_response_time: 0,
  avg_resolution_time: 0,
  total_messages: 0,
  avg_rating: 0,
  transferred_count: 0,
});

const backendUrl = 'http://127.0.0.1:8000';

const getAvatarUrl = (userId, avatar) => {
  if (!avatar) return 'https://picsum.photos/50';

  // Nếu avatar đã là full URL thì dùng luôn
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  // Nếu chỉ là filename thì ghép với backendUrl
  return `${backendUrl}/storage/avatars/${userId}/${avatar}`;
};

const periodLabel = computed(() => {
  const labels = {
    today: 'hôm nay',
    week: 'tuần này',
    month: 'tháng này',
    all: 'toàn bộ',
  };
  return labels[props.period] || 'hôm nay';
});

const resolutionRate = computed(() => {
  if (managerStats.value.handled_conversations === 0) return 0;
  return Math.round(
    (managerStats.value.resolved_conversations /
      managerStats.value.handled_conversations) *
      100
  );
});

// Load stats
const loadManagerStats = async () => {
  loading.value = true;
  try {
    const response = await supportApi.getManagerStatistics(
      props.managerId,
      props.period
    );
    managerStats.value = response.data;
  } catch (error) {
    console.error('Error loading manager stats:', error);
  } finally {
    loading.value = false;
  }
};

// Format duration
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

// Performance indicators
const getResponseSpeedPercent = (seconds) => {
  if (seconds <= 60) return 100; // < 1 min = excellent
  if (seconds <= 180) return 75; // < 3 min = good
  if (seconds <= 300) return 50; // < 5 min = average
  return 25; // > 5 min = poor
};

const getResponseSpeedClass = (seconds) => {
  if (seconds <= 60) return 'excellent';
  if (seconds <= 180) return 'good';
  if (seconds <= 300) return 'average';
  return 'poor';
};

const getResponseSpeedLabel = (seconds) => {
  if (seconds <= 60) return 'Xuất sắc';
  if (seconds <= 180) return 'Tốt';
  if (seconds <= 300) return 'Trung bình';
  return 'Cần cải thiện';
};

const getRatingClass = (rating) => {
  if (rating >= 4.5) return 'excellent';
  if (rating >= 3.5) return 'good';
  if (rating >= 2.5) return 'average';
  return 'poor';
};

const getRatingLabel = (rating) => {
  if (rating >= 4.5) return 'Xuất sắc';
  if (rating >= 3.5) return 'Tốt';
  if (rating >= 2.5) return 'Trung bình';
  return 'Cần cải thiện';
};

const getResolutionRateClass = (rate) => {
  if (rate >= 90) return 'excellent';
  if (rate >= 70) return 'good';
  if (rate >= 50) return 'average';
  return 'poor';
};

onMounted(() => {
  loadManagerStats();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.manager-detail-modal {
  width: 90vw;
  max-width: 700px;
  max-height: 85vh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.manager-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.manager-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid white;
}

.manager-info h2 {
  margin: 0 0 4px 0;
  font-size: 22px;
}

.manager-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #888;
  gap: 16px;
}

.loading-state i {
  font-size: 48px;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-icon {
  font-size: 28px;
  color: #667eea;
}

.stat-label {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #888;
}

.stat-value {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.rating-icon {
  color: #ffc107;
  font-size: 16px;
  margin-left: 4px;
}

.transfer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #e8eaf6;
  color: #667eea;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 600;
}

.transfer-info i {
  font-size: 20px;
}

.performance-indicators {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.performance-indicators h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

.indicators-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.indicator {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.indicator-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.indicator-bar {
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.bar-fill.excellent {
  background: linear-gradient(90deg, #4caf50 0%, #66bb6a 100%);
}

.bar-fill.good {
  background: linear-gradient(90deg, #2196f3 0%, #42a5f5 100%);
}

.bar-fill.average {
  background: linear-gradient(90deg, #ff9800 0%, #ffa726 100%);
}

.bar-fill.poor {
  background: linear-gradient(90deg, #f44336 0%, #ef5350 100%);
}

.indicator-value {
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
