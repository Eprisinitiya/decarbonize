import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import FileUpload from '../common/FileUpload';

// Mock data
const mockEmissionsData = [
  { month: 'Jan', emissions: 110, target: 105 },
  { month: 'Feb', emissions: 115, target: 105 },
  { month: 'Mar', emissions: 108, target: 105 },
  { month: 'Apr', emissions: 112, target: 105 },
  { month: 'May', emissions: 118, target: 105 },
  { month: 'Jun', emissions: 110, target: 105 },
];

const mockEmissionsSourceData = [
  { name: 'Diesel', value: 45, color: '#5dd4b4' },
  { name: 'Methane', value: 30, color: '#3da68a' },
  { name: 'Electricity', value: 20, color: '#2dd4bf' },
  { name: 'Other', value: 5, color: '#9ca3af' },
];

const mockReductionInitiatives = [
  { name: 'Diesel Replacement', target: 15, achieved: 8, progress: 53 },
  { name: 'Methane Capture', target: 10, achieved: 6, progress: 60 },
  { name: 'Renewable Energy', target: 12, achieved: 7, progress: 58 },
  { name: 'Process Efficiency', target: 8, achieved: 7, progress: 88 },
];

const Dashboard = ({ user }) => {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [pinnedKPIs, setPinnedKPIs] = useState([0, 1, 2, 3]); // All pinned by default
  const [draggedKPI, setDraggedKPI] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [containerWidth, setContainerWidth] = useState(0);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    const resizeObserver = new ResizeObserver(() => {
      const dashboardContainer = document.querySelector('.dashboard-redesigned');
      if (dashboardContainer) {
        setContainerWidth(dashboardContainer.offsetWidth);
      }
    });
    
    const dashboardContainer = document.querySelector('.dashboard-redesigned');
    if (dashboardContainer) {
      resizeObserver.observe(dashboardContainer);
      setContainerWidth(dashboardContainer.offsetWidth);
    }
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  const togglePin = (index) => {
    if (pinnedKPIs.includes(index)) {
      setPinnedKPIs(pinnedKPIs.filter(i => i !== index));
    } else {
      setPinnedKPIs([...pinnedKPIs, index]);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedKPI(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedKPI !== null && draggedKPI !== targetIndex) {
      const newPinnedKPIs = [...pinnedKPIs];
      const draggedPosition = newPinnedKPIs.indexOf(draggedKPI);
      const targetPosition = newPinnedKPIs.indexOf(targetIndex);
      [newPinnedKPIs[draggedPosition], newPinnedKPIs[targetPosition]] = [
        newPinnedKPIs[targetPosition],
        newPinnedKPIs[draggedPosition],
      ];
      setPinnedKPIs(newPinnedKPIs);
    }
    setDraggedKPI(null);
  };

  const handleFileUpload = (file) => {
    console.log('File uploaded:', file.name);
  };

  const kpis = [
    {
      title: 'Total Emissions',
      value: '110k',
      unit: 'tCO₂e',
      change: '+2.1%',
      trend: 'up',
      icon: '📊'
    },
    {
      title: 'Emission Intensity',
      value: '0.88',
      unit: 'tCO₂e/tonne',
      change: '-1.2%',
      trend: 'down',
      icon: '📈'
    },
    {
      title: 'Target Achievement',
      value: '95%',
      unit: 'of goal',
      change: '+5.0%',
      trend: 'up',
      icon: '🎯'
    },
    {
      title: 'Reduction Progress',
      value: '28k',
      unit: 'achieved',
      change: '+3.5%',
      trend: 'down',
      icon: '✅'
    },
  ];

  return (
    <div className="dashboard-redesigned">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Carbon Management Dashboard</h1>
          <p className="subtitle">Monitor your emissions and reduction initiatives</p>
        </div>
        <div className="timeframe-selector">
          {['monthly', 'quarterly', 'yearly'].map((frame) => (
            <button
              key={frame}
              className={`timeframe-btn ${timeFrame === frame ? 'active' : ''}`}
              onClick={() => setTimeFrame(frame)}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards with Pin and Drag */}
      <div className="kpi-grid">
        {pinnedKPIs.map((index) => {
          const kpi = kpis[index];
          return (
            <div
              key={index}
              className={`kpi-card ${draggedKPI === index ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="kpi-card-actions">
                <button
                  className="pin-btn"
                  onClick={() => togglePin(index)}
                  title={pinnedKPIs.includes(index) ? 'Unpin' : 'Pin'}
                >
                  {pinnedKPIs.includes(index) ? '📌' : '📍'}
                </button>
              </div>
              <div className="kpi-header">
                <span className="kpi-icon">{kpi.icon}</span>
                <h3>{kpi.title}</h3>
              </div>
              <div className="kpi-value">
                <span className="value">{kpi.value}</span>
                <span className="unit">{kpi.unit}</span>
              </div>
              <div className={`kpi-change ${kpi.trend}`}>
                <span>{kpi.trend === 'up' ? '↑' : '↓'}</span>
                <span>{kpi.change}</span>
              </div>
              <div className="kpi-drag-hint">⋮⋮ Drag to reorder</div>
            </div>
          );
        })}
      </div>

      {/* File Upload Section */}
      <div className="upload-section">
        <h2>Upload Data</h2>
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Emissions Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Emissions Trend</h2>
            <span className="chart-subtitle">vs. Target</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockEmissionsData}>
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5dd4b4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5dd4b4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="month" stroke="#b4b4b4" />
              <YAxis stroke="#b4b4b4" />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #3f3f46' }} />
              <Area type="monotone" dataKey="emissions" stroke="#5dd4b4" fillOpacity={1} fill="url(#colorEmissions)" />
              <Line type="monotone" dataKey="target" stroke="#ff9800" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Emissions by Source */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Emissions by Source</h2>
            <span className="chart-subtitle">Current Period</span>
          </div>
          <div className="pie-chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={mockEmissionsSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={windowWidth < 768 ? 40 : 60}
                  outerRadius={windowWidth < 768 ? 70 : 90}
                  dataKey="value"
                  label={windowWidth < 768 ? false : true}
                >
                  {mockEmissionsSourceData.map((item, index) => (
                    <Cell key={index} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {mockEmissionsSourceData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reduction Initiatives */}
      <div className="initiatives-section">
        <h2>Reduction Initiatives Progress</h2>
        <div className="initiatives-grid">
          {mockReductionInitiatives.map((initiative, index) => (
            <div
              key={index}
              className={`initiative-card ${selectedInitiative === index ? 'selected' : ''}`}
              onClick={() => setSelectedInitiative(selectedInitiative === index ? null : index)}
            >
              <div className="initiative-header">
                <h3>{initiative.name}</h3>
                <span className="progress-badge">{initiative.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${initiative.progress}%` }}></div>
              </div>
              <div className="initiative-stats">
                <span className="stat">Achieved: {initiative.achieved}k</span>
                <span className="stat">Target: {initiative.target}k</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <p className="stat-label">Carbon Offset</p>
            <p className="stat-value">35k tCO₂e</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <p className="stat-label">Energy Efficiency</p>
            <p className="stat-value">76%</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">♻️</div>
          <div className="stat-content">
            <p className="stat-label">Renewable Energy</p>
            <p className="stat-value">22%</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <p className="stat-label">Compliance Status</p>
            <p className="stat-value">On Track</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;