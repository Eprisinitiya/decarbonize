import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
// Assume you are using an icon library like react-icons
// import { RxDashboard, RxBarChart, RxTree, RxRocket, RxDownload } from 'react-icons/rx';

const Sidebar = ({ user }) => {
  // Role-based navigation items
  const navItems = {
    'Admin': [
      { 
        name: 'Dashboard', 
        icon: '📊', 
        path: '/dashboard',
        description: 'Overview & Analytics'
      },
      { 
        name: 'GHG Inventory', 
        icon: '📉', 
        path: '/dashboard/inventory',
        description: 'Emissions Data Management'
      },
      { 
        name: 'Sequestration', 
        icon: '🌳', 
        path: '/dashboard/sequestration',
        description: 'Carbon Sink Projects'
      },
      { 
        name: 'Simulation', 
        icon: '🚀', 
        path: '/dashboard/simulation',
        description: 'Scenario Planning & Modeling'
      },
      { 
        name: 'Reports', 
        icon: '📄', 
        path: '/dashboard/reports',
        description: 'Generate & Export Reports'
      },
    ],
    'Mine Operator': [
      { 
        name: 'Dashboard', 
        icon: '📊', 
        path: '/dashboard',
        description: 'Overview & Analytics'
      },
      { 
        name: 'GHG Inventory', 
        icon: '📉', 
        path: '/dashboard/inventory',
        description: 'Emissions Data Entry'
      },
      { 
        name: 'Sequestration', 
        icon: '🌳', 
        path: '/dashboard/sequestration',
        description: 'Carbon Sink Projects'
      },
      { 
        name: 'Simulation', 
        icon: '🚀', 
        path: '/dashboard/simulation',
        description: 'Scenario Planning'
      },
      { 
        name: 'Reports', 
        icon: '📄', 
        path: '/dashboard/reports',
        description: 'View & Export Reports'
      },
    ],
    'Verifier': [
      { 
        name: 'Dashboard', 
        icon: '📊', 
        path: '/dashboard',
        description: 'Overview & Analytics'
      },
      { 
        name: 'GHG Inventory', 
        icon: '📉', 
        path: '/dashboard/inventory',
        description: 'Review Emissions Data'
      },
      { 
        name: 'Sequestration', 
        icon: '🌳', 
        path: '/dashboard/sequestration',
        description: 'Review Carbon Projects'
      },
      { 
        name: 'Reports', 
        icon: '📄', 
        path: '/dashboard/reports',
        description: 'Verification Reports'
      },
    ],
  };

  const itemsToShow = navItems[user.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <h4>{user?.name || 'User'}</h4>
            <span className="user-role">{user?.role || 'Role'}</span>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {itemsToShow.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                title={item.description}
              >
                <span className="nav-icon">{item.icon}</span>
                <div className="nav-content">
                  <span className="nav-text">{item.name}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-icon">🌍</span>
            <div className="stat-text">
              <span className="stat-label">Carbon Impact</span>
              <span className="stat-value">-15.2%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;