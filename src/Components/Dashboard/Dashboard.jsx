import React from 'react';
import './Dashboard.css';

const kpiData = [
  { title: 'Total GHG Emissions', value: '1.25M', unit: 'tCO₂e' },
  { title: 'Net Carbon Balance', value: '-890k', unit: 'tCO₂e' },
  { title: 'Emission Intensity', value: '0.85', unit: 'tCO₂e / tonne' },
];

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome, {user.name.split(' ')[0]}</h1>
        <p>Here is your carbon performance snapshot for the last quarter.</p>
      </header>
      
      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <h3 className="kpi-title">{kpi.title}</h3>
            <p className="kpi-value">{kpi.value}</p>
            <p className="kpi-unit">{kpi.unit}</p>
          </div>
        ))}
      </div>
      
      <div className="widgets-grid">
        <div className="widget-card">
          <h3>Emissions Breakdown</h3>
          <div className="chart-placeholder">
            [Interactive Donut Chart]
          </div>
        </div>
        <div className="widget-card">
          <h3>Recent Activity</h3>
          <ul className="activity-feed">
            <li><strong>Operator A</strong> added fuel data for Q3.</li>
            <li><strong>Admin</strong> generated the annual sustainability report.</li>
            <li><strong>Verifier B</strong> viewed methane emission records.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;