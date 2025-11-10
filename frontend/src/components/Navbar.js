import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🏨 Luxury Hotel
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Dashboard</Link></li>
          <li><Link to="/rooms" className="navbar-link">Rooms</Link></li>
          <li><Link to="/guests" className="navbar-link">Guests</Link></li>
          <li><Link to="/bookings" className="navbar-link">Bookings</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
