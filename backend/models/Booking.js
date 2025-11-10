const db = require('../config/database');

class Booking {
  static async findAll() {
    const [rows] = await db.query(`
      SELECT b.*, 
             CONCAT(g.first_name, ' ', g.last_name) as guest_name,
             g.email as guest_email,
             g.phone as guest_phone,
             r.room_number,
             r.room_type
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT b.*, 
             CONCAT(g.first_name, ' ', g.last_name) as guest_name,
             g.email as guest_email,
             g.phone as guest_phone,
             r.room_number,
             r.room_type,
             r.price
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByGuestId(guestId) {
    const [rows] = await db.query('SELECT * FROM bookings WHERE guest_id = ?', [guestId]);
    return rows;
  }

  static async findByRoomId(roomId) {
    const [rows] = await db.query('SELECT * FROM bookings WHERE room_id = ?', [roomId]);
    return rows;
  }

  static async create(bookingData) {
    const { guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests } = bookingData;
    const [result] = await db.query(
      'INSERT INTO bookings (guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests) VALUES (?, ?, ?, ?, ?, ?)',
      [guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests]
    );
    return result.insertId;
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    return true;
  }

  static async delete(id) {
    await db.query('DELETE FROM bookings WHERE id = ?', [id]);
    return true;
  }

  static async checkAvailability(roomId, checkIn, checkOut) {
    const [rows] = await db.query(`
      SELECT * FROM bookings 
      WHERE room_id = ? 
      AND status NOT IN ('cancelled', 'checked-out')
      AND (
        (check_in_date <= ? AND check_out_date >= ?) OR
        (check_in_date <= ? AND check_out_date >= ?) OR
        (check_in_date >= ? AND check_out_date <= ?)
      )
    `, [roomId, checkOut, checkIn, checkOut, checkOut, checkIn, checkOut]);
    return rows.length === 0;
  }
}

module.exports = Booking;
