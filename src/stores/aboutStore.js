import { defineStore } from 'pinia';

export const useAboutStore = defineStore('about', {
    state: () => ({
        teamMembers: [],
        timeline: [],
        visionMissionValues: [], 
    }),
    actions: {
        fetchData() {
            this.teamMembers = [
                { name: 'Phạm Hữu Hoàng Anh', position: 'Người Viết Sách' },
            ];

            this.timeline = [
                { year: 2009, details: ["Những nét bút đầu tiên", "và đó là sự khởi đầu với những điều nhỏ bé..."] },
                { year: 2010, details: ["Gõ những trang word đầu tiên", "tới khoảng giữa năm học lớp 10, tôi đã in được 2 quyển sách, bây giờ vẫn còn nhưng hơi tơi tả"] },
                { year: 2012, details: ["Một câu chuyện mới", "Chỉ còn nhớ đó là đêm trước ngày thi, chắc là thi tốt nghiệp", "Đêm đó tôi chẳng học được bài mà cũng không ngủ được, và rồi hí hoáy vài dòng rồi thức nguyên đêm viết một mạch, truyện này tôi nhớ hình như có Nho Quốc, Nguyên Tú, Anh Thư, Thanh Trúc và dĩ nhiên có em gái tôi đọc"] },
                { year: '2012-2022', details: ["Một cuốn phim buồn..."] },
                { year: 2022, details: ["Một câu chuyện khác", "Một chứt suy tư về cuộc sống được viết vào một buổi chiều uống starbucks ở AEON - Nhật Bản", "Truyện này em gái tôi chê tơi tả, còn người yêu thì khen, Minh Quân bạn tôi - một nhà thơ - nhà triết học thì chúc mừng tôi, nhưng nói chung thì đây là câu chuyện mà tôi thích"] },
                { year: 2024, details: ["Khởi đầu mới", "Tập tành lập trình web", "Cốt truyện chắc chắn sẽ được đầu tư nâng cấp", "Cố lên Cáo!!!"] },
                { year: 2025, details: ["Coming soon..."] }
            ];

            this.visionMissionValues = [
                { 
                    title: 'Tầm nhìn', 
                    content: 'Trở thành một nền tảng truyện sáng tạo và đậm chất cá nhân, nơi mỗi câu chữ đều truyền tải đam mê, trải nghiệm và sự kiên trì. Selorson Tales không chỉ là một không gian để đọc truyện mà còn là nơi kết nối cảm xúc và trí tưởng tượng của độc giả, thúc đẩy sự sáng tạo và sự đồng cảm trong cộng đồng yêu truyện.' 
                },
                { 
                    title: 'Sứ mệnh', 
                    content: 'Mang đến những câu chuyện chân thực và đầy cảm xúc, phản ánh hành trình trưởng thành và khám phá bản thân của tác giả. Tạo ra một trải nghiệm đọc truyện không chỉ cuốn hút, mà còn gần gũi và đáng nhớ. Đồng thời, xây dựng một không gian tương tác thân thiện, nơi tác giả và độc giả cùng nhau phát triển, chia sẻ ý tưởng và góp phần tạo nên những tác phẩm có giá trị.' 
                },
                { 
                    title: 'Giá trị cốt lõi', 
                    content: [
                        'Đam mê và Sáng tạo: Mỗi câu chuyện đều xuất phát từ niềm đam mê mãnh liệt, khao khát khám phá và sự sáng tạo không ngừng nghỉ.',
                        'Chân thực và Kiên trì: Mỗi tác phẩm đều phản ánh trung thực về hành trình cá nhân của tác giả, với sự kiên định vượt qua khó khăn để theo đuổi và hoàn thiện ước mơ.',
                        'Kết nối và Đồng cảm: Tạo ra sự kết nối sâu sắc giữa tác giả và độc giả, với sự cởi mở lắng nghe và chia sẻ để cùng nhau phát triển.',
                        'Tôn trọng và Cống hiến: Mỗi lời góp ý, mỗi phản hồi đều được trân trọng, như một phần quan trọng để xây dựng một cộng đồng đọc truyện vững mạnh và tích cực.'
                    ] 
                }
            ];

        },
    },
});
