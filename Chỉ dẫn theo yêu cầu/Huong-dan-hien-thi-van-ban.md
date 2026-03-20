# Hướng Dẫn Định Dạng Văn Bản & Quản Lý DOM trong JavaScript

Tài liệu này tổng hợp các cách dùng thẻ HTML để làm nổi bật từ khóa trong chuỗi dữ liệu (như file `data.js`) và những lưu ý cực kỳ quan trọng khi đưa dữ liệu đó ra giao diện web thông qua các thuộc tính của DOM DOM (JS).

---

## 1. Các Thẻ HTML Phổ Biến Để Làm Nổi Bật (Highlight) Chữ

Khi bạn có một chuỗi văn bản trong JavaScript và muốn một vài từ hiển thị đặc biệt trên giao diện, hãy bọc từ đó lại bằng các thẻ HTML sau:

| Thẻ                   | Mô tả                            | Hiển thị giao diện                     | Ví dụ trong Code string                                                        |
| :-------------------- | :------------------------------- | :------------------------------------- | :----------------------------------------------------------------------------- |
| `<mark>`              | Bôi màu nền (Thường là màu vàng) | <mark>mạt sắt</mark>                   | `"Hình ảnh các <mark>mạt sắt</mark>"`                                          |
| `<strong>` hoặc `<b>` | In đậm (Bold)                    | **mạt sắt**                            | `"Hình ảnh các <strong>mạt sắt</strong>"`                                      |
| `<em>` hoặc `<i>`     | In nghiêng (Italic)              | _mạt sắt_                              | `"Hình ảnh các <em>mạt sắt</em>"`                                              |
| `<u>`                 | Gạch chân (Underline)            | <u>mạt sắt</u>                         | `"Hình ảnh các <u>mạt sắt</u>"`                                                |
| `<span>` (+ CSS)      | Tuỳ biến màu sắc, font chữ tự do | <span style="color:red">mạt sắt</span> | `"Các <span style='color: red; font-weight: bold;'>mạt sắt</span> xung quanh"` |

_(Mẹo: Bạn có thể chèn các thẻ này trực tiếp vào các chuỗi dữ liệu trong cặp dấu ngoặc kép `""` hoặc nháy đơn `''` ở file `js/data.js`)_

---

## 2. Phân Biệt innerHTML, innerText và textContent

Khi bạn đã chèn thẻ HTML vào trong chuỗi dữ liệu (ví dụ: `const text = "Đây là <mark>thẻ</mark>";`), bước tiếp theo là đưa mã đó render lên giao diện HTML.

Cách bạn gọi JavaScript sẽ quyết định việc trình duyệt có "hiểu và chuyển hoá" các thẻ đó hay không.

### 🔴 `innerHTML` (Bắt buộc dùng nếu muốn hiển thị kiểu định dạng)

- **Tác dụng:** Trình duyệt sẽ đọc nguyên văn chuỗi của bạn, "dịch" tất cả các thẻ HTML bên trong (như `<mark>`, `<strong>`, `<br>`, v.v.) và hiển thị định dạng tương ứng rực rỡ lên màn hình thay vì in ra văn bản thô.
- **Ví dụ:** `element.innerHTML = "Đây là <mark>thẻ</mark>";`
  👉 Màn hình hiện: Đây là [chữ `thẻ` được bôi nền vàng].
- **⚠️ Lưu ý bảo mật (XSS):** Chỉ nên dùng `innerHTML` với **dữ liệu do chính bạn tạo ra và kiểm soát** (như dữ liệu tĩnh trong `data.js`). **Tuyệt đối không dùng** `innerHTML` trực tiếp cho những dữ liệu mà người dùng tự nhập vào (ví dụ: ô input nhập tự luận, bình luận), vì kẻ xấu có thể nhập mã độc `<script>tấn công...</script>` gây hại cho hệ thống.

### 🟡 `innerText`

- **Tác dụng:** Chỉ hiển thị **VĂN BẢN THÔ (Plain Text)**. Nó bỏ qua mọi công dụng của thẻ HTML. Các thẻ đó sẽ bị in thẳng ra màn hình dưới dạng chữ bình thường. Ngoài ra, `innerText` sẽ đọc cấu trúc phong cách CSS, nên nếu một phần tử HTML đang bị ẩn (`display: none`), nó sẽ không lấy được văn bản ở phần tử đó.
- **Ví dụ:** `element.innerText = "Đây là <mark>thẻ</mark>";`
  👉 Màn hình hiện nguyên xi dòng chữ có chứa cả dấu ngoặc: `Đây là <mark>thẻ</mark>`. (Các thẻ không bị dịch thành màu vàng).

### 🟢 `textContent`

- **Tác dụng:** Rất giống `innerText`, nó cũng chỉ xuất ra văn bản thô, in hiện cả các thẻ HTML ra màn hình. Sự khác biệt tinh tế là nó lấy mọi "text" bên trong node mà không quan tâm đến CSS (kể cả chữ đang bị ẩn đi nó vẫn lấy được). Hiệu suất chạy của `textContent` nhanh hơn `innerText`.
- **Ví dụ:** `element.textContent = "Đây là <mark>thẻ</mark>";`
  👉 Màn hình hiện nguyên chữ: `Đây là <mark>thẻ</mark>`.

---

## 📌 Bảng Tổng Kết (Best Practice):

1. **Khi dữ liệu (như Câu hỏi, Flashcard) CÓ CHỨA các thẻ HTML** (`<mark>`, `<b>`, `<br/>`...):
   👉 Cần render? Bắt buộc gán qua `.innerHTML`.
2. **Khi dữ liệu CHỈ LÀ CHỮ BÌNH THƯỜNG**, hoặc bạn muốn đổ dữ liệu từ ô Input của người dùng ra màn hình:
   👉 Ưu tiên dùng `.textContent` (hoặc `.innerText`) để trình duyệt chạy nhanh hơn và chống các lỗ hổng bảo mật.
