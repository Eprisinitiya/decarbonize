import React, { useState, useEffect } from 'react';
import './PersonalizedDashboard.css';

const PersonalizedDashboard = ({ user, allKPIs = [] }) => {
  const [pinnedKPIs, setPinnedKPIs] = useState([]);
  const [availableKPIs, setAvailableKPIs] = useState([]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    if (user?.email) {
      const savedPreferences = localStorage.getItem(`dashboard-prefs-${user.email}`);
      if (savedPreferences) {
        try {
          const prefs = JSON.parse(savedPreferences);
          setPinnedKPIs(prefs.pinnedKPIs || []);
        } catch (error) {
          console.error('Failed to load dashboard preferences:', error);
        }
      }
    }
  }, [user]);

  // Update available KPIs based on what's pinned
  useEffect(() => {
    const kpisWithIds = allKPIs.map((kpi, idx) => ({
      ...kpi,
      id: kpi.id || `kpi-${idx}`
    }));
    const pinnedIds = pinnedKPIs.map(kpi => kpi.id);
    setAvailableKPIs(kpisWithIds.filter(kpi => !pinnedIds.includes(kpi.id)));
  }, [pinnedKPIs, allKPIs]);

  // Save preferences to localStorage
  const savePreferences = (newPinnedKPIs) => {
    if (user?.email) {
      const preferences = {
        pinnedKPIs: newPinnedKPIs,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`dashboard-prefs-${user.email}`, JSON.stringify(preferences));
    }
  };

  const handlePinKPI = (kpi) => {
    const updatedPinned = [...pinnedKPIs, kpi];
    setPinnedKPIs(updatedPinned);
    savePreferences(updatedPinned);
  };

  const handleUnpinKPI = (kpiId) => {
    const updatedPinned = pinnedKPIs.filter(kpi => kpi.id !== kpiId);
    setPinnedKPIs(updatedPinned);
    savePreferences(updatedPinned);
  };

  const handleReorderKPI = (fromIndex, toIndex) => {
    const reordered = [...pinnedKPIs];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);
    setPinnedKPIs(reordered);
    savePreferences(reordered);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    e.dataTransfer.setData('index', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    if (dragIndex !== dropIndex) {
      handleReorderKPI(dragIndex, dropIndex);
    }
  };

  const handleResetToDefault = () => {
    const defaultKPIs = allKPIs.slice(0, 4); // First 4 KPIs as default
    setPinnedKPIs(defaultKPIs);
    savePreferences(defaultKPIs);
  };

  return (
    <div className="personalized-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Your Dashboard</h2>
          <p className="dashboard-subtitle">
            {pinnedKPIs.length > 0 
              ? `Tracking ${pinnedKPIs.length} key metric${pinnedKPIs.length !== 1 ? 's' : ''}`
              : 'Customize your dashboard to track what matters most'
            }
          </p>
        </div>
        <div className="header-actions">
          <button
            className={`customize-btn ${isCustomizing ? 'active' : ''}`}
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            {isCustomizing ? '✓ Done' : '⚙️ Customize'}
          </button>
          {isCustomizing && pinnedKPIs.length > 0 && (
            <button 
              className="reset-btn"
              onClick={handleResetToDefault}
            >
              Reset to Default
            </button>
          )}
        </div>
      </div>

      {pinnedKPIs.length === 0 ? (
        <div className="empty-dashboard">
          <div className="empty-icon">📊</div>
          <h3>No KPIs pinned yet</h3>
          <p>Click "Customize" to select the metrics you want to track</p>
          <button 
            className="customize-cta"
            onClick={() => setIsCustomizing(true)}
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className={`kpi-grid ${isCustomizing ? 'customizing' : ''}`}>
          {pinnedKPIs.map((kpi, index) => (
            <div
              key={kpi.id}
              className="kpi-card pinned"
              draggable={isCustomizing}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {isCustomizing && (
                <button
                  className="unpin-btn"
                  onClick={() => handleUnpinKPI(kpi.id)}
                  aria-label="Unpin KPI"
                >
                  ✕
                </button>
              )}
              {isCustomizing && <div className="drag-handle">⋮⋮</div>}
              
              <div className="kpi-content">
                <div className="kpi-header">
                  <h4 className="kpi-title">{kpi.title}</h4>
                  {kpi.change && (
                    <span className={`kpi-change ${kpi.changeType}`}>
                      {kpi.change}
                    </span>
                  )}
                </div>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">{kpi.value}</span>
                  <span className="kpi-unit">{kpi.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCustomizing && (
        <div className="kpi-selector">
          <h3>Available Metrics</h3>
          {availableKPIs.length === 0 ? (
            <p className="no-available">All metrics are pinned</p>
          ) : (
            <div className="available-kpis">
              {availableKPIs.map((kpi) => (
                <div key={kpi.id} className="kpi-card available">
                  <div className="kpi-content">
                    <h4 className="kpi-title">{kpi.title}</h4>
                    <div className="kpi-value-wrapper">
                      <span className="kpi-value">{kpi.value}</span>
                      <span className="kpi-unit">{kpi.unit}</span>
                    </div>
                  </div>
                  <button
                    className="pin-btn"
                    onClick={() => handlePinKPI(kpi)}
                    aria-label="Pin KPI"
                  >
                    📌 Pin
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalizedDashboard;
