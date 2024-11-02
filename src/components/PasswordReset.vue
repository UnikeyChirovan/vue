<template>
    <div class="password-reset">
        <n-card title="Đặt Lại Mật Khẩu" style="max-width: 400px; margin: auto;">
            <n-form @submit.prevent="handleSubmit" :label-position="'top'">
                <n-form-item label="Mật khẩu mới">
                    <n-input v-model:value="password" type="password" show-password-on="click" placeholder="Nhập mật khẩu mới" />
                </n-form-item>
                <n-form-item label="Xác nhận mật khẩu">
                    <n-input v-model:value="password_confirmation" type="password" show-password-on="click" placeholder="Xác nhận mật khẩu mới" />
                </n-form-item>
                <n-button type="primary" @click="handleSubmit" :loading="loading" html-type="submit">Đặt lại mật khẩu</n-button>
            </n-form>
        </n-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import apiLinks from '../services/api-links';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const password = ref('');
const password_confirmation = ref('');
const loading = ref(false);

const token = route.query.token;
const email = route.query.email;

onMounted(() => {
    if (!token || !email) {
        message.error('Liên kết đặt lại mật khẩu không hợp lệ.');
        router.push({ name: 'home' });
    }
});

const handleSubmit = async () => {
    loading.value = true;
    try {
        const response = await apiLinks.auth.resetPassword({
            token,
            email,
            password: password.value,
            password_confirmation: password_confirmation.value
        });
        // console.log('Response:', response.data); 
        message.success(response.data.message);
        router.push({ name: 'home' });
    } catch (error) {
        // console.error('Error:', error); 
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
.password-reset {
    padding: 40px 0;
}
</style>
