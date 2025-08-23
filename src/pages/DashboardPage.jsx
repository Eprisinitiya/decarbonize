import React from 'react';
import Navbar from '../Components/Layout/Navbar';
import Sidebar from '../Components/Layout/Sidebar';
import Dashboard from '../Components/Dashboard/Dashboard';
// Import other main components you want to show on the dashboard page
// import GHGInventory from '../components/GHGInventory/GHGInventory';

// Basic inline styles for layout
const dashboardLayoutStyles = {
  display: 'flex',
};

const mainContentStyles = {
  marginLeft: '260px', // This should match the sidebar width
  flexGrow: 1,
  width: 'calc(100% - 260px)',
};

const DashboardPage = ({ user, onLogout }) => {
  if (!user) {
    // This is a fallback, ideally handled by routing
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div style={dashboardLayoutStyles}>
        <Sidebar user={user} />
        <main style={mainContentStyles}>
          {/* Here you would typically have another router (nested routes) 
            to switch between Dashboard, GHGInventory, Reports etc. 
            For now, we'll just show the main Dashboard component.
          */}
          <Dashboard user={user} />
        </main>
      </div>
    </>
  );
};

export default DashboardPage;