import React from 'react';
import { useState } from 'react';
import './Dashboard.css';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- Mock Data Sets for Different Time Frames ---
const mockData = {
  monthly: {
    kpis: [
      { title: 'Total GHG Emissions', value: '110k', unit: 'tCO₂e', change: '+2.1%', changeType: 'increase' },
      { title: 'Net Carbon Balance', value: '-75k', unit: 'tCO₂e', change: '-1.5%', changeType: 'decrease' },
      { title: 'Emission Intensity', value: '0.88', unit: 'tCO₂e / tonne', change: '+0.9%', changeType: 'increase' },
      { title: 'Emissions vs Target', value: '95%', unit: 'of monthly goal', change: '+5.0%', changeType: 'increase' },
    ],
    donutData: [{ name: 'Diesel', value: 450 }, { name: 'Methane', value: 300 }, { name: 'Electricity', value: 250 }],
    trendData: [
      { name: 'Week 1', emissions: 25 }, { name: 'Week 2', emissions: 28 }, { name: 'Week 3', emissions: 26 }, { name: 'Week 4', emissions: 31 }
    ],
  },
  quarterly: {
    kpis: [
      { title: 'Total GHG Emissions', value: '340k', unit: 'tCO₂e', change: '+5.2%', changeType: 'increase' },
      { title: 'Net Carbon Balance', value: '-280k', unit: 'tCO₂e', change: '-2.1%', changeType: 'decrease' },
      { title: 'Emission Intensity', value: '0.85', unit: 'tCO₂e / tonne', change: '+1.5%', changeType: 'increase' },
      { title: 'Emissions vs Target', value: '105%', unit: 'of quarterly goal', change: '+3.2%', changeType: 'increase' },
    ],
    donutData: [{ name: 'Diesel', value: 1300 }, { name: 'Methane', value: 950 }, { name: 'Electricity', value: 700 }],
    trendData: [
      { name: 'Jan', emissions: 110 }, { name: 'Feb', emissions: 115 }, { name: 'Mar', emissions: 112 }
    ],
  },
  yearly: {
    kpis: [
      { title: 'Total GHG Emissions', value: '1.25M', unit: 'tCO₂e', change: '-3.5%', changeType: 'decrease' },
      { title: 'Net Carbon Balance', value: '-890k', unit: 'tCO₂e', change: '-4.0%', changeType: 'decrease' },
      { title: 'Emission Intensity', value: '0.82', unit: 'tCO₂e / tonne', change: '-2.8%', changeType: 'decrease' },
      { title: 'Emissions vs Target', value: '98%', unit: 'of annual goal', change: '-1.5%', changeType: 'decrease' },
    ],
    donutData: [{ name: 'Diesel', value: 5000 }, { name: 'Methane', value: 4100 }, { name: 'Electricity', value: 2900 }],
    trendData: [
      { name: 'Q1', emissions: 340 }, { name: 'Q2', emissions: 310 }, { name: 'Q3', emissions: 295 }, { name: 'Q4', emissions: 305 }
    ],
  }
};

const DONUT_COLORS = ['#4cceac', '#00C49F', '#FFBB28'];

const recentActivity = [
    { id: 1, user: 'Operator A', action: 'added fuel data for Q3.', time: '2 hours ago', type: 'created'},
    { id: 2, user: 'Admin', action: 'generated the annual sustainability report.', time: '1 day ago', type: 'created'},
    { id: 3, user: 'Verifier B', action: 'viewed methane emission records.', time: '3 days ago', type: 'viewed'},
    { id: 4, user: 'System', action: 'flagged electricity data for Mine B as anomalous.', time: '4 days ago', type: 'alert'},
];

const needsAttention = [
    { id: 1, title: 'Pending Data Entry for July', description: 'Fugitive methane data for Mine C has not been submitted.' },
    { id: 2, title: 'Unverified Q2 Report', description: 'The quarterly report requires auditor verification before finalization.' },
];

const Dashboard = ({ user }) => {
  const [timeFrame, setTimeFrame] = useState('quarterly');
  const data = mockData[timeFrame];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
            <h1>Welcome, {user ? user.name.split(' ')[0] : 'User'}</h1>
            <p>Here is your carbon performance snapshot.</p>
        </div>
        <div className="time-filter">
            <button onClick={() => setTimeFrame('monthly')} className={timeFrame === 'monthly' ? 'active' : ''}>Monthly</button>
            <button onClick={() => setTimeFrame('quarterly')} className={timeFrame === 'quarterly' ? 'active' : ''}>Quarterly</button>
            <button onClick={() => setTimeFrame('yearly')} className={timeFrame === 'yearly' ? 'active' : ''}>Yearly</button>
        </div>
      </header>
      
      <div className="kpi-grid">
        {data.kpis.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <h3 className="kpi-title">{kpi.title}</h3>
            <div className="kpi-main">
                <p className="kpi-value">{kpi.value}</p>
                <span className={`kpi-change ${kpi.changeType}`}>{kpi.change}</span>
            </div>
            <p className="kpi-unit">{kpi.unit}</p>
          </div>
        ))}
      </div>
      
      <div className="widgets-grid-enhanced">
        <div className="widget-card large-widget">
          <h3>GHG Emissions Trend ({timeFrame})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}/>
              <Legend />
              <Line type="monotone" dataKey="emissions" stroke="var(--accent-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Emissions (k tCO₂e)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="widget-card">
          <h3>Emissions by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5}>
                {data.donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="widget-card">
          <h3>Needs Attention</h3>
          <ul className="attention-list">
            {needsAttention.map(item => (
                <li key={item.id}>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                </li>
            ))}
          </ul>
        </div>
        <div className="widget-card">
          <h3>Recent Activity</h3>
          <ul className="activity-feed">
            {recentActivity.map(activity => (
                <li key={activity.id} className={`activity-item ${activity.type}`}>
                    <p><strong>{activity.user}</strong> {activity.action}</p>
                    <span>{activity.time}</span>
                </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;