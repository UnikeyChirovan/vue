import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTimelineStore = defineStore('timeline', () => {
  const timelineData = ref([
    { year: 2002, events: ['Thành lập công ty TNHH Thương mại Dịch vụ Tư vấn Đầu tư Đồng Tiến (Hiện nay là Hưng Thịnh Land)'] },
    { year: 2007, events: ['Sự kiện quan trọng 1'] },
    { year: 2009, events: ['Sự kiện quan trọng 2'] },
    { year: 2010, events: ['Sự kiện quan trọng 3'] },
    { year: 2012, events: ['Sự kiện quan trọng 4'] },
    { year: 2014, events: ['Sự kiện quan trọng 5'] },
    { year: 2015, events: ['Sự kiện quan trọng 6'] },
    { year: 2016, events: ['Sự kiện quan trọng 7'] },
    { year: 2017, events: ['Sự kiện quan trọng 8'] },
    { year: 2018, events: ['Sự kiện quan trọng 9'] },
    { year: 2019, events: ['Sự kiện quan trọng 10'] },
    { year: 2020, events: ['Sự kiện quan trọng 11'] },
    { year: 2021, events: ['Sự kiện quan trọng 12'] },
    { year: 2022, events: ['Sự kiện quan trọng 13'] },
    { year: 2023, events: ['Sự kiện quan trọng 14'] },
    { year: 2024, events: ['Sự kiện quan trọng 15'] }
  ]);

  const selectedYear = ref(2002);
  const selectedYearData = ref(timelineData.value[0]);
  const pageIndex = ref(0);
  const itemsPerPage = 6;

  const setSelectedYear = (year) => {
    selectedYear.value = year;
    selectedYearData.value = timelineData.value.find(item => item.year === year);
  };

  const prevPage = () => {
    if (pageIndex.value > 0) {
      pageIndex.value -= 1;
    }
  };

  const nextPage = () => {
    if ((pageIndex.value + 1) * itemsPerPage < timelineData.value.length) {
      pageIndex.value += 1;
    }
  };

  return {
    timelineData,
    selectedYear,
    selectedYearData,
    pageIndex,
    setSelectedYear,
    prevPage,
    nextPage
  };
});
