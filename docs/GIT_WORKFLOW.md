# 🔄 Quy Trình Quản Lý Phiên Bản (Git Workflow) & Tiêu Chuẩn Nộp Code

Tài liệu này quy định cách thức các thành viên trong nhóm 11 phân nhánh, viết commit và mở Pull Request để đảm bảo code luôn sạch, dễ bảo trì và hạn chế tối đa xung đột (conflict), tuân thủ đúng yêu cầu của môn Công nghệ Phần mềm.

---

## 1. Mô hình Phân nhánh (Branching Strategy)
Nhóm áp dụng mô hình **Git Flow rút gọn**, chia nhánh theo **Use Case (UC)**.

### 🔒 Các nhánh cố định (Bảo vệ)
Tuyệt đối **KHÔNG** push code trực tiếp lên 2 nhánh này. Mọi thay đổi phải thông qua Pull Request (PR).
*   `main`: Nhánh ổn định, chứa phiên bản hoàn chỉnh để nộp bài hoặc deploy lên production.
*   `develop`: Nhánh phát triển chính, nơi tích hợp code hằng ngày từ mọi người.

### 🌿 Các nhánh tạm thời (Ngắn hạn)
Sử dụng để làm chức năng mới hoặc sửa lỗi. Gộp (merge) xong là xoá.

| Loại nhánh | Mục đích | Tách từ | Cú pháp đặt tên | Ví dụ |
| :--- | :--- | :--- | :--- | :--- |
| **Feature** | Làm tính năng mới | `develop` | `feature/UC-XX-<mô-tả>` | `feature/UC-03-dat-mon` |
| **Fix** | Sửa lỗi chung | `develop` | `fix/<mô-tả>` | `fix/null-pointer-don-hang` |
| **Hotfix** | Sửa lỗi khẩn cấp | `main` | `hotfix/<mô-tả>` | `hotfix/payment-timeout` |
| **Docs** | Cập nhật tài liệu | `develop` | `docs/<mô-tả>` | `docs/bao-cao-nhom-11` |

*(Lưu ý: Tên nhánh viết chữ thường, phân cách bằng dấu gạch ngang `-`, không dùng tiếng Việt có dấu).*

---

## 2. Tiêu chuẩn viết Commit Message (Conventional Commits)
Sử dụng chuẩn Conventional Commits. Mỗi commit là một thay đổi logic duy nhất.

**Cú pháp:**
```text
<type>(<scope>): <mô tả ngắn gọn> (#UC-XX)
```

*   **`<type>`**: Loại thay đổi.
    *   `feat`: Thêm tính năng mới.
    *   `fix`: Sửa lỗi (bug).
    *   `refactor`: Sửa lại code cho đẹp/chuẩn hơn (không thêm chức năng hay sửa lỗi).
    *   `test`: Thêm hoặc cập nhật unit test/integration test.
    *   `docs`: Sửa tài liệu, README.
    *   `chore`: Cập nhật linh tinh (cấu hình, thư viện, build file).
*   **`<scope>`**: (Nên có) Phân hệ đang code, vd: `auth`, `order`, `ui-form`, `db`.
*   **`<mô tả>`**: Bắt đầu bằng chữ thường, là động từ chỉ hành động (vd: "thêm", "cập nhật", "xóa"), không có dấu chấm ở cuối.
*   **`(#UC-XX)`**: (Bắt buộc với tính năng) Gắn mã Use Case tương ứng.

**Ví dụ:**
*   ✅ Tốt: `feat(order): implement UC-03 addItem - business logic layer (#UC-03)`
*   ✅ Tốt: `fix(auth): xử lý lỗi token hết hạn không redirect (#UC-01)`
*   ❌ Sai: `update code` (Thiếu type, scope, ý nghĩa)
*   ❌ Sai: `Fix NullPointer` (Viết hoa chữ cái đầu, không có chuẩn)

---

## 3. Quy trình làm việc hằng ngày (7 Bước)

Bất cứ khi nào nhận làm một chức năng mới (Use Case mới), bạn phải thực hiện đúng luồng sau:

### Bước 1: Cập nhật nhánh gốc
```bash
git checkout develop
git pull origin develop
```

### Bước 2: Tạo nhánh tính năng mới
```bash
git checkout -b feature/UC-03-dat-mon
```

### Bước 3: Code và Commit
Sau khi code xong một chức năng nhỏ (không nên dồn cả tuần mới commit):
```bash
git add .
git commit -m "feat(order): tạo giao diện chọn món ăn (#UC-03)"
```

### Bước 4: Đồng bộ chống Conflict (Rất quan trọng)
Trong lúc bạn làm, có thể người khác đã gộp code lên `develop`. Bạn cần kéo code mới nhất về nhánh của mình.
```bash
git checkout develop
git pull origin develop
git checkout feature/UC-03-dat-mon

# Hợp nhất code (Rebase hoặc Merge)
git rebase develop 
# Nếu bị conflict -> mở file sửa lỗi -> git add . -> git rebase --continue
```

### Bước 5: Đẩy nhánh lên Remote
```bash
git push origin feature/UC-03-dat-mon
# (Nếu bạn dùng rebase ở Bước 4, bạn phải dùng: git push --force-with-lease origin feature/UC-03-dat-mon)
```

### Bước 6: Tạo Pull Request (PR)
*   Lên GitHub/GitLab tạo Pull Request từ nhánh của bạn vào nhánh `develop`.
*   Điền mô tả rõ ràng (làm được những gì, ảnh chụp màn hình UI nếu có).
*   Giao cho (Assign) ít nhất 1 thành viên khác vào mục Reviewers.

### Bước 7: Code Review & Gộp code (Merge)
*   Người Review vào xem code, để lại comment. Các loại nhãn comment thường dùng:
    *   `[BLOCKING]`: Sai nghiêm trọng, bắt buộc sửa mới cho merge.
    *   `[SUGGESTION]`: Gợi ý làm cách này sẽ tốt hơn.
    *   `[NIT]`: Lỗi vặt (thừa dấu cách, sai chính tả).
*   Nếu cần sửa, bạn code tiếp trên máy, commit và push lên (PR tự động nhận).
*   Khi PR được **Approve** và vượt qua Test tự động (CI Pass):
    *   Thực hiện gộp code (Khuyến khích dùng tính năng **Squash and Merge** để dọn dẹp lịch sử commit).
    *   Xoá nhánh `feature` sau khi hoàn thành.
