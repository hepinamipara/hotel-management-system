CREATE DATABASE IF NOT EXISTS hotel_management;
USE hotel_management;

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(10) UNIQUE NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
  description TEXT,
  capacity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  id_number VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guest_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('confirmed', 'checked-in', 'checked-out', 'cancelled') DEFAULT 'confirmed',
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guest_id) REFERENCES guests(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Insert sample rooms
INSERT INTO rooms (room_number, room_type, price, capacity, description) VALUES
('101', 'Single', 50.00, 1, 'Cozy single room with city view'),
('102', 'Single', 50.00, 1, 'Comfortable single room'),
('201', 'Double', 80.00, 2, 'Spacious double room with balcony'),
('202', 'Double', 80.00, 2, 'Modern double room'),
('301', 'Suite', 150.00, 4, 'Luxury suite with living area'),
('302', 'Suite', 150.00, 4, 'Premium suite with ocean view'),
('401', 'Deluxe', 120.00, 3, 'Deluxe room with king bed'),
('402', 'Deluxe', 120.00, 3, 'Deluxe room with premium amenities');