<template>
  <div class="container text-center vision-mission-values">
    <h2 class="section-title">{{ visionMissionCoreValuesTitle }}</h2>
    <div class="row">
      <!-- Vision -->
      <div v-if="sections[3]" class="col-md-4 vision-box">
        <n-icon size="64" class="vision-icon">
          <LightbulbFilament20Regular />
        </n-icon>
        <h2 class="primary">{{ sections[3].title }}</h2>
        <div class="content" v-html="formatContent(sections[3].content, sections[3].section_number)"></div>
      </div>
      
      <!-- Mission -->
      <div v-if="sections[4]" class="col-md-4 mission-box">
        <n-icon size="64" class="mission-icon">
          <TargetArrow24Filled />
        </n-icon>
        <h2 class="primary">{{ sections[4].title }}</h2>
        <div class="content" v-html="formatContent(sections[4].content, sections[4].section_number)"></div>
      </div>

      <!-- Core Values -->
      <div v-if="sections[5]" class="col-md-4 values-box">
        <n-icon size="64" class="values-icon">
          <Heart48Filled />
        </n-icon>
        <h2 class="primary">{{ sections[5].title }}</h2>
        <div class="content" v-html="formatContent(sections[5].content, sections[5].section_number)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiLinks from '../../services/api-links';
import { NIcon } from 'naive-ui';
import Heart48Filled from '@vicons/fluent/Heart48Filled';
import TargetArrow24Filled from '@vicons/fluent/TargetArrow24Filled';
import LightbulbFilament20Regular from '@vicons/fluent/LightbulbFilament20Regular';
import { defineProps } from 'vue';

const props = defineProps({
  visionMissionCoreValuesTitle: {
    type: String,
    required: true
  },
});

const sections = ref({});

async function fetchSections() {
  const storedSections = localStorage.getItem('sections');
  const lastUpdated = localStorage.getItem('sections_last_updated');

  if (storedSections && lastUpdated) {
    sections.value = JSON.parse(storedSections);
  } else {
    try {
      const response = await apiLinks.sections.getAll();
      const data = response.data;

      localStorage.setItem('sections', JSON.stringify(data.sections));
      localStorage.setItem('sections_last_updated', data.last_updated);

      sections.value = data.sections;
    } catch (error) {
      console.error('Lỗi khi gọi API sections:', error);
    }
  }
}

function formatContent(content, sectionNumber) {
  return content
    .map((paragraph) => {
        let formattedParagraph = paragraph.replace(/\n/g, '<br>');
        return `<p style="text-indent: 1.5em; margin-bottom: 3px;">${formattedParagraph}</p>`;
    })
    .join('');
}

onMounted(() => {
  fetchSections();
});
</script>

<style scoped>
.vision-mission-values {
  padding: 40px 0;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30px;
  text-transform: uppercase; /* In hoa tiêu đề */
}

h2 {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-align: center; /* Canh giữa tiêu đề */
}

.content {
  font-size: 1rem;
  color: #333;
  text-align: left; /* Canh lề trái cho nội dung */
}

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
</style>
