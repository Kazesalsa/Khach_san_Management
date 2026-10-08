CREATE TABLE IF NOT EXISTS room_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS room (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL, 
    room_category_id INT NOT NULL,
    FOREIGN KEY (room_category_id) REFERENCES room_category(id)
);

CREATE TABLE IF NOT EXISTS price_list (
    id SERIAL PRIMARY KEY,
    room_category_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (room_category_id) REFERENCES room_category(id)
);

CREATE TABLE IF NOT EXISTS booking (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    room_id INT NOT NULL,
    status VARCHAR(50) NOT NULL, 
    FOREIGN KEY (room_id) REFERENCES room(id)
);
