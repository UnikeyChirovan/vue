<template>
  <TheHeader />
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8">
        <h2 class="title">{{ contactTitle }}</h2>
        <form @submit.prevent="submitForm" class="mt-4" style="position: relative;">
            <div class="row">
              <div class="col-12">
                <div v-for="(field, index) in formFields" :key="index" class="row mb-3">
                  <div class="col-sm-2 text-start text-sm-end">
                    <label :for="field.id" class="form-label">
                      <span v-if="field.required" class="text-danger me-1">*</span>
                      <span>{{ field.label }}</span>
                    </label>
                  </div>
                  <div class="col-sm-10">
                    <input
                      :type="field.type"
                      :id="field.id"
                      v-model="field.model"
                      :class="['form-control', field.required && !field.model ? 'is-invalid' : '']"
                      :placeholder="field.placeholder"
                      :required="field.required"
                    >
                  </div>
                </div>
                <div class="ckeditor">
                  <CKEditor v-model="message" />
                </div>           
              </div>
            </div>
            <div class="button-submit">
              <button type="submit" class="btn btn-primary">Gởi</button>
            </div>
          </form>
      </div>
        <div class="col-md-4">
          <h2 class="title mb-3">{{ companyInfo.webname }}</h2>
          <div class="contact-info mt-4">
            <p><strong>{{ titleAddress }}</strong> {{ companyInfo.address }}</p>
            <p><strong>{{ titlePhone }}</strong> {{ companyInfo.phone }}</p>
            <p><strong>{{ titleEmail }}</strong> {{ companyInfo.email }} </p>
            <p><strong>{{ titleSocialMedia }}</strong></p>
            <ul class="list-unstyled d-flex">
              <li class="me-3" v-if="companyInfo.facebook">
                <a :href="companyInfo.facebook" target="_blank"><i class="fab fa-facebook"></i> Facebook</a>
              </li>
              <li class="me-3" v-if="companyInfo.twitter">
                <a :href="companyInfo.twitter" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
              </li>
              <li class="me-3" v-if="companyInfo.linkedin">
                <a :href="companyInfo.linkedin" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
              </li>
            </ul>
            <div class="mt-4">
              <h4>{{ titleMap }}</h4>
              <iframe
                :src="'https://www.google.com/maps/embed?pb=' + webInfo.address"
                width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
        </div>

    </div>
  </div>
  <TheFooter/>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import CKEditor from '../../components/CKEditor.vue';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import apiLinks from '../../services/api-links';
const categories = ref([]);
const isCategoriesReady = ref(false); 
import axios from 'axios';
import { useMessage } from 'naive-ui';
const messagenaive = useMessage();

const username = ref('');
const name = ref('');
const email = ref('');
const message = ref('');
const title = ref('');
const webInfo = ref({});
const formFields = reactive([
  {
    id: 'username',
    label: 'Username:',
    type: 'text',
    model: username,
    placeholder: 'Nhập username nếu có',
    required: false
  },
  {
    id: 'name',
    label: 'Họ và tên:',
    type: 'text',
    model: name,
    placeholder: '',
    required: true
  },
  {
    id: 'email',
    label: 'Email:',
    type: 'email',
    model: email,
    placeholder: '',
    required: true
  },
  {
    id: 'problem',
    label: 'Vấn đề:',
    type: 'text',
    model: title,
    placeholder: '',
    required: true
  }
]);

const defaultForm = () => {
  username.value = '';
  name.value = '';
  email.value = '';
  message.value = '';
  title.value = '';
};

  const submitForm = () => {
  const formData = {
    username: username.value,
    name: name.value,
    email: email.value,
    message: message.value,
    title: title.value,
  };

  axios.post('http://127.0.0.1:8000/api/noauth/contact', formData)
    .then(response => {
      // console.log(response)
      messagenaive.success(response.data.message)
      defaultForm();
    })
    .catch(error => {
      console.error(error);
    });
};
async function fetchCategories() {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    categories.value = JSON.parse(storedCategories);
    isCategoriesReady.value = true;
  } else {
    try {
      const response = await fetch(apiLinks.categories.getAll);
      const data = await response.json();
      localStorage.setItem('categories', JSON.stringify(data));
      categories.value = data;
      isCategoriesReady.value = true;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
}
const contactTitle = computed(() => isCategoriesReady.value? categories.value.find(category => category.code === '5' && category.page === 'contact')?.name : 'TRANG LIÊN HỆ QUẢN TRỊ');
const titleAddress = computed(() => isCategoriesReady.value ? categories.value.find(category => category.code === '6' && category.page === 'contact')?.name : 'Địa chỉ:');
const titlePhone = computed(() => isCategoriesReady.value ? categories.value.find(category => category.code === '7' && category.page === 'contact')?.name : 'Điện thoại:');
const titleEmail = computed(() => isCategoriesReady.value ? categories.value.find(category => category.code === '8' && category.page === 'contact')?.name : 'Email:');
const titleSocialMedia = computed(() => isCategoriesReady.value ? categories.value.find(category => category.code === '9' && category.page === 'contact')?.name : 'Mạng xã hội');
const titleMap = computed(() => isCategoriesReady.value ? categories.value.find(category => category.code === '10' && category.page === 'contact')?.name : 'Bản đồ');
// const titleWebname = computed(() => isCategoriesReady.value ? categories.value.find(category => category.code === '11' && category.page === 'contact')?.name : 'SELORSON TALES ENTERTAIMENT');

const companyInfo = ref({
  webname: 'SELORSON TALES ENTERTAINMENT',
  address: '123 ABC QUẬN 1',
  phone: '0123456789',
  email: 'abc@gmail.com',
  facebook: '#',
  twitter: '#',
  linkedin: '#',
});

async function checkCompanyInfos() {
  let companyInfos = JSON.parse(localStorage.getItem('companyInfos'));
  
  for (let i = 0; i < 20; i++) {
    if (companyInfos) {
      return companyInfos[0]; 
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    companyInfos = JSON.parse(localStorage.getItem('companyInfos'));
  }

  try {
    const response = await apiLinks.companyInfo.getAll();
    companyInfos = response.data;
    localStorage.setItem('companyInfos', JSON.stringify(companyInfos)); 
    return companyInfos[0]; 
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu companyInfos từ API:', error);
    return null;
  }
}

async function initCompanyInfos() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const info = await checkCompanyInfos();

  if (info) {
    companyInfo.value = {
      webname: info.webname || 'Tiêu đề mặc định',
      address: info.address || 'Địa chỉ mặc định',
      phone: info.phone || 'Số điện thoại mặc định',
      email: info.email || 'Email mặc định',
      facebook: info.facebook || '#',
      twitter: info.twitter || '#',
      linkedin: info.linkedin || '#'
    };
  }
}
  onMounted(() => {
    fetchCategories();
    initCompanyInfos();
  });
</script>
<style scoped>
input {
  min-width: 40%;
  border: none;
  border-bottom: 2px solid #000; 
}

.button-submit {
  position: absolute;
  bottom: 10px; 
  right: 30px;   
}
.title {
  text-align: center;
  color: red;
  font-size: 2rem;
}

</style>