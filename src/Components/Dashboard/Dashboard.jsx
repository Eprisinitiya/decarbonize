import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, ComposedChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { HelpIcon } from '../common/Tooltip';
import FileUpload from '../common/FileUpload';
import PersonalizedDashboard from './PersonalizedDashboard';
import { DashboardEmptyState } from '../common/EmptyState';
import ActionsPanel from './ActionsPanel';

// --- Expanded Mock Data Sets for Different Time Frames ---
const mockData = {
  monthly: {
    kpis: [
      { 
        title: 'Total GHG Emissions', 
        value: '110k', 
        unit: 'tCO₂e', 
        change: '+2.1%', 
        changeType: 'increase',
        details: [
          { source: 'Scope 1 (Direct)', value: 65000 },
          { source: 'Scope 2 (Indirect)', value: 35000 },
          { source: 'Scope 3 (Value Chain)', value: 10000 },
        ]
      },
      { 
        title: 'Net Carbon Balance', 
        value: '-75k', 
        unit: 'tCO₂e', 
        change: '-1.5%', 
        changeType: 'decrease',
        details: [
          { source: 'Total Emissions', value: 110000 },
          { source: 'Sequestration', value: -35000 },
          { source: 'Carbon Offsets', value: 0 },
        ]
      },
      { 
        title: 'Emission Intensity', 
        value: '0.88', 
        unit: 'tCO₂e / tonne', 
        change: '+0.9%', 
        changeType: 'increase',
        details: [
          { source: 'Current', value: 0.88 },
          { source: 'Industry Average', value: 0.92 },
          { source: 'Best Practice', value: 0.75 },
        ]
      },
      { 
        title: 'Emissions vs Target', 
        value: '95%', 
        unit: 'of monthly goal', 
        change: '+5.0%', 
        changeType: 'increase',
        details: [
          { source: 'Current', value: 110000 },
          { source: 'Target', value: 105000 },
          { source: 'Gap', value: 5000 },
        ]
      },
    ],
    donutData: [
      { name: 'Diesel', value: 45000, percentage: 40.9 }, 
      { name: 'Methane', value: 30000, percentage: 27.3 }, 
      { name: 'Electricity', value: 25000, percentage: 22.7 },
      { name: 'Explosives', value: 6000, percentage: 5.5 },
      { name: 'Other', value: 4000, percentage: 3.6 }
    ],
    trendData: [
      { name: 'Week 1', emissions: 25000, production: 28000, intensity: 0.89 }, 
      { name: 'Week 2', emissions: 28000, production: 30000, intensity: 0.93 }, 
      { name: 'Week 3', emissions: 26000, production: 30500, intensity: 0.85 }, 
      { name: 'Week 4', emissions: 31000, production: 35000, intensity: 0.89 }
    ],
    mineData: [
      { name: 'Mine A', emissions: 45000, production: 52000, intensity: 0.87 },
      { name: 'Mine B', emissions: 35000, production: 38000, intensity: 0.92 },
      { name: 'Mine C', emissions: 30000, production: 37000, intensity: 0.81 }
    ],
    historicalData: [
      { date: '2025-01', emissions: 112000 },
      { date: '2025-02', emissions: 108000 },
      { date: '2025-03', emissions: 115000 },
      { date: '2025-04', emissions: 105000 },
      { date: '2025-05', emissions: 118000 },
      { date: '2025-06', emissions: 112000 },
      { date: '2025-07', emissions: 110000 },
      { date: '2025-08', emissions: 110000 },
    ],
    forecastData: [
      { date: '2025-08', actual: 110000, forecast: 110000 },
      { date: '2025-09', actual: null, forecast: 112000 },
      { date: '2025-10', actual: null, forecast: 118000 },
      { date: '2025-11', actual: null, forecast: 121000 },
      { date: '2025-12', actual: null, forecast: 124000 },
    ],
    benchmarkData: [
      { metric: 'Emission Intensity', company: 0.88, industry: 0.92, target: 0.75 },
      { metric: 'Energy Efficiency', company: 0.76, industry: 0.68, target: 0.85 },
      { metric: 'Renewable %', company: 0.22, industry: 0.18, target: 0.40 },
      { metric: 'Methane Capture', company: 0.58, industry: 0.45, target: 0.75 },
      { metric: 'Electrification', company: 0.35, industry: 0.32, target: 0.60 },
    ],
    reductionProgress: [
      { initiative: 'Diesel Replacement', target: 15000, achieved: 8000 },
      { initiative: 'Methane Capture', target: 10000, achieved: 4500 },
      { initiative: 'Renewable Energy', target: 12000, achieved: 6000 },
      { initiative: 'Process Efficiency', target: 8000, achieved: 7500 },
    ],
  },
  quarterly: {
    kpis: [
      { 
        title: 'Total GHG Emissions', 
        value: '340k', 
        unit: 'tCO₂e', 
        change: '+5.2%', 
        changeType: 'increase',
        details: [
          { source: 'Scope 1 (Direct)', value: 195000 },
          { source: 'Scope 2 (Indirect)', value: 105000 },
          { source: 'Scope 3 (Value Chain)', value: 40000 },
        ]
      },
      { 
        title: 'Net Carbon Balance', 
        value: '-280k', 
        unit: 'tCO₂e', 
        change: '-2.1%', 
        changeType: 'decrease',
        details: [
          { source: 'Total Emissions', value: 340000 },
          { source: 'Sequestration', value: -60000 },
          { source: 'Carbon Offsets', value: 0 },
        ]
      },
      { 
        title: 'Emission Intensity', 
        value: '0.85', 
        unit: 'tCO₂e / tonne', 
        change: '+1.5%', 
        changeType: 'increase',
        details: [
          { source: 'Current', value: 0.85 },
          { source: 'Industry Average', value: 0.90 },
          { source: 'Best Practice', value: 0.75 },
        ]
      },
      { 
        title: 'Emissions vs Target', 
        value: '105%', 
        unit: 'of quarterly goal', 
        change: '+3.2%', 
        changeType: 'increase',
        details: [
          { source: 'Current', value: 340000 },
          { source: 'Target', value: 324000 },
          { source: 'Gap', value: 16000 },
        ]
      },
    ],
    donutData: [
      { name: 'Diesel', value: 130000, percentage: 38.2 }, 
      { name: 'Methane', value: 95000, percentage: 27.9 }, 
      { name: 'Electricity', value: 70000, percentage: 20.6 },
      { name: 'Explosives', value: 25000, percentage: 7.4 },
      { name: 'Other', value: 20000, percentage: 5.9 }
    ],
    trendData: [
      { name: 'Jan', emissions: 110000, production: 130000, intensity: 0.85 }, 
      { name: 'Feb', emissions: 115000, production: 132000, intensity: 0.87 }, 
      { name: 'Mar', emissions: 112000, production: 135000, intensity: 0.83 }
    ],
    mineData: [
      { name: 'Mine A', emissions: 140000, production: 160000, intensity: 0.88 },
      { name: 'Mine B', emissions: 105000, production: 120000, intensity: 0.88 },
      { name: 'Mine C', emissions: 95000, production: 120000, intensity: 0.79 }
    ],
    historicalData: [
      { date: '2024-Q1', emissions: 325000 },
      { date: '2024-Q2', emissions: 335000 },
      { date: '2024-Q3', emissions: 355000 },
      { date: '2024-Q4', emissions: 338000 },
      { date: '2025-Q1', emissions: 340000 },
    ],
    forecastData: [
      { date: '2025-Q1', actual: 340000, forecast: 340000 },
      { date: '2025-Q2', actual: null, forecast: 350000 },
      { date: '2025-Q3', actual: null, forecast: 345000 },
      { date: '2025-Q4', actual: null, forecast: 330000 },
    ],
    benchmarkData: [
      { metric: 'Emission Intensity', company: 0.85, industry: 0.90, target: 0.75 },
      { metric: 'Energy Efficiency', company: 0.75, industry: 0.70, target: 0.85 },
      { metric: 'Renewable %', company: 0.25, industry: 0.18, target: 0.40 },
      { metric: 'Methane Capture', company: 0.60, industry: 0.45, target: 0.75 },
      { metric: 'Electrification', company: 0.38, industry: 0.30, target: 0.60 },
    ],
    reductionProgress: [
      { initiative: 'Diesel Replacement', target: 45000, achieved: 25000 },
      { initiative: 'Methane Capture', target: 30000, achieved: 15000 },
      { initiative: 'Renewable Energy', target: 35000, achieved: 22000 },
      { initiative: 'Process Efficiency', target: 25000, achieved: 22000 },
    ],
  },
  yearly: {
    kpis: [
      { 
        title: 'Total GHG Emissions', 
        value: '1.25M', 
        unit: 'tCO₂e', 
        change: '-3.5%', 
        changeType: 'decrease',
        details: [
          { source: 'Scope 1 (Direct)', value: 750000 },
          { source: 'Scope 2 (Indirect)', value: 350000 },
          { source: 'Scope 3 (Value Chain)', value: 150000 },
        ]
      },
      { 
        title: 'Net Carbon Balance', 
        value: '-890k', 
        unit: 'tCO₂e', 
        change: '-4.0%', 
        changeType: 'decrease',
        details: [
          { source: 'Total Emissions', value: 1250000 },
          { source: 'Sequestration', value: -250000 },
          { source: 'Carbon Offsets', value: -110000 },
        ]
      },
      { 
        title: 'Emission Intensity', 
        value: '0.82', 
        unit: 'tCO₂e / tonne', 
        change: '-2.8%', 
        changeType: 'decrease',
        details: [
          { source: 'Current', value: 0.82 },
          { source: 'Industry Average', value: 0.90 },
          { source: 'Best Practice', value: 0.75 },
        ]
      },
      { 
        title: 'Emissions vs Target', 
        value: '98%', 
        unit: 'of annual goal', 
        change: '-1.5%', 
        changeType: 'decrease',
        details: [
          { source: 'Current', value: 1250000 },
          { source: 'Target', value: 1275000 },
          { source: 'Gap', value: -25000 },
        ]
      },
    ],
    donutData: [
      { name: 'Diesel', value: 500000, percentage: 40.0 }, 
      { name: 'Methane', value: 410000, percentage: 32.8 }, 
      { name: 'Electricity', value: 290000, percentage: 23.2 },
      { name: 'Explosives', value: 35000, percentage: 2.8 },
      { name: 'Other', value: 15000, percentage: 1.2 }
    ],
    trendData: [
      { name: 'Q1', emissions: 340000, production: 400000, intensity: 0.85 }, 
      { name: 'Q2', emissions: 310000, production: 375000, intensity: 0.83 }, 
      { name: 'Q3', emissions: 295000, production: 365000, intensity: 0.81 }, 
      { name: 'Q4', emissions: 305000, production: 375000, intensity: 0.81 }
    ],
    mineData: [
      { name: 'Mine A', emissions: 520000, production: 625000, intensity: 0.83 },
      { name: 'Mine B', emissions: 385000, production: 450000, intensity: 0.86 },
      { name: 'Mine C', emissions: 345000, production: 440000, intensity: 0.78 }
    ],
    historicalData: [
      { date: '2020', emissions: 1450000 },
      { date: '2021', emissions: 1420000 },
      { date: '2022', emissions: 1380000 },
      { date: '2023', emissions: 1350000 },
      { date: '2024', emissions: 1295000 },
      { date: '2025', emissions: 1250000 },
    ],
    forecastData: [
      { date: '2025', actual: 1250000, forecast: 1250000 },
      { date: '2026', actual: null, forecast: 1175000 },
      { date: '2027', actual: null, forecast: 1100000 },
      { date: '2028', actual: null, forecast: 950000 },
      { date: '2029', actual: null, forecast: 800000 },
      { date: '2030', actual: null, forecast: 625000 },
    ],
    benchmarkData: [
      { metric: 'Emission Intensity', company: 0.82, industry: 0.90, target: 0.75 },
      { metric: 'Energy Efficiency', company: 0.80, industry: 0.70, target: 0.85 },
      { metric: 'Renewable %', company: 0.28, industry: 0.18, target: 0.40 },
      { metric: 'Methane Capture', company: 0.65, industry: 0.45, target: 0.75 },
      { metric: 'Electrification', company: 0.40, industry: 0.30, target: 0.60 },
    ],
    reductionProgress: [
      { initiative: 'Diesel Replacement', target: 180000, achieved: 125000 },
      { initiative: 'Methane Capture', target: 120000, achieved: 78000 },
      { initiative: 'Renewable Energy', target: 140000, achieved: 92000 },
      { initiative: 'Process Efficiency', target: 95000, achieved: 80000 },
    ],
  }
};

// Standardized Chart Color Palette
const CHART_COLORS = {
  primary: '#4cceac',      // Teal - Primary emissions/data
  secondary: '#3da68a',    // Dark teal - Secondary metrics
  accent: '#2dd4bf',       // Bright teal - Accents
  success: '#10b981',      // Green - Positive trends
  warning: '#FFBB28',      // Yellow - Warnings/targets
  danger: '#FF8042',       // Orange-red - Negative trends
  purple: '#ca71eb',       // Purple - Intensity metrics
  neutral: '#9ca3af'       // Gray - Neutral data
};

const DONUT_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.purple];
const EMISSION_COLOR = CHART_COLORS.primary;
const PRODUCTION_COLOR = CHART_COLORS.secondary;
const INTENSITY_COLOR = CHART_COLORS.purple;
const COMPANY_COLOR = CHART_COLORS.primary;
const INDUSTRY_COLOR = CHART_COLORS.danger;
const TARGET_COLOR = CHART_COLORS.warning;
const FORECAST_COLOR = CHART_COLORS.danger;
const ACTUAL_COLOR = CHART_COLORS.primary;

// Sample recent activity and alerts
const recentActivity = [
  { id: 1, user: 'Operator A', action: 'added fuel data for Q3.', time: '2 hours ago', type: 'created'},
  { id: 2, user: 'Admin', action: 'generated the annual sustainability report.', time: '1 day ago', type: 'created'},
  { id: 3, user: 'Verifier B', action: 'viewed methane emission records.', time: '3 days ago', type: 'viewed'},
  { id: 4, user: 'System', action: 'flagged electricity data for Mine B as anomalous.', time: '4 days ago', type: 'alert'},
  { id: 5, user: 'Operator C', action: 'updated sequestration project details.', time: '5 days ago', type: 'updated'},
  { id: 6, user: 'Manager A', action: 'approved emission reduction plan.', time: '1 week ago', type: 'approved'},
];

const needsAttention = [
  { id: 1, title: 'Pending Data Entry', description: 'Fugitive methane data for Mine C has not been submitted for the current period.' },
  { id: 2, title: 'Unverified Report', description: 'The quarterly report requires auditor verification before finalization.' },
  { id: 3, title: 'Emission Target Alert', description: 'Current emissions are trending 5% above quarterly target.' },
  { id: 4, title: 'Data Anomaly Detected', description: 'Unusual spike in diesel consumption at Mine B requires investigation.' },
];

const Dashboard = ({ user }) => {
  const [timeFrame, setTimeFrame] = useState('quarterly');
  const [activeKPI, setActiveKPI] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [hasData, setHasData] = useState(true); // Set to false for empty state demo
  const data = mockData[timeFrame];

  // Simulated loading state for real-world API calls
  const [isLoading, setIsLoading] = useState(false);

  // Handle file upload
  const handleFileUpload = (file) => {
    console.log('File uploaded:', file.name);
    setHasData(true); // Mark that data has been uploaded
  };

  useEffect(() => {
    // Simulate API call when timeframe changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [timeFrame]);

  const handleKPIClick = (index) => {
    setActiveKPI(activeKPI === index ? null : index);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const formatYAxisTick = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value;
  };

  const renderValueTrendIndicator = (change, changeType) => {
    return (
      <div className={`trend-indicator ${changeType}`}>
        {changeType === 'increase' ? 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg> :
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        }
        <span>{change}</span>
      </div>
    );
  };

  const renderKPIDetails = (kpi, index) => {
    if (activeKPI !== index) return null;
    
    return (
      <div className="kpi-details">
        <h4>Breakdown</h4>
        <ul>
          {kpi.details.map((detail, i) => (
            <li key={i}>
              <span>{detail.source}</span>
              <span className="detail-value">
                {detail.value >= 1000000 
                  ? `${(detail.value / 1000000).toFixed(2)}M` 
                  : detail.value >= 1000 
                    ? `${(detail.value / 1000).toFixed(0)}k` 
                    : detail.value}
                {detail.value < 0 ? ' tCO₂e' : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p>Here is your carbon performance snapshot.</p>
        </div>
        <div className="time-filter">
          <button onClick={() => setTimeFrame('monthly')} className={timeFrame === 'monthly' ? 'active' : ''}>Monthly</button>
          <button onClick={() => setTimeFrame('quarterly')} className={timeFrame === 'quarterly' ? 'active' : ''}>Quarterly</button>
          <button onClick={() => setTimeFrame('yearly')} className={timeFrame === 'yearly' ? 'active' : ''}>Yearly</button>
          <button onClick={toggleExpanded} className="expand-btn">
            {expanded ? 'Compact View' : 'Expanded View'}
          </button>
          <button 
            onClick={() => setShowPersonalized(!showPersonalized)}
            className={`dashboard-toggle-btn ${showPersonalized ? 'active' : ''}`}
            title="Toggle personalized KPI view"
          >
            {showPersonalized ? '📊 Standard View' : '📌 Pinnable KPIs'}
          </button>
        </div>
      </header>
      
      {/* Show personalized dashboard if toggled */}
      {showPersonalized && (
        <section className="dashboard-section">
          <PersonalizedDashboard user={user} allKPIs={data.kpis} />
        </section>
      )}

      {/* Show file upload section */}
      <section className="dashboard-section upload-section">
        <h2>Upload Emission Data</h2>
        <FileUpload 
          onFileSelect={handleFileUpload}
          acceptedFormats={['.csv', '.xlsx', '.json']}
          maxSizeMB={50}
          title="Upload Your Facility Data"
          description="Drag and drop your emissions data file here, or click to browse"
        />
      </section>

      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : !hasData ? (
        <DashboardEmptyState onUploadClick={() => { /* scroll to upload */ }} />
      ) : (
        <>
          {/* Tier 1: Global KPIs */}
          <div className="dashboard-tier-top">
            <div className="kpi-grid">
            {data.kpis.map((kpi, index) => (
              <div 
                key={index} 
                className={`kpi-card ${activeKPI === index ? 'active' : ''}`}
              >
                <div>
                  <div className="kpi-header">
                    <h3 className="kpi-title">
                      {kpi.title}
                      {index === 0 && (
                        <HelpIcon 
                          content="Total greenhouse gas emissions across all scopes: Scope 1 (direct emissions), Scope 2 (indirect from energy), and Scope 3 (value chain)."
                          ariaLabel="Explanation of Total GHG Emissions"
                        />
                      )}
                      {index === 1 && (
                        <HelpIcon 
                          content="Net emissions after accounting for carbon sequestration projects and offsets. Shows your actual carbon impact."
                          ariaLabel="Explanation of Net Carbon Balance"
                        />
                      )}
                      {index === 2 && (
                        <HelpIcon 
                          content="Emissions per unit of production (tCO₂e/tonne). Lower values indicate better efficiency."
                          ariaLabel="Explanation of Emission Intensity"
                        />
                      )}
                    </h3>
                    {renderValueTrendIndicator(kpi.change, kpi.changeType)}
                  </div>
                  <div className="kpi-main">
                    <div className="kpi-value">{kpi.value}</div>
                    <div className="kpi-unit">{kpi.unit}</div>
                  </div>
                </div>
                <button 
                  className="kpi-view-detail"
                  onClick={() => handleKPIClick(index)}
                  aria-label={`View details for ${kpi.title}`}
                >
                  <span>{activeKPI === index ? 'Hide details' : 'View details'}</span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.16669 10H15.8334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 4.16669L15.8333 10L10 15.8334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {renderKPIDetails(kpi, index)}
              </div>
            ))}
            </div>
          </div>
          
          {/* Tier 2: Time-series Charts */}
          <div className="dashboard-tier-middle">
            <div className={`widgets-grid ${expanded ? 'expanded' : ''}`}>
            <div className="widget-card large-widget">
              <h3>
                GHG Emissions Trend ({timeFrame})
                <HelpIcon 
                  content="Emissions measured in tonnes of CO₂ equivalent (tCO₂e) over the selected time period. Green line shows production volume for context."
                  ariaLabel="Explanation of emissions trend chart"
                />
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data.trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis yAxisId="left" stroke="var(--text-secondary)" tickFormatter={formatYAxisTick} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background-secondary)', 
                      border: '1px solid var(--border-color)' 
                    }}
                    formatter={(value, name) => {
                      if (name === 'Emissions') return [`${(value / 1000).toFixed(0)}k tCO₂e`, name];
                      if (name === 'Production') return [`${(value / 1000).toFixed(0)}k tonnes`, name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="emissions" 
                    fill={EMISSION_COLOR} 
                    name="Emissions" 
                    barSize={20} 
                  />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="production" 
                    stroke={PRODUCTION_COLOR} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 8 }} 
                    name="Production" 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke={INTENSITY_COLOR} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 8 }} 
                    name="Intensity" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="widget-card">
              <h3>
                Emissions by Source
                <HelpIcon 
                  content="Breakdown of total emissions by source type. Hover over segments to see detailed values and percentages."
                  ariaLabel="Explanation of emissions breakdown"
                />
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={data.donutData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={5}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    labelLine={false}
                  >
                    {data.donutData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={DONUT_COLORS[index % DONUT_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background-secondary)', 
                      border: '1px solid var(--border-color)' 
                    }}
                    formatter={(value, name, props) => {
                      const entry = props.payload;
                      return [`${(value / 1000).toFixed(0)}k tCO₂e (${entry.percentage}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            </div>
          </div>
            
          {/* Tier 3: Breakdown Tables & Action Items */}
          <div className="dashboard-tier-bottom">
            <div className="widgets-grid">
            <div className="widget-card">
              <h3>Needs Attention</h3>
              <ul className="attention-list">
                {needsAttention.map(item => (
                  <li key={item.id} className="attention-item">
                    <div className="attention-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div className="attention-content">
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="widget-card">
              <h3>Recent Activity</h3>
              <ul className="activity-feed">
                {recentActivity.map(activity => (
                  <li key={activity.id} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'created' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                      )}
                      {activity.type === 'updated' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 7h-9M14 17H5M5 7l5 5-5 5M19 17l-5-5 5-5"/>
                        </svg>
                      )}
                      {activity.type === 'viewed' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7s-3 7-10 7-10-7-10-7Z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                      {activity.type === 'alert' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>
                        </svg>
                      )}
                      {activity.type === 'approved' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </div>
                    <div className="activity-content">
                      <p><strong>{activity.user}</strong> {activity.action}</p>
                      <span>{activity.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {expanded && (
              <>
                <div className="widget-card large-widget">
                  <h3>Historical Emissions & Forecast</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data.forecastData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis dataKey="date" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" tickFormatter={formatYAxisTick} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background-secondary)', 
                          border: '1px solid var(--border-color)' 
                        }}
                        formatter={(value, name) => {
                          if (!value) return ['-', name];
                          return [`${(value / 1000).toFixed(0)}k tCO₂e`, name];
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="forecast" 
                        fill={FORECAST_COLOR} 
                        stroke={FORECAST_COLOR} 
                        fillOpacity={0.3} 
                        name="Forecast" 
                      />
                      <Bar 
                        dataKey="actual" 
                        fill={ACTUAL_COLOR} 
                        name="Actual" 
                        barSize={20} 
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="widget-card">
                  <h3>Emissions by Mine</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.mineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis dataKey="name" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" tickFormatter={formatYAxisTick} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background-secondary)', 
                          border: '1px solid var(--border-color)' 
                        }}
                        formatter={(value, name) => {
                          if (name === 'Emissions') return [`${(value / 1000).toFixed(0)}k tCO₂e`, name];
                          if (name === 'Production') return [`${(value / 1000).toFixed(0)}k tonnes`, name];
                          if (name === 'Intensity') return [`${value.toFixed(2)} tCO₂e/tonne`, name];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="emissions" fill={EMISSION_COLOR} name="Emissions" />
                      <Bar dataKey="production" fill={PRODUCTION_COLOR} name="Production" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="widget-card">
                  <h3>Sustainability Benchmarks</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius={90} data={data.benchmarkData}>
                      <PolarGrid stroke="var(--border-color)" />
                      <PolarAngleAxis dataKey="metric" stroke="var(--text-secondary)" />
                      <PolarRadiusAxis angle={30} domain={[0, 1]} />
                      <Radar
                        name="Your Company"
                        dataKey="company"
                        stroke={COMPANY_COLOR}
                        fill={COMPANY_COLOR}
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Industry Average"
                        dataKey="industry"
                        stroke={INDUSTRY_COLOR}
                        fill={INDUSTRY_COLOR}
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="2030 Target"
                        dataKey="target"
                        stroke={TARGET_COLOR}
                        fill={TARGET_COLOR}
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background-secondary)', 
                          border: '1px solid var(--border-color)' 
                        }}
                        formatter={(value) => [`${(value * 100).toFixed(0)}%`]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="widget-card large-widget">
                  <h3>Emission Reduction Progress</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={data.reductionProgress}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis type="number" stroke="var(--text-secondary)" tickFormatter={formatYAxisTick} />
                      <YAxis type="category" dataKey="initiative" stroke="var(--text-secondary)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background-secondary)', 
                          border: '1px solid var(--border-color)' 
                        }}
                        formatter={(value) => [`${(value / 1000).toFixed(1)}k tCO₂e`]}
                      />
                      <Legend />
                      <Bar dataKey="target" name="Target Reduction" fill={TARGET_COLOR} />
                      <Bar dataKey="achieved" name="Achieved Reduction" fill={COMPANY_COLOR} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
            </div>
          </div>
          
          {/* Tier 3: Action Recommendations */}
          <div className="dashboard-tier-bottom">
            <ActionsPanel />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
