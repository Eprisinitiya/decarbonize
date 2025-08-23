import React from 'react';
import './Navbar.css';

// Using inline SVGs for icons to avoid external dependencies
const NotificationIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9ZM13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const HelpIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;


const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Replace with your actual logo */}
        <div className="navbar-logo">Decarbonize</div>
      </div>
      <div className="navbar-right">
        {user ? (
          // Logged-In View
          <>
            <button className="navbar-icon-btn"><NotificationIcon /></button>
            <button className="navbar-icon-btn"><HelpIcon /></button>
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
            <a href="features-section" className="navbar-link">Features</a>
            <a href="#solutions" className="navbar-link">Solutions</a>
            <button className="navbar-btn-secondary">Log In</button>
            <button className="navbar-btn-primary">Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;