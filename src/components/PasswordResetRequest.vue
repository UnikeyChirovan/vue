<template>
    <div class="password-reset-request">
        <n-card title="Đặt Lại Mật Khẩu" style="max-width: 400px; margin: auto;">
            <n-form @submit.prevent="handleSubmit" :label-position="'top'">
                <n-form-item label="Email">
                    <n-input v-model:value ="email" placeholder="Nhập email của bạn" />
                </n-form-item>
                <n-button block @click="handleSubmit" type="primary" :loading="loading" html-type="submit">Gửi yêu cầu</n-button>
            </n-form>
        </n-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import api from '..//services/axiosInterceptor';
const email = ref('');
const loading = ref(false);
const message = useMessage();


const handleSubmit = async () => {
    loading.value = true;
    try {
        const response = await api.post('/password-reset-request', { email: email.value });
        message.success(response.data.message);
        email.value = '';
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            message.error(error.response.data.message);
        } else {
            message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.password-reset-request {
    padding: 30px 0;
}
</style>
