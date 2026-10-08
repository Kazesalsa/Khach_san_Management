INSERT INTO system_status (message) VALUES ('Database đã thông!');

-- Insert Staff (Nhan_vien)
INSERT INTO nhan_vien (ma_nhan_vien, ten_dang_nhap, mat_khau_hash, ho_nv, ten_nv, email, vai_tro, trang_thai) VALUES
('nv-admin-01', 'admin', '$2a$10$D8i...fakehash...', 'Nguyễn Văn', 'Chủ', 'admin@suongmai.com', 'CHU_KHACH_SAN', 'HOAT_DONG'),
('nv-letan-01', 'letan1', '$2a$10$D8i...fakehash...', 'Trần Thị', 'Lan', 'lan.letan@suongmai.com', 'LE_TAN', 'HOAT_DONG'),
('nv-letan-02', 'letan2', '$2a$10$D8i...fakehash...', 'Lê Văn', 'Hải', 'hai.letan@suongmai.com', 'LE_TAN', 'HOAT_DONG'),
('nv-buong-01', 'buong1', '$2a$10$D8i...fakehash...', 'Phạm Thị', 'Hoa', 'hoa.buong@suongmai.com', 'NHAN_VIEN_BUONG', 'HOAT_DONG');
