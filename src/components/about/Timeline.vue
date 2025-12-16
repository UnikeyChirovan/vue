<template>
  <div class="timeline-wrapper">
    <div class="timeline-container">
      <h2 class="timeline-title text-uppercase">{{ historyTitle }}</h2>
      <p class="timeline-subtitle">{{ personalJourneyTitle }}</p>
      <div class="timeline-embed">
        <iframe
          src="https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1oXF6tI1oK1dRaVqalfZVQZf4ILPvPO5-mr4b-ZilT50&font=Default&lang=en&initial_zoom=2&height=650"
          class="timeline-frame"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  historyTitle: {
    type: String,
    required: true,
  },
  personalJourneyTitle: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
/* ========== MODERN TIMELINE DESIGN ========== */
.timeline-wrapper {
  padding: 80px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

html.dark-mode .timeline-wrapper {
  background: linear-gradient(135deg, #0a0a0a 0%, #121212 100%);
}

.timeline-container {
  max-width: 1400px;
  margin: 0 auto;
}

.timeline-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: #0c713d;
  margin-bottom: 25px;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 20px;
}

html.dark-mode .timeline-title {
  color: #0f8a4a;
}

.timeline-title::after {
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

html.dark-mode .timeline-title::after {
  background: linear-gradient(90deg, transparent, #0f8a4a, transparent);
}

.timeline-subtitle {
  text-align: center;
  font-size: 1.15rem;
  color: #555;
  margin-bottom: 50px;
  line-height: 1.7;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

html.dark-mode .timeline-subtitle {
  color: #b0b0b0;
}

.timeline-embed {
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(12, 113, 61, 0.1);
  overflow: hidden;
  position: relative;
}

html.dark-mode .timeline-embed {
  background: #1e1e1e;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border-color: rgba(15, 138, 74, 0.2);
}

/* Dark mode iframe overlay để cải thiện khả năng đọc */
html.dark-mode .timeline-embed::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 30px;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: none;
  z-index: 1;
  border-radius: 12px;
}

.timeline-frame {
  width: 100%;
  height: 650px;
  border: none;
  border-radius: 12px;
  display: block;
  position: relative;
  z-index: 2;
}

html.dark-mode .timeline-frame {
  filter: brightness(0.9) contrast(1.1);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1024px) {
  .timeline-wrapper {
    padding: 70px 20px;
  }

  .timeline-title {
    font-size: 2.2rem;
    margin-bottom: 20px;
  }

  .timeline-subtitle {
    font-size: 1.1rem;
    margin-bottom: 40px;
  }

  .timeline-embed {
    padding: 25px;
  }

  html.dark-mode .timeline-embed::before {
    top: 25px;
    left: 25px;
    right: 25px;
    bottom: 25px;
  }

  .timeline-frame {
    height: 600px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .timeline-wrapper {
    padding: 60px 15px;
  }

  .timeline-title {
    font-size: 1.9rem;
    margin-bottom: 18px;
    padding-bottom: 18px;
  }

  .timeline-title::after {
    width: 80px;
    height: 3px;
  }

  .timeline-subtitle {
    font-size: 1.05rem;
    margin-bottom: 35px;
    padding: 0 15px;
  }

  .timeline-embed {
    padding: 20px;
    border-radius: 20px;
  }

  html.dark-mode .timeline-embed::before {
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }

  .timeline-frame {
    height: 550px;
    border-radius: 10px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .timeline-wrapper {
    padding: 50px 10px;
  }

  .timeline-title {
    font-size: 1.6rem;
    margin-bottom: 15px;
    padding-bottom: 15px;
  }

  .timeline-title::after {
    width: 60px;
    height: 3px;
  }

  .timeline-subtitle {
    font-size: 1rem;
    margin-bottom: 30px;
    padding: 0 10px;
  }

  .timeline-embed {
    padding: 15px;
    border-radius: 16px;
  }

  html.dark-mode .timeline-embed::before {
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
  }

  .timeline-frame {
    height: 500px;
    border-radius: 8px;
  }
}

/* Extra Small Mobile (< 375px) */
@media (max-width: 374px) {
  .timeline-wrapper {
    padding: 40px 8px;
  }

  .timeline-title {
    font-size: 1.4rem;
  }

  .timeline-subtitle {
    font-size: 0.95rem;
  }

  .timeline-frame {
    height: 450px;
  }
}
</style>
