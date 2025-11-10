const db = require('../config/database');

exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
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
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const [booking] = await db.query(`
      SELECT b.*, 
             CONCAT(g.first_name, ' ', g.last_name) as guest_name,
             g.email as guest_email,
             r.room_number,
             r.room_type
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `, [req.params.id]);
    if (booking.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO bookings (guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests) VALUES (?, ?, ?, ?, ?, ?)',
      [guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests]
    );
    
    await db.query('UPDATE rooms SET status = "occupied" WHERE id = ?', [room_id]);
    
    res.status(201).json({ message: 'Booking created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [booking] = await db.query('SELECT room_id FROM bookings WHERE id = ?', [req.params.id]);
    
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    
    if (status === 'checked-out' || status === 'cancelled') {
      await db.query('UPDATE rooms SET status = "available" WHERE id = ?', [booking[0].room_id]);
    }
    
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const [booking] = await db.query('SELECT room_id FROM bookings WHERE id = ?', [req.params.id]);
    await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    await db.query('UPDATE rooms SET status = "available" WHERE id = ?', [booking[0].room_id]);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};
