<template>
  <div>
    <n-dropdown
      trigger="click"
      placement="bottom"
      :options="chapterOptions"
      @select="selectChapter"
      :style="dropdownStyle"
    >
      <n-button type="error" class="table-of-content">
        <span class="button-text">Mục Lục</span>
        <i class="fas fa-list mobile-icon"></i>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useChapterStore } from '../stores/chapterStore';
import { NButton, NDropdown } from 'naive-ui';

const chapterStore = useChapterStore();

const dropdownStyle = computed(() => ({
  maxHeight: '500px',
  overflowY: 'auto',
}));

const chapterOptions = computed(() =>
  chapterStore.chapterOptions.map((chapter) => ({
    label: `${chapter.label}: ${chapter.title}`,
    key: chapter.value,
    type: chapterStore.selectedChapter === chapter.value ? 'active' : null,
    props: {
      style:
        chapterStore.selectedChapter === chapter.value
          ? 'background-color: #0c713d; color: white; font-weight: 600;'
          : '',
    },
  }))
);

const selectChapter = (chapter) => {
  chapterStore.setSelectedChapter(chapter);
};
</script>

<style scoped>
.table-of-content {
  position: fixed;
  top: 135px;
  right: 80px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  min-width: 110px;
  padding: 10px 20px;
}

.table-of-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.button-text {
  display: inline;
}

.mobile-icon {
  display: none;
}

/* ========== DROPDOWN MENU STYLES ========== */
:deep(.n-dropdown-menu) {
  max-height: 500px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

:deep(.n-dropdown-option) {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.n-dropdown-option:hover) {
  background-color: rgba(12, 113, 61, 0.1);
}

:deep(.n-dropdown-option.active) {
  background-color: #0c713d;
  color: white;
  font-weight: 600;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large Desktop (1440px+) */
@media (min-width: 1441px) {
  .table-of-content {
    top: 135px;
    right: 80px;
  }
}

/* Desktop (1280px - 1440px) */
@media (min-width: 1280px) and (max-width: 1440px) {
  .table-of-content {
    top: 135px;
    right: 80px;
  }
}

/* Small Laptop (1024px - 1279px) - VẪN DESKTOP MODE */
@media (min-width: 1024px) and (max-width: 1279px) {
  .table-of-content {
    top: 120px;
    right: 60px;
    min-width: 100px;
    padding: 9px 18px;
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
    bottom: 15px;
    right: 15px;
    min-width: 48px;
    width: 48px;
    height: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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

  :deep(.n-dropdown-menu) {
    max-height: 400px;
    max-width: 90vw;
  }

  :deep(.n-dropdown-option) {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
}

/* Mobile (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .table-of-content {
    bottom: 15px;
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
}

/* Small Mobile (361px - 480px) */
@media (max-width: 480px) {
  .table-of-content {
    bottom: 12px;
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

  :deep(.n-dropdown-menu) {
    max-height: 350px;
    max-width: 85vw;
  }

  :deep(.n-dropdown-option) {
    padding: 9px 12px;
    font-size: 0.85rem;
  }
}

/* Extra Small Mobile (≤360px) */
@media (max-width: 360px) {
  .table-of-content {
    bottom: 10px;
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

  :deep(.n-dropdown-menu) {
    max-height: 300px;
  }

  :deep(.n-dropdown-option) {
    padding: 8px 10px;
    font-size: 0.8rem;
  }
}
</style>
