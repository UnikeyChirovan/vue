<template>
  <div class="profile-page">
<div class="cover-section">
  <div class="cover-container" v-show="!showChange&&!showEdit">
    <img 
      :src="coverUrl ? coverUrl : 'https://via.placeholder.com/1200x300'" 
      alt="Cover Image" 
      class="cover-img"
      :style="coverStyle"
    />
  </div>

  <div class="cover-change" v-if="showChange">
    <n-upload
      :headers="uploadHeaders"
      :max-file="1"
      accept="image/*"
      @change="handleUpload"
      class="upload-container"
      :show-file-list="false"
    >
      <n-button type="primary" class="select-image-btn">Chọn hình</n-button>
    </n-upload>

    <div
      class="custom-cover"
      :style="{ cursor: 'grab'}"
      @mousedown="startDrag($event, 'cover')"
      v-if="newCoverUrl"
    >
      <img
        :src="newCoverUrl" class="img-cover-custom"
        alt="Cover"
        :style="coverStyle"
      />
    </div>

    <n-space class="slider-container">
      <n-slider v-model:value="coverPosition" :min="-1000" :max="0" vertical ><template #thumb>
        <n-icon-wrapper :size="24" :border-radius="12">
          <n-icon :size="18" :component="AnimalCat24Regular" />
        </n-icon-wrapper>
      </template></n-slider>
    </n-space>

    <n-button @click="saveNewCover" class="save-button" type="info">Lưu</n-button>
  </div>
  <div class="cover-edit" v-if="showEdit">
    <div class="custom-cover" :style="{ cursor: 'grab'}" @mousedown="startDrag($event, 'cover')" v-if="coverUrl">
      <img :src="coverUrl" class="img-cover-custom" alt="Cover" :style="coverStyle" />
    </div>
    <n-space class="slider-container">
      <n-slider v-model:value="coverPosition" :min="-1000" :max="0" vertical />
    </n-space>
    <n-button @click="saveEditedCover" class="save-button" type="info">Lưu</n-button>
  </div>


  <div class="edit-cover-btn" v-if="authStore.user?.id === users.id">
    <n-dropdown :options="options" @select="handleSelect">
      <n-button strong secondary round type="primary">
        <i class="fa-solid fa-gear"></i>
      </n-button>
    </n-dropdown>
  </div>
</div>

    <div class="avatar-section">
      <n-image
        class="avatar-img"
        alt="User Profile"
        :src="avatarUrl || 'https://via.placeholder.com/150'"
      />
      <button
        v-if="authStore.user?.id === users.id"
        @click="handleCameraClick"
        class="camera-btn"
      >
        <i class="fa-solid fa-camera"></i>
      </button>
    </div>
    <n-modal v-model:show="showViewModal" title="Xem hình cover">
      <n-image :src="coverUrl" class="full-cover-img" />
    </n-modal>  
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
    <div class="about-section card">
      <h2>About Me</h2>
      <p>
        {{ users.biography }}
      </p>
    </div>

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


    <div class="portfolio-section">
      <h2>Portfolio</h2>
      <div class="projects">
        <div class="project">
          <img src="https://via.placeholder.com/400x300" alt="Project Image" />
          <div class="project-info">
            <h3>Project Title 1</h3>
            <p>Short description of the project.</p>
          </div>
        </div>

        <div class="project">
          <img src="https://via.placeholder.com/400x300" alt="Project Image" />
          <div class="project-info">
            <h3>Project Title 2</h3>
            <p>Short description of the project.</p>
          </div>
        </div>
      </div>
    </div>


    <div class="footer">
      <p>&copy; 2024 John Doe. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
  import { useMessage } from 'naive-ui';
  import { useAuthStore } from "../../../stores/auth.js";
  import { useMenuProfile } from "../../../stores/use-menu-profile.js";
  import { useProfileStore } from '../../../stores/profile.js';
  import { useGeneralStore } from '../../../stores/general';
  import api from '../../../services/axiosInterceptor.js';
  import dayjs from 'dayjs';
  import AnimalCat24Regular from '@vicons/fluent/AnimalCat24Regular'

  const authStore = useAuthStore();
  const useGeneral = useGeneralStore()
  const useProfile = useProfileStore();
  const { cover_position } = storeToRefs(useProfile);
  const { isCropperModal, avatarUpdated } = storeToRefs(useGeneral);

  const id = authStore.user?.id;
  const { users, avatarUrl, coverUrl } = storeToRefs(useProfile);
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

const fetchProfile = async () => {
  await useProfile.getProfile(id); 
};

  watch(
  () => avatarUpdated.value,
  (newValue) => {
    if (newValue) {
      // console.log('Avatar updated, updating avatarUrl in profile store...');
      useProfile.updateAvatarUrl(`${useProfile.avatarUrl}`);
      useGeneral.setAvatarUpdated(false); 
    }
  }
);
  onMounted(() => {
    useMenuProfile().onSelectedKey(['profile-info']);
    fetchProfile();
    getLastChapter();
  });
  //
  import { h } from "vue";
import { NIcon } from "naive-ui";
import {
  Pencil, Eye, CloudUpload
} from "@vicons/ionicons5";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const options = [
  {
    label: "Coi Hình",
    key: "viewcover",
    icon: renderIcon(Eye),
  },
  {
    label: "Thay Hình",
    key: "changecover",
    icon: renderIcon(CloudUpload),
  },
  {
    label: "Sửa Hình",
    key: "settingcover",
    icon: renderIcon(Pencil),
  }
];


const uploadHeaders = {
  Authorization: `Bearer ${authStore.accessToken}`,
};

const dragging = ref(false); 
let startY = 0;
let originalCoverPosition = 0;

const coverStyle = computed(() => ({
  transform: `translateY(${cover_position.value}px)`,
}));

const coverPosition = computed({
  get() {
    return cover_position.value;
  },
  set(value) {
    cover_position.value = value;
    coverStyle.value.transform = `translateY(${cover_position.value}px)`;
  },
});
const onKeyDown = (event) => {
  if (event.key === 'Escape' && dragging.value) {
    cancelDrag();
  }
};

const startDrag = (event) => {
  dragging.value = true;
  startY = event.clientY;
  // originalCoverPosition = useProfile.users.cover_position;
  originalCoverPosition = cover_position.value;
  // console.log('Drag started. Original cover position:', originalCoverPosition);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('keydown', onKeyDown);
};

const onDrag = (event) => {
  if (!dragging.value) return;
  const currentY = event.clientY;
  const deltaY = currentY - startY;
  startY = currentY;

  cover_position.value += deltaY;
  coverStyle.value.transform = `translateY(${cover_position.value}px)`;
      // console.log('Dragging... Current cover position:', useProfile.users.cover_position);
    // console.log('Cover style transform:', cover_position.value);
};

const stopDrag = () => {
  dragging.value = false;
      // console.log('Drag stopped. Final cover position:', useProfile.users.cover_position);

  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('keydown', onKeyDown);
};

const cancelDrag = () => {
  users.cover_position = originalCoverPosition;
  coverStyle.value.transform = `translateY(${users.cover_position}px)`;
      // console.log('Drag cancelled. Restoring cover position:', originalCoverPosition);

  stopDrag();
  message.info('Thao tác kéo đã bị hủy và vị trí đã được khôi phục.');
};
const newCoverFile = ref(null); 

const handleUpload = ({ file }) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    newCoverUrl.value = event.target.result;
            // console.log('New cover URL set:', newCoverUrl.value);
  };
  newCoverFile.value = file.file; 
  reader.readAsDataURL(file.file);
};

const saveNewCover = () => {
  if (!newCoverFile.value) {
    message.error('Vui lòng chọn một tệp hình ảnh!');
    return;
  }

  const formData = new FormData();
  formData.append('file', newCoverFile.value); 
  formData.append('position', cover_position.value); 

  api.post(`link/upload/cover`, formData, {
    headers: {
      ...uploadHeaders,
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => {
    // console.log('res', response)
    if (response.status === 200) {
      useProfile.updateCoverPosition(response.data.positionY);
      useProfile.updateCoverUrl(response.data.url);
      showChange.value = false;
      message.success('Cover đã được lưu thành công!');
    }
  }).catch(error => {
    // console.error('Error saving new cover:', error);
    message.error('Lưu hình cover thất bại!');
  });
};


const showViewModal = ref(false);
const showChange = ref(false);
const showEdit = ref(false);
const newCoverUrl = ref(null);

const handleSelect = (key) => {
  switch (key) {
    case 'viewcover':
      showViewModal.value = true;
      break;
    case 'changecover':
      showChange.value = true;
      showEdit.value = false;
      break;
    case 'settingcover':
      showEdit.value = true;
      showChange.value = false; 
      break;
    default:
      break;
  }
};



const saveEditedCover = () => {
  const payload = {
    position: cover_position.value, 
  };
  api.patch(`link/update/cover-position`, payload, {
    headers: uploadHeaders,
  })
  .then(response => {
    console.log(response)
    if (response.status === 200) {
      useProfile.updateCoverPosition(response.data.positionY);
      showEdit.value = false; 
      message.success('Vị trí cover đã được lưu thành công!');
    }
  })
  .catch(error => {
    console.error('Error saving cover position:', error);
    message.error('Lưu vị trí cover thất bại!');
  });
};

const getLastChapter = () => {
  api.get(`/story/user-chapter/${id}`)
    .then(() => {
      console.log('Fetch successful');
    })
    .catch(error => {
      console.error('Error fetching the chapter:', error);
    });
};


onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('keydown', onKeyDown);
});


</script>

<style lang="scss" scoped>
.profile-page {
  font-family: "Arial", sans-serif;
  color: #333;
  background-color: #f7f7f7;

  /* Cover Section */
  .cover-section {
    position: relative;
    height: 300px;
    background-color: #282c34;

    .cover-container,
    .cover-change,
    .cover-edit {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;

      .cover-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        object-fit: cover;
      }
    }

    .edit-cover-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
  }
  .avatar-section {
    position: relative;
    margin-top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 9;

    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
    }

    .camera-btn {
      position: absolute;
      right: 0;
      top: 150px;
      background-color: #e2e8f0;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #cbd5e1;
      }
    }
  }

  .user-info {
    text-align: center;
    padding: 10px 20px 20px;

    .username {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0;
    }

    .occupation,
    .location,
    .birthday,
    .gender {
      margin: 5px 0;
      font-size: 1.2rem;
      color: #777;

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
        cursor: pointer;
        transition: color 0.3s;

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

        &:nth-child(2) {
          height: 40px;
        }

        &:last-child {
          height: 60px;
        }
      }
    }
  }

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


  .footer {
    text-align: center;
    padding: 10px 0;
    background-color: #282c34;
    color: #fff;

    p {
      margin: 0;
    }
  }
}


.custom-cover {
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  &.grabbing {
    cursor: grabbing;
  }

  .img-cover-custom {
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.2s ease;
  }
}


.upload-container {
  position: absolute;
  top: 10px;
  right: -10px;
}

.select-image-btn,
.save-button {
  z-index: 10;
}

.save-button {
  position: absolute;
  bottom: 10px;
  right: 50px;
  width: 20%;
  max-width: 30%;
}


.slider-container {
  position: absolute;
  right: 20px;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
}
</style>

