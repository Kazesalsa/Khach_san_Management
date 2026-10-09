INSERT INTO system_status (message) VALUES ('Database đã thông!');

-- Insert Accounts for Staff
INSERT INTO tai_khoan (id, ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai) VALUES
('tk-admin-01', 'admin', '$2a$10$D8i...fakehash...', 'CHU_KHACH_SAN', 'HOAT_DONG'),
('tk-letan-01', 'letan1', '$2a$10$D8i...fakehash...', 'LE_TAN', 'HOAT_DONG'),
('tk-letan-02', 'letan2', '$2a$10$D8i...fakehash...', 'LE_TAN', 'HOAT_DONG'),
('tk-buong-01', 'buong1', '$2a$10$D8i...fakehash...', 'NHAN_VIEN_BUONG', 'HOAT_DONG');

-- Insert Staff (Nhan_vien)
INSERT INTO nhan_vien (ma_nhan_vien, tai_khoan_id, ho_nv, ten_nv, email) VALUES
('nv-admin-01', 'tk-admin-01', 'Nguyễn Văn', 'Chủ', 'admin@suongmai.com'),
('nv-letan-01', 'tk-letan-01', 'Trần Thị', 'Lan', 'lan.letan@suongmai.com'),
('nv-letan-02', 'tk-letan-02', 'Lê Văn', 'Hải', 'hai.letan@suongmai.com'),
('nv-buong-01', 'tk-buong-01', 'Phạm Thị', 'Hoa', 'hoa.buong@suongmai.com');
