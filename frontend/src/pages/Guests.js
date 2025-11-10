import React, { useState, useEffect } from 'react';
import { guestService } from '../services/api';
import '../styles/Guests.css';

function Guests() {
  const [guests, setGuests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_number: '',
    address: '',
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await guestService.getAll();
      setGuests(response.data);
    } catch (error) {
      alert('Error fetching guests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await guestService.create(formData);
      setShowModal(false);
      setFormData({ first_name: '', last_name: '', email: '', phone: '', id_number: '', address: '' });
      fetchGuests();
      alert('Guest added successfully!');
    } catch (error) {
      alert('Error adding guest');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await guestService.delete(id);
        fetchGuests();
        alert('Guest deleted successfully!');
      } catch (error) {
        alert('Error deleting guest');
      }
    }
  };

  return (
    <div className="guests-page">
      <div className="page-header">
        <h1>Guests Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Guest
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>ID Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map(guest => (
              <tr key={guest.id}>
                <td>{guest.id}</td>
                <td>{guest.first_name} {guest.last_name}</td>
                <td>{guest.email}</td>
                <td>{guest.phone}</td>
                <td>{guest.id_number}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(guest.id)}>
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
            <h2>Add New Guest</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>ID Number</label>
                <input
                  type="text"
                  value={formData.id_number}
                  onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Add Guest</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Guests;
