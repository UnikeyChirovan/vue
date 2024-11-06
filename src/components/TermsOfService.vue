<template>
  <TheHeader/>
  <div class="container mt-4">
    <n-card title="Điều Khoản Sử Dụng" bordered>
      <n-space vertical size="large">
        <section v-for="section in termsSections" :key="section.title">
          <h3 class="mt-2 mb-0">{{ section.title }}</h3>
          <p>{{ section.content }}</p>
        </section>
      </n-space>
      <div class="text-center mt-4 d-flex justify-content-evenly">
        <n-button @click="goToPolicy" type="primary">Chính sách bảo mật</n-button>
        <n-button @click="goToHome" type="primary">Trang chủ</n-button>
        <n-button @click="goToFAQ" type="primary">Câu hỏi thường gặp</n-button>
      </div>
    </n-card>
  </div>
  <TheFooter/>
</template>

<script setup>
import {  ref } from "vue";
import { useRouter } from 'vue-router';
import TheHeader from "./TheHeader.vue";
import TheFooter from "./TheFooter.vue";

    const router = useRouter();
    const goToHome = () => router.push('/'); 
    const goToPolicy = () => router.push('/policy');  
    const goToFAQ = () => router.push('/faq');

    const termsSections = ref([
      {
        title: "1. Điều Kiện Sử Dụng",
        content: `Khi sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Nếu không đồng ý, vui lòng không tiếp tục sử dụng dịch vụ.
                  Chúng tôi có quyền cập nhật hoặc thay đổi các điều khoản này mà không cần thông báo trước. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.`,
      },
      {
        title: "2. Quyền và Trách nhiệm của Người Dùng",
        content: `Bạn cam kết cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản và cập nhật thông tin nếu có thay đổi.
                  Người dùng chịu trách nhiệm hoàn toàn về bảo mật tài khoản và mật khẩu, không chia sẻ với bất kỳ bên nào khác.
                  Bạn không được sử dụng dịch vụ cho các mục đích phi pháp hoặc vi phạm quyền lợi của bất kỳ bên thứ ba nào.`,
      },
      {
        title: "3. Quyền và Trách nhiệm của Chúng Tôi",
        content: `Chúng tôi cam kết cung cấp dịch vụ an toàn, bảo mật và liên tục cho người dùng. Tuy nhiên, chúng tôi không chịu trách nhiệm cho các sự cố do lỗi kỹ thuật hoặc các tình huống nằm ngoài khả năng kiểm soát.
                  Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn nếu bạn vi phạm bất kỳ điều khoản nào trong thỏa thuận này.`,
      },
      {
        title: "4. Giới hạn Trách nhiệm",
        content: `Chúng tôi không chịu trách nhiệm về các thiệt hại trực tiếp, gián tiếp hoặc mất mát mà bạn phải chịu khi sử dụng dịch vụ, trừ trường hợp được quy định rõ trong các điều khoản pháp lý hiện hành.`,
      },
      {
        title: "5. Luật áp dụng",
        content: `Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền.`,
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
