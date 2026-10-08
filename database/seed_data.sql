-- Insert Room Categories
INSERT INTO room_category (name, description) VALUES
('Standard', 'Phòng tiêu chuẩn'),
('Superior', 'Phòng cao cấp hơn'),
('Deluxe', 'Phòng sang trọng'),
('Suite', 'Phòng tổng thống');

-- Insert 50 Rooms
DO $$
DECLARE
    floor INT;
    room_num INT;
    cat_id INT;
BEGIN
    FOR floor IN 1..5 LOOP
        FOR room_num IN 1..10 LOOP
            IF floor = 1 THEN cat_id := 1; END IF;
            IF floor = 2 THEN cat_id := 1; END IF;
            IF floor = 3 THEN cat_id := 2; END IF;
            IF floor = 4 THEN cat_id := 3; END IF;
            IF floor = 5 THEN cat_id := 4; END IF;
            
            INSERT INTO room (room_number, status, room_category_id)
            VALUES (floor || TO_CHAR(room_num, 'fm00'), 'AVAILABLE', cat_id);
        END LOOP;
    END LOOP;
END $$;

-- Insert Price List
INSERT INTO price_list (room_category_id, start_date, end_date, price) VALUES
(1, '2026-01-01', '2026-12-31', 500000),
(2, '2026-01-01', '2026-12-31', 800000),
(3, '2026-01-01', '2026-12-31', 1200000),
(4, '2026-01-01', '2026-12-31', 2500000);

-- Insert Bookings (Mock data for UC-04 test)
-- Room 101 booked from 2026-10-10 to 2026-10-15
-- Room 102 booked from 2026-10-12 to 2026-10-14
-- Room 101 booked from 2026-10-16 to 2026-10-20
INSERT INTO booking (customer_name, customer_phone, check_in_date, check_out_date, room_id, status) VALUES
('Nguyen Van A', '0123456789', '2026-10-10', '2026-10-15', 1, 'CONFIRMED'),
('Tran Thi B', '0987654321', '2026-10-12', '2026-10-14', 2, 'CONFIRMED'),
('Le Van C', '0912345678', '2026-10-16', '2026-10-20', 1, 'CONFIRMED');
