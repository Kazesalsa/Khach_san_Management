# 📂 Cấu Trúc Cây Thư Mục (Directory Structure)

Dự án Quản lý Khách sạn Sương Mai được thiết kế theo mô hình **Client-Server (Tách rời Frontend và Backend)** kết hợp kiến trúc **3-Tier (3 Tầng)**. 

Để đảm bảo 6 thành viên có thể làm việc song song mà không dẫm chân lên code của nhau, nhóm thống nhất áp dụng cấu trúc thư mục dưới đây. Các thành viên có trách nhiệm code đúng file vào đúng thư mục được quy định.

---

## 🌳 Cấu Trúc Tổng Thể (Monorepo)

```text
Hotel_Management_Suong_Mai/
│
├── docs/                 # 📚 Nơi lưu toàn bộ tài liệu kỹ thuật của dự án (Bạn đang ở đây)
│
├── frontend/             # 🎨 Không gian của đội Frontend (ReactJS + TailwindCSS)
│   ├── public/           # Chứa các tài nguyên tĩnh không cần compile (favicon, index.html)
│   └── src/
│       ├── assets/       # Hình ảnh, fonts, icons.
│       ├── components/   # Các UI block dùng chung (Button, Header, Form đặt phòng...).
│       ├── pages/        # Các màn hình chính (HomePage, CheckoutPage, Dashboard...).
│       ├── services/     # File cấu hình gọi API kết nối với Backend (dùng fetch/axios).
│       ├── hooks/        # Các custom React hooks xử lý logic UI phức tạp.
│       ├── contexts/     # Quản lý state toàn cục (Ví dụ: trạng thái Đăng nhập của AuthContext).
│       └── utils/        # Các hàm tiện ích dùng lại nhiều lần (format tiền tệ VNĐ, format ngày tháng...).
│
├── backend/              # ⚙️ Không gian của đội Backend (Java Spring Boot)
│   └── src/main/java/com/hotel/suongmai/
│       ├── controller/   # (Tầng 1 - Presentation) Nơi định nghĩa các API Endpoints, nhận request và trả về JSON.
│       ├── dto/          # (Data Transfer Object) Chứa các object đóng gói dữ liệu gửi lên (Request) và trả về (Response).
│       ├── exception/    # Quản lý bắt lỗi tập trung (GlobalExceptionHandler) và ném lỗi HTTP Code chuẩn.
│       │
│       ├── service/      # (Tầng 2 - Business Logic) Nơi chứa 100% "chất xám" thuật toán xử lý nghiệp vụ của hệ thống.
│       │
│       ├── repository/   # (Tầng 3 - Data Access) Chứa các Interface giao tiếp thẳng với Database (Kế thừa JpaRepository).
│       ├── entity/       # (Model) Các Class ánh xạ 1-1 với các bảng trong cơ sở dữ liệu.
│       └── config/       # Cấu hình hệ thống (Bảo mật Security, CORS cho Frontend gọi, cấu hình Database...).
│
├── database/             # 🗄️ Không gian của Database & Script
│   ├── schema.sql        # File mã SQL tự động tạo các Bảng (Tables).
│   └── seed_data.sql     # File mã SQL tạo sẵn dữ liệu mẫu (mock data) để test không cần nhập tay.
│
└── .github/workflows/    # 🤖 Chứa file YAML cấu hình CI/CD tự động test/build khi có người push code.
```

---

## 💡 Quy tắc "Nhập Gia Tùy Tục"

1.  **Tuyệt đối tuân thủ phân quyền:** 
    *   Người làm **Giao diện (Frontend)** tuyệt đối không được động vào thư mục `backend/` và ngược lại.
    *   Người làm **Logic Backend (Service)** tuyệt đối không viết code truy vấn SQL thẳng trong Service, mà phải gọi qua tầng `repository/`.
2.  **Đặt tên file:** 
    *   Tên file Component bên Frontend phải viết Hoa chữ cái đầu (Ví dụ: `RoomCard.jsx`).
    *   Tên file Backend tuân thủ chuẩn Java CamelCase (Ví dụ: `RoomController.java`, `InvoiceService.java`).
