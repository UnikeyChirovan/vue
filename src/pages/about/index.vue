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
import { computed } from 'vue';
import { useCategoryStore } from '../../stores/useCategoryStore';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import AboutImage from '../../components/about/AboutImage.vue';
import TeamMember from '../../components/about/TeamMember.vue';
import Timeline from '../../components/about/Timeline.vue';
import VisionMissionValues from '../../components/about/VisionMissionValues.vue';

// Sử dụng Pinia store
const categoryStore = useCategoryStore();

// Sử dụng computed để lấy dữ liệu từ store
const aboutIntroductionTitle = computed(() => 
  categoryStore.getCategoryTitle('12', 'about', 'Một Chút Về Selorson Tales')
);

const historyTitle = computed(() => 
  categoryStore.getCategoryTitle('13', 'about', 'Đôi Dòng Lịch Sử')
);

const visionMissionCoreValuesTitle = computed(() => 
  categoryStore.getCategoryTitle('15', 'about', 'Tầm nhìn, Sứ mệnh và Giá trị cốt lõi')
);

const authorTitle = computed(() => 
  categoryStore.getCategoryTitle('11', 'about', 'Phạm Hữu Hoàng Anh')
);

const personalJourneyTitle = computed(() => 
  categoryStore.getCategoryTitle('14', 'about', 'Ngót nghét cũng 15 năm kể từ khi tập tành viết những dòng đầu tiên...')
);
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
