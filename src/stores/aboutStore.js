// src/store/aboutStore.js
import { defineStore } from 'pinia';

export const useAboutStore = defineStore('about', {
    state: () => ({
        teamMembers: [],
        timeline: [],
        customerStories: [],
    }),
    actions: {
        fetchData() {
                this.teamMembers = [
                    { name: 'Phạm Hữu Hoàng Anh', position: 'Người Viết Sách' },
                ];

            // Dữ liệu mẫu cho timeline
            this.timeline = [
                { year: 2009, details: ["Những nét bút đầu tiên", "và đó là sự khởi đầu với những điều nhỏ bé..."] },
                { year: 2010, details: ["Gõ những trang word đầu tiên", "tới khoảng giữa năm học lớp 10, tôi đã in được 2 quyển sách, bây giờ vẫn còn nhưng hơi tơi tả"] },
                { year: 2012, details: ["Một câu chuyện mới", "Chỉ còn nhớ đó là đêm trước ngày thi, chắc là thi tốt nghiệp", "Đêm đó tôi chẳng học được bài mà cũng không ngủ được, và rồi hí hoáy vài dòng rồi thức nguyên đêm viết một mạch, truyện này tôi nhớ hình như có Nho Quốc, Nguyên Tú, Anh Thư, Thanh Trúc và dĩ nhiên có em gái tôi đọc"] },
                { year: '2012-2022', details: ["Một cuốn phim buồn..."] },
                { year: 2022, details: ["Một câu chuyện khác", "Một chứt suy tư về cuộc sống được viết vào một buổi chiều uống starbucks ở AEON - Nhật Bản", "Truyện này em gái tôi chê tơi tả, còn người yêu thì khen, Minh Quân bạn tôi - một nhà thơ - nhà triết học thì chúc mừng tôi, nhưng nói chung thì đây là câu chuyện mà tôi thích"] },
                { year: 2024, details: ["Khởi đầu mới", "Tập tành lập trình web", "Cốt truyện chắc chắn sẽ được đầu tư nâng cấp", "Cố lên Cáo!!!"] },
                { year: 2025, details: ["Coming soon..."] }
            ];

            // Dữ liệu mẫu cho câu chuyện khách hàng
            this.customerStories = [
                { customer: 'Công ty X', story: 'Sản phẩm đã giúp chúng tôi tăng doanh thu 30%' },
                { customer: 'Công ty Y', story: 'Dịch vụ khách hàng tuyệt vời và sản phẩm chất lượng.' },
                { customer: 'Công ty Z', story: 'Hợp tác lâu dài và đáng tin cậy.' },
                // Thêm nhiều câu chuyện khác nếu cần
            ];
        },
    },
});
