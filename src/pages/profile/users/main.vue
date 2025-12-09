<template>
  <div class="profile-page">
    <div class="cover-section">
      <img
        :src="coverUrl ? coverUrl : 'https://picsum.photos/1200x300'"
        alt="Cover Image"
        class="cover-img"
      />
      <button
        v-if="authStore.user?.id === users.id"
        class="edit-cover-btn"
        @click="CoverEdit"
      >
        Edit Cover
      </button>
      <div class="avatar-section">
        <n-image
          class="avatar-img"
          alt="User Profile"
          :src="avatarUrl || 'https://picsum.photos/150'"
        />
        <button
          v-if="authStore.user?.id === users.id"
          @click="handleCameraClick"
          class="camera-btn"
        >
          <i class="fa-solid fa-camera"></i>
        </button>
      </div>
    </div>

    <!-- User Info Section -->
    <div class="user-info">
      <h1 class="username">{{ users.name }}</h1>
      <n-rate color="#4fb233" readonly :default-value="5" />
      <p class="occupation">{{ users.occupation }}</p>
      <p class="location">
        <i class="fas fa-map-marker-alt"></i> {{ users.address }}
      </p>
      <p class="birthday" v-if="formattedBirthday">
        <i class="fas fa-birthday-cake"></i>Sinh Nhật: {{ formattedBirthday }}
      </p>
      <p class="gender" v-if="users.gender">
        <i class="fas fa-venus-mars"></i>Giới Tính: {{ users.gender }}
      </p>

      <div class="social-links">
        <i class="fab fa-facebook-f social-icon"></i>
        <i class="fab fa-twitter social-icon"></i>
        <i class="fab fa-linkedin-in social-icon"></i>
        <i class="fab fa-youtube social-icon"></i>
      </div>

      <div class="stats">
        <div class="stat">
          <h3>150</h3>
          <p>Posts</p>
        </div>
        <div class="stat">
          <h3>300</h3>
          <p>Followers</p>
        </div>
        <div class="stat">
          <h3>180</h3>
          <p>Following</p>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="about-section card">
      <h2>About Me</h2>
      <p>
        {{ users.biography }}
      </p>
    </div>

    <!-- Skills Section -->
    <div class="skills-section card">
      <h2>Skills</h2>
      <ul class="skills-list">
        <li><i class="fas fa-check-circle"></i> JavaScript</li>
        <li><i class="fas fa-check-circle"></i> Vue.js</li>
        <li><i class="fas fa-check-circle"></i> HTML & CSS</li>
      </ul>

      <div class="skill-chart">
        <div class="chart">85%</div>
        <div class="chart">90%</div>
        <div class="chart">80%</div>
      </div>
    </div>

    <!-- Portfolio Section -->
    <div class="portfolio-section">
      <h2>Portfolio</h2>
      <div class="projects">
        <div class="project">
          <img src="https://picsum.photos/400x300" alt="Project Image" />
          <div class="project-info">
            <h3>Project Title 1</h3>
            <p>Short description of the project.</p>
          </div>
        </div>

        <div class="project">
          <img src="https://picsum.photos/400x300" alt="Project Image" />
          <div class="project-info">
            <h3>Project Title 2</h3>
            <p>Short description of the project.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Section -->
    <div class="footer">
      <p>&copy; 2024 John Doe. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { useAuthStore } from '../../../stores/auth.js';
import { useMenuProfile } from '../../../stores/use-menu-profile.js';
import { useProfileStore } from '../../../stores/profile.js';
import { useGeneralStore } from '../../../stores/general';
import dayjs from 'dayjs';

const authStore = useAuthStore();
const useGeneral = useGeneralStore();
const useProfile = useProfileStore();
const { isCropperModal, avatarUpdated } = storeToRefs(useGeneral);

const id = authStore.user?.id;
const users = ref({});
const avatarUrl = computed(() => useProfile.avatarUrl);
const coverUrl = ref(null);
const message = useMessage();

const handleCameraClick = () => {
  isCropperModal.value = true;
};

const formattedBirthday = computed(() => {
  if (users.value.birthday) {
    return dayjs(users.value.birthday).format('DD-MM');
  }
  return '';
});

const getProfile = async () => {
  await useProfile.getProfile(id);
  users.value = useProfile.users;
};

watch(
  () => avatarUpdated.value,
  (newValue) => {
    if (newValue) {
      console.log('Avatar updated, updating avatarUrl in profile store...');
      useProfile.updateAvatarUrl(`${useProfile.avatarUrl}`);
      useGeneral.setAvatarUpdated(false);
    }
  }
);
onMounted(() => {
  useMenuProfile().onSelectedKey(['profile-info']);
  getProfile();
});
</script>

<style lang="scss" scoped>
.profile-page {
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #f7f7f7;

  /* Cover Section */
  .cover-section {
    position: relative;
    height: 300px;
    background-color: #282c34;

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.75);
    }

    .avatar-section {
      position: relative;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 200px;
      border-radius: 50%;
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
      z-index: 10;

      .camera-btn {
        position: absolute;
        right: 0;
        top: 150px;
        background-color: #e2e8f0;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .camera-btn:hover {
        background-color: #cbd5e1;
      }

      .avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid white;
      }
    }

    .edit-cover-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
  }

  /* User Info Section */
  .user-info {
    text-align: center;
    padding: 100px 20px 20px;
    position: relative;

    .username {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0;
    }

    .occupation {
      color: #777;
      font-size: 1.2rem;
      margin: 5px 0;
    }

    .location,
    .birthday,
    .gender {
      font-size: 1rem;
      color: #555;
      margin: 5px 0;

      i {
        margin-right: 5px;
      }
    }

    .social-links {
      margin: 10px 0;

      .social-icon {
        font-size: 1.5rem;
        margin: 0 10px;
        color: #333;
        transition: color 0.3s;
        cursor: pointer;
        &:hover {
          color: #007bff;
        }
      }
    }

    .stats {
      display: flex;
      justify-content: center;
      margin: 20px 0;

      .stat {
        margin: 0 20px;

        h3 {
          font-size: 1.5rem;
          margin: 0;
        }

        p {
          margin: 0;
          color: #777;
        }
      }
    }
  }

  /* About Section */
  .about-section {
    margin: 20px 0;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

    h2 {
      margin-bottom: 15px;
      font-size: 1.5rem;
    }
  }

  /* Skills Section */
  .skills-section {
    margin: 20px 0;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

    h2 {
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .skills-list {
      list-style-type: none;
      padding: 0;

      li {
        font-size: 1rem;
        margin: 5px 0;
        i {
          color: #007bff;
          margin-right: 5px;
        }
      }
    }

    .skill-chart {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

      .chart {
        width: 30%;
        height: 20px;
        background-color: #007bff;
        border-radius: 5px;
        position: relative;
        &:first-child {
          height: 20px;
        }
        &:nth-child(2) {
          height: 40px;
        }
        &:last-child {
          height: 60px;
        }
      }
    }
  }

  /* Portfolio Section */
  .portfolio-section {
    margin: 20px 0;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

    h2 {
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .projects {
      display: flex;
      justify-content: space-between;

      .project {
        width: 48%;
        margin-bottom: 15px;

        img {
          width: 100%;
          border-radius: 5px;
        }

        .project-info {
          padding: 10px;
          background-color: #f1f1f1;
          border-radius: 5px;
          h3 {
            margin: 0;
            font-size: 1.2rem;
          }
          p {
            margin: 5px 0 0;
            color: #555;
          }
        }
      }
    }
  }

  /* Footer Section */
  .footer {
    text-align: center;
    padding: 10px 0;
    background-color: #282c34;
    color: #fff;
    position: relative;

    p {
      margin: 0;
    }
  }
}
</style>
