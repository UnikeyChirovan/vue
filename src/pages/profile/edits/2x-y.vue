<template>
  <form @submit.prevent="updateUsers()">
    <a-card title="Cập nhật Tài khoản" style="width: 100%">
      <div class="row mb-3">
        <div class="col-12 col-sm-3 mb-3">
          <!-- Avatar Section -->
          <div class="row mb-4">
            <div class="col-12 d-flex justify-content-center mb-3">
              <div
                class="custom-avatar"
                :style="{ cursor: isEditingAvatar ? 'grab' : 'default' }"
                @mousedown="isEditingAvatar ? startDrag($event, 'avatar') : null"
                @touchstart="isEditingAvatar ? startDrag($event, 'avatar') : null"
              >
                <img
                  :src="avatarUrl || '../../../assets/users.jpg'"
                  alt="Avatar"
                  class="img-avatar"
                  :style="avatarStyle"
                />
              </div>
            </div>
            <div class="col-12 d-flex justify-content-center mb-2">
              <a-button type="primary" @click="toggleAvatarEditing">
                <i class="fa-solid fa-edit me-2"></i>
                <span>{{ isEditingAvatar ? 'Lưu Avatar' : 'Sửa Avatar' }}</span>
              </a-button>
              <a-button type="danger" class="ms-2" @click="deleteAvatar">
                <i class="fa-solid fa-trash me-2"></i>
                <span>Xóa</span>
              </a-button>
            </div>
          </div>

          <!-- Cover Section -->
          <div class="row">
            <div class="col-12 d-flex justify-content-center mb-3">
              <div
                class="custom-cover"
                :style="{ cursor: isEditingCover ? 'grab' : 'default' }"
                @mousedown="isEditingCover ? startDrag($event, 'cover') : null"
                @touchstart="isEditingCover ? startDrag($event, 'cover') : null"
              >
                <img
                  :src="coverUrl || '../../../assets/cover.jpg'"
                  alt="Cover"
                  class="img-cover-custom"
                  :style="coverStyle"
                />
              </div>
            </div>

            <div class="col-12 d-flex justify-content-center">
              <a-button type="primary" @click="toggleCoverEditing">
                <i class="fa-solid fa-edit me-2"></i>
                <span>{{ isEditingCover ? 'Lưu Cover' : 'Sửa Cover' }}</span>
              </a-button>
              <a-button type="danger" class="ms-2" @click="deleteCover">
                <i class="fa-solid fa-trash me-2"></i>
                <span>Xóa</span>
              </a-button>
            </div>
          </div>
        </div>

        <!-- Rest of the form fields remain unchanged -->
        <div class="col-12 col-sm-4 mb-3">
          <div
            v-for="(field, index) in formFields"
            :key="index"
            class="row mb-3"
          >
            <div class="col-12 col-sm-4 text-start text-sm-end">
              <label>
                <span v-if="field.required" class="text-danger me-1">*</span>
                <span :class="{ 'text-danger': errors[field.name] }">{{ field.label }}:</span>
              </label>
            </div>
            <div class="col-12 col-sm-8">
              <component
                :is="field.component"
                v-model:value="users[field.name]"
                v-if="field.component !== 'a-checkbox'"
                v-bind="field.attrs"
                :class="{ 'input-danger': errors[field.name] }"
              ></component>
              <a-checkbox
                v-if="field.component === 'a-checkbox'"
                v-model:checked="users[field.name]"
              >
                {{ field.label }}
              </a-checkbox>
              <div class="w-100"></div>
              <small v-if="errors[field.name]" class="text-danger">{{ errors[field.name][0] }}</small>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-5">
          <div
            v-for="(field, index) in formFields_2"
            :key="index"
            class="row mb-3"
          >
            <div class="col-12 col-sm-4 text-start text-sm-end">
              <label>
                <span v-if="field.required" class="text-danger me-1">*</span>
                <span :class="{ 'text-danger': errors[field.name] }">{{ field.label }}:</span>
              </label>
            </div>
            <div class="col-12 col-sm-8">
              <component
                :is="field.component"
                v-model:value="users[field.name]"
                v-if="field.component !== 'a-checkbox'"
                v-bind="field.attrs"
                :class="{ 'input-danger': errors[field.name] }"
              ></component>
              <a-checkbox
                v-if="field.component === 'a-checkbox'"
                v-model:checked="users[field.name]"
              >
                {{ field.label }}
              </a-checkbox>
              <div class="w-100"></div>
              <small v-if="errors[field.name]" class="text-danger">{{ errors[field.name][0] }}</small>
            </div>
          </div>
          <div class="row mb-3" v-if="users.change_password">
            <div class="col-12 col-sm-4 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-8">
              <a-input-password
                placeholder="Mật khẩu"
                allow-clear
                v-model:value="users.password"
                :class="{ 'input-danger': errors.password }"
              />
              <div class="w-100"></div>
              <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
            </div>
          </div>

          <div class="row mb-3" v-if="users.change_password">
            <div class="col-12 col-sm-4 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Xác nhận mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-8">
              <a-input-password
                placeholder="Xác nhận mật khẩu"
                allow-clear
                v-model:value="users.password_confirmation"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <a-button class="me-0 me-sm-2 mb-3 mb-sm-0">
            <router-link :to="{ name: 'profile-info' }">
              <span>Hủy</span>
            </router-link>
          </a-button>

          <a-button type="primary" html-type="submit">
            <span>Lưu</span>
          </a-button>
        </div>
      </div>
    </a-card>
  </form>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useMenuProfile } from '../../../stores/use-menu-profile';
import { useProfileStore } from '../../../stores/profile';
import api from '../../../services/axiosInterceptor';
import dayjs from 'dayjs';

const authStore = useAuthStore();
const profileStore = useProfileStore();
const id = authStore.user?.id;
const router = useRouter();

const users = reactive({
  username: '',
  name: '',
  nickname: '',
  email: '',
  password: '',
  password_confirmation: '',
  change_password: false,
  gender: '',
  address: '',
  phone_number: '',
  occupation: '',
  biography: '',
  hobbies: '',
  birthday: null,
  login_at: '',
  change_password_at: '',
  avatar_position_x: 0,
  avatar_position_y: 0,
  cover_position_x: 0,
  cover_position_y: 0,
});

const errors = ref({});

const formFields = [
  {
    name: 'username',
    label: 'Tên Tài khoản',
    component: 'a-input',
    required: true,
    attrs: {
      placeholder: 'Tên Tài khoản',
      allowClear: true,
    },
  },
  {
    name: 'name',
    label: 'Họ và Tên',
    component: 'a-input',
    required: true,
    attrs: {
      placeholder: 'Họ và Tên',
      allowClear: true,
    },
  },
  {
    name: 'nickname',
    label: 'Biệt Danh',
    component: 'a-input',
    required: true,
    attrs: {
      placeholder: 'Tên muốn hiển thị',
      allowClear: true,
    },
  },
  {
    name: 'email',
    label: 'Email',
    component: 'a-input',
    required: true,
    attrs: {
      placeholder: 'Email',
      allowClear: true,
    },
  },
  {
    name: 'gender',
    label: 'Giới tính',
    component: 'a-select',
    required: true,
    attrs: {
      options: [
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' },
      ],
      placeholder: 'Chọn giới tính',
      allowClear: true,
    },
  },
  {
    name: 'address',
    label: 'Địa chỉ',
    component: 'a-input',
    attrs: {
      placeholder: 'Địa chỉ',
      allowClear: true,
    },
  },
  {
    name: 'phone_number',
    label: 'Số điện thoại',
    component: 'a-input',
    attrs: {
      placeholder: 'Số điện thoại',
      allowClear: true,
    },
  },
];

const formFields_2 = [
  {
    name: 'occupation',
    label: 'Nghề nghiệp',
    component: 'a-input',
    attrs: {
      placeholder: 'Nghề nghiệp',
      allowClear: true,
    },
  },
  {
    name: 'biography',
    label: 'Bio',
    component: 'a-textarea',
    attrs: {
      placeholder: 'Bio',
      allowClear: true,
      rows: 4,
    },
  },
  {
    name: 'hobbies',
    label: 'Sở thích',
    component: 'a-textarea',
    attrs: {
      placeholder: 'Sở thích',
      allowClear: true,
      rows: 3,
    },
  },
  {
    name: 'birthday',
    label: 'Sinh nhật',
    component: 'a-date-picker',
    attrs: {
      placeholder: 'Chọn ngày sinh',
      style: { width: '100%' },
      format: 'DD-MM-YYYY',
    },
  },
  {
    name: 'change_password',
    label: 'Đổi Mật khẩu',
    component: 'a-checkbox',
  },
];

const avatarUrl = ref(null);
const coverUrl = ref(null);

// Dragging State
const isEditingAvatar = ref(false);
const isEditingCover = ref(false);
const dragging = ref(false);
const dragType = ref(null); // 'avatar' or 'cover'
let startX = 0;
let startY = 0;
let initialPosX = 0;
let initialPosY = 0;

let originalAvatarPos = { x: 0, y: 0 };
let originalCoverPos = { x: 0, y: 0 };

const avatarStyle = ref({
  transform: 'translate(0px, 0px)',
});
const coverStyle = ref({
  transform: 'translate(0px, 0px)',
});

// Toggle Editing Modes
const toggleAvatarEditing = () => {
  if (isEditingAvatar.value) {
    // Save avatar position
    savePosition('avatar');
  } else {
    // Store original position before editing
    originalAvatarPos = {
      x: users.avatar_position_x,
      y: users.avatar_position_y,
    };
  }
  isEditingAvatar.value = !isEditingAvatar.value;
};

const toggleCoverEditing = () => {
  if (isEditingCover.value) {
    // Save cover position
    savePosition('cover');
  } else {
    // Store original position before editing
    originalCoverPos = {
      x: users.cover_position_x,
      y: users.cover_position_y,
    };
  }
  isEditingCover.value = !isEditingCover.value;
};

// Start Dragging
const startDrag = (event, type) => {
  dragging.value = true;
  dragType.value = type;

  if (event.type === 'mousedown') {
    startX = event.clientX;
    startY = event.clientY;
  } else if (event.type === 'touchstart') {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }

  if (type === 'avatar') {
    initialPosX = users.avatar_position_x;
    initialPosY = users.avatar_position_y;
  } else if (type === 'cover') {
    initialPosX = users.cover_position_x;
    initialPosY = users.cover_position_y;
  }

  // Add event listeners for mousemove and mouseup
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchmove', onDrag);
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('keydown', onKeyDown);
};

// Handle Dragging
const onDrag = (event) => {
  if (!dragging.value) return;

  let currentX, currentY;
  if (event.type.startsWith('mouse')) {
    currentX = event.clientX;
    currentY = event.clientY;
  } else if (event.type.startsWith('touch')) {
    currentX = event.touches[0].clientX;
    currentY = event.touches[0].clientY;
  }

  const deltaX = currentX - startX;
  const deltaY = currentY - startY;
  startX = currentX;
  startY = currentY;

  if (dragType.value === 'avatar') {
    users.avatar_position_x += deltaX;
    users.avatar_position_y += deltaY;
    avatarStyle.value.transform = `translate(${users.avatar_position_x}px, ${users.avatar_position_y}px)`;
  } else if (dragType.value === 'cover') {
    users.cover_position_x += deltaX;
    users.cover_position_y += deltaY;
    coverStyle.value.transform = `translate(${users.cover_position_x}px, ${users.cover_position_y}px)`;
  }
};

// Handle ESC Key
const onKeyDown = (event) => {
  if (event.key === 'Escape' && dragging.value) {
    cancelDrag();
  }
};

// Stop Dragging
const stopDrag = () => {
  dragging.value = false;
  dragType.value = null;

  // Remove event listeners
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', stopDrag);
  window.removeEventListener('keydown', onKeyDown);
};

// Cancel Drag and Revert Position
const cancelDrag = () => {
  if (dragType.value === 'avatar') {
    users.avatar_position_x = originalAvatarPos.x;
    users.avatar_position_y = originalAvatarPos.y;
    avatarStyle.value.transform = `translate(${users.avatar_position_x}px, ${users.avatar_position_y}px)`;
  } else if (dragType.value === 'cover') {
    users.cover_position_x = originalCoverPos.x;
    users.cover_position_y = originalCoverPos.y;
    coverStyle.value.transform = `translate(${users.cover_position_x}px, ${users.cover_position_y}px)`;
  }
  stopDrag();
  message.info('Thao tác kéo đã bị hủy và vị trí đã được khôi phục.');
};

// Save Position to Backend (sử dụng API mới)
const savePosition = (type) => {
  const payload = {
    avatar_position_x: users.avatar_position_x,
    avatar_position_y: users.avatar_position_y,
    cover_position_x: users.cover_position_x,
    cover_position_y: users.cover_position_y,
  };

  api
    .put(`/profile/${id}/position`, payload) // Sử dụng API mới
    .then((response) => {
      if (response.status === 200) {
        message.success(`Vị trí ${type === 'avatar' ? 'Avatar' : 'Cover'} đã được lưu!`);
        profileStore.updatePosition(payload);
      }
    })
    .catch((error) => {
      message.error(`Lưu vị trí ${type === 'avatar' ? 'Avatar' : 'Cover'} thất bại!`);
      console.error(`Error saving ${type} position:`, error);
    });
};

// Upload URLs and Headers
const backendUrl = "http://127.0.0.1:8000";

const deleteAvatar = async () => {
  try {
    await api.delete(`/link/${id}/avatar`);
    avatarUrl.value = null;
    users.avatar_position_x = 0;
    users.avatar_position_y = 0;
    avatarStyle.value.transform = 'translate(0px, 0px)';
    message.success('Avatar đã được xóa thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa avatar:', error);
    message.error('Xóa avatar thất bại!');
  }
};

const deleteCover = async () => {
  try {
    await api.delete(`/link/${id}/cover`);
    coverUrl.value = null;
    users.cover_position_x = 0;
    users.cover_position_y = 0;
    coverStyle.value.transform = 'translate(0px, 0px)';
    message.success('Hình nền đã được xóa thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa hình nền:', error);
    message.error('Xóa hình nền thất bại!');
  }
};

// Fetch user data for editing
const getUsersEdit = () => {
  api
    .get(`/profile/${id}/edit`)
    .then((response) => {
      const data = response.data.users;
      users.username = data.username;
      users.name = data.name;
      users.nickname = data.nickname;
      users.email = data.email;
      users.gender = data.gender;
      users.address = data.address;
      users.phone_number = data.phone_number;
      users.occupation = data.occupation;
      users.biography = data.biography;
      users.hobbies = data.hobbies;
      users.birthday = data.birthday ? dayjs(data.birthday) : null;
      users.avatar_position_x = data.avatar_position_x || 0;
      users.avatar_position_y = data.avatar_position_y || 0;
      users.cover_position_x = data.cover_position_x || 0;
      users.cover_position_y = data.cover_position_y || 0;

      // Cập nhật avatarUrl và coverUrl từ dữ liệu API
      if (data.avatar) {
        avatarUrl.value = `${backendUrl}/storage/avatars/${id}/${data.avatar}`;
      }
      if (data.cover) {
        coverUrl.value = `${backendUrl}/storage/covers/${id}/${data.cover}`;
      }

      // Cập nhật styles dựa trên vị trí
      avatarStyle.value.transform = `translate(${users.avatar_position_x}px, ${users.avatar_position_y}px)`;
      coverStyle.value.transform = `translate(${users.cover_position_x}px, ${users.cover_position_y}px)`;
    })
    .catch((error) => {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
    });
};

// Update user data
const updateUsers = () => {
  const payload = { ...users };

  if (payload.birthday) {
    payload.birthday = payload.birthday.format('DD-MM-YYYY');
  }

  if (!payload.change_password) {
    delete payload.password;
    delete payload.password_confirmation;
  }

  api
    .put(`/profile/${id}`, payload)
    .then((response) => {
      if (response.status === 200) {
        message.success('Cập nhật thành công!');
        router.push({ name: 'profile-info' });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        errors.value = error.response.data.errors;
      } else {
        console.error('Lỗi khi cập nhật người dùng:', error);
      }
    });
};

// Filter options for select
const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

onMounted(() => {
  useMenuProfile().onSelectedKey(['profile-edit']);
  getUsersEdit();
});
onBeforeUnmount(() => {
  // Đảm bảo rằng các sự kiện được loại bỏ khi component bị hủy
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', stopDrag);
  window.removeEventListener('keydown', onKeyDown);
});
</script>
<style scoped>
/* Các style hiện tại */

.select-danger {
  border: 1px solid red;
}

.input-danger {
  border-color: red;
}

/* Custom Avatar Styles */
.custom-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #4fb233; /* Màu viền tùy chỉnh */
  position: relative;
  user-select: none;
}

.img-avatar {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
  /* Giữ ảnh nằm trong khung sau khi di chuyển */
}

.custom-cover {
  width: 250px; /* Chiều rộng cố định của khung mini */
  height: calc(250px / 2.78); /* Chiều cao được tính theo tỷ lệ 2.78:1 */
  overflow: hidden;  /* Ẩn phần vượt quá của ảnh */
  position: relative;
  border: 4px solid #4fb233;
  user-select: none;
}

.img-cover-custom {
  width: 100%;
  height: auto; /* Để ảnh tự điều chỉnh theo chiều rộng */
  object-fit: contain; /* Giữ toàn bộ ảnh trong khung */
  position: absolute;
  top: 50%; /* Đặt ảnh ở giữa theo chiều dọc */
  left: 0;
  transform: translateY(-50%); /* Căn giữa ảnh theo chiều dọc */
  transition: transform 0.2s ease;
}

/* Lớp phủ che 25% từ trên xuống và 25% từ dưới lên */
.custom-cover::before,
.custom-cover::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 25%; /* Chiều cao của lớp phủ */
  background-color: rgba(0, 0, 0, 0.3); /* Màu của lớp phủ với độ trong suốt */
  z-index: 1; /* Đảm bảo lớp phủ nằm trên ảnh */
}

.custom-cover::before {
  top: 0; /* Lớp phủ từ trên xuống */
}

.custom-cover::after {
  bottom: 0; /* Lớp phủ từ dưới lên */
}
</style>
