<template>
  <div class="game-hub-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <i class="fas fa-gamepad"></i>
          HUB GAME
        </h1>
        <p class="hero-subtitle">
          Khám phá thế giới Visual Novel và chiến đấu chiến thuật
        </p>
      </div>
    </section>

    <!-- Main Game Section -->
    <section class="main-game-section">
      <div class="container">
        <!-- Main Game Card -->
        <div class="main-game-card">
          <div class="game-showcase">
            <!-- Game Screenshots Carousel -->
            <div class="screenshots-carousel">
              <div class="screenshot active">
                <img src="https://picsum.photos/800/450" alt="Story Mode" />
              </div>
            </div>

            <!-- Game Info Panel -->
            <div class="game-info-panel">
              <div class="game-header-info">
                <div class="game-icon">
                  <img src="https://picsum.photos/100/100" alt="Game Icon" />
                </div>
                <div class="game-title-section">
                  <h2 class="game-main-title">
                    <i class="fas fa-star"></i>
                    Spirit Legends
                  </h2>
                  <p class="game-subtitle">Visual Novel × Gacha × Combat RPG</p>
                  <div class="game-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>4.8 (15.2K đánh giá)</span>
                  </div>
                </div>
              </div>

              <div class="game-description-section">
                <h3>
                  <i class="fas fa-book-open"></i>
                  Về Game
                </h3>
                <p>
                  Khám phá thế giới huyền bí với câu chuyện sâu sắc, thu thập
                  hàng trăm Spirits mạnh mẽ và tham gia vào những trận chiến
                  chiến thuật kịch tính. Mỗi quyết định của bạn sẽ ảnh hưởng đến
                  cốt truyện và số phận của các nhân vật!
                </p>
              </div>

              <!-- Game Features Grid -->
              <div class="features-grid">
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-book"></i>
                  </div>
                  <h4>Visual Novel</h4>
                  <p>Câu chuyện đa nhánh với nhiều kết thúc</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-dice"></i>
                  </div>
                  <h4>Gacha System</h4>
                  <p>300+ Spirits độc đáo để thu thập</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-chess-knight"></i>
                  </div>
                  <h4>Turn-Based Combat</h4>
                  <p>Chiến đấu chiến thuật với kỹ năng đa dạng</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <h4>Romance System</h4>
                  <p>Xây dựng mối quan hệ với nhân vật</p>
                </div>
              </div>

              <!-- Game Stats -->
              <div class="game-stats-bar">
                <div class="stat-item">
                  <i class="fas fa-download"></i>
                  <span>500K+</span>
                  <small>Tải xuống</small>
                </div>
                <div class="stat-item">
                  <i class="fas fa-users"></i>
                  <span>100K+</span>
                  <small>Người chơi</small>
                </div>
                <div class="stat-item">
                  <i class="fas fa-clock"></i>
                  <span>50+ giờ</span>
                  <small>Nội dung</small>
                </div>
                <div class="stat-item">
                  <i class="fas fa-trophy"></i>
                  <span>Top #1</span>
                  <small>Xếp hạng</small>
                </div>
              </div>

              <!-- Play Button -->
              <button class="btn-play-main" @click="openGame">
                <i class="fas fa-play-circle"></i>
                <span>Bắt Đầu Chơi</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Game Modes Section -->
        <div class="game-modes-section">
          <h3 class="section-heading">
            <i class="fas fa-gamepad"></i>
            Chế Độ Chơi
          </h3>
          <div class="modes-grid">
            <div class="mode-card">
              <div class="mode-icon story">
                <i class="fas fa-book-open"></i>
              </div>
              <h4>Story Mode</h4>
              <p>Theo dõi cốt truyện chính với 12 chương hấp dẫn</p>
              <span class="mode-badge">Mới cập nhật</span>
            </div>
            <div class="mode-card">
              <div class="mode-icon gacha">
                <i class="fas fa-gem"></i>
              </div>
              <h4>Spirit Summon</h4>
              <p>Triệu hồi và thu thập Spirits với tỷ lệ SSR 3%</p>
              <span class="mode-badge hot">Hot</span>
            </div>
            <div class="mode-card">
              <div class="mode-icon battle">
                <i class="fas fa-crosshairs"></i>
              </div>
              <h4>Battle Arena</h4>
              <p>Thử thách PvP và chinh phục bảng xếp hạng</p>
              <span class="mode-badge">Ranked</span>
            </div>
            <div class="mode-card">
              <div class="mode-icon event">
                <i class="fas fa-calendar"></i>
              </div>
              <h4>Events</h4>
              <p>Sự kiện giới hạn với phần thưởng độc quyền</p>
              <span class="mode-badge limited">Limited</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Updates & News Section -->
    <section class="updates-section">
      <div class="container">
        <h3 class="section-heading">
          <i class="fas fa-newspaper"></i>
          Cập Nhật & Tin Tức
        </h3>
        <div class="updates-grid">
          <div class="update-card">
            <div class="update-date">
              <span class="day">06</span>
              <span class="month">T1</span>
            </div>
            <div class="update-content">
              <h4>Version 2.5 - Winter Festival</h4>
              <p>Sự kiện mùa đông với 3 Spirit mới và costume giới hạn!</p>
              <span class="update-badge new">Mới</span>
            </div>
          </div>
          <div class="update-card">
            <div class="update-date">
              <span class="day">01</span>
              <span class="month">T1</span>
            </div>
            <div class="update-content">
              <h4>Chương 12 - The Final Battle</h4>
              <p>Kết thúc Season 1 với trận chiến cuối cùng đầy cảm xúc</p>
              <span class="update-badge">Cập nhật</span>
            </div>
          </div>
          <div class="update-card">
            <div class="update-date">
              <span class="day">25</span>
              <span class="month">T12</span>
            </div>
            <div class="update-content">
              <h4>Giáng Sinh Đặc Biệt</h4>
              <p>Nhận miễn phí 10 lượt gacha và costume giáng sinh</p>
              <span class="update-badge event">Sự kiện</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const openGame = () => {
  // Kiểm tra đăng nhập
  if (!authStore.isLoggedIn) {
    alert('Vui lòng đăng nhập để chơi game!');
    return;
  }

  // Navigate đến game player - chỉ có 1 game duy nhất
  router.push({ name: 'game-player' });
};
</script>

<style scoped>
.game-hub-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

html.dark-mode .game-hub-container {
  background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
}

/* ===== HERO SECTION ===== */
.hero-section {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

html.dark-mode .hero-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')
    no-repeat bottom;
  background-size: cover;
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-top: 1rem;
  opacity: 0.9;
}

/* ===== MAIN GAME SECTION ===== */
.main-game-section {
  padding: 3rem 0;
}

.main-game-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

html.dark-mode .main-game-card {
  background: #2a2a2a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.game-showcase {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 0;
}

.screenshots-carousel {
  position: relative;
  height: 100%;
  min-height: 500px;
  background: #000;
}

.screenshot {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.screenshot.active {
  opacity: 1;
}

.screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-info-panel {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.game-header-info {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.game-icon {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.game-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-title-section {
  flex: 1;
}

.game-main-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: #0c713d;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

html.dark-mode .game-main-title {
  color: #4ade80;
}

.game-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

html.dark-mode .game-subtitle {
  color: #b3b3b3;
}

.game-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffa500;
  font-size: 1.125rem;
}

.game-rating span {
  color: #666;
  font-size: 0.9375rem;
  margin-left: 0.5rem;
}

html.dark-mode .game-rating span {
  color: #b3b3b3;
}

.game-description-section h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

html.dark-mode .game-description-section h3 {
  color: #e5e5e5;
}

.game-description-section p {
  color: #666;
  line-height: 1.7;
  margin: 0;
}

html.dark-mode .game-description-section p {
  color: #b3b3b3;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.feature-item {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

html.dark-mode .feature-item {
  background: #1a1a1a;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.2);
}

html.dark-mode .feature-item:hover {
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  font-size: 1.5rem;
  color: white;
}

html.dark-mode .feature-icon {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
}

.feature-item h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

html.dark-mode .feature-item h4 {
  color: #e5e5e5;
}

.feature-item p {
  font-size: 0.8125rem;
  color: #666;
  margin: 0;
}

html.dark-mode .feature-item p {
  color: #b3b3b3;
}

.game-stats-bar {
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  gap: 1rem;
}

html.dark-mode .game-stats-bar {
  background: #1a1a1a;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.stat-item i {
  font-size: 1.5rem;
  color: #0c713d;
}

html.dark-mode .stat-item i {
  color: #4ade80;
}

.stat-item span {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

html.dark-mode .stat-item span {
  color: #e5e5e5;
}

.stat-item small {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

html.dark-mode .stat-item small {
  color: #b3b3b3;
}

.btn-play-main {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #b8860b 0%, #ffd700 100%);
  color: #0d0d0d;
  border: none;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(184, 134, 11, 0.4);
}

.btn-play-main:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(184, 134, 11, 0.6);
}

.btn-play-main i {
  font-size: 1.5rem;
}

/* ===== GAME MODES SECTION ===== */
.game-modes-section {
  margin-top: 3rem;
}

.section-heading {
  font-size: 2rem;
  font-weight: 700;
  color: #0c713d;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

html.dark-mode .section-heading {
  color: #4ade80;
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.mode-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

html.dark-mode .mode-card {
  background: #2a2a2a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.mode-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

html.dark-mode .mode-card:hover {
  box-shadow: 0 8px 20px rgba(74, 222, 128, 0.3);
}

.mode-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin-bottom: 1.5rem;
}

.mode-icon.story {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
}

.mode-icon.gacha {
  background: linear-gradient(135deg, #c71585 0%, #ff1493 100%);
}

.mode-icon.battle {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
}

.mode-icon.event {
  background: linear-gradient(135deg, #b8860b 0%, #ffd700 100%);
}

.mode-card h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.75rem 0;
}

html.dark-mode .mode-card h4 {
  color: #e5e5e5;
}

.mode-card p {
  color: #666;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

html.dark-mode .mode-card p {
  color: #b3b3b3;
}

.mode-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: #e5e5e5;
  color: #333;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

html.dark-mode .mode-badge {
  background: #404040;
  color: #e5e5e5;
}

.mode-badge.hot {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  animation: pulse-badge 2s infinite;
}

.mode-badge.limited {
  background: linear-gradient(135deg, #b8860b 0%, #ffd700 100%);
  color: #0d0d0d;
}

@keyframes pulse-badge {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 107, 107, 0);
  }
}

/* ===== UPDATES SECTION ===== */
.updates-section {
  padding: 4rem 0;
  background: white;
}

html.dark-mode .updates-section {
  background: #1a1a1a;
}

.updates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.update-card {
  display: flex;
  gap: 1.5rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
  transition: all 0.3s ease;
  border-left: 4px solid #0c713d;
}

html.dark-mode .update-card {
  background: #2a2a2a;
  border-left-color: #4ade80;
}

.update-card:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.2);
}

html.dark-mode .update-card:hover {
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
}

.update-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #0c713d;
  border-radius: 12px;
  flex-shrink: 0;
}

html.dark-mode .update-date {
  background: #4ade80;
}

.update-date .day {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

html.dark-mode .update-date .day {
  color: #0d0d0d;
}

.update-date .month {
  font-size: 0.75rem;
  color: white;
  text-transform: uppercase;
}

html.dark-mode .update-date .month {
  color: #0d0d0d;
}

.update-content {
  flex: 1;
  position: relative;
}

.update-content h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

html.dark-mode .update-content h4 {
  color: #e5e5e5;
}

.update-content p {
  color: #666;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}

html.dark-mode .update-content p {
  color: #b3b3b3;
}

.update-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: #e5e5e5;
  color: #333;
  border-radius: 8px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
}

html.dark-mode .update-badge {
  background: #404040;
  color: #e5e5e5;
}

.update-badge.new {
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  color: white;
}

html.dark-mode .update-badge.new {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #0d0d0d;
}

.update-badge.event {
  background: linear-gradient(135deg, #b8860b 0%, #ffd700 100%);
  color: #0d0d0d;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.game-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

html.dark-mode .game-card {
  background: #2a2a2a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

html.dark-mode .game-card:hover {
  box-shadow: 0 8px 30px rgba(74, 222, 128, 0.3);
}

.game-card.featured {
  border: 3px solid #ffd700;
  animation: pulse 2s infinite;
}

html.dark-mode .game-card.featured {
  border-color: #4ade80;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 8px 40px rgba(255, 215, 0, 0.6);
  }
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #0d0d0d;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.game-card-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.game-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-card-image img {
  transform: scale(1.1);
}

.game-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #0c713d;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.game-badge.gacha {
  background: #c71585;
}

.game-badge.strategy {
  background: #1e3a8a;
}

.game-badge.hybrid {
  background: linear-gradient(135deg, #b8860b 0%, #ffd700 100%);
}

.game-card-content {
  padding: 1.5rem;
}

.game-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #0c713d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

html.dark-mode .game-title {
  color: #4ade80;
}

.game-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

html.dark-mode .game-description {
  color: #b3b3b3;
}

.game-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feature-tag {
  background: #f0f0f0;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

html.dark-mode .feature-tag {
  background: #1a1a1a;
  color: #e5e5e5;
}

.game-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
}

html.dark-mode .game-stats {
  border-top-color: #404040;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

html.dark-mode .stat {
  color: #b3b3b3;
}

.stat i {
  color: #0c713d;
}

html.dark-mode .stat i {
  color: #4ade80;
}

.btn-play {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #0c713d 0%, #0a5c32 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

html.dark-mode .btn-play {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #0d0d0d;
}

.btn-play:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

html.dark-mode .btn-play:hover {
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
}

.btn-play.featured {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #0d0d0d;
  font-size: 1.125rem;
}

.btn-play.featured:hover {
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

/* ===== COMING SOON SECTION ===== */
.coming-soon-section {
  padding: 4rem 0;
  background: white;
}

html.dark-mode .coming-soon-section {
  background: #1a1a1a;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #0c713d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

html.dark-mode .section-title {
  color: #4ade80;
}

.coming-soon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.coming-soon-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

html.dark-mode .coming-soon-card {
  background: #2a2a2a;
}

.coming-soon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.coming-soon-card i {
  font-size: 3rem;
  color: #0c713d;
  margin-bottom: 1rem;
}

html.dark-mode .coming-soon-card i {
  color: #4ade80;
}

.coming-soon-card h4 {
  font-size: 1.25rem;
  margin: 1rem 0 0.5rem 0;
  color: #333;
}

html.dark-mode .coming-soon-card h4 {
  color: #e5e5e5;
}

.coming-soon-card p {
  color: #666;
  font-weight: 600;
}

html.dark-mode .coming-soon-card p {
  color: #b3b3b3;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .game-showcase {
    grid-template-columns: 1fr;
  }

  .screenshots-carousel {
    min-height: 400px;
  }

  .game-info-panel {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .container {
    padding: 0 1rem;
  }

  .section-heading {
    font-size: 1.5rem;
    flex-direction: column;
    text-align: center;
  }

  .game-header-info {
    flex-direction: column;
    text-align: center;
  }

  .game-icon {
    margin: 0 auto;
  }

  .game-main-title {
    font-size: 1.5rem;
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .game-stats-bar {
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .modes-grid {
    grid-template-columns: 1fr;
  }

  .updates-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 300px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .screenshots-carousel {
    min-height: 300px;
  }

  .game-info-panel {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .game-main-title {
    font-size: 1.25rem;
  }

  .btn-play-main {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>
