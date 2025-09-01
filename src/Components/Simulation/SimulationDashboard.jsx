import React, { useState, useEffect } from 'react';
import './SimulationDashboard.css';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart 
} from 'recharts';

// Enhanced simulation data and configurations
const COLORS = ['#4cceac', '#00C49F', '#FFBB28', '#FF8042', '#ca71eb', '#8dd1e1'];

const mitigationLevers = [
  {
    id: 'fleet-electric',
    name: 'Fleet Electrification',
    description: 'Replace diesel vehicles with electric alternatives',
    category: 'Transportation',
    icon: '🚗',
    impactRange: { min: 15, max: 35 }, // % emission reduction
    costRange: { min: 500000, max: 2000000 },
    timeline: { min: 2, max: 8 }, // years to implement
    prerequisites: [],
  },
  {
    id: 'renewable-energy',
    name: 'Renewable Energy',
    description: 'Solar and wind power installation',
    category: 'Energy',
    icon: '☀️',
    impactRange: { min: 20, max: 45 },
    costRange: { min: 800000, max: 3500000 },
    timeline: { min: 1, max: 5 },
    prerequisites: [],
  },
  {
    id: 'methane-capture',
    name: 'Methane Capture',
    description: 'Capture and utilize fugitive methane emissions',
    category: 'Process',
    icon: '🌫️',
    impactRange: { min: 25, max: 60 },
    costRange: { min: 1200000, max: 4000000 },
    timeline: { min: 3, max: 7 },
    prerequisites: [],
  },
  {
    id: 'operational-efficiency',
    name: 'Operational Efficiency',
    description: 'Process optimization and energy efficiency',
    category: 'Operations',
    icon: '⚙️',
    impactRange: { min: 10, max: 25 },
    costRange: { min: 200000, max: 800000 },
    timeline: { min: 1, max: 3 },
    prerequisites: [],
  },
  {
    id: 'carbon-sequestration',
    name: 'Carbon Sequestration',
    description: 'Carbon capture and storage technology',
    category: 'Technology',
    icon: '🌱',
    impactRange: { min: 30, max: 70 },
    costRange: { min: 2000000, max: 8000000 },
    timeline: { min: 4, max: 10 },
    prerequisites: [],
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Optimization',
    description: 'Reduce transportation and logistics emissions',
    category: 'Logistics',
    icon: '🚚',
    impactRange: { min: 8, max: 20 },
    costRange: { min: 150000, max: 600000 },
    timeline: { min: 1, max: 4 },
    prerequisites: [],
  },
];

const scenarioTemplates = [
  {
    id: 'aggressive',
    name: 'Aggressive Decarbonization',
    description: 'Maximum emission reduction with high investment',
    levers: ['fleet-electric', 'renewable-energy', 'methane-capture', 'carbon-sequestration'],
    targetReduction: 70,
  },
  {
    id: 'balanced',
    name: 'Balanced Approach',
    description: 'Moderate emission reduction with balanced costs',
    levers: ['renewable-energy', 'operational-efficiency', 'supply-chain'],
    targetReduction: 40,
  },
  {
    id: 'cost-effective',
    name: 'Cost-Effective',
    description: 'Maximum ROI with minimal upfront investment',
    levers: ['operational-efficiency', 'supply-chain'],
    targetReduction: 25,
  },
];

// Generate baseline emission data
const generateBaselineData = () => {
  const currentYear = new Date().getFullYear();
  const data = [];
  let baseEmissions = 1000; // Base emissions in tCO2e
  
  for (let i = 0; i <= 10; i++) {
    const year = currentYear + i;
    const businessAsUsual = baseEmissions + (i * 20); // Gradual increase
    data.push({
      year: year.toString(),
      businessAsUsual,
      scenario: businessAsUsual, // Will be modified by scenario
    });
  }
  return data;
};

const SimulationDashboard = () => {
  const [activeScenario, setActiveScenario] = useState('custom');
  const [selectedLevers, setSelectedLevers] = useState([]);
  const [leverParameters, setLeverParameters] = useState({});
  const [simulationData, setSimulationData] = useState(generateBaselineData());
  const [simulationResults, setSimulationResults] = useState(null);
  const [activeTab, setActiveTab] = useState('builder'); // builder, comparison, analysis
  const [showLeverModal, setShowLeverModal] = useState(false);
  const [activeLever, setActiveLever] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  // Calculate scenario impact
  const calculateScenarioImpact = () => {
    if (selectedLevers.length === 0) return simulationData;
    
    const newData = simulationData.map((point, index) => {
      let totalReduction = 0;
      let cumulativeReduction = 0;
      
      selectedLevers.forEach(leverId => {
        const lever = mitigationLevers.find(l => l.id === leverId);
        const params = leverParameters[leverId] || {};
        
        // Calculate when this lever starts affecting emissions
        const implementationYear = params.startYear || 1;
        if (index >= implementationYear) {
          const maxImpact = params.impact || lever.impactRange.max;
          const yearsSinceStart = index - implementationYear + 1;
          const rampUpPeriod = Math.min(3, lever.timeline.max);
          const effectiveness = Math.min(1, yearsSinceStart / rampUpPeriod);
          
          totalReduction += (maxImpact * effectiveness) / 100;
        }
      });
      
      cumulativeReduction = Math.min(0.8, totalReduction); // Cap at 80% reduction
      const scenarioEmissions = point.businessAsUsual * (1 - cumulativeReduction);
      
      return {
        ...point,
        scenario: Math.max(0, scenarioEmissions),
        reduction: cumulativeReduction * 100,
      };
    });
    
    return newData;
  };

  // Run simulation
  const runSimulation = async () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    
    // Simulate processing time
    for (let i = 0; i <= 100; i += 10) {
      setSimulationProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const newData = calculateScenarioImpact();
    setSimulationData(newData);
    
    // Calculate financial metrics
    const totalInvestment = selectedLevers.reduce((sum, leverId) => {
      const lever = mitigationLevers.find(l => l.id === leverId);
      const params = leverParameters[leverId] || {};
      return sum + (params.investment || lever.costRange.max);
    }, 0);
    
    const totalEmissionReduction = newData.reduce((sum, point) => {
      return sum + (point.businessAsUsual - point.scenario);
    }, 0);
    
    const carbonPrice = 50; // $50 per tCO2e
    const carbonValue = totalEmissionReduction * carbonPrice;
    const npv = carbonValue - totalInvestment;
    const irr = npv > 0 ? (carbonValue / totalInvestment - 1) * 100 : -10;
    const paybackPeriod = totalInvestment / (carbonValue / 10);
    
    setSimulationResults({
      totalInvestment,
      totalEmissionReduction,
      carbonValue,
      npv,
      irr,
      paybackPeriod,
      averageAnnualReduction: totalEmissionReduction / 10,
    });
    
    setIsSimulating(false);
  };

  // Load scenario template
  const loadScenarioTemplate = (templateId) => {
    const template = scenarioTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedLevers(template.levers);
      const newParams = {};
      template.levers.forEach(leverId => {
        const lever = mitigationLevers.find(l => l.id === leverId);
        newParams[leverId] = {
          impact: lever.impactRange.max,
          investment: lever.costRange.min,
          startYear: 1,
        };
      });
      setLeverParameters(newParams);
      setActiveScenario(templateId);
    }
  };

  // Add lever to scenario
  const addLever = (lever) => {
    if (!selectedLevers.includes(lever.id)) {
      setSelectedLevers([...selectedLevers, lever.id]);
      setLeverParameters({
        ...leverParameters,
        [lever.id]: {
          impact: lever.impactRange.max,
          investment: lever.costRange.min,
          startYear: 1,
        }
      });
    }
  };

  // Remove lever from scenario
  const removeLever = (leverId) => {
    setSelectedLevers(selectedLevers.filter(id => id !== leverId));
    const newParams = { ...leverParameters };
    delete newParams[leverId];
    setLeverParameters(newParams);
  };

  // Update lever parameters
  const updateLeverParameter = (leverId, parameter, value) => {
    setLeverParameters({
      ...leverParameters,
      [leverId]: {
        ...leverParameters[leverId],
        [parameter]: value,
      }
    });
  };

  useEffect(() => {
    if (selectedLevers.length > 0) {
      runSimulation();
    }
  }, [selectedLevers, leverParameters]);

  const renderScenarioBuilder = () => (
    <div className="scenario-builder-section">
      <div className="builder-header">
        <h3>🎯 Scenario Builder</h3>
        <div className="scenario-templates">
          <label>Quick Templates:</label>
          <div className="template-buttons">
            {scenarioTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => loadScenarioTemplate(template.id)}
                className={`template-btn ${activeScenario === template.id ? 'active' : ''}`}
                title={template.description}
              >
                {template.name}
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedLevers([]);
                setLeverParameters({});
                setActiveScenario('custom');
              }}
              className={`template-btn ${activeScenario === 'custom' ? 'active' : ''}`}
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      <div className="builder-content">
        <div className="available-levers">
          <h4>Available Mitigation Levers</h4>
          <div className="levers-grid">
            {mitigationLevers.map(lever => (
              <div
                key={lever.id}
                className={`lever-card ${selectedLevers.includes(lever.id) ? 'selected' : ''}`}
                onClick={() => selectedLevers.includes(lever.id) ? removeLever(lever.id) : addLever(lever)}
              >
                <div className="lever-icon">{lever.icon}</div>
                <div className="lever-info">
                  <h5>{lever.name}</h5>
                  <p>{lever.description}</p>
                  <div className="lever-stats">
                    <span className="impact">Impact: {lever.impactRange.min}-{lever.impactRange.max}%</span>
                    <span className="cost">Cost: ${(lever.costRange.min / 1000).toFixed(0)}K-${(lever.costRange.max / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div className="lever-category">{lever.category}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedLevers.length > 0 && (
          <div className="selected-levers">
            <h4>Selected Levers ({selectedLevers.length})</h4>
            <div className="selected-levers-list">
              {selectedLevers.map(leverId => {
                const lever = mitigationLevers.find(l => l.id === leverId);
                const params = leverParameters[leverId] || {};
                return (
                  <div key={leverId} className="selected-lever-item">
                    <div className="lever-header">
                      <span className="lever-name">
                        {lever.icon} {lever.name}
                      </span>
                      <button
                        onClick={() => removeLever(leverId)}
                        className="remove-lever-btn"
                      >
                        ×
                      </button>
                    </div>
                    <div className="lever-params">
                      <div className="param-group">
                        <label>Impact (%): {params.impact || lever.impactRange.max}</label>
                        <input
                          type="range"
                          min={lever.impactRange.min}
                          max={lever.impactRange.max}
                          value={params.impact || lever.impactRange.max}
                          onChange={(e) => updateLeverParameter(leverId, 'impact', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="param-group">
                        <label>Investment ($): {(params.investment || lever.costRange.min).toLocaleString()}</label>
                        <input
                          type="range"
                          min={lever.costRange.min}
                          max={lever.costRange.max}
                          step={10000}
                          value={params.investment || lever.costRange.min}
                          onChange={(e) => updateLeverParameter(leverId, 'investment', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="param-group">
                        <label>Start Year: {params.startYear || 1}</label>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={params.startYear || 1}
                          onChange={(e) => updateLeverParameter(leverId, 'startYear', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={runSimulation}
              className="run-simulation-btn"
              disabled={isSimulating}
            >
              {isSimulating ? `Running... ${simulationProgress}%` : '🚀 Run Simulation'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderComparisonDashboard = () => (
    <div className="comparison-section">
      <h3>📊 Scenario Comparison</h3>
      
      <div className="comparison-charts">
        <div className="emission-trajectory-chart">
          <h4>Emission Trajectory</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={simulationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="year" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  border: '1px solid var(--border-color)' 
                }}
                formatter={(value, name) => [
                  `${value.toFixed(0)} tCO₂e`, 
                  name === 'businessAsUsual' ? 'Business as Usual' : 'Scenario'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="businessAsUsual" 
                stroke={COLORS[3]} 
                strokeWidth={2}
                name="Business as Usual"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="scenario" 
                stroke={COLORS[0]} 
                strokeWidth={3}
                name="Scenario"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {simulationResults && (
          <div className="financial-metrics">
            <h4>Financial Impact</h4>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">${(simulationResults.totalInvestment / 1000000).toFixed(1)}M</div>
                <div className="metric-label">Total Investment</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{simulationResults.totalEmissionReduction.toFixed(0)}</div>
                <div className="metric-label">tCO₂e Reduced</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">${(simulationResults.npv / 1000000).toFixed(1)}M</div>
                <div className="metric-label">NPV</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{simulationResults.irr.toFixed(1)}%</div>
                <div className="metric-label">IRR</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{simulationResults.paybackPeriod.toFixed(1)}</div>
                <div className="metric-label">Payback (Years)</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{simulationResults.averageAnnualReduction.toFixed(0)}</div>
                <div className="metric-label">Annual Reduction</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="analysis-section">
      <h3>🔬 Sensitivity Analysis</h3>
      
      <div className="analysis-content">
        <div className="sensitivity-chart">
          <h4>Parameter Sensitivity</h4>
          <div className="sensitivity-info">
            <p>This section shows how changes in key parameters affect scenario outcomes:</p>
            <ul>
              <li><strong>Carbon Price Impact:</strong> How carbon pricing affects ROI</li>
              <li><strong>Technology Cost Sensitivity:</strong> Impact of technology cost variations</li>
              <li><strong>Implementation Timeline:</strong> Effect of delayed implementation</li>
            </ul>
          </div>
        </div>
        
        <div className="risk-assessment">
          <h4>Risk Assessment</h4>
          <div className="risk-factors">
            <div className="risk-item">
              <span className="risk-level high">High</span>
              <span className="risk-desc">Technology adoption delays</span>
            </div>
            <div className="risk-item">
              <span className="risk-level medium">Medium</span>
              <span className="risk-desc">Regulatory changes</span>
            </div>
            <div className="risk-item">
              <span className="risk-level low">Low</span>
              <span className="risk-desc">Market volatility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="simulation-dashboard-container">
      <header className="page-header enhanced">
        <div className="header-content">
          <h1>🎯 Simulation & Scenario Dashboard</h1>
          <p>Model and compare different decarbonization strategies with advanced scenario planning and financial analysis.</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{selectedLevers.length}</span>
            <span className="stat-label">Active Levers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{simulationResults ? simulationResults.totalEmissionReduction.toFixed(0) : '0'}</span>
            <span className="stat-label">tCO₂e Reduction</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{simulationResults ? `$${(simulationResults.npv / 1000000).toFixed(1)}M` : '$0M'}</span>
            <span className="stat-label">NPV</span>
          </div>
        </div>
      </header>

      <div className="simulation-tabs">
        <button
          onClick={() => setActiveTab('builder')}
          className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
        >
          🎯 Scenario Builder
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
        >
          📊 Comparison
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
        >
          🔬 Analysis
        </button>
      </div>

      <div className="simulation-content">
        {activeTab === 'builder' && renderScenarioBuilder()}
        {activeTab === 'comparison' && renderComparisonDashboard()}
        {activeTab === 'analysis' && renderAnalysis()}
      </div>
    </div>
  );
};

export default SimulationDashboard;