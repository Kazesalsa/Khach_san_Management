# 📄 Tài Liệu Đặc Tả Yêu Cầu (SRC / Use Case Specifications)

Tài liệu này đặc tả chi tiết 12 trường của các Use Case (UC) thuộc hệ thống Quản lý Khách sạn Sương Mai, làm cơ sở cho quá trình phát triển (Backend, Frontend) và Kiểm thử (Testing) bám sát tài liệu đặc tả mẫu.

---

## 1. UC-01: Thiết lập bảng giá phòng
| Trường | Nội dung |
| :--- | :--- |
| **1. Use Case ID** | UC-01 |
| **2. Tên Use Case** | Thiết lập bảng giá phòng |
| **3. Mô tả ngắn** | Cho phép Chủ khách sạn thiết lập và quản lí giá phòng theo từng loại phòng và từng khoảng thời gian nhằm áp dụng mức giá phù hợp theo mùa và hạn chế sai sót khi tính giá phòng. |
| **4. Actor chính** | Chủ khách sạn |
| **5. Actor phụ** | Không có |
| **6. Pre-condition** | - Chủ khách sạn đã đăng nhập thành công vào hệ thống.<br>- Chủ khách sạn có quyền quản lý bảng giá phòng.<br>- Danh sách loại phòng đã tồn tại trong hệ thống. |
| **7. Trigger** | Chủ khách sạn chọn chức năng “Thiết lập bảng giá phòng”. |
| **8. Main Flow** | 1. Chủ khách sạn chọn chức năng “Thiết lập bảng giá phòng”.<br>2. Hệ thống hiển thị danh sách các bảng giá phòng hiện có.<br>3. Chủ khách sạn chọn chức năng tạo bảng giá mới.<br>4. Hệ thống hiển thị thông tin cần thiết để thiết lập bảng giá.<br>5. Chủ khách sạn chọn loại phòng, nhập khoảng thời gian áp dụng và mức giá tương ứng.<br>6. Chủ khách sạn xác nhận lưu bảng giá.<br>7. Hệ thống kiểm tra tính hợp lệ của thông tin bảng giá.<br>8. Hệ thống kiểm tra các đặt phòng đã được xác nhận có liên quan đến loại phòng và khoảng thời gian đang cập nhật.<br>9. Hệ thống lưu bảng giá phòng vào hệ thống.<br>10. Hệ thống thông báo thiết lập bảng giá thành công.<br>11. Hệ thống hiển thị bảng giá vừa được tạo trong danh sách bảng giá. |
| **9. Alternative Flow** | **AF-1: Chỉnh sửa bảng giá phòng hiện có**<br>1a. Tại bước 3, Chủ khách sạn chọn một bảng giá phòng hiện có để chỉnh sửa thay vì tạo bảng giá mới.<br>1b. Hệ thống hiển thị thông tin của bảng giá đã chọn.<br>1c. Chủ khách sạn thay đổi thông tin cần thiết của bảng giá.<br>1d. Chủ khách sạn xác nhận lưu thay đổi.<br>1e. Hệ thống kiểm tra tính hợp lệ của thông tin đã chỉnh sửa.<br>1f. Hệ thống cập nhật bảng giá phòng.<br>1g. Hệ thống thông báo cập nhật bảng giá thành công.<br>1h. Hệ thống hiển thị bảng giá đã được cập nhật trong danh sách.<br><br>**AF-2: Phát sinh đặt phòng trong khi cập nhật bảng giá**<br>2a. Tại bước 8, hệ thống phát hiện có đặt phòng đã được xác nhận liên quan đến loại phòng và khoảng thời gian đang được chỉnh sửa.<br>2b. Hệ thống giữ nguyên mức giá đã ghi nhận của các đặt phòng được xác nhận trước thời điểm cập nhật bảng giá.<br>2c. Hệ thống thông báo cho Chủ khách sạn rằng bảng giá mới không làm thay đổi giá của các đặt phòng đã được xác nhận trước đó.<br>2d. Chủ khách sạn xác nhận tiếp tục cập nhật bảng giá.<br>2e. Quay lại bước 9 của Main Flow để lưu bảng giá mới. |
| **10. Exception Flow** | **EF-1: Bảng giá bị trùng khoảng ngày và loại phòng**<br>1a. Tại bước 7, hệ thống phát hiện đã tồn tại bảng giá có cùng loại phòng và khoảng ngày bị trùng với thông tin Chủ khách sạn đang thiết lập.<br>1b. Hệ thống thông báo rằng bảng giá bị trùng với bảng giá đã tồn tại.<br>1c. Hệ thống không lưu bảng giá mới.<br>1d. Chủ khách sạn điều chỉnh lại loại phòng hoặc khoảng thời gian áp dụng.<br>1e. Quay lại bước 6 để xác nhận lưu bảng giá.<br><br>**EF-2: Không thể lưu bảng giá**<br>2a. Tại bước 9, hệ thống gặp lỗi khi lưu thông tin bảng giá.<br>2b. Hệ thống thông báo “Không thể lưu bảng giá. Vui lòng thử lại.”<br>2c. Bảng giá mới không được ghi nhận vào hệ thống.<br>2d. Use Case kết thúc không thành công. |
| **11. Post-condition** | - Thông tin bảng giá mới hoặc đã chỉnh sửa được lưu thành công trong hệ thống.<br>- Dữ liệu bảng giá trong hệ thống được cập nhật theo thông tin mới nhất. |
| **12. NFR liên quan** | - NFR-Security-01: Chỉ tài khoản có quyền quản lý bảng giá phòng mới được phép thêm, sửa hoặc xóa bảng giá.<br>- NFR-Usability-01: Giao diện thiết lập bảng giá phải rõ ràng, dễ thao tác và giúp Chủ khách sạn hạn chế sai sót khi nhập loại phòng, khoảng thời gian áp dụng và mức giá. |

---

## 2. UC-02: Xem báo cáo doanh thu
| Trường | Nội dung |
| :--- | :--- |
| **1. Use Case ID** | UC-02 |
| **2. Tên Use Case** | Xem báo cáo doanh thu |
| **3. Mô tả ngắn** | Cho phép Chủ khách sạn xem doanh thu theo loại phòng và khoảng thời gian để theo dõi tình hình kinh doanh và hỗ trợ việc đưa ra quyết định quản lý. |
| **4. Actor chính** | Chủ khách sạn |
| **5. Actor phụ** | Không có |
| **6. Pre-condition** | - Chủ khách sạn đã đăng nhập thành công vào hệ thống.<br>- Chủ khách sạn có quyền xem báo cáo doanh thu.<br>- Hệ thống đã có dữ liệu doanh thu được ghi nhận từ các giao dịch/đặt phòng trước đó. |
| **7. Trigger** | Chủ khách sạn chọn chức năng “Xem báo cáo doanh thu”. |
| **8. Main Flow** | 1. Chủ khách sạn chọn chức năng “Xem báo cáo doanh thu”.<br>2. Hệ thống hiển thị giao diện báo cáo doanh thu.<br>3. Hệ thống hiển thị các tiêu chí lọc báo cáo.<br>4. Chủ khách sạn chọn khoảng thời gian cần xem.<br>5. Chủ khách sạn chọn loại phòng cần xem doanh thu.<br>6. Chủ khách sạn chọn chức năng “Xem báo cáo”.<br>7. Hệ thống kiểm tra tính hợp lệ của các tiêu chí đã chọn.<br>8. Hệ thống truy xuất dữ liệu doanh thu phù hợp.<br>9. Hệ thống tổng hợp doanh thu theo khoảng thời gian và loại phòng đã chọn.<br>10. Hệ thống hiển thị kết quả báo cáo doanh thu. |
| **9. Alternative Flow** | **AF-1: Xem doanh thu của tất cả loại phòng**<br>1a. Tại bước 5, Chủ khách sạn không chọn một loại phòng cụ thể mà chọn “Tất cả loại phòng”.<br>1b. Hệ thống ghi nhận tiêu chí xem doanh thu cho tất cả loại phòng.<br>1c. Chủ khách sạn chọn chức năng “Xem báo cáo”.<br>1d. Hệ thống truy xuất và tổng hợp doanh thu của tất cả loại phòng trong khoảng thời gian đã chọn.<br>1e. Hệ thống hiển thị báo cáo doanh thu tổng hợp.<br>1f. Use Case kết thúc thành công. |
| **10. Exception Flow** | **EF-1: Không có dữ liệu doanh thu trong khoảng thời gian đã chọn**<br>1a. Tại bước 8, hệ thống không tìm thấy dữ liệu doanh thu phù hợp với khoảng thời gian và loại phòng đã chọn.<br>1b. Hệ thống thông báo “Không có dữ liệu doanh thu phù hợp với tiêu chí đã chọn.”<br>1c. Hệ thống không tạo báo cáo doanh thu cho tiêu chí đã chọn.<br>1d. Chủ khách sạn thay đổi khoảng thời gian hoặc loại phòng.<br>1e. Quay lại bước 6 của Main Flow.<br><br>**EF-2: Khoảng thời gian không hợp lệ**<br>2a. Tại bước 7, hệ thống phát hiện ngày bắt đầu lớn hơn ngày kết thúc.<br>2b. Hệ thống thông báo “Khoảng thời gian không hợp lệ. Vui lòng kiểm tra lại.”<br>2c. Hệ thống không thực hiện truy xuất dữ liệu doanh thu.<br>2d. Chủ khách sạn nhập lại khoảng thời gian hợp lệ.<br>2e. Quay lại bước 6 để thực hiện xem báo cáo. |
| **11. Post-condition** | - Dữ liệu doanh thu theo khoảng thời gian và loại phòng đã chọn đã được hệ thống tổng hợp.<br>- Không có dữ liệu nghiệp vụ nào bị thay đổi sau khi thực hiện Use Case. |
| **12. NFR liên quan** | - NFR-Performance-01: Hệ thống phải hiển thị báo cáo doanh thu trong thời gian không quá 2 giây trong điều kiện bình thường và không quá 3 giây khi tải cao.<br>- NFR-Usability-01: Báo cáo doanh thu phải được trình bày rõ ràng, dễ theo dõi theo loại phòng và khoảng thời gian đã chọn. |

---

## 3. UC-03: Đánh dấu phòng đã dọn xong
| Trường | Nội dung |
| :--- | :--- |
| **1. Use Case ID** | UC-03 |
| **2. Tên Use Case** | Đánh dấu phòng đã dọn xong |
| **3. Mô tả ngắn** | Cho phép nhân viên (buồng phòng) đánh dấu phòng sau khi dọn xong. |
| **4. Actor chính** | Nhân viên buồng phòng |
| **5. Actor phụ** | Không có |
| **6. Pre-condition** | - Hệ thống đang chạy bình thường.<br>- Nhân viên đã đăng nhập thành công. |
| **7. Trigger** | Nhân viên chọn chức năng “Đánh dấu phòng đã dọn xong” |
| **8. Main Flow** | 1. Nhân viên chọn chức năng đánh dấu phòng đã dọn xong.<br>2. Hệ thống hiển thị các phòng chưa được đánh dấu.<br>3. Nhân viên chọn hoặc nhập mã phòng cần được đánh dấu.<br>4. Hệ thống hiển thị phòng tương ứng.<br>5. Nhân viên đánh dấu “Đã dọn xong”.<br>6. Hệ thống hiển thị thông báo “Đã đánh dấu thành công cho phòng XYZ”. |
| **9. Alternative Flow** | Không có |
| **10. Exception Flow** | **EF-1: Nhân viên nhập sai mã phòng**<br>1a. Tại bước 3, nhân viên nhập sai mã phòng.<br>1b. Hệ thống thông báo “Phòng không tồn tại”.<br>1c. Quay lại bước 3 cho phép nhập lại.<br><br>**EF-2: Mất kết nối tới CSDL giữa chừng**<br>2a. Tại bước 5, hệ thống không lưu được trạng thái phòng vào CSDL.<br>2b. Hệ thống hiển thị “Không thể cập nhật trạng thái phòng. Vui lòng thử lại sau.”<br>2c. Trạng thái phòng không được thay đổi.<br>2d. Use Case kết thúc không thành công.<br><br>**EF-3: Phòng cần dọn đã được đánh dấu trước đó**<br>3a. Tại bước 4, hệ thống hiển thị phòng tương ứng nhưng đang có trạng thái “Đã dọn”.<br>3b. Hệ thống thông báo: “Phòng này đã được đánh dấu dọn xong”.<br>3c. Nhân viên không thực hiện đánh dấu phòng.<br>3d. Use Case kết thúc. |
| **11. Post-condition** | Phòng XYZ được cập nhật trạng thái “Đã dọn xong” trong hệ thống. |
| **12. NFR liên quan** | NFR-Usability-01: Hoàn thành đánh dấu chỉ với 2 lần chạm. |

---

## 4. UC-04: Tra cứu phòng trống
| Trường | Nội dung |
| :--- | :--- |
| **1. Use Case ID** | UC-04 |
| **2. Tên Use Case** | Tra cứu phòng trống |
| **3. Mô tả ngắn** | Cho phép người dùng (lễ tân, khách đặt phòng) tra cứu phòng trống. |
| **4. Actor chính** | Lễ tân |
| **5. Actor phụ** | Khách đặt phòng |
| **6. Pre-condition** | - Hệ thống đang chạy bình thường.<br>- Người dùng đã đăng nhập thành công. |
| **7. Trigger** | Người dùng mở web và chọn chức năng “Tra cứu phòng trống” |
| **8. Main Flow** | 1. Người dùng chọn chức năng “Tra cứu phòng trống”.<br>2. Hệ thống kiểm tra thông tin phòng trống trong CSDL.<br>3. Hệ thống hiển thị danh sách các phòng còn trống.<br>4. Người dùng chọn một phòng để xem thông tin chi tiết nếu cần (Tham chiếu: UC-09: Xem chi tiết phòng). |
| **9. Alternative Flow** | **AF-1: Người dùng chỉ tra cứu danh sách phòng trống**<br>1a. Tại bước 3, người dùng không chọn phòng nào để xem chi tiết.<br>1b. Hệ thống giữ nguyên danh sách các phòng trống được hiển thị.<br>1c. Use Case kết thúc thành công. |
| **10. Exception Flow** | **EF-1: Mất kết nối CSDL giữa chừng**<br>1a. Tại bước 2, hệ thống không kết nối được với CSDL.<br>1b. Hệ thống báo lỗi “Hệ thống gặp trục trặc”.<br>1c. Use case kết thúc không thành công. |
| **11. Post-condition** | Hệ thống xác định được danh sách các phòng đang ở trạng thái Trống phù hợp với tiêu chí tra cứu. |
| **12. NFR liên quan** | - NFR-Usability-02: Tra cứu trong 2 thao tác.<br>- NFR-Performance-01: Thời gian tra cứu nhanh dưới 2s. |

---

## 5. UC-05: Đặt phòng
| Trường | Nội dung |
| :--- | :--- |
| **1. Use Case ID** | UC-05 |
| **2. Tên Use Case** | Đặt phòng |
| **3. Mô tả ngắn** | Cho phép nhân viên lễ tân thực hiện đặt phòng cho khách hàng theo ngày nhận phòng, ngày trả phòng và loại phòng được yêu cầu; hệ thống kiểm tra tình trạng phòng, ghi nhận thông tin đặt phòng và xác nhận đặt phòng cho khách. |
| **4. Actor chính** | Nhân viên lễ tân |
| **5. Actor phụ** | Khách hàng |
| **6. Pre-condition** | - Hệ thống đang hoạt động bình thường và có kết nối CSDL.<br>- Nhân viên lễ tân đã đăng nhập thành công vào hệ thống.<br>- Danh sách phòng và bảng giá phòng đã được thiết lập trong hệ thống. |
| **7. Trigger** | Khách hàng yêu cầu đặt phòng; nhân viên lễ tân chọn chức năng “Đặt phòng”. |
| **8. Main Flow** | 1. Nhân viên lễ tân chọn chức năng “Đặt phòng”.<br>2. Hệ thống hiển thị giao diện đặt phòng, gồm thông tin khách hàng, ngày nhận phòng, ngày trả phòng và loại phòng.<br>3. Nhân viên lễ tân nhập thông tin khách hàng và thời gian lưu trú.<br>4. Hệ thống kiểm tra các phòng còn trống trong khoảng thời gian khách yêu cầu.<br>5. Hệ thống hiển thị danh sách phòng phù hợp cùng thông tin loại phòng và giá phòng.<br>6. Nhân viên lễ tân chọn phòng phù hợp cho khách.<br>7. Hệ thống tính tiền phòng dự kiến dựa trên số ngày lưu trú và bảng giá hiện hành.<br>8. Nhân viên lễ tân xác nhận thông tin đặt phòng với khách hàng.<br>9. Nhân viên lễ tân xác nhận đặt phòng trên hệ thống.<br>10. Hệ thống tạo phiếu đặt phòng với mã đặt phòng duy nhất và trạng thái “Đã đặt”.<br>11. Hệ thống ghi nhận lịch đặt phòng và cập nhật tình trạng phòng tương ứng theo thời gian đặt.<br>12. Hệ thống hiển thị thông báo “Đặt phòng thành công” cùng mã đặt phòng. |
| **9. Alternative Flow** | **AF-1: Khách yêu cầu chọn loại phòng khác**<br>1a. Tại bước 5, khách không đồng ý với loại phòng được hiển thị.<br>1b. Nhân viên lễ tân chọn lại loại phòng theo yêu cầu của khách.<br>1c. Hệ thống kiểm tra lại phòng trống.<br>1d. Quay lại bước 5 của Main Flow.<br><br>**AF-2: Khách muốn đặt nhiều phòng**<br>2a. Tại bước 6, khách yêu cầu đặt thêm phòng.<br>2b. Nhân viên lễ tân chọn thêm các phòng phù hợp.<br>2c. Hệ thống cập nhật danh sách phòng và tính lại tiền phòng dự kiến.<br>2d. Tiếp tục từ bước 8 của Main Flow.<br><br>**AF-3: Khách thay đổi ngày nhận/trả phòng**<br>3a. Tại bước 3, khách yêu cầu thay đổi thời gian lưu trú.<br>3b. Nhân viên lễ tân cập nhật ngày nhận phòng hoặc ngày trả phòng.<br>3c. Hệ thống kiểm tra lại phòng trống và tính lại tiền phòng.<br>3d. Tiếp tục từ bước 5 của Main Flow.<br><br>**AF-4: Phòng được chọn không còn khả dụng**<br>4a. Tại bước 9, hệ thống kiểm tra lại và phát hiện phòng đã được đặt bởi người khác trong khoảng thời gian yêu cầu.<br>4b. Hệ thống thông báo phòng không còn khả dụng.<br>4c. Nhân viên lễ tân chọn phòng khác trong danh sách phòng còn trống.<br>4d. Hệ thống cập nhật lại thông tin phòng và tiền phòng dự kiến.<br>4e. Tiếp tục từ bước 8 của Main Flow. |
| **10. Exception Flow** | **EF-1: Không có phòng trống**<br>1a. Tại bước 4, hệ thống không tìm thấy phòng phù hợp trong khoảng thời gian khách yêu cầu.<br>1b. Hệ thống hiển thị thông báo “Không có phòng trống trong khoảng thời gian đã chọn.”<br>1c. Nhân viên lễ tân thông báo cho khách.<br>1d. Khách hủy yêu cầu đặt phòng.<br>1e. Use case kết thúc không thành công.<br><br>**EF-2: Thông tin khách hàng không hợp lệ**<br>2a. Tại bước 3, hệ thống phát hiện thông tin khách hàng bị thiếu hoặc không hợp lệ.<br>2b. Hệ thống hiển thị thông báo yêu cầu bổ sung hoặc chỉnh sửa thông tin.<br>2c. Nhân viên lễ tân không thể bổ sung thông tin hợp lệ theo yêu cầu của khách.<br>2d. Khách hủy yêu cầu đặt phòng.<br>2e. Use case kết thúc không thành công.<br><br>**EF-3: Mất kết nối CSDL**<br>3a. Trong quá trình tạo phiếu đặt phòng, hệ thống không thể kết nối CSDL.<br>3b. Hệ thống hiển thị thông báo “Không thể thực hiện đặt phòng. Vui lòng thử lại sau.”<br>3c. Hệ thống không tạo phiếu đặt phòng và không thay đổi thông tin đặt phòng.<br>3d. Use case kết thúc không thành công. |
| **11. Post-condition** | - Một phiếu đặt phòng mới được tạo với mã đặt phòng duy nhất.<br>- Thông tin khách hàng, phòng, ngày nhận phòng và ngày trả phòng được lưu vào CSDL.<br>- Lịch đặt phòng được ghi nhận trong hệ thống và phòng tương ứng được cập nhật theo thời gian đặt. |
| **12. NFR liên quan** | - NFR-Performance-01: Kết quả kiểm tra phòng trống được hiển thị trong thời gian không quá 2 giây.<br>- NFR-Reliability-01: Không được tạo trùng phiếu đặt phòng khi xảy ra lỗi hoặc mất kết nối CSDL.<br>- NFR-Security-01: Chỉ nhân viên lễ tân đã đăng nhập mới được thực hiện chức năng đặt phòng. |

---

## 6. UC-06: Check-in Khách
| Trường | Nội dung |
| :--- | :--- |
| **1. Use Case ID** | UC-6 |
| **2. Tên Use Case** | Check-in khách |
| **3. Mô tả ngắn** | Cho phép lễ tân thực hiện thủ tục nhận phòng cho khách có đặt phòng hợp lệ, kiểm tra thông tin khách và tình trạng phòng, sau đó cập nhật trạng thái nhận phòng trong hệ thống. |
| **4. Actor chính** | Lễ tân ca ngày |
| **5. Actor phụ** | Không có |
| **6. Pre-condition** | - Lễ tân đã đăng nhập và có quyền thực hiện check-in.<br>- Khách có thông tin đặt phòng hợp lệ và chưa check-in.<br>- Hệ thống đang kết nối CSDL bình thường. |
| **7. Trigger** | Khách đến khách sạn và lễ tân chọn chức năng “Check-in khách” |
| **8. Main Flow** | 1. Lễ tân chọn chức năng “Check-in khách”<br>2. Hệ thống yêu cầu lễ tân nhập mã đặt phòng hoặc thông tin của khách hàng<br>3. Lễ tân nhập thông tin mã đặt phòng hoặc thông tin của khách<br>4. Hệ thống tra cứu hồ sơ khách hàng (Tham chiếu UC-18: Tra cứu hồ sơ khách hàng)<br>5. Hệ thống hiển thị thông tin khách và thông tin đặt phòng<br>6. Hệ thống kiểm tra thông tin dọn dẹp của phòng được bố trí (Tham chiếu UC-13: Xem tình trạng dọn dẹp phòng)<br>7. Lễ tân đối chiếu thông tin khách và thông tin đặt phòng và xác nhận check-in.<br>8. Hệ thống cập nhật trạng thái đặt phòng thành “Đã nhận phòng” và trạng thái phòng thành “Đang có khách”<br>9. Hệ thống lưu thời gian check-in và nhân viên thực hiện<br>10. Hệ thống thông báo check-in thành công |
| **9. Alternative Flow** | **AF-1: Khách không nhớ mã đặt phòng**<br>1a. Tại bước 2, khách công cung cấp được mã đặt phòng<br>1b. Lễ tân nhập số điện thoại/CCCD/Hộ chiếu của khách.<br>1c. Hệ thống tra cứu hồ sơ khách hàng<br>1d. Nếu tìm thấy phòng hợp lệ, tiếp tục từ bước 5 Main Flow |
| **10. Exception Flow** | **EF-1: Không tìm thấy đặt phòng**<br>1a. Tại bước 4, hệ thống không tìm thấy hồ sơ phù hợp<br>1b. Thông báo cho lễ tân<br>1c. Use case kết thúc không thành công<br><br>**EF-2: Phòng chưa dọn xong**<br>2a. Tại bước 6, phòng có trạng thái chưa sẵn sàng<br>2b. Hệ thống thông báo “Phòng chưa sẵn sàng để nhận khách”<br>2c. Chưa thực hiện check-in<br><br>**EF-3: Đặt phòng đã check-in hoặc đã hủy**<br>3a. Hệ thống thông báo trạng thái đặt phòng không hợp lệ<br>3b. không cho phép check-in.<br><br>**EF-4: Mất kết nối CSDL**<br>4a. Hệ thống không truy xuất/cập nhật được dữ liệu<br>4b. Thông báo lỗi<br>4c. Check-in không hoàn tất. |
| **11. Post-condition** | - Đặt phòng được cập nhật sang trạng thái “Đã nhận phòng”.<br>- Phòng được cập nhật sang trạng thái “Đang có khách”.<br>- Thời gian check-in và lễ tân thực hiện được lưu trong hệ thống. |
| **12. NFR liên quan** | - NFR-Performance-01: Việc tra cứu và xác nhận check-in phản hồi trong khoảng <= 2 giây ở điều kiện bình thường.<br>- NFR-Security-01: Chỉ nhân viên lễ tân có quyền mới được thực hiện check-in.<br>- NFR-Audit-01: Hệ thống lưu lịch sử thao tác check-in. |

---

## 7. UC-07: Check-out Khách
| Trường | Nội dung |
| :--- | :--- |
| **1. Use Case ID** | UC-07 |
| **2. Tên Use Case** | Check-out khách |
| **3. Mô tả ngắn** | Cho phép lễ tân thực hiện quy trình trả phòng, tổng hợp các chi phí và cập nhập trạng thái phòng sang phòng cần dọn dẹp |
| **4. Actor chính** | Lễ tân (lễ tân ca đêm và ca ngày) |
| **5. Actor phụ** | Khách hàng, Máy in hóa đơn. |
| **6. Pre-condition** | - Lễ tân đăng nhập vào hệ thống.<br>- Phòng của khách đang ở trạng thái cư trú<br>- Bảng giá phòng, chi phí dịch vụ và ghi nhận các tiêu dùng đã được hiển thị trên hệ thống |
| **7. Trigger** | Khách hàng đến lễ tân yêu cầu trả phòng hoặc đến khung giờ trả phòng đã đặt trước đó |
| **8. Main Flow** | 1. Lễ tân chọn chức năng “check-out khách” và chọn phòng cần trả<br>2. Hệ thống gọi chức năng chốt hóa đơn để tính tiền và xử lý thanh toán (UC chốt hóa đơn).<br>3. Sau khi hóa đơn được thanh toán thành công, Lễ tân nhận lại chìa khóa/thẻ phòng từ khách và bấm xác nhận hoàn tất check-out.<br>4. Hệ thống cập nhật trạng thái phòng thành "Cần dọn dẹp".<br>5. Hệ thống hiển thị thông báo check-out thành công. |
| **9. Alternative Flow** | **AF-1: Check-out nhanh theo đoàn**<br>1a. Tại bước 1, Lễ tân chọn cùng lúc nhiều phòng thuộc cùng một đoàn khách.<br>1b. Hệ thống chuyển sang xử lý gộp hóa đơn theo UC Chốt hóa đơn.<br>1c. Sau khi thanh toán xong, hệ thống cập nhật trạng thái "Cần dọn dẹp" cho toàn bộ các phòng trong đoàn. |
| **10. Exception Flow** | **EF-1: Hóa đơn chưa thanh toán thành công**<br>1a. Tại bước 2, quy trình tại UC Chốt hóa đơn bị hủy hoặc thanh toán thất bại.<br>1b. Hệ thống dừng quy trình check-out, giữ nguyên trạng thái phòng đang có khách.<br><br>**EF-2: Lỗi kết nối CSDL khi đổi trạng thái phòng**<br>2a. Tại bước 4, hệ thống không cập nhật được trạng thái phòng.<br>2b. Hệ thống hiển thị thông báo lỗi và yêu cầu Lễ tân cập nhật lại trạng thái phòng thủ công. |
| **11. Post-condition** | - Trạng thái đặt phòng chuyển sang "Đã trả phòng / Checked-out".<br>- Trạng thái phòng chuyển sang "Cần dọn dẹp" (sẵn sàng cho use case Xem danh sách phòng cần dọn). |
| **12. NFR liên quan** | - NFR-Performance: Hoàn tất cập nhật trạng thái phòng dưới 2 giây.<br>- NFR-Integrity: Trạng thái phòng chỉ được phép chuyển sang "Cần dọn dẹp" khi UC Chốt hóa đơn đã hoàn tất thành công. |

---

## 8. UC-08: Chốt hóa đơn
| Trường | Nội dung |
| :--- | :--- |
| **1. Use Case ID** | UC-08 |
| **2. Tên Use Case** | Chốt hóa đơn |
| **3. Mô tả ngắn** | Cho phép lễ tân tổng hợp các chi phí lưu trú, khấu trừ tiền cọc đã ghi nhận, xác định số tiền khách còn phải thanh toán, ghi nhận trạng thái thanh toán và chốt hóa đơn để quy trình check-out tiếp tục. |
| **4. Actor chính** | Lễ tân (lễ tân ca ngày và ca đêm) |
| **5. Actor phụ** | Khách hàng |
| **6. Pre-condition** | - Lễ tân đã đăng nhập và có quyền thực hiện nghiệp vụ chốt hóa đơn.<br>- Khách có hồ sơ lưu trú/đặt phòng hợp lệ và chưa hoàn tất check-out.<br>- Bảng giá phòng, các khoản dịch vụ phát sinh và tiền cọc (nếu có) đã được ghi nhận.<br>- Hệ thống đang kết nối CSDL bình thường. |
| **7. Trigger** | Khách yêu cầu trả phòng; từ quy trình check-out, lễ tân chọn chức năng “Chốt hóa đơn”. |
| **8. Main Flow** | 1. Lễ tân chọn chức năng “Chốt hóa đơn” cho hồ sơ/phòng đang thực hiện check-out.<br>2. Hệ thống truy xuất thông tin lưu trú, bảng giá áp dụng, các khoản dịch vụ phát sinh và tiền cọc đã ghi nhận.<br>3. Hệ thống tính tổng chi phí và số tiền khách còn phải thanh toán sau khi khấu trừ tiền cọc (nếu có).<br>4. Hệ thống hiển thị chi tiết hóa đơn gồm tiền phòng, dịch vụ, tiền cọc và số tiền còn phải thanh toán.<br>5. Lễ tân đối chiếu các khoản trên hóa đơn và xác nhận số tiền cuối cùng với khách hàng.<br>6. Khách hàng thực hiện thanh toán; lễ tân xác nhận đã nhận đủ số tiền.<br>7. Hệ thống thực hiện use case “Ghi nhận trạng thái thanh toán” để lưu trạng thái và phương thức thanh toán. (Tham chiếu: Use Case “Ghi nhận trạng thái thanh toán”).<br>8. Hệ thống lưu hóa đơn với trạng thái “Đã chốt/Đã thanh toán”, thời gian chốt và lễ tân thực hiện.<br>9. Hệ thống thông báo chốt hóa đơn thành công và trả kết quả về quy trình Check-out khách. |
| **9. Alternative Flow** | **AF-1: Khách đã đặt cọc trước**<br>1a. Tại bước 2, hệ thống phát hiện hồ sơ có khoản tiền cọc hợp lệ.<br>1b. Hệ thống khấu trừ tiền cọc và tính lại số tiền còn phải thanh toán.<br>1c. Tiếp tục từ bước 4 của Main Flow.<br><br>**AF-2: Khách thanh toán bằng chuyển khoản**<br>2a. Tại bước 6, khách chọn thanh toán bằng chuyển khoản thay vì tiền mặt.<br>2b. Khách thực hiện chuyển khoản; lễ tân xác nhận đã nhận đủ tiền.<br>2c. Tiếp tục từ bước 7 của Main Flow. |
| **10. Exception Flow** | **EF-1: Dữ liệu chi phí chưa đầy đủ hoặc không hợp lệ**<br>1a. Tại bước 2 hoặc 3, hệ thống phát hiện thiếu/sai dữ liệu cần thiết để tính hóa đơn.<br>1b. Hệ thống thông báo cho lễ tân và không cho phép chốt hóa đơn.<br>1c. Use case kết thúc không thành công.<br><br>**EF-2: Thanh toán chưa hoàn tất**<br>2a. Tại bước 6, lễ tân chưa thể xác nhận đã nhận đủ số tiền phải thu.<br>2b. Hệ thống giữ hóa đơn ở trạng thái “Chưa thanh toán/Chưa chốt”.<br>2c. Quy trình Check-out khách chưa được phép hoàn tất; use case kết thúc không thành công.<br><br>**EF-3: Mất kết nối CSDL khi lưu hóa đơn**<br>3a. Tại bước 8, hệ thống không thể lưu hóa đơn hoặc trạng thái thanh toán.<br>3b. Hệ thống thông báo “Không thể chốt hóa đơn. Vui lòng thử lại.”<br>3c. Hệ thống không đánh dấu hóa đơn là đã chốt; use case kết thúc không thành công. |
| **11. Post-condition** | - Hóa đơn cuối cùng được lưu với tổng chi phí, tiền cọc đã khấu trừ, số tiền thanh toán và trạng thái “Đã chốt/Đã thanh toán”.<br>- Trạng thái và phương thức thanh toán được ghi nhận để phục vụ đối chiếu doanh thu.<br>- Thời gian chốt hóa đơn và lễ tân thực hiện được lưu; quy trình Check-out khách có thể tiếp tục. |
| **12. NFR liên quan** | - NFR-Performance-01: Hệ thống tổng hợp và hiển thị hóa đơn trong thời gian không quá 2 giây ở điều kiện bình thường.<br>- NFR-Security-01: Chỉ tài khoản lễ tân có quyền mới được phép xác nhận và chốt hóa đơn.<br>- NFR-Integrity-01: Không tạo hóa đơn chốt trùng và không ghi nhận “Đã thanh toán” khi chưa xác nhận đủ số tiền phải thu.<br>- NFR-Audit-01: Lưu lịch sử chốt hóa đơn gồm số tiền, phương thức thanh toán, thời gian và nhân viên thực hiện. |
