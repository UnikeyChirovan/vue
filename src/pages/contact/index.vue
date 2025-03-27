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
              :src="'https://www.google.com/maps/embed?pb=' + companyInfo.address"
              width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useCompanyInfoStore } from '../../stores/useCompanyInfoStore';
import CKEditor from '../../components/CKEditor.vue';
import TheHeader from '../../components/TheHeader.vue';
import TheFooter from '../../components/TheFooter.vue';
import axios from 'axios';
import { useMessage } from 'naive-ui';

const messagenaive = useMessage();
const categoryStore = useCategoryStore();
const companyInfoStore = useCompanyInfoStore();

// Dùng computed để lấy dữ liệu từ store
const contactTitle = computed(() => categoryStore.getCategoryTitle('5', 'contact', 'TRANG LIÊN HỆ QUẢN TRỊ'));
const titleAddress = computed(() => categoryStore.getCategoryTitle('6', 'contact', 'Địa chỉ:'));
const titlePhone = computed(() => categoryStore.getCategoryTitle('7', 'contact', 'Điện thoại:'));
const titleEmail = computed(() => categoryStore.getCategoryTitle('8', 'contact', 'Email:'));
const titleSocialMedia = computed(() => categoryStore.getCategoryTitle('9', 'contact', 'Mạng xã hội'));
const titleMap = computed(() => categoryStore.getCategoryTitle('10', 'contact', 'Bản đồ'));

// Lấy thông tin công ty từ store
const companyInfo = computed(() => companyInfoStore.companyInfo);

// Dữ liệu của form
const username = ref('');
const name = ref('');
const email = ref('');
const message = ref('');
const title = ref('');
const formFields = reactive([
  { id: 'username', label: 'Username:', type: 'text', model: username, placeholder: 'Nhập username nếu có', required: false },
  { id: 'name', label: 'Họ và tên:', type: 'text', model: name, placeholder: '', required: true },
  { id: 'email', label: 'Email:', type: 'email', model: email, placeholder: '', required: true },
  { id: 'problem', label: 'Vấn đề:', type: 'text', model: title, placeholder: '', required: true }
]);

// Hàm gửi form
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
      messagenaive.success(response.data.message);
      defaultForm();
    })
    .catch(error => {
      console.error(error);
    });
};

// Hàm reset form
const defaultForm = () => {
  username.value = '';
  name.value = '';
  email.value = '';
  message.value = '';
  title.value = '';
};
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
  color: #0c713d;
  font-size: 2rem;
}

</style>