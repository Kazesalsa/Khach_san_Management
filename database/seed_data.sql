-- ============================================================
-- SEED DATA FOR KHACH SAN SUONG MAI
-- Cập nhật: Tăng dữ liệu lên ~20 records/table để phục vụ thống kê
-- ============================================================

-- Xóa dữ liệu cũ (nếu có) để tránh duplicate key
TRUNCATE TABLE thanh_toan CASCADE;
TRUNCATE TABLE su_dung_dich_vu CASCADE;
TRUNCATE TABLE hoa_don CASCADE;
TRUNCATE TABLE quyen_loi_ap_dung CASCADE;
TRUNCATE TABLE chi_tiet_gia_phong CASCADE;
TRUNCATE TABLE chi_tiet_dat_phong CASCADE;
TRUNCATE TABLE phieu_dat_phong CASCADE;
TRUNCATE TABLE khach_hang_vip CASCADE;
TRUNCATE TABLE khach_hang CASCADE;
TRUNCATE TABLE dich_vu CASCADE;
TRUNCATE TABLE danh_muc_dich_vu CASCADE;
TRUNCATE TABLE nhan_vien CASCADE;
TRUNCATE TABLE tai_khoan CASCADE;
TRUNCATE TABLE gia_phong CASCADE;
TRUNCATE TABLE phong_hinh_anh CASCADE;
TRUNCATE TABLE phong CASCADE;
TRUNCATE TABLE loai_phong_tien_nghi CASCADE;
TRUNCATE TABLE tien_nghi CASCADE;
TRUNCATE TABLE loai_phong CASCADE;
TRUNCATE TABLE system_status CASCADE;

INSERT INTO system_status (message) VALUES ('Database đã thông!');

-- ============================================================
-- Insert Room Categories
-- ============================================================
INSERT INTO loai_phong (id, ten, mo_ta, suc_chua_toi_da) VALUES
('cat-1', 'Standard', 'Phòng tiêu chuẩn phù hợp cho khách lẻ và cặp đôi', 2),
('cat-2', 'Superior', 'Phòng cao cấp với tầm nhìn đẹp', 2),
('cat-3', 'Deluxe', 'Phòng sang trọng, diện tích rộng, nội thất cao cấp', 3),
('cat-4', 'Suite', 'Phòng tổng thống, đẳng cấp 5 sao', 4);

-- ============================================================
-- Insert Amenities (15 amenities)
-- ============================================================
INSERT INTO tien_nghi (id, ten, mo_ta, trang_thai) VALUES
('amenity-1', 'Wi-Fi miễn phí', 'Tốc độ cao 100Mbps', 'HOAT_DONG'),
('amenity-2', 'Smart TV 55"', 'Có sẵn Netflix & Youtube', 'HOAT_DONG'),
('amenity-3', 'Điều hòa 2 chiều', 'Inverter tiết kiệm điện', 'HOAT_DONG'),
('amenity-4', 'Bồn tắm massage', 'Tích hợp vòi sen sục khí', 'HOAT_DONG'),
('amenity-5', 'Tủ lạnh mini', 'Bao gồm nước suối miễn phí', 'HOAT_DONG'),
('amenity-6', 'Két sắt an toàn', 'Bảo mật vân tay/mã số', 'HOAT_DONG'),
('amenity-7', 'Bàn làm việc', 'Rộng rãi, ghế công thái học', 'HOAT_DONG'),
('amenity-8', 'Ban công view biển', 'Hướng nhìn toàn cảnh', 'HOAT_DONG'),
('amenity-9', 'Máy pha cà phê', 'Kèm viên nén cà phê cao cấp', 'HOAT_DONG'),
('amenity-10', 'Phục vụ bữa sáng', 'Buffet tại phòng', 'HOAT_DONG'),
('amenity-11', 'Giường King Size', 'Kích thước 2mx2m2', 'HOAT_DONG'),
('amenity-12', 'Ghế Sofa', 'Sofa tiếp khách sang trọng', 'HOAT_DONG'),
('amenity-13', 'Máy sấy tóc', 'Công suất cao ion âm', 'HOAT_DONG'),
('amenity-14', 'Dịch vụ dọn phòng 24/7', 'Yêu cầu bất cứ lúc nào', 'HOAT_DONG'),
('amenity-15', 'Trái cây chào mừng', 'Tươi mới mỗi ngày', 'HOAT_DONG');

-- ============================================================
-- Insert Room Category Amenities
-- ============================================================
INSERT INTO loai_phong_tien_nghi (loai_phong_id, tien_nghi_id) VALUES
-- Standard (6 amenities)
('cat-1', 'amenity-1'), ('cat-1', 'amenity-3'), ('cat-1', 'amenity-5'), 
('cat-1', 'amenity-7'), ('cat-1', 'amenity-13'), ('cat-1', 'amenity-14'),

-- Superior (8 amenities)
('cat-2', 'amenity-1'), ('cat-2', 'amenity-2'), ('cat-2', 'amenity-3'), 
('cat-2', 'amenity-5'), ('cat-2', 'amenity-7'), ('cat-2', 'amenity-11'), 
('cat-2', 'amenity-13'), ('cat-2', 'amenity-14'),

-- Deluxe (11 amenities)
('cat-3', 'amenity-1'), ('cat-3', 'amenity-2'), ('cat-3', 'amenity-3'), 
('cat-3', 'amenity-4'), ('cat-3', 'amenity-5'), ('cat-3', 'amenity-6'), 
('cat-3', 'amenity-7'), ('cat-3', 'amenity-8'), ('cat-3', 'amenity-11'), 
('cat-3', 'amenity-13'), ('cat-3', 'amenity-14'),

-- Suite (all 15 amenities)
('cat-4', 'amenity-1'), ('cat-4', 'amenity-2'), ('cat-4', 'amenity-3'), 
('cat-4', 'amenity-4'), ('cat-4', 'amenity-5'), ('cat-4', 'amenity-6'), 
('cat-4', 'amenity-7'), ('cat-4', 'amenity-8'), ('cat-4', 'amenity-9'), 
('cat-4', 'amenity-10'), ('cat-4', 'amenity-11'), ('cat-4', 'amenity-12'), 
('cat-4', 'amenity-13'), ('cat-4', 'amenity-14'), ('cat-4', 'amenity-15');

-- ============================================================
-- Insert 50 Rooms (5 floors, 10 rooms each)
-- ============================================================
DO $$
DECLARE
    floor INT;
    room_num INT;
    cat_id VARCHAR(36);
BEGIN
    FOR floor IN 1..5 LOOP
        FOR room_num IN 1..10 LOOP
            -- Phân bổ loại phòng theo số phòng
            IF room_num <= 4 THEN cat_id := 'cat-1'; -- 4 Standard
            ELSIF room_num <= 7 THEN cat_id := 'cat-2'; -- 3 Superior
            ELSIF room_num <= 9 THEN cat_id := 'cat-3'; -- 2 Deluxe
            ELSE cat_id := 'cat-4'; -- 1 Suite
            END IF;
            
            INSERT INTO phong (id, ma_phong, so_phong, tang, ma_loai_phong, trang_thai_su_dung, trang_thai_don_dep)
            VALUES (
                'room-' || floor || TO_CHAR(room_num, 'fm00'), 
                'RM-' || floor || TO_CHAR(room_num, 'fm00'), 
                floor || TO_CHAR(room_num, 'fm00'), 
                floor, 
                cat_id, 
                'TRONG', 
                'DA_DON_XONG'
            );
        END LOOP;
    END LOOP;
END $$;

-- ============================================================
-- Insert Room Images (5 images per room for all 50 rooms)
-- ============================================================
DO $$
DECLARE
    floor INT;
    room_num INT;
    room_id VARCHAR(36);
    c INT;
    i1 INT; i2 INT; i3 INT; i4 INT; i5 INT;
    
    bed_ids TEXT[] := ARRAY['1566665797739-1674de7a421a', '1591088398332-8a7791972843', '1582719508461-890f11f40ce6', '1590490360182-c33d57733427', '1512918728675-ed5a9ecdebfd'];
    bath_ids TEXT[] := ARRAY['1584622650111-993a426fbf0a', '1600566753190-17f0baa2cb32', '1552321554-5d5d36dc1604', '1604709177227-08728731d16f', '1507652313628-9773c1d43a60'];
    view_ids TEXT[] := ARRAY['1582719478250-c89facf4a4bf', '1538944570562-2c9cb7857097', '1510798831971-661eb04b3739', '1572987653523-389fbff2794c', '1564013799919-ab600027ffc6'];
    desk_ids TEXT[] := ARRAY['1505692794401-ca20ba3b8fb3', '1560067174-c5a3a8f37060', '1554995207-c18c203602cb', '1522771739844-6a9f6d5f14af', '1445019980597-93fa8acb246c'];
    detail_ids TEXT[] := ARRAY['1583847268964-b28ce7f3df82', '1596394516093-501ba68a0ba6', '1576675784201-0e142b423952', '1611892440504-42a792e24d32', '1505691938859-f0a0e60ea20f'];
BEGIN
    FOR floor IN 1..5 LOOP
        FOR room_num IN 1..10 LOOP
            room_id := 'room-' || floor || TO_CHAR(room_num, 'fm00');
            c := (floor - 1) * 10 + room_num;
            
            i1 := 1 + (c % 5);
            i2 := 1 + ((c / 5) % 5);
            i3 := 1 + ((c / 25) % 5);
            i4 := 1 + ((c + 1) % 5);
            i5 := 1 + ((c + 3) % 5);
            
            INSERT INTO phong_hinh_anh (id, url, thu_tu_hien_thi, la_anh_dai_dien, phong_id) VALUES 
            ('img-' || room_id || '-1', 'https://images.unsplash.com/photo-' || bed_ids[i1] || '?auto=format&fit=crop&w=800&q=80', '1', 'true', room_id),
            ('img-' || room_id || '-2', 'https://images.unsplash.com/photo-' || bath_ids[i2] || '?auto=format&fit=crop&w=800&q=80', '2', 'false', room_id),
            ('img-' || room_id || '-3', 'https://images.unsplash.com/photo-' || view_ids[i3] || '?auto=format&fit=crop&w=800&q=80', '3', 'false', room_id),
            ('img-' || room_id || '-4', 'https://images.unsplash.com/photo-' || desk_ids[i4] || '?auto=format&fit=crop&w=800&q=80', '4', 'false', room_id),
            ('img-' || room_id || '-5', 'https://images.unsplash.com/photo-' || detail_ids[i5] || '?auto=format&fit=crop&w=800&q=80', '5', 'false', room_id);
        END LOOP;
    END LOOP;
END $$;

-- ============================================================
-- Insert Room Prices (Multiple periods for 2026 and 2027)
-- ============================================================
DO $$
DECLARE
    cat_idx INT;
    base_price DECIMAL;
BEGIN
    FOR cat_idx IN 1..4 LOOP
        IF cat_idx = 1 THEN base_price := 500000;
        ELSIF cat_idx = 2 THEN base_price := 800000;
        ELSIF cat_idx = 3 THEN base_price := 1200000;
        ELSE base_price := 2500000;
        END IF;

        -- Mùa thấp điểm 2026
        INSERT INTO gia_phong (id, ma_loai_phong, ngay_bat_dau, ngay_ket_thuc, don_gia, trang_thai) 
        VALUES ('price-low26-' || cat_idx, 'cat-' || cat_idx, '2026-01-01 00:00:00', '2026-04-30 23:59:59', base_price, 'ACTIVE');
        
        -- Mùa cao điểm (Hè 2026)
        INSERT INTO gia_phong (id, ma_loai_phong, ngay_bat_dau, ngay_ket_thuc, don_gia, trang_thai) 
        VALUES ('price-high26-' || cat_idx, 'cat-' || cat_idx, '2026-05-01 00:00:00', '2026-08-31 23:59:59', base_price * 1.5, 'ACTIVE');

        -- Mùa thấp điểm cuối năm 2026
        INSERT INTO gia_phong (id, ma_loai_phong, ngay_bat_dau, ngay_ket_thuc, don_gia, trang_thai) 
        VALUES ('price-end26-' || cat_idx, 'cat-' || cat_idx, '2026-09-01 00:00:00', '2026-12-31 23:59:59', base_price, 'ACTIVE');
        
        -- Mùa thấp điểm 2027
        INSERT INTO gia_phong (id, ma_loai_phong, ngay_bat_dau, ngay_ket_thuc, don_gia, trang_thai) 
        VALUES ('price-low27-' || cat_idx, 'cat-' || cat_idx, '2027-01-01 00:00:00', '2027-04-30 23:59:59', base_price, 'ACTIVE');
    END LOOP;
END $$;

-- ============================================================
-- Insert Accounts for Staff
-- ============================================================
INSERT INTO tai_khoan (id, ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai) VALUES
('tk-admin-01', 'admin', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'CHU_KHACH_SAN', 'HOAT_DONG'),
('tk-letan-01', 'letan1', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'LE_TAN', 'HOAT_DONG'),
('tk-letan-02', 'letan2', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'LE_TAN', 'HOAT_DONG'),
('tk-buong-01', 'buong1', '$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC', 'NHAN_VIEN_BUONG', 'HOAT_DONG');

-- ============================================================
-- Insert Staff (Nhan_vien)
-- ============================================================
INSERT INTO nhan_vien (ma_nhan_vien, tai_khoan_id, ho_nv, ten_nv, email) VALUES
('nv-admin-01', 'tk-admin-01', 'Nguyễn Văn', 'Chủ', 'admin@suongmai.com'),
('nv-letan-01', 'tk-letan-01', 'Trần Thị', 'Lan', 'lan.letan@suongmai.com'),
('nv-letan-02', 'tk-letan-02', 'Lê Văn', 'Hải', 'hai.letan@suongmai.com'),
('nv-buong-01', 'tk-buong-01', 'Phạm Thị', 'Hoa', 'hoa.buong@suongmai.com');

-- ============================================================
-- Generate 20 Customers (Tăng từ 10 lên 20)
-- ============================================================
DO $$
DECLARE
    i INT;
    cccd VARCHAR(20);
    phone VARCHAR(15);
    ho_arr TEXT[] := ARRAY['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
    ten_arr TEXT[] := ARRAY['Văn An', 'Thị Bình', 'Minh Châu', 'Hồng Duyên', 'Quốc Anh', 'Thu Hà', 'Đức Khang', 'Lan Anh', 'Tuấn Minh', 'Phương Thảo'];
    sothich_arr TEXT[] := ARRAY['Thích phòng yên tĩnh, view biển', 'Yêu cầu giường đôi lớn', 'Ưa thích tầng cao', 'Cần phòng gần thang máy', 'Thích view núi'];
BEGIN
    FOR i IN 1..20 LOOP
        cccd := '079' || lpad(i::TEXT, 9, '0');
        phone := '090' || lpad(i::TEXT, 7, '0');
        
        INSERT INTO khach_hang (id, ho_ten, so_dien_thoai, cccd_ho_chieu, email, so_thich_phong, ngay_tao)
        VALUES (
            'customer-' || i,
            ho_arr[1 + (i % 10)] || ' ' || ten_arr[1 + ((i / 2) % 10)],
            phone,
            cccd,
            'khachhang' || i || '@example.com',
            sothich_arr[1 + (i % 5)],
            -- Cố định (không phụ thuộc CURRENT_TIMESTAMP) và luôn trước booking đầu tiên (20/12/2025)
            TIMESTAMP '2025-11-01 09:00:00' + INTERVAL '1 day' * (i - 1)
        );
        
        -- 5 khách VIP (3 VÀNG, 2 BẠCH KIM)
        IF i <= 3 THEN
            INSERT INTO khach_hang_vip (khach_hang_id, hang_vip) VALUES ('customer-' || i, 'VANG');
        ELSIF i <= 5 THEN
            INSERT INTO khach_hang_vip (khach_hang_id, hang_vip) VALUES ('customer-' || i, 'BACH_KIM');
        END IF;
    END LOOP;
END $$;

-- ============================================================
-- Insert Service Categories
-- ============================================================
INSERT INTO danh_muc_dich_vu (id, ten_danh_muc, mo_ta) VALUES
('cat-svc-1', 'Đồ ăn & Đồ uống (F&B)', 'Phục vụ ăn uống tại phòng'),
('cat-svc-2', 'Giặt ủi', 'Dịch vụ giặt, sấy, là ủi quần áo'),
('cat-svc-3', 'Spa & Massage', 'Dịch vụ chăm sóc sức khỏe và làm đẹp');

-- ============================================================
-- Insert Services (8 services)
-- ============================================================
INSERT INTO dich_vu (id, danh_muc_id, ten, don_vi_tinh, don_gia_hien_tai, trang_thai) VALUES
-- F&B
('svc-1', 'cat-svc-1', 'Nước suối Aquafina 500ml', 'Chai', 15000, 'DANG_CUNG_CAP'),
('svc-2', 'cat-svc-1', 'Bia Heineken', 'Lon', 35000, 'DANG_CUNG_CAP'),
('svc-3', 'cat-svc-1', 'Mì xào hải sản', 'Phần', 85000, 'DANG_CUNG_CAP'),
('svc-4', 'cat-svc-1', 'Bữa sáng Buffet', 'Người', 150000, 'DANG_CUNG_CAP'),
-- Giặt ủi
('svc-5', 'cat-svc-2', 'Giặt sấy cơ bản', 'Kg', 40000, 'DANG_CUNG_CAP'),
('svc-6', 'cat-svc-2', 'Giặt hấp áo vest', 'Cái', 120000, 'DANG_CUNG_CAP'),
-- Spa
('svc-7', 'cat-svc-3', 'Massage toàn thân 60p', 'Lần', 350000, 'DANG_CUNG_CAP'),
('svc-8', 'cat-svc-3', 'Xông hơi khô (Sauna)', 'Giờ', 150000, 'DANG_CUNG_CAP');


-- ============================================================
-- MỐC THỜI GIAN CỦA DỮ LIỆU MẪU: 10/10/2026
--   • DA_TRA_PHONG : đã trả phòng TRƯỚC mốc  -> có hóa đơn DA_THANH_TOAN
--   • DA_NHAN      : đang ở (nhận <= mốc < trả) -> hóa đơn CHUA_CHOT, phòng DANG_O
--   • DA_DAT       : nhận phòng SAU mốc, đã cọc  -> chưa có hóa đơn
--   • CHO_XAC_NHAN : nhận phòng SAU mốc, chưa cọc -> chưa có hóa đơn
--
-- QUY TẮC NHẤT QUÁN (được kiểm tra tự động ở cuối file):
--   • chi_tiet_gia_phong: 1 dòng / 1 đêm (ngày nhận -> ngày trả - 1),
--     don_gia lấy đúng từ gia_phong theo loại phòng + ngày lưu trú
--   • phieu_dat_phong.tong_tien_du_kien = SUM(chi_tiet_gia_phong.don_gia)
--   • tien_coc_yeu_cau = 0 hoặc 20% tiền phòng
--   • hoa_don.tien_phong   = SUM(chi_tiet_gia_phong.don_gia)
--   • hoa_don.tien_dich_vu = SUM(so_luong * don_gia_ap_dung)
--   • hoa_don.tong_tien    = tien_phong + tien_dich_vu
--   • hoa_don.so_tien_con_lai = tong_tien - đã cọc - đã thanh toán
--   • don_gia_ap_dung dịch vụ = dich_vu.don_gia_hien_tai
-- ============================================================

-- ============================================================
-- Generate 25 Bookings (book-1 -> book-25)
--   • book-1..20 : DA_TRA_PHONG, rải tháng 1 -> 9/2026
--   • book-21..23: DA_NHAN (đang lưu trú quanh mốc 10/10/2026)
--   • book-24    : DA_DAT  (20/10/2026)
--   • book-25    : CHO_XAC_NHAN (09/11/2026)
-- Tiền phòng KHÔNG hardcode mà tính từng đêm theo bảng gia_phong
-- ============================================================
DO $$
DECLARE
    i INT;
    v_book_id VARCHAR(36);
    v_detail_id VARCHAR(36);
    v_inv_id VARCHAR(36);
    v_customer_id VARCHAR(36);
    v_nhanvien_id VARCHAR(36);
    v_room_id VARCHAR(36);
    v_loai_phong VARCHAR(36);
    v_kenh_dat VARCHAR(50);
    v_trang_thai VARCHAR(50);
    v_thang INT;
    v_so_dem INT;
    v_so_dem_co_gia INT;
    v_ngay_nhan DATE;
    v_ngay_tra DATE;
    v_ngay_tao TIMESTAMP;
    v_svc_id VARCHAR(36);
    v_svc_gia DECIMAL(12,2);
    v_svc_sl INT;
    v_tien_phong DECIMAL(12,2);
    v_tien_dich_vu DECIMAL(12,2);
    v_tien_coc DECIMAL(12,2);
    v_tong_tien DECIMAL(12,2);

    -- Mảng phòng theo loại (50 phòng)
    standard_rooms TEXT[] := ARRAY['room-101','room-102','room-103','room-104','room-201','room-202','room-203','room-204','room-301','room-302','room-303','room-304','room-401','room-402','room-403','room-404','room-501','room-502','room-503','room-504'];
    superior_rooms TEXT[] := ARRAY['room-105','room-106','room-107','room-205','room-206','room-207','room-305','room-306','room-307','room-405','room-406','room-407','room-505','room-506','room-507'];
    deluxe_rooms TEXT[] := ARRAY['room-108','room-109','room-208','room-209','room-308','room-309','room-408','room-409','room-508','room-509'];
    suite_rooms TEXT[] := ARRAY['room-110','room-210','room-310','room-410','room-510'];

    nhanvien_arr TEXT[] := ARRAY['nv-letan-01', 'nv-letan-02', 'nv-admin-01'];
    kenh_arr TEXT[] := ARRAY['TRUC_TIEP', 'ONLINE', 'DIEN_THOAI'];
    dich_vu_ids TEXT[] := ARRAY['svc-1', 'svc-2', 'svc-3', 'svc-4', 'svc-5', 'svc-7', 'svc-8'];
BEGIN
    FOR i IN 1..25 LOOP
        v_book_id := 'book-' || i;
        v_detail_id := 'detail-' || i;
        v_inv_id := 'inv-' || i;
        v_customer_id := 'customer-' || (1 + ((i - 1) % 20));
        v_nhanvien_id := nhanvien_arr[1 + ((i - 1) % 3)];
        v_kenh_dat := kenh_arr[1 + ((i - 1) % 3)];

        -- Chọn phòng (xoay vòng 4 loại phòng)
        IF i % 4 = 1 THEN v_room_id := standard_rooms[1 + ((i - 1) % 20)];
        ELSIF i % 4 = 2 THEN v_room_id := superior_rooms[1 + ((i - 1) % 15)];
        ELSIF i % 4 = 3 THEN v_room_id := deluxe_rooms[1 + ((i - 1) % 10)];
        ELSE v_room_id := suite_rooms[1 + ((i - 1) % 5)];
        END IF;
        SELECT ma_loai_phong INTO v_loai_phong FROM phong WHERE id = v_room_id;

        -- Trạng thái + ngày lưu trú (xác định, không random)
        IF i <= 20 THEN
            v_trang_thai := 'DA_TRA_PHONG';
            v_thang := ((i - 1) % 9) + 1;                         -- tháng 1 -> 9
            v_ngay_nhan := make_date(2026, v_thang, 5 + ((i - 1) % 20));
            v_so_dem := 2 + ((i - 1) % 4);                        -- 2 -> 5 đêm
        ELSIF i <= 23 THEN
            v_trang_thai := 'DA_NHAN';
            v_ngay_nhan := DATE '2026-10-07' + (i - 20);          -- 08, 09, 10/10
            v_so_dem := 25 - i;                                   -- cùng trả ngày 12/10
        ELSIF i = 24 THEN
            v_trang_thai := 'DA_DAT';
            v_ngay_nhan := DATE '2026-10-20';
            v_so_dem := 3;
        ELSE
            v_trang_thai := 'CHO_XAC_NHAN';
            v_ngay_nhan := DATE '2026-11-09';
            v_so_dem := 2;
        END IF;
        v_ngay_tra := v_ngay_nhan + v_so_dem;
        -- Ngày đặt luôn trước ngày nhận và không vượt quá mốc hiện tại
        v_ngay_tao := LEAST(v_ngay_nhan - (3 + i % 5), DATE '2026-10-09') + TIME '10:00';

        -- Tiền phòng = tổng giá từng đêm theo bảng gia_phong
        SELECT COALESCE(SUM(gp.don_gia), 0), COUNT(*)
          INTO v_tien_phong, v_so_dem_co_gia
        FROM generate_series(v_ngay_nhan::timestamp, (v_ngay_tra - 1)::timestamp, INTERVAL '1 day') AS d(ngay)
        JOIN gia_phong gp ON gp.ma_loai_phong = v_loai_phong
                         AND gp.trang_thai = 'ACTIVE'
                         AND d.ngay BETWEEN gp.ngay_bat_dau AND gp.ngay_ket_thuc;
        IF v_so_dem_co_gia <> v_so_dem THEN
            RAISE EXCEPTION '% : % đêm nhưng chỉ tìm thấy % bảng giá', v_book_id, v_so_dem, v_so_dem_co_gia;
        END IF;

        -- Cọc 20% cho booking chia hết cho 3
        IF i % 3 = 0 THEN v_tien_coc := ROUND(v_tien_phong * 0.2); ELSE v_tien_coc := 0; END IF;

        -- 1) phieu_dat_phong (tổng dự kiến = tiền phòng, dịch vụ phát sinh sau)
        INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
        VALUES (v_book_id, 'BOOK' || LPAD(i::TEXT, 4, '0'), v_customer_id, v_nhanvien_id, v_ngay_tao, v_kenh_dat,
                v_tien_phong, v_tien_coc, v_trang_thai::trang_thai_dat_phong_enum);

        -- 2) chi_tiet_dat_phong
        INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
        VALUES (
            v_detail_id, v_book_id, v_room_id, v_ngay_nhan, v_ngay_tra, 2,
            CASE WHEN v_trang_thai IN ('DA_TRA_PHONG', 'DA_NHAN') THEN v_ngay_nhan + TIME '14:00' END,
            CASE WHEN v_trang_thai = 'DA_TRA_PHONG' THEN v_ngay_tra + TIME '12:00' END,
            v_trang_thai,
            CASE WHEN v_trang_thai IN ('DA_TRA_PHONG', 'DA_NHAN') THEN v_nhanvien_id END,
            CASE WHEN v_trang_thai = 'DA_TRA_PHONG' THEN v_nhanvien_id END
        );

        -- 3) chi_tiet_gia_phong: 1 dòng cho mỗi đêm lưu trú
        INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id)
        SELECT v_detail_id, d.ngay::date, gp.don_gia, gp.id
        FROM generate_series(v_ngay_nhan::timestamp, (v_ngay_tra - 1)::timestamp, INTERVAL '1 day') AS d(ngay)
        JOIN gia_phong gp ON gp.ma_loai_phong = v_loai_phong
                         AND gp.trang_thai = 'ACTIVE'
                         AND d.ngay BETWEEN gp.ngay_bat_dau AND gp.ngay_ket_thuc;

        -- 4) su_dung_dich_vu (booking chẵn, khách đã/đang ở) - giá lấy từ bảng dich_vu
        v_tien_dich_vu := 0;
        IF i % 2 = 0 AND v_trang_thai IN ('DA_TRA_PHONG', 'DA_NHAN') THEN
            v_svc_id := dich_vu_ids[1 + ((i - 1) % 7)];
            v_svc_sl := 1 + ((i - 1) % 3);
            SELECT don_gia_hien_tai INTO v_svc_gia FROM dich_vu WHERE id = v_svc_id;
            v_tien_dich_vu := v_svc_sl * v_svc_gia;

            INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung)
            VALUES ('usg-' || i, v_detail_id, v_svc_id, v_nhanvien_id, v_svc_sl, v_svc_gia, (v_ngay_nhan + 1) + TIME '18:00');
        END IF;

        v_tong_tien := v_tien_phong + v_tien_dich_vu;

        -- 5) hoa_don
        IF v_trang_thai = 'DA_TRA_PHONG' THEN
            INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
            VALUES (v_inv_id, 'HD-' || LPAD(i::TEXT, 6, '0'), v_ngay_tra + TIME '12:00',
                    v_tien_phong, v_tien_dich_vu, v_tien_coc, v_tong_tien, 0,
                    'DA_THANH_TOAN', v_ngay_tra + TIME '12:05', v_nhanvien_id);
            UPDATE chi_tiet_dat_phong SET hoa_don_id = v_inv_id WHERE id = v_detail_id;
        ELSIF v_trang_thai = 'DA_NHAN' THEN
            -- Đang ở: hóa đơn tạm, chưa chốt
            INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai)
            VALUES (v_inv_id, 'HD-' || LPAD(i::TEXT, 6, '0'), v_ngay_nhan + TIME '14:00',
                    v_tien_phong, v_tien_dich_vu, v_tien_coc, v_tong_tien, v_tong_tien - v_tien_coc,
                    'CHUA_CHOT');
            UPDATE chi_tiet_dat_phong SET hoa_don_id = v_inv_id WHERE id = v_detail_id;
        END IF;

        -- 6) thanh_toan: tiền cọc (mọi booking đã xác nhận có yêu cầu cọc)
        IF v_tien_coc > 0 AND v_trang_thai IN ('DA_TRA_PHONG', 'DA_NHAN', 'DA_DAT') THEN
            INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
            VALUES ('pay-' || i || 'a', 'TIEN_COC', v_tien_coc, 'CHUYEN_KHOAN', 'THANH_CONG',
                    v_ngay_tao + INTERVAL '2 hours', 'REF-' || LPAD(i::TEXT, 3, '0') || 'A',
                    v_book_id, NULL, v_nhanvien_id);
        END IF;

        -- 7) thanh_toan: thanh toán phần còn lại khi trả phòng
        IF v_trang_thai = 'DA_TRA_PHONG' THEN
            INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
            VALUES ('pay-' || i, 'THANH_TOAN_HOA_DON', v_tong_tien - v_tien_coc,
                    CASE WHEN i % 2 = 0 THEN 'TIEN_MAT' ELSE 'CHUYEN_KHOAN' END::phuong_thuc_tt_enum,
                    'THANH_CONG', v_ngay_tra + TIME '12:05', 'REF-' || LPAD(i::TEXT, 3, '0'),
                    v_book_id, v_inv_id, v_nhanvien_id);
        END IF;
    END LOOP;
END $$;

-- ============================================================
-- Thêm 15 Bookings Vào Các Thời Điểm Đặc Biệt (chèn từng dòng)
-- Tổng cộng: 40 bookings
-- Bảng giá áp dụng (VND/đêm):
--   Loại       | 01-04/2026 | 05-08/2026 | 09-12/2026 | 01-04/2027
--   Standard   |   500.000  |   750.000  |   500.000  |   500.000
--   Superior   |   800.000  | 1.200.000  |   800.000  |   800.000
--   Deluxe     | 1.200.000  | 1.800.000  | 1.200.000  | 1.200.000
--   Suite      | 2.500.000  | 3.750.000  | 2.500.000  | 2.500.000
-- ============================================================

-- BOOKING 26: Tết Dương Lịch 2026 (01-03/01/2026 - Suite, 2 đêm x 2.500.000)
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-26', 'BOOK0026', 'customer-1', 'nv-admin-01', '2025-12-20 10:00:00', 'ONLINE', 5000000, 1000000, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-26', 'book-26', 'room-110', '2026-01-01', '2026-01-03', 4, '2026-01-01 14:00:00', '2026-01-03 12:00:00', 'DA_TRA_PHONG', 'nv-letan-01', 'nv-letan-01');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-26', '2026-01-01', 2500000, 'price-low26-4'),
('detail-26', '2026-01-02', 2500000, 'price-low26-4');

-- Dịch vụ: 2x350.000 + 4x150.000 + 4x150.000 = 1.900.000 (đều sau giờ nhận phòng 14:00)
INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung) VALUES
('usg-26a', 'detail-26', 'svc-7', 'nv-letan-01', 2, 350000, '2026-01-01 16:00:00'),
('usg-26b', 'detail-26', 'svc-4', 'nv-letan-01', 4, 150000, '2026-01-02 08:00:00'),
('usg-26c', 'detail-26', 'svc-4', 'nv-letan-01', 4, 150000, '2026-01-03 08:00:00');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-26', 'HD-000026', '2026-01-03 12:00:00', 5000000, 1900000, 1000000, 6900000, 0, 'DA_THANH_TOAN', '2026-01-03 12:10:00', 'nv-letan-01');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-26' WHERE id = 'detail-26';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id) VALUES
('pay-26a', 'TIEN_COC', 1000000, 'CHUYEN_KHOAN', 'THANH_CONG', '2025-12-21 10:00:00', 'REF-026A', 'book-26', NULL, 'nv-admin-01'),
('pay-26b', 'THANH_TOAN_HOA_DON', 5900000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-01-03 12:10:00', 'REF-026B', 'book-26', 'inv-26', 'nv-letan-01');

-- BOOKING 27: Valentine 2026 (14-16/02/2026 - Deluxe, 2 đêm x 1.200.000)
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-27', 'BOOK0027', 'customer-2', 'nv-letan-02', '2026-02-01 15:00:00', 'ONLINE', 2400000, 480000, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-27', 'book-27', 'room-308', '2026-02-14', '2026-02-16', 2, '2026-02-14 14:00:00', '2026-02-16 12:00:00', 'DA_TRA_PHONG', 'nv-letan-02', 'nv-letan-02');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-27', '2026-02-14', 1200000, 'price-low26-3'),
('detail-27', '2026-02-15', 1200000, 'price-low26-3');

INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung) VALUES
('usg-27a', 'detail-27', 'svc-7', 'nv-letan-02', 2, 350000, '2026-02-14 20:00:00');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-27', 'HD-000027', '2026-02-16 12:00:00', 2400000, 700000, 480000, 3100000, 0, 'DA_THANH_TOAN', '2026-02-16 12:05:00', 'nv-letan-02');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-27' WHERE id = 'detail-27';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id) VALUES
('pay-27a', 'TIEN_COC', 480000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-02-02 15:00:00', 'REF-027A', 'book-27', NULL, 'nv-letan-02'),
('pay-27b', 'THANH_TOAN_HOA_DON', 2620000, 'TIEN_MAT', 'THANH_CONG', '2026-02-16 12:05:00', 'REF-027B', 'book-27', 'inv-27', 'nv-letan-02');

-- BOOKING 28: Cuối tuần tháng 3 (21-23/03/2026 - Standard, 2 đêm x 500.000)
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-28', 'BOOK0028', 'customer-11', 'nv-letan-01', '2026-03-18 09:00:00', 'DIEN_THOAI', 1000000, 0, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-28', 'book-28', 'room-301', '2026-03-21', '2026-03-23', 2, '2026-03-21 14:00:00', '2026-03-23 12:00:00', 'DA_TRA_PHONG', 'nv-letan-01', 'nv-letan-01');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-28', '2026-03-21', 500000, 'price-low26-1'),
('detail-28', '2026-03-22', 500000, 'price-low26-1');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-28', 'HD-000028', '2026-03-23 12:00:00', 1000000, 0, 0, 1000000, 0, 'DA_THANH_TOAN', '2026-03-23 12:05:00', 'nv-letan-01');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-28' WHERE id = 'detail-28';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
VALUES ('pay-28', 'THANH_TOAN_HOA_DON', 1000000, 'TIEN_MAT', 'THANH_CONG', '2026-03-23 12:05:00', 'REF-028', 'book-28', 'inv-28', 'nv-letan-01');

-- BOOKING 29: Giỗ tổ Hùng Vương (10-13/04/2026 - Superior, 3 đêm x 800.000)
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-29', 'BOOK0029', 'customer-12', 'nv-letan-02', '2026-04-04 10:00:00', 'ONLINE', 2400000, 480000, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-29', 'book-29', 'room-405', '2026-04-10', '2026-04-13', 2, '2026-04-10 14:00:00', '2026-04-13 12:00:00', 'DA_TRA_PHONG', 'nv-letan-02', 'nv-letan-02');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-29', '2026-04-10', 800000, 'price-low26-2'),
('detail-29', '2026-04-11', 800000, 'price-low26-2'),
('detail-29', '2026-04-12', 800000, 'price-low26-2');

INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung) VALUES
('usg-29', 'detail-29', 'svc-4', 'nv-letan-02', 6, 150000, '2026-04-11 08:00:00');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-29', 'HD-000029', '2026-04-13 12:00:00', 2400000, 900000, 480000, 3300000, 0, 'DA_THANH_TOAN', '2026-04-13 12:05:00', 'nv-letan-02');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-29' WHERE id = 'detail-29';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id) VALUES
('pay-29a', 'TIEN_COC', 480000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-04-05 10:00:00', 'REF-029A', 'book-29', NULL, 'nv-letan-02'),
('pay-29b', 'THANH_TOAN_HOA_DON', 2820000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-04-13 12:05:00', 'REF-029B', 'book-29', 'inv-29', 'nv-letan-02');

-- BOOKING 30: Lễ 30/4 - giao mùa (30/04-02/05/2026 - Suite)
--   Đêm 30/04: giá thấp điểm 2.500.000 | Đêm 01/05: giá cao điểm 3.750.000 => 6.250.000
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-30', 'BOOK0030', 'customer-3', 'nv-admin-01', '2026-04-10 10:00:00', 'ONLINE', 6250000, 1250000, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-30', 'book-30', 'room-210', '2026-04-30', '2026-05-02', 4, '2026-04-30 14:00:00', '2026-05-02 12:00:00', 'DA_TRA_PHONG', 'nv-letan-01', 'nv-letan-01');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-30', '2026-04-30', 2500000, 'price-low26-4'),
('detail-30', '2026-05-01', 3750000, 'price-high26-4');

INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung) VALUES
('usg-30a', 'detail-30', 'svc-4', 'nv-letan-01', 4, 150000, '2026-05-01 08:00:00'),
('usg-30b', 'detail-30', 'svc-7', 'nv-letan-01', 4, 350000, '2026-05-01 16:00:00');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-30', 'HD-000030', '2026-05-02 12:00:00', 6250000, 2000000, 1250000, 8250000, 0, 'DA_THANH_TOAN', '2026-05-02 12:10:00', 'nv-letan-01');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-30' WHERE id = 'detail-30';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id) VALUES
('pay-30a', 'TIEN_COC', 1250000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-04-11 10:00:00', 'REF-030A', 'book-30', NULL, 'nv-admin-01'),
('pay-30b', 'THANH_TOAN_HOA_DON', 7000000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-05-02 12:10:00', 'REF-030B', 'book-30', 'inv-30', 'nv-letan-01');

-- BOOKING 31: Hè tháng 6 (15-19/06/2026 - Deluxe cao điểm, 4 đêm x 1.800.000)
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-31', 'BOOK0031', 'customer-13', 'nv-letan-01', '2026-05-20 10:00:00', 'ONLINE', 7200000, 1440000, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-31', 'book-31', 'room-208', '2026-06-15', '2026-06-19', 3, '2026-06-15 14:00:00', '2026-06-19 12:00:00', 'DA_TRA_PHONG', 'nv-letan-01', 'nv-letan-01');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-31', '2026-06-15', 1800000, 'price-high26-3'),
('detail-31', '2026-06-16', 1800000, 'price-high26-3'),
('detail-31', '2026-06-17', 1800000, 'price-high26-3'),
('detail-31', '2026-06-18', 1800000, 'price-high26-3');

INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung) VALUES
('usg-31', 'detail-31', 'svc-7', 'nv-letan-01', 3, 350000, '2026-06-16 18:00:00');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-31', 'HD-000031', '2026-06-19 12:00:00', 7200000, 1050000, 1440000, 8250000, 0, 'DA_THANH_TOAN', '2026-06-19 12:05:00', 'nv-letan-01');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-31' WHERE id = 'detail-31';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id) VALUES
('pay-31a', 'TIEN_COC', 1440000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-05-21 10:00:00', 'REF-031A', 'book-31', NULL, 'nv-letan-01'),
('pay-31b', 'THANH_TOAN_HOA_DON', 6810000, 'TIEN_MAT', 'THANH_CONG', '2026-06-19 12:05:00', 'REF-031B', 'book-31', 'inv-31', 'nv-letan-01');

-- BOOKING 32: Hè tháng 7 (20-23/07/2026 - Superior cao điểm, 3 đêm x 1.200.000)
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-32', 'BOOK0032', 'customer-14', 'nv-letan-02', '2026-06-25 14:00:00', 'TRUC_TIEP', 3600000, 0, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-32', 'book-32', 'room-305', '2026-07-20', '2026-07-23', 2, '2026-07-20 14:00:00', '2026-07-23 12:00:00', 'DA_TRA_PHONG', 'nv-letan-02', 'nv-letan-02');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-32', '2026-07-20', 1200000, 'price-high26-2'),
('detail-32', '2026-07-21', 1200000, 'price-high26-2'),
('detail-32', '2026-07-22', 1200000, 'price-high26-2');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-32', 'HD-000032', '2026-07-23 12:00:00', 3600000, 0, 0, 3600000, 0, 'DA_THANH_TOAN', '2026-07-23 12:05:00', 'nv-letan-02');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-32' WHERE id = 'detail-32';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
VALUES ('pay-32', 'THANH_TOAN_HOA_DON', 3600000, 'TIEN_MAT', 'THANH_CONG', '2026-07-23 12:05:00', 'REF-032', 'book-32', 'inv-32', 'nv-letan-02');

-- BOOKING 33: Cuối hè tháng 8 (25-27/08/2026 - Standard cao điểm, 2 đêm x 750.000)
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-33', 'BOOK0033', 'customer-15', 'nv-letan-01', '2026-08-10 09:00:00', 'DIEN_THOAI', 1500000, 0, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-33', 'book-33', 'room-501', '2026-08-25', '2026-08-27', 2, '2026-08-25 14:00:00', '2026-08-27 12:00:00', 'DA_TRA_PHONG', 'nv-letan-01', 'nv-letan-01');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-33', '2026-08-25', 750000, 'price-high26-1'),
('detail-33', '2026-08-26', 750000, 'price-high26-1');

INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung) VALUES
('usg-33', 'detail-33', 'svc-3', 'nv-letan-01', 2, 85000, '2026-08-25 20:00:00');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-33', 'HD-000033', '2026-08-27 12:00:00', 1500000, 170000, 0, 1670000, 0, 'DA_THANH_TOAN', '2026-08-27 12:05:00', 'nv-letan-01');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-33' WHERE id = 'detail-33';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
VALUES ('pay-33', 'THANH_TOAN_HOA_DON', 1670000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-08-27 12:05:00', 'REF-033', 'book-33', 'inv-33', 'nv-letan-01');

-- BOOKING 34: Quốc khánh 2/9 (02-05/09/2026 - Deluxe, 3 đêm x 1.200.000)
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-34', 'BOOK0034', 'customer-16', 'nv-admin-01', '2026-08-20 10:00:00', 'ONLINE', 3600000, 720000, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-34', 'book-34', 'room-408', '2026-09-02', '2026-09-05', 3, '2026-09-02 14:00:00', '2026-09-05 12:00:00', 'DA_TRA_PHONG', 'nv-letan-02', 'nv-letan-02');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-34', '2026-09-02', 1200000, 'price-end26-3'),
('detail-34', '2026-09-03', 1200000, 'price-end26-3'),
('detail-34', '2026-09-04', 1200000, 'price-end26-3');

INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung) VALUES
('usg-34', 'detail-34', 'svc-8', 'nv-letan-02', 3, 150000, '2026-09-03 10:00:00');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-34', 'HD-000034', '2026-09-05 12:00:00', 3600000, 450000, 720000, 4050000, 0, 'DA_THANH_TOAN', '2026-09-05 12:05:00', 'nv-letan-02');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-34' WHERE id = 'detail-34';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id) VALUES
('pay-34a', 'TIEN_COC', 720000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-08-21 10:00:00', 'REF-034A', 'book-34', NULL, 'nv-admin-01'),
('pay-34b', 'THANH_TOAN_HOA_DON', 3330000, 'TIEN_MAT', 'THANH_CONG', '2026-09-05 12:05:00', 'REF-034B', 'book-34', 'inv-34', 'nv-letan-02');

-- BOOKING 35: Đầu tháng 10 (02-05/10/2026 - Standard, 3 đêm x 500.000) - đã trả phòng trước mốc
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-35', 'BOOK0035', 'customer-17', 'nv-letan-01', '2026-09-28 11:00:00', 'TRUC_TIEP', 1500000, 0, 'DA_TRA_PHONG');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-35', 'book-35', 'room-402', '2026-10-02', '2026-10-05', 2, '2026-10-02 14:00:00', '2026-10-05 12:00:00', 'DA_TRA_PHONG', 'nv-letan-01', 'nv-letan-01');

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-35', '2026-10-02', 500000, 'price-end26-1'),
('detail-35', '2026-10-03', 500000, 'price-end26-1'),
('detail-35', '2026-10-04', 500000, 'price-end26-1');

INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, thoi_gian_chot, nhan_vien_chot_id)
VALUES ('inv-35', 'HD-000035', '2026-10-05 12:00:00', 1500000, 0, 0, 1500000, 0, 'DA_THANH_TOAN', '2026-10-05 12:05:00', 'nv-letan-01');
UPDATE chi_tiet_dat_phong SET hoa_don_id = 'inv-35' WHERE id = 'detail-35';

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
VALUES ('pay-35', 'THANH_TOAN_HOA_DON', 1500000, 'TIEN_MAT', 'THANH_CONG', '2026-10-05 12:05:00', 'REF-035', 'book-35', 'inv-35', 'nv-letan-01');

-- BOOKING 36: Cuối tháng 11 (25-28/11/2026 - Superior, 3 đêm x 800.000) - đặt trước, đã cọc
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-36', 'BOOK0036', 'customer-18', 'nv-letan-02', '2026-10-05 10:00:00', 'ONLINE', 2400000, 480000, 'DA_DAT');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-36', 'book-36', 'room-506', '2026-11-25', '2026-11-28', 2, NULL, NULL, 'DA_DAT', NULL, NULL);

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-36', '2026-11-25', 800000, 'price-end26-2'),
('detail-36', '2026-11-26', 800000, 'price-end26-2'),
('detail-36', '2026-11-27', 800000, 'price-end26-2');

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
VALUES ('pay-36a', 'TIEN_COC', 480000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-10-06 10:00:00', 'REF-036A', 'book-36', NULL, 'nv-letan-02');

-- BOOKING 37: Giáng sinh 2026 (24-27/12/2026 - Deluxe, 3 đêm x 1.200.000) - khách VIP đặt trước, đã cọc
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-37', 'BOOK0037', 'customer-1', 'nv-admin-01', '2026-10-07 10:00:00', 'ONLINE', 3600000, 720000, 'DA_DAT');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-37', 'book-37', 'room-509', '2026-12-24', '2026-12-27', 3, NULL, NULL, 'DA_DAT', NULL, NULL);

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-37', '2026-12-24', 1200000, 'price-end26-3'),
('detail-37', '2026-12-25', 1200000, 'price-end26-3'),
('detail-37', '2026-12-26', 1200000, 'price-end26-3');

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
VALUES ('pay-37a', 'TIEN_COC', 720000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-10-08 10:00:00', 'REF-037A', 'book-37', NULL, 'nv-admin-01');

-- BOOKING 38: Tết Dương lịch 2027 (31/12/2026-04/01/2027 - Suite, vắt qua 2 bảng giá)
--   Đêm 31/12/2026: price-end26-4 | Đêm 01-03/01/2027: price-low27-4 => 4 x 2.500.000
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-38', 'BOOK0038', 'customer-4', 'nv-admin-01', '2026-10-08 09:30:00', 'ONLINE', 10000000, 2000000, 'DA_DAT');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-38', 'book-38', 'room-310', '2026-12-31', '2027-01-04', 4, NULL, NULL, 'DA_DAT', NULL, NULL);

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-38', '2026-12-31', 2500000, 'price-end26-4'),
('detail-38', '2027-01-01', 2500000, 'price-low27-4'),
('detail-38', '2027-01-02', 2500000, 'price-low27-4'),
('detail-38', '2027-01-03', 2500000, 'price-low27-4');

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
VALUES ('pay-38a', 'TIEN_COC', 2000000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-10-08 15:00:00', 'REF-038A', 'book-38', NULL, 'nv-admin-01');

-- BOOKING 39: Tháng 2/2027 (10-13/02/2027 - Standard, 3 đêm x 500.000) - đặt trước, đã cọc
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-39', 'BOOK0039', 'customer-19', 'nv-letan-02', '2026-10-09 10:00:00', 'ONLINE', 1500000, 300000, 'DA_DAT');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-39', 'book-39', 'room-503', '2027-02-10', '2027-02-13', 2, NULL, NULL, 'DA_DAT', NULL, NULL);

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-39', '2027-02-10', 500000, 'price-low27-1'),
('detail-39', '2027-02-11', 500000, 'price-low27-1'),
('detail-39', '2027-02-12', 500000, 'price-low27-1');

INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
VALUES ('pay-39', 'TIEN_COC', 300000, 'CHUYEN_KHOAN', 'THANH_CONG', '2026-10-09 14:00:00', 'REF-039', 'book-39', NULL, 'nv-letan-02');

-- BOOKING 40: Tháng 3/2027 (15-19/03/2027 - Superior, 4 đêm x 800.000) - chờ xác nhận, chưa cọc
INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, nhan_vien_tao_id, ngay_tao, kenh_dat, tong_tien_du_kien, tien_coc_yeu_cau, trang_thai)
VALUES ('book-40', 'BOOK0040', 'customer-20', 'nv-letan-01', '2026-10-10 09:00:00', 'ONLINE', 3200000, 640000, 'CHO_XAC_NHAN');

INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, thoi_gian_nhan_thuc_te, thoi_gian_tra_thuc_te, trang_thai, nhan_vien_nhan_id, nhan_vien_tra_id)
VALUES ('detail-40', 'book-40', 'room-507', '2027-03-15', '2027-03-19', 2, NULL, NULL, 'CHO_XAC_NHAN', NULL, NULL);

INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id) VALUES
('detail-40', '2027-03-15', 800000, 'price-low27-2'),
('detail-40', '2027-03-16', 800000, 'price-low27-2'),
('detail-40', '2027-03-17', 800000, 'price-low27-2'),
('detail-40', '2027-03-18', 800000, 'price-low27-2');

-- ============================================================
-- Đồng bộ trạng thái phòng: phòng có khách đang ở -> DANG_O
-- ============================================================
UPDATE phong SET trang_thai_su_dung = 'DANG_O'
WHERE id IN (SELECT phong_id FROM chi_tiet_dat_phong WHERE trang_thai = 'DA_NHAN');

-- ============================================================
-- KIỂM TRA TÍNH NHẤT QUÁN DỮ LIỆU
-- Nếu vi phạm bất kỳ quy tắc nào, script sẽ dừng với thông báo lỗi
-- ============================================================
DO $$
DECLARE
    v_moc DATE := DATE '2026-10-10';
    v_loi INT;
BEGIN
    -- [1] chi_tiet_gia_phong phủ đúng từng đêm lưu trú (không thiếu, không thừa)
    SELECT COUNT(*) INTO v_loi
    FROM chi_tiet_dat_phong ct
    LEFT JOIN (SELECT chi_tiet_dat_phong_id, COUNT(*) AS so_dem,
                      MIN(ngay_luu_tru) AS dem_dau, MAX(ngay_luu_tru) AS dem_cuoi
               FROM chi_tiet_gia_phong GROUP BY chi_tiet_dat_phong_id) g
           ON g.chi_tiet_dat_phong_id = ct.id
    WHERE g.so_dem IS DISTINCT FROM (ct.ngay_tra_du_kien - ct.ngay_nhan_du_kien)::BIGINT
       OR g.dem_dau <> ct.ngay_nhan_du_kien
       OR g.dem_cuoi <> ct.ngay_tra_du_kien - 1;
    IF v_loi > 0 THEN RAISE EXCEPTION '[1] % chi_tiet_dat_phong có chi_tiet_gia_phong sai số đêm', v_loi; END IF;

    -- [2] don_gia từng đêm khớp bảng giá đúng loại phòng + đúng khoảng thời gian
    SELECT COUNT(*) INTO v_loi
    FROM chi_tiet_gia_phong g
    JOIN chi_tiet_dat_phong ct ON ct.id = g.chi_tiet_dat_phong_id
    JOIN phong p ON p.id = ct.phong_id
    LEFT JOIN gia_phong gp ON gp.id = g.bang_gia_phong_id
    WHERE gp.id IS NULL
       OR gp.ma_loai_phong <> p.ma_loai_phong
       OR g.don_gia <> gp.don_gia
       OR g.ngay_luu_tru::timestamp NOT BETWEEN gp.ngay_bat_dau AND gp.ngay_ket_thuc;
    IF v_loi > 0 THEN RAISE EXCEPTION '[2] % dòng chi_tiet_gia_phong không khớp bảng gia_phong', v_loi; END IF;

    -- [3] Phiếu đặt phòng: tổng dự kiến = tổng giá các đêm, cọc = 0 hoặc 20%
    SELECT COUNT(*) INTO v_loi
    FROM phieu_dat_phong pdp
    LEFT JOIN (SELECT ct.phieu_dat_phong_id, SUM(g.don_gia) AS tong
               FROM chi_tiet_dat_phong ct
               JOIN chi_tiet_gia_phong g ON g.chi_tiet_dat_phong_id = ct.id
               GROUP BY ct.phieu_dat_phong_id) s ON s.phieu_dat_phong_id = pdp.id
    WHERE s.tong IS NULL
       OR pdp.tong_tien_du_kien <> s.tong
       OR pdp.tien_coc_yeu_cau NOT IN (0, ROUND(s.tong * 0.2));
    IF v_loi > 0 THEN RAISE EXCEPTION '[3] % phieu_dat_phong sai tong_tien_du_kien / tien_coc_yeu_cau', v_loi; END IF;

    -- [4] Hóa đơn: tiền phòng, tiền dịch vụ, tổng tiền
    SELECT COUNT(*) INTO v_loi
    FROM hoa_don hd
    LEFT JOIN (SELECT ct.hoa_don_id, SUM(g.don_gia) AS tien_phong
               FROM chi_tiet_dat_phong ct
               JOIN chi_tiet_gia_phong g ON g.chi_tiet_dat_phong_id = ct.id
               WHERE ct.hoa_don_id IS NOT NULL GROUP BY ct.hoa_don_id) r ON r.hoa_don_id = hd.id
    LEFT JOIN (SELECT ct.hoa_don_id, SUM(sd.so_luong * sd.don_gia_ap_dung) AS tien_dv
               FROM chi_tiet_dat_phong ct
               JOIN su_dung_dich_vu sd ON sd.chi_tiet_dat_phong_id = ct.id
               WHERE ct.hoa_don_id IS NOT NULL GROUP BY ct.hoa_don_id) s ON s.hoa_don_id = hd.id
    WHERE hd.tien_phong IS DISTINCT FROM r.tien_phong
       OR hd.tien_dich_vu <> COALESCE(s.tien_dv, 0)
       OR hd.tong_tien <> hd.tien_phong + hd.tien_dich_vu;
    IF v_loi > 0 THEN RAISE EXCEPTION '[4] % hoa_don sai tien_phong / tien_dich_vu / tong_tien', v_loi; END IF;

    -- [5] Hóa đơn khớp với các giao dịch thanh toán
    SELECT COUNT(*) INTO v_loi
    FROM hoa_don hd
    JOIN (SELECT DISTINCT hoa_don_id, phieu_dat_phong_id
          FROM chi_tiet_dat_phong WHERE hoa_don_id IS NOT NULL) m ON m.hoa_don_id = hd.id
    LEFT JOIN (SELECT phieu_dat_phong_id,
                      SUM(so_tien) FILTER (WHERE loai_giao_dich = 'TIEN_COC') AS coc,
                      SUM(so_tien) FILTER (WHERE loai_giao_dich = 'THANH_TOAN_HOA_DON') AS da_tra
               FROM thanh_toan WHERE trang_thai = 'THANH_CONG'
               GROUP BY phieu_dat_phong_id) t ON t.phieu_dat_phong_id = m.phieu_dat_phong_id
    WHERE hd.tien_coc_da_khau_tru <> COALESCE(t.coc, 0)
       OR hd.so_tien_con_lai <> hd.tong_tien - COALESCE(t.coc, 0) - COALESCE(t.da_tra, 0)
       OR (hd.trang_thai = 'DA_THANH_TOAN' AND hd.so_tien_con_lai <> 0);
    IF v_loi > 0 THEN RAISE EXCEPTION '[5] % hoa_don không khớp thanh_toan', v_loi; END IF;

    -- [6] Giao dịch: thanh toán hóa đơn phải trỏ đúng hóa đơn của phiếu, tiền cọc không gắn hóa đơn
    SELECT COUNT(*) INTO v_loi
    FROM thanh_toan tt
    WHERE (tt.loai_giao_dich = 'THANH_TOAN_HOA_DON' AND NOT EXISTS (
              SELECT 1 FROM chi_tiet_dat_phong ct
              WHERE ct.phieu_dat_phong_id = tt.phieu_dat_phong_id AND ct.hoa_don_id = tt.hoa_don_id))
       OR (tt.loai_giao_dich = 'TIEN_COC' AND tt.hoa_don_id IS NOT NULL);
    IF v_loi > 0 THEN RAISE EXCEPTION '[6] % thanh_toan liên kết sai phiếu/hóa đơn', v_loi; END IF;

    -- [7] Cọc đã thu = cọc yêu cầu (booking đã xác nhận); booking chờ xác nhận chưa thu tiền
    SELECT COUNT(*) INTO v_loi
    FROM phieu_dat_phong pdp
    LEFT JOIN (SELECT phieu_dat_phong_id, SUM(so_tien) AS coc
               FROM thanh_toan WHERE loai_giao_dich = 'TIEN_COC' AND trang_thai = 'THANH_CONG'
               GROUP BY phieu_dat_phong_id) t ON t.phieu_dat_phong_id = pdp.id
    WHERE (pdp.trang_thai IN ('DA_DAT', 'DA_NHAN', 'DA_TRA_PHONG') AND COALESCE(t.coc, 0) <> pdp.tien_coc_yeu_cau)
       OR (pdp.trang_thai = 'CHO_XAC_NHAN' AND t.coc IS NOT NULL);
    IF v_loi > 0 THEN RAISE EXCEPTION '[7] % phieu_dat_phong có tiền cọc không khớp', v_loi; END IF;

    -- [8] Trạng thái <-> thời gian (so với mốc 10/10/2026) <-> hóa đơn
    SELECT COUNT(*) INTO v_loi
    FROM chi_tiet_dat_phong ct
    JOIN phieu_dat_phong pdp ON pdp.id = ct.phieu_dat_phong_id
    LEFT JOIN hoa_don hd ON hd.id = ct.hoa_don_id
    WHERE ct.trang_thai <> pdp.trang_thai::TEXT
       OR (ct.trang_thai = 'DA_TRA_PHONG' AND NOT (
              ct.ngay_tra_du_kien <= v_moc
              AND ct.thoi_gian_nhan_thuc_te IS NOT NULL AND ct.thoi_gian_tra_thuc_te IS NOT NULL
              AND hd.trang_thai IS NOT DISTINCT FROM 'DA_THANH_TOAN'))
       OR (ct.trang_thai = 'DA_NHAN' AND NOT (
              ct.ngay_nhan_du_kien <= v_moc AND ct.ngay_tra_du_kien > v_moc
              AND ct.thoi_gian_nhan_thuc_te IS NOT NULL AND ct.thoi_gian_tra_thuc_te IS NULL
              AND hd.trang_thai IS NOT DISTINCT FROM 'CHUA_CHOT'))
       OR (ct.trang_thai IN ('DA_DAT', 'CHO_XAC_NHAN') AND NOT (
              ct.ngay_nhan_du_kien > v_moc
              AND ct.thoi_gian_nhan_thuc_te IS NULL AND ct.hoa_don_id IS NULL))
       OR pdp.ngay_tao::DATE > ct.ngay_nhan_du_kien
       OR pdp.ngay_tao >= (v_moc + 1)::TIMESTAMP;
    IF v_loi > 0 THEN RAISE EXCEPTION '[8] % chi_tiet_dat_phong sai trạng thái/thời gian', v_loi; END IF;

    -- [9] Không có 2 booking trùng phòng trùng ngày
    SELECT COUNT(*) INTO v_loi
    FROM chi_tiet_dat_phong a
    JOIN chi_tiet_dat_phong b
      ON a.phong_id = b.phong_id AND a.id < b.id
     AND a.ngay_nhan_du_kien < b.ngay_tra_du_kien
     AND b.ngay_nhan_du_kien < a.ngay_tra_du_kien
    WHERE a.trang_thai NOT IN ('DA_HUY', 'CHO_HUY')
      AND b.trang_thai NOT IN ('DA_HUY', 'CHO_HUY');
    IF v_loi > 0 THEN RAISE EXCEPTION '[9] % cặp booking bị trùng phòng', v_loi; END IF;

    -- [10] Dịch vụ: dùng trong thời gian lưu trú thực tế, đúng đơn giá niêm yết
    SELECT COUNT(*) INTO v_loi
    FROM su_dung_dich_vu sd
    JOIN chi_tiet_dat_phong ct ON ct.id = sd.chi_tiet_dat_phong_id
    JOIN dich_vu dv ON dv.id = sd.dich_vu_id
    WHERE ct.thoi_gian_nhan_thuc_te IS NULL
       OR sd.thoi_gian_su_dung < ct.thoi_gian_nhan_thuc_te
       OR sd.thoi_gian_su_dung > COALESCE(ct.thoi_gian_tra_thuc_te, (v_moc + 1)::TIMESTAMP)
       OR sd.don_gia_ap_dung <> dv.don_gia_hien_tai;
    IF v_loi > 0 THEN RAISE EXCEPTION '[10] % su_dung_dich_vu sai thời gian/đơn giá', v_loi; END IF;

    -- [11] Số khách <= sức chứa; khách hàng được tạo trước khi đặt phòng
    SELECT COUNT(*) INTO v_loi
    FROM chi_tiet_dat_phong ct
    JOIN phong p ON p.id = ct.phong_id
    JOIN loai_phong lp ON lp.id = p.ma_loai_phong
    JOIN phieu_dat_phong pdp ON pdp.id = ct.phieu_dat_phong_id
    JOIN khach_hang kh ON kh.id = pdp.khach_hang_id
    WHERE ct.so_khach > lp.suc_chua_toi_da
       OR kh.ngay_tao > pdp.ngay_tao;
    IF v_loi > 0 THEN RAISE EXCEPTION '[11] % booking vượt sức chứa hoặc khách tạo sau booking', v_loi; END IF;

    -- [12] Thời gian giao dịch: sau ngày đặt, trước mốc; thanh toán hóa đơn đúng lúc chốt
    SELECT COUNT(*) INTO v_loi
    FROM thanh_toan tt
    JOIN phieu_dat_phong pdp ON pdp.id = tt.phieu_dat_phong_id
    LEFT JOIN hoa_don hd ON hd.id = tt.hoa_don_id
    WHERE tt.thoi_gian < pdp.ngay_tao
       OR tt.thoi_gian >= (v_moc + 1)::TIMESTAMP
       OR (tt.loai_giao_dich = 'THANH_TOAN_HOA_DON' AND tt.thoi_gian IS DISTINCT FROM hd.thoi_gian_chot);
    IF v_loi > 0 THEN RAISE EXCEPTION '[12] % thanh_toan sai thời gian', v_loi; END IF;

    -- [13] Trạng thái phòng: DANG_O <=> đang có khách DA_NHAN
    SELECT COUNT(*) INTO v_loi
    FROM phong p
    WHERE (p.trang_thai_su_dung = 'DANG_O') <> EXISTS (
              SELECT 1 FROM chi_tiet_dat_phong ct WHERE ct.phong_id = p.id AND ct.trang_thai = 'DA_NHAN');
    IF v_loi > 0 THEN RAISE EXCEPTION '[13] % phòng sai trang_thai_su_dung', v_loi; END IF;

    RAISE NOTICE '✅ Dữ liệu nhất quán: % phiếu, % chi tiết đặt phòng, % chi tiết giá phòng, % hóa đơn, % thanh toán, % sử dụng dịch vụ',
        (SELECT COUNT(*) FROM phieu_dat_phong),
        (SELECT COUNT(*) FROM chi_tiet_dat_phong),
        (SELECT COUNT(*) FROM chi_tiet_gia_phong),
        (SELECT COUNT(*) FROM hoa_don),
        (SELECT COUNT(*) FROM thanh_toan),
        (SELECT COUNT(*) FROM su_dung_dich_vu);
END $$;

-- ============================================================
-- Tổng kết dữ liệu đã tạo
-- ============================================================
-- ✅ 4 loại phòng, 15 tiện nghi, 50 phòng (250 ảnh)
-- ✅ 16 bảng giá (4 loại phòng x 4 khoảng thời gian)
-- ✅ 4 nhân viên, 20 khách hàng (5 VIP)
-- ✅ 3 danh mục dịch vụ, 8 dịch vụ
-- ✅ 40 phiếu đặt phòng / 40 chi tiết đặt phòng:
--    • 30 DA_TRA_PHONG (tháng 1 -> 10/2026, có hóa đơn DA_THANH_TOAN)
--    •  3 DA_NHAN      (đang ở tại mốc 10/10/2026, hóa đơn CHUA_CHOT)
--    •  5 DA_DAT       (đặt trước, đã cọc)
--    •  2 CHO_XAC_NHAN (chưa cọc)
-- ✅ 127 chi tiết giá phòng (1 dòng / 1 đêm, khớp bảng gia_phong)
-- ✅ 33 hóa đơn, 48 giao dịch thanh toán, 21 lượt sử dụng dịch vụ
-- ✅ Phủ các dịp lễ: Tết DL, Valentine, Giỗ tổ, 30/4, Hè, 2/9, Giáng sinh, Tết DL 2027
