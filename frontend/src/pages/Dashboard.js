import React, { useState, useEffect } from 'react';
import { roomService, guestService, bookingService } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalGuests: 0,
    totalBookings: 0,
    activeBookings: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [roomsRes, guestsRes, bookingsRes] = await Promise.all([
        roomService.getAll(),
        guestService.getAll(),
        bookingService.getAll(),
      ]);

      const rooms = roomsRes.data;
      const guests = guestsRes.data;
      const bookings = bookingsRes.data;

      setStats({
        totalRooms: rooms.length,
        availableRooms: rooms.filter(r => r.status === 'available').length,
        occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
        totalGuests: guests.length,
        totalBookings: bookings.length,
        activeBookings: bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">🏨</div>
          <div className="stat-content">
            <h3>Total Rooms</h3>
            <p className="stat-number">{stats.totalRooms}</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Available Rooms</h3>
            <p className="stat-number">{stats.availableRooms}</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🔒</div>
          <div className="stat-content">
            <h3>Occupied Rooms</h3>
            <p className="stat-number">{stats.occupiedRooms}</p>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Guests</h3>
            <p className="stat-number">{stats.totalGuests}</p>
          </div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p className="stat-number">{stats.totalBookings}</p>
          </div>
        </div>
        <div className="stat-card pink">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Active Bookings</h3>
            <p className="stat-number">{stats.activeBookings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
