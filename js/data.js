// js/data.js
const appData = {
  topics: [
    {
      id: 'physics-magnet',
      subject: 'Vật lý',
      icon: '🧲',
      title: 'Nam châm & Từ tính',
      summary:
        'Nhận biết các cực từ, tương tác hút đẩy và các vật liệu có từ tính.',
      tags: ['Tính chất cơ bản', 'Thực hành', 'Nhận biết'],
      accent: 'var(--color-primary)',
    },
    {
      id: 'physics-field',
      subject: 'Vật lý',
      icon: '🌐',
      title: 'Từ trường',
      summary:
        'Hiểu bản chất từ phổ, ý nghĩa đường sức từ và cách nhận biết từ trường.',
      tags: ['Khái niệm', 'Từ phổ', 'Đường sức từ'],
      accent: 'var(--color-secondary)',
    },
    {
      id: 'biology-photosynthesis',
      subject: 'Sinh học',
      icon: '🌿',
      title: 'Quang hợp',
      summary:
        'Tìm hiểu nguyên liệu hấp thụ, sản phẩm tạo thành và các yếu tố môi trường ảnh hưởng.',
      tags: ['Thực vật', 'Năng lượng', 'Trao đổi chất'],
      accent: 'var(--color-success)',
    },
    {
      id: 'biology-respiration',
      subject: 'Sinh học',
      icon: '🫁',
      title: 'Hô hấp tế bào',
      summary:
        'Hiểu tiến trình phân giải glucose tạo năng lượng, vai trò của oxygen và ti thể.',
      tags: ['Tế bào', 'Năng lượng', 'Bảo quản'],
      accent: 'var(--color-accent)',
    },
  ],
  flashcards: [
    {
      id: 'card-1',
      topicId: 'physics-magnet',
      front: 'Khi nào hai thanh nam châm hút nhau?',
      back: 'Khi để hai cực khác tên gần nhau.',
    },
    {
      id: 'card-2',
      topicId: 'physics-magnet',
      front: 'Mỗi thanh nam châm vĩnh cửu thường có mấy cực?',
      back: 'Hai cực.',
    },
    {
      id: 'card-3',
      topicId: 'physics-magnet',
      front: 'Nam châm là những vật có [__]?',
      back: 'Nam châm là những vật có từ tính.',
    },
    {
      id: 'card-4',
      topicId: 'physics-magnet',
      front: 'Vị trí nào trên thanh nam châm hút sắt mạnh nhất?',
      back: 'Hai từ cực.',
    },
    {
      id: 'card-5',
      topicId: 'physics-field',
      front: 'Khái niệm Từ phổ?',
      back: 'Hình ảnh các <mark>mạt sắt</mark> xung quanh nam châm được gọi là từ phổ.',
    },
    {
      id: 'card-6',
      topicId: 'physics-field',
      front:
        'Đường sức từ là những đường cong có chiều nhất định. Ở bên ngoài thanh nam châm, chiều của đường sức từ được vẽ theo quy ước sao cho:',
      back: 'Có chiều <mark>đi ra cực Bắc</mark> và <mark>đi vào cực Nam</mark> của thanh nam châm.',
    },
    {
      id: 'card-7',
      topicId: 'physics-field',
      front:
        '3 <mark>Vùng không gian</mark> bao quanh một nam châm (hoặc dây dẫn mang dòng điện), mà vật liệu có tính chất từ đặt trong nó chịu tác dụng lực từ, được gọi là ................',
      back: '<mark>Từ trường</mark>.',
    },
    {
      id: 'card-8',
      topicId: 'physics-field',
      front: 'Từ trường tồn tại ở đâu?',
      back: 'Xung quanh <mark>nam châm</mark>.',
    },
    {
      id: 'card-9',
      topicId: 'biology-photosynthesis',
      front:
        'Quá trình cơ thể lấy các chất cần thiết từ môi trường (như nước, khí oxygen, chất dinh dưỡng…) và thải các chất không cần thiết (như khí carbon dioxide, chất cặn bã,…) ra ngoài môi trường là quá trình',
      back: '<mark>Trao đổi chất</mark> giữa cơ thể với môi trường.',
    },
    {
      id: 'card-10',
      topicId: 'biology-photosynthesis',
      front:
        'Chất nào sau đây là sản phẩm của quá trình trao đổi chất được động vật <mark>thải ra</mark> môi trường?',
      back: '<mark>Carbon dioxide</mark>.',
    },
    {
      id: 'card-11',
      topicId: 'biology-photosynthesis',
      front:
        'Số yếu tố ảnh hưởng đến quang hợp ở thực vật là:',
      back: '<mark>4</mark> yếu tố môi trường chính tác động đến hiệu suất quang hợp của thực vật.',
    },
    {
      id: 'card-12',
      topicId: 'biology-photosynthesis',
      front:
        'Nguyên liệu của quá trình quang hợp gồm',
      back: 'Trong quá trình quang hợp, thực vật sử dụng <mark>năng lượng ánh sáng Mặt Trời</mark> để tổng hợp chất hữu cơ từ <mark>Nước</mark> và <mark>Carbon dioxide</mark>, đồng thời giải phóng khí <mark>Oxygen</mark>.',
    },
    {
      id: 'card-13',
      topicId: 'biology-photosynthesis',
      front:
        'Trong quá trình quang hợp, cây xanh chuyển hoá năng lượng ánh sáng mặt trời thành dạng năng lượng nào sau đây?',
      back: '<mark>Hoá năng</mark>.',
    },
    {
      id: 'card-14',
      topicId: 'biology-photosynthesis',
      front:
        'Cơ quan chính thực hiện quá trình quang hợp ở thực vật là',
      back: 'lá cây.',
    },
    {
      id: 'card-15',
      topicId: 'biology-photosynthesis',
      front: '<mark>Sản phẩm</mark> của quang hợp là',
      back: 'khí <mark>oxygen</mark> và <mark>glucose</mark>.',
    },
    {
      id: 'card-16',
      topicId: 'biology-photosynthesis',
      front: '<mark>Nguyên liệu</mark> của quá trình quang hợp gồm',
      back: '<mark>Khí carbon dioxide</mark>, <mark>nước</mark> và <mark>năng lượng ánh sáng</mark>.',
    },
    {
      id: 'card-17',
      topicId: 'biology-respiration',
      front: 'Ở Sinh vật nhân thực, quá trình <mark>hô hấp</mark> diễn ra trong:',
      back: '<mark>Ti thể</mark>',
    },
    {
      id: 'card-18',
      topicId: 'biology-respiration',
      front:
        'Loại chất được <mark>phân giải</mark> chủ yếu trong quá trình hô hấp tế bào là:',
      back: '<mark>glucose</mark>',
    },
    {
      id: 'card-19',
      topicId: 'biology-respiration',
      front:
        'Năng lượng đã được chuyển hoá như thế nào trong quá trình hô hấp?',
      back: '<mark>Hoá năng thành nhiệt năng</mark>',
    },
    {
      id: 'card-20',
      topicId: 'biology-respiration',
      front: 'Nguyên liệu tham gia vào quá trình hô hấp tế bào là:',
      back: '<mark>Glucose</mark>, <mark>oxygen</mark>',
    },
    {
      id: 'card-21',
      topicId: 'biology-respiration',
      front:
        'Oxygen là nguyên liệu tham gia vào quá trình hô hấp. Cường độ hô hấp giảm khi nồng độ oxygen trong không khí giảm xuống dưới:',
      back: '<mark>5%</mark>',
    },
    {
      id: 'card-22',
      topicId: 'physics-magnet',
      front:
        'Các vật liệu như <mark>sắt, thép, cobalt, nickel</mark> được gọi chung là vật liệu có [___].',
      back: '<mark>từ tính</mark>',
    },
    {
      id: 'card-23',
      topicId: 'biology-photosynthesis',
      front:
        'Khi nói về đặc điểm cấu tạo, hình thái của lá phù hợp với chức năng quang hợp, cho các phát biểu sau: (1) Lá thường có dạng bản dẹt, phiến lá rộng giúp thu nhận được nhiềuánh sáng. (2) Các tế bào thịt lá chứa nhiều lục lạp giúp hấp thụ và chuyển hóa năng lượngánh sáng. (3) Hệ thống gân lá giúp dẫn nước cho quá trình quang hợp và dẫn các sản phẩm quang hợp đến các cơ quan khác. (4) Biểu bì lá có các khí khổng giúp cho quá trình trao đổi khí và hơi nước trong quang hợp diễn ra dễ dàng. (5) Ở các mấu thân hoặc cành, lá thường xếp song song và mặt lá thường tạo góc nghiêng với tia sáng mặt trời để thu được nhiềuánh sáng nhất. Số phát biểu đúng là:',
      back: 'Cả 5 phát biểu trên đều đúng và đều là những đặc điểm tiến hoá cấu tạo thích ứng của lá cây.',
    },
    {
      id: 'card-24',
      topicId: 'biology-photosynthesis',
      front: 'Nhiệt độ thuận lợi cho quá trình hô hấp ở sinh vật khoảng:',
      back: '30-35°C',
    },
    {
      id: 'card-25',
      topicId: 'physics-magnet',
      front:
        'Khi đưa hai cực <mark>cùng tên</mark> của hai thanh nam châm lại gần nhau, chúng sẽ [___].',
      back: '<mark>đẩy nhau</mark>',
    },
    {
      id: 'card-26',
      topicId: 'biology-photosynthesis',
      front:
        'Quá trình cơ thể <mark>lấy</mark> các chất từ môi trường <mark>và thải</mark> các chất cặn bã ra ngoài gọi là [___].',
      back: '<mark>trao đổi chất</mark>',
    },
    {
      id: 'card-27',
      topicId: 'biology-respiration',
      front:
        'Năng lượng ánh sáng trong quang hợp được <mark>dự trữ</mark> dưới dạng năng lượng [___] trong glucose.',
      back: '<mark>hóa năng</mark>',
    },
    {
      id: 'card-28',
      topicId: 'physics-field',
      front: '<mark>Đường sức từ</mark> được dùng để biểu diễn [___].',
      back: '<mark>từ trường</mark>',
    },
    {
      id: 'card-29',
      topicId: 'biology-photosynthesis',
      front:
        'Cơ quan chính thực hiện chức năng <mark>quang hợp</mark> ở đa số thực vật là [___].',
      back: '<mark>lá cây</mark>',
    },
    {
      id: 'card-30',
      topicId: 'biology-respiration',
      front: 'Để <mark>bảo quản</mark> các loại hạt giống người ta sử dụng biện pháp nào sau đây:',
      back: '<mark>Phơi khô và cho vào lọ kín.</mark>',
    },
    {
      id: 'card-31',
      topicId: 'physics-magnet',
      front: 'Mỗi nam châm luôn có hai cực từ là cực nào?',
      back: 'cực Bắc và cực Nam.',
    },
    {
      id: 'card-32',
      topicId: 'physics-magnet',
      front: 'Các cực <mark>khác tên</mark> thì hút nhau, đúng hay sai?',
      back: '<mark>hút nhau</mark>',
    },
    {
      id: 'card-33',
      topicId: 'physics-field',
      front: 'Chiều đường sức từ theo quy ước là:',
      back: '<mark>Đi ra từ cực Bắc và đi vào cực Nam</mark>.',
    },
    {
      id: 'card-34',
      topicId: 'biology-photosynthesis',
      front: 'Trình bày vai trò của khí khổng:',
      back: '<mark>Khí khổng trao đổi khí và thoát hơi nước</mark>.',
    },
    {
      id: 'card-35',
      topicId: 'biology-photosynthesis',
      front: 'Giải thích vì sao phiến lá thường mỏng và rộng:',
      back: 'Diện tích bề mặt lớn giúp lá hấp thụ nhiều ánh sáng phục vụ quang hợp.',
    },
    {
      id: 'card-36',
      topicId: 'biology-respiration',
      front: 'Hô hấp tế bào tạo năng lượng diễn ra tại',
      back: 'ti thể.',
    },
    {
      id: 'card-37',
      topicId: 'biology-respiration',
      front: 'Ban đêm cây hô hấp như thế nào?',
      back: 'Ban đêm không có ánh sáng nên cây ngừng quang hợp nhưng vẫn hô hấp liên tục.',
    },
    {
      id: 'card-38',
      topicId: 'biology-respiration',
      front: 'Đất tơi xốp chứa nhiều không khí cung cấp [__] cho hô hấp của rễ.',
      back: 'oxygen',
    },
  ],
  questions: [
    {
      id: 'vl-tn-2',
      topicId: 'physics-magnet',
      prompt: 'Khi nào hai thanh nam châm hút nhau?',
      options: [
        'A. Khi hai cực Bắc để gần nhau.',
        'B. Khi hai cực Nam để gần nhau.',
        'C. Khi để hai cực khác tên gần nhau.',
        'D. Khi cọ xát hai cực cùng tên vào nhau.',
      ],
      answer: 'C. Khi để hai cực khác tên gần nhau.',
    },
    {
      id: 'vl-tn-3',
      topicId: 'physics-magnet',
      prompt: 'Mỗi thanh nam châm vĩnh cửu thường có mấy cực?',
      options: ['A. Một cực.', 'B. Hai cực.', 'C. Ba cực.', 'D. Bốn cực.'],
      answer: 'B. Hai cực.',
    },
    {
      id: 'vl-tn-4',
      topicId: 'physics-magnet',
      prompt: 'Phát biểu nào sau đây là đúng khi nói về nam châm?',
      options: [
        'A. Nam châm là những vật có từ tính.',
        'B. Nam châm nào cũng có hai cực: cực dương và cựcâm.',
        'C. Khi bẻ gãy nam châm, ta có thể tách hai cực của nam châm ra khỏi nhau.',
        'D. Các phát biểu A, B, C đều đúng.',
      ],
      answer: 'A. Nam châm là những vật có từ tính.',
    },
    {
      id: 'vl-tn-5',
      topicId: 'physics-magnet',
      prompt:
        'Chọn câu trả lời đúng. Vị trí nào trên thanh nam châm hút sắt mạnh nhất?',
      options: [
        'A. Phần giữa của thanh',
        'B. Chỉ có từ cực Bắc',
        'C. Hai từ cực.',
        'D. Mọi chỗ đều hút sắt mạnh như nhau.',
      ],
      answer: 'C. Hai từ cực.',
    },
    {
      id: 'vl-tn-7',
      topicId: 'physics-field',
      prompt: 'Chọn câu trả lời đúng về khái niệm Từ phổ?',
      options: [
        'A. Hình ảnh các mạt nhôm xung quanh nam châm được gọi là từ phổ.',
        'B. Hình ảnh các mạt đồng xung quanh nam châm được gọi là từ phổ.',
        'C. Hình ảnh các mạt sắt xung quanh nam châm được gọi là từ phổ.',
        'D. Hình ảnh các mạt bạc xung quanh nam châm được gọi là từ phổ.',
      ],
      answer: 'C. Hình ảnh các mạt sắt xung quanh nam châm được gọi là từ phổ.',
    },
    {
      id: 'vl-tn-9',
      topicId: 'physics-field',
      prompt:
        'Đường sức từ là những đường cong có chiều nhất định. Ở bên ngoài thanh nam châm, chiều của đường sức từ được vẽ theo quy ước sao cho:',
      options: [
        'A. có chiều đi ra cực Bắc và đi vào cực Nam của thanh nam châm.',
        'B. có độ mau thưa tùy ý.',
        'C. có chiều đi vào cực Bắc và đi ra khỏi cực Nam của thanh nam châm.',
        'D. bắt đầu từ cực này và kết thúcở cực kia của nam châm.',
      ],
      answer: 'A. có chiều đi ra cực Bắc và đi vào cực Nam của thanh nam châm.',
    },
    {
      id: 'vl-tn-12',
      topicId: 'physics-field',
      prompt:
        'Chọn từ thích hợp điền vào chỗ trống: 3 Vùng không gian bao quanh một nam châm (hoặc dây dẫn mang dòng điện), mà vật liệu có tính chất từ đặt trong nó chịu tác dụng lực từ, được gọi là ................',
      options: [
        'A. lực từ.',
        'B. từ trường.',
        'C. đường sức từ.',
        'D. từ phổ.',
      ],
      answer: 'B. từ trường.',
    },
    {
      id: 'vl-tn-14',
      topicId: 'physics-field',
      prompt: 'Từ trường tồn tại ở đâu?',
      options: [
        'A. Xung quanh nam châm.',
        'B. Xung quanh dây dẫn bất kỳ.',
        'C. Xung quanh điện tích đứng yên.',
        'D. Xung quanh vật liệu từ.',
      ],
      answer: 'A. Xung quanh nam châm.',
    },
    {
      id: 'sh-tn-1',
      topicId: 'biology-photosynthesis',
      prompt:
        'Quá trình cơ thể lấy các chất cần thiết từ môi trường (như nước, khí oxygen, chất dinh dưỡng…) và thải các chất không cần thiết (như khí carbon dioxide, chất cặn bã,…) ra ngoài môi trường là quá trình',
      options: [
        'A. trao đổi chất giữa cơ thể với môi trường.',
        'B. trao đổi chất giữa tế bào với môi trường.',
        'C. trao đổi chất giữa tế bào với tế bào khác.',
        'D. trao đổi chất giữa cơ thể với cơ thể khác.',
      ],
      answer: 'A. trao đổi chất giữa cơ thể với môi trường.',
    },
    {
      id: 'sh-tn-4',
      topicId: 'biology-photosynthesis',
      prompt:
        'Chất nào sau đây là sản phẩm của quá trình trao đổi chất được động vật thải ra môi trường?',
      options: [
        'A. Oxygen.',
        'B. Carbon dioxide.',
        'C. Chất dinh dưỡng.',
        'D. Vitamin.',
      ],
      answer: 'B. Carbon dioxide.',
    },
    {
      id: 'sh-tn-6-updated',
      type: 'statement_count',
      topicId: 'biology-photosynthesis',
      prompt:
        'Cho các yếu tố sau:<br/><br/><em>Số yếu tố ảnh hưởng đến quang hợp ở thực vật là:</em>',
      statements: [
        '(1) Ánh sáng',
        '(2) Nước',
        '(3) Hàm lượng carbon dioxide',
        '(4) Nhiệt độ',
      ],
      options: ['A. 1', 'B. 2', 'C. 3', 'D. 4'],
      answer: 'D. 4',
      explanation:
        'Chính xác! Cả 4 yếu tố trên đều là những yếu tố môi trường chính tác động đến hiệu suất quang hợp của thực vật.',
    },

    {
      id: 'sh-tn-8',
      type: 'equation_fill',
      topicId: 'biology-photosynthesis',
      question:
        'Sơ đồ phương trình quang hợp:<br>Nước + <b>[__1__]</b> <span style="display: inline-flex; flex-direction: column; align-items: center; vertical-align: bottom; line-height: 1; font-size: 0.8rem; margin: 0 5px;"><span style="color:#d97706">Ánh sáng</span><span style="font-size: 1.5rem; color:#4b5563">&#10230;</span><span style="color:#16a34a">Diệp lục</span></span> <b>[__2__]</b> + Oxygen<br><br>Hãy chọn các từ/cụm từ thích hợp từ ngân hàng từ để điền vào chỗ trống.',
      equation: {
        reactants: [
          { type: 'text', value: 'Nước' },
          { type: 'operator', value: '+' },
          { type: 'slot', id: 'slot1', correctlyMatches: 'Carbon dioxide' },
        ],
        arrows: {
          top: 'Ánh sáng',
          bottom: 'Diệp lục',
        },
        products: [
          { type: 'slot', id: 'slot2', correctlyMatches: 'Chất hữu cơ' },
          { type: 'operator', value: '+' },
          { type: 'text', value: 'Oxygen' },
        ],
      },
      wordBank: [
        'Nitrogen',
        'Khí carbonic',
        'Khí oxygen',
        'Carbon dioxide',
        'Chất vô cơ',
        'Chất hữu cơ',
        'Chất đạm',
      ],
      correctSlots: {
        slot1: 'Carbon dioxide',
        slot2: 'Chất hữu cơ',
      },
      explanation:
        'Trong quá trình quang hợp, thực vật sử dụng năng lượng ánh sáng mặt trời để tổng hợp chất hữu cơ từ Nước và Carbon dioxide, đồng thời giải phóng khí Oxygen.',
    },
    {
      id: 'sh-tn-7',
      topicId: 'biology-photosynthesis',
      prompt:
        'Trong quá trình quang hợp, cây xanh chuyển hoá năng lượng ánh sáng mặt trời thành dạng năng lượng nào sau đây?',
      options: [
        'A. Cơ năng.',
        'B. Quang năng.',
        'C. Hoá năng.',
        'D. Nhiệt năng.',
      ],
      answer: 'C. Hoá năng.',
    },
    {
      id: 'sh-tn-9',
      topicId: 'biology-photosynthesis',
      prompt:
        'Cơ quan chính thực hiện quá trình quang hợp ở thực vật là:',
      options: ['A. rễ cây.', 'B. thân cây.', 'C. lá cây.', 'D. hoa.'],
      answer: 'C. lá cây.',
    },
    {
      id: 'sh-tn-10',
      topicId: 'biology-photosynthesis',
      prompt: 'Phát biểu nào sau đây là đúng?',
      options: [
        'A. Trong quá trình quang hợp, cây hấp thụ khí oxygen để tổng hợp chất hữu cơ.',
        'B. Quang hợp là quá trình sinh vật sử dụng ánh sáng để phân giải chất hữu cơ.',
        'C. Một trong các sản phẩm của quang hợp là khí oxygen.',
        'D. Quang hợp là quá trình sinh lí quan trọng xảy ra trong cơ thể mọi sinh vật.',
      ],
      answer: 'C. Một trong các sản phẩm của quang hợp là khí oxygen.',
    },
    {
      id: 'sh-tn-12',
      topicId: 'biology-photosynthesis',
      prompt: 'Nguyên liệu của quá trình quang hợp gồm',
      options: [
        'A. khí oxygen và glucose.',
        'B. glucose và nước.',
        'C. khí carbon dioxide, nước và năng lượng ánh sáng.',
        'D. khí carbon dioxide và glucose.',
      ],
      answer: 'C. khí carbon dioxide, nước và năng lượng ánh sáng.',
    },
    {
      id: 'sh-tn-18',
      topicId: 'biology-respiration',
      prompt: 'Ở sinh vật nhân thực, quá trình hô hấp diễn ra trong:',
      options: ['A. lục lạp', 'B. ti thể', 'C. không bào', 'D. nhân'],
      answer: 'B. ti thể',
    },
    {
      id: 'sh-tn-19',
      topicId: 'biology-respiration',
      prompt:
        'Loại chất được phân giải chủ yếu trong quá trình hô hấp tế bào là:',
      options: ['A. lipid', 'B. protein', 'C. glucose', 'D. vitamin'],
      answer: 'C. glucose',
    },
    {
      id: 'sh-tn-20',
      topicId: 'biology-respiration',
      prompt:
        'Năng lượng đã được chuyển hoá như thế nào trong quá trình hô hấp?',
      options: [
        'A. Quang năng thành hoá năng',
        'B. Nhiệt năng thành hoá năng',
        'C. Hoá năng thành nhiệt năng',
        'D. Hoá năng thành điện năng',
      ],
      answer: 'C. Hoá năng thành nhiệt năng',
    },
    {
      id: 'sh-tn-21',
      topicId: 'biology-respiration',
      prompt: 'Nguyên liệu tham gia vào quá trình hô hấp tế bào là:',
      options: [
        'A. Glucose, oxygen',
        'B. Glucose, carbon dioxide',
        'C. Carbon dioxide, nước',
        'D. Oxygen, nước',
      ],
      answer: 'A. Glucose, oxygen',
    },
    {
      id: 'sh-tn-23',
      topicId: 'biology-respiration',
      prompt:
        'Oxygen là nguyên liệu tham gia vào quá trình hô hấp. Cường độ hô hấp giảm khi nồng độ oxygen trong không khí giảm xuống dưới:',
      options: ['A. 2%', 'B. 5%', 'C. 10%', 'D. 20%'],
      answer: 'B. 5%',
    },
    {
      id: 'fb-1',
      type: 'fill_blank',
      topicId: 'physics-magnet',
      prompt:
        'Các vật liệu như sắt, thép, cobalt, nickel được gọi chung là vật liệu có [___].',
      options: ['từ tính', 'từ trường', 'điện tích', 'dẫn điện'],
      answer: 'từ tính',
    },
    {
      id: 'sh-tn-5-updated',
      type: 'statement_count',
      topicId: 'biology-photosynthesis',
      prompt:
        'Khi nói về đặc điểm cấu tạo, hình thái của lá phù hợp với chức năng quang hợp, cho các phát biểu sau:',
      statements: [
        '(1) Lá thường có dạng bản dẹt, phiến lá rộng giúp thu nhận được nhiều ánh sáng.',
        '(2) Các tế bào thịt lá chứa nhiều lục lạp giúp hấp thụ và chuyển hóa năng lượng ánh sáng.',
        '(3) Hệ thống gân lá giúp dẫn nước cho quá trình quang hợp và dẫn các sản phẩm quang hợp đến các cơ quan khác.',
        '(4) Biểu bì lá có các khí khổng giúp cho quá trình trao đổi khí và hơi nước trong quang hợp diễn ra dễ dàng.',
        '(5) Ở các mấu thân hoặc cành, lá thường xếp song song và mặt lá thường tạo góc nghiêng với tia sáng mặt trời để thu được nhiều ánh sáng nhất.',
      ],
      options: [
        'A. 2 phát biểu',
        'B. 3 phát biểu',
        'C. 4 phát biểu',
        'D. 5 phát biểu',
      ],
      answer: 'D. 5 phát biểu',
      explanation:
        'Tuyệt vời! Cả 5 phát biểu trên đều đúng và đều là những đặc điểm tiến hoá cấu tạo thích ứng của lá cây.',
    },
    {
      id: 'sh-tn-15-new',
      type: 'true_false',
      topicId: 'biology-photosynthesis',
      prompt: 'Em hãy cho biết các phát biểu sau đây là "Đúng" hay "Sai".',
      statements: [
        {
          text: 'Lục lạp là bào quan thực hiện quá trình quang hợp.',
          answer: true,
        },
        {
          text: 'Quang hợp là một quá trình chỉ diễn ra ở thực vật.',
          answer: false,
          explanation:
            'Sai. Một số vi khuẩn (ví dụ: vi khuẩn lam) và tảo cũng có khả năng quang hợp.',
        },
        {
          text: 'Nguồn quang năng cung cấp năng lượng cho quá trình quang hợp luôn được lấy từ ánh sáng mặt trời.',
          answer: false,
          explanation:
            'Sai. Nguồn sáng có thể lấy từ ánh sáng nhân tạo (đèn LED, đèn huỳnh quang trong nhà kính).',
        },
        {
          text: 'Các lá trên thân và cành thường xếp so le để giúp lá nhận được nhiều ánh sáng nhất.',
          answer: true,
        },
      ],
      explanation:
        'Quang hợp là quá trình lá thu nhận ánh sáng, có thể từ nhiều nguồn và ở nhiều loài sinh vật chứa chất diệp lục.',
    },
    {
      id: 'fb-2',
      type: 'fill_blank',
      topicId: 'physics-magnet',
      prompt:
        'Khi đưa hai cực cùng tên của hai thanh nam châm lại gần nhau, chúng sẽ [___].',
      options: ['đẩy nhau', 'hút nhau', 'không tương tác', 'phóng điện'],
      answer: 'đẩy nhau',
    },
    {
      id: 'fb-3',
      type: 'fill_blank',
      topicId: 'biology-photosynthesis',
      prompt:
        'Quá trình cơ thể lấy các chất từ môi trường và thải các chất cặn bã ra ngoài gọi là [___].',
      options: ['trao đổi chất', 'hô hấp', 'quang hợp', 'bài tiết'],
      answer: 'trao đổi chất',
    },
    {
      id: 'fb-4',
      type: 'fill_blank',
      topicId: 'biology-respiration',
      prompt:
        'Năng lượng ánh sáng trong quang hợp được dự trữ dưới dạng năng lượng [___] trong glucose.',
      options: ['hóa năng', 'quang năng', 'nhiệt năng', 'cơ năng'],
      answer: 'hóa năng',
    },
    {
      id: 'fb-5',
      type: 'fill_blank',
      topicId: 'physics-field',
      prompt: 'Đường sức từ được dùng để biểu diễn [___].',
      options: ['từ trường', 'điện trường', 'từ tính', 'từ phổ'],
      answer: 'từ trường',
    },
    {
      id: 'fb-6',
      type: 'fill_blank',
      topicId: 'biology-photosynthesis',
      prompt:
        'Cơ quan chính thực hiện chức năng quang hợp ở đa số thực vật là [___].',
      options: ['lá cây', 'thân cây', 'rễ cây', 'hoa'],
      answer: 'lá cây',
    },
    {
      id: 'fb-7',
      type: 'fill_blank',
      topicId: 'biology-respiration',
      prompt:
        'Chất hữu cơ chủ yếu được phân giải trong hô hấp tế bào là [___].',
      options: ['glucose', 'protein', 'lipid', 'tinh bột'],
      answer: 'glucose',
    },
    {
      id: 'sb-1',
      type: 'sentence_builder',
      topicId: 'physics-magnet',
      prompt: 'Sắp xếp các cụm từ để hoàn thành câu mô tả cực của nam châm:',
      correctOrder: [
        'Mỗi thanh nam châm',
        'luôn có',
        'hai cực từ',
        'là cực Bắc',
        'và cực Nam.',
      ],
      distractors: ['chỉ có một', 'ba cực từ'],
      explanation: 'Mỗi nam châm luôn có hai cực từ là cực Bắc và cực Nam.',
    },
    {
      id: 'sb-2',
      type: 'sentence_builder',
      topicId: 'physics-magnet',
      prompt: 'Sắp xếp các cụm từ để thành câu đúng về tương tác từ:',
      correctOrder: [
        'Khi đặt gần',
        'hai từ cực',
        'khác tên',
        'của hai nam châm',
        'sẽ hút nhau.',
      ],
      distractors: ['sẽ đẩy nhau.', 'cùng tên'],
      explanation: 'Các cực khác tên thì hút nhau.',
    },
    {
      id: 'sb-3',
      type: 'sentence_builder',
      topicId: 'physics-field',
      prompt: 'Sắp xếp các cụm từ để mô tả chiều của đường sức từ:',
      correctOrder: [
        'Ở bên ngoài',
        'thanh nam châm,',
        'đường sức từ',
        'đi ra từ cực Bắc',
        'và đi vào cực Nam.',
      ],
      distractors: ['đi ra cực Nam', 'bên trong'],
      explanation: 'Chiều đường sức từ theo quy ước là vào Nam, ra Bắc.',
    },
    {
      id: 'sb-4',
      type: 'sentence_builder',
      topicId: 'biology-photosynthesis',
      prompt: 'Trình bày vai trò của khí khổng:',
      correctOrder: [
        'Khí khổng',
        'có khả năng',
        'đóng mở linh hoạt',
        'để thực hiện',
        'trao đổi khí.',
      ],
      distractors: ['hút nước', 'tạo ra ánh sáng'],
      explanation: 'Khí khổng trao đổi khí và thoát hơi nước.',
    },
    {
      id: 'sb-5',
      type: 'sentence_builder',
      topicId: 'biology-photosynthesis',
      prompt: 'Giải thích vì sao phiến lá thường mỏng và rộng:',
      correctOrder: [
        'Phiến lá',
        'thường rộng',
        'giúp hấp thụ',
        'tối đa',
        'ánh sáng mặt trời.',
      ],
      distractors: ['nước và muối.', 'gây cản trở'],
      explanation:
        'Diện tích bề mặt lớn giúp lá hấp thụ nhiều ánh sáng phục vụ quang hợp.',
    },
    {
      id: 'sb-6',
      type: 'sentence_builder',
      topicId: 'biology-respiration',
      prompt: 'Ghép các cụm từ để mô tả hô hấp tế bào:',
      correctOrder: [
        'Hô hấp tế bào',
        'diễn ra',
        'chủ yếu',
        'ở bào quan',
        'ti thể.',
      ],
      distractors: ['lục lạp.', 'nhân tế bào.'],
      explanation: 'Hô hấp tế bào tạo năng lượng diễn ra tại ti thể.',
    },
    {
      id: 'sb-7',
      type: 'sentence_builder',
      topicId: 'biology-respiration',
      prompt: 'Ban đêm cây hô hấp như thế nào?',
      correctOrder: [
        'Vào ban đêm,',
        'cây xanh',
        'ngừng quang hợp',
        'nhưng vẫn',
        'hô hấp.',
      ],
      distractors: ['ngừng hô hấp', 'để lấy carbon dioxide.'],
      explanation:
        'Ban đêm không có ánh sáng nên cây ngừng quang hợp nhưng vẫn hô hấp liên tục.',
    },
    {
      id: 'sb-8',
      type: 'sentence_builder',
      topicId: 'biology-respiration',
      prompt: 'Sắp xếp để giải thích lợi ích của việc cày bừa đất:',
      correctOrder: [
        'Cày bừa',
        'làm đất tơi xốp,',
        'giúp rễ cây',
        'nhận đủ oxygen',
        'để hô hấp.',
      ],
      distractors: ['thiếu oxygen', 'ngừng lớn lên.'],
      explanation:
        'Đất tơi xốp chứa nhiều không khí cung cấp oxygen cho hô hấp của rễ.',
    },
  ],
}
