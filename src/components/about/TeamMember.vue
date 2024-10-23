<template>
  <div class="container-fluid team-member-container">
    <div class="title-text"><h2 class="text-uppercase">Một Chút Về Selorson Tales</h2></div>
    <div class="row">
      <!-- Avatar và thông tin cơ bản -->
      <div class="col-md-4 info-left">
        <img class="avatar" src="../../assets/img/users.jpg" alt="Avatar của {{ member.name }}" />
        <div class="basic-info">
          <h3>{{ member.name }}</h3>
          <hr />
          <p class="position">{{ member.position }}</p>
          <p class="slogan">"Thú vị vì những cái vô vị<br />vô vị trước những cái thú vị"</p>
          <hr/>
          <div class="poem-section">
            <h2 class="text-primary">Thất Sắc Hành Ca</h2>
            <p>Mây trôi nhẹ gió đưa hồn lữ thứ</p>
            <p>Chân vội vàng cố níu giữ thời gian</p>
            <p>Đêm dịu dàng lòng quạnh hiu xa xứ</p>
            <p>Người lữ hành bước đi trong gian nan.</p>
            <p>Bóng dáng ai bên thềm trăng soi tỏ</p>
            <p>Đêm thanh tĩnh phiêu du khúc không lời</p>
            <p>Từ rừng xanh hành trình qua sóng gió</p>
            <p>Phiêu lưu ký mở cõi bát ngát trời.</p>
            <p>Vẫn lặng lẽ vầng nguyệt dương lang thang</p>
            <p>Phiêu lưu cùng những giấc mộng đêm về</p>
            <p>Màn đêm tối thì thầm những lời thề</p>
            <p>Bình minh lên chạy đua với thời gian.</p>
            <p>Vũ trụ rộng sao lấp lánh đêm đông</p>
            <p>Ngân hà xa tỏa sắc màu huyền diệu</p>
            <p>Hành tinh kia thương nhớ biết bao nhiêu</p>
            <p>Ta lặng im ngắm trái đất quay vòng.</p>
            <p>Rồi một ngày trời chợt đổ mưa dông</p>
            <p>Gió lay động ma thuật xưa lại sống</p>
            <p>Ta nhặt nhạnh từng sức mạnh tổ tông</p>
            <p>Thất sắc đạo suối nguồn thác đổ dòng.</p>
            <p>Màu trắng tinh băng giá phủ lên đỉnh</p>
            <p>Bạch quang sắc sao băng rơi không ngừng</p>
            <p>Chắp tay lại nguyện cầu với thần linh</p>
            <p>Phép thuật xưa trỗi dậy như đã từng.</p>
            <p>Màu đỏ thắm thanh gươm lòng dũng cảm</p>
            <p>Chém ác long hỏa chiến công lẫy lừng</p>
            <p>Đầy kiêu ngạo rảy sạch máu quay lưng</p>
            <p>Đời kiếm sĩ đời lãng du phiêu lãng!</p>
            <p>Chàng và nàng giữa bao la sơn hải</p>
            <p>Cùng nhau vẽ hạnh phúc của hai ta</p>
            <p>Nàng đi mất tương lai không lời giải</p>
            <p>Ôi chiến tranh tàn phá đi tất cả!</p>
            <p>Ta vì nàng vì mảnh đất quê hương</p>
            <p>Với khoa học hành trang là lý tưởng</p>
            <p>Sự tham lam âm thanh cam bất bại</p>
            <p>Vượt thời gian tìm kiếm những anh tài.</p>
            <p>Bởi đất đá tấm khiên vàng vững chắc</p>
            <p>Cứ tiến lên tin tưởng ở hậu phương</p>
            <p>Từ Văn Lang gọi tôi hoàng kim sắc</p>
            <p>Chút đố kị chút quá khứ bi thương </p>
            <p>Từ rừng xanh đến kỉ nguyên thần thánh</p>
            <p>Mang trọng trách một người bạn đồng hành</p>
            <p>Không cá tính sức mạnh cũng mỏng manh</p>
            <p>Yêu thiên nhiên yêu không khí trong lành.</p>
            <p>Xanh như nước sắc xảo như mây trời</p>
            <p>Mái tóc đen mềm mại như làn sương</p>
            <p>Học cấm thư gương mặt em sáng ngời</p>
            <p>Lam thuật sư cô gái vạn người thương</p>
            <p>Ánh sáng xanh em giúp tôi chữa lành</p>
            <p>Vết thương nào rồi cũng sẽ qua nhanh</p>
            <p>Bao khó khăn có phàm ăn giúp sức</p>
            <p>Cuộc chiến nào rồi cũng chấm dứt thôi.</p>
            <p>Indigo ngọn lôi thương thức giấc</p>
            <p>Celtic xưa phong lưu ai sánh bằng</p>
            <p>Thầy tài giỏi học trò thêm xuất sắc</p>
            <p>Ngày nằm ngủ đêm càng đánh càng hăng.</p>
            <p>Thời thần thánh cuộc chiến dài bất tận</p>
            <p>Bao sinh linh kẻ nước mất nhà tan</p>
            <p>Cung và nước em đánh luôn cả Thần!</p>
            <p>Tội làm biếng em hóa làm mỹ nhân.</p>
            <p>Đen huyền bí tài năng và bản lĩnh</p>
            <p>Đầy mạnh mẽ tự tin ở chính mình</p>
            <p>Thật thông minh tự khám phá tất cả</p>
            <p>Kiếm sĩ đen tự Darkin Tenka.</p>
            <p>Mỗi màu sắc mỗi một cuộc hành trình</p>
            <p>Đỏ kiếm sĩ thật thà hơi nóng tính</p>
            <p>Cam cầu toàn khoa học gia chăm chỉ</p>
            <p>Vàng đầu bếp vững vàng chẳng ngại gì</p>
            <p>Lục quân sư yêu thích những bài văn</p>
            <p>Lam thuật sĩ triết lý đầy sâu lắng</p>
            <p>Chàm mèo tộc giấc mộng thênh thang trôi</p>
            <p>Tím cung bạc tên xuyên phá không thời </p>
            <p>Đen huyền bí hay ác quỷ giấu mình</p>
            <p>Trắng tinh khôi thiên thần áo trắng tinh</p>
            <p>Phiêu lưu mãi chẳng tính điểm dừng chân</p>
            <p>Bảy màu sắc chuyện đổi thay muôn phần</p>
            <p>Vượt không thời đánh với hắc kiếm sư</p>
            <p>Những trận đánh đã đi vào lịch sử</p>
            <p>Thất sắc đạo chi thất sắc hành ca</p>
            <p>Càn khôn đạo phi thường đạo hành ca </p>
          </div>
        </div>
      </div>
      <div class="col-md-8 content-right">
        <div class="introduction" v-html="formattedIntroduction"></div>
      </div>
    </div>
  </div>
</template>


<script setup>
const props = defineProps({
  member: Object
});

const formattedIntroduction = `
  Mến chào các bạn độc giả,
  tôi là Phạm Hữu Hoàng Anh, người sáng lập và cũng là tác giả duy nhất của những câu chuyện mà bạn đang đọc trên trang web này.<br />
  Đến với Selorson Tales là đến với từng câu chữ được tạo nên từ niềm đam mê, sự kiên trì và cũng là nỗi niềm day dứt của tôi trong suốt thời thơ ấu cho đến tận bây giờ, tôi mong muốn mang đến cho độc giả không chỉ là một tác phẩm, mà còn là một hành trình cảm xúc.... </br>
  Từ hồi còn nhỏ, tôi đã yêu thích những câu chuyện. Tôi vẫn còn nhớ rất rõ, mỗi tối trước khi đi ngủ, ba anh em tôi nằm chung một giường, được chị tôi kể cho nghe hàng trăm câu chuyện. Có lẽ chị có năng khiếu, chị kể nhiều câu chuyện khác nhau mà chẳng hề cầm trên tay một quyển sách nào. Chị kể truyện cổ tích, truyện "Một đòn chết bảy", "Cây đa chú cuội", "Tây Du Ký tập 1 - cái tập mà tôi đã bỏ lỡ phim tập 1 biết bao lần", rồi "Địt thơm địt thúi ^^!"... Có lẽ tôi đã thích các câu chuyện từ đó. </br>
  Rồi chị đi Sài Gòn học, tôi trải qua những năm tháng học cấp 1 với bắn bi, tạt mo, rượt bắt và quyển sách giáo khoa "Truyện Đọc", hồi đó thích gì mà thích, đọc hết truyện này tới truyện kia, đọc đi đọc lại các câu chuyện, tôi còn nhớ vài câu chuyện như "Trí khôn của ta đây", "Tấm Cám", "Sọ Dừa"... Rồi mỗi lần được đi Sài Gòn, được chị dẫn đi Sài Gòn Water Park, đi nhà sách Nguyễn Văn Cừ, tôi lại có thêm những quyển truyện mới. Trong đó có quyển "Không Gia Đình", nằm trong bộ "Những tác phẩm văn học cổ điển chọn lọc" là quyển mà tôi thích và đọc lại rất nhiều lần. </br>
  Năm lớp 9, tôi chuyển nhà xuống Long Khánh và rồi tôi mở mang tầm mắt hơn, biết tập tành đi Net, rồi cũng biết đọc truyện tranh trên mạng (thật ra tôi chỉ đọc Conan, Naruto với One Piece), nói chung thì tôi biết được nhiều thứ mà trước kia tôi chẳng biết và rồi tôi cũng biết tới Sherlock Holmes. Đó là truyển truyện dày cộm đầu tiên mà tôi mua khi về nơi ở mới, tôi đọc ngấu nghiến, tối sợ mẹ la, tôi bật đèn rồi chui vô mền đọc ^^!, đó là những kỉ niệm mà chắc tôi không thể nào quên được.
  Rồi cũng đến một lúc, tôi nhận ra mình chẳng thể nào đủ khả năng để mua được quá nhiều quyển truyện, và cũng tự nhiên, tôi lại muốn có một câu chuyện của riêng mình, và rồi tôi cũng cầm viết và hí hoáy những dòng đầu tiên vào cuối năm học lớp 9.
  Có những đêm, tự nhiên có cảm hứng và đêm mê bất chợt, tôi bật dậy, lặng lẽ viết và viết, từng con chữ, dần dần, số lượng trang truyện cứ nhiều dần lên. Năm đó tôi cũng hên có cái máy vi tính để bàn mà ông anh không xài để lại, vậy là tôi tập lóc cóc đánh máy các trang truyện của mình. Khoảng đầu năm lớp 10 tôi in được 2 quyển truyện đầu tiên, mỗi quyển có số trang là 200 (khổ A5), sau này tôi có lấy cho em gái tôi đọc, nó khen hay làm tôi vui lắm, dẫu vậy, sau này đọc lại thì tôi cũng tự nhận mình không có năng khiếu về viết truyện lắm, mọi thứ có vẻ khá rời rạc, thiếu sót về nội dung, về phong cách, về logic... rất nhiều. Sau rồi nhận ra mình cũng không có năng khiếu lắm, tôi cũng không viết nữa, chỉ có năm lớp 12 tôi viết thêm một truyện ngắn, và sau này rất lâu chắc 10 năm sau tôi mới viết thêm một truyện ngắn nữa, các truyện ngắn đó tôi cũng cố gắng thêm vào câu chuyện của mình. </br>
  Lên đại học, có lẽ đó cũng là một sự tiếc nuối khác trong tôi, việc học của tôi không khó khăn nhưng cũng chẳng thuận lợi, thời gian cứ tàn tàn trôi qua cùng với quãng đời sinh viên nhạt nhẽo của tôi, không sách, không bạn bè nhiều, không nhậu nhẹt, không gái gú, mặc dù tôi cũng yêu nhiều nhưng mà theo đúng nghĩa của một loser, mà loser thì các bạn cũng biết rồi. Cuộc sống học đại học là chuỗi ngày tôi khép mình, một thực tế phũ phàng mà tôi nghĩ đó chính là nỗi sợ hãi, tôi sợ nhiều thứ lắm, sợ hút thuốc uống rượu do sợ chết, sợ làm chuyện xấu, dù chuyện tốt tôi cũng không làm. Nói chung có những điều mình nên trải qua, nhưng tôi đã lựa chọn không vì sợ. Rồi y bài, ra trường thì tôi cũng bấp bênh, khả năng thích nghi, khả năng sinh tồn của tôi nó dựa vào sức lực nhiều hơn là trí óc, khi hết sức chắc giá trị cũng không còn. Vậy là... tôi đi Nhật.</br>
  Tại nước Nhật khá xa xôi, từ Sài Gòn bay tới Nhật khoảng 6 tiếng, công việc của tôi hoàn toàn có người lo liệu, mọi thứ đều có người sắp xếp, và tôi chỉ cần hoạt động theo cái guồng máy đã được chạy sẳn, nếu chạy sai thì bị đào thải, ừ thì... tôi bị đào thải thật. Công việc không phải là tốt lắm, nhưng nó đảm bao nhu cầu cuộc sống và một khoản dư ít ỏi, nếu một người sống một mình, làm việc và hưởng thụ thì khoản dư đó hoàn toàn ổn, nhưng thật ra chẳng ai đánh đổi đi Nhật đi làm việc với mức lương đó hằng tháng cả, chỉ là với tôi, tôi chấp nhận cuộc sống như vậy, dù có muốn thay đổi thì tôi cũng không biết cách, và rồi tôi bị đuổi khỏi công ty, nói chung là do bản thân sai sót quá nhiều, và những công việc đòi hỏi sự tỉ mỉ nó có lẽ là hơi quá với tôi. Nhưng có lẽ tôi gặp may, như người ta thường nói, một cánh cửa đóng lại, cuộc hành trình khác lại mở ra, tôi được công ty giới thiệu làm việc ở một nơi khác, cực khổ hơn, bán sức nhiều hơn nhưng lại kiếm được số tiền giống với bao anh em khác ở bên Nhật. Tôi cảm giác, mình cũng đã cởi mở nhiều hơn, ít sợ hãi hơn và ít nhiều cũng biết chấp nhận hơn. Nhưng mà, đổi lại thì sức khỏe, sự chăm sóc bản thân của tôi càng ngày càng xuống. Vậy là có lẽ nên về nhà rồi, tạm biệt Nhật Bản sau 3 năm 7 tháng. Tôi không hợp với Nhật lắm, cũng biết rằng đi làm là đánh đổi, cũng bán sức lao động của mình để kiếm đồng lương, dù lâu lâu cũng chửi thầm người Nhật như này như kia, nhưng thật tâm thì tôi rất cảm ơn Đất nước Nhật Bản, vì nhờ có thời gian làm việc cùng họ, tôi mới có thể kiếm được số tiền mà nếu như ở Việt Nam tôi không biết mình có thể làm được những gì, phải mất bao lâu mới kiếm được như vậy, Arigatou Gozaimasu!!. </br>
  Mà các bạn, bên Nhật cũng nhiều cám dỗ lắm, nhưng thật tình thì tôi cũng may mắn, do hay sợ với do cái tính không dám rời khỏi vùng an toàn mà tôi vẫn còn có vốn đem về (may mắn trong trường hợp này thôi), tôi biết được chuyện rất nhiều anh em làm việc vô cùng cực khổ, nhưng cuối cùng vì dính vào vụ này vụ kia mà tay trắng và nợ nần. Vì vậy, các bạn hãy biết điều gì là nên làm, điều gì nên làm, nó có đáng để đánh đổi không nhé! </br>
  Khi tôi về Việt Nam, mọi thứ tôi đều phải bắt đầu từ đầu, cuộc sống tôi vẫn long đong trôi nổi, định hướng về tương lai khá mịt mù, tôi không phải là một đứa giỏi kiếm tiền, cũng không phải là một người có đầu óc tốt lắm, tôi tự nhận mình ngoại giao dở tệ, và thiếu nhiều kiến thức về xã hội. Những năm tháng ra đời kiếm tiền cũng đã dạy tôi biết một vài điều quý giá, mặc dù tôi không phải là người hay chiêm nghiệm, hay ghi nhớ những sự kiện để rồi rứt ra những bài học cho mình, sâu thẳm thì tôi vẫn muốn vậy nhưng mà thực tế đối với tôi mọi việc đều khá là khó khăn. Theo cách nghĩ đơn sơ của tôi, một người muốn thành công thì họ phải rất giỏi hoặc là họ phải thiệt ác. Giỏi để không bị ai lừa, hoặc nếu bị lừa thì phải nhẫn tâm đi lừa người khác. Mà tự nhiên nghĩ tới đó tôi hay đau đầu, tôi đâu giỏi đâu, nhưng mà tôi cũng không muốn ác (nhưng mà thiện với tôi nó cũng không gần lắm) Và rồi tôi tìm về những gì tôi muốn làm. Đọc lại "tác phẩm" của mình khi xưa, tôi nhận ra mình viết kém cỏi như thế nào, nhưng đồng thời tôi cũng khá là thích những chuyến phiêu lưu trong đó, có điều gì đó làm tôi luôn day dứt, vậy là tôi quyết tâm làm lại lần nữa, tôi quyết tâm sẽ hoàn thiện câu chuyện này một cách tốt nhất có thể. Cho điều lớn lao nhất mà con người nhỏ bé nhiều khuyết điểm của tôi có thể làm. </br>
  Không chỉ là việc viết truyện, việc tạo ra trang web này cũng là một hành trình riêng. Bây giờ, khi gõ những dòng này thật ra là tôi đang tự tay làm một trang web cho chính mình. Tôi tự mình tìm hiểu, học từng dòng code để trang web trở thành một không gian phản ánh cá tính và tâm huyết của mình. Mọi thứ, từ nội dung đến thiết kế, tôi đều đặt tâm trí và trái tim, nhiều đêm tôi thức trắng để tìm lỗi, cảm giác rất vui sướng tột cùng khi tự mình giải quyết được một vấn đề nào đó, cố gắng tỉ mỉ chăm chút nhất có thể với mong muốn đem lại trải nghiệm tốt nhất.<br />
  Cuộc hành trình có lẽ chỉ vừa mới bắt đầu, mọi thứ cũng còn rời rạc nhưng hi vọng với may mắn và nỗ lực hơn thì chúng trở thành những mảnh ghép hoàn thiện trong thế giới mà tôi xây dựng.<br />
  Các bạn thân mến, tận đáy lòng, tôi cảm thấy rất vui khi được chia sẻ những câu chuyện này cùng bạn, và tôi luôn mong muốn lắng nghe mọi ý kiến đóng góp của bạn – không chỉ về nội dung truyện, mà còn về cách trang web hoạt động. Mỗi lời nhận xét dù là khen hay chê, tôi đều hi vọng nó mang đến sự đóng góp chung, đó đều là động lực để tôi cải thiện, hoàn thiện hơn, và tạo nên một không gian đọc truyện thật sự thân thiện và gần gũi.<br />
  <em>Trân Trọng,</em><br />
  <em>Tác giả</em>
`;
</script>

<style scoped>
/* Container setup */
.team-member-container {
  margin-top: 0px;
  padding: 40px 20px;
  background-color: #f8f9fa;
}

.info-left {
  text-align: center;
  animation: slideInFromLeft 1s ease-in-out;
}

.avatar {
  width: 200px;
  height: auto;
  /* border-radius: 50%; */
  margin-bottom: 20px;
}

.basic-info {
  text-align: center;
}

h3 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #0056b3;
}

hr {
  width: 50px;
  border: 1px solid #007bff;
  margin: 10px auto;
}

.position {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.slogan {
  font-size: 1.1rem;
  font-style: italic;
  color: #555;
  line-height: 1.5;
}
.poem-section {
  margin-top: 20px;
  text-align: center;
}

.poem-section h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  margin-left: -50px;
  color: #0056b3;
}

.poem-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 5px 0;
  margin-left: 60px;
  text-align: left;
}


.content-right {
  display: flex;
  align-items: center;
  animation: slideInFromRight 1.5s ease-in-out;
  padding: 15px; /* Thêm padding để tránh chữ bị dồn */
}
.introduction {
  font-size: 1.2rem;
  color: #333;
  line-height: 1.7;
  max-width: 85%; /* Đảm bảo chiều rộng chỉ chiếm 80% */
  margin: 0 auto; /* Canh giữa phần tử bằng cách đặt margin trái và phải tự động */
  font-style: italic; /* Định dạng chữ nghiêng */
  text-align: left; /* Canh lề trái */
  padding-left: 15px; /* Thêm padding vào lề trái */
  text-indent: 20px; /* Thụt lề cho dòng đầu tiên */
}


.title-text {
  margin-top: 0px; 
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

/* Animation for text from right */
@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Animation for avatar and info from top */
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-right {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
