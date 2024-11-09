<template>
  <TheHeader />
  <div>
    <AboutImage />
    
    <TeamMember
        :author-title="authorTitle" 
        :about-introduction-title="aboutIntroductionTitle" 
    />
    
    <Timeline 
        :history-title="historyTitle"
        :personal-journey-title="personalJourneyTitle"
    />
    
    <VisionMissionValues :vision-mission-core-values-title="visionMissionCoreValuesTitle" />
    
    <!-- <FAQ /> -->
  </div>
  <TheFooter/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import AboutImage from '../../components/about/AboutImage.vue';
import TeamMember from '../../components/about/TeamMember.vue';
import Timeline from '../../components/about/Timeline.vue';
import apiLinks from '../../services/api-links';
import VisionMissionValues from '../../components/about/VisionMissionValues.vue';
const categories = ref([]);
const isCategoriesReady = ref(false); 

async function fetchCategories() {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    categories.value = JSON.parse(storedCategories);
    isCategoriesReady.value = true;
  } else {
    try {
      const response = await fetch(apiLinks.categories.getAll);
      const data = await response.json();
      localStorage.setItem('categories', JSON.stringify(data));
      categories.value = data;
      isCategoriesReady.value = true;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
}
const aboutIntroductionTitle = computed(() => 
  isCategoriesReady.value
    ? categories.value.find(category => category.code === '12' && category.page === 'about')?.name 
    : 'Một Chút Về Selorson Tales'
);

const historyTitle = computed(() => 
  isCategoriesReady.value
    ? categories.value.find(category => category.code === '13' && category.page === 'about')?.name 
    : 'Đôi Dòng Lịch Sử'
);

const visionMissionCoreValuesTitle = computed(() => 
  isCategoriesReady.value
    ? categories.value.find(category => category.code === '15' && category.page === 'about')?.name 
    : 'Tầm nhìn, Sứ mệnh và Giá trị cốt lõi'
);

const authorTitle = computed(() => 
  isCategoriesReady.value
    ? categories.value.find(category => category.code === '11' && category.page === 'about')?.name 
    : 'Phạm Hữu Hoàng Anh'
);

const personalJourneyTitle = computed(() => 
  isCategoriesReady.value
    ? categories.value.find(category => category.code === '14' && category.page === 'about')?.name 
    : 'Ngót nghét cũng 15 năm kể từ khi tập tành viết những dòng đầu tiên, nơi đây chứa đựng khao khát đam mê của tuổi trẻ, và nỗi đau, niềm vui, niềm hi vọng lúc trưởng thành.'
);

onMounted(async () => {
  await fetchCategories();
});
</script>
<style scoped>
body {
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    color: #333;
    margin: 0;
    padding: 0;
}
h1 {
    font-size: 2.5rem;
    text-align: center;
    margin: 20px 0;
    color: #007bff;
}
p {
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 30px;
    padding: 0 20px;
}
n-divider {
    margin: 20px auto;
    width: 80%;
}
.team-member {
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    background-color: #fff;
    transition: box-shadow 0.3s ease;
}

.team-member:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.timeline {
    margin: 20px 0;
}
.customer-story {
    background-color: #e9ecef;
    border-radius: 8px;
    padding: 15px;
    margin: 10px 0;
}
.n-collapse-item {
    margin: 10px 0;
}
h2 {
    font-size: 2rem;
    color: #0056b3;
    margin: 30px 0 15px;
}
@media (max-width: 768px) {
    h1 {
        font-size: 2rem;
    }
    
    h2 {
        font-size: 1.5rem;
    }
    
    .team-member {
        margin: 10px;
    }
}
</style>
