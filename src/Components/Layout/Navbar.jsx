import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import DecarbonizeLogo from '../../assets/Decarbonize-Logo.png';
import NotificationCenter from '../common/NotificationCenter';
import AccountMenu from '../common/AccountMenu';

// Enhanced SVG icons
const NotificationIcon = ({ hasNotifications }) => (
  <div className="notification-icon-wrapper">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9ZM13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    {hasNotifications && <div className="notification-dot"></div>}
  </div>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Enhanced notifications with different types and priorities
const sampleNotifications = [
  { 
    id: 1, 
    type: 'success',
    priority: 'high',
    title: 'GHG Inventory Complete',
    message: "Your Q2 GHG inventory has been successfully processed and is ready for review.", 
    time: "2h ago",
    read: false
  },
  { 
    id: 2, 
    type: 'info',
    priority: 'medium',
    title: 'Project Update',
    message: "Carbon sequestration project Phase 2 has been updated by your team.", 
    time: "5h ago",
    read: false
  },
  { 
    id: 3, 
    type: 'warning',
    priority: 'high',
    title: 'Compliance Deadline',
    message: "Your quarterly compliance report is due in 3 days.", 
    time: "1d ago",
    read: true
  },
  {
    id: 4,
    type: 'info',
    priority: 'low',
    title: 'System Maintenance',
    message: "Scheduled maintenance will occur this weekend from 2-4 AM EST.",
    time: "2d ago",
    read: true
  },
  {
    id: 5,
    type: 'success',
    priority: 'medium',
    title: 'Verification Complete',
    message: "Your carbon offset credits have been successfully verified.",
    time: "3d ago",
    read: false
  }
];

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  const [notifications, setNotifications] = useState(sampleNotifications);

  // Handle notification actions
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

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
          // Logged-In View with Modern Components
          <>
            {/* Modern Notification Center */}
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDeleteNotification={handleDeleteNotification}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
            />

            {/* Modern Account Menu */}
            <AccountMenu
              user={user}
              onLogout={onLogout}
            />
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