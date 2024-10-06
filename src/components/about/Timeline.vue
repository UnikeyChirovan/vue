<template>
  <div class="container">
    <h2 class="text-center">Đôi Dòng Lịch Sử</h2>
    <p class="text-center mb-4">
     Ngót nghét cũng 15 năm kể từ khi tập tành viết những dòng đầu tiên, nơi đây chứa đựng khao khát đam mê của tuổi trẻ, và nỗi đau, niềm vui, niềm hi vọng lúc trưởng thành.
    </p>
    <div class="timeline-container">
      <button @click="previousPage" class="arrow-left">←</button>
      <n-timeline horizontal size="large">
        <n-timeline-item
          v-for="(year, index) in paginatedYears"
          :key="year.year"
          @click="selectYear(year.year)"
          :class="{'active': selectedYear === year.year}"
          type="success"
        >
          <template #default>
            <span>{{ year.year }}</span>
          </template>
        </n-timeline-item>
      </n-timeline>
      <button @click="nextPage" class="arrow-right">→</button>
    </div>
    <div class="year-content mt-4">
      <h3>Thông tin năm {{ selectedYear }}</h3>
      <ul>
        <li v-for="(detail, index) in selectedYearDetails.details" :key="index">
          {{ detail }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { NTimeline, NTimelineItem } from 'naive-ui';
import { toRefs } from 'vue';

const props = defineProps({
  years: {
    type: Array,
    required: true,
  }
});

const { years } = toRefs(props);

const selectedYear = ref(years.value[0].year);
const selectedYearDetails = ref(years.value[0]);
const itemsPerPage = ref(6);
const currentPage = ref(0);

const paginatedYears = computed(() => {
  const start = currentPage.value * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return years.value.slice(start, end);
});

const selectYear = (year) => {
  selectedYear.value = year;
  selectedYearDetails.value = years.value.find((y) => y.year === year);
};

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if ((currentPage.value + 1) * itemsPerPage.value < years.value.length) {
    currentPage.value += 1;
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  margin: auto;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

p {
  font-size: 16px;
  margin-bottom: 24px;
}
.timeline-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  width: 100%;
}

.n-timeline-item {
  min-width: 50px;
  width: 150px;
  flex: 1;
}

.n-timeline {
  padding: 20px;
}

.n-timeline-item-timeline__line {
  border: 3px solid red;
}

.arrow-left,
.arrow-right {
  background-color: #f0f0f0;
  border: none;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  margin: 0 10px;
}

.n-timeline-item.active .n-timeline-item-title {
  color: orange;
}

.year-content {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
}

.year-content h3 {
  font-size: 20px;
  margin-bottom: 12px;
}

.year-content ul {
  list-style-type: none;
  padding-left: 0;
}

.year-content ul li {
  margin-bottom: 8px;
}
</style>
