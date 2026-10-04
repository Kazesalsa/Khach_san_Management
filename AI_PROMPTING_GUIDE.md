# 🤖 Hướng Dẫn Kỹ Năng Prompt AI Dành Cho Nhóm 11

Để AI có thể code chuẩn xác, bám sát nghiệp vụ hệ thống Quản lý Khách sạn Sương Mai và kiến trúc 3-tier mà nhóm đang theo đuổi, các thành viên vui lòng sử dụng các mẫu prompt (lệnh) dưới đây khi giao tiếp với AI.

---

## 1. 🌟 Nguyên Tắc Vàng Khi Prompt
1. **Luôn yêu cầu AI đọc tài liệu:** Trước khi nhờ AI code, hãy luôn chèn câu: *"Hãy đọc kỹ file `docs/SRC.md` phần [Mã UC]..."* để AI hiểu đúng luồng nghiệp vụ thay vì bịa code linh tinh.
2. **Nêu rõ vai trò của bạn:** Báo cho AI biết bạn đang làm Frontend hay Backend để AI định hướng code đúng thư mục và ngôn ngữ.
3. **Chia để trị:** Đừng bắt AI viết toàn bộ Use Case trong 1 câu prompt. Hãy kêu AI viết tầng Database trước, sau đó là Service, rồi đến Controller và cuối cùng là Frontend.

---

## 2. 📝 Các Mẫu Prompt Thực Chiến (Templates)

Bạn chỉ cần copy/paste các đoạn dưới đây và thay đổi thông tin trong ngoặc vuông `[...]` cho phù hợp với task của mình.

### 🎨 Dành cho Frontend Developer
**Khi cần gõ giao diện (UI/UX):**
> "Tôi đang phụ trách Frontend. Hãy đóng vai trò là một chuyên gia React & TailwindCSS. Dựa vào đặc tả của chức năng **[UC-05: Đặt phòng]** trong file `docs/SRC.md`, hãy code cho tôi một Component giao diện hoàn chỉnh. Yêu cầu thiết kế hiện đại, responsive trên mobile, các nút bấm có hiệu ứng hover rõ ràng."

**Khi cần viết Logic gọi API:**
> "Tôi đã có giao diện cho **[UC-06: Check-in]**. Bây giờ hãy viết cho tôi logic xử lý sự kiện khi bấm nút Submit. Yêu cầu: validate dữ liệu đầu vào (không để trống mã đặt phòng), dùng `fetch/axios` gọi API `POST /api/checkin`. Hãy xử lý thêm state `loading` và hiện thông báo lỗi (dựa theo phần Exception Flow EF-1, EF-2 trong `docs/SRC.md`)."

### ⚙️ Dành cho Backend Developer
**Khi cần viết Core Logic (Tầng Service):**
> "Tôi đang phụ trách tầng Business Logic của Backend. Hãy đọc thật kỹ phần **Main Flow và Alternative Flow của [UC-08: Chốt hóa đơn]** trong file `docs/SRC.md`. Viết cho tôi một class Service (không dính tới Controller) để tính toán logic khấu trừ tiền cọc, tổng tiền phải trả. Yêu cầu chia nhỏ thành các hàm private cho dễ đọc, tuân thủ nguyên tắc SRP."

**Khi cần viết Controller & Bắt lỗi:**
> "Dựa vào luồng **Exception Flow (EF-1, EF-2)** của **[UC-07: Check-out]** trong tài liệu `docs/SRC.md`. Hãy viết Controller tiếp nhận API request. Yêu cầu: Bắt try/catch toàn bộ, validate request body chặt chẽ. Nếu lỗi, phải trả về HTTP Status 400 Bad Request kèm theo câu báo lỗi chuẩn xác như tài liệu yêu cầu."

### 🗄️ Dành cho Database & Repository
**Khi cần tạo bảng và CRUD:**
> "Tôi đảm nhận phần Database. Dựa vào nghiệp vụ của hệ thống khách sạn, hãy code giúp tôi tầng Repository (các hàm truy vấn CSDL cơ bản) cho **[UC-04: Tra cứu phòng trống]**. Tôi cần hàm lọc danh sách phòng trống dựa theo ngày đi/đến. Yêu cầu code tối ưu hiệu năng."

### 🐞 Dành cho QA / Tester (Viết Test Case)
**Khi cần tìm Bug / Viết kịch bản Test:**
> "Tôi là QA của dự án. Hãy phân tích kỹ các điều kiện ràng buộc trong **[UC-01: Thiết lập bảng giá]** (file `docs/SRC.md`). Áp dụng kỹ thuật **Phân tích giá trị biên (BVA)** và **Phân vùng tương đương (EP)**, hãy liệt kê cho tôi danh sách các Test Case chi tiết ra bảng (Mã TC, Dữ liệu nhập, Kết quả mong đợi, Kết quả thực tế) để tôi đi bắt bug Frontend và Backend."

---

## 3. Lệnh Hỗ Trợ Git / Lỗi Lặt Vặt
Khi bạn bị dính lỗi (Conflict, Push bị từ chối), hãy prompt:
> "Tôi đang làm bước số 4 trong file `docs/GIT_WORKFLOW.md` và bị lỗi Conflict báo đỏ ở file `App.js`. Tôi phải gõ lệnh Git nào tiếp theo để sửa đây, hướng dẫn từng bước giúp tôi."
