<template>
  <div class="container text-center vision-mission-values">
    <h2 class="section-title">{{ visionMissionCoreValuesTitle }}</h2>
    <div class="row">
      <!-- Vision -->
      <div v-if="dataStore.sections[3]" class="col-md-4 vision-box">
        <n-icon size="64" class="vision-icon">
          <LightbulbFilament20Regular />
        </n-icon>
        <h2 class="primary">{{ dataStore.sections[3].title }}</h2>
        <div class="content" v-html="formatContent(dataStore.sections[3].content, dataStore.sections[3].section_number)"></div>
      </div>
      <!-- Mission -->
      <div v-if="dataStore.sections[4]" class="col-md-4 mission-box">
        <n-icon size="64" class="mission-icon">
          <TargetArrow24Filled />
        </n-icon>
        <h2 class="primary">{{ dataStore.sections[4].title }}</h2>
        <div class="content" v-html="formatContent(dataStore.sections[4].content, dataStore.sections[4].section_number)"></div>
      </div>
      <!-- Core Values -->
      <div v-if="dataStore.sections[5]" class="col-md-4 values-box">
        <n-icon size="64" class="values-icon">
          <Heart48Filled />
        </n-icon>
        <h2 class="primary">{{ dataStore.sections[5].title }}</h2>
        <div class="content" v-html="formatContent(dataStore.sections[5].content, dataStore.sections[5].section_number)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from '../../stores/dataStore';
import { NIcon } from 'naive-ui';
import Heart48Filled from '@vicons/fluent/Heart48Filled';
import TargetArrow24Filled from '@vicons/fluent/TargetArrow24Filled';
import LightbulbFilament20Regular from '@vicons/fluent/LightbulbFilament20Regular';

const props = defineProps({
  visionMissionCoreValuesTitle: {
    type: String,
    required: true
  },
});
const dataStore = useDataStore();


function formatContent(content, sectionNumber) {
  return content
    .map((paragraph) => {
        let formattedParagraph = paragraph.replace(/\n/g, '<br>');
        return `<p style="text-indent: 1.5em; margin-bottom: 3px;">${formattedParagraph}</p>`;
    })
    .join('');
}
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
  text-transform: uppercase;
}

h2 {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-align: center; 
}

.content {
  font-size: 1rem;
  color: #333;
  text-align: left;
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


.vision-box,
.mission-box,
.values-box {
  transition: transform 0.3s, filter 0.3s ease-in-out;
}

.vision-box:hover,
.mission-box:hover,
.values-box:hover {
  transform: translateY(-10px);
  filter: brightness(1.2); 
}
</style>
