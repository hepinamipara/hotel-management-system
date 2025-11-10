const db = require('../config/database');

class Guest {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM guests ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM guests WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM guests WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(guestData) {
    const { first_name, last_name, email, phone, id_number, address } = guestData;
    const [result] = await db.query(
      'INSERT INTO guests (first_name, last_name, email, phone, id_number, address) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, id_number, address]
    );
    return result.insertId;
  }

  static async update(id, guestData) {
    const { first_name, last_name, email, phone, id_number, address } = guestData;
    await db.query(
      'UPDATE guests SET first_name = ?, last_name = ?, email = ?, phone = ?, id_number = ?, address = ? WHERE id = ?',
      [first_name, last_name, email, phone, id_number, address, id]
    );
    return true;
  }

  static async delete(id) {
    await db.query('DELETE FROM guests WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Guest;
