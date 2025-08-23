import React from 'react';
import './Sidebar.css';
// Assume you are using an icon library like react-icons
// import { RxDashboard, RxBarChart, RxTree, RxRocket, RxDownload } from 'react-icons/rx';

const Sidebar = ({ user }) => {
  // Role-based navigation items
  const navItems = {
    'Admin': [
      { name: 'Dashboard', icon: '📊' },
      { name: 'All GHG Inventories', icon: '📉' },
      { name: 'All Sequestration', icon: '🌳' },
      { name: 'User Management', icon: '👥' },
      { name: 'Reports', icon: '📄' },
    ],
    'Mine Operator': [
      { name: 'Dashboard', icon: '📊' },
      { name: 'GHG Inventory', icon: '📉' },
      { name: 'Sequestration', icon: '🌳' },
      { name: 'Simulations', icon: '🚀' },
      { name: 'Reports', icon: '📄' },
    ],
    'Verifier': [
      { name: 'Dashboard', icon: '📊' },
      { name: 'View Inventories', icon: '📉' },
      { name: 'View Sequestration', icon: '🌳' },
      { name: 'View Reports', icon: '📄' },
    ],
  };

  const itemsToShow = navItems[user.role] || [];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {itemsToShow.map(item => (
            <li key={item.name}>
              <a href="#" className={item.name === 'Dashboard' ? 'active' : ''}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;