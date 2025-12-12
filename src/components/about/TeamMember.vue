<template>
  <div class="team-member-wrapper">
    <div class="team-member-container">
      <h2 class="section-title text-uppercase">{{ aboutIntroductionTitle }}</h2>
      <div class="team-content">
        <div class="info-left">
          <div class="avatar-container">
            <img
              class="avatar"
              :src="avatarImage"
              alt="Avatar"
              loading="lazy"
            />
          </div>
          <div class="basic-info">
            <h3 class="author-name">{{ authorTitle }}</h3>
            <div class="divider"></div>
            <div v-if="sections[1]" class="section-content">
              <p class="position">{{ sections[1].title }}</p>
              <p class="slogan" v-html="formatContent(sections[1].content)"></p>
            </div>
            <div class="divider"></div>
            <div class="poem-section">
              <div v-if="sections[2]" class="section-content">
                <div class="poem">
                  <h4 class="poem-title">{{ sections[2].title }}</h4>
                  <div
                    class="poem-content"
                    v-html="
                      formatContent(
                        sections[2].content,
                        sections[2].section_number
                      )
                    "
                  ></div>
                </div>
              </div>
            </div>
            <div v-if="coverImage" class="about-image-container">
              <img
                :src="coverImage"
                alt="Về Selorson Tales"
                class="about-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div class="content-right">
          <div v-if="sections[0]" class="section-content">
            <h2 class="introduction-title">{{ sections[0].title }}</h2>
            <div
              class="introduction"
              v-html="
                formatContent(sections[0].content, sections[0].section_number)
              "
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import apiLinks from '../../services/api-links';

const props = defineProps({
  authorTitle: {
    type: String,
    required: true,
  },
  aboutIntroductionTitle: {
    type: String,
    required: true,
  },
});

const sections = ref({});
const coverImage = ref(null);
const avatarImage = ref(null);
const intervalIds = ref([]);

const checkImage = (imageName, imageRef) => {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  const image = images.find((img) => img.image_name === imageName);

  if (image) {
    imageRef.value = `http://127.0.0.1:8000/storage/${image.image_path}`;
    return true;
  }
  return false;
};

const fetchImageWithRetry = async (
  imageName,
  imageRef,
  maxChecks = 10,
  intervalTime = 1000
) => {
  let checkCount = 0;

  const intervalId = setInterval(async () => {
    const found = checkImage(imageName, imageRef);
    if (found || checkCount >= maxChecks) {
      clearInterval(intervalId);
      intervalIds.value = intervalIds.value.filter((id) => id !== intervalId);

      if (!found) {
        try {
          const response = await apiLinks.imageManager.getImages();
          localStorage.setItem('images', JSON.stringify(response.data));
          checkImage(imageName, imageRef);
        } catch (error) {
          console.error('Lỗi khi gọi API lấy hình ảnh:', error);
        }
      }
    }
    checkCount++;
  }, intervalTime);

  intervalIds.value.push(intervalId);
};

async function fetchSections() {
  const storedSections = localStorage.getItem('sections');

  if (storedSections) {
    sections.value = JSON.parse(storedSections);
  } else {
    try {
      const response = await apiLinks.sections.getAll();
      const data = response.data;

      localStorage.setItem('sections', JSON.stringify(data.sections));
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
      } else {
        let formattedParagraph = paragraph.replace(/\n/g, '<br>');
        return `<p>${formattedParagraph}</p>`;
      }
    })
    .join('');
}

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
/* ========== MODERN TEAM MEMBER DESIGN ========== */
.team-member-wrapper {
  padding: 80px 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.team-member-container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: #0c713d;
  margin-bottom: 60px;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 20px;
}

.section-title::after {
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

.team-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 50px;
  align-items: start;
}

/* ========== LEFT SECTION ========== */
.info-left {
  background: white;
  padding: 40px 30px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  text-align: center;
  position: sticky;
  top: 100px;
  animation: slideInFromLeft 1s ease-in-out;
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.avatar-container {
  margin-bottom: 25px;
}

.avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #0c713d;
  box-shadow: 0 8px 24px rgba(12, 113, 61, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(12, 113, 61, 0.4);
}

.basic-info {
  text-align: center;
}

.author-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0c713d;
  margin-bottom: 15px;
}

.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #0c713d, transparent);
  margin: 20px auto;
  border-radius: 2px;
}

.position {
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 15px;
}

.slogan {
  font-size: 1.1rem;
  font-style: italic;
  color: #555;
  line-height: 1.6;
}

.poem-section {
  margin-top: 30px;
}

.poem {
  font-size: 1.05rem;
  line-height: 1.7;
  text-align: left;
  display: inline-block;
  padding: 25px 30px;
  font-style: italic;
  background: linear-gradient(135deg, #fdf4e3 0%, #f9ead5 100%);
  border-radius: 16px;
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.1),
    0 4px 20px rgba(0, 0, 0, 0.15);
  border-left: 6px solid #d9b382;
  border-right: 6px solid #d9b382;
  max-width: 100%;
}

.poem-title {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #0c713d;
  text-align: center;
  font-style: normal;
  font-weight: 700;
}

.poem-content {
  color: #444;
}

.about-image-container {
  margin-top: 30px;
}

.about-image {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.about-image:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

/* ========== RIGHT SECTION ========== */
.content-right {
  background: white;
  padding: 50px 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 113, 61, 0.1);
  animation: slideInFromRight 1.2s ease-in-out;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.introduction-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0c713d;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 15px;
}

.introduction-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #0c713d, transparent);
  border-radius: 2px;
}

.introduction {
  font-size: 1.15rem;
  color: #333;
  line-height: 1.8;
  font-style: italic;
  text-align: justify;
}

.introduction p {
  margin-bottom: 15px;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet */
@media (max-width: 1200px) {
  .team-content {
    grid-template-columns: 1fr 1.5fr;
    gap: 40px;
  }

  .content-right {
    padding: 40px 30px;
  }
}

@media (max-width: 1024px) {
  .team-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .info-left {
    position: static;
  }

  .section-title {
    font-size: 2.2rem;
    margin-bottom: 50px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .team-member-wrapper {
    padding: 60px 15px;
  }

  .section-title {
    font-size: 1.9rem;
    margin-bottom: 40px;
  }

  .info-left,
  .content-right {
    padding: 35px 25px;
  }

  .avatar {
    width: 150px;
    height: 150px;
  }

  .author-name {
    font-size: 1.6rem;
  }

  .position {
    font-size: 1.2rem;
  }

  .slogan {
    font-size: 1.05rem;
  }

  .poem {
    padding: 20px 25px;
    font-size: 1rem;
  }

  .poem-title {
    font-size: 1.2rem;
  }

  .introduction-title {
    font-size: 1.7rem;
  }

  .introduction {
    font-size: 1.08rem;
    line-height: 1.7;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .team-member-wrapper {
    padding: 50px 10px;
  }

  .section-title {
    font-size: 1.6rem;
    margin-bottom: 30px;
  }

  .info-left,
  .content-right {
    padding: 25px 20px;
    border-radius: 16px;
  }

  .avatar {
    width: 130px;
    height: 130px;
  }

  .author-name {
    font-size: 1.4rem;
  }

  .position {
    font-size: 1.1rem;
  }

  .slogan {
    font-size: 1rem;
  }

  .poem {
    padding: 18px 20px;
    font-size: 0.95rem;
    border-left-width: 4px;
    border-right-width: 4px;
  }

  .poem-title {
    font-size: 1.1rem;
  }

  .introduction-title {
    font-size: 1.5rem;
  }

  .introduction {
    font-size: 1rem;
    line-height: 1.6;
  }
}
</style>
