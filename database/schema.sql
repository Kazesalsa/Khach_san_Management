CREATE TABLE IF NOT EXISTS system_status (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS loai_phong (
    id VARCHAR(36) PRIMARY KEY,
    ten VARCHAR(100) UNIQUE NOT NULL,
    mo_ta TEXT,
    suc_chua_toi_da INT NOT NULL CHECK (suc_chua_toi_da > 0)
);

DO $$ BEGIN
    CREATE TYPE trang_thai_tien_nghi_enum AS ENUM ('HOAT_DONG', 'NGUNG_SU_DUNG');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS tien_nghi (
    id VARCHAR(36) PRIMARY KEY,
    ten VARCHAR(100) UNIQUE NOT NULL,
    mo_ta VARCHAR(255),
    trang_thai trang_thai_tien_nghi_enum DEFAULT 'HOAT_DONG' NOT NULL
);

CREATE TABLE IF NOT EXISTS loai_phong_tien_nghi (
    loai_phong_id VARCHAR(36) NOT NULL,
    tien_nghi_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (loai_phong_id, tien_nghi_id),
    FOREIGN KEY (loai_phong_id) REFERENCES loai_phong(id) ON DELETE CASCADE,
    FOREIGN KEY (tien_nghi_id) REFERENCES tien_nghi(id) ON DELETE RESTRICT
);

DO $$ BEGIN
    CREATE TYPE trang_thai_su_dung_enum AS ENUM ('TRONG', 'DA_DAT', 'DANG_O');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE trang_thai_don_dep_enum AS ENUM ('CHUA_DON', 'DANG_DON', 'DA_DON_XONG');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS phong (
    id VARCHAR(36) PRIMARY KEY,
    ma_phong VARCHAR(36) NOT NULL,
    so_phong VARCHAR(20) NOT NULL UNIQUE,
    tang INT NOT NULL,
    ma_loai_phong VARCHAR(36) NOT NULL,
    trang_thai_su_dung trang_thai_su_dung_enum NOT NULL,
    trang_thai_don_dep trang_thai_don_dep_enum NOT NULL,
    FOREIGN KEY (ma_loai_phong) REFERENCES loai_phong(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS phong_hinh_anh (
    id VARCHAR(36) PRIMARY KEY,
    url VARCHAR(255),
    thu_tu_hien_thi TEXT,
    la_anh_dai_dien VARCHAR(100),
    phong_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (phong_id) REFERENCES phong(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gia_phong (
    id VARCHAR(36) PRIMARY KEY,
    ma_loai_phong VARCHAR(36) NOT NULL,
    ngay_bat_dau TIMESTAMP NOT NULL,
    ngay_ket_thuc TIMESTAMP NOT NULL,
    don_gia DECIMAL(12, 2) DEFAULT 0 CHECK (don_gia >= 0) NOT NULL,
    trang_thai VARCHAR(20) NOT NULL,
    FOREIGN KEY (ma_loai_phong) REFERENCES loai_phong(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS phieu_dat_phong (
    id VARCHAR(36) PRIMARY KEY,
    ten_khach_hang VARCHAR(255) NOT NULL,
    so_dien_thoai VARCHAR(50),
    ngay_nhan_phong DATE NOT NULL,
    ngay_tra_phong DATE NOT NULL,
    phong_id VARCHAR(36) NOT NULL,
    trang_thai VARCHAR(50) NOT NULL,
    FOREIGN KEY (phong_id) REFERENCES phong(id) ON DELETE CASCADE
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
