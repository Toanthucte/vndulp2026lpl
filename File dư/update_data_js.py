js_content = """// js/data.js
const appData = {
  popularTags: ["Nhức đầu", "Mất ngủ", "Đau mỏi vai gáy", "Cứng gáy", "Chóng mặt", "Đau lưng"],
  diseases: [
    {
      id: "nhuc-dinh-dau",
      category: "CÁC BỆNH VỀ ĐẦU, MẶT, CỔ / GÁY",
      title: "Nhức đỉnh đầu",
      keywords: ["nhuc dau", "nhuc dinh dau", "dau dau", "roi loan chuc nang gan", "gan"],
      treatment: {
        image: "./image - Ý tưởng app/Bài kiểm tra/placeholder.jpg", // Update actual image path if found in /image
        instructions: "<p><b>Hội chứng của gan. Cách khám và điều trị:</b></p><p>Xoa nắn mắt thứ nhất ngón chân cái (gần móng chân).</p>"
      },
      symptoms: "<p>Đau buốt vùng đỉnh đầu, có thể kèm theo cảm giác nhức mỏi chân tay. Liên quan đến huyệt đạo phản chiếu của gan.</p>",
      videos: []
    },
    {
      id: "nhuc-nua-dau",
      category: "CÁC BỆNH VỀ ĐẦU, MẶT, CỔ / GÁY",
      title: "Nhức nửa đầu (Thiên đầu thống)",
      keywords: ["nhuc dau", "nhuc nua dau", "dau nua dau", "migraine", "thien dau thong"],
      treatment: {
        image: "./image - Ý tưởng app/Bài kiểm tra/placeholder.jpg",
        instructions: "<p><b>Hội chứng của gan, mật. Cách khám và điều trị:</b></p><ul><li><b>Trường hợp do gan:</b> Khám 2 ngón tay giữa từ khớp ngón tay và bàn tay ra đầu ngón.</li><li><b>Trường hợp do tỳ vị:</b> Điểm tiếp giáp giữa đáy xương bả vai và cơ nách.</li></ul>"
      },
      symptoms: "<p>Đau ở một bên đầu (Migraine headache), thường xuyên bị giật từng cơn.</p>",
      videos: []
    },
    {
      id: "dau-dau-o-tran",
      category: "CÁC BỆNH VỀ ĐẦU, MẶT, CỔ / GÁY",
      title: "Nhức đầu ở trán",
      keywords: ["dau dau", "nhuc dau", "nhuc dau o tran", "dau tran"],
      treatment: {
        image: "",
        instructions: "<p>Cạo hoặc day ấn nhẹ vùng phản chiếu trên đầu ngón tay cái và ngón chân cái.</p>"
      },
      symptoms: "<p>Nhức vùng trán, do căng thẳng mệt mỏi hoặc rối loạn tiêu hóa.</p>",
      videos: []
    },
    {
      id: "cung-gay-veo-co",
      category: "CÁC BỆNH VỀ ĐẦU, MẶT, CỔ / GÁY",
      title: "Cứng gáy, Vẹo cổ",
      keywords: ["cung gay", "veo co", "dau vai gay", "dau co"],
      treatment: {
        image: "",
        instructions: "<p><b>Cách 1:</b> Chà ấm lườn cổ tay, hoặc các điểm phản chiếu gáy trên tay.</p><p><b>Cách 2:</b> Dùng cạnh bàn tay chà xát vào phần gáy nơi bị cứng.</p>"
      },
      symptoms: "<p>Sáng ngủ dậy quay cổ khó khăn, đau buốt vùng gáy cổ.</p>",
      videos: []
    }
  ]
};
"""

with open(r"d:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl\js\data.js", "w", encoding="utf-8") as f:
    f.write(js_content)
    
print("Updated data.js")
