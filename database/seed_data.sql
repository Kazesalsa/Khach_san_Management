INSERT INTO system_status (message) VALUES ('Database đã thông!');

-- Mật khẩu cho dữ liệu phát triển bên dưới: password
-- BCrypt: $2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC
INSERT INTO tai_khoan (id, ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai) VALUES
('tk-admin-01', 'admin', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'CHU_KHACH_SAN', 'HOAT_DONG'),
('tk-letan-01', 'letan1', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'LE_TAN', 'HOAT_DONG'),
('tk-letan-02', 'letan2', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'LE_TAN', 'HOAT_DONG'),
('tk-buong-01', 'buong1', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'NHAN_VIEN_BUONG', 'HOAT_DONG'),
('tk-khach-01', 'khach1', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'KHACH_HANG', 'HOAT_DONG'),
('tk-khoa-01', 'locked1', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'KHACH_HANG', 'BI_KHOA');

INSERT INTO nhan_vien (ma_nhan_vien, tai_khoan_id, ho_nv, ten_nv, email) VALUES
('nv-admin-01', 'tk-admin-01', 'Nguyễn Văn', 'Chủ', 'admin@suongmai.com'),
('nv-letan-01', 'tk-letan-01', 'Trần Thị', 'Lan', 'lan.letan@suongmai.com'),
('nv-letan-02', 'tk-letan-02', 'Lê Văn', 'Hải', 'hai.letan@suongmai.com'),
('nv-buong-01', 'tk-buong-01', 'Phạm Thị', 'Hoa', 'hoa.buong@suongmai.com');

INSERT INTO khach_hang (
    id, tai_khoan_id, ho_ten, so_dien_thoai,
    cccd_ho_chieu, email, so_thich_phong
) VALUES
('kh-01', 'tk-khach-01', 'Nguyễn Văn Khách', '0900000001',
 '001234567890', 'khach1@example.com', 'Phòng tầng cao');
