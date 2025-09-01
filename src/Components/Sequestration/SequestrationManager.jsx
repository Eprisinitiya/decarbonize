import React, { useState, useEffect } from 'react';
import './SequestrationManager.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart 
} from 'recharts';

// Enhanced project data with comprehensive tracking
const initialProjects = [
  {
    id: 1,
    name: 'West Ridge Afforestation',
    type: 'Afforestation',
    area: 50,
    species: ['Oak', 'Pine', 'Maple'],
    plantedDate: '2022-03-15',
    expectedMaturity: '2027-03-15',
    rate: 3.5,
    currentSequestration: 175,
    projectedTotal: 875,
    status: 'Active',
    location: 'West Ridge',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    investment: 125000,
    maintenanceCost: 15000,
    survivalRate: 92,
    growthStage: 'Established',
    certifications: ['FSC', 'PEFC'],
    carbonCredits: 0,
    monitoringData: [
      { month: 'Jan', sequestered: 12, growth: 85 },
      { month: 'Feb', sequestered: 14, growth: 87 },
      { month: 'Mar', sequestered: 16, growth: 90 },
      { month: 'Apr', sequestered: 18, growth: 92 },
    ],
  },
  {
    id: 2,
    name: 'North Block Reclamation',
    type: 'Land Reclamation',
    area: 120,
    species: ['Willow', 'Birch', 'Alder'],
    plantedDate: '2021-09-10',
    expectedMaturity: '2026-09-10',
    rate: 4.1,
    currentSequestration: 492,
    projectedTotal: 2460,
    status: 'Active',
    location: 'North Block',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    investment: 280000,
    maintenanceCost: 25000,
    survivalRate: 89,
    growthStage: 'Mature',
    certifications: ['VCS', 'Gold Standard'],
    carbonCredits: 45,
    monitoringData: [
      { month: 'Jan', sequestered: 38, growth: 89 },
      { month: 'Feb', sequestered: 40, growth: 90 },
      { month: 'Mar', sequestered: 42, growth: 91 },
      { month: 'Apr', sequestered: 44, growth: 89 },
    ],
  },
  {
    id: 3,
    name: 'Old Pit Grassland',
    type: 'Grassland Restoration',
    area: 75,
    species: ['Native Grasses', 'Wildflowers'],
    plantedDate: '2020-05-20',
    expectedMaturity: '2023-05-20',
    rate: 1.2,
    currentSequestration: 270,
    projectedTotal: 270,
    status: 'Completed',
    location: 'Old Pit',
    coordinates: { lat: 40.6892, lng: -74.0445 },
    investment: 95000,
    maintenanceCost: 8000,
    survivalRate: 95,
    growthStage: 'Completed',
    certifications: ['ACR'],
    carbonCredits: 78,
    monitoringData: [
      { month: 'Jan', sequestered: 22, growth: 95 },
      { month: 'Feb', sequestered: 23, growth: 96 },
      { month: 'Mar', sequestered: 22, growth: 94 },
      { month: 'Apr', sequestered: 24, growth: 95 },
    ],
  },
  {
    id: 4,
    name: 'South Valley Mixed Forest',
    type: 'Mixed Forest',
    area: 200,
    species: ['Oak', 'Beech', 'Chestnut'],
    plantedDate: '2023-04-10',
    expectedMaturity: '2028-04-10',
    rate: 4.8,
    currentSequestration: 96,
    projectedTotal: 4800,
    status: 'Planning',
    location: 'South Valley',
    coordinates: { lat: 40.6501, lng: -73.9496 },
    investment: 450000,
    maintenanceCost: 40000,
    survivalRate: 0,
    growthStage: 'Planning',
    certifications: [],
    carbonCredits: 0,
    monitoringData: [],
  },
];

const projectTypes = [
  { id: 'afforestation', name: 'Afforestation', icon: '🌲', avgRate: 3.8 },
  { id: 'reforestation', name: 'Reforestation', icon: '🌳', avgRate: 4.2 },
  { id: 'land-reclamation', name: 'Land Reclamation', icon: '🌿', avgRate: 3.5 },
  { id: 'grassland-restoration', name: 'Grassland Restoration', icon: '🌾', avgRate: 1.5 },
  { id: 'mixed-forest', name: 'Mixed Forest', icon: '🏞️', avgRate: 4.5 },
  { id: 'wetland-restoration', name: 'Wetland Restoration', icon: '💧', avgRate: 2.8 },
];

const COLORS = ['#4cceac', '#00C49F', '#FFBB28', '#FF8042', '#ca71eb', '#8dd1e1'];

const SequestrationManager = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [activeView, setActiveView] = useState('overview'); // overview, projects, analytics, add-project
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    area: '',
    species: [],
    plantedDate: '',
    expectedMaturity: '',
    location: '',
    investment: '',
    coordinates: { lat: '', lng: '' },
  });
  const [formErrors, setFormErrors] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    location: 'all',
  });

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const totalArea = projects.reduce((sum, p) => sum + p.area, 0);
    const totalSequestration = projects.reduce((sum, p) => sum + p.currentSequestration, 0);
    const totalProjectedSequestration = projects.reduce((sum, p) => sum + p.projectedTotal, 0);
    const totalInvestment = projects.reduce((sum, p) => sum + p.investment, 0);
    const totalCarbonCredits = projects.reduce((sum, p) => sum + p.carbonCredits, 0);
    const avgSequestrationRate = totalSequestration / totalArea || 0;

    return {
      activeProjects,
      completedProjects,
      totalArea,
      totalSequestration,
      totalProjectedSequestration,
      totalInvestment,
      totalCarbonCredits,
      avgSequestrationRate,
    };
  };

  const summaryStats = calculateSummaryStats();

  // Filter projects based on current filters
  const filteredProjects = projects.filter(project => {
    if (filters.status !== 'all' && project.status !== filters.status) return false;
    if (filters.type !== 'all' && project.type !== filters.type) return false;
    if (filters.location !== 'all' && project.location !== filters.location) return false;
    return true;
  });

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Project name is required';
    if (!formData.type) errors.type = 'Project type is required';
    if (!formData.area || parseFloat(formData.area) <= 0) errors.area = 'Valid area is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.investment || parseFloat(formData.investment) <= 0) errors.investment = 'Valid investment amount is required';
    if (!formData.plantedDate) errors.plantedDate = 'Planting date is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedType = projectTypes.find(t => t.id === formData.type);
    const newProject = {
      id: Date.now(),
      ...formData,
      area: parseFloat(formData.area),
      investment: parseFloat(formData.investment),
      rate: selectedType?.avgRate || 3.0,
      currentSequestration: 0,
      projectedTotal: parseFloat(formData.area) * (selectedType?.avgRate || 3.0) * 5, // 5 years projection
      status: 'Planning',
      maintenanceCost: parseFloat(formData.investment) * 0.1, // 10% of investment
      survivalRate: 0,
      growthStage: 'Planning',
      certifications: [],
      carbonCredits: 0,
      monitoringData: [],
    };

    setProjects(prev => [...prev, newProject]);
    setFormData({
      name: '',
      type: '',
      area: '',
      species: [],
      plantedDate: '',
      expectedMaturity: '',
      location: '',
      investment: '',
      coordinates: { lat: '', lng: '' },
    });
    setShowAddProject(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Delete project
  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  // Update project status
  const handleStatusChange = (projectId, newStatus) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    ));
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="overview-header">
        <h3>🌍 Portfolio Overview</h3>
        <p>Comprehensive view of your carbon sequestration projects</p>
      </div>

      <div className="summary-cards-grid">
        <div className="summary-card">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <h4>Total Sequestration</h4>
            <p className="summary-value">{summaryStats.totalSequestration.toFixed(1)} <span>tCO₂</span></p>
            <p className="summary-change">Current absorbed carbon</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <h4>Projected Total</h4>
            <p className="summary-value">{summaryStats.totalProjectedSequestration.toFixed(0)} <span>tCO₂</span></p>
            <p className="summary-change">At maturity</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">🌲</div>
          <div className="summary-content">
            <h4>Active Projects</h4>
            <p className="summary-value">{summaryStats.activeProjects} <span>projects</span></p>
            <p className="summary-change">{summaryStats.completedProjects} completed</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📍</div>
          <div className="summary-content">
            <h4>Total Area</h4>
            <p className="summary-value">{summaryStats.totalArea} <span>hectares</span></p>
            <p className="summary-change">Under management</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h4>Total Investment</h4>
            <p className="summary-value">${(summaryStats.totalInvestment / 1000).toFixed(0)}K</p>
            <p className="summary-change">Portfolio value</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">🏆</div>
          <div className="summary-content">
            <h4>Carbon Credits</h4>
            <p className="summary-value">{summaryStats.totalCarbonCredits} <span>credits</span></p>
            <p className="summary-change">Monetized</p>
          </div>
        </div>
      </div>

      <div className="overview-charts">
        <div className="chart-card">
          <h4>📊 Sequestration Progress</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filteredProjects}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentSequestration" fill={COLORS[0]} name="Current (tCO₂)" />
              <Bar dataKey="projectedTotal" fill={COLORS[1]} name="Projected (tCO₂)" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>🥧 Project Types Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={projectTypes.map(type => ({
                  name: type.name,
                  value: projects.filter(p => p.type === type.name).length
                })).filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderProjectsList = () => (
    <div className="projects-list-section">
      <div className="projects-header">
        <h3>🌲 Project Management</h3>
        <div className="projects-controls">
          <div className="filters">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Planning">Planning</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              {projectTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>
          <button
            className="add-project-btn enhanced"
            onClick={() => setShowAddProject(true)}
          >
            + Add New Project
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card enhanced">
            <div className="project-header">
              <div className="project-title">
                <h4>{project.name}</h4>
                <span className="project-type">{project.type}</span>
              </div>
              <div className="project-status">
                <span className={`status-badge status-${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="project-metrics">
              <div className="metric">
                <span className="metric-label">Area</span>
                <span className="metric-value">{project.area} ha</span>
              </div>
              <div className="metric">
                <span className="metric-label">Rate</span>
                <span className="metric-value">{project.rate} tCO₂/ha/yr</span>
              </div>
              <div className="metric">
                <span className="metric-label">Sequestered</span>
                <span className="metric-value highlighted">{project.currentSequestration} tCO₂</span>
              </div>
              <div className="metric">
                <span className="metric-label">Projected</span>
                <span className="metric-value">{project.projectedTotal} tCO₂</span>
              </div>
            </div>
            
            <div className="project-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(project.currentSequestration / project.projectedTotal) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {((project.currentSequestration / project.projectedTotal) * 100).toFixed(1)}% Complete
              </span>
            </div>
            
            <div className="project-details">
              <div className="detail-item">
                <span>📍 {project.location}</span>
              </div>
              <div className="detail-item">
                <span>🌱 Planted: {new Date(project.plantedDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span>💰 Investment: ${(project.investment / 1000).toFixed(0)}K</span>
              </div>
              {project.carbonCredits > 0 && (
                <div className="detail-item">
                  <span>🏆 Credits: {project.carbonCredits}</span>
                </div>
              )}
            </div>
            
            <div className="project-actions">
              <button
                className="action-btn view-btn"
                onClick={() => setSelectedProject(project)}
              >
                👁️ View Details
              </button>
              <button
                className="action-btn edit-btn"
                onClick={() => {
                  // Implementation for edit functionality
                  console.log('Edit project:', project.id);
                }}
              >
                ✏️ Edit
              </button>
              <button
                className="action-btn delete-btn"
                onClick={() => handleDeleteProject(project.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddProjectForm = () => (
    <div className="add-project-modal-overlay">
      <div className="add-project-modal">
        <div className="modal-header">
          <h3>🌱 Add New Sequestration Project</h3>
          <button
            className="close-btn"
            onClick={() => setShowAddProject(false)}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleAddProject} className="project-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Project Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., North Ridge Reforestation"
                required
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Project Type <span className="required">*</span></label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select project type...</option>
                {projectTypes.map(type => (
                  <option key={type.id} value={type.name}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
              {formErrors.type && <span className="error-text">{formErrors.type}</span>}
            </div>
            
            <div className="form-group">
              <label>Area (Hectares) <span className="required">*</span></label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="e.g., 150"
                min="0.1"
                step="0.1"
                required
              />
              {formErrors.area && <span className="error-text">{formErrors.area}</span>}
            </div>
            
            <div className="form-group">
              <label>Location <span className="required">*</span></label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., North Block"
                required
              />
              {formErrors.location && <span className="error-text">{formErrors.location}</span>}
            </div>
            
            <div className="form-group">
              <label>Investment ($) <span className="required">*</span></label>
              <input
                type="number"
                name="investment"
                value={formData.investment}
                onChange={handleInputChange}
                placeholder="e.g., 250000"
                min="1000"
                step="1000"
                required
              />
              {formErrors.investment && <span className="error-text">{formErrors.investment}</span>}
            </div>
            
            <div className="form-group">
              <label>Planting Date <span className="required">*</span></label>
              <input
                type="date"
                name="plantedDate"
                value={formData.plantedDate}
                onChange={handleInputChange}
                required
              />
              {formErrors.plantedDate && <span className="error-text">{formErrors.plantedDate}</span>}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowAddProject(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="sequestration-manager-container">
      <header className="page-header enhanced">
        <div className="header-content">
          <h1>🌍 Carbon Sequestration Portfolio</h1>
          <p>Manage afforestation, reforestation, and land restoration projects with comprehensive tracking and analytics.</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{summaryStats.totalSequestration.toFixed(0)}</span>
            <span className="stat-label">tCO₂ Sequestered</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{summaryStats.activeProjects}</span>
            <span className="stat-label">Active Projects</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{summaryStats.totalArea}</span>
            <span className="stat-label">Total Hectares</span>
          </div>
        </div>
      </header>

      <div className="sequestration-tabs">
        <button
          onClick={() => setActiveView('overview')}
          className={`tab-btn ${activeView === 'overview' ? 'active' : ''}`}
        >
          🌍 Overview
        </button>
        <button
          onClick={() => setActiveView('projects')}
          className={`tab-btn ${activeView === 'projects' ? 'active' : ''}`}
        >
          🌲 Projects
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`tab-btn ${activeView === 'analytics' ? 'active' : ''}`}
        >
          📊 Analytics
        </button>
      </div>

      <div className="sequestration-content">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'projects' && renderProjectsList()}
        {activeView === 'analytics' && (
          <div className="analytics-section">
            <h3>📊 Advanced Analytics</h3>
            <p>Detailed performance metrics and projections coming soon...</p>
          </div>
        )}
      </div>

      {showAddProject && renderAddProjectForm()}
    </div>
  );
};

export default SequestrationManager;