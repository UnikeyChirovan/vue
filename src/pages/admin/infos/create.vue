<template>
  <n-card title="Tạo Thông Báo">
    <n-form
      ref="formRef"
      :label-width="80"
      :model="formValue"
      @submit.prevent="submitForm"
    >
      <n-form-item label="Tiêu đề">
        <n-input v-model:value="formValue.title" placeholder="Nhập tiêu đề" />
      </n-form-item>

      <n-form-item label="Nội dung">
        <n-input v-model:value="formValue.content" placeholder="Nhập nội dung" type="textarea" />
      </n-form-item>

      <n-button type="primary" @click="submitForm">Gởi thông báo</n-button>
    </n-form>
  </n-card>

  <pre>{{ JSON.stringify(formValue, null, 2) }}</pre>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const formRef = ref(null);
const message = useMessage();

const formValue = ref({
  title: '',
  content: ''
});

const submitForm = async () => {
  if (!formValue.value.title || !formValue.value.content) {
    message.warning("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
    return;
  }

  try {
    const response = await api.post('/newsletter/notifications/create', formValue.value);
    message.success(response.data.success);
    formValue.value.title = '';
    formValue.value.content = '';
  } catch (error) {
    console.error(error);
    if (error.response) {
      if (error.response.status === 429) {
        message.warning(error.response.data.message);
      } else {
        message.error('Đã xảy ra lỗi, vui lòng thử lại.');
      }
    } else {
      message.error('Lỗi kết nối, vui lòng kiểm tra lại.');
    }
  }
};
onMounted(() => {
  useMenu().onSelectedKey(['admin-infos']);
});
</script>
