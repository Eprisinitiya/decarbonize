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

  // Generate comprehensive analytics data
  const generateAnalyticsData = () => {
    // Historical sequestration timeline (5 years)
    const historicalData = [
      { year: '2020', actual: 145, target: 120, cumulative: 145 },
      { year: '2021', actual: 285, target: 260, cumulative: 430 },
      { year: '2022', actual: 420, target: 400, cumulative: 850 },
      { year: '2023', actual: 615, target: 580, cumulative: 1465 },
      { year: '2024', actual: 800, target: 780, cumulative: 2265 },
      { year: '2025', actual: summaryStats.totalSequestration, target: 1000, cumulative: summaryStats.totalSequestration + 2265 }
    ];

    // Future projections (10 years ahead)
    const projectionData = [
      { year: '2025', actual: summaryStats.totalSequestration, forecast: null },
      { year: '2026', actual: null, forecast: 1240 },
      { year: '2027', actual: null, forecast: 1650 },
      { year: '2028', actual: null, forecast: 2180 },
      { year: '2029', actual: null, forecast: 2850 },
      { year: '2030', actual: null, forecast: 3600 },
      { year: '2031', actual: null, forecast: 4420 },
      { year: '2032', actual: null, forecast: 5280 },
      { year: '2033', actual: null, forecast: 6180 },
      { year: '2034', actual: null, forecast: 7120 },
      { year: '2035', actual: null, forecast: 8100 }
    ];

    // Performance by project type
    const performanceByType = projectTypes.map(type => {
      const typeProjects = projects.filter(p => p.type === type.name);
      const totalArea = typeProjects.reduce((sum, p) => sum + p.area, 0);
      const totalSequestration = typeProjects.reduce((sum, p) => sum + p.currentSequestration, 0);
      const avgEfficiency = totalArea > 0 ? totalSequestration / totalArea : 0;
      const investment = typeProjects.reduce((sum, p) => sum + p.investment, 0);
      const roi = investment > 0 ? ((totalSequestration * 25) - investment) / investment * 100 : 0; // Assuming $25/tCO2
      
      return {
        type: type.name,
        icon: type.icon,
        projects: typeProjects.length,
        area: totalArea,
        sequestration: totalSequestration,
        efficiency: avgEfficiency,
        investment: investment,
        roi: roi,
        avgRate: type.avgRate
      };
    }).filter(type => type.projects > 0);

    // Monthly sequestration trends (last 12 months)
    const monthlyTrends = [
      { month: 'Jan 2025', sequestered: 65, target: 70, efficiency: 0.93 },
      { month: 'Feb 2025', sequestered: 68, target: 72, efficiency: 0.94 },
      { month: 'Mar 2025', sequestered: 75, target: 74, efficiency: 1.01 },
      { month: 'Apr 2025', sequestered: 82, target: 76, efficiency: 1.08 },
      { month: 'May 2025', sequestered: 89, target: 85, efficiency: 1.05 },
      { month: 'Jun 2025', sequestered: 95, target: 90, efficiency: 1.06 },
      { month: 'Jul 2025', sequestered: 98, target: 95, efficiency: 1.03 },
      { month: 'Aug 2025', sequestered: 92, target: 88, efficiency: 1.05 },
      { month: 'Sep 2025', sequestered: 87, target: 85, efficiency: 1.02 },
      { month: 'Oct 2025', sequestered: 78, target: 80, efficiency: 0.98 },
      { month: 'Nov 2025', sequestered: 71, target: 75, efficiency: 0.95 },
      { month: 'Dec 2025', sequestered: 67, target: 72, efficiency: 0.93 }
    ];

    // Risk assessment data
    const riskData = [
      { category: 'Climate Risk', score: 65, description: 'Moderate drought and extreme weather risk' },
      { category: 'Survival Rate', score: 89, description: 'High survival rates across all projects' },
      { category: 'Market Risk', score: 72, description: 'Stable carbon credit pricing' },
      { category: 'Regulatory', score: 95, description: 'Strong regulatory support' },
      { category: 'Financial', score: 83, description: 'Adequate funding secured' }
    ];

    // Carbon credit potential
    const creditPotential = projects.map(project => {
      const currentCredits = project.carbonCredits;
      const potentialCredits = Math.floor(project.currentSequestration * 0.85); // 85% verification rate
      const futureCredits = Math.floor(project.projectedTotal * 0.85);
      
      return {
        name: project.name.substring(0, 15) + '...',
        current: currentCredits,
        potential: potentialCredits - currentCredits,
        future: futureCredits - potentialCredits
      };
    });

    return {
      historicalData,
      projectionData,
      performanceByType,
      monthlyTrends,
      riskData,
      creditPotential
    };
  };

  const renderAdvancedAnalytics = () => {
    const analyticsData = generateAnalyticsData();

    return (
      <div className="advanced-analytics-section">
        <div className="analytics-header">
          <h3>📈 Advanced Analytics & Projections</h3>
          <p>Comprehensive insights into your carbon sequestration portfolio performance and future potential</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="analytics-kpi-grid">
          <div className="analytics-kpi-card">
            <div className="kpi-icon">🎕️</div>
            <div className="kpi-content">
              <h4>Portfolio Efficiency</h4>
              <div className="kpi-value">{summaryStats.avgSequestrationRate.toFixed(2)} <span>tCO₂/ha/yr</span></div>
              <div className="kpi-trend positive">+12.5% vs industry avg</div>
            </div>
          </div>
          
          <div className="analytics-kpi-card">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <h4>Revenue Potential</h4>
              <div className="kpi-value">${((summaryStats.totalSequestration * 25) / 1000).toFixed(0)}K <span>from credits</span></div>
              <div className="kpi-trend positive">@$25/tCO₂ market price</div>
            </div>
          </div>
          
          <div className="analytics-kpi-card">
            <div className="kpi-icon">🎗️</div>
            <div className="kpi-content">
              <h4>Project Success Rate</h4>
              <div className="kpi-value">89.2% <span>survival rate</span></div>
              <div className="kpi-trend positive">Above 85% target</div>
            </div>
          </div>
          
          <div className="analytics-kpi-card">
            <div className="kpi-icon">🔮</div>
            <div className="kpi-content">
              <h4>2030 Projection</h4>
              <div className="kpi-value">{(summaryStats.totalProjectedSequestration / 1000).toFixed(1)}K <span>tCO₂</span></div>
              <div className="kpi-trend positive">285% growth potential</div>
            </div>
          </div>
        </div>

        {/* Advanced Charts Grid */}
        <div className="analytics-charts-grid">
          {/* Historical Performance & Future Projections */}
          <div className="analytics-chart-card large">
            <div className="chart-header">
              <h4>📉 Historical Performance & 10-Year Projection</h4>
              <div className="chart-controls">
                <span className="legend-item"><span className="legend-dot actual"></span>Actual</span>
                <span className="legend-item"><span className="legend-dot forecast"></span>Forecast</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={analyticsData.projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}
                  formatter={(value, name) => value ? [`${value} tCO₂`, name] : ['No data', name]}
                />
                <Legend />
                <Bar dataKey="actual" fill={COLORS[0]} name="Historical Actual" />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke={COLORS[2]} 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 6 }}
                  name="Future Projection"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Performance by Project Type */}
          <div className="analytics-chart-card">
            <div className="chart-header">
              <h4>🏆 Performance by Project Type</h4>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData.performanceByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="type" stroke="var(--text-secondary)" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}
                  formatter={(value, name) => {
                    if (name === 'Efficiency') return [`${value.toFixed(2)} tCO₂/ha/yr`, name];
                    if (name === 'ROI') return [`${value.toFixed(1)}%`, name];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="efficiency" fill={COLORS[0]} name="Efficiency" />
                <Bar dataKey="roi" fill={COLORS[1]} name="ROI" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Sequestration Trends */}
          <div className="analytics-chart-card large">
            <div className="chart-header">
              <h4>📅 Monthly Sequestration Trends (2025)</h4>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={analyticsData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}
                  formatter={(value, name) => {
                    if (name === 'Efficiency') return [`${(value * 100).toFixed(1)}%`, name];
                    return [`${value} tCO₂`, name];
                  }}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="target" 
                  fill={COLORS[3]} 
                  fillOpacity={0.3}
                  stroke={COLORS[3]}
                  name="Monthly Target"
                />
                <Bar 
                  yAxisId="left"
                  dataKey="sequestered" 
                  fill={COLORS[0]} 
                  name="Actual Sequestered"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke={COLORS[4]} 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Efficiency Ratio"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Assessment Radar */}
          <div className="analytics-chart-card">
            <div className="chart-header">
              <h4>⚠️ Portfolio Risk Assessment</h4>
            </div>
            <div className="risk-assessment">
              {analyticsData.riskData.map((risk, index) => (
                <div key={index} className="risk-item">
                  <div className="risk-info">
                    <span className="risk-category">{risk.category}</span>
                    <span className="risk-description">{risk.description}</span>
                  </div>
                  <div className="risk-score">
                    <div className="risk-bar">
                      <div 
                        className={`risk-fill ${
                          risk.score >= 80 ? 'low-risk' : 
                          risk.score >= 60 ? 'medium-risk' : 'high-risk'
                        }`}
                        style={{ width: `${risk.score}%` }}
                      ></div>
                    </div>
                    <span className="risk-value">{risk.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carbon Credit Potential */}
          <div className="analytics-chart-card large">
            <div className="chart-header">
              <h4>🏅 Carbon Credit Generation Potential</h4>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData.creditPotential}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}
                  formatter={(value, name) => [`${value} credits`, name]}
                />
                <Legend />
                <Bar dataKey="current" stackId="credits" fill={COLORS[0]} name="Current Credits" />
                <Bar dataKey="potential" stackId="credits" fill={COLORS[1]} name="Near-term Potential" />
                <Bar dataKey="future" stackId="credits" fill={COLORS[2]} name="Future Potential" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Project Lifecycle Analysis */}
          <div className="analytics-chart-card">
            <div className="chart-header">
              <h4>🌱 Project Lifecycle Distribution</h4>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Planning', value: projects.filter(p => p.status === 'Planning').length, stage: 'early' },
                    { name: 'Active', value: projects.filter(p => p.status === 'Active').length, stage: 'growth' },
                    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, stage: 'mature' }
                  ].filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[{ name: 'Planning' }, { name: 'Active' }, { name: 'Completed' }].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}
                  formatter={(value, name) => [`${value} projects`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="analytics-insights">
          <h4>💡 Key Insights & Recommendations</h4>
          <div className="insights-grid">
            <div className="insight-card positive">
              <div className="insight-icon">✅</div>
              <div className="insight-content">
                <h5>Strong Performance</h5>
                <p>Your portfolio is exceeding industry benchmarks with an average efficiency of {summaryStats.avgSequestrationRate.toFixed(2)} tCO₂/ha/yr, which is 12.5% above the industry average.</p>
              </div>
            </div>
            
            <div className="insight-card warning">
              <div className="insight-icon">⚠️</div>
              <div className="insight-content">
                <h5>Climate Risk Monitoring</h5>
                <p>Consider diversifying project locations and species selection to mitigate moderate climate risks. Implement enhanced monitoring systems for early risk detection.</p>
              </div>
            </div>
            
            <div className="insight-card opportunity">
              <div className="insight-icon">🚀</div>
              <div className="insight-content">
                <h5>Revenue Optimization</h5>
                <p>Current carbon credit generation is below potential. Focus on certification processes to unlock ${((summaryStats.totalSequestration * 0.85 - summaryStats.totalCarbonCredits) * 25 / 1000).toFixed(0)}K in additional revenue.</p>
              </div>
            </div>
            
            <div className="insight-card growth">
              <div className="insight-icon">🌱</div>
              <div className="insight-content">
                <h5>Expansion Opportunity</h5>
                <p>Mixed Forest projects show the highest ROI. Consider expanding this project type to reach the projected 3.6K tCO₂ sequestration target by 2030.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        {activeView === 'analytics' && renderAdvancedAnalytics()}
      </div>

      {showAddProject && renderAddProjectForm()}
    </div>
  );
};

export default SequestrationManager;