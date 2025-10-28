import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AccountMenu.css';

// Modern SVG Icons
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AccountMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="account-menu" ref={menuRef}>
      {/* Profile Button */}
      <button 
        className={`profile-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Account menu"
      >
        <div className="avatar-circle">
          <span className="avatar-initials">{initials}</span>
        </div>
        <span className="profile-name">{user?.name || 'User'}</span>
        <div className={`chevron-icon ${isOpen ? 'rotated' : ''}`}>
          <ChevronIcon />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div className={`account-panel ${isOpen ? 'open' : ''}`}>
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-large">
            <span className="avatar-initials-lg">{initials}</span>
          </div>
          <div className="profile-info">
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email || 'user@example.com'}</p>
            <span className="profile-role">{user?.role || 'User'}</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-items">
          <Link 
            to="/profile"
            className={`menu-item ${hoveredItem === 'profile' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem('profile')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => setIsOpen(false)}
          >
            <div className="menu-item-icon">
              <UserIcon />
            </div>
            <div className="menu-item-content">
              <span className="menu-item-label">Profile Settings</span>
              <span className="menu-item-desc">Edit your profile</span>
            </div>
            <ChevronIcon />
          </Link>

          <Link 
            to="/preferences"
            className={`menu-item ${hoveredItem === 'notifications' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem('notifications')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => setIsOpen(false)}
          >
            <div className="menu-item-icon">
              <BellIcon />
            </div>
            <div className="menu-item-content">
              <span className="menu-item-label">Notifications</span>
              <span className="menu-item-desc">Manage preferences</span>
            </div>
            <ChevronIcon />
          </Link>

          <button 
            className={`menu-item settings-btn ${hoveredItem === 'settings' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem('settings')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="menu-item-icon">
              <SettingsIcon />
            </div>
            <div className="menu-item-content">
              <span className="menu-item-label">Settings</span>
              <span className="menu-item-desc">App settings</span>
            </div>
            <ChevronIcon />
          </button>
        </div>

        {/* Divider */}
        <div className="menu-divider"></div>

        {/* Logout Button */}
        <button 
          className={`menu-item logout-btn ${hoveredItem === 'logout' ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => {
            onLogout();
            setIsOpen(false);
          }}
        >
          <div className="menu-item-icon">
            <LogoutIcon />
          </div>
          <div className="menu-item-content">
            <span className="menu-item-label">Sign Out</span>
          </div>
          <ChevronIcon />
        </button>

      </div>
    </div>
  );
};

export default AccountMenu;