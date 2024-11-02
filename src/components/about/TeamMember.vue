<template>
  <div class="container-fluid team-member-container">
    <div class="title-text"><h2 class="text-uppercase">{{ aboutIntroductionTitle }}</h2></div>
    <div class="row m-0 p-0">
      <!-- Avatar và thông tin cơ bản -->
      <div class="col-md-4 info-left">
        <img class="avatar" :src="avatarImage" alt="Avatar" />
        <div class="basic-info">
          <h3>{{ authorTitle }}</h3>
          <hr />
          <div v-if="sections[1]" class="section-content">
            <p class="position"> {{ sections[1].title }}</p>
            <p class="slogan" v-html="formatContent(sections[1].content)"></p>
          </div>
          <hr />
          <div class="poem-section">
            <div v-if="sections[2]" class="section-content">
              <div class="poem">
                <h2 class="primary">{{ sections[2].title }}</h2> <!-- Chuyển tiêu đề vào trong div.poem -->
                <div v-html="formatContent(sections[2].content, sections[2].section_number)"></div>
              </div>
            </div>
          </div>
            <div v-if="coverImage" class="about-image-container mt-2">
              <img :src="coverImage" alt="Về Selorson Tales" class="about-image" />
            </div>
        </div>
      </div>
      <div class="col-md-8 content-right">
      <div v-if="sections[0]" class="section-content">
        <h2 class="text-center primary">{{ sections[0].title }}</h2>
        <div class="introduction" v-html="formatContent(sections[0].content, sections[0].section_number)"></div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import apiLinks from '../../services/api-links';
import { useLoadingStore } from '../../stores/loadingStore';
import { defineProps } from 'vue';

const props = defineProps({
  authorTitle: {
    type: String,
    required: true
  },
  aboutIntroductionTitle: {
    type: String,
    required: true
  }
});

const sections = ref({});
const loadingStore = useLoadingStore();
const coverImage = ref(null);
const avatarImage = ref(null);

// Danh sách lưu trữ các interval ID
const intervalIds = ref([]);

async function fetchSections() {
  const storedSections = localStorage.getItem('sections');
  const lastUpdated = localStorage.getItem('sections_last_updated');

  if (storedSections && lastUpdated) {
    sections.value = JSON.parse(storedSections);
  } else {
    try {
      const response = await apiLinks.sections.getAll();
      const data = response.data;

      localStorage.setItem('sections', JSON.stringify(data.sections));
      localStorage.setItem('sections_last_updated', data.last_updated);

      sections.value = data.sections;
    } catch (error) {
      console.error('Lỗi khi gọi API sections:', error);
    }
  }
}

function formatContent(content, sectionNumber) {
  return content
    .map((paragraph) => {
      if (sectionNumber === 0) {
        return `<p style="text-indent: 1.5em; margin-bottom: 3px;">${paragraph}</p>`;
      }
      else {
        let formattedParagraph = paragraph.replace(/\n/g, '<br>');
        return `<p>${formattedParagraph}</p>`;
      }
    })
    .join('');
}

const checkImage = async (imageName, imageRef) => {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  const image = images.find(img => img.image_name === imageName);
  
  if (image) {
    imageRef.value = `http://127.0.0.1:8000/storage/${image.image_path}`;
    return true;
  }
  return false;
};

const fetchImageWithRetry = async (imageName, imageRef, maxChecks = 20, intervalTime = 500) => {
  let checkCount = 0;

  // Tạo interval và lưu lại ID của nó vào danh sách
  const intervalId = setInterval(async () => {
    const found = await checkImage(imageName, imageRef);
    if (found || checkCount >= maxChecks) {
      clearInterval(intervalId);
      intervalIds.value = intervalIds.value.filter(id => id !== intervalId);
      
      if (!found) {
        const data = await loadingStore.checkAndUpdateData(apiLinks.imageManager.getImages, 'images');
        localStorage.setItem('images', JSON.stringify(data));
        await checkImage(imageName, imageRef);
      }
    }
    checkCount++;
  }, intervalTime);

  intervalIds.value.push(intervalId);
};

// Xóa tất cả interval khi component bị unmounted
onUnmounted(() => {
  intervalIds.value.forEach(clearInterval);
  intervalIds.value = [];
});

onMounted(async () => {
  await fetchSections();
  fetchImageWithRetry('TSCĐ', coverImage);
  fetchImageWithRetry('AVATAR', avatarImage);
});
</script>


<style scoped>
.section-content div {
  margin-bottom: 1em;
}

.team-member-container {
  margin-top: 0px;
  padding: 20px;
  background-color: #f8f9fa;
}

.info-left {
  text-align: center;
  animation: slideInFromLeft 1s ease-in-out;
}

.avatar {
  width: 200px;
  height: auto;
  margin-bottom: 20px;
}

.basic-info {
  text-align: center;
}

h3 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #0056b3;
}

hr {
  width: 50px;
  border: 1px solid #007bff;
  margin: 10px auto;
}

.position {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.slogan {
  font-size: 1.1rem;
  font-style: italic;
  color: #555;
  line-height: 1.5;
}
.poem-section {
  margin-top: 20px;
  text-align: center;
}

.section-content h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-align: center;
  color: #0056b3;
}

.poem {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 5px 0;
  text-align: left; 
  display: inline-block;
  padding: 1rem 1rem 0 3rem;
  font-style: italic;
  background-color: #fdf4e3; 
  border-radius: 15px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2), 
              0 0 15px rgba(0, 0, 0, 0.3); 
  border-left: 10px solid #d9b382; 
  border-right: 10px solid #d9b382;
}

/* Căn chỉnh tiêu đề bài thơ bên trong cùng khối */
.poem h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #0056b3;
  text-align: center;
  margin-top: 0;
  font-style: normal; /* Giữ tiêu đề không nghiêng */
}



.content-right {
  display: flex;
  align-items: center;
  animation: slideInFromRight 1.5s ease-in-out;
  padding: 15px; /* Thêm padding để tránh chữ bị dồn */
}

.introduction {
  font-size: 1.2rem;
  color: #333;
  line-height: 1.7;
  max-width: 85%; /* Đảm bảo chiều rộng chỉ chiếm 80% */
  margin: 0 auto; /* Canh giữa phần tử bằng cách đặt margin trái và phải tự động */
  font-style: italic; /* Định dạng chữ nghiêng */
  text-align: left; /* Canh lề trái */
  padding-left: 15px; /* Thêm padding vào lề trái */
}

.title-text {
  margin-top: 0px; 
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}
.about-image-container {
  text-align: center;
  margin-top: 20px;
}

.about-image-container img {
  width: 90%;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease; /* Chuyển đổi mượt mà */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* Bóng mờ nhẹ xung quanh */
}

/* Hiệu ứng khi di chuột vào hình ảnh */
.about-image-container img:hover {
  transform: scale(1.05) translateY(-5px); /* Phóng to nhẹ và nổi lên */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 255, 255, 0.4); /* Bóng sáng ở ngoài */
  filter: brightness(1.1); /* Làm sáng nhẹ hình ảnh */
}


.about-image {
  border-radius: 1rem;
  width: 100%;
  height: 300px;
  object-fit: fill; 
}
/* Animation for text from right */
@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Animation for avatar and info from top */
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-right {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
