<template>
  <div class="vmv-wrapper">
    <div class="vmv-container">
      <h2 class="vmv-title">{{ visionMissionCoreValuesTitle }}</h2>
      <div class="vmv-grid">
        <!-- Vision -->
        <div v-if="dataStore.sections[3]" class="vmv-card vision-card">
          <div class="card-icon vision-icon">
            <n-icon size="64">
              <LightbulbFilament20Regular />
            </n-icon>
          </div>
          <h3 class="card-title">{{ dataStore.sections[3].title }}</h3>
          <div
            class="card-content"
            v-html="
              formatContent(
                dataStore.sections[3].content,
                dataStore.sections[3].section_number
              )
            "
          ></div>
        </div>

        <!-- Mission -->
        <div v-if="dataStore.sections[4]" class="vmv-card mission-card">
          <div class="card-icon mission-icon">
            <n-icon size="64">
              <TargetArrow24Filled />
            </n-icon>
          </div>
          <h3 class="card-title">{{ dataStore.sections[4].title }}</h3>
          <div
            class="card-content"
            v-html="
              formatContent(
                dataStore.sections[4].content,
                dataStore.sections[4].section_number
              )
            "
          ></div>
        </div>

        <!-- Core Values -->
        <div v-if="dataStore.sections[5]" class="vmv-card values-card">
          <div class="card-icon values-icon">
            <n-icon size="64">
              <Heart48Filled />
            </n-icon>
          </div>
          <h3 class="card-title">{{ dataStore.sections[5].title }}</h3>
          <div
            class="card-content"
            v-html="
              formatContent(
                dataStore.sections[5].content,
                dataStore.sections[5].section_number
              )
            "
          ></div>
        </div>
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
    required: true,
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
/* ========== MODERN VMV DESIGN ========== */
.vmv-wrapper {
  padding: 80px 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.vmv-container {
  max-width: 1400px;
  margin: 0 auto;
}

.vmv-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: #0c713d;
  margin-bottom: 60px;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 20px;
}

.vmv-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #0c713d, transparent);
  border-radius: 2px;
}

.vmv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

/* ========== CARD STYLES ========== */
.vmv-card {
  background: white;
  padding: 45px 35px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.vmv-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: transform 0.4s ease;
  transform: scaleX(0);
}

.vmv-card:hover::before {
  transform: scaleX(1);
}

.vmv-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
}

/* Vision Card */
.vision-card::before {
  background: linear-gradient(90deg, #f39c12, #e67e22);
}

.vision-card:hover {
  border-color: rgba(243, 156, 18, 0.3);
}

/* Mission Card */
.mission-card::before {
  background: linear-gradient(90deg, #3498db, #2980b9);
}

.mission-card:hover {
  border-color: rgba(52, 152, 219, 0.3);
}

/* Values Card */
.values-card::before {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.values-card:hover {
  border-color: rgba(231, 76, 60, 0.3);
}

/* ========== CARD ICONS ========== */
.card-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  transition: transform 0.3s ease;
}

.vmv-card:hover .card-icon {
  transform: scale(1.1);
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

/* ========== CARD CONTENT ========== */
.card-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  text-align: center;
}

.card-content {
  font-size: 1.05rem;
  color: #444;
  line-height: 1.7;
  text-align: left;
}

.card-content p {
  margin-bottom: 10px;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1200px) {
  .vmv-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 35px;
  }

  .values-card {
    grid-column: 1 / -1;
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 1024px) {
  .vmv-wrapper {
    padding: 70px 20px;
  }

  .vmv-title {
    font-size: 2.2rem;
    margin-bottom: 50px;
  }

  .vmv-card {
    padding: 40px 30px;
  }

  .card-title {
    font-size: 1.6rem;
  }

  .card-content {
    font-size: 1.03rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .vmv-wrapper {
    padding: 60px 15px;
  }

  .vmv-title {
    font-size: 1.9rem;
    margin-bottom: 40px;
  }

  .vmv-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .values-card {
    grid-column: 1;
    max-width: 100%;
  }

  .vmv-card {
    padding: 35px 25px;
  }

  .card-icon :deep(svg) {
    width: 56px;
    height: 56px;
  }

  .card-title {
    font-size: 1.5rem;
    margin-bottom: 18px;
  }

  .card-content {
    font-size: 1rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .vmv-wrapper {
    padding: 50px 10px;
  }

  .vmv-title {
    font-size: 1.6rem;
    margin-bottom: 35px;
  }

  .vmv-title::after {
    width: 60px;
    height: 3px;
  }

  .vmv-grid {
    gap: 25px;
  }

  .vmv-card {
    padding: 30px 20px;
    border-radius: 16px;
  }

  .card-icon :deep(svg) {
    width: 48px;
    height: 48px;
  }

  .card-icon {
    margin-bottom: 20px;
  }

  .card-title {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }

  .card-content {
    font-size: 0.95rem;
    line-height: 1.6;
  }
}
</style>
