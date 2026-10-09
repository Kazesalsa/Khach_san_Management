CREATE TABLE IF NOT EXISTS system_status (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL
);

DO $$ BEGIN
    CREATE TYPE vai_tro_tk_enum AS ENUM ('CHU_KHACH_SAN', 'LE_TAN', 'NHAN_VIEN_BUONG', 'KHACH_HANG');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS tai_khoan (
    id VARCHAR(36) PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    vai_tro vai_tro_tk_enum NOT NULL,
    trang_thai VARCHAR(20) DEFAULT 'HOAT_DONG' NOT NULL
);

CREATE TABLE IF NOT EXISTS nhan_vien (
    ma_nhan_vien VARCHAR(36) PRIMARY KEY,
    tai_khoan_id VARCHAR(36) UNIQUE,
    ho_nv VARCHAR(50) NOT NULL,
    ten_nv VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS khach_hang (
    id VARCHAR(36) PRIMARY KEY,
    tai_khoan_id VARCHAR(36) UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15) UNIQUE NOT NULL,
    cccd_ho_chieu VARCHAR(20) UNIQUE,
    email VARCHAR(150),
    so_thich_phong VARCHAR(255),
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);
