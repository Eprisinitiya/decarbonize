import React, { useState, useCallback, useMemo } from 'react';
import './GHGInventoryRedesigned.css';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4cceac', '#00C49F', '#FFBB28', '#FF8042', '#ca71eb'];

const mockInventoryData = [
  { scope: 'Scope 1', emissions: 450, percentage: 45, unit: 'tCO₂e' },
  { scope: 'Scope 2', emissions: 280, percentage: 28, unit: 'tCO₂e' },
  { scope: 'Scope 3', emissions: 270, percentage: 27, unit: 'tCO₂e' },
];

const mockEmissionsHistory = [
  { month: 'Jan', scope1: 120, scope2: 80, scope3: 100 },
  { month: 'Feb', scope1: 115, scope2: 85, scope3: 95 },
  { month: 'Mar', scope1: 125, scope2: 75, scope3: 110 },
  { month: 'Apr', scope1: 110, scope2: 90, scope3: 105 },
  { month: 'May', scope1: 108, scope2: 88, scope3: 100 },
  { month: 'Jun', scope1: 105, scope2: 92, scope3: 98 },
];

const GHGInventoryRedesigned = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScope, setSelectedScope] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    scope: 'Scope 1',
    value: '',
    unit: 'tCO₂e',
    date: new Date().toISOString().split('T')[0]
  });

  const metrics = useMemo(() => {
    const total = mockInventoryData.reduce((sum, item) => sum + item.emissions, 0);
    const scope1 = mockInventoryData.find(item => item.scope === 'Scope 1')?.emissions || 0;
    const scope2 = mockInventoryData.find(item => item.scope === 'Scope 2')?.emissions || 0;
    const scope3 = mockInventoryData.find(item => item.scope === 'Scope 3')?.emissions || 0;
    
    return { total, scope1, scope2, scope3 };
  }, []);

  const handleAddEmission = useCallback((e) => {
    e.preventDefault();
    console.log('Added emission:', formData);
    setFormData({
      source: '',
      scope: 'Scope 1',
      value: '',
      unit: 'tCO₂e',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  }, [formData]);

  const renderOverview = () => (
    <div className="inventory-overview">
      <div className="overview-header">
        <h2>📊 Emissions Inventory Overview</h2>
        <p>Track and manage your organization's GHG emissions across all scopes</p>
      </div>

      <div className="inventory-cards-grid">
        <div className="inventory-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <span className="card-label">Total Emissions</span>
            <span className="card-value">{metrics.total}</span>
            <span className="card-unit">tCO₂e</span>
          </div>
        </div>

        <div className="inventory-card">
          <div className="card-icon">🏭</div>
          <div className="card-content">
            <span className="card-label">Scope 1 (Direct)</span>
            <span className="card-value">{metrics.scope1}</span>
            <span className="card-unit">tCO₂e</span>
            <span className="card-percent">{((metrics.scope1 / metrics.total) * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="inventory-card">
          <div className="card-icon">⚡</div>
          <div className="card-content">
            <span className="card-label">Scope 2 (Electricity)</span>
            <span className="card-value">{metrics.scope2}</span>
            <span className="card-unit">tCO₂e</span>
            <span className="card-percent">{((metrics.scope2 / metrics.total) * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="inventory-card">
          <div className="card-icon">🚚</div>
          <div className="card-content">
            <span className="card-label">Scope 3 (Indirect)</span>
            <span className="card-value">{metrics.scope3}</span>
            <span className="card-unit">tCO₂e</span>
            <span className="card-percent">{((metrics.scope3 / metrics.total) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-wrapper">
          <h3>Scope Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockInventoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ scope, percentage }) => `${scope}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="emissions"
              >
                {mockInventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} tCO₂e`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h3>Emissions Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockEmissionsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="scope1" fill={COLORS[0]} name="Scope 1" />
              <Bar dataKey="scope2" fill={COLORS[1]} name="Scope 2" />
              <Bar dataKey="scope3" fill={COLORS[2]} name="Scope 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDataEntry = () => (
    <div className="inventory-data-entry">
      <div className="entry-header">
        <h2>📝 Add Emissions Data</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add Emission Record'}
        </button>
      </div>

      {showAddForm && (
        <div className="entry-form-container">
          <form onSubmit={handleAddEmission} className="entry-form">
            <div className="form-row">
              <div className="form-group">
                <label>Emission Source *</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., Natural Gas Consumption"
                  required
                />
              </div>
              <div className="form-group">
                <label>Scope *</label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                >
                  <option>Scope 1 (Direct)</option>
                  <option>Scope 2 (Electricity)</option>
                  <option>Scope 3 (Indirect)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                  <option>tCO₂e</option>
                  <option>kgCO₂e</option>
                  <option>MWh</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="recent-entries">
        <h3>📋 Recent Entries</h3>
        <div className="entries-list">
          {[1, 2, 3].map((item) => (
            <div key={item} className="entry-item">
              <div className="entry-info">
                <span className="entry-source">Natural Gas Consumption</span>
                <span className="entry-scope">Scope 1</span>
                <span className="entry-value">125.50 tCO₂e</span>
              </div>
              <span className="entry-date">2025-06-{15 + item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="inventory-analysis">
      <h2>🔍 Emissions Analysis</h2>
      <div className="analysis-grid">
        <div className="analysis-card">
          <h4>Highest Emission Source</h4>
          <p className="analysis-value">Scope 1 (45%)</p>
          <p className="analysis-desc">Direct emissions from operations</p>
        </div>
        <div className="analysis-card">
          <h4>YoY Change</h4>
          <p className="analysis-value trend-up">↑ 8.3%</p>
          <p className="analysis-desc">Compared to last year</p>
        </div>
        <div className="analysis-card">
          <h4>Target Status</h4>
          <p className="analysis-value">On Track</p>
          <p className="analysis-desc">95% of target achieved</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ghg-inventory-redesigned">
      <div className="inventory-header">
        <h1>🌍 GHG Emissions Inventory</h1>
        <p>Comprehensive greenhouse gas emissions tracking and management</p>
      </div>

      <div className="inventory-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📊 Overview
        </button>
        <button className={`tab ${activeTab === 'entry' ? 'active' : ''}`} onClick={() => setActiveTab('entry')}>
          📝 Data Entry
        </button>
        <button className={`tab ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
          🔍 Analysis
        </button>
      </div>

      <div className="inventory-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'entry' && renderDataEntry()}
        {activeTab === 'analysis' && renderAnalysis()}
      </div>
    </div>
  );
};

export default GHGInventoryRedesigned;
