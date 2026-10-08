CREATE TABLE IF NOT EXISTS system_status (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL
);

DO $$ BEGIN
    CREATE TYPE vai_tro_nv_enum AS ENUM ('CHU_KHACH_SAN', 'LE_TAN', 'NHAN_VIEN_BUONG');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE trang_thai_nv_enum AS ENUM ('HOAT_DONG', 'KHOA', 'NGHI_VIEC');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS nhan_vien (
    ma_nhan_vien VARCHAR(36) PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    ho_nv VARCHAR(50) NOT NULL,
    ten_nv VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    vai_tro vai_tro_nv_enum NOT NULL,
    trang_thai trang_thai_nv_enum DEFAULT 'HOAT_DONG' NOT NULL
);
