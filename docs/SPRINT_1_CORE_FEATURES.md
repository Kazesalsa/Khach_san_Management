# 🏃 Kế Hoạch Giai Đoạn 2 (Sprint 1) - Xây Dựng Lõi Nghiệp Vụ

Sau khi đã "Thông nòng" thành công ở Sprint 0 (kết nối 3 tầng và CI/CD hoạt động tốt), Giai đoạn 2 đánh dấu lúc nhóm bắt tay vào code các tính năng thật sự.

Mục tiêu của Giai đoạn này là rèn luyện kỹ năng **Làm việc song song (Parallel Development)**, tức là không ai phải chờ ai. Chúng ta sẽ chọn ra 3 Use Case cơ bản nhất làm nền tảng trước khi đụng vào các phần khó (Đặt phòng / Thanh toán).

---

## 🎯 Mục Tiêu Chọn Lọc (Scope of Work)
Trong tuần này, nhóm sẽ giải quyết dứt điểm 3 Use Case sau (Dựa theo `docs/SRC.md`):
1.  **UC-01: Thiết lập bảng giá phòng** (Tính năng cơ bản: Thêm/Sửa data).
2.  **UC-03: Đánh dấu phòng đã dọn xong** (Tính năng cơ bản: Cập nhật trạng thái).
3.  **UC-04: Tra cứu phòng trống** (Tính năng độ khó khá: Thuật toán tìm kiếm theo thời gian).

---

## ⚔️ Phân Công Tác Chiến Song Song

### 1. Đội Dữ Liệu & Chất Lượng (Người 5 & 6)
**👤 Người số 5 (Database): Mở rộng nền móng**
*   **Hành động:** 
    *   Cập nhật lại file `schema.sql` để tạo đầy đủ các bảng thật: `Room_Category` (Loại phòng), `Room` (Phòng), `Price_List` (Bảng giá), `Booking` (Phiếu đặt phòng).
    *   Tạo script `seed_data.sql` bơm vào khoảng 50 phòng khác nhau, cài sẵn vài cái `Booking` giả lập để tý nữa test UC-04 (Tra cứu phòng trống) xem nó có lọc đúng không.
    *   Viết code Java tạo đủ 4 `Entity` và 4 `Repository` tương ứng.

**👤 Người số 6 (QA & Git Master): Trăng sao soi đường**
*   **Hành động:**
    *   Trong lúc mọi người đang code, bạn lấy Excel ra ngồi viết Test Case cho UC-01 và UC-04.
    *   Đặc biệt nghĩ ra các kịch bản hóc búa cho **UC-04**: *Khách tra cứu ngày đi trước ngày đến (Lỗi EF-2), khách tra cứu vào khoảng thời gian phòng đang bảo trì...*
    *   Duyệt các Pull Request (PR) hằng ngày của anh em để đảm bảo code không bị thiu.

### 2. Đội Backend (Người 3 & 4)
*Thay vì đợi Database, hai bạn chỉ cần thống nhất với Frontend 1 cái file JSON giả định (API Contract) là có thể code ngay!*

**👤 Người số 3 (Core Logic): "Gánh" thuật toán**
*   **Hành động:** Tập trung viết 3 class `PriceListService`, `RoomService`.
*   **Điểm nóng:** Cần dồn não cho hàm `findAvailableRooms(Date from, Date to)`. Phải viết câu truy vấn kiểm tra xem trong khoảng `from` đến `to` đó, phòng nào chưa nằm trong bất kỳ cái `Booking` nào thì mới được lấy ra.

**👤 Người số 4 (Controller & Validate): Người gác cổng**
*   **Hành động:** Viết 3 class Controller tiếp nhận API.
*   **Điểm nóng:** Phải bắt thật chặt các lỗi đầu vào theo Exception Flow:
    *   Bắt lỗi `EF-1` của UC-01: Nhập giá bị trùng khoảng ngày -> ném ra status 400 Bad Request.
    *   Bắt lỗi `EF-2` của UC-04: Validate ngày `from` không được lớn hơn ngày `to`.

### 3. Đội Frontend (Người 1 & 2)
*Không cần đợi Backend code xong API. Hai bạn cứ tự chế ra dữ liệu giả (Mock JSON) để đổ lên màn hình trước.*

**👤 Người số 1 (UI/UX Layout): Họa sĩ**
*   **Hành động:** Vẽ 3 màn hình bằng TailwindCSS:
    *   Trang chủ: Có form nhập "Ngày đến - Ngày đi" và nút [Tìm Phòng].
    *   Màn hình danh sách các thẻ (Card) phòng đang trống (hiện ảnh, loại phòng, giá).
    *   Màn hình Admin: Dashboard có danh sách phòng để cô lao công bấm nút [Check Đã Dọn]. Form để quản lý nhập giá phòng.

**👤 Người số 2 (Logic & API): Kỹ sư lắp ráp**
*   **Hành động:** 
    *   Bắt sự kiện (onChange) khi người dùng chọn ngày tháng trên lịch.
    *   Viết logic chặn lỗi phía Client (Frontend cũng phải báo lỗi nếu người dùng cố tình nhập ngày đi trước ngày đến).
    *   Gọi `fetch` (hoặc `axios`) nối vào các API mà Người 4 đang viết.
    *   Đổ dữ liệu lên các UI Component mà Người 1 vừa vẽ xong.

---

## 🏆 Kịch Bản Giao Ban Cuối Giai Đoạn 2
Kết thúc Giai đoạn 2 (Khoảng 1-1.5 tuần), nhóm tiến hành Review Code chéo:
1.  **Frontend bật màn hình lên:** Nhập thử ngày tháng bị ngược -> Frontend báo lỗi đỏ chót (Test Client).
2.  **Nhập đúng ngày:** Bấm [Tìm kiếm], bảng danh sách các phòng trống hiện ra mượt mà, đúng với dữ liệu mà Người số 5 đã bơm vào Database.
3.  **Đăng nhập tài khoản buồng phòng:** Bấm vào phòng số 101 chọn "Đã dọn" -> Màu phòng trên màn hình tự động chuyển sang Xanh lá cây.

Làm xong 3 tính năng này, bộ khung dữ liệu của dự án đã vững như bàn thạch. Giai đoạn 3 sau đó chỉ việc đắp thêm Luồng Đặt Phòng (UC-05) và Thanh Toán (UC-08) lên là dự án hoàn thành!
