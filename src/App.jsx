import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- Global Styles ---
// Import your main CSS file which contains the dark theme variables
import './assets/styles/main.css';

// --- Layout Components ---
// These form the persistent shell of your application when logged in
import Navbar from './Components/Layout/Navbar';
import Sidebar from './Components/Layout/Sidebar';

// --- Page Components ---
// These act as the main entry points for different views
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Signup from './Components/Authentication/Signup'; // Adjust path if needed
import Login from './components/Authentication/Login';

// --- Feature Components (for nested routing) ---
// These are the core content views that will be swapped in the main area
import Dashboard from './Components/Dashboard/Dashboard';
import GHGInventory from './Components/GHGInventory/GHGInventory';
import SequestrationManager from './Components/Sequestration/SequestrationManager';
import SimulationDashboard from './Components/Simulation/SimulationDashboard';
import ReportGeneration from './Components/Reporting/ReportGeneration';
import ProfileSettings from './Components/Profile/ProfileSettings';

/**
 * @description A layout component for the main application view after login.
 * It renders the Navbar, Sidebar, and an <Outlet> which acts as a
 * placeholder for the currently active feature component (e.g., Dashboard, Inventory).
 */
const AppLayout = ({ user, onLogout, onUpdateProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div style={{ display: 'flex' }}>
        {sidebarOpen && <Sidebar user={user} />}
        <main style={{
          marginLeft: sidebarOpen ? '260px' : '0',
          flexGrow: 1,
          width: sidebarOpen ? 'calc(100% - 260px)' : '100%',
          transition: 'margin-left 0.3s'
        }}>
          <Outlet context={{ user, onUpdateProfile, onLogout }} /> {/* Nested route components will be rendered here */}
        </main>
      </div>
    </>
  );
};

/**
 * @description A wrapper component to protect routes that require authentication.
 * If the user is not logged in, it redirects them to the /login page.
 */
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // Master state to track the currently logged-in user.
  // 'null' means the user is logged out.
  // For development purposes, we'll set a default test user
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@ecotechsolutions.com',
    role: 'Sustainability Manager',
    company: 'EcoTech Solutions',
    phone: '+1 (555) 123-4567',
    department: 'Environmental Affairs'
  });

  // This function will be passed down to the LoginPage to update the master state on success.
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  // This function will be passed down to the Navbar to clear the user state.
  const handleLogout = () => {
    setUser(null);
  };

  // This function will be passed down to ProfileSettings to update user profile data.
  const handleUpdateProfile = (updatedProfileData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedProfileData }));
  };

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        {/* These routes are accessible to everyone, logged in or not. */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            // If a user is already logged in, redirect them from the login page to the dashboard.
            user ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- Protected Routes --- */}
        {/* All routes nested inside this element are protected.
            Access is only granted if the 'user' state is not null. */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />
            </ProtectedRoute>
          }
        >
          {/* The 'index' route is the default component shown at the parent path ('/dashboard') */}
          <Route index element={<Dashboard user={user} />} />

          {/* These are the specific feature pages accessible from the sidebar */}
          <Route path="inventory" element={<GHGInventory />} />
          <Route path="sequestration" element={<SequestrationManager />} />
          <Route path="simulation" element={<SimulationDashboard />} />
          <Route path="reports" element={<ReportGeneration />} />
          {/* You can add more role-specific routes here, e.g., for an Admin */}
        </Route>

        {/* --- Profile Settings Routes (Standalone) --- */}
        {/* Profile settings is a standalone page, not nested within dashboard layout */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute user={user}>
              <ProfileSettings 
                user={user} 
                onLogout={handleLogout} 
                onUpdateProfile={handleUpdateProfile} 
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/preferences" 
          element={
            <ProtectedRoute user={user}>
              <ProfileSettings 
                user={user} 
                onLogout={handleLogout} 
                onUpdateProfile={handleUpdateProfile} 
              />
            </ProtectedRoute>
          } 
        />

        {/* --- Fallback Route --- */}
        {/* If a user navigates to any URL that doesn't match the above,
            it will redirect them to the dashboard if logged in, or the login page if not. */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;