<template>
  <TheHeader />
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8">
        <h1 class='text-center' style="color: red;">TRANG LIÊN HỆ QUẢN TRỊ</h1>
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
              <button type="submit" class="btn btn-primary">Gửi</button>
            </div>
          </form>
      </div>
        <div class="col-md-4">
          <h1 class="text-center mb-3" style="color: red;">{{ webInfo.webname }}</h1>
          <div class="contact-info mt-4">
            <p><strong>Địa chỉ:</strong> {{ webInfo.address }}</p>
            <p><strong>Điện thoại:</strong> {{ webInfo.phone }}</p>
            <p><strong>Email:</strong> {{ webInfo.email }} </p>
            <p><strong>Mạng xã hội:</strong></p>
            <ul class="list-unstyled d-flex">
              <li class="me-3" v-if="webInfo.facebook">
                <a :href="webInfo.facebook" target="_blank"><i class="fab fa-facebook"></i> Facebook</a>
              </li>
              <li class="me-3" v-if="webInfo.twitter">
                <a :href="webInfo.twitter" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
              </li>
              <li class="me-3" v-if="webInfo.linkedin">
                <a :href="webInfo.linkedin" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
              </li>
            </ul>
            <div class="mt-4">
              <h4>Bản đồ</h4>
              <iframe
                :src="'https://www.google.com/maps/embed?pb=' + webInfo.address"
                width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import CKEditor from '../../components/CKEditor.vue';
import TheHeader from '../../components/TheHeader.vue';
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
      console.log(response)
      messagenaive.success(response.data.message)
      defaultForm();
    })
    .catch(error => {
      console.error(error);
    });
};


const getInfo = () => {
  axios.get('http://127.0.0.1:8000/api/noauth/contact')
  .then((response)=>{
    console.log(response)
    webInfo.value = response.data
  })
  .catch((err)=>{
    console.log(err)
  })
}
  onMounted(() => {
    getInfo();
  });
</script>
<style scoped>
/* .is-invalid {
  border-color: red;
} */
input {
  min-width: 40%;
  /* border-radius: 5px; */
  border: none;
  /* border-right: 2px solid #000;  */
  border-bottom: 2px solid #000; 
}

.button-submit {
  position: absolute;
  bottom: 10px; 
  right: 30px;   
}

</style>