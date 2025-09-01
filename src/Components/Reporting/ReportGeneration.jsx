import React, { useState, useEffect } from 'react';
import './ReportGeneration.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area, AreaChart 
} from 'recharts';

// Enhanced report templates
const reportTemplates = [
  {
    id: 'internal-review',
    name: 'Internal Review',
    description: 'Comprehensive internal assessment report',
    icon: '📋',
    sections: ['overview', 'emissions-summary', 'trends', 'recommendations'],
    formats: ['pdf', 'excel', 'powerpoint'],
    estimatedTime: '2-3 minutes',
  },
  {
    id: 'sustainability',
    name: 'Corporate Sustainability',
    description: 'Annual sustainability report for stakeholders',
    icon: '🌱',
    sections: ['executive-summary', 'ghg-inventory', 'progress-tracking', 'future-targets'],
    formats: ['pdf', 'html', 'excel'],
    estimatedTime: '3-4 minutes',
  },
  {
    id: 'auditor-ready',
    name: 'Auditor-Ready',
    description: 'Detailed report meeting audit requirements',
    icon: '🔍',
    sections: ['data-verification', 'methodology', 'detailed-calculations', 'supporting-docs'],
    formats: ['pdf', 'excel'],
    estimatedTime: '4-5 minutes',
  },
  {
    id: 'regulatory',
    name: 'Regulatory Compliance',
    description: 'Government and regulatory body submissions',
    icon: '📜',
    sections: ['compliance-summary', 'emissions-data', 'verification-statement'],
    formats: ['pdf', 'xml', 'csv'],
    estimatedTime: '3-4 minutes',
  },
  {
    id: 'investor',
    name: 'Investor Relations',
    description: 'Financial impact and ESG metrics for investors',
    icon: '📊',
    sections: ['financial-impact', 'esg-metrics', 'risk-assessment', 'opportunities'],
    formats: ['pdf', 'powerpoint'],
    estimatedTime: '3-4 minutes',
  },
  {
    id: 'cdp',
    name: 'CDP Disclosure',
    description: 'Carbon Disclosure Project formatted report',
    icon: '🌍',
    sections: ['governance', 'strategy', 'risk-management', 'metrics-targets'],
    formats: ['excel', 'pdf'],
    estimatedTime: '5-6 minutes',
  },
];

const timePeriods = [
  { id: 'last-quarter', name: 'Last Quarter', description: 'Q3 2024' },
  { id: 'ytd', name: 'Year-to-Date', description: 'Jan - Oct 2024' },
  { id: 'last-12-months', name: 'Last 12 Months', description: 'Nov 2023 - Oct 2024' },
  { id: 'custom', name: 'Custom Range', description: 'Select specific dates' },
];

const emissionScopes = [
  { id: 'all', name: 'All Scopes (1, 2 & 3)', description: 'Complete emission inventory' },
  { id: 'scope-1-2', name: 'Scope 1 & 2', description: 'Direct and indirect emissions' },
  { id: 'scope-1', name: 'Scope 1 Only', description: 'Direct emissions only' },
];

// Sample data for report preview
const sampleEmissionData = [
  { month: 'Jan', scope1: 120, scope2: 80, scope3: 200 },
  { month: 'Feb', scope1: 115, scope2: 85, scope3: 195 },
  { month: 'Mar', scope1: 125, scope2: 75, scope3: 210 },
  { month: 'Apr', scope1: 110, scope2: 90, scope3: 185 },
  { month: 'May', scope1: 108, scope2: 88, scope3: 192 },
  { month: 'Jun', scope1: 105, scope2: 92, scope3: 188 },
];

const COLORS = ['#4cceac', '#00C49F', '#FFBB28', '#FF8042', '#ca71eb', '#8dd1e1'];

const ReportGeneration = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods[1]);
  const [selectedScopes, setSelectedScopes] = useState(emissionScopes[0]);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedSections, setSelectedSections] = useState([]);
  const [reportFilters, setReportFilters] = useState({
    locations: [],
    categories: [],
    includeCharts: true,
    includeRecommendations: true,
    includeProjections: false,
  });
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [reportStats, setReportStats] = useState(null);

  useEffect(() => {
    // Initialize selected sections when template changes
    setSelectedSections(selectedTemplate.sections);
  }, [selectedTemplate]);

  // Calculate report statistics
  useEffect(() => {
    const calculateStats = () => {
      const totalEmissions = sampleEmissionData.reduce((sum, month) => 
        sum + month.scope1 + month.scope2 + month.scope3, 0
      );
      const avgMonthlyEmissions = totalEmissions / sampleEmissionData.length;
      const trend = sampleEmissionData[sampleEmissionData.length - 1].scope1 - sampleEmissionData[0].scope1;
      const trendPercentage = (trend / sampleEmissionData[0].scope1) * 100;
      
      setReportStats({
        totalEmissions: totalEmissions.toFixed(0),
        avgMonthlyEmissions: avgMonthlyEmissions.toFixed(0),
        trendPercentage: trendPercentage.toFixed(1),
        totalDataPoints: sampleEmissionData.length * 3, // 3 scopes per month
        estimatedPages: Math.ceil(selectedSections.length * 1.5 + (reportFilters.includeCharts ? 2 : 0)),
      });
    };

    calculateStats();
  }, [selectedSections, reportFilters]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setActiveStep(2);
  };

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFilterChange = (filterKey, value) => {
    setReportFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const generateReport = async (format) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate report generation
    const stages = [
      'Collecting data...',
      'Processing emissions data...',
      'Generating charts...',
      'Applying template...',
      'Finalizing report...',
    ];
    
    for (let i = 0; i < stages.length; i++) {
      setGenerationProgress(((i + 1) / stages.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Simulate download
    const fileName = `${selectedTemplate.name.replace(/\s+/g, '-').toLowerCase()}-${selectedTimePeriod.id}.${format}`;
    console.log(`Generated report: ${fileName}`);
    
    setIsGenerating(false);
    setGenerationProgress(0);
  };

  const renderTemplateSelection = () => (
    <div className="template-selection-section">
      <div className="section-header">
        <h3>📋 Select Report Template</h3>
        <p>Choose from our pre-built templates or create a custom report</p>
      </div>
      
      <div className="templates-grid">
        {reportTemplates.map(template => (
          <div
            key={template.id}
            className={`template-card enhanced ${selectedTemplate.id === template.id ? 'selected' : ''}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="template-icon">{template.icon}</div>
            <div className="template-info">
              <h4>{template.name}</h4>
              <p>{template.description}</p>
              <div className="template-meta">
                <span className="section-count">{template.sections.length} sections</span>
                <span className="time-estimate">{template.estimatedTime}</span>
              </div>
              <div className="format-badges">
                {template.formats.map(format => (
                  <span key={format} className="format-badge">{format.toUpperCase()}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomization = () => (
    <div className="customization-section">
      <div className="section-header">
        <h3>⚙️ Customize Report Options</h3>
        <p>Configure your report parameters and content sections</p>
      </div>

      <div className="customization-grid">
        <div className="customization-card">
          <h4>⏰ Time Period</h4>
          <div className="period-options">
            {timePeriods.map(period => (
              <label key={period.id} className="period-option">
                <input
                  type="radio"
                  name="timePeriod"
                  checked={selectedTimePeriod.id === period.id}
                  onChange={() => setSelectedTimePeriod(period)}
                />
                <div className="period-info">
                  <span className="period-name">{period.name}</span>
                  <span className="period-description">{period.description}</span>
                </div>
              </label>
            ))}
          </div>
          
          {selectedTimePeriod.id === 'custom' && (
            <div className="custom-date-range">
              <div className="date-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="date-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="customization-card">
          <h4>🌍 Emission Scopes</h4>
          <div className="scope-options">
            {emissionScopes.map(scope => (
              <label key={scope.id} className="scope-option">
                <input
                  type="radio"
                  name="emissionScope"
                  checked={selectedScopes.id === scope.id}
                  onChange={() => setSelectedScopes(scope)}
                />
                <div className="scope-info">
                  <span className="scope-name">{scope.name}</span>
                  <span className="scope-description">{scope.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="customization-card">
          <h4>📑 Report Sections</h4>
          <div className="sections-checklist">
            {selectedTemplate.sections.map(sectionId => {
              const sectionNames = {
                'overview': '📊 Executive Overview',
                'emissions-summary': '🌍 Emissions Summary',
                'trends': '📈 Trend Analysis',
                'recommendations': '💡 Recommendations',
                'executive-summary': '📋 Executive Summary',
                'ghg-inventory': '🔢 GHG Inventory',
                'progress-tracking': '📊 Progress Tracking',
                'future-targets': '🎯 Future Targets',
                'data-verification': '✅ Data Verification',
                'methodology': '🔬 Methodology',
                'detailed-calculations': '🧮 Detailed Calculations',
                'supporting-docs': '📎 Supporting Documents',
                'compliance-summary': '📜 Compliance Summary',
                'emissions-data': '📊 Emissions Data',
                'verification-statement': '✅ Verification Statement',
                'financial-impact': '💰 Financial Impact',
                'esg-metrics': '📈 ESG Metrics',
                'risk-assessment': '⚠️ Risk Assessment',
                'opportunities': '🚀 Opportunities',
                'governance': '🏛️ Governance',
                'strategy': '🎯 Strategy',
                'risk-management': '🛡️ Risk Management',
                'metrics-targets': '📊 Metrics & Targets',
              };
              
              return (
                <label key={sectionId} className="section-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(sectionId)}
                    onChange={() => handleSectionToggle(sectionId)}
                  />
                  <span>{sectionNames[sectionId] || sectionId}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="customization-card">
          <h4>🎨 Report Options</h4>
          <div className="options-checklist">
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={reportFilters.includeCharts}
                onChange={(e) => handleFilterChange('includeCharts', e.target.checked)}
              />
              <span>📊 Include Charts & Visualizations</span>
            </label>
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={reportFilters.includeRecommendations}
                onChange={(e) => handleFilterChange('includeRecommendations', e.target.checked)}
              />
              <span>💡 Include Recommendations</span>
            </label>
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={reportFilters.includeProjections}
                onChange={(e) => handleFilterChange('includeProjections', e.target.checked)}
              />
              <span>🔮 Include Future Projections</span>
            </label>
          </div>
        </div>
      </div>

      <div className="customization-actions">
        <button
          onClick={() => setActiveStep(1)}
          className="step-btn secondary"
        >
          ← Back to Templates
        </button>
        <button
          onClick={() => setActiveStep(3)}
          className="step-btn primary"
          disabled={selectedSections.length === 0}
        >
          Continue to Preview →
        </button>
      </div>
    </div>
  );

  const renderPreviewAndExport = () => (
    <div className="preview-export-section">
      <div className="section-header">
        <h3>👀 Preview & Export</h3>
        <p>Review your report configuration and choose export format</p>
      </div>

      <div className="preview-grid">
        <div className="report-preview-card">
          <h4>📊 Report Preview</h4>
          
          {reportStats && (
            <div className="preview-stats">
              <div className="stat-item">
                <span className="stat-value">{reportStats.totalEmissions}</span>
                <span className="stat-label">Total tCO₂e</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{reportStats.avgMonthlyEmissions}</span>
                <span className="stat-label">Avg Monthly</span>
              </div>
              <div className="stat-item">
                <span className={`stat-value ${parseFloat(reportStats.trendPercentage) >= 0 ? 'negative' : 'positive'}`}>
                  {reportStats.trendPercentage}%
                </span>
                <span className="stat-label">Trend</span>
              </div>
            </div>
          )}

          {reportFilters.includeCharts && (
            <div className="preview-chart">
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={sampleEmissionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip />
                  <Bar dataKey="scope1" stackId="a" fill={COLORS[0]} name="Scope 1" />
                  <Bar dataKey="scope2" stackId="a" fill={COLORS[1]} name="Scope 2" />
                  <Bar dataKey="scope3" stackId="a" fill={COLORS[2]} name="Scope 3" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="preview-sections">
            <h5>Report Sections ({selectedSections.length})</h5>
            <div className="section-list">
              {selectedSections.map(sectionId => (
                <span key={sectionId} className="section-tag">
                  {sectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="export-options-card">
          <h4>📤 Export Options</h4>
          
          <div className="report-summary">
            <div className="summary-item">
              <span className="label">Template:</span>
              <span className="value">{selectedTemplate.name}</span>
            </div>
            <div className="summary-item">
              <span className="label">Period:</span>
              <span className="value">{selectedTimePeriod.name}</span>
            </div>
            <div className="summary-item">
              <span className="label">Scopes:</span>
              <span className="value">{selectedScopes.name}</span>
            </div>
            <div className="summary-item">
              <span className="label">Estimated Pages:</span>
              <span className="value">{reportStats?.estimatedPages || 'N/A'}</span>
            </div>
          </div>

          {isGenerating && (
            <div className="generation-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">Generating report... {generationProgress.toFixed(0)}%</span>
            </div>
          )}

          <div className="export-buttons">
            {selectedTemplate.formats.map(format => (
              <button
                key={format}
                onClick={() => generateReport(format)}
                className={`export-btn ${format}-btn`}
                disabled={isGenerating}
              >
                <span className="btn-icon">
                  {format === 'pdf' && '📄'}
                  {format === 'excel' && '📊'}
                  {format === 'powerpoint' && '📽️'}
                  {format === 'html' && '🌐'}
                  {format === 'csv' && '📈'}
                  {format === 'xml' && '📋'}
                </span>
                Export as {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="preview-actions">
        <button
          onClick={() => setActiveStep(2)}
          className="step-btn secondary"
        >
          ← Back to Customize
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="step-btn tertiary"
        >
          {showPreview ? 'Hide' : 'Show'} Detailed Preview
        </button>
      </div>
    </div>
  );

  return (
    <div className="report-generation-container">
      <header className="page-header enhanced">
        <div className="header-content">
          <h1>📊 Report Generation Center</h1>
          <p>Create comprehensive, customized reports for stakeholders, auditors, and regulatory compliance with advanced filtering and multiple export formats.</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{reportTemplates.length}</span>
            <span className="stat-label">Templates</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{selectedSections.length}</span>
            <span className="stat-label">Sections</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{reportStats?.estimatedPages || 0}</span>
            <span className="stat-label">Est. Pages</span>
          </div>
        </div>
      </header>

      <div className="report-wizard">
        <div className="wizard-navigation">
          <div className={`wizard-step-indicator ${activeStep >= 1 ? 'completed' : ''} ${activeStep === 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Select Template</span>
          </div>
          <div className={`wizard-step-indicator ${activeStep >= 2 ? 'completed' : ''} ${activeStep === 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Customize</span>
          </div>
          <div className={`wizard-step-indicator ${activeStep >= 3 ? 'completed' : ''} ${activeStep === 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Export</span>
          </div>
        </div>

        <div className="wizard-content">
          {activeStep === 1 && renderTemplateSelection()}
          {activeStep === 2 && renderCustomization()}
          {activeStep === 3 && renderPreviewAndExport()}
        </div>
      </div>
    </div>
  );
};

export default ReportGeneration;