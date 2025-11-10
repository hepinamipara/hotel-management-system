const db = require('../config/database');

exports.getAllGuests = async (req, res) => {
  try {
    const [guests] = await db.query('SELECT * FROM guests ORDER BY created_at DESC');
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guests', error: error.message });
  }
};

exports.getGuestById = async (req, res) => {
  try {
    const [guest] = await db.query('SELECT * FROM guests WHERE id = ?', [req.params.id]);
    if (guest.length === 0) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guest', error: error.message });
  }
};

exports.createGuest = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, id_number, address } = req.body;
    const [result] = await db.query(
      'INSERT INTO guests (first_name, last_name, email, phone, id_number, address) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, id_number, address]
    );
    res.status(201).json({ message: 'Guest created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating guest', error: error.message });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, id_number, address } = req.body;
    await db.query(
      'UPDATE guests SET first_name = ?, last_name = ?, email = ?, phone = ?, id_number = ?, address = ? WHERE id = ?',
      [first_name, last_name, email, phone, id_number, address, req.params.id]
    );
    res.json({ message: 'Guest updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating guest', error: error.message });
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    await db.query('DELETE FROM guests WHERE id = ?', [req.params.id]);
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting guest', error: error.message });
  }
};
