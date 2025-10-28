import React, { useState, useRef, useEffect } from 'react';
import './NotificationCenter.css';

// Modern SVG icons
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckAllIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="m9 12 2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="m3 6 3 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l3-12M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <circle cx="19" cy="12" r="1" fill="currentColor"/>
    <circle cx="5" cy="12" r="1" fill="currentColor"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="m18 6-12 12M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotificationCenter = ({ notifications, onMarkAsRead, onDeleteNotification, onMarkAllAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread'
  const [hoveredNotification, setHoveredNotification] = useState(null);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasNotifications = notifications.length > 0;

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: '💡',
      system: '⚙️'
    };
    return iconMap[type] || '📣';
  };

  const formatRelativeTime = (timeString) => {
    // Enhanced time formatting
    const now = new Date();
    const notificationTime = new Date(now.getTime() - parseInt(timeString.replace(/\D/g, '')) * 
      (timeString.includes('h') ? 3600000 : timeString.includes('d') ? 86400000 : 60000));
    
    const diffMs = now - notificationTime;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="notification-center" ref={dropdownRef}>
      {/* Notification Button */}
      <button 
        className={`notification-trigger ${unreadCount > 0 ? 'has-notifications' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="notification-counter">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        <div className={`notification-pulse ${unreadCount > 0 ? 'active' : ''}`}></div>
      </button>

      {/* Dropdown Panel */}
      <div className={`notification-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="notification-header">
          <div className="header-left">
            <BellIcon />
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <div className="header-actions">
            <button 
              className="header-action-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="notification-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({notifications.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Quick Actions */}
        {hasNotifications && (
          <div className="quick-actions">
            {unreadCount > 0 && (
              <button className="quick-action-btn mark-all" onClick={onMarkAllAsRead}>
                <CheckAllIcon />
                Mark all read
              </button>
            )}
            <button className="quick-action-btn settings">
              <SettingsIcon />
              Settings
            </button>
            <button className="quick-action-btn clear-all" onClick={onClearAll}>
              <TrashIcon />
              Clear all
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h4>{activeTab === 'unread' ? 'All caught up!' : 'No notifications'}</h4>
              <p>
                {activeTab === 'unread' 
                  ? 'You\'ve read all your notifications.'
                  : 'We\'ll notify you when something new arrives.'
                }
              </p>
            </div>
          ) : (
            <div className="notifications-scroll">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : 'read'} ${notification.type}`}
                  onMouseEnter={() => setHoveredNotification(notification.id)}
                  onMouseLeave={() => setHoveredNotification(null)}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    <span className="type-emoji">{getNotificationIcon(notification.type)}</span>
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-title-row">
                      <h4 className="notification-title">{notification.title}</h4>
                      <div className="notification-meta">
                        <span className="notification-time">{formatRelativeTime(notification.time)}</span>
                        {!notification.read && <div className="unread-dot"></div>}
                      </div>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-footer">
                      <span className={`priority-tag priority-${notification.priority}`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>

                  {/* Action Menu */}
                  <div className={`notification-actions ${hoveredNotification === notification.id ? 'visible' : ''}`}>
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification(notification.id);
                      }}
                      title="Delete notification"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasNotifications && (
          <div className="notification-footer-bar">
            <span className="footer-text">
              {notifications.length} total • {unreadCount} unread
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;