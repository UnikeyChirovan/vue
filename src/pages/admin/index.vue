<template>
  <div class="admin-dashboard">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1>
            <i class="fas fa-shield-alt me-2"></i>
            DASHBOARD
          </h1>
          <p>Quản lý toàn bộ hệ thống từ một nơi duy nhất</p>
        </div>
        <div class="welcome-date">
          <i class="fas fa-calendar-alt me-2"></i>
          {{ currentDate }}
        </div>
      </div>
      <div class="welcome-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <n-spin size="large">
        <template #description>
          <span class="loading-text">Đang tải dữ liệu hệ thống...</span>
        </template>
      </n-spin>
    </div>

    <div v-else class="dashboard-content">
      <!-- Statistics Overview -->
      <div class="section-header">
        <h3>
          <i class="fas fa-chart-bar me-2"></i>
          Thống Kê Tổng Quan
        </h3>
      </div>

      <div class="stats-grid">
        <div
          v-for="stat in statistics"
          :key="stat.key"
          class="stat-card"
          @click="navigateTo(stat.route)"
        >
          <div class="stat-icon" :style="{ background: stat.gradient }">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">{{ stat.label }}</span>
            <h2 class="stat-value">{{ stat.value }}</h2>
            <div class="stat-trend" :class="stat.trend">
              <i :class="stat.trendIcon"></i>
              <span>{{ stat.trendText }}</span>
            </div>
          </div>
          <div class="stat-hover-effect"></div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-header mt-5">
        <h3>
          <i class="fas fa-bolt me-2"></i>
          Thao Tác Nhanh
        </h3>
        <p class="section-subtitle">Truy cập nhanh các chức năng thường dùng</p>
      </div>

      <div class="quick-actions-grid">
        <div
          v-for="action in quickActions"
          :key="action.key"
          class="quick-action-card"
          @click="navigateTo(action.route)"
        >
          <div class="action-icon" :style="{ background: action.gradient }">
            <i :class="action.icon"></i>
          </div>
          <span class="action-label">{{ action.label }}</span>
        </div>
      </div>

      <!-- Management Modules -->
      <div class="section-header mt-5">
        <h3>
          <i class="fas fa-layer-group me-2"></i>
          Quản Lý Module
        </h3>
        <p class="section-subtitle">
          Điều hướng đến các module quản lý chi tiết
        </p>
      </div>

      <div class="modules-grid">
        <div v-for="module in modules" :key="module.key" class="module-card">
          <div class="module-card-header">
            <div class="module-icon" :style="{ background: module.gradient }">
              <i :class="module.icon"></i>
            </div>
            <h4 class="module-title">{{ module.title }}</h4>
          </div>
          <div class="module-links">
            <a
              v-for="link in module.links"
              :key="link.route"
              @click.prevent="navigateTo(link.route)"
              class="module-link"
            >
              <i :class="link.icon"></i>
              <span>{{ link.label }}</span>
              <i class="fas fa-chevron-right"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- System Info -->
      <div class="system-info mt-5">
        <div class="info-card">
          <i class="fas fa-server"></i>
          <div>
            <span class="info-label">Phiên bản hệ thống</span>
            <span class="info-value">v2.0.1</span>
          </div>
        </div>
        <div class="info-card">
          <i class="fas fa-clock"></i>
          <div>
            <span class="info-label">Lần đăng nhập cuối</span>
            <span class="info-value">{{ lastLogin }}</span>
          </div>
        </div>
        <div class="info-card">
          <i class="fas fa-shield-check"></i>
          <div>
            <span class="info-label">Trạng thái</span>
            <span class="info-value status-active">Hoạt động bình thường</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { NSpin } from 'naive-ui';
import apiLinks from '../../services/api-links';
import { useMenu } from '../../stores/use-menu';

const router = useRouter();
const loading = ref(true);

const currentDate = computed(() => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date().toLocaleDateString('vi-VN', options);
});

const lastLogin = ref('Hôm nay, 14:30');

const statistics = ref([
  {
    key: 'users',
    label: 'Người Dùng',
    value: '0',
    icon: 'fas fa-users',
    gradient: 'linear-gradient(135deg, #0c713d 0%, #0a5a31 100%)',
    route: 'admin-users',
    trend: 'up',
    trendIcon: 'fas fa-arrow-up',
    trendText: 'Tăng 12%',
  },
  {
    key: 'stories',
    label: 'Chương Truyện',
    value: '0',
    icon: 'fas fa-book',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: 'admin-stories',
    trend: 'up',
    trendIcon: 'fas fa-arrow-up',
    trendText: 'Tăng 8%',
  },
  {
    key: 'contacts',
    label: 'Liên Hệ Mới',
    value: '0',
    icon: 'fas fa-envelope',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    route: 'admin-contacts',
    trend: 'stable',
    trendIcon: 'fas fa-minus',
    trendText: 'Ổn định',
  },
  {
    key: 'videos',
    label: 'Video',
    value: '0',
    icon: 'fas fa-film',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    route: 'admin-videos',
    trend: 'up',
    trendIcon: 'fas fa-arrow-up',
    trendText: 'Tăng 5%',
  },
]);

const quickActions = ref([
  {
    key: 'create-news',
    label: 'Thông Báo',
    icon: 'fas fa-bell',
    gradient: 'linear-gradient(135deg, #0c713d 0%, #0a5a31 100%)',
    route: 'admin-news-create',
  },
  {
    key: 'create-story',
    label: 'Thêm Truyện',
    icon: 'fas fa-book-medical',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: 'admin-stories-create',
  },
  {
    key: 'create-user',
    label: 'Thêm User',
    icon: 'fas fa-user-plus',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    route: 'admin-users-create',
  },
  {
    key: 'support',
    label: 'CSKH',
    icon: 'fas fa-headset',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    route: 'admin-support-statistics',
  },
  {
    key: 'settings',
    label: 'Cài Đặt',
    icon: 'fas fa-cog',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    route: 'admin-settings',
  },
  {
    key: 'images',
    label: 'Media',
    icon: 'fas fa-images',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    route: 'admin-images-manager',
  },
]);

const modules = ref([
  {
    key: 'content',
    title: 'Quản Lý Nội Dung',
    icon: 'fas fa-newspaper',
    gradient: 'linear-gradient(135deg, #0c713d 0%, #0a5a31 100%)',
    links: [
      { label: 'Thông Báo', icon: 'fas fa-bell', route: 'admin-news' },
      { label: 'Chương Truyện', icon: 'fas fa-book', route: 'admin-stories' },
      {
        label: 'Nội Dung Dài',
        icon: 'fas fa-file-alt',
        route: 'admin-contents',
      },
      { label: 'Danh Mục', icon: 'fas fa-list', route: 'admin-categories' },
    ],
  },
  {
    key: 'media',
    title: 'Quản Lý Media',
    icon: 'fas fa-photo-video',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    links: [
      {
        label: 'Thư Viện Ảnh',
        icon: 'fas fa-images',
        route: 'admin-images-manager',
      },
      { label: 'Hình Nền', icon: 'fas fa-image', route: 'admin-images' },
      { label: 'Quản Lý Video', icon: 'fas fa-film', route: 'admin-videos' },
    ],
  },
  {
    key: 'users',
    title: 'Quản Lý Người Dùng',
    icon: 'fas fa-users-cog',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    links: [
      { label: 'Tài Khoản', icon: 'fas fa-user', route: 'admin-users' },
      {
        label: 'Danh Sách Mail',
        icon: 'fas fa-envelope-open',
        route: 'admin-mails',
      },
      { label: 'Blacklist', icon: 'fas fa-ban', route: 'admin-blacklists' },
      {
        label: 'Thiết Bị',
        icon: 'fas fa-mobile-alt',
        route: 'admin-device-infos',
      },
    ],
  },
  {
    key: 'system',
    title: 'Hệ Thống & Báo Cáo',
    icon: 'fas fa-cogs',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    links: [
      {
        label: 'Thông Tin Công Ty',
        icon: 'fas fa-building',
        route: 'admin-company',
      },
      {
        label: 'Liên Hệ Khách Hàng',
        icon: 'fas fa-paper-plane',
        route: 'admin-contacts',
      },
      {
        label: 'Nhật Ký Requests',
        icon: 'fas fa-history',
        route: 'admin-requests',
      },
      {
        label: 'Cấu Hình Hệ Thống',
        icon: 'fas fa-sliders-h',
        route: 'admin-settings',
      },
    ],
  },
  {
    key: 'communication',
    title: 'gởi Thông Báo & Email',
    icon: 'fas fa-envelope-open-text',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    links: [
      {
        label: 'gởi Email Hàng Loạt',
        icon: 'fas fa-paper-plane',
        route: 'admin-infos',
      },
      {
        label: 'Tạo Thông Báo Mới',
        icon: 'fas fa-edit',
        route: 'admin-infos-create',
      },
    ],
  },
  {
    key: 'support',
    title: 'Chăm Sóc Khách Hàng',
    icon: 'fas fa-headset',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    links: [
      {
        label: 'Thống Kê & Báo Cáo',
        icon: 'fas fa-chart-line',
        route: 'admin-support-statistics',
      },
    ],
  },
]);

const navigateTo = (routeName) => {
  router.push({ name: routeName });
};

const loadStatistics = async () => {
  loading.value = true;
  try {
    // Load Users count
    const usersResponse = await apiLinks.users.getAll();
    statistics.value[0].value = usersResponse.data.length || 0;

    // Load Stories count
    const storiesResponse = await apiLinks.story.getChapters();
    statistics.value[1].value = storiesResponse.data.length || 0;

    // Load Contacts count
    const contactsResponse = await apiLinks.noauth.getContacts();
    statistics.value[2].value = contactsResponse.data.length || 0;

    // Load Videos count
    const videosResponse = await apiLinks.videos.getAll();
    statistics.value[3].value = videosResponse.data.length || 0;
  } catch (error) {
    console.error('Error loading statistics:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useMenu().clearSelectedKey();
  loadStatistics();
});
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* ========== WELCOME BANNER ========== */
.welcome-banner {
  position: relative;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 48px 32px;
  border-radius: 0 0 24px 24px;
  color: white;
  overflow: hidden;
  margin-bottom: 32px;
}

.welcome-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.welcome-text h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-text p {
  font-size: 16px;
  opacity: 0.95;
  margin: 0;
}

.welcome-date {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  font-weight: 600;
}

.welcome-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -50px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 10%;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  right: 30%;
}

/* ========== LOADING STATE ========== */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-text {
  color: #0c713d;
  font-weight: 600;
  margin-top: 16px;
}

/* ========== DASHBOARD CONTENT ========== */
.dashboard-content {
  padding: 0 32px 32px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.section-subtitle {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

/* ========== STATISTICS CARDS ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  color: #2d3748;
  margin: 0;
  line-height: 1;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
}

.stat-trend.up {
  background: #d4f4dd;
  color: #22863a;
}

.stat-trend.stable {
  background: #e3f2fd;
  color: #1565c0;
}

.stat-hover-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0c713d 0%, #0a5a31 100%);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.stat-card:hover .stat-hover-effect {
  transform: scaleX(1);
}

/* ========== QUICK ACTIONS ========== */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.quick-action-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.quick-action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-label {
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
  text-align: center;
}

/* ========== MODULE CARDS ========== */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.module-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s;
}

.module-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.module-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f7fafc;
}

.module-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.module-title {
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.module-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #f7fafc;
  color: #4a5568;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.module-link:hover {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  transform: translateX(4px);
}

.module-link i:first-child {
  width: 20px;
  text-align: center;
}

.module-link span {
  flex: 1;
}

.module-link i:last-child {
  font-size: 12px;
  opacity: 0.6;
}

/* ========== SYSTEM INFO ========== */
.system-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f7fafc;
}

.info-card i {
  font-size: 32px;
  color: #0c713d;
}

.info-card div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #718096;
  font-weight: 600;
}

.info-value {
  font-size: 16px;
  color: #2d3748;
  font-weight: 700;
}

.status-active {
  color: #22863a;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .welcome-banner {
    padding: 40px 24px;
  }

  .welcome-text h1 {
    font-size: 28px;
  }

  .dashboard-content {
    padding: 0 24px 24px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-value {
    font-size: 32px;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .modules-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

/* Mobile */
@media (max-width: 768px) {
  .welcome-banner {
    padding: 32px 20px;
    border-radius: 0 0 16px 16px;
  }

  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .welcome-text h1 {
    font-size: 24px;
  }

  .welcome-text p {
    font-size: 14px;
  }

  .welcome-date {
    padding: 10px 20px;
    font-size: 14px;
    width: 100%;
    text-align: center;
  }

  .dashboard-content {
    padding: 0 20px 20px;
  }

  .section-header h3 {
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    flex-direction: row;
    align-items: center;
    padding: 20px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  .stat-value {
    font-size: 28px;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .action-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .action-label {
    font-size: 12px;
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .module-card {
    padding: 20px;
  }

  .module-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .module-title {
    font-size: 16px;
  }

  .system-info {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .info-card {
    padding: 12px;
  }

  .info-card i {
    font-size: 28px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .welcome-banner {
    padding: 24px 15px;
    margin-bottom: 24px;
  }

  .welcome-text h1 {
    font-size: 20px;
  }

  .welcome-text h1 i {
    font-size: 18px;
  }

  .welcome-text p {
    font-size: 13px;
  }

  .welcome-date {
    padding: 8px 16px;
    font-size: 13px;
  }

  .dashboard-content {
    padding: 0 15px 15px;
  }

  .section-header h3 {
    font-size: 18px;
  }

  .section-subtitle {
    font-size: 13px;
  }

  .stats-grid {
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    gap: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-trend {
    padding: 4px 10px;
    font-size: 11px;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .quick-action-card {
    padding: 16px;
    gap: 10px;
  }

  .action-icon {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .action-label {
    font-size: 11px;
  }

  .modules-grid {
    gap: 12px;
  }

  .module-card {
    padding: 16px;
  }

  .module-card-header {
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
  }

  .module-icon {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .module-title {
    font-size: 15px;
  }

  .module-link {
    padding: 10px 12px;
    font-size: 13px;
    gap: 10px;
  }

  .module-link i:first-child {
    width: 18px;
  }

  .system-info {
    padding: 12px;
    gap: 10px;
  }

  .info-card {
    padding: 10px;
    gap: 12px;
  }

  .info-card i {
    font-size: 24px;
  }

  .info-label {
    font-size: 12px;
  }

  .info-value {
    font-size: 14px;
  }
}
</style>
