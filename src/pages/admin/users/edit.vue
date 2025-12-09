<template>
  <form @submit.prevent="updateUsers()">
    <a-card title="Cập nhật Tài khoản" style="width: 100%">
      <div class="row mb-3">
        <div class="col-12 col-sm-4 mb-3">
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
                <span>Chọn Hình</span>
              </a-button>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-8">
          <div
            v-for="(field, index) in formFields"
            :key="index"
            class="row mb-3"
          >
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span v-if="field.required" class="text-danger me-1">*</span>
                <span :class="{ 'text-danger': errors[field.name] }"
                  >{{ field.label }}:</span
                >
              </label>
            </div>
            <div class="col-12 col-sm-5">
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
              <small v-if="errors[field.name]" class="text-danger">{{
                errors[field.name][0]
              }}</small>
            </div>
          </div>

          <div class="row mb-3" v-if="users.change_password">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Mật khẩu"
                allow-clear
                v-model:value="users.password"
                :class="{ 'input-danger': errors.password }"
              />
              <div class="w-100"></div>
              <small v-if="errors.password" class="text-danger">{{
                errors.password[0]
              }}</small>
            </div>
          </div>

          <div class="row mb-3" v-if="users.change_password">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Xác nhận mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Xác nhận mật khẩu"
                allow-clear
                v-model:value="users.password_confirmation"
              />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label><span>Lần Đăng nhập gần đây:</span></label>
            </div>
            <div class="col-12 col-sm-5">
              <span>{{ users.login_at }}</span>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label><span>Lần đổi Mật khẩu gần đây:</span></label>
            </div>
            <div class="col-12 col-sm-5">
              <span>{{ users.change_password_at }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <a-button class="me-0 me-sm-2 mb-3 mb-sm-0">
            <router-link :to="{ name: 'admin-users' }">
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { useMenu } from '../../../stores/use-menu';
import dayjs from 'dayjs';
import api from '../../../services/axiosInterceptor';

const router = useRouter();
const route = useRoute();
const users_status = ref([]);
const departments = ref([]);
const users = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  department_id: [],
  status_id: [],
  change_password: false,
  login_at: '',
  change_password_at: '',
});

const errors = ref({});

// Sử dụng computed để đảm bảo formFields luôn nhận được array từ ref
const formFields = computed(() => [
  {
    name: 'status_id',
    label: 'Tình trạng',
    component: 'a-select',
    required: true,
    attrs: {
      showSearch: true,
      placeholder: 'Tình trạng',
      style: { width: '100%' },
      options: users_status.value, // Thêm .value để lấy giá trị thực tế
      filterOption: (input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
      allowClear: true,
    },
  },
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
    name: 'department_id',
    label: 'Phòng ban',
    component: 'a-select',
    required: true,
    attrs: {
      showSearch: true,
      placeholder: 'Phòng ban',
      style: { width: '100%' },
      options: departments.value, // Thêm .value để lấy giá trị thực tế
      filterOption: (input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
      allowClear: true,
    },
  },
  {
    name: 'change_password',
    label: 'Đổi Mật khẩu',
    component: 'a-checkbox',
  },
]);

const getUsersEdit = () => {
  api
    .get(`/users/${route.params.id}/edit`)
    .then((response) => {
      console.log('edit user:', response);
      users.username = response.data.users.username;
      users.name = response.data.users.name;
      users.nickname = response.data.users.nickname;
      users.email = response.data.users.email;
      users.department_id = response.data.users.department_id;
      users.status_id = response.data.users.status_id;

      response.data.users.login_at
        ? (users.login_at = dayjs(response.data.users.login_at).format(
            'DD/MM/YYYY - HH:mm'
          ))
        : (users.login_at = 'Chưa có lượt Đăng nhập');
      response.data.users.change_password_at
        ? (users.change_password_at = dayjs(
            response.data.users.change_password_at
          ).format('DD/MM/YYYY - HH:mm'))
        : (users.change_password_at = 'Chưa có lượt đổi Mật khẩu');

      users_status.value = response.data.users_status;
      departments.value = response.data.departments;
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateUsers = () => {
  api
    .put(`/users/${route.params.id}`, users)
    .then((response) => {
      if (response.status == 200) {
        message.success('Cập nhật thành công!');
        router.push({ name: 'admin-users' });
      }
    })
    .catch((error) => {
      errors.value = error.response.data.errors;
    });
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-users']);
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
