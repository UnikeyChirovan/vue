<template>
  <div class="vmv-wrapper">
    <div class="vmv-container">
      <h2 class="vmv-title">{{ visionMissionCoreValuesTitle }}</h2>
      <div class="vmv-grid">
        <!-- Vision -->
        <div v-if="dataStore.sections[3]" class="vmv-card vision-card">
          <div class="card-icon vision-icon">
            <svg
              class="icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
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
            <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              <circle cx="12" cy="12" r="2" />
            </svg>
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
            <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
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

.icon-svg {
  width: 64px;
  height: 64px;
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

/* ========== DARK MODE ========== */
.dark-mode .vmv-wrapper {
  background: linear-gradient(180deg, var(--dark-bg-primary) 0%, #0d0d0d 100%);
}

.dark-mode .vmv-title {
  color: var(--dark-accent-green-light);
}

.dark-mode .vmv-title::after {
  background: linear-gradient(
    90deg,
    transparent,
    var(--dark-accent-green),
    transparent
  );
}

.dark-mode .vmv-card {
  background: var(--dark-bg-card);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.dark-mode .vmv-card:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
}

.dark-mode .card-title {
  color: var(--dark-text-primary);
}

.dark-mode .card-content {
  color: var(--dark-text-secondary);
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

  .icon-svg {
    width: 56px;
    height: 56px;
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

  .icon-svg {
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

  .icon-svg {
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
