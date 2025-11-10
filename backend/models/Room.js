const db = require('../config/database');

class Room {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM rooms ORDER BY room_number');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAvailable() {
    const [rows] = await db.query('SELECT * FROM rooms WHERE status = "available" ORDER BY room_number');
    return rows;
  }

  static async create(roomData) {
    const { room_number, room_type, price, capacity, description } = roomData;
    const [result] = await db.query(
      'INSERT INTO rooms (room_number, room_type, price, capacity, description) VALUES (?, ?, ?, ?, ?)',
      [room_number, room_type, price, capacity, description]
    );
    return result.insertId;
  }

  static async update(id, roomData) {
    const { room_type, price, status, capacity, description } = roomData;
    await db.query(
      'UPDATE rooms SET room_type = ?, price = ?, status = ?, capacity = ?, description = ? WHERE id = ?',
      [room_type, price, status, capacity, description, id]
    );
    return true;
  }

  static async delete(id) {
    await db.query('DELETE FROM rooms WHERE id = ?', [id]);
    return true;
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE rooms SET status = ? WHERE id = ?', [status, id]);
    return true;
  }
}

module.exports = Room;
