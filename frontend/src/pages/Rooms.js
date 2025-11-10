import React, { useState, useEffect } from 'react';
import { roomService } from '../services/api';
import '../styles/Rooms.css';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: 'Single',
    price: '',
    capacity: '',
    description: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAll();
      setRooms(response.data);
    } catch (error) {
      alert('Error fetching rooms');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await roomService.create(formData);
      setShowModal(false);
      setFormData({ room_number: '', room_type: 'Single', price: '', capacity: '', description: '' });
      fetchRooms();
      alert('Room added successfully!');
    } catch (error) {
      alert('Error adding room');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.delete(id);
        fetchRooms();
        alert('Room deleted successfully!');
      } catch (error) {
        alert('Error deleting room');
      }
    }
  };

  return (
    <div className="rooms-page">
      <div className="page-header">
        <h1>Rooms Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Room
        </button>
      </div>

      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className={`room-card ${room.status}`}>
            <div className="room-header">
              <h3>Room {room.room_number}</h3>
              <span className={`status-badge ${room.status}`}>{room.status}</span>
            </div>
            <div className="room-details">
              <p><strong>Type:</strong> {room.room_type}</p>
              <p><strong>Price:</strong> ${room.price}/night</p>
              <p><strong>Capacity:</strong> {room.capacity} person(s)</p>
              <p className="room-description">{room.description}</p>
            </div>
            <div className="room-actions">
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(room.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Room</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  required
                  value={formData.room_number}
                  onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select
                  value={formData.room_type}
                  onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                >
                  <option>Single</option>
                  <option>Double</option>
                  <option>Suite</option>
                  <option>Deluxe</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price (per night)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Add Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
