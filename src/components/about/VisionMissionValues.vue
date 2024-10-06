<template>
  <div class="container text-center vision-mission-values">
    <h2 class="section-title">Tầm nhìn, Sứ mệnh và Giá trị cốt lõi</h2>
    <div class="row">
      <!-- Vision -->
        <div
        :ref="index === 0 ? 'vision' : index === 1 ? 'mission' : 'values'"
        class="col-md-4"
        :class="{
            'vision-box': index === 0,
            'mission-box': index === 1,
            'values-box': index === 2,
            'is-visible': (index === 0 && visionVisible) || (index === 1 && missionVisible) || (index === 2 && valuesVisible)
        }"
        v-for="(item, index) in visionMissionValues"
        :key="index"
        >
        <!-- Hiển thị icon với màu sắc động -->
        <n-icon v-if="index === 0" size="64" class="vision-icon">
          <LightbulbFilament20Regular />
        </n-icon>
        <n-icon v-else-if="index === 1" size="64" class="mission-icon">
          <TargetArrow24Filled />
        </n-icon>
        <n-icon v-else size="64" class="values-icon">
          <Heart48Filled />
        </n-icon>

        <!-- Tiêu đề canh giữa và nội dung canh trái -->
        <h3>{{ item.title }}</h3>
        <p v-if="typeof item.content === 'string'">{{ item.content }}</p>
        <ul v-else>
          <li v-for="(value, idx) in item.content" :key="idx">{{ value }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { NIcon } from 'naive-ui';
import Heart48Filled from '@vicons/fluent/Heart48Filled';
import TargetArrow24Filled from '@vicons/fluent/TargetArrow24Filled';
import LightbulbFilament20Regular from '@vicons/fluent/LightbulbFilament20Regular';
import { useAboutStore } from '../../stores/aboutStore'; // Import store

// Lấy dữ liệu từ store
const aboutStore = useAboutStore();
aboutStore.fetchData();
const visionMissionValues = aboutStore.visionMissionValues;

// Intersection Observer để theo dõi phần tử khi nó xuất hiện trong viewport
const visionVisible = ref(false);
const missionVisible = ref(false);
const valuesVisible = ref(false);

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('vision-box')) {
            visionVisible.value = true;
          } else if (entry.target.classList.contains('mission-box')) {
            missionVisible.value = true;
          } else if (entry.target.classList.contains('values-box')) {
            valuesVisible.value = true;
          }
        }
      });
    },
    { threshold: 0.1 } // Tỷ lệ hiển thị cần để kích hoạt observer (10%)
  );

  // Quan sát các phần tử
  const visionBox = document.querySelector('.vision-box');
  const missionBox = document.querySelector('.mission-box');
  const valuesBox = document.querySelector('.values-box');

  if (visionBox) observer.observe(visionBox);
  if (missionBox) observer.observe(missionBox);
  if (valuesBox) observer.observe(valuesBox);
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect(); // Ngắt observer khi component bị hủy
  }
});
</script>

<style scoped>
.vision-mission-section {
  margin-bottom: 40px; /* Khoảng cách giữa tiêu đề và nội dung */
  text-align: center; /* Canh giữa tiêu đề */
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30px;
  text-transform: uppercase; /* In hoa tiêu đề */
}

.vision-mission-values {
  padding: 40px 0;
}

h3 {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-align: center; /* Canh giữa tiêu đề */
}

p,
li {
  font-size: 1rem;
  color: #333;
  text-align: left; /* Canh lề trái cho nội dung */
}

ul {
  padding-left: 0;
  list-style: none;
}

ul li::before {
  content: '•';
  color: #ff5722;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

/* Kích thước và màu sắc cho từng icon */
.vision-icon {
  color: #f39c12;
}

.mission-icon {
  color: #3498db;
}

.values-icon {
  color: #e74c3c;
}

/* Hiệu ứng hover: sáng và nhích lên */
.vision-box,
.mission-box,
.values-box {
  transition: transform 0.3s, filter 0.3s ease-in-out;
}

.vision-box:hover,
.mission-box:hover,
.values-box:hover {
  transform: translateY(-10px); /* Nhích lên khi hover */
  filter: brightness(1.2); /* Sáng lên khi hover */
}

/* Hiệu ứng khi xuất hiện */
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Gắn hiệu ứng cho từng box khi xuất hiện */
.vision-box.is-visible {
  animation: slideInLeft 1s ease-in-out;
}

.mission-box.is-visible {
  animation: slideInUp 1s ease-in-out;
}

.values-box.is-visible {
  animation: slideInRight 1s ease-in-out;
}
</style>
