<template>
  <TheHeader />
  <div>
    <AboutImage />
    
    <TeamMember v-for="member in teamMembers" :key="member.name" :member="member" />
    
    <Timeline :years="years" />
    
    <VisionMissionValues :visionMissionValues="visionMissionValues" />
    
    <!-- <FAQ /> -->
  </div>
</template>

<script setup>
import TheHeader from '../../components/TheHeader.vue';
import { useAboutStore } from '../../stores/aboutStore';
import AboutImage from '../../components/about/AboutImage.vue';
import TeamMember from '../../components/about/TeamMember.vue';
import Timeline from '../../components/about/Timeline.vue';
import VisionMissionValues from '../../components/about/VisionMissionValues.vue';
// import FAQ from '../../components/about/FAQ.vue';

const aboutStore = useAboutStore();
aboutStore.fetchData(); 

const teamMembers = aboutStore.teamMembers;
const years = aboutStore.timeline; // Assuming your timeline data is stored here
const visionMissionValues = aboutStore.visionMissionValues;
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
