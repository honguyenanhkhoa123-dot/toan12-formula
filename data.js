/**
 * MASTER DATABASE - FULL CÔNG THỨC TOÁN 12 (CHUẨN BỘ GD & ĐỀ THI TỐT NGHIỆP THPT)
 * Trích xuất từ tài liệu "FULL CÔNG THỨC TOÁN 12" & Hệ thống công thức giải nhanh trọng tâm
 */

const CHAPTERS = [
  {
    "id": "all",
    "name": "Tất cả",
    "icon": "✨",
    "count": 0
  },
  {
    "id": "ham-so",
    "name": "1. Khảo Sát Hàm Số",
    "icon": "📈",
    "count": 0
  },
  {
    "id": "mu-logarit",
    "name": "2. Mũ & Logarit",
    "icon": "⚡",
    "count": 0
  },
  {
    "id": "tich-phan",
    "name": "3. Nguyên Hàm & Tích Phân",
    "icon": "∫",
    "count": 0
  },
  {
    "id": "so-phuc",
    "name": "4. Số Phức",
    "icon": "🔢",
    "count": 0
  },
  {
    "id": "khoi-da-dien",
    "name": "5. Thể Tích Đa Diện",
    "icon": "📐",
    "count": 0
  },
  {
    "id": "khoi-tron-xoay",
    "name": "6. Khối Tròn Xoay & Cầu",
    "icon": "🔮",
    "count": 0
  },
  {
    "id": "oxyz",
    "name": "7. Tọa Độ Oxyz",
    "icon": "🌐",
    "count": 0
  },
  {
    "id": "cap-so",
    "name": "8. Dãy Số & Xác Suất",
    "icon": "🎲",
    "count": 0
  }
];

const FORMULAS_DATA = [
  {
    "id": "hs-01",
    "chapter": "ham-so",
    "chapterName": "Khảo sát hàm số",
    "title": "Đạo hàm các hàm số cơ bản & hàm hợp",
    "latex": "(x^\\alpha)' = \\alpha x^{\\alpha - 1} \\quad \\Longleftrightarrow \\quad (u^\\alpha)' = \\alpha u^{\\alpha - 1} \\cdot u' \\\\\n(\\sqrt{x})' = \\frac{1}{2\\sqrt{x}} \\quad \\Longleftrightarrow \\quad (\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}} \\\\\n\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2} \\quad \\Longleftrightarrow \\quad \\left(\\frac{1}{u}\\right)' = -\\frac{u'}{u^2}",
    "desc": "Bảng đạo hàm lũy thừa và phân thức cơ bản nhất bắt buộc phải thuộc.",
    "variables": "u = u(x) là hàm số theo biến x; $\\alpha \\in \\mathbb{R}$.",
    "mnemonic": "💡 Mẹo nhớ: Hàm hợp luôn nhân thêm u' (u phẩy) ở đuôi! Căn bậc hai đạo hàm bằng u phẩy trên 2 căn u.",
    "quiz": {
      "q": "Đạo hàm của hàm số $y = \\sqrt{2x + 1}$ là gì?",
      "options": [
        "$\\frac{1}{2\\sqrt{2x+1}}$",
        "$\\frac{1}{\\sqrt{2x+1}}$",
        "$\\frac{2}{\\sqrt{2x+1}}$",
        "$\\frac{x}{\\sqrt{2x+1}}$"
      ],
      "correct": 1,
      "explain": "Áp dụng công thức: $(\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}} = \\frac{(2x+1)'}{2\\sqrt{2x+1}} = \\frac{1}{\\sqrt{2x+1}}."
    }
  },
  {
    "id": "hs-02",
    "chapter": "ham-so",
    "chapterName": "Khảo sát hàm số",
    "title": "Đạo hàm các hàm lượng giác",
    "latex": "(\\sin x)' = \\cos x \\quad ; \\quad (\\cos x)' = -\\sin x \\\\\n(\\tan x)' = \\frac{1}{\\cos^2 x} = 1 + \\tan^2 x \\\\\n(\\cot x)' = -\\frac{1}{\\sin^2 x} = -(1 + \\cot^2 x)",
    "desc": "Đạo hàm 4 hàm lượng giác cơ bản và hệ thức tương đương.",
    "variables": "x tính theo đơn vị radian.",
    "mnemonic": "💡 Khẩu quyết: Sin thì ra Cos, Cos ra Trừ Sin. Tan là 1 trên Cos bình, Cot là Trừ 1 trên Sin bình.",
    "quiz": {
      "q": "Đạo hàm của hàm số $y = \\cos(3x)$ bằng bao nhiêu?",
      "options": [
        "$3\\sin(3x)$",
        "$-\\sin(3x)$",
        "$-3\\sin(3x)$",
        "$-\\frac{1}{3}\\sin(3x)$"
      ],
      "correct": 2,
      "explain": "Ta có $(\\cos u)' = -u' \\cdot \\sin u = -(3x)' \\sin(3x) = -3\\sin(3x)."
    }
  },
  {
    "id": "hs-03",
    "chapter": "ham-so",
    "chapterName": "Khảo sát hàm số",
    "title": "Cực trị & Điểm uốn của hàm số bậc ba",
    "latex": "y = ax^3 + bx^2 + cx + d \\quad (a \\neq 0) \\\\\ny' = 3ax^2 + 2bx + c \\quad ; \\quad \\Delta_{y'} = b^2 - 3ac \\\\\n\\begin{cases}\n\\Delta_{y'} > 0: \\text{Hàm số có 2 điểm cực trị} \\\\\n\\Delta_{y'} \\le 0: \\text{Hàm số không có cực trị (đơn điệu trên } \\mathbb{R})\n\\end{cases}",
    "desc": "Điều kiện cực trị của hàm bậc 3 dựa vào dấu của biệt thức đạo hàm.",
    "variables": "Đồ thị luôn nhận điểm uốn $U(x_0; y_0)$ với $x_0 = -\\frac{b}{3a}$ làm tâm đối xứng.",
    "mnemonic": "💡 Mẹo nhớ: Hàm bậc ba chỉ có 2 cực trị (khi $b^2 - 3ac > 0$) hoặc KHÔNG có cực trị nào. Tuyệt đối không bao giờ có 1 cực trị!",
    "quiz": {
      "q": "Hàm số bậc ba $y = ax^3 + bx^2 + cx + d$ có 2 cực trị khi và chỉ khi:",
      "options": [
        "b^2 - 3ac < 0",
        "b^2 - 3ac > 0",
        "b^2 - 4ac > 0",
        "b^2 - 3ac = 0"
      ],
      "correct": 1,
      "explain": "Phương trình $y' = 0$ có 2 nghiệm phân biệt khi $\\Delta' = b^2 - 3ac > 0$."
    }
  },
  {
    "id": "hs-04",
    "chapter": "ham-so",
    "chapterName": "Khảo sát hàm số",
    "title": "Đồ thị & Tiệm cận hàm phân thức bậc nhất $y = \\frac{ax+b}{cx+d}$",
    "latex": "y = \\frac{ax+b}{cx+d} \\quad (ad - bc \\neq 0, c \\neq 0) \\\\\ny' = \\frac{ad - bc}{(cx + d)^2} \\\\\n\\text{Tiệm cận đứng: } x = -\\frac{d}{c} \\quad ; \\quad \\text{Tiệm cận ngang: } y = \\frac{a}{c} \\\\\n\\text{Tâm đối xứng: } I\\left(-\\frac{d}{c}; \\frac{a}{c}\\right)",
    "desc": "Hàm số nhất biến luôn đồng biến hoặc nghịch biến trên từng khoảng xác định.",
    "variables": "Nếu $ad - bc > 0$: Hàm số đồng biến; nếu $ad - bc < 0$: Hàm số nghịch biến.",
    "mnemonic": "💡 Mẹo nhớ: Tích đường chéo chính trừ chéo phụ: a · d - b · c (tức $ad - bc$). Đứng: cho mẫu bằng 0. Ngang: lấy hai hệ số trước x chia nhau ($y = a/c$).",
    "quiz": {
      "q": "Tiệm cận ngang của đồ thị hàm số $y = \\frac{2x - 1}{x + 3}$ là:",
      "options": [
        "y = -3",
        "x = -3",
        "y = 2",
        "x = 2"
      ],
      "correct": 2,
      "explain": "Tiệm cận ngang là đường thẳng $y = \\frac{a}{c} = \\frac{2}{1} = 2$."
    }
  },
  {
    "id": "hs-05",
    "chapter": "ham-so",
    "chapterName": "Khảo sát hàm số",
    "title": "Giải nhanh cực trị hàm trùng phương $y = ax^4 + bx^2 + c$",
    "latex": "\\text{Có 3 cực trị } A(0;c), B, C \\iff ab < 0 \\\\\n\\bullet \\text{ } \\triangle ABC \\text{ vuông cân tại } A \\iff b^3 + 8a = 0 \\\\\n\\bullet \\text{ } \\triangle ABC \\text{ đều } \\iff b^3 + 24a = 0 \\\\\n\\bullet \\text{ Diện tích } S_0: \\quad 32a^3 S_0^2 + b^5 = 0 \\quad (b < 0, a > 0) \\\\\n\\bullet \\text{ Trọng tâm } O: \\quad b^2 = 6ac \\\\\n\\bullet \\text{ Trực tâm } O: \\quad b^3 + 8a - 4ac = 0",
    "desc": "Các công thức tính nhanh đặc biệt giúp xử lý câu trắc nghiệm 30 giây.",
    "variables": "Điểm cực trị $A(0; c)$ thuộc Oy, hai điểm $B$ và $C$ đối xứng nhau qua trục Oy.",
    "mnemonic": "💡 Mẹo nhớ: Tam giác vuông cân gắn với 8a (b mũ 3: $b^3 + 8a = 0$), tam giác đều gắn với 24a (b mũ 3: $b^3 + 24a = 0$). Luôn nhớ lũy thừa là b mũ 3 ($b^3$) chứ không phải b bình phương!",
    "quiz": {
      "q": "Tìm $m$ để đồ thị hàm số $y = x^4 - 2mx^2 + 1$ có 3 điểm cực trị tạo thành tam giác vuông cân:",
      "options": [
        "m = 1",
        "m = 2",
        "$m = \\sqrt{2}$",
        "m = 0"
      ],
      "correct": 0,
      "explain": "Hàm số có $a = 1, b = -2m$. Điều kiện 3 cực trị: $ab < 0 \\iff m > 0$. Tam giác vuông cân khi b mũ 3 cộng 8a bằng 0: $b^3 + 8a = 0 \\iff (-2m)^3 + 8(1) = 0 \\iff -8m^3 + 8 = 0 \\iff m = 1$."
    }
  },
  {
    "id": "hs-06",
    "chapter": "ham-so",
    "chapterName": "Khảo sát hàm số",
    "title": "Biến đổi đồ thị chứa dấu giá trị tuyệt đối",
    "latex": "(C_1): y = |f(x)| \\implies \\begin{cases} \\text{Giữ nguyên phần đồ thị } f(x) \\ge 0 \\text{ (trên Ox)} \\\\ \\text{Lấy đối xứng phần dưới Ox lên trên qua Ox} \\end{cases} \\\\[6pt]\n(C_2): y = f(|x|) \\implies \\begin{cases} \\text{Giữ nguyên phần đồ thị bên phải Oy } (x \\ge 0) \\\\ \\text{Bỏ phần bên trái Oy, lấy đối xứng phần giữ qua Oy} \\end{cases}",
    "desc": "Quy tắc suy đồ thị chứa dấu trị tuyệt đối toàn phần và trị tuyệt đối của biến.",
    "variables": "Đồ thị y = f(|x|) luôn nhận trục tung Oy làm trục đối xứng (hàm số chẵn).",
    "mnemonic": "💡 Mẹo nhớ: Trị ngoài (cả hàm) lật dưới lên trên. Trị trong (chỉ có x) bỏ trái lật phải sang.",
    "quiz": {
      "q": "Đồ thị hàm số $y = f(|x|)$ có đặc điểm đối xứng nào?",
      "options": [
        "Đối xứng qua gốc tọa độ O",
        "Đối xứng qua trục hoành Ox",
        "Đối xứng qua trục tung Oy",
        "Không có tâm hay trục đối xứng"
      ],
      "correct": 2,
      "explain": "Vì $f(|-x|) = f(|x|)$ nên $y = f(|x|)$ là hàm số chẵn, đồ thị luôn đối xứng qua trục Oy."
    }
  },
  {
    "id": "mu-01",
    "chapter": "mu-logarit",
    "chapterName": "Mũ & Logarit",
    "title": "Các công thức biến đổi Logarit cơ bản & nâng cao",
    "latex": "\\log_a(xy) = \\log_a x + \\log_a y \\quad ; \\quad \\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y \\\\\n\\log_a(x^\\alpha) = \\alpha \\log_a x \\quad ; \\quad \\log_{a^\\beta} x = \\frac{1}{\\beta} \\log_a x \\\\\n\\log_a b \\cdot \\log_b c = \\log_a c \\quad ; \\quad \\log_a b = \\frac{1}{\\log_b a} \\\\\na^{\\log_a b} = b \\quad ; \\quad a^{\\log_c b} = b^{\\log_c a}",
    "desc": "Điều kiện: Cơ số $0 < a, b, c \\neq 1$; các biểu thức lấy logarit phải dương ($> 0$).",
    "variables": "Số $e \\approx 2.71828$; $\\ln x = \\log_e x$; $\\log x = \\log_{10} x$.",
    "mnemonic": "💡 Khẩu quyết: Log tích thành tổng, Log thương thành hiệu. Mũ trên bay ra trước, mũ dưới bay ra mẫu.",
    "quiz": {
      "q": "Biểu thức $\\log_2 8 + \\log_3 \\sqrt{3}$ có giá trị bằng:",
      "options": [
        "3.5",
        "4",
        "3",
        "2.5"
      ],
      "correct": 0,
      "explain": "Ta có $\\log_2 8 = \\log_2 2^3 = 3$ và $\\log_3 \\sqrt{3} = 0.5 \\implies 3 + 0.5 = 3.5."
    }
  },
  {
    "id": "mu-02",
    "chapter": "mu-logarit",
    "chapterName": "Mũ & Logarit",
    "title": "Đạo hàm của hàm số Mũ và Logarit",
    "latex": "(e^x)' = e^x \\quad \\Longleftrightarrow \\quad (e^u)' = u' e^u \\\\\n(a^x)' = a^x \\ln a \\quad \\Longleftrightarrow \\quad (a^u)' = u' a^u \\ln a \\\\\n(\\ln |x|)' = \\frac{1}{x} \\quad \\Longleftrightarrow \\quad (\\ln |u|)' = \\frac{u'}{u} \\\\\n(\\log_a |x|)' = \\frac{1}{x \\ln a} \\quad \\Longleftrightarrow \\quad (\\log_a |u|)' = \\frac{u'}{u \\ln a}",
    "desc": "Đạo hàm hàm số mũ và logarit cho cả biến đơn x và hàm hợp u(x).",
    "variables": "Điều kiện $a > 0, a \\neq 1$; biểu thức $u \\neq 0$.",
    "mnemonic": "💡 Mẹo nhớ: Hàm $e^x$ đạo hàm vẫn là chính nó. $a^x$ thì nhân thêm $\\ln a$. Hàm logarit thì chia cho $\\ln a$ ở mẫu!",
    "quiz": {
      "q": "Đạo hàm của hàm số $y = 3^{2x}$ là:",
      "options": [
        "$2x \\cdot 3^{2x-1}$",
        "$3^{2x} \\ln 3$",
        "$2 \\cdot 3^{2x} \\ln 3$",
        "$\\frac{3^{2x}}{\\ln 3}$"
      ],
      "correct": 2,
      "explain": "$(a^u)' = u' \\cdot a^u \\cdot \\ln a = (2x)' \\cdot 3^{2x} \\cdot \\ln 3 = 2 \\cdot 3^{2x} \\ln 3."
    }
  },
  {
    "id": "mu-03",
    "chapter": "mu-logarit",
    "chapterName": "Mũ & Logarit",
    "title": "Bài toán Lãi suất Ngân hàng (Lãi kép & Gửi góp)",
    "latex": "\\text{1. Lãi kép (gửi 1 lần nhận n kỳ): } S_n = A(1 + r)^n \\\\[4pt]\n\\text{2. Gửi góp hàng tháng (đầu mỗi tháng gửi A): } S_n = \\frac{A}{r}\\left[(1+r)^n - 1\\right](1+r) \\\\[4pt]\n\\text{3. Trả góp (Vay ban đầu P, mỗi tháng trả X): } X = \\frac{P \\cdot r(1+r)^n}{(1+r)^n - 1}",
    "desc": "3 mô hình bài toán tài chính phổ biến nhất trong đề thi THPT QG.",
    "variables": "A: tiền gửi ban đầu; r: lãi suất mỗi kỳ; n: số kỳ hạn; $S_n$: tổng tiền nhận được; P: số tiền vay.",
    "mnemonic": "💡 Mẹo nhớ: Lãi kép đơn giản: A nhân (1+r) mũ n. Gửi góp: có thêm cụm (1+r) ở cuối vì gửi đầu tháng!",
    "quiz": {
      "q": "Bác An gửi 100 triệu vào ngân hàng với lãi suất kép 6%/năm. Sau 3 năm số tiền nhận được là:",
      "options": [
        "$100 \\times (1 + 0.06)^3 \\text{ triệu}$",
        "$100 \\times (1 + 0.18) \\text{ triệu}$",
        "$100 \\times 0.06^3 \\text{ triệu}$",
        "$100 \\times (1 + 0.06 \\times 3) \\text{ triệu}$"
      ],
      "correct": 0,
      "explain": "Áp dụng công thức lãi kép: $S_n = A(1 + r)^n$ với $A = 100$ triệu, $r = 0.06, n = 3$."
    }
  },
  {
    "id": "tp-01",
    "chapter": "tich-phan",
    "chapterName": "Nguyên hàm & Tích phân",
    "title": "Bảng nguyên hàm cơ bản & mở rộng",
    "latex": "\\int x^\\alpha dx = \\frac{x^{\\alpha + 1}}{\\alpha + 1} + C \\quad (\\alpha \\neq -1) \\\\\n\\int \\frac{1}{x} dx = \\ln |x| + C \\quad ; \\quad \\int \\frac{1}{ax+b} dx = \\frac{1}{a} \\ln |ax+b| + C \\\\\n\\int e^x dx = e^x + C \\quad ; \\quad \\int e^{ax+b} dx = \\frac{1}{a} e^{ax+b} + C \\\\\n\\int a^x dx = \\frac{a^x}{\\ln a} + C \\\\\n\\int \\cos x dx = \\sin x + C \\quad ; \\quad \\int \\sin x dx = -\\cos x + C",
    "desc": "Họ nguyên hàm của các hàm lũy thừa, phân thức, mũ và lượng giác.",
    "variables": "C là hằng số tùy ý thuộc R; với f(ax+b) luôn nhân thêm hệ số 1/a.",
    "mnemonic": "💡 Khẩu quyết: Nguyên hàm của Sin là TRỪ Cos, của Cos là CỘNG Sin. Gặp bậc nhất (ax+b) nhớ chia cho hệ số a!",
    "quiz": {
      "q": "Họ nguyên hàm $\\int \\cos(2x + 1) \\, dx$ bằng:",
      "options": [
        "$\\sin(2x+1) + C$",
        "$-\\frac{1}{2}\\sin(2x+1) + C$",
        "$\\frac{1}{2}\\sin(2x+1) + C$",
        "$-2\\sin(2x+1) + C$"
      ],
      "correct": 2,
      "explain": "Ta có $\\int \\cos(ax+b) \\, dx = \\frac{1}{a} \\sin(ax+b) + C$. Với $a = 2$, kết quả là $\\frac{1}{2}\\sin(2x+1) + C$."
    }
  },
  {
    "id": "tp-02",
    "chapter": "tich-phan",
    "chapterName": "Nguyên hàm & Tích phân",
    "title": "Phương pháp tích phân từng phần (Nhất lô, nhì đa, tam lượng, tứ mũ)",
    "latex": "\\int_a^b u \\, dv = u \\cdot v \\Big|_a^b - \\int_a^b v \\, du \\\\[6pt]\n\\text{Thứ tự ưu tiên đặt } u: \\quad \\textbf{Logarit } \\to \\textbf{Đa thức } \\to \\textbf{Lượng giác } \\to \\textbf{Mũ}",
    "desc": "Công thức tích phân từng phần và thứ tự đặt u tối ưu nhất.",
    "variables": "Phần còn lại sau khi chọn u chính là dv. Sau đó tìm $v = \\int dv$ và $du = u' dx$.",
    "mnemonic": "💡 Thần chú: \"Nhất Lô, Nhì Đa, Tam Lượng, Tứ Mũ\" - Thằng nào đứng trước thì đặt là u, còn lại là dv. uv trừ vdu!",
    "quiz": {
      "q": "Khi tính tích phân $I = \\int (2x + 1) e^x \\, dx$ từng phần, ta nên đặt:",
      "options": [
        "u = e^x, dv = (2x+1)dx",
        "u = 2x+1, dv = e^x dx",
        "u = (2x+1)e^x, dv = dx",
        "u = 2, dv = e^x dx"
      ],
      "correct": 1,
      "explain": "Theo thứ tự ưu tiên: \"Nhất lô, Nhì đa, Tam lượng, Tứ mũ\": $(2x+1)$ là đa thức nên đặt $u = 2x+1$, còn lại $dv = e^x \\, dx$."
    }
  },
  {
    "id": "tp-03",
    "chapter": "tich-phan",
    "chapterName": "Nguyên hàm & Tích phân",
    "title": "Ứng dụng tích phân: Diện tích hình phẳng & Thể tích tròn xoay",
    "latex": "\\text{1. Diện tích hình phẳng giới hạn bởi } y = f(x), y = g(x), x = a, x = b: \\\\\nS = \\int_a^b |f(x) - g(x)| \\, dx \\\\[6pt]\n\\text{2. Thể tích khối tròn xoay quanh trục Ox giới hạn bởi } y = f(x), y = 0, x = a, x = b: \\\\\nV = \\pi \\int_a^b [f(x)]^2 \\, dx",
    "desc": "Hai ứng dụng quan trọng bậc nhất trong hình học giải tích tích phân.",
    "variables": "Thể tích tròn xoay luôn có số $\\pi$ ở phía trước và hàm $f(x)$ phải được bình phương $[f(x)]^2$.",
    "mnemonic": "💡 Mẹo nhớ: Diện tích có trị tuyệt đối, Thể tích có số Pi ($\\pi$) và Bình phương ($V = \\pi \\int f^2$). Tuyệt đối không được quên Pi!",
    "quiz": {
      "q": "Thể tích khối tròn xoay tạo thành khi quay hình phẳng giới hạn bởi $y = \\sqrt{x}, y = 0, x = 1, x = 4$ quanh trục Ox là:",
      "options": [
        "$\\int_1^4 \\sqrt{x} dx$",
        "$\\pi \\int_1^4 x \\, dx$",
        "$\\pi \\int_1^4 \\sqrt{x} dx$",
        "$\\int_1^4 x \\, dx$"
      ],
      "correct": 1,
      "explain": "Thể tích $V = \\pi \\int_1^4 (\\sqrt{x})^2 \\, dx = \\pi \\int_1^4 x \\, dx$."
    }
  },
  {
    "id": "sp-01",
    "chapter": "so-phuc",
    "chapterName": "Số phức",
    "title": "Khái niệm, Môđun & Số phức liên hợp",
    "latex": "z = a + bi \\quad (a, b \\in \\mathbb{R}, i^2 = -1) \\\\\n\\text{Phần thực: } a = \\text{Re}(z) \\quad ; \\quad \\text{Phần ảo: } b = \\text{Im}(z) \\\\\n\\text{Số phức liên hợp: } \\bar{z} = a - bi \\\\\n\\text{Môđun số phức: } |z| = \\sqrt{a^2 + b^2} = \\sqrt{z \\cdot \\bar{z}} \\\\\n\\text{Điểm biểu diễn trên mp Oxy: } M(a; b)",
    "desc": "Định nghĩa số phức, điểm biểu diễn và các tính chất môđun cốt lõi.",
    "variables": "i là đơn vị ảo với $i^2 = -1, i^3 = -i, i^4 = 1$.",
    "mnemonic": "💡 Mẹo nhớ: Phần ảo là b, KHÔNG chứa chữ i. Liên hợp là đổi dấu trước i (+bi thành -bi). Môđun giống như định lý Pytago!",
    "quiz": {
      "q": "Cho số phức $z = 3 - 4i$. Môđun $|z|$ và số phức liên hợp $\\bar{z}$ là:",
      "options": [
        "$|z| = 5 ; \\bar{z} = 3 + 4i$",
        "$|z| = 7 ; \\bar{z} = 3 + 4i$",
        "$|z| = 5 ; \\bar{z} = -3 + 4i$",
        "$|z| = 25 ; \\bar{z} = 3 + 4i$"
      ],
      "correct": 0,
      "explain": "Ta có $|z| = \\sqrt{3^2 + (-4)^2} = 5$. Số phức liên hợp $\\bar{z} = 3 + 4i$."
    }
  },
  {
    "id": "sp-02",
    "chapter": "so-phuc",
    "chapterName": "Số phức",
    "title": "Tập hợp điểm biểu diễn số phức thường gặp",
    "latex": "|z - (a + bi)| = R \\implies \\text{Đường tròn tâm } I(a; b), \\text{ bán kính } R \\\\\n|z - z_1| = |z - z_2| \\implies \\text{Đường trung trực của đoạn thẳng } A(z_1)B(z_2) \\\\\n|z - z_1| + |z - z_2| = 2a > |z_1 - z_2| \\implies \\text{Đường Elip nhận } A, B \\text{ làm 2 tiêu điểm}",
    "desc": "Nhận dạng nhanh quỹ tích tập hợp điểm biểu diễn số phức z = x + yi.",
    "variables": "Đặt $z = x + yi$ ($x, y \\in \\mathbb{R}$) rồi thế vào phương trình để tìm quỹ tích.",
    "mnemonic": "💡 Mẹo nhớ: |z - z_0| = R là đường tròn; |z - A| = |z - B| là đường trung trực đoạn AB.",
    "quiz": {
      "q": "Tập hợp các điểm biểu diễn số phức $z$ thỏa mãn $|z - 1 + 2i| = 3$ là:",
      "options": [
        "Đường tròn tâm I(-1; 2), R = 9",
        "Đường tròn tâm I(1; -2), R = 3",
        "Đường thẳng x - 2y = 3",
        "Đường tròn tâm I(-1; 2), R = 3"
      ],
      "correct": 1,
      "explain": "Ta có $|z - (1 - 2i)| = 3 \\implies$ Quỹ tích là đường tròn tâm $I(1; -2)$, bán kính $R = 3$."
    }
  },
  {
    "id": "dd-01",
    "chapter": "khoi-da-dien",
    "chapterName": "Khối đa diện",
    "title": "Thể tích các khối đa diện cơ bản",
    "latex": "\\text{Khối chóp: } V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h \\\\[4pt]\n\\text{Khối lăng trụ: } V = S_{\\text{đáy}} \\cdot h \\\\[4pt]\n\\text{Khối hộp chữ nhật: } V = a \\cdot b \\cdot c \\\\\n\\text{Khối lập phương cạnh a: } V = a^3 \\\\\n\\text{Khối tứ diện đều cạnh a: } V = \\frac{a^3\\sqrt{2}}{12}",
    "desc": "Công thức tính thể tích của tất cả các khối đa diện cơ bản trong SGK.",
    "variables": "h: chiều cao hạ từ đỉnh vuông góc xuống mặt phẳng đáy; S_đáy: diện tích đa giác đáy.",
    "mnemonic": "💡 Mẹo nhớ: Hình có chóp nhọn (chóp, nón) có 1/3. Hình có 2 đáy bằng nhau (lăng trụ, trụ, hộp) KHÔNG có 1/3.",
    "quiz": {
      "q": "Thể tích khối chóp có diện tích đáy $B = 6a^2$ và chiều cao $h = 2a$ là:",
      "options": [
        "12a^3",
        "4a^3",
        "6a^3",
        "2a^3"
      ],
      "correct": 1,
      "explain": "Thể tích khối chóp: $V = \\frac{1}{3} B \\cdot h = \\frac{1}{3} (6a^2)(2a) = 4a^3."
    }
  },
  {
    "id": "dd-02",
    "chapter": "khoi-da-dien",
    "chapterName": "Khối đa diện",
    "title": "Xác định đường cao hình chóp (3 mô hình kinh điển)",
    "latex": "\\textbf{Mô hình 1 (Cạnh bên vuông góc đáy): } \\\\\nSA \\perp (ABCD) \\implies h = SA \\\\[4pt]\n\\textbf{Mô hình 2 (Mặt bên vuông góc đáy): } \\\\\n(SAB) \\perp (ABCD) \\implies h = SH \\text{ với } SH \\perp AB \\\\\n\\textbf{Mô hình 3 (Chóp đều): } \\\\\nS.ABC \\text{ đều} \\implies SO \\perp (ABC) \\text{ với } O \\text{ là trọng tâm đáy}",
    "desc": "Cách nhận diện chân đường cao của hình chóp theo giả thiết đề bài.",
    "variables": "Chân đường cao H là chìa khóa then chốt để tính thể tích và khoảng cách.",
    "mnemonic": "💡 Mẹo nhớ: Cạnh bên vuông đáy hạ tại điểm đó; Mặt bên vuông đáy hạ vào giao tuyến; Chóp đều hạ ngay trọng tâm đáy!",
    "quiz": {
      "q": "Cho hình chóp S.ABC có tam giác SAB đều nằm trong mặt phẳng vuông góc với đáy. Chiều cao của khối chóp là:",
      "options": [
        "Cạnh SA",
        "Cạnh SB",
        "Đường cao hạ từ S của tam giác SAB",
        "Đường trung tuyến của tam giác ABC"
      ],
      "correct": 2,
      "explain": "Khi mặt bên (SAB) vuông góc với mặt đáy, đường cao của tam giác SAB hạ xuống giao tuyến AB chính là chiều cao của cả hình chóp."
    }
  },
  {
    "id": "dd-03",
    "chapter": "khoi-da-dien",
    "chapterName": "Khối đa diện",
    "title": "Công thức Tỉ số Thể tích (Định lý Simson)",
    "latex": "\\text{1. Cho chóp tam giác } S.ABC, \\text{ lấy } A' \\in SA, B' \\in SB, C' \\in SC: \\\\\n\\frac{V_{S.A'B'C'}}{V_{S.ABC}} = \\frac{SA'}{SA} \\cdot \\frac{SB'}{SB} \\cdot \\frac{SC'}{SC} \\\\[6pt]\n\\text{2. Chóp tứ giác đáy là hình bình hành } S.ABCD, \\text{ mặt phẳng cắt } SA, SB, SC, SD: \\\\\n\\text{Đặt } a = \\frac{SA}{SA'}, b = \\frac{SB}{SB'}, c = \\frac{SC}{SC'}, d = \\frac{SD}{SD'} \\implies a + c = b + d \\\\\n\\frac{V_{S.A'B'C'D'}}{V_{S.ABCD}} = \\frac{a+b+c+d}{4abcd}",
    "desc": "Tính tỉ số thể tích nhanh chóng không cần tính thể tích tường minh.",
    "variables": "LƯU Ý CỰC KỲ QUAN TRỌNG: Công thức Simson chỉ áp dụng cho chóp TAM GIÁC!",
    "mnemonic": "💡 Mẹo nhớ: Simson chỉ xài cho chóp ĐÁY TAM GIÁC. Nếu đáy tứ giác phải chia đôi thành 2 tam giác để áp dụng!",
    "quiz": {
      "q": "Cho chóp $S.ABC$. Gọi $M, N$ là trung điểm $SA, SB$. Tỉ số $\frac{V_{S.MNC}}{V_{S.ABC}}$ bằng:",
      "options": [
        "$\\frac{1}{2}$",
        "$\\frac{1}{4}$",
        "$\\frac{1}{8}$",
        "$\\frac{1}{3}$"
      ],
      "correct": 1,
      "explain": "Tỉ số thể tích: $\\frac{V_{S.MNC}}{V_{S.ABC}} = \\frac{SM}{SA} \\cdot \\frac{SN}{SB} \\cdot \\frac{SC}{SC} = \\frac{1}{2} \\cdot \\frac{1}{2} \\cdot 1 = \\frac{1}{4}."
    }
  },
  {
    "id": "dd-04",
    "chapter": "khoi-da-dien",
    "chapterName": "Khối đa diện",
    "title": "Kỹ thuật đổi điểm tính Khoảng cách về Chân đường cao",
    "latex": "\\text{Cho điểm } M, N \\text{ và mặt phẳng } (P). \\text{ Gọi } H \\text{ là chân đường cao: } \\\\\n\\bullet \\text{ Nếu } MN \\parallel (P) \\implies d(M, (P)) = d(N, (P)) \\\\[4pt]\n\\bullet \\text{ Nếu } MN \\cap (P) = I \\implies \\frac{d(M, (P))}{d(N, (P))} = \\frac{MI}{NI}",
    "desc": "Quy tắc dời điểm song song và cắt mặt phẳng để đưa về điểm chân đường cao dễ tính.",
    "variables": "Khoảng cách từ chân đường cao H đến mặt phẳng bên kẻ theo quy tắc \"3 đường vuông góc\".",
    "mnemonic": "💡 Thần chú: Song song thì bằng nhau, Cắt nhau thì lập tỉ số MI/NI. Luôn kéo về chân đường cao H để kẻ!",
    "quiz": {
      "q": "Nếu đoạn thẳng AB cắt mặt phẳng (P) tại trung điểm I của AB thì:",
      "options": [
        "d(A, (P)) = 2 d(B, (P))",
        "d(A, (P)) = d(B, (P))",
        "$d(A, (P)) = \\frac{1}{2} d(B, (P))$",
        "d(A, (P)) = 0"
      ],
      "correct": 1,
      "explain": "Tỉ số khoảng cách: $\\frac{d(A,(P))}{d(B,(P))} = \\frac{IA}{IB} = 1 \\implies d(A, (P)) = d(B, (P))."
    }
  },
  {
    "id": "tx-01",
    "chapter": "khoi-tron-xoay",
    "chapterName": "Khối tròn xoay",
    "title": "Công thức Hình Nón & Hình Trụ",
    "latex": "\\textbf{Hình Nón: } \\\\\nl^2 = h^2 + r^2 \\quad ; \\quad S_{xq} = \\pi r l \\\\\nS_{tp} = \\pi r l + \\pi r^2 \\quad ; \\quad V = \\frac{1}{3} \\pi r^2 h \\\\[6pt]\n\\textbf{Hình Trụ: } \\\\\nl = h \\quad ; \\quad S_{xq} = 2\\pi r l \\\\\nS_{tp} = 2\\pi r l + 2\\pi r^2 \\quad ; \\quad V = \\pi r^2 h",
    "desc": "Mối liên hệ giữa đường sinh l, chiều cao h, bán kính đáy r và diện tích, thể tích.",
    "variables": "Khối nón có góc ở đỉnh là $2\\alpha$ với $\\sin\\alpha = r/l$; Khối trụ có thiết diện qua trục là hình chữ nhật kích thước $2r \\times h$.",
    "mnemonic": "💡 Mẹo nhớ: Nón chóp nhọn nên có 1/3 ($V = \\frac{1}{3}\\pi r^2 h$). Trụ có 2 đáy tròn nên diện tích toàn phần cộng thêm $2\\pi r^2$.",
    "quiz": {
      "q": "Một hình nón có bán kính đáy $r = 3$ và chiều cao $h = 4$. Đường sinh $l$ bằng:",
      "options": [
        "5",
        "7",
        "$\\sqrt{7}$",
        "25"
      ],
      "correct": 0,
      "explain": "Độ dài đường sinh: $l = \\sqrt{h^2 + r^2} = \\sqrt{4^2 + 3^2} = 5."
    }
  },
  {
    "id": "tx-02",
    "chapter": "khoi-tron-xoay",
    "chapterName": "Khối tròn xoay",
    "title": "Diện tích Mặt Cầu & Thể tích Khối Cầu",
    "latex": "S_{\\text{mặt cầu}} = 4\\pi R^2 \\\\[6pt]\nV_{\\text{khối cầu}} = \\frac{4}{3} \\pi R^3",
    "desc": "Công thức diện tích và thể tích hình cầu bán kính R.",
    "variables": "Mặt phẳng cắt mặt cầu cách tâm một khoảng $d < R$ tạo thiết diện là đường tròn bán kính $r = \\sqrt{R^2 - d^2}$.",
    "mnemonic": "💡 Mẹo nhớ: Diện tích 4 Pi R bình (đạo hàm theo R ra thể tích). Thể tích là 4/3 Pi R mũ ba!",
    "quiz": {
      "q": "Thể tích của khối cầu có bán kính $R = 3$ là:",
      "options": [
        "$36\\pi$",
        "$12\\pi$",
        "$108\\pi$",
        "$9\\pi$"
      ],
      "correct": 0,
      "explain": "Thể tích khối cầu: $V = \\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi (3^3) = 36\\pi."
    }
  },
  {
    "id": "tx-03",
    "chapter": "khoi-tron-xoay",
    "chapterName": "Khối tròn xoay",
    "title": "Bán kính mặt cầu ngoại tiếp khối chóp (Công thức giải nhanh)",
    "latex": "\\textbf{1. Chóp có cạnh bên vuông góc đáy } (SA \\perp \\text{đáy}): \\\\\nR = \\sqrt{R_{\\text{đáy}}^2 + \\left(\\frac{h}{2}\\right)^2} = \\sqrt{R_{\\text{đáy}}^2 + \\frac{SA^2}{4}} \\\\[6pt]\n\\textbf{2. Chóp đều } (S.ABC, S.ABCD): \\\\\nR = \\frac{SA^2}{2h} = \\frac{\\text{cạnh bên}^2}{2 \\cdot \\text{chiều cao}} \\\\[6pt]\n\\textbf{3. Chóp có mặt bên vuông góc đáy: } \\\\\nR = \\sqrt{R_{\\text{đáy}}^2 + R_{\\text{bên}}^2 - \\frac{\\text{GT}^2}{4}} \\quad (\\text{GT: độ dài giao tuyến})",
    "desc": "3 công thức cực kỳ kinh điển giải quyết 95% câu mặt cầu ngoại tiếp trong đề thi.",
    "variables": "R_đáy: bán kính đường tròn ngoại tiếp đa giác đáy; h: chiều cao khối chóp.",
    "mnemonic": "💡 Khẩu quyết: Cạnh bên vuông đáy: Căn của R đáy bình cộng (h chia 2) bình. Chóp đều: Cạnh bên bình chia 2 lần chiều cao!",
    "quiz": {
      "q": "Cho hình chóp $S.ABC$ có $SA perp$ đáy, $SA = 4$, $\triangle ABC$ vuông tại $B$ có $AC = 6$. Bán kính mặt cầu ngoại tiếp là:",
      "options": [
        "$\\sqrt{13}$",
        "5",
        "$\\sqrt{20}$",
        "$2\\sqrt{5}$"
      ],
      "correct": 0,
      "explain": "Bán kính đáy $R_{\\text{đáy}} = \\frac{AC}{2} = 3$. Chiều cao $h = SA = 4 \\implies R = \\sqrt{R_{\\text{đáy}}^2 + (h/2)^2} = \\sqrt{3^2 + 2^2} = \\sqrt{13}."
    }
  },
  {
    "id": "xyz-01",
    "chapter": "oxyz",
    "chapterName": "Hệ tọa độ Oxyz",
    "title": "Tọa độ Vectơ, Tích vô hướng & Tích có hướng",
    "latex": "\\vec{u} = (x_1; y_1; z_1) \\quad ; \\quad \\vec{v} = (x_2; y_2; z_2) \\\\\n\\bullet \\text{ Độ dài: } |\\vec{u}| = \\sqrt{x_1^2 + y_1^2 + z_1^2} \\\\\n\\bullet \\text{ Tích vô hướng: } \\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2 \\\\\n\\bullet \\text{ Tích có hướng: } [\\vec{u}, \\vec{v}] = \\left( \\begin{vmatrix} y_1 & z_1 \\\\ y_2 & z_2 \\end{vmatrix}; \\begin{vmatrix} z_1 & x_1 \\\\ z_2 & x_2 \\end{vmatrix}; \\begin{vmatrix} x_1 & y_1 \\\\ x_2 & y_2 \\end{vmatrix} \\right) \\\\\n\\bullet \\text{ Diện tích } \\triangle ABC: \\quad S_{\\triangle ABC} = \\frac{1}{2} \\big|[\\vec{AB}, \\vec{AC}]\\big| \\\\\n\\bullet \\text{ Thể tích tứ diện } ABCD: \\quad V = \\frac{1}{6} \\big|[\\vec{AB}, \\vec{AC}] \\cdot \\vec{AD}\\big|",
    "desc": "Các phép toán nền tảng về vectơ trong không gian Oxyz và ứng dụng tính diện tích, thể tích.",
    "variables": "Tích có hướng $[\\vec{u}, \\vec{v}]$ luôn vuông góc với cả hai vectơ thành phần $\\vec{u}$ và $\\vec{v}$.",
    "mnemonic": "💡 Mẹo tính có hướng: \"Huyền trừ sắc\" cho từng cặp cột (bỏ cột x, bỏ cột y đổi dấu, bỏ cột z). Thể tích tứ diện có hệ số 1/6!",
    "quiz": {
      "q": "Điều kiện để hai vectơ $\\vec{u}$ và $\\vec{v}$ vuông góc với nhau là:",
      "options": [
        "$\\vec{u} \\cdot \\vec{v} = 0$",
        "$[\\vec{u}, \\vec{v}] = \\vec{0}$",
        "$|\\vec{u}| = |\\vec{v}|$",
        "$\\vec{u} + \\vec{v} = \\vec{0}$"
      ],
      "correct": 0,
      "explain": "$\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2 = 0."
    }
  },
  {
    "id": "xyz-02",
    "chapter": "oxyz",
    "chapterName": "Hệ tọa độ Oxyz",
    "title": "Phương trình Mặt phẳng & Phương trình Mặt cầu",
    "latex": "\\textbf{1. Mặt phẳng đi qua } M_0(x_0; y_0; z_0) \\text{ có VTPT } \\vec{n}(A; B; C): \\\\\nA(x - x_0) + B(y - y_0) + C(z - z_0) = 0 \\\\\n\\text{Phương trình đoạn chắn (qua } A(a;0;0), B(0;b;0), C(0;0;c)): \\quad \\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1 \\\\[6pt]\n\\textbf{2. Mặt cầu tâm } I(a; b; c), \\text{ bán kính } R: \\\\\n(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2 \\\\\nx^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0 \\quad (R = \\sqrt{a^2 + b^2 + c^2 - d} > 0)",
    "desc": "Phương trình tổng quát của mặt phẳng và mặt cầu trong không gian Oxyz.",
    "variables": "Điều kiện mặt phẳng: $A^2 + B^2 + C^2 > 0$. Điều kiện mặt cầu: $a^2 + b^2 + c^2 - d > 0$.",
    "mnemonic": "💡 Mẹo nhớ: Đoạn chắn là x/a + y/b + z/c = 1 (nhớ là bằng 1 chứ không phải 0). Mặt cầu: lấy hệ số x, y, z chia cho -2 ra tâm I!",
    "quiz": {
      "q": "Mặt phẳng đi qua 3 điểm $A(2; 0; 0), B(0; -3; 0), C(0; 0; 4)$ có phương trình là:",
      "options": [
        "$\\frac{x}{2} + \\frac{y}{-3} + \\frac{z}{4} = 1$",
        "$\\frac{x}{2} + \\frac{y}{-3} + \\frac{z}{4} = 0$",
        "2x - 3y + 4z = 1",
        "$\\frac{x}{2} - \\frac{y}{3} - \\frac{z}{4} = 1$"
      ],
      "correct": 0,
      "explain": "Phương trình mặt phẳng theo đoạn chắn: $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1."
    }
  },
  {
    "id": "xyz-03",
    "chapter": "oxyz",
    "chapterName": "Hệ tọa độ Oxyz",
    "title": "Phương trình Đường thẳng & Vị trí tương đối",
    "latex": "\\text{Đường thẳng } d \\text{ qua } M_0(x_0; y_0; z_0) \\text{ có VTCP } \\vec{u}(a; b; c): \\\\\n\\text{Phương trình tham số: } \\begin{cases} x = x_0 + at \\\\ y = y_0 + bt \\\\ z = z_0 + ct \\end{cases} (t \\in \\mathbb{R}) \\\\[4pt]\n\\text{Phương trình chính tắc (khi } abc \\neq 0): \\quad \\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}",
    "desc": "Biểu diễn đường thẳng trong không gian dưới dạng tham số và chính tắc.",
    "variables": "t là tham số thực; a, b, c không đồng thời bằng 0.",
    "mnemonic": "💡 Mẹo nhớ: Muốn viết pt đường thẳng cần 1 ĐIỂM và 1 VTCP. Điểm thì đổi dấu trên tử, VTCP nằm dưới mẫu!",
    "quiz": {
      "q": "Đường thẳng $d: \\frac{x-1}{2} = \\frac{y+3}{-1} = \\frac{z}{4}$ có một vectơ chỉ phương là:",
      "options": [
        "(1; -3; 0)",
        "(2; -1; 4)",
        "(-1; 3; 0)",
        "(2; 1; 4)"
      ],
      "correct": 1,
      "explain": "Vectơ chỉ phương đọc trực tiếp từ các mẫu số: $\\vec{u} = (2; -1; 4)."
    }
  },
  {
    "id": "xyz-04",
    "chapter": "oxyz",
    "chapterName": "Hệ tọa độ Oxyz",
    "title": "Khoảng cách & Góc trong không gian Oxyz",
    "latex": "\\bullet \\text{ Khoảng cách từ } M_0(x_0; y_0; z_0) \\text{ đến } (P): Ax+By+Cz+D=0: \\\\\nd(M_0, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}} \\\\[4pt]\n\\bullet \\text{ Góc giữa hai mặt phẳng } (P) \\text{ và } (Q): \\\\\n\\cos((P), (Q)) = \\frac{|\\vec{n}_P \\cdot \\vec{n}_Q|}{|\\vec{n}_P| \\cdot |\\vec{n}_Q|} \\\\[4pt]\n\\bullet \\text{ Góc giữa đường thẳng } d \\text{ và mặt phẳng } (P) \\text{ (DÙNG SIN):} \\\\\n\\sin(d, (P)) = \\frac{|\\vec{u}_d \\cdot \\vec{n}_P|}{|\\vec{u}_d| \\cdot |\\vec{n}_P|}",
    "desc": "Toàn bộ công thức khoảng cách và góc trong hình học Oxyz.",
    "variables": "Góc giữa hai đối tượng hình học trong không gian luôn nằm trong khoảng từ $0^\\circ$ đến $90^\\circ$.",
    "mnemonic": "💡 Chú ý bẫy kinh điển: Góc giữa 2 mặt phẳng hoặc 2 đường thẳng dùng COS. Nhưng góc giữa ĐƯỜNG và MẶT bắt buộc dùng SIN!",
    "quiz": {
      "q": "Khoảng cách từ điểm $M(1; 2; 3)$ đến mặt phẳng $(P): 2x - 2y + z + 5 = 0$ bằng:",
      "options": [
        "2",
        "6",
        "$\\frac{2}{3}$",
        "3"
      ],
      "correct": 0,
      "explain": "Khoảng cách: $d(M,(P)) = \\frac{|2(1) - 2(2) + 3 + 5|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{6}{3} = 2."
    }
  },
  {
    "id": "cs-01",
    "chapter": "cap-so",
    "chapterName": "Dãy số & Xác suất",
    "title": "Cấp số cộng (CSC) - Công thức toàn diện",
    "latex": "u_{n+1} = u_n + d \\quad (d: \\text{công sai}) \\\\\nu_n = u_1 + (n - 1)d \\\\\nu_k = \\frac{u_{k-1} + u_{k+1}}{2} \\quad (\\text{tính chất 3 số hạng liên tiếp}) \\\\\nS_n = u_1 + u_2 + \\dots + u_n = \\frac{n(u_1 + u_n)}{2} = n u_1 + \\frac{n(n-1)}{2}d",
    "desc": "Số hạng tổng quát, công sai và tổng n số hạng đầu tiên của cấp số cộng.",
    "variables": "u_1: số hạng đầu; d: công sai; u_n: số hạng thứ n; S_n: tổng n số hạng đầu.",
    "mnemonic": "💡 Mẹo nhớ: Cấp số cộng là CỘNG thêm d. Mỗi số hạng bằng trung bình cộng 2 số kề nó. Tổng bằng (Đầu + Cuối) nhân số lượng chia 2.",
    "quiz": {
      "q": "Cho cấp số cộng có $u_1 = 3$ và công sai $d = 4$. Số hạng thứ 5 $u_5$ là:",
      "options": [
        "19",
        "15",
        "23",
        "12"
      ],
      "correct": 0,
      "explain": "Số hạng thứ 5: $u_5 = u_1 + 4d = 3 + 4 \\cdot 4 = 19."
    }
  },
  {
    "id": "cs-02",
    "chapter": "cap-so",
    "chapterName": "Dãy số & Xác suất",
    "title": "Cấp số nhân (CSN) - Công thức toàn diện",
    "latex": "u_{n+1} = u_n \\cdot q \\quad (q: \\text{công bội}) \\\\\nu_n = u_1 \\cdot q^{n - 1} \\\\\nu_k^2 = u_{k-1} \\cdot u_{k+1} \\quad (\\text{tính chất 3 số hạng liên tiếp}) \\\\\nS_n = \\frac{u_1(1 - q^n)}{1 - q} \\quad (q \\neq 1) \\\\\n\\text{Cấp số nhân lùi vô hạn } (|q| < 1): \\quad S = \\frac{u_1}{1 - q}",
    "desc": "Số hạng tổng quát, công bội và tổng n số hạng đầu của cấp số nhân.",
    "variables": "u_1: số hạng đầu; q: công bội; S_n: tổng n số hạng.",
    "mnemonic": "💡 Mẹo nhớ: Cấp số nhân là NHÂN với q. Số giữa bình phương bằng tích 2 số 2 bên. Tổng lùi vô hạn: u1 trên 1 trừ q.",
    "quiz": {
      "q": "Cho cấp số nhân có $u_1 = 2$ và công bội $q = 3$. Số hạng $u_3$ bằng:",
      "options": [
        "18",
        "54",
        "6",
        "8"
      ],
      "correct": 0,
      "explain": "Số hạng thứ 3: $u_3 = u_1 \\cdot q^2 = 2 \\cdot 3^2 = 18."
    }
  },
  {
    "id": "cs-03",
    "chapter": "cap-so",
    "chapterName": "Dãy số & Xác suất",
    "title": "Quy tắc Đếm, Hoán vị, Chỉnh hợp, Tổ hợp & Xác suất",
    "latex": "P_n = n! = 1 \\cdot 2 \\dots n \\\\[4pt]\nA_n^k = \\frac{n!}{(n-k)!} \\quad (\\text{Có thứ tự, } 1 \\le k \\le n) \\\\[4pt]\nC_n^k = \\frac{n!}{k!(n-k)!} \\quad (\\text{Không phân biệt thứ tự}) \\\\[6pt]\nP(A) = \\frac{n(A)}{n(\\Omega)} = \\frac{\\text{Số kết quả thuận lợi cho } A}{\\text{Số phần tử không gian mẫu}}",
    "desc": "Công thức tổ hợp, xác suất cổ điển xuất hiện thường trực trong câu phân loại đề thi.",
    "variables": "Tính chất tổ hợp: $C_n^k = C_n^{n-k}$ và tổng các tổ hợp: $C_n^0 + C_n^1 + \\dots + C_n^n = 2^n$.",
    "mnemonic": "💡 Phân biệt A và C: \"Chọn rồi XẾP HÀNG\" (có thứ tự) dùng A. \"Chọn làm ĐỘI NHÓM\" (không thứ tự) dùng C.",
    "quiz": {
      "q": "Có bao nhiêu cách chọn 3 học sinh từ một nhóm 10 học sinh để đi lao động?",
      "options": [
        "A_{10}^3 = 720",
        "C_{10}^3 = 120",
        "10^3 = 1000",
        "30"
      ],
      "correct": 1,
      "explain": "Chọn 3 người từ 10 người không xếp thứ tự là tổ hợp chập 3 của 10: $C_{10}^3 = 120$ cách."
    }
  },
  {
    "id": "hs-07",
    "chapter": "ham-so",
    "chapterName": "Khảo sát hàm số",
    "title": "Phương trình tiếp tuyến của đồ thị hàm số",
    "latex": "y - y_0 = f'(x_0)(x - x_0) \\quad \\Longleftrightarrow \\quad y = k(x - x_0) + y_0 \\\\[4pt]\n\\text{Hệ số góc tiếp tuyến: } k = f'(x_0) \\\\[4pt]\n\\bullet \\text{ Tiếp tuyến } \\parallel d: y = ax + b \\implies k = a \\\\[4pt]\n\\bullet \\text{ Tiếp tuyến } \\perp d': y = a'x + b' \\implies k \\cdot a' = -1 \\iff k = -\\frac{1}{a'}",
    "desc": "Phương trình tiếp tuyến tại tiếp điểm M(x_0; y_0) và phương trình tiếp tuyến theo hệ số góc k.",
    "variables": "x_0 là hoành độ tiếp điểm; y_0 = f(x_0) là tung độ tiếp điểm; k = f'(x_0) là hệ số góc.",
    "mnemonic": "💡 Khẩu quyết: Muốn viết tiếp tuyến cần 3 đại lượng (x_0, y_0, k). Song song thì k bằng nhau, Vuông góc thì tích 2 hệ số góc bằng -1!",
    "quiz": {
      "q": "Hệ số góc của tiếp tuyến của đồ thị hàm số $y = x^3 - 3x + 1$ tại điểm có hoành độ $x_0 = 2$ là:",
      "options": [
        "9",
        "3",
        "12",
        "0"
      ],
      "correct": 0,
      "explain": "Ta có đạo hàm $y' = 3x^2 - 3$. Hệ số góc tiếp tuyến là $k = y'(2) = 3(2^2) - 3 = 9."
    }
  },
  {
    "id": "hs-08",
    "chapter": "ham-so",
    "chapterName": "Khảo sát hàm số",
    "title": "Đường thẳng đi qua hai điểm cực trị hàm bậc ba",
    "latex": "y = ax^3 + bx^2 + cx + d \\quad (a \\neq 0) \\\\[4pt]\n\\text{Lấy } y \\text{ chia cho } y': \\quad y = y' \\cdot Q(x) + R(x) \\\\[4pt]\n\\implies \\text{Phương trình đường thẳng cực trị: } y = R(x) = \\left( \\frac{2c}{3} - \\frac{2b^2}{9a} \\right)x + \\left( d - \\frac{bc}{9a} \\right)",
    "desc": "Phương trình đường thẳng nối 2 điểm cực trị của đồ thị hàm số bậc 3 chính là phần dư khi lấy y chia cho y'.",
    "variables": "Tại các điểm cực trị x_1, x_2 thì y'(x_1) = y'(x_2) = 0 nên y_1 = R(x_1) và y_2 = R(x_2).",
    "mnemonic": "💡 Mẹo bấm máy tính Casio: Lấy $y - \\frac{y' \\cdot y''}{18a}$ gán $x = i$ (ở chế độ số phức CMPLX). Cực nhanh 5 giây!",
    "quiz": {
      "q": "Đường thẳng đi qua hai điểm cực trị của đồ thị hàm số bậc ba y = f(x) chính là:",
      "options": [
        "Tiếp tuyến tại điểm uốn",
        "Phần dư khi lấy f(x) chia cho f'(x)",
        "Đường thẳng y = f'(x)",
        "Trục hoành Ox"
      ],
      "correct": 1,
      "explain": "Vì $f(x) = f'(x) \\cdot Q(x) + R(x)$, tại các điểm cực trị $f'(x) = 0$ nên tọa độ các điểm cực trị luôn thỏa mãn $y = R(x)."
    }
  },
  {
    "id": "mu-04",
    "chapter": "mu-logarit",
    "chapterName": "Mũ & Logarit",
    "title": "Phương trình & Bất phương trình Mũ - Logarit",
    "latex": "a^x = b \\iff \\begin{cases} x = \\log_a b & (b > 0) \\\\ \\text{Vô nghiệm} & (b \\le 0) \\end{cases} \\\\[4pt]\n\\log_a x = b \\iff x = a^b \\quad (\\text{luôn có nghiệm duy nhất}) \\\\[4pt]\n\\bullet \\text{ Khi } a > 1: \\quad a^f > a^g \\iff f > g \\quad ; \\quad \\log_a f > \\log_a g \\iff f > g > 0 \\\\[4pt]\n\\bullet \\text{ Khi } 0 < a < 1: \\quad a^f > a^g \\iff f < g \\quad (\\textbf{ĐẢO CHIỀU})",
    "desc": "Giải phương trình, bất phương trình mũ và logarit cơ bản; quy tắc cùng chiều/đảo chiều theo cơ số.",
    "variables": "Nhớ luôn đặt điều kiện xác định f(x) > 0 trước khi giải bất phương trình logarit!",
    "mnemonic": "💡 Khẩu quyết: Cơ số LỚN HƠN 1 thì GIỮ CHIỀU; Cơ số BÉ HƠN 1 (từ 0 đến 1) thì ĐẢO CHIỀU bất đẳng thức!",
    "quiz": {
      "q": "Tập nghiệm của bất phương trình $(\\frac{1}{2})^x < (\\frac{1}{2})^3$ là:",
      "options": [
        "x > 3",
        "x < 3",
        "x >= 3",
        "x <= 3"
      ],
      "correct": 0,
      "explain": "Vì cơ số $a = 1/2 < 1$ nên bất phương trình đổi chiều: $x > 3$."
    }
  },
  {
    "id": "tp-04",
    "chapter": "tich-phan",
    "chapterName": "Nguyên hàm & Tích phân",
    "title": "Công thức giải nhanh diện tích Parabol (Archimedes)",
    "latex": "\\text{Diện tích hình phẳng giới hạn bởi Parabol } y = ax^2 + bx + c \\text{ và trục Ox } (\\Delta > 0): \\\\[4pt]\nS = \\frac{|a|}{6} |x_1 - x_2|^3 = \\frac{\\Delta\\sqrt{\\Delta}}{6a^2} \\\\[6pt]\n\\text{Diện tích hình phẳng giới hạn bởi Parabol } (P) \\text{ và đường thẳng cắt tại 2 điểm: } \\\\[4pt]\nS = \\frac{2}{3} b \\cdot h \\quad (b: \\text{độ dài đáy dây cung}, h: \\text{chiều cao lớn nhất})",
    "desc": "Công thức tính nhanh diện tích hình phẳng chắn bởi parabol mà không cần giải tích phân từng bước.",
    "variables": "x_1, x_2 là hai nghiệm phân biệt của phương trình hoành độ giao điểm.",
    "mnemonic": "💡 Mẹo nhớ: Diện tích Parabol bằng 2/3 đáy nhân chiều cao (2/3 b.h). Giúp giải câu trắc nghiệm trong 10 giây!",
    "quiz": {
      "q": "Diện tích hình phẳng giới hạn bởi parabol $y = 4 - x^2$ và trục Ox là:",
      "options": [
        "16/3",
        "32/3",
        "8/3",
        "16"
      ],
      "correct": 1,
      "explain": "Phương trình $4 - x^2 = 0$ có nghiệm $x = \\pm 2$. Diện tích $S = \\int_{-2}^2 (4 - x^2) \\, dx = \\frac{32}{3}."
    }
  },
  {
    "id": "sp-03",
    "chapter": "so-phuc",
    "chapterName": "Số phức",
    "title": "Phương trình bậc hai hệ số thực & Định lý Vi-ét",
    "latex": "az^2 + bz + c = 0 \\quad (a \\neq 0; a, b, c \\in \\mathbb{R}) \\\\[4pt]\n\\Delta = b^2 - 4ac \\\\[4pt]\n\\bullet \\text{ Nếu } \\Delta > 0: \\quad z_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} \\quad (\\text{2 nghiệm thực}) \\\\[4pt]\n\\bullet \\text{ Nếu } \\Delta < 0: \\quad z_{1,2} = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a} \\quad (\\text{2 nghiệm phức liên hợp}) \\\\[4pt]\n\\text{Định lý Vi-ét luôn đúng: } \\quad z_1 + z_2 = -\\frac{b}{a} \\quad ; \\quad z_1 \\cdot z_2 = \\frac{c}{a}",
    "desc": "Nghiệm của phương trình bậc 2 với hệ số thực trên tập số phức C. Luôn có 2 nghiệm (kể cả bội).",
    "variables": "Khi $\\Delta < 0$, căn bậc hai của $\\Delta$ là $\\pm i\\sqrt{|\\Delta|}$.",
    "mnemonic": "💡 Mẹo nhớ: Căn của số âm thêm chữ i vào! Hai nghiệm phức của pt bậc 2 hệ số thực luôn là một cặp liên hợp (z2 = z1 liên hợp).",
    "quiz": {
      "q": "Nghiệm của phương trình $z^2 + 4 = 0$ trên tập số phức là:",
      "options": [
        "z = 2",
        "$z = \\pm 2$",
        "$z = \\pm 2i$",
        "z = 4i"
      ],
      "correct": 2,
      "explain": "Ta có $z^2 = -4 = 4i^2 \\implies z = \\pm 2i."
    }
  },
  {
    "id": "dd-05",
    "chapter": "khoi-da-dien",
    "chapterName": "Khối đa diện",
    "title": "Hệ thống Công thức tính Diện tích Tam giác (Hình học phẳng)",
    "latex": "S = \\frac{1}{2} a \\cdot h_a = \\frac{1}{2} a b \\sin C \\\\[4pt]\nS = \\frac{a b c}{4R} \\quad ; \\quad S = p \\cdot r \\\\[4pt]\nS = \\sqrt{p(p-a)(p-b)(p-c)} \\quad (\\text{Công thức Heron với } p = \\frac{a+b+c}{2}) \\\\[4pt]\n\\text{Tam giác đều cạnh a: } \\quad S = \\frac{a^2\\sqrt{3}}{4} \\quad ; \\quad h = \\frac{a\\sqrt{3}}{2} \\quad ; \\quad R = \\frac{a\\sqrt{3}}{3}",
    "desc": "Tất cả các công thức diện tích tam giác bắt buộc phải nắm vững để tính diện tích đáy đa diện.",
    "variables": "a, b, c: độ dài 3 cạnh; p: nửa chu vi; R: bán kính ngoại tiếp; r: bán kính nội tiếp.",
    "mnemonic": "💡 Khẩu quyết: Tam giác đều diện tích bằng: Cạnh bình căn 3 chia 4! Chiều cao bằng: Cạnh căn 3 chia 2!",
    "quiz": {
      "q": "Diện tích tam giác đều có cạnh bằng $2a$ là:",
      "options": [
        "$a^2 \\sqrt{3}$",
        "$2a^2 \\sqrt{3}$",
        "$4a^2 \\sqrt{3}$",
        "$\\frac{a^2 \\sqrt{3}}{4}$"
      ],
      "correct": 0,
      "explain": "Diện tích tam giác đều: $S = (\\text{cạnh})^2 \\cdot \\frac{\\sqrt{3}}{4} = (2a)^2 \\cdot \\frac{\\sqrt{3}}{4} = a^2\\sqrt{3}."
    }
  },
  {
    "id": "dd-06",
    "chapter": "khoi-da-dien",
    "chapterName": "Khối đa diện",
    "title": "Khoảng cách giữa hai đường thẳng chéo nhau",
    "latex": "\\textbf{Phương pháp 1 (Dựng mặt phẳng song song): } \\\\ \\Delta_1 \\text{ chéo } \\Delta_2. \\text{ Dựng mp } (P) \\text{ chứa } \\Delta_1 \\text{ và song song } \\Delta_2: \\\\ d(\\Delta_1, \\Delta_2) = d(\\Delta_2, (P)) = d(M \\in \\Delta_2, (P)) \\\\[6pt] \\textbf{Phương pháp 2 (Dùng thể tích tứ diện): } \\\\ d(AB, CD) = \\frac{6 V_{ABCD}}{AB \\cdot CD \\cdot \\sin(AB, CD)}",
    "desc": "Hai phương pháp kinh điển giải dạng toán khoảng cách 2 đường thẳng chéo nhau khó nhất trong hình học không gian.",
    "variables": "M là điểm bất kỳ trên đường thẳng Delta_2, ưu tiên chọn điểm dễ chiếu vuông góc xuống (P).",
    "mnemonic": "💡 Thần chú: Tìm hoặc dựng mặt phẳng chứa đường này song song đường kia, sau đó dời điểm về chân đường cao!",
    "quiz": {
      "q": "Để tính khoảng cách giữa 2 đường thẳng chéo nhau a và b, ta thường dựng:",
      "options": [
        "Mặt phẳng chứa a và vuông góc với b",
        "Mặt phẳng chứa a và song song với b",
        "Mặt phẳng đi qua trung điểm của a và b",
        "Đường thẳng vuông góc với cả a và b"
      ],
      "correct": 1,
      "explain": "Dựng mặt phẳng $(P)$ chứa $a$ và song song với $b$, khi đó $d(a, b) = d(b, (P))$."
    }
  },
  {
    "id": "tx-04",
    "chapter": "khoi-tron-xoay",
    "chapterName": "Khối tròn xoay",
    "title": "Hình Nón cụt & Hình Trụ rỗng",
    "latex": "\\textbf{Hình Nón cụt } (R, r \\text{ là 2 bán kính đáy; } l, h \\text{ là đường sinh và chiều cao}): \\\\[4pt]\nl = \\sqrt{h^2 + (R - r)^2} \\\\[4pt]\nS_{xq} = \\pi (R + r) l \\\\ S_{tp} = \\pi (R + r) l + \\pi R^2 + \\pi r^2 \\\\[4pt]\nV = \\frac{1}{3} \\pi h (R^2 + r^2 + R \\cdot r)",
    "desc": "Công thức tính các thông số của hình nón cụt (cắt hình nón bởi mặt phẳng song song đáy).",
    "variables": "R: bán kính đáy lớn; r: bán kính đáy nhỏ; h: chiều cao; l: độ dài đường sinh nón cụt.",
    "mnemonic": "💡 Mẹo nhớ: Thể tích nón cụt giống như bình phương thiếu: R bình + r bình + R.r nhân 1/3 Pi h!",
    "quiz": {
      "q": "Diện tích xung quanh của hình nón cụt có hai đáy $R = 5, r = 2$ và đường sinh $l = 4$ là:",
      "options": [
        "$28\\pi$",
        "$14\\pi$",
        "$56\\pi$",
        "$20\\pi$"
      ],
      "correct": 0,
      "explain": "Diện tích xung quanh hình nón cụt: $S_{xq} = \\pi (R + r) l = \\pi (5 + 2) \\cdot 4 = 28\\pi."
    }
  },
  {
    "id": "xyz-05",
    "chapter": "oxyz",
    "chapterName": "Hệ tọa độ Oxyz",
    "title": "Khoảng cách trong Oxyz (Điểm - Đường thẳng & 2 Đường chéo nhau)",
    "latex": "\\bullet \\text{ Khoảng cách từ điểm } M \\text{ đến đường thẳng } \\Delta (M_0, \\vec{u}): \\\\[4pt]\nd(M, \\Delta) = \\frac{\\big|[\\vec{u}, \\vec{M_0 M}]\\big|}{|\\vec{u}|} \\\\[6pt]\n\\bullet \\text{ Khoảng cách giữa 2 đường thẳng chéo nhau } \\Delta_1(M_1, \\vec{u}_1) \\text{ và } \\Delta_2(M_2, \\vec{u}_2): \\\\[4pt]\nd(\\Delta_1, \\Delta_2) = \\frac{\\big|[\\vec{u}_1, \\vec{u}_2] \\cdot \\vec{M_1 M_2}\\big|}{\\big|[\\vec{u}_1, \\vec{u}_2]\\big|}",
    "desc": "Công thức giải tích tính khoảng cách bằng tọa độ vectơ, áp dụng được cho mọi bài toán hình học không gian khi gắn tọa độ Oxyz.",
    "variables": "$[\\vec{u}_1, \\vec{u}_2]$ là tích có hướng của 2 vectơ chỉ phương.",
    "mnemonic": "💡 Mẹo gắn trục tọa độ: Gặp bài hình không gian khó tính khoảng cách/góc, cứ gắn hệ trục Oxyz rồi dùng 2 công thức này là ra 100%!",
    "quiz": {
      "q": "Điều kiện để hai đường thẳng $\\Delta_1$ và $\\Delta_2$ chéo nhau trong không gian Oxyz là:",
      "options": [
        "$[\\vec{u}_1, \\vec{u}_2] \\cdot \\vec{M_1 M_2} \\neq 0$",
        "$[\\vec{u}_1, \\vec{u}_2] = \\vec{0}$",
        "$\\vec{u}_1 \\cdot \\vec{u}_2 = 0$",
        "$[\\vec{u}_1, \\vec{u}_2] \\cdot \\vec{M_1 M_2} = 0$"
      ],
      "correct": 0,
      "explain": "Hai đường thẳng chéo nhau khi chúng không đồng phẳng, tức là tích hỗn tạp $[\\vec{u}_1, \\vec{u}_2] \\cdot \\vec{M_1 M_2} \\neq 0."
    }
  },
  {
    "id": "cs-04",
    "chapter": "cap-so",
    "chapterName": "Dãy số & Xác suất",
    "title": "Khai triển Nhị thức Newton",
    "latex": "(a + b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k = C_n^0 a^n + C_n^1 a^{n-1} b + \\dots + C_n^n b^n \\\\[6pt]\n\\text{Số hạng tổng quát thứ } (k+1): \\quad T_{k+1} = C_n^k a^{n-k} b^k \\quad (0 \\le k \\le n) \\\\[4pt]\n\\text{Tổng hệ số: } C_n^0 + C_n^1 + C_n^2 + \\dots + C_n^n = 2^n",
    "desc": "Công thức khai triển nhị thức Newton và phương pháp tìm hệ số của số hạng trong khai triển.",
    "variables": "k là chỉ số chạy từ 0 đến n. Khai triển có đúng (n + 1) số hạng.",
    "mnemonic": "💡 Mẹo nhớ: Số hạng thứ (k + 1) thì tổ hợp là $C_n^k$ (chỉ số chập lùi 1 đơn vị). Số mũ của a giảm dần, số mũ của b tăng dần, tổng 2 số mũ luôn bằng n!",
    "quiz": {
      "q": "Số hạng tổng quát thứ $(k + 1)$ trong khai triển của $(x + 2)^5$ là:",
      "options": [
        "C_5^k x^{5-k} 2^k",
        "C_5^k x^k 2^{5-k}",
        "C_5^{k+1} x^{5-k} 2^k",
        "5! x^{5-k} 2^k"
      ],
      "correct": 0,
      "explain": "Số hạng tổng quát $T_{k+1} = C_n^k a^{n-k} b^k$. Với $n = 5, a = x, b = 2 \\implies T_{k+1} = C_5^k x^{5-k} 2^k."
    }
  },
  {
    "id": "cs-05",
    "chapter": "cap-so",
    "chapterName": "Dãy số & Xác suất",
    "title": "Công thức Cộng và Nhân Xác suất",
    "latex": "\\bullet \\text{ Biến cố đối: } \\quad P(\\bar{A}) = 1 - P(A) \\\\[4pt]\n\\bullet \\text{ Công thức cộng xác suất (Hai biến cố xung khắc } A \\cap B = \\emptyset): \\\\ P(A \\cup B) = P(A) + P(B) \\\\[4pt]\n\\bullet \\text{ Công thức cộng tổng quát (hai biến cố bất kỳ): } \\\\ P(A \\cup B) = P(A) + P(B) - P(A \\cap B) \\\\[4pt]\n\\bullet \\text{ Công thức nhân xác suất (Hai biến cố ĐỘC LẬP): } \\\\ P(A \\cap B) = P(A) \\cdot P(B)",
    "desc": "Quy tắc tính xác suất của biến cố hợp và biến cố giao.",
    "variables": "Xung khắc: không thể cùng xảy ra. Độc lập: việc xảy ra của A không ảnh hưởng tới xác suất của B.",
    "mnemonic": "💡 Thần chú xác suất: \"HOẶC\" là CỘNG (nhiều trường hợp), \"VÀ / LIÊN TIẾP\" là NHÂN. Khi gặp bài toán có từ \"ÍT NHẤT 1\" thì dùng biến cố đối (1 - P(không có cái nào))!",
    "quiz": {
      "q": "Gieo một con súc sắc cân đối đồng chất 2 lần độc lập. Xác suất để cả 2 lần đều xuất hiện mặt 6 chấm là:",
      "options": [
        "1/6",
        "1/12",
        "1/36",
        "1/18"
      ],
      "correct": 2,
      "explain": "Hai lần gieo độc lập: $P = P_1 \\cdot P_2 = \\frac{1}{6} \\cdot \\frac{1}{6} = \\frac{1}{36}."
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHAPTERS, FORMULAS_DATA };
}
