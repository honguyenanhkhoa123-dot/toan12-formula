# 📐 TOÁN 12 PRO — Sổ Tay & Luyện Nhớ Full Công Thức Toán 12

Ứng dụng web học tập dạng **TikTok Math Reels**: vuốt từng công thức như xem reel, kết hợp sổ tay tra cứu, flashcard 3D và trắc nghiệm phản xạ.

Thiết kế theo chất liệu **"Vở ô ly & bút đỏ"**: nền là tờ giấy vở có lưới ô ly, lằn đỏ lề vở, mực bút bi, bút đỏ của giáo viên và bút dạ quang. Tối ưu cho mobile (iOS Safari có tai thỏ & home indicator), chạy offline, không cần build, tương thích 100% với **GitHub Pages**.

---

## 🌟 Tính Năng Nổi Bật

### 1. 🎬 Trang chủ — Math Reels (mặc định khi mở app)
- Mỗi công thức là **một card toàn màn hình**, cuộn dạng snap (`scroll-snap-type: y mandatory`) — vuốt lên/xuống mượt như TikTok/Reels.
- **Thanh tương tác dọc bên phải** (nét chì, không kính mờ): Lưu · Bình luận · Chia sẻ story · Nhạc nền.
- **Double-tap để lưu** công thức, kèm hiệu ứng tim bay.
- Card được trộn nhiều dạng:
  - **Công thức** — badge chuyên đề, công thức KaTeX căn giữa, hộp "💡 Mẹo nhớ nhanh".
  - **Bẫy thường gặp** — box đỏ "✕ Cách làm sai" đối chiếu box xanh "✓ Cách làm đúng".
  - **Thử thách 10 giây** — 4 đáp án A–D kèm thanh đếm ngược, chấm đúng/sai tại chỗ.
  - **Mẹo máy tính Casio** — tuyệt kỹ bấm máy giải nhanh.
- Lọc nhanh theo chuyên đề bằng dropdown dạng pill trên header.

### 2. 📖 Tra cứu — Sổ tay công thức
- 39 công thức đầy đủ 8 chuyên đề trọng tâm, render bằng **KaTeX**.
- Tìm kiếm tức thời theo tên, mô tả, ký hiệu, mẹo nhớ.
- Lọc trạng thái: Tất cả · Chưa thuộc · Đã thuộc · Đã lưu.
- Đánh dấu **Đã thuộc**, **Lưu yêu thích**, **Sao chép mã LaTeX**.
- Công thức quá dài tự **thu vừa bề rộng màn hình**; nếu vẫn không đủ thì chuyển sang cuộn ngang có chỉ báo mờ ở mép phải (không bao giờ cắt cụt nội dung).

### 3. 🎴 Flashcard 3D
- Mặt trước câu hỏi, chạm để lật thẻ 3D (`preserve-3d`).
- Vuốt ngang hoặc dùng phím điều hướng để đổi thẻ.
- Lọc theo từng chương, đánh dấu **Đã thuộc / Chưa nhớ**.

### 4. 🧠 Luyện tập — Trắc nghiệm phản xạ
- Mỗi câu có **thanh đếm ngược 30 giây** mảnh phía trên.
- Đúng/sai tô màu trực tiếp trên đáp án + khối giải thích chi tiết có công thức.
- Tính điểm, đếm chuỗi đúng, làm đề mới.

### 5. 👤 Tài khoản
- Vòng tiến độ tổng, cấp bậc (Tân binh → Bậc thầy công thức).
- Thống kê: đã thuộc · tổng công thức · đã lưu · chuỗi tốt nhất.
- Cài đặt giao diện Sáng/Tối và âm thanh phản hồi.
- **Xuất tệp sao lưu** tiến độ (.json) và **xoá toàn bộ tiến độ**.

---

## 🎨 Hệ Thống Thiết Kế

| Thành phần | Giá trị |
|---|---|
| Nền vở | `#0E141F` (học đêm) · `#EFF3F8` (giấy trắng-xanh) — cố ý **không** dùng kem `#F4F1EA` |
| Kết cấu | Lưới ô ly 20px + lằn đỏ lề vở ở 44px (nội dung bắt đầu 52px) |
| Nhấn chính | `#7FB3FF` (bút bi xanh) · `#1D4ED8` (mực bút bi) |
| Mực xanh lá — "đúng" | `#3DBE7C` · `#16803C` |
| Bút đỏ — "bẫy" & "đã lưu" | `#F0574F` · `#C42B22` |
| Dạ quang — "Mẹo nhớ nhanh" | `#F5D547` (vệt highlight trên đúng một nhãn) |
| Chữ | `#E9EEF7` / phụ `#A6B3C6` · mực `#10182B` / phụ `#4A5568` |
| Bo góc | 6 → 18px (giấy vở không bo tròn); pill 999px chỉ còn ở chip nhỏ |
| Font | Be Vietnam Pro (đủ dấu tiếng Việt) · JetBrains Mono (số & công thức) |

**Kỹ thuật quan trọng:**
- `env(safe-area-inset-*)` cho cả 4 cạnh → nội dung không bao giờ bị tai thỏ hay home indicator đè.
- `100dvh` xử lý thanh địa chỉ động của iOS Safari.
- Ô input đặt `font-size: 16px` để iOS Safari không tự zoom khi focus.
- `backdrop-filter: blur()` cho header, bottom nav, bottom sheet và thanh tương tác.
- KaTeX chỉ render khi card vào khung nhìn (`IntersectionObserver`) → nhẹ CPU trên mobile.
- Comment của người dùng được escape khi render → chống XSS.

---

## 📂 Cấu Trúc

```
index.html        # Khung app: header · 5 tab · bottom nav · bottom sheet · modal story
style.css         # Design system: tokens → reset → primitives → từng màn hình → responsive
app.js            # Toàn bộ logic: state, KaTeX, 5 tab, reels engine, audio, localStorage
data.js           # Dữ liệu: CHAPTERS (9) + FORMULAS_DATA (39 công thức, mỗi cái 1 quiz)
test_dataset.js   # Script kiểm tra dữ liệu: node test_dataset.js
```

---

## 🧪 Kiểm Tra Dữ Liệu

```bash
node test_dataset.js
```

Kiểm tra: ID trùng lặp, công thức thiếu quiz, đáp án sai chỉ số, ngoặc `{}` lệch trong LaTeX,
số dấu `$` lẻ (khiến KaTeX bỏ qua và để lại LaTeX thô) và lỗi mất dấu `\` trong chuỗi LaTeX.

---

## 🚀 Đưa Lên GitHub Pages (1 Phút)

Ứng dụng là **static web thuần (HTML/CSS/JS)**, không cần Node.js hay build server.

### Bước 1: Tạo Repository
Vào [github.com/new](https://github.com/new), đặt tên (ví dụ `toan12-formula`), chọn **Public** → **Create repository**.

### Bước 2: Đẩy mã nguồn lên
Mở PowerShell/Terminal tại thư mục dự án:

```bash
git init
git add .
git commit -m "Full Cong Thuc Toan 12 App"
git branch -M main
git remote add origin https://github.com/TEN_GITHUB_CUA_BAN/toan12-formula.git
git push -u origin main
```

### Bước 3: Kích hoạt GitHub Pages
**Settings → Pages → Build and deployment → Branch: `main` (`/root`)** → **Save**.

🎉 Sau ~1 phút bạn có link dạng:
`https://TEN_GITHUB_CUA_BAN.github.io/toan12-formula/`

Gửi link cho bạn bè là mở được ngay trên điện thoại hoặc máy tính.

---

## 💡 Mẹo Dùng Trên Điện Thoại

- **Chụp Story:** mở card → bấm biểu tượng ảnh ở thanh phải → dùng nút chụp màn hình của điện thoại để lưu ảnh 9:16.
- **Thêm vào màn hình chính:** Safari → nút Chia sẻ → *Thêm vào Màn hình chính* để chạy như app thật (đã có `apple-mobile-web-app-capable`).
- **Tiến độ** lưu trong `localStorage` của trình duyệt — không gửi lên máy chủ nào. Đổi máy thì dùng *Xuất tệp sao lưu* ở tab Tài khoản.
