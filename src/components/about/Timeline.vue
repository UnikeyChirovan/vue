<template>
  <div class="container">
    <h2 class="text-center text-uppercase mt-3">{{ historyTitle }}</h2>
    <p class="text-center mb-4">
     {{ personalJourneyTitle }}
    </p>
    <div class="timeline-container">
      <iframe src="https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1oXF6tI1oK1dRaVqalfZVQZf4ILPvPO5-mr4b-ZilT50&font=Default&lang=en&initial_zoom=2&height=650" 
              width="100%" height="650" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0"></iframe>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps({
  historyTitle: {
    type: String,
    required: true
  },
  personalJourneyTitle: {
    type: String,
    required: true
  }
  });
</script>
<style scoped>
.container {
  width: 100%;
  margin: auto;
}

h2 {
  font-size: 2rem;
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
</style>
