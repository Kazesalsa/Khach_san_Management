# Git Flow - Hướng dẫn quy trình làm việc với Git

Tài liệu này mô tả quy trình quản lý mã nguồn (Git Flow) cho dự án Khách sạn Management. Quy trình này giúp chia nhỏ công việc, quản lý các tính năng độc lập và hạn chế xung đột (conflict) code khi làm việc nhóm.

## 1. Cấu trúc các nhánh (Branches)

Dự án sử dụng các loại nhánh chính sau:

- **`main`**: Nhánh chứa mã nguồn ổn định nhất, đã hoàn thiện và sẵn sàng để deploy (release). **Chỉ merge vào nhánh này khi sản phẩm đã hoàn thành hoặc chuẩn bị release.**
- **`develop`**: Nhánh dùng để tích hợp các tính năng mới. Đây là nhánh làm việc chính của cả team. Mọi tính năng sau khi hoàn thiện sẽ được merge vào đây để kiểm thử.
- **`feature/uc-xx-tên-tính-năng`**: Nhánh dùng để phát triển một Use Case (UC) hoặc một tính năng cụ thể. Nhánh này được tạo ra từ nhánh `develop`.
- **`feature/uc-xx-tên-tính-năng/tên-subtask`**: Nhánh con của một feature, dành cho từng thành viên làm các nhiệm vụ nhỏ hơn (ví dụ: làm database, backend, frontend...). Nhánh này được tạo ra từ nhánh `feature/uc-xx-tên-tính-năng`.

## 2. Quy trình làm việc chi tiết (Workflow)

Giả sử team đang phát triển tính năng "Quản lý Phòng" (UC-01) và có các công việc nhỏ như thiết kế DB, code Backend, code Frontend.

### Bước 1: Tạo nhánh tính năng chính (Feature Branch)
Từ nhánh `develop`, người quản lý tính năng (hoặc team leader) sẽ tạo nhánh `feature/uc-01-quan-ly-phong`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/uc-01-quan-ly-phong
git push origin feature/uc-01-quan-ly-phong
```

### Bước 2: Tạo nhánh công việc phụ (Sub-feature Branch)
Các thành viên trong nhóm sẽ từ nhánh `feature/uc-01-quan-ly-phong` tạo ra nhánh con riêng để làm việc.

Ví dụ: **Làm phần Database cho tính năng này.**
```bash
git checkout feature/uc-01-quan-ly-phong
git pull origin feature/uc-01-quan-ly-phong
git checkout -b feature/uc-01-quan-ly-phong/db-booking
```

Các nhánh công việc khác cũng nên được đặt tên ngắn gọn mô tả nội dung:
- `feature/uc-01-quan-ly-phong/be-booking-api` (Làm Backend API cho chức năng)
- `feature/uc-01-quan-ly-phong/fe-booking-ui` (Làm Frontend Giao diện cho chức năng)

### Bước 3: Code và Commit
Thành viên code trên nhánh sub-feature của mình và thực hiện commit định kỳ:

```bash
git add .
git commit -m "feat(UC-01): Tạo bảng phòng và loại phòng"
git push origin feature/uc-01-quan-ly-phong/db-booking
```

### Bước 4: Merge Sub-feature vào Feature chính
Khi làm xong phần DB, thành viên phụ trách sẽ tạo Pull Request (hoặc merge trực tiếp nếu team thống nhất) từ nhánh `feature/uc-01-quan-ly-phong/db-booking` vào nhánh `feature/uc-01-quan-ly-phong`.

```bash
# Đứng ở nhánh feature chính
git checkout feature/uc-01-quan-ly-phong
git pull origin feature/uc-01-quan-ly-phong

# Merge nhánh DB vào nhánh feature chính
git merge feature/uc-01-quan-ly-phong/db-booking

# Đẩy code đã merge lên remote
git push origin feature/uc-01-quan-ly-phong
```

*(Lặp lại Bước 2, 3, 4 cho các thành viên làm BE, FE... cho đến khi toàn bộ tính năng UC-01 hoàn tất)*

### Bước 5: Merge Feature vào Develop
Khi toàn bộ tính năng `UC-01` đã được hoàn thành (frontend đã ghép nối API, test hoàn tất) trên nhánh `feature/uc-01-quan-ly-phong`, tiến hành tạo Pull Request để merge vào nhánh `develop`.

```bash
git checkout develop
git pull origin develop
git merge feature/uc-01-quan-ly-phong
git push origin develop
```

### Bước 6: Merge Develop vào Main (Khi hoàn thành sản phẩm)
Khi tất cả các tính năng đã xong, sản phẩm hoàn thiện và sẵn sàng release, nhánh `develop` sẽ được merge vào `main`.

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

## 3. Tóm tắt sơ đồ Flow
```text
main
 │
 └── develop
      │
      ├── feature/uc-01-quan-ly-phong
      │    │
      │    ├── feature/uc-01-quan-ly-phong/db-booking (Merge lại vào feature/uc-01-quan-ly-phong khi xong)
      │    ├── feature/uc-01-quan-ly-phong/be-booking-api (Merge lại vào feature/uc-01-quan-ly-phong khi xong)
      │    └── feature/uc-01-quan-ly-phong/fe-booking-ui (Merge lại vào feature/uc-01-quan-ly-phong khi xong)
      │    │
      │    └──> (Hoàn thành UC-01, merge vào develop)
      │
      ├── feature/uc-02-dat-phong
      │    │
      │    └──...
      │
      └──> (Hoàn thành toàn bộ dự án, test ổn định trên develop)
           │
           └── merge develop vào main -> RELEASE
```
