<template>
  <form @submit.prevent="updateUsers()">
    <div class="edit-card">
      <div class="card-header-custom">
        <h2>Cập nhật Tài khoản</h2>
      </div>

      <div class="card-body-custom">
        <div class="form-layout">
          <!-- Avatar & Cover Section -->
          <div class="media-section">
            <!-- Avatar -->
            <div class="media-column">
              <div class="media-box">
                <div class="media-preview avatar-preview">
                  <img
                    :src="avatarUrl || '../../../assets/users.jpg'"
                    alt="Avatar"
                    class="media-img"
                  />
                </div>
              </div>
              <button
                type="button"
                @click="deleteAvatar"
                class="delete-btn equal-btn"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa Avatar</span>
              </button>
            </div>

            <!-- Cover -->
            <div class="media-column">
              <div class="media-box">
                <div class="media-preview cover-preview">
                  <img
                    :src="coverUrl || '../../../assets/cover.jpg'"
                    alt="Cover"
                    class="media-img cover-img"
                    :style="{ transform: `translateY(${coverStyle}px)` }"
                  />
                </div>
              </div>
              <button
                type="button"
                @click="deleteCover"
                class="delete-btn equal-btn"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa Cover</span>
              </button>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="form-columns">
            <!-- Column 1 -->
            <div class="form-column">
              <div
                v-for="(field, index) in formFields"
                :key="index"
                class="form-group"
              >
                <label class="form-label">
                  <span v-if="field.required" class="required">*</span>
                  <span :class="{ 'text-error': errors[field.name] }">
                    {{ field.label }}:
                  </span>
                </label>
                <div class="form-control-wrapper">
                  <!-- Text Input -->
                  <input
                    v-if="field.type === 'text'"
                    type="text"
                    v-model="users[field.name]"
                    :placeholder="field.placeholder"
                    :class="[
                      'form-control',
                      { 'input-error': errors[field.name] },
                    ]"
                  />

                  <!-- Textarea -->
                  <textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="users[field.name]"
                    :placeholder="field.placeholder"
                    :rows="field.rows || 3"
                    :class="[
                      'form-control',
                      { 'input-error': errors[field.name] },
                    ]"
                  ></textarea>

                  <!-- Select -->
                  <select
                    v-else-if="field.type === 'select'"
                    v-model="users[field.name]"
                    :class="[
                      'form-control',
                      { 'input-error': errors[field.name] },
                    ]"
                  >
                    <option value="">{{ field.placeholder }}</option>
                    <option
                      v-for="option in field.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>

                  <!-- Date Picker -->
                  <input
                    v-else-if="field.type === 'date'"
                    type="date"
                    v-model="users[field.name]"
                    :class="[
                      'form-control',
                      { 'input-error': errors[field.name] },
                    ]"
                  />

                  <small v-if="errors[field.name]" class="error-text">
                    {{ errors[field.name][0] }}
                  </small>
                </div>
              </div>
            </div>

            <!-- Column 2 -->
            <div class="form-column">
              <div
                v-for="(field, index) in formFields_2"
                :key="index"
                class="form-group"
              >
                <label class="form-label">
                  <span v-if="field.required" class="required">*</span>
                  <span :class="{ 'text-error': errors[field.name] }">
                    {{ field.label }}:
                  </span>
                </label>
                <div class="form-control-wrapper">
                  <!-- Checkbox -->
                  <label
                    v-if="field.type === 'checkbox'"
                    class="checkbox-label"
                  >
                    <input
                      type="checkbox"
                      v-model="users[field.name]"
                      class="checkbox-input"
                    />
                    <span class="checkbox-text">{{ field.label }}</span>
                  </label>

                  <!-- Text Input -->
                  <input
                    v-else-if="field.type === 'text'"
                    type="text"
                    v-model="users[field.name]"
                    :placeholder="field.placeholder"
                    :class="[
                      'form-control',
                      { 'input-error': errors[field.name] },
                    ]"
                  />

                  <!-- Textarea -->
                  <textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="users[field.name]"
                    :placeholder="field.placeholder"
                    :rows="field.rows || 3"
                    :class="[
                      'form-control',
                      { 'input-error': errors[field.name] },
                    ]"
                  ></textarea>

                  <!-- Date Input -->
                  <input
                    v-else-if="field.type === 'date'"
                    type="date"
                    v-model="users[field.name]"
                    :class="[
                      'form-control',
                      { 'input-error': errors[field.name] },
                    ]"
                  />

                  <small v-if="errors[field.name]" class="error-text">
                    {{ errors[field.name][0] }}
                  </small>
                </div>
              </div>

              <!-- Password Fields (Conditional) -->
              <div v-if="users.change_password" class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  <span>Mật khẩu:</span>
                </label>
                <div class="form-control-wrapper">
                  <div class="password-wrapper">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="users.password"
                      placeholder="Nhập mật khẩu mới"
                      :class="[
                        'form-control',
                        { 'input-error': errors.password },
                      ]"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="password-toggle"
                    >
                      <i
                        :class="
                          showPassword
                            ? 'fa-solid fa-eye-slash'
                            : 'fa-solid fa-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <small v-if="errors.password" class="error-text">
                    {{ errors.password[0] }}
                  </small>
                </div>
              </div>

              <div v-if="users.change_password" class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  <span>Xác nhận mật khẩu:</span>
                </label>
                <div class="form-control-wrapper">
                  <div class="password-wrapper">
                    <input
                      :type="showPasswordConfirm ? 'text' : 'password'"
                      v-model="users.password_confirmation"
                      placeholder="Nhập lại mật khẩu"
                      class="form-control"
                    />
                    <button
                      type="button"
                      @click="showPasswordConfirm = !showPasswordConfirm"
                      class="password-toggle"
                    >
                      <i
                        :class="
                          showPasswordConfirm
                            ? 'fa-solid fa-eye-slash'
                            : 'fa-solid fa-eye'
                        "
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <router-link :to="{ name: 'profile-info' }" class="btn-cancel">
            <span>Hủy</span>
          </router-link>
          <button type="submit" class="btn-save">
            <span>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from '../../../stores/useToast';
import { useMenuProfile } from '../../../stores/use-menu-profile';
import { useProfileStore } from '../../../stores/profile';
import api from '../../../services/axiosInterceptor';
import dayjs from 'dayjs';

const toast = useToast();
const authStore = useAuthStore();
const useProfile = useProfileStore();
const router = useRouter();

const id = authStore.user?.id;
let coverStyle = useProfile.cover_position * 0.2213;

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

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
  birthday: '',
});

const errors = ref({});
const avatarUrl = ref(null);
const coverUrl = ref(null);
const backendUrl = 'http://127.0.0.1:8000';

const formFields = [
  {
    name: 'username',
    label: 'Tên Tài khoản',
    type: 'text',
    required: true,
    placeholder: 'Tên Tài khoản',
  },
  {
    name: 'name',
    label: 'Họ và Tên',
    type: 'text',
    required: true,
    placeholder: 'Họ và Tên',
  },
  {
    name: 'nickname',
    label: 'Biệt Danh',
    type: 'text',
    required: true,
    placeholder: 'Tên muốn hiển thị',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    required: true,
    placeholder: 'Email',
  },
  {
    name: 'gender',
    label: 'Giới tính',
    type: 'select',
    options: [
      { label: 'Nam', value: 'Nam' },
      { label: 'Nữ', value: 'Nữ' },
    ],
    placeholder: 'Chọn giới tính',
  },
  {
    name: 'address',
    label: 'Địa chỉ',
    type: 'text',
    placeholder: 'Địa chỉ',
  },
  {
    name: 'phone_number',
    label: 'Số điện thoại',
    type: 'text',
    placeholder: 'Số điện thoại',
  },
];

const formFields_2 = [
  {
    name: 'occupation',
    label: 'Nghề nghiệp',
    type: 'text',
    placeholder: 'Nghề nghiệp',
  },
  {
    name: 'biography',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Bio',
    rows: 4,
  },
  {
    name: 'hobbies',
    label: 'Sở thích',
    type: 'textarea',
    placeholder: 'Sở thích',
    rows: 3,
  },
  {
    name: 'birthday',
    label: 'Sinh nhật',
    type: 'date',
  },
  {
    name: 'change_password',
    label: 'Đổi Mật khẩu',
    type: 'checkbox',
  },
];

const deleteAvatar = async () => {
  try {
    await api.delete(`/link/${id}/avatar`);
    avatarUrl.value = null;
    toast.success('Avatar đã được xóa thành công!');
  } catch (error) {
    toast.error('Xóa avatar thất bại!');
  }
};

const deleteCover = async () => {
  try {
    await api.delete(`/link/${id}/cover`);
    coverUrl.value = null;
    toast.success('Hình nền đã được xóa thành công!');
  } catch (error) {
    toast.error('Xóa hình nền thất bại!');
  }
};

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
      users.birthday = data.birthday
        ? dayjs(data.birthday).format('YYYY-MM-DD')
        : '';
      if (data.avatar) {
        avatarUrl.value = `${backendUrl}/storage/avatars/${id}/${data.avatar}`;
      }
      if (data.cover) {
        coverUrl.value = `${backendUrl}/storage/covers/${id}/${data.cover}`;
      }
    })
    .catch((error) => {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
    });
};

const updateUsers = () => {
  const payload = { ...users };

  if (payload.birthday) {
    payload.birthday = dayjs(payload.birthday).format('DD-MM-YYYY');
  }

  if (!payload.change_password) {
    delete payload.password;
    delete payload.password_confirmation;
  }

  api
    .put(`/profile/${id}`, payload)
    .then((response) => {
      if (response.status === 200) {
        toast.success('Cập nhật thành công!');
        useProfile.updateUser(payload);
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

onMounted(() => {
  useMenuProfile().onSelectedKey(['profile-edit']);
  getUsersEdit();
});
</script>
<style scoped>
/* ========== EDIT CARD ========== */
.edit-card {
  width: 100%;
  max-width: 1200px;
  margin: 80px auto 60px;
  padding: 0;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

html.dark-mode .edit-card {
  background: #1e1e1e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.card-header-custom {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  padding: 24px 32px;
  border-bottom: 4px solid #0a5a31;
}

html.dark-mode .card-header-custom {
  background: linear-gradient(135deg, #0f8a4a 0%, #0c713d 100%);
  border-bottom-color: #0c713d;
}

.card-header-custom h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.card-body-custom {
  padding: 40px 32px;
}

/* ========== FORM LAYOUT ========== */
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ========== MEDIA SECTION ========== */
.media-section {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 24px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 16px;
  border: 2px solid #0c713d;
}

html.dark-mode .media-section {
  background: linear-gradient(135deg, #1a2e1a 0%, #0f1f0f 100%);
  border-color: #0f8a4a;
}

.media-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.media-preview {
  overflow: hidden;
  border: 4px solid #0c713d;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.2);
}

html.dark-mode .media-preview {
  border-color: #0f8a4a;
  box-shadow: 0 4px 12px rgba(15, 138, 74, 0.3);
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.cover-preview {
  width: 250px;
  height: calc(250px / 2.1);
  position: relative;
}

.cover-preview::before,
.cover-preview::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 25%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.cover-preview::before {
  top: 0;
}

.cover-preview::after {
  bottom: 0;
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-img {
  position: absolute;
  top: 25%;
  left: 0;
}

.delete-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
}

.delete-btn:active {
  transform: translateY(0);
}

/* ========== FORM COLUMNS ========== */
.form-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ========== FORM GROUP ========== */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
}

html.dark-mode .form-label {
  color: #e0e0e0;
}

.required {
  color: #dc2626;
  font-weight: 700;
}

.text-error {
  color: #dc2626;
}

.form-control-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  font-size: 0.95rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #333;
  transition: all 0.3s ease;
  font-family: inherit;
}

html.dark-mode .form-control {
  border-color: #333;
  color: #e0e0e0;
}

.form-control:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

html.dark-mode .form-control:focus {
  border-color: #0f8a4a;
  box-shadow: 0 0 0 3px rgba(15, 138, 74, 0.2);
}

.form-control::placeholder {
  color: #9ca3af;
}

html.dark-mode .form-control::placeholder {
  color: #6b7280;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

select.form-control {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

html.dark-mode select.form-control {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e0e0e0' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
}

.input-error {
  border-color: #dc2626 !important;
}

.error-text {
  font-size: 0.85rem;
  color: #dc2626;
  margin: 0;
}

/* ========== CHECKBOX ========== */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #0c713d;
}

html.dark-mode .checkbox-input {
  accent-color: #0f8a4a;
}

.checkbox-text {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

html.dark-mode .checkbox-text {
  color: #e0e0e0;
}

/* ========== PASSWORD WRAPPER ========== */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper .form-control {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #0c713d;
}

html.dark-mode .password-toggle {
  color: #9ca3af;
}

html.dark-mode .password-toggle:hover {
  color: #0f8a4a;
}

/* ========== FORM ACTIONS ========== */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

html.dark-mode .form-actions {
  border-top-color: #333;
}

.btn-cancel,
.btn-save {
  padding: 14px 32px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-cancel::before,
.btn-save::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.btn-cancel:hover::before,
.btn-save:hover::before {
  width: 300px;
  height: 300px;
}

.btn-cancel {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.btn-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

.btn-save {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

html.dark-mode .btn-save {
  background: linear-gradient(135deg, #0f8a4a 0%, #0c713d 100%);
  box-shadow: 0 4px 12px rgba(15, 138, 74, 0.3);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.4);
}

html.dark-mode .btn-save:hover {
  box-shadow: 0 6px 20px rgba(15, 138, 74, 0.4);
}

.btn-cancel:active,
.btn-save:active {
  transform: translateY(0);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large Tablet */
@media (max-width: 1024px) {
  .edit-card {
    margin: 70px 20px 50px;
  }

  .card-header-custom {
    padding: 20px 28px;
  }

  .card-header-custom h2 {
    font-size: 1.6rem;
  }

  .card-body-custom {
    padding: 32px 28px;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .edit-card {
    margin: 60px 15px 40px;
    border-radius: 16px;
  }

  .card-header-custom {
    padding: 18px 24px;
  }

  .card-header-custom h2 {
    font-size: 1.4rem;
  }

  .card-body-custom {
    padding: 28px 24px;
  }

  .form-columns {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .media-section {
    flex-direction: column;
    padding: 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .edit-card {
    margin: 50px 10px 30px;
    border-radius: 14px;
  }

  .card-header-custom {
    padding: 16px 20px;
  }

  .card-header-custom h2 {
    font-size: 1.2rem;
  }

  .card-body-custom {
    padding: 24px 20px;
  }

  .form-layout {
    gap: 32px;
  }

  .media-section {
    padding: 16px;
    gap: 20px;
  }

  .avatar-preview {
    width: 120px;
    height: 120px;
  }

  .cover-preview {
    width: 200px;
    height: calc(200px / 2.1);
  }

  .delete-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .form-column {
    gap: 20px;
  }

  .form-group {
    gap: 6px;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-control {
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  .btn-cancel,
  .btn-save {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .edit-card {
    margin: 40px 8px 20px;
  }

  .card-header-custom h2 {
    font-size: 1.1rem;
  }

  .avatar-preview {
    width: 100px;
    height: 100px;
  }

  .cover-preview {
    width: 180px;
    height: calc(180px / 2.1);
  }

  .form-control {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}
.media-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  justify-items: center;
}

.media-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.media-box {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.cover-preview {
  width: 280px;
  height: 150px;
  position: relative;
}

.equal-btn {
  min-width: 150px;
  justify-content: center;
}
</style>
