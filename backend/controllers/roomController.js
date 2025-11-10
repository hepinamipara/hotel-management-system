const db = require('../config/database');

exports.getAllRooms = async (req, res) => {
  try {
    const [rooms] = await db.query('SELECT * FROM rooms ORDER BY room_number');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

exports.getAvailableRooms = async (req, res) => {
  try {
    const [rooms] = await db.query('SELECT * FROM rooms WHERE status = "available" ORDER BY room_number');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available rooms', error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const [room] = await db.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (room.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { room_number, room_type, price, capacity, description } = req.body;
    const [result] = await db.query(
      'INSERT INTO rooms (room_number, room_type, price, capacity, description) VALUES (?, ?, ?, ?, ?)',
      [room_number, room_type, price, capacity, description]
    );
    res.status(201).json({ message: 'Room created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { room_type, price, status, capacity, description } = req.body;
    await db.query(
      'UPDATE rooms SET room_type = ?, price = ?, status = ?, capacity = ?, description = ? WHERE id = ?',
      [room_type, price, status, capacity, description, req.params.id]
    );
    res.json({ message: 'Room updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await db.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};
