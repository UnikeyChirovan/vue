<template>
  <TheHeader />
  <div class="about-wrapper">
    <AboutImage />

    <TeamMember
      :author-title="authorTitle"
      :about-introduction-title="aboutIntroductionTitle"
    />

    <Timeline
      :history-title="historyTitle"
      :personal-journey-title="personalJourneyTitle"
    />

    <VisionMissionValues
      :vision-mission-core-values-title="visionMissionCoreValuesTitle"
    />
  </div>
  <TheFooter />
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

const categoryStore = useCategoryStore();

const aboutIntroductionTitle = computed(() =>
  categoryStore.getCategoryTitle('12', 'about', 'Một Chút Về Selorson Tales')
);

const historyTitle = computed(() =>
  categoryStore.getCategoryTitle('13', 'about', 'Đôi Dòng Lịch Sử')
);

const visionMissionCoreValuesTitle = computed(() =>
  categoryStore.getCategoryTitle(
    '15',
    'about',
    'Tầm nhìn, Sứ mệnh và Giá trị cốt lõi'
  )
);

const authorTitle = computed(() =>
  categoryStore.getCategoryTitle('11', 'about', 'Phạm Hữu Hoàng Anh')
);

const personalJourneyTitle = computed(() =>
  categoryStore.getCategoryTitle(
    '14',
    'about',
    'Ngót nghét cũng 15 năm kể từ khi tập tành viết những dòng đầu tiên...'
  )
);
</script>

<style scoped>
.about-wrapper {
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  min-height: 100vh;
}
</style>
