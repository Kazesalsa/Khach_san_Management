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

-- Insert Room Categories
INSERT INTO loai_phong (id, ten, mo_ta, suc_chua_toi_da) VALUES
('cat-1', 'Standard', 'Phòng tiêu chuẩn phù hợp cho khách lẻ và cặp đôi', 2),
('cat-2', 'Superior', 'Phòng cao cấp với tầm nhìn đẹp', 2),
('cat-3', 'Deluxe', 'Phòng sang trọng, diện tích rộng, nội thất cao cấp', 3),
('cat-4', 'Suite', 'Phòng tổng thống, đẳng cấp 5 sao', 4);



-- Insert Amenities (15 amenities)
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

-- Insert Room Category Amenities
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

-- Insert 50 Rooms (5 floors, 10 rooms each)
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

-- Insert Room Images (5 images per room for all 50 rooms - multi angles)
DO $$
DECLARE
    floor INT;
    room_num INT;
    room_id VARCHAR(36);
    c INT;
    i1 INT; i2 INT; i3 INT; i4 INT; i5 INT;
    
    -- 25 ảnh cực đẹp chuẩn Unsplash (Chia 5 góc độ)
    bed_ids TEXT[] := ARRAY['1566665797739-1674de7a421a', '1591088398332-8a7791972843', '1582719508461-890f11f40ce6', '1590490360182-c33d57733427', '1512918728675-ed5a9ecdebfd'];
    bath_ids TEXT[] := ARRAY['1584622650111-993a426fbf0a', '1600566753190-17f0baa2cb32', '1552321554-5d5d36dc1604', '1604709177227-08728731d16f', '1507652313628-9773c1d43a60'];
    view_ids TEXT[] := ARRAY['1582719478250-c89facf4a4bf', '1538944570562-2c9cb7857097', '1510798831971-661eb04b3739', '1572987653523-389fbff2794c', '1564013799919-ab600027ffc6'];
    desk_ids TEXT[] := ARRAY['1505692794401-ca20ba3b8fb3', '1560067174-c5a3a8f37060', '1554995207-c18c203602cb', '1522771739844-6a9f6d5f14af', '1445019980597-93fa8acb246c'];
    detail_ids TEXT[] := ARRAY['1583847268964-b28ce7f3df82', '1596394516093-501ba68a0ba6', '1576675784201-0e142b423952', '1611892440504-42a792e24d32', '1505691938859-f0a0e60ea20f'];
BEGIN
    FOR floor IN 1..5 LOOP
        FOR room_num IN 1..10 LOOP
            room_id := 'room-' || floor || TO_CHAR(room_num, 'fm00');
            c := (floor - 1) * 10 + room_num; -- Biến chạy từ 1 đến 50
            
            -- Thuật toán xáo trộn ma trận (mix and match) để 50 phòng không bị trùng nhau
            i1 := 1 + (c % 5);
            i2 := 1 + ((c / 5) % 5);
            i3 := 1 + ((c / 25) % 5);
            i4 := 1 + ((c + 1) % 5);
            i5 := 1 + ((c + 3) % 5);
            
            -- Ảnh 1: Giường ngủ (Ảnh đại diện)
            INSERT INTO phong_hinh_anh (id, url, thu_tu_hien_thi, la_anh_dai_dien, phong_id) VALUES 
            ('img-' || room_id || '-1', 'https://images.unsplash.com/photo-' || bed_ids[i1] || '?auto=format&fit=crop&w=800&q=80', '1', 'true', room_id);
            
            -- Ảnh 2: Phòng tắm
            INSERT INTO phong_hinh_anh (id, url, thu_tu_hien_thi, la_anh_dai_dien, phong_id) VALUES 
            ('img-' || room_id || '-2', 'https://images.unsplash.com/photo-' || bath_ids[i2] || '?auto=format&fit=crop&w=800&q=80', '2', 'false', room_id);
            
            -- Ảnh 3: Ban công / View
            INSERT INTO phong_hinh_anh (id, url, thu_tu_hien_thi, la_anh_dai_dien, phong_id) VALUES 
            ('img-' || room_id || '-3', 'https://images.unsplash.com/photo-' || view_ids[i3] || '?auto=format&fit=crop&w=800&q=80', '3', 'false', room_id);
            
            -- Ảnh 4: Bàn ghế / Sofa
            INSERT INTO phong_hinh_anh (id, url, thu_tu_hien_thi, la_anh_dai_dien, phong_id) VALUES 
            ('img-' || room_id || '-4', 'https://images.unsplash.com/photo-' || desk_ids[i4] || '?auto=format&fit=crop&w=800&q=80', '4', 'false', room_id);
            
            -- Ảnh 5: Tiện ích chi tiết
            INSERT INTO phong_hinh_anh (id, url, thu_tu_hien_thi, la_anh_dai_dien, phong_id) VALUES 
            ('img-' || room_id || '-5', 'https://images.unsplash.com/photo-' || detail_ids[i5] || '?auto=format&fit=crop&w=800&q=80', '5', 'false', room_id);
            
        END LOOP;
    END LOOP;
END $$;

-- Insert Room Prices (Multiple periods for 2026 and 2027)
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

INSERT INTO khach_hang (
    id, tai_khoan_id, ho_ten, so_dien_thoai,
    cccd_ho_chieu, email, so_thich_phong
) VALUES
('kh-01', 'tk-khach-01', 'Nguyễn Văn Khách', '0900000001',
 '001234567890', 'khach1@example.com', 'Phòng tầng cao');
-- Generate 50 Customers
DO \$\$
DECLARE
    i INT;
    rand_cccd VARCHAR(20);
    rand_phone VARCHAR(15);
    is_vip BOOLEAN;
    vip_rank VARCHAR(20);
BEGIN
    FOR i IN 1..50 LOOP
        rand_cccd := '079' || lpad(floor(random() * 1000000000)::TEXT, 9, '0');
        rand_phone := '09' || lpad(floor(random() * 100000000)::TEXT, 8, '0');
        
        -- Thêm vào bảng khach_hang
        INSERT INTO khach_hang (id, ho_ten, so_dien_thoai, cccd_ho_chieu, email, so_thich_phong, ngay_tao)
        VALUES (
            'customer-' || i,
            'Khach hang ' || i,
            rand_phone,
            rand_cccd,
            'khachhang' || i || '@example.com',
            'Thích phòng yên tĩnh, view biển',
            CURRENT_TIMESTAMP
        );
        
        -- Random 20% là khách VIP
        is_vip := random() < 0.2;
        IF is_vip THEN
            IF random() < 0.5 THEN vip_rank := 'VANG'; ELSE vip_rank := 'BACH_KIM'; END IF;
            INSERT INTO khach_hang_vip (khach_hang_id, hang_vip) VALUES ('customer-' || i, vip_rank::hang_vip_enum);
        END IF;
    END LOOP;
END \$\$;

-- Generate 100 Random Bookings for 50 rooms
DO \$\$
DECLARE
    i INT;
    rand_room_floor INT;
    rand_room_num INT;
    rand_customer_id INT;
    room_id VARCHAR(36);
    checkin DATE;
    checkout DATE;
    duration INT;
    status_val VARCHAR(50);
BEGIN
    FOR i IN 1..100 LOOP
        rand_room_floor := floor(random() * 5 + 1)::INT;
        rand_room_num := floor(random() * 10 + 1)::INT;
        rand_customer_id := floor(random() * 50 + 1)::INT;
        room_id := 'room-' || rand_room_floor || TO_CHAR(rand_room_num, 'fm00');
        
        checkin := '2026-01-01'::DATE + (floor(random() * 345)::INT);
        duration := floor(random() * 7 + 1)::INT;
        checkout := checkin + duration;
        
        IF random() < 0.2 THEN status_val := 'CHO_HUY';
        ELSIF random() < 0.6 THEN status_val := 'DA_DAT';
        ELSE status_val := 'DA_TRA_PHONG';
        END IF;

        INSERT INTO phieu_dat_phong (id, ma_dat_phong, khach_hang_id, kenh_dat, trang_thai) 
        VALUES (
            'book-rand-' || i, 
            'BOOK' || TO_CHAR(i, 'fm0000'),
            'customer-' || rand_customer_id, 
            'TRUC_TIEP',
            status_val::trang_thai_dat_phong_enum
        );
        
        INSERT INTO chi_tiet_dat_phong (id, phieu_dat_phong_id, phong_id, ngay_nhan_du_kien, ngay_tra_du_kien, so_khach, trang_thai)
        VALUES (
            'detail-rand-' || i,
            'book-rand-' || i,
            room_id,
            checkin,
            checkout,
            2,
            'DA_DAT'
        );
    END LOOP;
END \$\$;


-- Generate Invoices, Payments, and Daily Room Prices
DO \$\$
DECLARE
    rec RECORD;
    curr_date DATE;
    inv_id VARCHAR(36);
    tien_phong DECIMAL(12,2);
    trang_thai_hd VARCHAR(50);
BEGIN
    FOR rec IN SELECT * FROM chi_tiet_dat_phong LOOP
        inv_id := 'inv-' || SUBSTRING(rec.id FROM 13); -- id is 'detail-rand-X'
        
        -- Giả sử giá phòng là 500k/đêm
        tien_phong := (rec.ngay_tra_du_kien - rec.ngay_nhan_du_kien) * 500000;
        IF tien_phong < 0 THEN tien_phong := 0; END IF;
        
        IF rec.trang_thai = 'DA_TRA_PHONG' THEN
            trang_thai_hd := 'DA_THANH_TOAN';
        ELSIF rec.trang_thai = 'DA_HUY' THEN
            trang_thai_hd := 'DA_HUY';
        ELSE
            trang_thai_hd := 'CHO_THANH_TOAN';
        END IF;

        -- Tạo Hóa Đơn
        INSERT INTO hoa_don (id, so_hoa_don, ngay_lap, tien_phong, tien_dich_vu, tien_coc_da_khau_tru, tong_tien, so_tien_con_lai, trang_thai, nhan_vien_chot_id)
        VALUES (
            inv_id, 
            'HD-' || LPAD(SUBSTRING(rec.id FROM 13), 6, '0'), 
            CURRENT_TIMESTAMP, 
            tien_phong, 
            0, 
            0, 
            tien_phong, 
            CASE WHEN trang_thai_hd = 'DA_THANH_TOAN' THEN 0 ELSE tien_phong END, 
            trang_thai_hd::trang_thai_hoa_don_enum, 
            'nv-admin-01'
        );

        -- Cập nhật hoa_don_id cho chi tiết đặt phòng
        UPDATE chi_tiet_dat_phong SET hoa_don_id = inv_id WHERE id = rec.id;

        -- Tạo Thanh toán (nếu đã thanh toán)
        IF trang_thai_hd = 'DA_THANH_TOAN' THEN
            INSERT INTO thanh_toan (id, loai_giao_dich, so_tien, phuong_thuc, trang_thai, thoi_gian, ma_tham_chieu, phieu_dat_phong_id, hoa_don_id, nhan_vien_thu_id)
            VALUES (
                'pay-' || SUBSTRING(rec.id FROM 13), 
                'THANH_TOAN_HOA_DON', 
                tien_phong, 
                'CHUYEN_KHOAN', 
                'THANH_CONG', 
                CURRENT_TIMESTAMP, 
                'REF-HD-' || LPAD(SUBSTRING(rec.id FROM 13), 6, '0'), 
                rec.phieu_dat_phong_id, 
                inv_id, 
                'nv-letan-01'
            );
        END IF;

        -- Tạo chi tiết giá phòng cho từng đêm
        curr_date := rec.ngay_nhan_du_kien;
        WHILE curr_date < rec.ngay_tra_du_kien LOOP
            INSERT INTO chi_tiet_gia_phong (chi_tiet_dat_phong_id, ngay_luu_tru, don_gia, bang_gia_phong_id)
            VALUES (rec.id, curr_date, 500000, NULL) ON CONFLICT DO NOTHING;
            curr_date := curr_date + 1;
        END LOOP;
        
    END LOOP;
END \$\$;

-- Insert Service Categories
INSERT INTO danh_muc_dich_vu (id, ten_danh_muc, mo_ta) VALUES
('cat-svc-1', 'Đồ ăn & Đồ uống (F&B)', 'Phục vụ ăn uống tại phòng'),
('cat-svc-2', 'Giặt ủi', 'Dịch vụ giặt, sấy, là ủi quần áo'),
('cat-svc-3', 'Spa & Massage', 'Dịch vụ chăm sóc sức khỏe và làm đẹp');

-- Insert Services
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

-- Generate Random Service Usages
DO \$\$
DECLARE
    rec RECORD;
    rand_svc INT;
    svc_price DECIMAL(12,2);
    svc_id VARCHAR(36);
    usage_id INT := 1;
BEGIN
    FOR rec IN SELECT * FROM chi_tiet_dat_phong WHERE trang_thai IN ('DA_NHAN', 'DA_TRA_PHONG') LOOP
        IF random() < 0.3 THEN
            rand_svc := floor(random() * 8 + 1)::INT;
            svc_id := 'svc-' || rand_svc;
            SELECT don_gia_hien_tai INTO svc_price FROM dich_vu WHERE id = svc_id;
            
            INSERT INTO su_dung_dich_vu (id, chi_tiet_dat_phong_id, dich_vu_id, nhan_vien_ghi_nhan_id, so_luong, don_gia_ap_dung, thoi_gian_su_dung)
            VALUES (
                'usg-' || usage_id,
                rec.id, 
                svc_id, 
                'nv-letan-01',
                floor(random() * 3 + 1)::INT,
                svc_price,
                rec.ngay_nhan_du_kien + interval '12 hours'
            );
            usage_id := usage_id + 1;
        END IF;
    END LOOP;
END \$\$;
