<template>
  <form @submit.prevent="updateUsers()">
    <a-card title="Cập nhật Tài khoản" style="width: 100%">
      <div class="row mb-3">
        <div class="col-12 col-sm-3 mb-3">
          <div class="row">
            <div class="col-12 d-flex justify-content-center mb-3">
              <a-avatar shape="square" :size="200">
                <template #icon>
                  <img src="../../../assets/users.jpg" alt="Avatar" />
                </template>
              </a-avatar>
            </div>

            <div class="col-12 d-flex justify-content-center">
              <a-button type="primary">
                <i class="fa-solid fa-plus me-2"></i>
                <span>Chọn Avatar</span>
              </a-button>
            </div>
          </div>
          <div class="row">
            <div class="col-12 d-flex justify-content-center mb-3">
              <a-avatar shape="square" :size="200">
                <template #icon>
                  <img src="../../../assets/users.jpg" alt="Avatar" />
                </template>
              </a-avatar>
            </div>

            <div class="col-12 d-flex justify-content-center">
              <a-button type="primary">
                <i class="fa-solid fa-plus me-2"></i>
                <span>Chọn Hình Nền</span>
              </a-button>
            </div>
          </div>
        </div>
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
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { useMenuProfile } from '../../../stores/use-menu-profile';
import api from '../../../services/axiosInterceptor';
import dayjs from 'dayjs';

const authStore = useAuthStore();
const id = authStore.user?.id;
const router = useRouter();
const route = useRoute();

const users_status = ref([]);
const departments = ref([]);

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
  department_id: [],
  status_id: [],
  login_at: '',
  change_password_at: '',
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
        { label: 'Nam', value: 'nam' },
        { label: 'Nữ', value: 'nữ' },
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
      users.department_id = data.department_id || [];
      users.status_id = data.status_id || [];
      users.login_at = data.login_at ? dayjs(data.login_at).format('DD-MM-YYYY HH:mm:ss') : '';
      users.change_password_at = data.change_password_at
        ? dayjs(data.change_password_at).format('DD-MM-YYYY HH:mm:ss')
        : '';
      users_status.value = response.data.users_status || [];
      departments.value = response.data.departments || [];
    })
    .catch((error) => {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
    });
};

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

const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

onMounted(() => {
  useMenuProfile().onSelectedKey(['profile-edit']);
  getUsersEdit();
});
</script>



<style>
.select-danger {
  border: 1px solid red;
}

.input-danger {
  border-color: red;
}
</style>
