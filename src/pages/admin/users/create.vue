<template>
  <form @submit.prevent="createUsers()">
    <a-card title="Tạo mới Tài khoản" style="width: 100%">
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
              <a-button type="primary" danger>
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
                <span :class="{ 'text-danger': errors[field.model] }">
                  {{ field.label }}:
                </span>
              </label>
            </div>

            <div class="col-12 col-sm-5">
              <component
                :is="field.component"
                v-model:value="users[field.model]"
                :placeholder="field.placeholder"
                :options="field.options || null"
                :allow-clear="field.allowClear || null"
                :class="{
                  'select-danger':
                    errors[field.model] && field.component === 'a-select',
                  'input-danger':
                    errors[field.model] && field.component !== 'a-select',
                }"
                :style="field.style"
              ></component>

              <small v-if="errors[field.model]" class="text-danger">
                {{ errors[field.model][0] }}
              </small>
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
import { onMounted, ref, reactive } from 'vue';
import { useMenu } from '../../../store/use-menu';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
const users_status = ref([]);
const departments = ref([]);
const errors = ref({});
const router = useRouter();
const users = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  department_id: null,
  status_id: null,
});
const formFields = ref([
  {
    label: 'Tình trạng',
    model: 'status_id',
    component: 'a-select',
    placeholder: 'Tình trạng',
    options: users_status,
    allowClear: true,
    required: true,
  },
  {
    label: 'Tên Tài khoản',
    model: 'username',
    component: 'a-input',
    placeholder: 'Tên Tài khoản',
    allowClear: true,
    required: true,
  },
  {
    label: 'Họ và Tên',
    model: 'name',
    component: 'a-input',
    placeholder: 'Họ và Tên',
    allowClear: true,
    required: true,
  },
  {
    label: 'Biệt Danh',
    model: 'nickname',
    component: 'a-input',
    placeholder: 'Tên muốn thể hiện',
    allowClear: true,
    required: true,
  },
  {
    label: 'Email',
    model: 'email',
    component: 'a-input',
    placeholder: 'Email',
    allowClear: true,
    required: true,
  },
  {
    label: 'Phòng ban',
    model: 'department_id',
    component: 'a-select',
    placeholder: 'Phòng Ban',
    options: departments,
    allowClear: true,
    required: true,
    customRender: true, // Nếu bạn muốn render thêm nút bên cạnh
    style: { display: 'flex' },
  },
  {
    label: 'Mật khẩu',
    model: 'password',
    component: 'a-input-password',
    placeholder: 'Mật khẩu',
    allowClear: true,
    required: true,
  },
  {
    label: 'Xác nhận mật khẩu',
    model: 'password_confirmation',
    component: 'a-input-password',
    placeholder: 'Xác nhận mật khẩu',
    allowClear: true,
    required: true,
  },
]);
const getUsersCreate = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/users/create');
    users_status.value = response.data.users_status;
    departments.value = response.data.departments;
  } catch (error) {
    console.error(error);
  }
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const createUsers = () => {
  axios
    .post('http://127.0.0.1:8000/api/users', users)
    .then((res) => {
      if (res.status == 200) {
        message.success('Tạo tài khoản thành công!');
        router.push({ name: 'admin-users' });
      }
    })
    .catch((err) => {
      errors.value = err.response.data.errors;
    });
};

onMounted(() => {
  useMenu().onSelectedKey(['admin-users']);
  getUsersCreate();
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
