<template>
  <div>
    <button
      @click="toggleDropdown"
      class="table-of-content"
      :class="{ active: isOpen }"
    >
      <span class="button-text">Mục Lục</span>
      <i class="fas fa-list mobile-icon"></i>
    </button>

    <div v-if="isOpen" class="dropdown-backdrop" @click="closeDropdown"></div>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu" ref="dropdown">
        <div class="dropdown-content">
          <button
            v-for="chapter in chapterOptions"
            :key="chapter.value"
            @click="selectChapter(chapter.value)"
            class="dropdown-option"
            :class="{ active: chapterStore.selectedChapter === chapter.value }"
          >
            {{ chapter.label }}: {{ chapter.title }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useChapterStore } from '../stores/chapterStore';

const chapterStore = useChapterStore();
const isOpen = ref(false);

const chapterOptions = computed(() => chapterStore.chapterOptions);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const selectChapter = (chapter) => {
  chapterStore.setSelectedChapter(chapter);
  closeDropdown();
};
</script>

<style scoped>
/* ========== TABLE OF CONTENT BUTTON ========== */
.table-of-content {
  position: fixed;
  top: 150px;
  right: 80px;
  z-index: 1000;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  transition: all 0.3s ease;
  min-width: 110px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.table-of-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
}

.table-of-content:active {
  transform: translateY(0);
}

.table-of-content.active {
  background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%);
}

.button-text {
  display: inline;
}

.mobile-icon {
  display: none;
}

/* ========== DROPDOWN BACKDROP ========== */
.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  cursor: default;
}

/* ========== DROPDOWN MENU ========== */
.dropdown-menu {
  position: fixed;
  top: 180px;
  right: 80px;
  z-index: 1001;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 280px;
  max-width: 400px;
}

.dropdown-content {
  max-height: 500px;
  overflow-y: auto;
}

.dropdown-option {
  width: 100%;
  padding: 14px 18px;
  background: white;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option:hover {
  background-color: rgba(12, 113, 61, 0.08);
  padding-left: 24px;
}

.dropdown-option.active {
  background-color: #0c713d;
  color: white;
  font-weight: 700;
}

.dropdown-option.active:hover {
  background-color: #0a5a31;
}

/* ========== SCROLLBAR STYLING ========== */
.dropdown-content::-webkit-scrollbar {
  width: 8px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* ========== DROPDOWN ANIMATION ========== */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* ========== DARK MODE - APP-WIDE ========== */
html.dark-mode .dropdown-menu {
  background: var(--dark-bg-elevated);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

html.dark-mode .dropdown-option {
  background: var(--dark-bg-elevated);
  color: var(--dark-text-primary);
  border-bottom-color: var(--dark-border);
}

html.dark-mode .dropdown-option:hover {
  background-color: var(--dark-bg-card);
}

html.dark-mode .dropdown-option.active {
  background-color: var(--dark-accent-green);
  color: white;
}

html.dark-mode .dropdown-option.active:hover {
  background-color: var(--dark-accent-green-light);
}

html.dark-mode .dropdown-content::-webkit-scrollbar-track {
  background: var(--dark-bg-primary);
}

html.dark-mode .dropdown-content::-webkit-scrollbar-thumb {
  background: var(--dark-bg-elevated);
}

html.dark-mode .dropdown-content::-webkit-scrollbar-thumb:hover {
  background: var(--dark-border);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large Desktop (1440px+) */
@media (min-width: 1441px) {
  .table-of-content {
    top: 150px;
    right: 80px;
  }

  .dropdown-menu {
    top: 180px;
    right: 80px;
  }
}

/* Desktop (1280px - 1440px) */
@media (min-width: 1280px) and (max-width: 1440px) {
  .table-of-content {
    top: 150px;
    right: 80px;
  }

  .dropdown-menu {
    top: 180px;
    right: 80px;
  }
}

/* Small Laptop (1024px - 1279px) - VẪN DESKTOP MODE */
@media (min-width: 1024px) and (max-width: 1279px) {
  .table-of-content {
    top: 135px;
    right: 60px;
    min-width: 100px;
    padding: 9px 18px;
  }

  .dropdown-menu {
    top: 165px;
    right: 60px;
    min-width: 260px;
  }

  /* VẪN GIỮ NGUYÊN TEXT, ẨN ICON */
  .button-text {
    display: inline;
  }

  .mobile-icon {
    display: none;
  }
}

/* Tablet (768px - 1023px) - CHUYỂN SANG MOBILE MODE */
@media (max-width: 1023px) {
  .table-of-content {
    top: auto;
    bottom: 25px;
    right: 15px;
    min-width: 48px;
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 50%;
  }

  /* ẨN TEXT, HIỆN ICON */
  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.2rem;
  }

  .dropdown-menu {
    top: auto;
    bottom: 70px;
    right: 15px;
    min-width: 250px;
    max-width: 90vw;
  }

  .dropdown-content {
    max-height: 400px;
  }

  .dropdown-option {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
}

/* Mobile (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .table-of-content {
    bottom: 25px;
    right: 15px;
    width: 48px;
    height: 48px;
  }

  /* ĐẢM BẢO ICON VẪN HIỆN */
  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.2rem;
  }

  .dropdown-menu {
    bottom: 70px;
    right: 15px;
  }
}

/* Small Mobile (361px - 480px) */
@media (max-width: 480px) {
  .table-of-content {
    bottom: 22px;
    right: 12px;
    width: 48px;
    height: 48px;
  }

  /* ĐẢM BẢO ICON VẪN HIỆN */
  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.15rem;
  }

  .dropdown-menu {
    bottom: 68px;
    right: 12px;
    min-width: 230px;
    max-width: 85vw;
  }

  .dropdown-content {
    max-height: 350px;
  }

  .dropdown-option {
    padding: 10px 14px;
    font-size: 0.85rem;
  }
}

/* Extra Small Mobile (≤360px) */
@media (max-width: 360px) {
  .table-of-content {
    bottom: 20px;
    right: 10px;
    width: 45px;
    height: 45px;
  }

  /* ĐẢM BẢO ICON VẪN HIỆN */
  .button-text {
    display: none !important;
  }

  .mobile-icon {
    display: inline !important;
    font-size: 1.1rem;
  }

  .dropdown-menu {
    bottom: 62px;
    right: 10px;
    min-width: 200px;
  }

  .dropdown-content {
    max-height: 300px;
  }

  .dropdown-option {
    padding: 9px 12px;
    font-size: 0.8rem;
  }
}
</style>
