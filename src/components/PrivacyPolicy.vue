<template>
  <TheHeader/>
  <div class="container mt-4">
    <n-card title="Chính Sách Bảo Mật" bordered>
      <n-space vertical size="large">
        <section v-for="section in privacyPolicySections" :key="section.title">
          <h3 class="mt-2">{{ section.title }}</h3>
          <p>{{ section.content }}</p>
        </section>
      </n-space>
      <div class="text-center mt-4 d-flex justify-content-evenly">
        <n-button @click="goToTerms" type="primary">Điều khoản sử dụng</n-button>
        <n-button @click="goToHome" type="primary">Trang chủ</n-button>
        <n-button @click="goToFAQ" type="primary">Câu hỏi thường gặp</n-button>
      </div>
    </n-card>
  </div>
  <TheFooter/>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import TheHeader from "./TheHeader.vue";
import TheFooter from "./TheFooter.vue";

    const router = useRouter();
    const goToTerms = () => router.push('/terms'); 
    const goToHome = () => router.push('/');  
    const goToFAQ = () => router.push('/faq');

    const privacyPolicySections = ref([
      {
        title: "1. Thu thập thông tin cá nhân",
        content: `Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Khi bạn truy cập và sử dụng dịch vụ, chúng tôi có thể thu thập các thông tin sau:
                  Thông tin cá nhân như họ tên, địa chỉ email, số điện thoại để xác minh và hỗ trợ khách hàng.
                  Thông tin sử dụng, bao gồm lịch sử hoạt động, thiết bị truy cập, và thông tin cookies nhằm tối ưu hóa trải nghiệm người dùng.`,
      },
      {
        title: "2. Sử dụng Thông tin Cá nhân",
        content: `Chúng tôi chỉ sử dụng thông tin cá nhân của bạn cho các mục đích sau:
                  Cải thiện chất lượng dịch vụ, cung cấp dịch vụ và hỗ trợ khách hàng.
                  Phát triển tính năng mới và tối ưu hóa trải nghiệm sử dụng.
                  Thực hiện các yêu cầu pháp lý hoặc bảo mật thông tin theo quy định.`,
      },
      {
        title: "3. Chia sẻ và Bảo vệ Thông tin Cá nhân",
        content: `Chúng tôi cam kết không chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ trường hợp có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật.
                  Các biện pháp bảo mật kỹ thuật và tổ chức được áp dụng để ngăn chặn việc truy cập trái phép, tiết lộ, sửa đổi hoặc phá hủy thông tin cá nhân của bạn.`,
      },
      {
        title: "4. Quyền Của Người Dùng",
        content: `Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa bỏ thông tin cá nhân của mình bất cứ lúc nào bằng cách liên hệ với chúng tôi.
                  Nếu bạn có bất kỳ thắc mắc hoặc lo ngại nào về chính sách bảo mật của chúng tôi, vui lòng liên hệ qua địa chỉ email hỗ trợ.`,
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
.text-center {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
