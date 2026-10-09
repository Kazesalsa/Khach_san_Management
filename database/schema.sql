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

DO $$ BEGIN
    CREATE TYPE trang_thai_dat_phong_enum AS ENUM ('CHO_XAC_NHAN', 'DA_DAT', 'DA_NHAN', 'DA_TRA_PHONG', 'CHO_HUY', 'DA_HUY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hang_vip_enum AS ENUM ('VANG', 'BACH_KIM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

CREATE TABLE IF NOT EXISTS khach_hang_vip (
    khach_hang_id VARCHAR(36) PRIMARY KEY,
    hang_vip hang_vip_enum NOT NULL,
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS phieu_dat_phong (
    id VARCHAR(36) PRIMARY KEY,
    ma_dat_phong VARCHAR(20) UNIQUE NOT NULL,
    khach_hang_id VARCHAR(36) NOT NULL,
    nhan_vien_tao_id VARCHAR(36),
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    kenh_dat VARCHAR(50) NOT NULL,
    tong_tien_du_kien DECIMAL(12, 2) DEFAULT 0 CHECK (tong_tien_du_kien >= 0),
    tien_coc_yeu_cau DECIMAL(12, 2) DEFAULT 0 CHECK (tien_coc_yeu_cau >= 0),
    trang_thai trang_thai_dat_phong_enum NOT NULL,
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE RESTRICT,
    FOREIGN KEY (nhan_vien_tao_id) REFERENCES nhan_vien(ma_nhan_vien) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chi_tiet_dat_phong (
    id VARCHAR(36) PRIMARY KEY,
    phieu_dat_phong_id VARCHAR(36) NOT NULL,
    phong_id VARCHAR(36) NOT NULL,
    ngay_nhan_du_kien DATE NOT NULL,
    ngay_tra_du_kien DATE NOT NULL CHECK (ngay_tra_du_kien > ngay_nhan_du_kien),
    so_khach INT NOT NULL CHECK (so_khach > 0),
    thoi_gian_nhan_thuc_te TIMESTAMP,
    thoi_gian_tra_thuc_te TIMESTAMP,
    trang_thai VARCHAR(50) NOT NULL,
    nhan_vien_nhan_id VARCHAR(36),
    nhan_vien_tra_id VARCHAR(36),
    hoa_don_id VARCHAR(36),
    FOREIGN KEY (phieu_dat_phong_id) REFERENCES phieu_dat_phong(id) ON DELETE CASCADE,
    FOREIGN KEY (phong_id) REFERENCES phong(id) ON DELETE RESTRICT,
    FOREIGN KEY (nhan_vien_nhan_id) REFERENCES nhan_vien(ma_nhan_vien) ON DELETE SET NULL,
    FOREIGN KEY (nhan_vien_tra_id) REFERENCES nhan_vien(ma_nhan_vien) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS quyen_loi_ap_dung (
    id VARCHAR(36) PRIMARY KEY,
    phieu_dat_phong_id VARCHAR(36) NOT NULL,
    ten_quyen_loi VARCHAR(150) NOT NULL,
    gia_tri VARCHAR(255),
    trang_thai VARCHAR(50) DEFAULT 'DA_CHON',
    FOREIGN KEY (phieu_dat_phong_id) REFERENCES phieu_dat_phong(id) ON DELETE RESTRICT
);

DO \$\$ BEGIN
    CREATE TYPE trang_thai_hoa_don_enum AS ENUM ('CHUA_CHOT', 'CHO_THANH_TOAN', 'DA_THANH_TOAN', 'DA_CHOT', 'DA_HUY');
EXCEPTION
    WHEN duplicate_object THEN null;
END \$\$;

CREATE TABLE IF NOT EXISTS hoa_don (
    id VARCHAR(36) PRIMARY KEY,
    so_hoa_don VARCHAR(20) UNIQUE NOT NULL,
    ngay_lap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tien_phong DECIMAL(12,2) NOT NULL CHECK (tien_phong >= 0),
    tien_dich_vu DECIMAL(12,2) NOT NULL CHECK (tien_dich_vu >= 0),
    tien_coc_da_khau_tru DECIMAL(12,2) DEFAULT 0 CHECK (tien_coc_da_khau_tru >= 0),
    tong_tien DECIMAL(12,2) NOT NULL CHECK (tong_tien >= 0),
    so_tien_con_lai DECIMAL(12,2) NOT NULL CHECK (so_tien_con_lai >= 0),
    trang_thai trang_thai_hoa_don_enum NOT NULL,
    thoi_gian_chot TIMESTAMP,
    nhan_vien_chot_id VARCHAR(36),
    FOREIGN KEY (nhan_vien_chot_id) REFERENCES nhan_vien(ma_nhan_vien) ON DELETE SET NULL
);

DO \$\$ BEGIN
    CREATE TYPE loai_giao_dich_enum AS ENUM ('TIEN_COC', 'THANH_TOAN_HOA_DON', 'HOAN_TIEN');
EXCEPTION
    WHEN duplicate_object THEN null;
END \$\$;

DO \$\$ BEGIN
    CREATE TYPE phuong_thuc_tt_enum AS ENUM ('TIEN_MAT', 'CHUYEN_KHOAN');
EXCEPTION
    WHEN duplicate_object THEN null;
END \$\$;

DO \$\$ BEGIN
    CREATE TYPE trang_thai_tt_enum AS ENUM ('CHO_XAC_NHAN', 'THANH_CONG', 'THAT_BAI');
EXCEPTION
    WHEN duplicate_object THEN null;
END \$\$;

CREATE TABLE IF NOT EXISTS thanh_toan (
    id VARCHAR(36) PRIMARY KEY,
    loai_giao_dich loai_giao_dich_enum NOT NULL,
    so_tien DECIMAL(12,2) NOT NULL CHECK (so_tien > 0),
    phuong_thuc phuong_thuc_tt_enum NOT NULL,
    trang_thai trang_thai_tt_enum NOT NULL,
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ma_tham_chieu VARCHAR(100) UNIQUE,
    phieu_dat_phong_id VARCHAR(36),
    hoa_don_id VARCHAR(36),
    nhan_vien_thu_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (phieu_dat_phong_id) REFERENCES phieu_dat_phong(id) ON DELETE RESTRICT,
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id) ON DELETE RESTRICT,
    FOREIGN KEY (nhan_vien_thu_id) REFERENCES nhan_vien(ma_nhan_vien) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS chi_tiet_gia_phong (
    chi_tiet_dat_phong_id VARCHAR(36) NOT NULL,
    ngay_luu_tru DATE NOT NULL,
    don_gia DECIMAL(12,2) NOT NULL CHECK (don_gia > 0),
    bang_gia_phong_id VARCHAR(36),
    PRIMARY KEY (chi_tiet_dat_phong_id, ngay_luu_tru),
    FOREIGN KEY (chi_tiet_dat_phong_id) REFERENCES chi_tiet_dat_phong(id) ON DELETE CASCADE,
    FOREIGN KEY (bang_gia_phong_id) REFERENCES gia_phong(id) ON DELETE SET NULL
);

ALTER TABLE chi_tiet_dat_phong
    ADD CONSTRAINT fk_ctdp_hoadon 
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id) ON DELETE RESTRICT;
