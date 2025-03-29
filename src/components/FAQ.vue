<template>
  <TheHeader/>
  <div class="container mt-4">
    <n-card title="Câu Hỏi Thường Gặp" bordered>
      <n-space vertical size="large">
        <section v-for="(faq, index) in faqList" :key="index" class="faq-item">
          <n-collapse>
            <n-collapse-item :title="faq.question">
              <n-text>{{ faq.answer }}</n-text>
            </n-collapse-item>
          </n-collapse>
        </section>
      </n-space>
      <div class="text-center mt-4 d-flex justify-content-evenly">
        <n-button @click="goToTerms" type="primary">Điều khoản sử dụng</n-button>
        <n-button @click="goToHome" type="primary">Trang chủ</n-button>
        <n-button @click="goToPolicy" type="primary">Chính sách bảo mật</n-button>
      </div>
    </n-card>
  </div>
  <TheFooter/>
</template>

<script setup>
import { ref } from 'vue';
import TheHeader from './TheHeader.vue';
import TheFooter from './TheFooter.vue';

import { useRouter } from 'vue-router';

    const router = useRouter();
    const goToTerms = () => router.push('/terms'); 
    const goToHome = () => router.push('/'); 
    const goToPolicy = () => router.push('/policy');  
    const faqList = ref([
      {
        question: "Làm thế nào để tạo tài khoản?",
        answer: "Để tạo tài khoản, bạn chỉ cần vào trang đăng ký, điền thông tin và làm theo hướng dẫn.",
      },
      {
        question: "Tôi có thể thay đổi mật khẩu ở đâu?",
        answer: "Bạn có thể thay đổi mật khẩu trong phần cài đặt tài khoản của mình.",
      },
      {
        question: "Nếu quên mật khẩu thì làm thế nào?",
        answer: "Bạn bấm vào nút đăng nhập rồi bấm quên mật khẩu để có thể cấp lại mật khẩu, hoặc có thể liên hệ với chúng tôi",
      },
      {
        question: "Làm thế nào để liên hệ với bộ phận hỗ trợ?",
        answer: "Bạn có thể liên hệ với chúng tôi qua email, điện thoại hoặc điền vào form liên hệ trên trang Liên hệ.",
      },
    ]);

</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.faq-item {
  margin-bottom: 15px;
}
</style>
