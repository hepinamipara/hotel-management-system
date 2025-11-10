import React, { useState, useEffect } from 'react';
import { bookingService, guestService, roomService } from '../services/api';
import '../styles/Bookings.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    guest_id: '',
    room_id: '',
    check_in_date: '',
    check_out_date: '',
    special_requests: '',
  });

  useEffect(() => {
    fetchBookings();
    fetchGuests();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAll();
      setBookings(response.data);
    } catch (error) {
      alert('Error fetching bookings');
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await guestService.getAll();
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests');
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAvailable();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms');
    }
  };

  const calculateTotal = () => {
    if (!formData.check_in_date || !formData.check_out_date || !formData.room_id) return 0;
    
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const room = rooms.find(r => r.id === parseInt(formData.room_id));
    return days > 0 && room ? days * room.price : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalAmount = calculateTotal();
      await bookingService.create({ ...formData, total_amount: totalAmount });
      setShowModal(false);
      setFormData({ guest_id: '', room_id: '', check_in_date: '', check_out_date: '', special_requests: '' });
      fetchBookings();
      fetchRooms();
      alert('Booking created successfully!');
    } catch (error) {
      alert('Error creating booking');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      fetchBookings();
      alert('Booking status updated!');
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingService.delete(id);
        fetchBookings();
        fetchRooms();
        alert('Booking deleted successfully!');
      } catch (error) {
        alert('Error deleting booking');
      }
    }
  };

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1>Bookings Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Booking
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.guest_name}</td>
                <td>{booking.room_number} ({booking.room_type})</td>
                <td>{new Date(booking.check_in_date).toLocaleDateString()}</td>
                <td>{new Date(booking.check_out_date).toLocaleDateString()}</td>
                <td>${booking.total_amount}</td>
                <td>
                  <select
                    className={`status-select ${booking.status}`}
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked-in</option>
                    <option value="checked-out">Checked-out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(booking.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Booking</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Guest</label>
                <select
                  required
                  value={formData.guest_id}
                  onChange={(e) => setFormData({...formData, guest_id: e.target.value})}
                >
                  <option value="">Select Guest</option>
                  {guests.map(guest => (
                    <option key={guest.id} value={guest.id}>
                      {guest.first_name} {guest.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Room</label>
                <select
                  required
                  value={formData.room_id}
                  onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.room_number} - {room.room_type} (${room.price}/night)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    required
                    value={formData.check_in_date}
                    onChange={(e) => setFormData({...formData, check_in_date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    required
                    value={formData.check_out_date}
                    onChange={(e) => setFormData({...formData, check_out_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  value={formData.special_requests}
                  onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                  placeholder="Any special requirements..."
                />
              </div>
              {calculateTotal() > 0 && (
                <div className="total-amount">
                  <strong>Total Amount: ${calculateTotal().toFixed(2)}</strong>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Create Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
