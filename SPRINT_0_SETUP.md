# 🚀 Kế Hoạch Giai Đoạn Đầu (Sprint 0) - "Thông Nòng Hệ Thống"

Đây là tài liệu hướng dẫn tác chiến chi tiết cho **Tuần đầu tiên** của dự án. 
Mục tiêu của giai đoạn này KHÔNG PHẢI là code các chức năng nghiệp vụ (chưa làm tính năng Đặt phòng hay Báo cáo). Mục tiêu duy nhất là: **Xây dựng bộ khung, chứng minh Git Workflow hoạt động, và đảm bảo 3 tầng (Frontend - Backend - Database) có thể gọi được nhau thông suốt.**

Cả nhóm sẽ chạy tiếp sức theo thứ tự dưới đây. Người trước làm xong thì người sau mới vào làm.

---

## 🏁 Chặng 1: Xây móng & Thiết lập luật chơi
**👤 Trách nhiệm: Người số 6 (Git Master & DevOps)**
*   **Bước 1.1 - Khởi tạo kho chứa:**
    *   Lên GitHub tạo một Repository trống tên là `Hotel_Management_Suong_Mai`.
    *   Add quyền Admin/Collaborator cho 5 thành viên còn lại.
    *   Tạo file `.gitignore` cơ bản (chặn thư mục `node_modules`, `target`, file `.env`).
    *   Tạo 2 nhánh mặc định: `main` và `develop`.
*   **Bước 1.2 - Bảo vệ nhánh (Branch Protection):**
    *   Vào `Settings` > `Branches` > Thêm luật bảo vệ cho cả `main` và `develop`.
    *   Tích chọn *"Require a pull request before merging"*.
    *   Tích chọn *"Require approvals"* (Ít nhất 1 người duyệt mới được merge).
*   **Bước 1.3 - Cài đặt CI/CD (GitHub Actions):**
    *   Tạo thư mục `.github/workflows/`. Trong đó tạo file `backend-ci.yml`.
    *   Bên trong file YAML, viết script cơ bản để mỗi khi có PR gộp vào `develop`, hệ thống tự động chạy lệnh `mvn clean test` (hoặc `npm build`) để kiểm tra xem code có bị lỗi biên dịch không.
*   **✅ Tiêu chí hoàn thành (Done):** Gửi link Repo cho cả nhóm clone về máy. Thông báo "Chặng 1 hoàn tất".

---

## 🏁 Chặng 2: Lên nguồn Database (Docker)
**👤 Trách nhiệm: Người số 5 (Database & Repository)**
*   **Bước 2.1 - Tách nhánh làm việc:**
    *   Từ nhánh `develop`, chạy lệnh: `git checkout -b feature/UC-00-setup-db`.
*   **Bước 2.2 - Viết cấu hình Docker:**
    *   Tạo file `docker-compose.yml` ở thư mục gốc. 
    *   Bên trong file, định nghĩa một service chạy image `postgres:15-alpine`. Cài đặt mật khẩu gốc (vd: `POSTGRES_PASSWORD=12345`), mở port `5432:5432`.
    *   (Tùy chọn) Thêm 1 service `pgadmin` để anh em có giao diện xem DB trên web.
*   **Bước 2.3 - Viết Script SQL mồi:**
    *   Tạo thư mục `database/`.
    *   Tạo file `database/schema.sql` có 1 câu lệnh đơn giản: `CREATE TABLE system_status (id SERIAL PRIMARY KEY, message VARCHAR(255));`
    *   Tạo file `database/seed_data.sql`: `INSERT INTO system_status (message) VALUES ('Database đã thông!');`
*   **Bước 2.4 - Nộp bài theo luồng Git Workflow:**
    *   Chạy `git add .`
    *   Chạy `git commit -m "chore(db): thiết lập docker postgres và script tạo bảng mẫu (#UC-00)"`.
    *   Chạy `git push origin feature/UC-00-setup-db`.
    *   Lên GitHub tạo **Pull Request (PR)**, gán (assign) tên Người số 6 vào review. Người số 6 thấy file cấu hình chuẩn, bấm Approve và gộp (Squash & Merge) vào `develop`. Xoá nhánh.
*   **✅ Tiêu chí hoàn thành (Done):** Nhóm kéo code `develop` về, gõ lệnh `docker-compose up -d` là máy tự động có Database chạy.

---

## 🏁 Chặng 3: Backend Nối Cáp
**👤 Trách nhiệm: Người số 3 & 4 (Backend Team)**
*   **Bước 3.1 - Tách nhánh:**
    *   Đảm bảo đang ở `develop` mới nhất (có thư mục database). 
    *   Chạy: `git checkout -b feature/UC-00-setup-backend`.
*   **Bước 3.2 - Khởi tạo Spring Boot:**
    *   Dùng Spring Initializr tạo dự án, ném vào thư mục `backend/`.
    *   Thêm các dependency: Web, JPA, PostgreSQL Driver, Lombok.
*   **Bước 3.3 - Nối cáp vào Database:**
    *   Vào `application.properties`, gõ link kết nối DB: `spring.datasource.url=jdbc:postgresql://localhost:5432/tên_db` (dùng đúng thông tin Người số 5 đã setup ở Bước 2.2).
*   **Bước 3.4 - Mở API đầu tiên:**
    *   Tạo một `SystemController.java`.
    *   Viết một API `@GetMapping("/api/test")`.
    *   Trong API này, có thể chọc xuống tầng Repository lấy dòng chữ *"Database đã thông!"* (từ bảng `system_status`) và trả về cho người dùng qua dạng JSON.
    *   *Lưu ý: Bật cấu hình CORS (`@CrossOrigin`) để Frontend lát nữa có thể gọi được API mà không bị chặn.*
*   **Bước 3.5 - Nộp bài:**
    *   Commit: `feat(setup): khởi tạo Spring boot và mở API /api/test (#UC-00)`.
    *   Tạo PR vào `develop`. Chờ CI/CD chạy màu xanh. Nhờ 1 bạn khác Review và Merge.
*   **✅ Tiêu chí hoàn thành (Done):** Mở Postman gõ `http://localhost:8080/api/test` ra được chữ màu xanh báo thành công.

---

## 🏁 Chặng 4: Frontend Lên Đèn
**👤 Trách nhiệm: Người số 1 & 2 (Frontend Team)**
*   **Bước 4.1 - Tách nhánh:**
    *   Kéo nhánh `develop` mới nhất (đã có thư mục backend).
    *   Chạy: `git checkout -b feature/UC-00-setup-frontend`.
*   **Bước 4.2 - Cài đặt giao diện (Người 1):**
    *   Chạy `npm create vite@latest frontend` để tạo thư mục Frontend. Cài TailwindCSS.
    *   Vào `App.jsx`, dọn dẹp code cũ, thiết kế một cái hộp to bự ở giữa màn hình có cái nút màu xanh lá tên là **"Kiểm Tra Hệ Thống"**.
*   **Bước 4.3 - Gọi API (Người 2):**
    *   Viết sự kiện `onClick` cho cái nút. 
    *   Dùng `axios` hoặc `fetch` để gọi `http://localhost:8080/api/test`.
    *   Lấy dòng chữ JSON trả về, gán vào một biến `state` và in dòng chữ đó ra màn hình UI.
*   **Bước 4.4 - Nộp bài:**
    *   Commit: `feat(setup): khởi tạo React và gọi API test hệ thống (#UC-00)`.
    *   Mở Pull Request, nhờ review và Merge.
*   **✅ Tiêu chí hoàn thành (Done):** Chạy `npm run dev`, ra web. Bấm cái nút, chữ *"Database đã thông!"* hiện lên màn hình mượt mà.

---
**🎉 TỔNG KẾT SPRINT 0 🎉**
Tại buổi thuyết trình tiếp theo, bạn chỉ việc chiếu màn hình lên, khoe danh sách Pull Request đã đóng (xanh lè, commit đúng chuẩn Conventional), sau đó chạy ứng dụng lên và bấm 1 nút là dữ liệu đi từ Database -> Java -> React. Thầy giáo chắc chắn sẽ cho điểm A phần Setup & Quy trình làm việc!
