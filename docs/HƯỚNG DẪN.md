# 🏨 HƯỚNG DẪN SETUP DỰ ÁN KHÁCH SẠN SƯƠNG MAI

## 📋 Mục Lục
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt Docker](#cài-đặt-docker)
3. [Khởi động Database](#khởi-động-database)
4. [Cấu hình pgAdmin](#cấu-hình-pgadmin)
5. [Chạy Backend](#chạy-backend)
6. [Chạy Frontend](#chạy-frontend)
7. [Quản lý Docker](#quản-lý-docker)
8. [Troubleshooting](#troubleshooting)

---

## 🖥️ Yêu cầu Hệ thống

### Phần mềm cần cài đặt:
- ✅ **Docker Desktop** (Latest version)
- ✅ **Java JDK 17+** (cho backend Spring Boot)
- ✅ **Node.js 18+** (cho frontend React)
- ✅ **Git**

### Kiểm tra phiên bản:
```bash
docker --version
java -version
node --version
npm --version
```

---

## 🐳 Cài đặt Docker

### **Bước 1: Cài đặt WSL2 (Windows Subsystem for Linux)**

Mở **PowerShell** với quyền **Administrator** và chạy:

```powershell
# Cài đặt WSL2
wsl --install

# Cập nhật WSL lên phiên bản mới nhất
wsl --update

# Khởi động lại WSL
wsl --shutdown
```

**Lưu ý:** Sau khi cài WSL, **khởi động lại máy tính**.

### **Bước 2: Cài đặt Docker Desktop**

1. Tải Docker Desktop: https://www.docker.com/products/docker-desktop
2. Chạy file cài đặt và làm theo hướng dẫn
3. Khởi động Docker Desktop
4. Kiểm tra cài đặt thành công:

```bash
docker --version
docker-compose --version
```

---

## 🚀 Khởi động Database

### **Bước 1: Di chuyển đến thư mục gốc dự án**

```bash
cd d:\Laptrinh-Java\Hotel_Management_Suong_Mai
```

### **Bước 2: Khởi động Docker Compose**

```bash
docker-compose up -d
```

**Giải thích:**
- `up`: Khởi động các services
- `-d`: Chạy ở chế độ background (detached mode)

### **Bước 3: Kiểm tra containers đang chạy**

```bash
docker ps
```

Bạn sẽ thấy 2 containers:
```
CONTAINER ID   IMAGE                    PORTS                    NAMES
xxxxxxxxxxxx   postgres:16-alpine       0.0.0.0:5432->5432/tcp   suongmai_postgres
xxxxxxxxxxxx   dpage/pgadmin4:latest    0.0.0.0:5050->80/tcp     suongmai_pgadmin
```

---

## 🔐 Thông tin Kết nối

### 📌 **PostgreSQL Database:**

| Thông số | Giá trị |
|----------|---------|
| **Host** | `localhost` |
| **Port** | `5432` |
| **Database** | `khach_san_suong_mai` |
| **Schema** | `khach_san_suong_mai` |
| **Username** | `postgres` |
| **Password** | `rootpassword` |

### 📌 **pgAdmin (Giao diện quản trị web):**

| Thông số | Giá trị |
|----------|---------|
| **URL** | http://localhost:5050 |
| **Email** | `admin@hotel.com` |
| **Password** | `admin` |

---

## 🛠️ Cấu hình pgAdmin

### **Bước 1: Truy cập pgAdmin**

Mở trình duyệt và vào: http://localhost:5050

### **Bước 2: Đăng nhập**

- Email: `admin@hotel.com`
- Password: `admin`

### **Bước 3: Thêm Server**

1. Click **Add New Server**
2. Tab **General**:
   - Name: `Suong Mai Hotel`

3. Tab **Connection**:
   - Host name/address: `postgres` ⚠️ **(Dùng tên container, không phải localhost!)**
   - Port: `5432`
   - Maintenance database: `khach_san_suong_mai`
   - Username: `postgres`
   - Password: `rootpassword`

4. Click **Save**

### **Bước 4: Kiểm tra Schema**

- Mở: **Servers** → **Suong Mai Hotel** → **Databases** → **khach_san_suong_mai** → **Schemas** → **khach_san_suong_mai** → **Tables**

Bạn sẽ thấy các bảng:
- `khach_hang`
- `nhan_vien`
- `loai_phong`
- `phong`
- `bang_gia_phong`
- `phieu_dat_phong`
- `chi_tiet_dat_phong`
- `dich_vu`
- `hoa_don`
- `thanh_toan`
- ...và nhiều bảng khác

---

## ☕ Chạy Backend Spring Boot

### **Bước 1: Di chuyển vào thư mục backend**

```bash
cd backend
```

### **Bước 2: Chạy Spring Boot**

**Windows CMD:**
```cmd
mvnw.cmd spring-boot:run
```

**PowerShell / Git Bash:**
```bash
./mvnw spring-boot:run
```

### **Bước 3: Kiểm tra Backend**

- Backend sẽ chạy tại: http://localhost:8080
- Test API: http://localhost:8080/hello

**Log thành công:**
```
Started BackendApplication in X.XXX seconds
```

---

## ⚛️ Chạy Frontend React

### **Bước 1: Di chuyển vào thư mục frontend**

```bash
cd frontend
```

### **Bước 2: Cài đặt dependencies**

```bash
npm install
```

### **Bước 3: Chạy Development Server**

```bash
npm run dev
```

### **Bước 4: Truy cập Frontend**

- Frontend sẽ chạy tại: http://localhost:5173 (hoặc port khác nếu 5173 bị chiếm)

---

## 🎛️ Quản lý Docker

### **Xem logs của containers:**

```bash
# Xem logs PostgreSQL
docker logs suongmai_postgres

# Xem logs pgAdmin
docker logs suongmai_pgadmin

# Xem logs realtime (tất cả services)
docker-compose logs -f

# Xem logs chỉ PostgreSQL
docker-compose logs -f postgres
```

### **Dừng containers:**

```bash
# Dừng tất cả containers
docker-compose down

# Dừng và XÓA volumes (⚠️ Database sẽ mất toàn bộ dữ liệu!)
docker-compose down -v
```

### **Khởi động lại containers:**

```bash
# Khởi động lại
docker-compose restart

# Khởi động lại chỉ PostgreSQL
docker-compose restart postgres
```

### **Kiểm tra trạng thái containers:**

```bash
docker-compose ps
```

### **Vào bên trong container PostgreSQL:**

```bash
docker exec -it suongmai_postgres psql -U postgres -d khach_san_suong_mai
```

Sau đó có thể chạy SQL trực tiếp:
```sql
-- Kiểm tra các bảng
\dt khach_san_suong_mai.*;

-- Xem dữ liệu khách hàng
SELECT * FROM khach_san_suong_mai.khach_hang;

-- Thoát
\q
```

---

## 🗄️ Schema Database

File `database/init.sql` tự động tạo:

### **✅ 10+ Bảng chính:**

| Bảng | Mô tả |
|------|-------|
| `khach_hang` | Thông tin khách hàng |
| `khach_hang_vip` | Khách hàng VIP (VÀNG, BẠCH KIM) |
| `nhan_vien` | Nhân viên (CHỦ KHÁCH SẠN, LỄ TÂN, NHÂN VIÊN BUỒNG) |
| `loai_phong` | Loại phòng (Deluxe, Suite, Standard...) |
| `tien_nghi` | Tiện nghi (WiFi, TV, Điều hòa...) |
| `loai_phong_tien_nghi` | Mapping tiện nghi cho từng loại phòng |
| `loai_phong_hinh_anh` | Hình ảnh của loại phòng |
| `phong` | Danh sách phòng cụ thể (số phòng, tầng...) |
| `bang_gia_phong` | Bảng giá theo từng khoảng thời gian |
| `phieu_dat_phong` | Phiếu đặt phòng của khách |
| `chi_tiet_dat_phong` | Chi tiết đặt từng phòng |
| `chi_tiet_gia_phong` | Giá chi tiết theo từng ngày lưu trú |
| `dich_vu` | Dịch vụ (Giặt ủi, Ăn sáng, Spa...) |
| `su_dung_dich_vu` | Lịch sử sử dụng dịch vụ |
| `hoa_don` | Hóa đơn thanh toán |
| `thanh_toan` | Chi tiết thanh toán (tiền cọc, thanh toán hóa đơn, hoàn tiền) |

### **✅ View tổng hợp:**
- `v_tong_hop_hoa_don`: Tính tổng tiền phòng, dịch vụ, tiền cọc, số tiền còn lại

### **✅ Indexes được tối ưu** cho 10 truy vấn quan trọng

---

## ⚠️ Troubleshooting

### **1. Lỗi: Port 5432 đã được sử dụng**

**Nguyên nhân:** PostgreSQL đã cài đặt sẵn trên máy đang chạy.

**Giải pháp:**

```bash
# Kiểm tra process đang dùng port 5432
netstat -ano | findstr :5432

# Dừng PostgreSQL service (nếu có)
# Vào Services → Tìm PostgreSQL → Stop
```

Hoặc đổi port trong `docker-compose.yml`:
```yaml
postgres:
  ports:
    - "5433:5432"  # Đổi từ 5432 sang 5433
```

### **2. Lỗi: Docker Desktop không khởi động**

**Giải pháp:**
- Kiểm tra Virtualization đã bật trong BIOS
- Cài WSL2: `wsl --install`
- Khởi động lại máy tính

### **3. Lỗi: Database không có dữ liệu**

**Giải pháp:**

```bash
# Xóa toàn bộ và khởi động lại
docker-compose down -v
docker-compose up -d

# Kiểm tra logs
docker logs suongmai_postgres
```

### **4. Lỗi: Backend không kết nối được database**

**Kiểm tra:**
- Database đã chạy chưa: `docker ps`
- Thông tin kết nối trong `application.yaml` đúng chưa
- Port 5432 có bị chặn bởi Firewall không

### **5. Lỗi: pgAdmin không kết nối được PostgreSQL**

**Giải pháp:**
- ⚠️ **Quan trọng:** Dùng host `postgres` (tên container), KHÔNG dùng `localhost`
- Kiểm tra cả 2 containers đang chạy: `docker ps`

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs: `docker-compose logs -f`
2. Xem trạng thái: `docker-compose ps`
3. Khởi động lại: `docker-compose restart`

---

## 🎯 Tóm tắt các lệnh quan trọng

```bash
# Setup ban đầu
wsl --update
docker-compose up -d

# Kiểm tra
docker ps
docker-compose logs -f

# Chạy backend
cd backend
mvnw.cmd spring-boot:run

# Chạy frontend
cd frontend
npm install
npm run dev

# Dừng
docker-compose down

# Xóa hết (cẩn thận!)
docker-compose down -v
```

---

**Chúc bạn setup thành công! 🚀**