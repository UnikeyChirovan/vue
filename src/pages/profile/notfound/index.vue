<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="not-found-card text-center p-4 border rounded shadow bg-light">
      <div class="icon-wrapper mb-4">
        <i class="fas fa-user-slash"></i>
      </div>
      <h1 class="title mb-3">Không tìm thấy thông tin</h1>
      <p class="description text-muted mb-4">
        Người dùng này có thể đã bị chặn hoặc không tồn tại.
      </p>
      <div class="button-group">
        <router-link to="/" class="modern-btn">
          <i class="fas fa-home"></i>
          <span>Về Trang Chủ</span>
        </router-link>
        <router-link to="/profile/info" class="btn-secondary">
          <i class="fas fa-user"></i>
          Trang Cá Nhân
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
.not-found-card {
  max-width: 500px;
  width: 100%;
  padding: 40px 30px !important;
  border-radius: 16px !important;
  background: white !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 50px;
  color: white;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.description {
  font-size: 16px;
  line-height: 1.6;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* Modern Button Style */
.modern-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.modern-btn::before {
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

.modern-btn:hover::before {
  width: 300px;
  height: 300px;
}

.modern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
  color: white;
}

.modern-btn:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .not-found-card {
    padding: 30px 20px !important;
  }

  .icon-wrapper {
    width: 80px;
    height: 80px;
  }

  .icon-wrapper i {
    font-size: 40px;
  }

  .title {
    font-size: 24px;
  }

  .description {
    font-size: 14px;
  }

  .button-group {
    flex-direction: column;
  }

  .modern-btn {
    width: 100%;
  }
}
</style>
