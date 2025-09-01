import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import DecarbonizeLogo from '../../assets/Decarbonize-Logo.png';

// Using inline SVGs for icons to avoid external dependencies
const NotificationIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9ZM13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const HelpIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const sampleNotifications = [
  { id: 1, message: "Your GHG inventory for Q2 is ready for review.", time: "2h ago" },
  { id: 2, message: "Sequestration project updated by team.", time: "5h ago" },
  { id: 3, message: "New compliance report available.", time: "1d ago" }
];

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <button
            className="hamburger-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect y="7" width="32" height="4" rx="2" fill="#333"/>
              <rect y="15" width="32" height="4" rx="2" fill="#333"/>
              <rect y="23" width="32" height="4" rx="2" fill="#333"/>
            </svg>
          </button>
        )}
        <Link to="/">
          <img
            src={DecarbonizeLogo}
            alt="Decarbonize Logo"
            className="navbar-logo-img"
            style={{ height: '55px' }}
          />
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          // Logged-In View
          <>
            <div className="navbar-icon-dropdown">
              <button className="navbar-icon-btn">
                <NotificationIcon />
              </button>
              <div className="navbar-dropdown notification-dropdown">
                <div className="dropdown-header">
                  <strong>Notifications</strong>
                </div>
                <div className="dropdown-content">
                  {sampleNotifications.length === 0 ? (
                    <p>No new notifications.</p>
                  ) : (
                    <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                      {sampleNotifications.map(n => (
                        <li key={n.id} style={{ marginBottom: "0.75rem" }}>
                          <div style={{ fontSize: "0.97rem" }}>{n.message}</div>
                          <div style={{ fontSize: "0.8rem", color: "#888" }}>{n.time}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="navbar-profile-menu">
              <button className="navbar-profile-btn">
                <UserIcon />
                <span>{user.name}</span>
              </button>
              <div className="navbar-dropdown">
                <div className="dropdown-header">
                  <strong>{user.name}</strong>
                  <p>{user.role}</p>
                </div>
                <a href="#profile">Profile Settings</a>
                <a href="#preferences">Preferences</a>
                <button onClick={onLogout}>Logout</button>
              </div>
            </div>
          </>
        ) : (
          // Default (Logged-Out) View
          <>
            <a href="#features-section" className="navbar-link">Features</a>
            <a href="#solution-section" className="navbar-link">Solutions</a>
            <Link to="/Login" className="navbar-btn-secondary">Login</Link>
            <Link to="/signup" className="navbar-btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;