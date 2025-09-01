import React, { useState, useRef } from 'react';
import './GHGInventory.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area, AreaChart 
} from 'recharts';

// --- Enhanced Mock Data with More Categories ---
const initialEntries = {
  fuel: [
    { id: 1, date: '2025-08-20', type: 'Diesel', quantity: 5000, unit: 'Litres', emissions: 13.4, location: 'Mine A', equipment: 'Excavator' },
    { id: 2, date: '2025-08-21', type: 'Natural Gas', quantity: 1200, unit: 'Cubic Meters', emissions: 2.3, location: 'Mine B', equipment: 'Generator' },
    { id: 3, date: '2025-08-22', type: 'Diesel', quantity: 7500, unit: 'Litres', emissions: 20.1, location: 'Mine A', equipment: 'Hauler' },
    { id: 4, date: '2025-08-23', type: 'Heavy Fuel Oil', quantity: 2500, unit: 'Litres', emissions: 7.8, location: 'Mine C', equipment: 'Crusher' },
  ],
  fugitive: [
    { id: 1, date: '2025-08-15', production: 25000, unit: 'Tonnes', degree: 'Degree II', emissions: 45.5, location: 'Mine A', seam: 'Upper Seam' },
    { id: 2, date: '2025-08-16', production: 28000, unit: 'Tonnes', degree: 'Degree II', emissions: 51.0, location: 'Mine B', seam: 'Lower Seam' },
    { id: 3, date: '2025-08-17', production: 22000, unit: 'Tonnes', degree: 'Degree III', emissions: 62.8, location: 'Mine A', seam: 'Deep Seam' },
  ],
  electricity: [
    { id: 1, date: '2025-08-20', consumption: 15000, unit: 'kWh', gridFactor: 0.82, emissions: 12.3, location: 'Mine A', source: 'Grid' },
    { id: 2, date: '2025-08-21', consumption: 18500, unit: 'kWh', gridFactor: 0.82, emissions: 15.2, location: 'Mine B', source: 'Grid' },
    { id: 3, date: '2025-08-22', consumption: 25000, unit: 'kWh', gridFactor: 0.04, emissions: 1.0, location: 'Mine C', source: 'Solar' },
  ],
  explosives: [
    { id: 1, date: '2025-08-18', type: 'ANFO', quantity: 2500, unit: 'kg', emissions: 4.2, location: 'Mine A', blastArea: 'North Face' },
    { id: 2, date: '2025-08-19', type: 'Emulsion', quantity: 1800, unit: 'kg', emissions: 3.8, location: 'Mine B', blastArea: 'South Pit' },
  ],
};

// Validation rules for each category
const validationRules = {
  fuel: {
    type: { required: true, message: 'Fuel type is required' },
    quantity: { required: true, min: 0.1, message: 'Quantity must be greater than 0' },
    unit: { required: true, message: 'Unit is required' },
    location: { required: true, message: 'Location is required' },
    equipment: { required: true, message: 'Equipment is required' },
  },
  electricity: {
    consumption: { required: true, min: 0.1, message: 'Consumption must be greater than 0' },
    gridFactor: { required: true, min: 0, max: 2, message: 'Grid factor must be between 0 and 2' },
    location: { required: true, message: 'Location is required' },
    source: { required: true, message: 'Source is required' },
  },
  fugitive: {
    production: { required: true, min: 1, message: 'Production must be greater than 0' },
    degree: { required: true, message: 'Mine gassiness degree is required' },
    location: { required: true, message: 'Location is required' },
    seam: { required: true, message: 'Seam information is required' },
  },
  explosives: {
    type: { required: true, message: 'Explosive type is required' },
    quantity: { required: true, min: 0.1, message: 'Quantity must be greater than 0' },
    location: { required: true, message: 'Location is required' },
    blastArea: { required: true, message: 'Blast area is required' },
  },
};

// Emission factors for calculations
const emissionFactors = {
  fuel: {
    'Diesel': 2.68, // tCO2e per 1000L
    'Natural Gas': 1.91, // tCO2e per 1000m3
    'Heavy Fuel Oil': 3.12, // tCO2e per 1000L
    'Petrol': 2.31, // tCO2e per 1000L
  },
  electricity: {
    'Grid': 0.82, // tCO2e per MWh (India average)
    'Solar': 0.04,
    'Wind': 0.01,
    'Hydro': 0.02,
  },
  explosives: {
    'ANFO': 1.68, // tCO2e per tonne
    'Emulsion': 2.11, // tCO2e per tonne
    'Dynamite': 2.85, // tCO2e per tonne
  },
  fugitive: {
    'Degree I': 0.8, // tCO2e per tonne coal
    'Degree II': 1.8, // tCO2e per tonne coal
    'Degree III': 2.9, // tCO2e per tonne coal
  },
};

// Color scheme for charts
const COLORS = ['#4cceac', '#00C49F', '#FFBB28', '#FF8042', '#ca71eb', '#8dd1e1'];

const GHGInventoryEnhanced = () => {
  const [activeTab, setActiveTab] = useState('fuel');
  const [entries, setEntries] = useState(initialEntries);
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [csvData, setCsvData] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, trends, insights
  const fileInputRef = useRef(null);

  // Calculate emissions based on input data
  const calculateEmissions = (category, data) => {
    switch (category) {
      case 'fuel':
        const fuelFactor = emissionFactors.fuel[data.type] || 2.68;
        return (parseFloat(data.quantity) * fuelFactor / 1000).toFixed(2);
      case 'electricity':
        const gridFactor = parseFloat(data.gridFactor) || 0.82;
        return (parseFloat(data.consumption) * gridFactor / 1000).toFixed(2);
      case 'explosives':
        const explosiveFactor = emissionFactors.explosives[data.type] || 1.68;
        return (parseFloat(data.quantity) * explosiveFactor / 1000).toFixed(2);
      case 'fugitive':
        const fugitiveFactor = emissionFactors.fugitive[data.degree] || 1.8;
        return (parseFloat(data.production) * fugitiveFactor / 1000).toFixed(2);
      default:
        return '0.00';
    }
  };

  // Validate form data
  const validateForm = (category, data) => {
    const rules = validationRules[category];
    const newErrors = {};

    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = data[field];

      if (rule.required && (!value || value === '')) {
        newErrors[field] = rule.message;
      } else if (value) {
        const numValue = parseFloat(value);
        if (rule.min && numValue < rule.min) {
          newErrors[field] = rule.message;
        }
        if (rule.max && numValue > rule.max) {
          newErrors[field] = rule.message;
        }
      }
    });

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm(activeTab, formState);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setErrorMessage('Please fix the validation errors before submitting.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const calculatedEmissions = calculateEmissions(activeTab, formState);
    const newEntry = {
      id: Date.now(),
      date: formState.date || new Date().toISOString().split('T')[0],
      ...formState,
      emissions: parseFloat(calculatedEmissions)
    };

    setEntries(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newEntry]
    }));
    
    setFormState({});
    setErrors({});
    e.target.reset();
    setSuccessMessage(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} entry successfully added! Emissions: ${calculatedEmissions} tCO₂e`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Enhanced analytics
  const currentEntries = entries[activeTab] || [];
  const totalEmissions = currentEntries.reduce((sum, entry) => sum + parseFloat(entry.emissions || 0), 0);
  const largestEntry = currentEntries.length > 0 ? Math.max(...currentEntries.map(e => parseFloat(e.emissions || 0))) : 0;
  const averageEmissions = currentEntries.length > 0 ? (totalEmissions / currentEntries.length) : 0;

  // Location-based breakdown
  const locationBreakdown = currentEntries.reduce((acc, entry) => {
    const location = entry.location || 'Unknown';
    acc[location] = (acc[location] || 0) + parseFloat(entry.emissions || 0);
    return acc;
  }, {});

  const locationData = Object.entries(locationBreakdown).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));

  // Trend analysis
  const trendData = currentEntries
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry, index) => ({
      date: entry.date,
      emissions: parseFloat(entry.emissions || 0),
      cumulative: currentEntries
        .slice(0, index + 1)
        .reduce((sum, e) => sum + parseFloat(e.emissions || 0), 0)
    }));

  const renderFormContent = () => {
    switch (activeTab) {
      case 'fuel':
        return (
          <form onSubmit={handleSubmit} className="inventory-form enhanced">
            <div className="form-header">
              <h4>📢 Fuel Consumption Entry</h4>
              <p>Enter fuel consumption data with automatic emission calculations</p>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Date <span className="required">*</span></label>
                <input 
                  name="date" 
                  type="date" 
                  onChange={handleInputChange} 
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label>Fuel Type <span className="required">*</span></label>
                <select name="type" onChange={handleInputChange} required>
                  <option value="">Select fuel type...</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Natural Gas">Natural Gas</option>
                  <option value="Heavy Fuel Oil">Heavy Fuel Oil</option>
                  <option value="Petrol">Petrol</option>
                </select>
                {errors.type && <span className="error-text">{errors.type}</span>}
              </div>
              <div className="form-group">
                <label>Quantity <span className="required">*</span></label>
                <input 
                  name="quantity" 
                  type="number" 
                  step="0.1"
                  placeholder="e.g., 5000" 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>
              <div className="form-group">
                <label>Unit <span className="required">*</span></label>
                <select name="unit" onChange={handleInputChange} required>
                  <option value="">Select unit...</option>
                  <option value="Litres">Litres</option>
                  <option value="Cubic Meters">Cubic Meters</option>
                </select>
                {errors.unit && <span className="error-text">{errors.unit}</span>}
              </div>
              <div className="form-group">
                <label>Location <span className="required">*</span></label>
                <select name="location" onChange={handleInputChange} required>
                  <option value="">Select location...</option>
                  <option value="Mine A">Mine A</option>
                  <option value="Mine B">Mine B</option>
                  <option value="Mine C">Mine C</option>
                </select>
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>
              <div className="form-group">
                <label>Equipment <span className="required">*</span></label>
                <input 
                  name="equipment" 
                  type="text" 
                  placeholder="e.g., Excavator, Hauler" 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.equipment && <span className="error-text">{errors.equipment}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span>Add Fuel Entry</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </form>
        );
        
      case 'electricity':
        return (
          <form onSubmit={handleSubmit} className="inventory-form enhanced">
            <div className="form-header">
              <h4>⚡ Electricity Consumption Entry</h4>
              <p>Track electricity usage with source-specific emission factors</p>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Date <span className="required">*</span></label>
                <input 
                  name="date" 
                  type="date" 
                  onChange={handleInputChange} 
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Consumption <span className="required">*</span></label>
                <input 
                  name="consumption" 
                  type="number" 
                  step="0.1"
                  placeholder="e.g., 15000" 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.consumption && <span className="error-text">{errors.consumption}</span>}
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" onChange={handleInputChange} defaultValue="kWh">
                  <option value="kWh">kWh</option>
                  <option value="MWh">MWh</option>
                </select>
              </div>
              <div className="form-group">
                <label>Source <span className="required">*</span></label>
                <select name="source" onChange={handleInputChange} required>
                  <option value="">Select energy source...</option>
                  <option value="Grid">Grid</option>
                  <option value="Solar">Solar</option>
                  <option value="Wind">Wind</option>
                  <option value="Hydro">Hydro</option>
                </select>
                {errors.source && <span className="error-text">{errors.source}</span>}
              </div>
              <div className="form-group">
                <label>Grid Factor <span className="required">*</span></label>
                <input 
                  name="gridFactor" 
                  type="number" 
                  step="0.001"
                  placeholder="e.g., 0.82" 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.gridFactor && <span className="error-text">{errors.gridFactor}</span>}
                <small>tCO₂e per MWh</small>
              </div>
              <div className="form-group">
                <label>Location <span className="required">*</span></label>
                <select name="location" onChange={handleInputChange} required>
                  <option value="">Select location...</option>
                  <option value="Mine A">Mine A</option>
                  <option value="Mine B">Mine B</option>
                  <option value="Mine C">Mine C</option>
                </select>
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span>Add Electricity Entry</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </form>
        );
        
      case 'explosives':
        return (
          <form onSubmit={handleSubmit} className="inventory-form enhanced">
            <div className="form-header">
              <h4>💥 Explosives Usage Entry</h4>
              <p>Record explosives consumption for blasting operations</p>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Date <span className="required">*</span></label>
                <input 
                  name="date" 
                  type="date" 
                  onChange={handleInputChange} 
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Explosive Type <span className="required">*</span></label>
                <select name="type" onChange={handleInputChange} required>
                  <option value="">Select explosive type...</option>
                  <option value="ANFO">ANFO</option>
                  <option value="Emulsion">Emulsion</option>
                  <option value="Dynamite">Dynamite</option>
                </select>
                {errors.type && <span className="error-text">{errors.type}</span>}
              </div>
              <div className="form-group">
                <label>Quantity <span className="required">*</span></label>
                <input 
                  name="quantity" 
                  type="number" 
                  step="0.1"
                  placeholder="e.g., 2500" 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" onChange={handleInputChange} defaultValue="kg">
                  <option value="kg">kg</option>
                  <option value="tonnes">tonnes</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location <span className="required">*</span></label>
                <select name="location" onChange={handleInputChange} required>
                  <option value="">Select location...</option>
                  <option value="Mine A">Mine A</option>
                  <option value="Mine B">Mine B</option>
                  <option value="Mine C">Mine C</option>
                </select>
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>
              <div className="form-group">
                <label>Blast Area <span className="required">*</span></label>
                <input 
                  name="blastArea" 
                  type="text" 
                  placeholder="e.g., North Face, South Pit" 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.blastArea && <span className="error-text">{errors.blastArea}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span>Add Explosives Entry</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </form>
        );
        
      case 'fugitive':
        return (
          <form onSubmit={handleSubmit} className="inventory-form enhanced">
            <div className="form-header">
              <h4>🌫️ Fugitive Methane Entry</h4>
              <p>Track methane emissions from coal mining operations</p>
            </div>
            <div className="tier-prompt">
              <p><strong>💡 Tier 2/3 Data Unlocks Higher Accuracy.</strong></p>
              <p>Provide detailed mine-specific parameters for more precise emission factors.</p>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Date <span className="required">*</span></label>
                <input 
                  name="date" 
                  type="date" 
                  onChange={handleInputChange} 
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Coal Production <span className="required">*</span></label>
                <input 
                  name="production" 
                  type="number" 
                  step="1"
                  placeholder="e.g., 25000" 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.production && <span className="error-text">{errors.production}</span>}
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" onChange={handleInputChange} defaultValue="Tonnes">
                  <option value="Tonnes">Tonnes</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mine Gassiness Degree <span className="required">*</span></label>
                <select name="degree" onChange={handleInputChange} required>
                  <option value="">Select degree...</option>
                  <option value="Degree I">Degree I</option>
                  <option value="Degree II">Degree II</option>
                  <option value="Degree III">Degree III</option>
                </select>
                {errors.degree && <span className="error-text">{errors.degree}</span>}
              </div>
              <div className="form-group">
                <label>Location <span className="required">*</span></label>
                <select name="location" onChange={handleInputChange} required>
                  <option value="">Select location...</option>
                  <option value="Mine A">Mine A</option>
                  <option value="Mine B">Mine B</option>
                  <option value="Mine C">Mine C</option>
                </select>
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>
              <div className="form-group">
                <label>Seam Information <span className="required">*</span></label>
                <input 
                  name="seam" 
                  type="text" 
                  placeholder="e.g., Upper Seam, Lower Seam" 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.seam && <span className="error-text">{errors.seam}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span>Add Fugitive Data</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </form>
        );
        
      default:
        return <p className="no-data-message">Select a category to enter data.</p>;
    }
  };

  const renderAnalyticsContent = () => {
    switch (viewMode) {
      case 'trends':
        return (
          <div className="analytics-content">
            <h3>📈 Emission Trends & Patterns</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    border: '1px solid var(--border-color)' 
                  }}
                />
                <Legend />
                <Bar dataKey="emissions" fill={COLORS[0]} name="Daily Emissions (tCO₂e)" />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke={COLORS[1]} 
                  strokeWidth={2}
                  name="Cumulative Emissions (tCO₂e)" 
                />
              </ComposedChart>
            </ResponsiveContainer>
            
            {locationData.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h4>🗺️ Emissions by Location</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={locationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)} tCO₂e`}
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
        
      case 'insights':
        return (
          <div className="analytics-content">
            <h3>🔍 Data Insights & Anomalies</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>📊 Statistical Summary</h4>
                <ul>
                  <li><strong>Total Entries:</strong> {currentEntries.length}</li>
                  <li><strong>Total Emissions:</strong> {totalEmissions.toFixed(2)} tCO₂e</li>
                  <li><strong>Average per Entry:</strong> {averageEmissions.toFixed(2)} tCO₂e</li>
                  <li><strong>Largest Single Entry:</strong> {largestEntry.toFixed(2)} tCO₂e</li>
                </ul>
              </div>
              
              <div className="insight-card">
                <h4>⚠️ Data Quality Checks</h4>
                <ul>
                  <li><strong>Missing Locations:</strong> {currentEntries.filter(e => !e.location).length}</li>
                  <li><strong>Zero Emissions:</strong> {currentEntries.filter(e => parseFloat(e.emissions || 0) === 0).length}</li>
                  <li><strong>Recent Entries (7 days):</strong> {currentEntries.filter(e => {
                    const entryDate = new Date(e.date);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return entryDate >= sevenDaysAgo;
                  }).length}</li>
                </ul>
              </div>
              
              {activeTab === 'fuel' && (
                <div className="insight-card">
                  <h4>⛽ Fuel-Specific Insights</h4>
                  <ul>
                    <li><strong>Most Used Fuel:</strong> {currentEntries.reduce((acc, entry) => {
                      acc[entry.type] = (acc[entry.type] || 0) + parseFloat(entry.quantity || 0);
                      return acc;
                    }, {})} </li>
                    <li><strong>Efficiency Trend:</strong> Improving 📈</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={currentEntries.slice(-10)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}/>
              <Legend />
              <Bar dataKey="emissions" fill="var(--accent-primary)" name="Emissions (tCO₂e)" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderTableContent = () => {
    const getTableHeaders = () => {
      const baseHeaders = ['Date'];
      switch (activeTab) {
        case 'fuel':
          return [...baseHeaders, 'Type', 'Quantity', 'Unit', 'Location', 'Equipment', 'Emissions (tCO₂e)', 'Actions'];
        case 'electricity':
          return [...baseHeaders, 'Consumption', 'Unit', 'Source', 'Location', 'Grid Factor', 'Emissions (tCO₂e)', 'Actions'];
        case 'explosives':
          return [...baseHeaders, 'Type', 'Quantity', 'Unit', 'Location', 'Blast Area', 'Emissions (tCO₂e)', 'Actions'];
        case 'fugitive':
          return [...baseHeaders, 'Production', 'Unit', 'Degree', 'Location', 'Seam', 'Emissions (tCO₂e)', 'Actions'];
        default:
          return [...baseHeaders, 'Emissions (tCO₂e)', 'Actions'];
      }
    };

    const renderTableRow = (entry) => {
      const baseData = [entry.date];
      
      switch (activeTab) {
        case 'fuel':
          return [...baseData, entry.type, entry.quantity, entry.unit, entry.location, entry.equipment, parseFloat(entry.emissions).toFixed(2)];
        case 'electricity':
          return [...baseData, entry.consumption, entry.unit, entry.source, entry.location, entry.gridFactor, parseFloat(entry.emissions).toFixed(2)];
        case 'explosives':
          return [...baseData, entry.type, entry.quantity, entry.unit, entry.location, entry.blastArea, parseFloat(entry.emissions).toFixed(2)];
        case 'fugitive':
          return [...baseData, entry.production, entry.unit, entry.degree, entry.location, entry.seam, parseFloat(entry.emissions).toFixed(2)];
        default:
          return [...baseData, parseFloat(entry.emissions).toFixed(2)];
      }
    };

    return (
      <div className="table-responsive">
        <table className="data-table enhanced">
          <thead>
            <tr>
              {getTableHeaders().map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? currentEntries.map(entry => (
              <tr key={entry.id}>
                {renderTableRow(entry).map((cell, index) => (
                  <td key={index} className={index === renderTableRow(entry).length - 1 ? 'emissions-cell' : ''}>
                    {cell}
                  </td>
                ))}
                <td>
                  <button 
                    onClick={() => {
                      setItemToDelete(entry);
                      setShowDeleteModal(true);
                    }} 
                    className="delete-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={getTableHeaders().length} className="no-data-message">
                  No data entries for this category yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="ghg-inventory-container">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this entry? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="modal-btn cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (itemToDelete) {
                    setEntries(prev => ({
                      ...prev,
                      [activeTab]: prev[activeTab].filter(entry => entry.id !== itemToDelete.id)
                    }));
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                    setSuccessMessage('Entry deleted successfully.');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  }
                }} 
                className="modal-btn confirm-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="page-header enhanced">
        <div className="header-content">
          <h1>🌍 GHG Inventory Explorer</h1>
          <p>Enter, track, and analyze emissions data from all operational sources with advanced validation and insights.</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowBulkImport(true)} 
            className="bulk-import-btn"
          >
            📊 Bulk Import
          </button>
        </div>
      </header>

      {/* Success/Error Messages */}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <div className="inventory-main-grid enhanced">
        {/* Data Entry Section */}
        <div className="inventory-data-entry-card">
          <div className="tabs enhanced">
            <button 
              onClick={() => setActiveTab('fuel')} 
              className={activeTab === 'fuel' ? 'active' : ''}
            >
              ⛽ Fuel
            </button>
            <button 
              onClick={() => setActiveTab('electricity')} 
              className={activeTab === 'electricity' ? 'active' : ''}
            >
              ⚡ Electricity
            </button>
            <button 
              onClick={() => setActiveTab('fugitive')} 
              className={activeTab === 'fugitive' ? 'active' : ''}
            >
              🌫️ Fugitive Methane
            </button>
            <button 
              onClick={() => setActiveTab('explosives')} 
              className={activeTab === 'explosives' ? 'active' : ''}
            >
              💥 Explosives
            </button>
          </div>
          <div className="form-content-wrapper">
            {renderFormContent()}
          </div>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="inventory-analysis-card">
          <div className="analysis-header">
            <h3>📊 Live Analysis: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            <div className="view-mode-selector">
              <button 
                onClick={() => setViewMode('table')} 
                className={viewMode === 'table' ? 'active' : ''}
              >
                Table
              </button>
              <button 
                onClick={() => setViewMode('trends')} 
                className={viewMode === 'trends' ? 'active' : ''}
              >
                Trends
              </button>
              <button 
                onClick={() => setViewMode('insights')} 
                className={viewMode === 'insights' ? 'active' : ''}
              >
                Insights
              </button>
            </div>
          </div>
          {renderAnalyticsContent()}
        </div>

        {/* Enhanced Summary Cards */}
        <div className="inventory-summary-section">
          <div className="summary-card">
            <div className="summary-icon">🎯</div>
            <div className="summary-content">
              <h4>Total Emissions</h4>
              <p className="summary-value">{totalEmissions.toFixed(2)} <span>tCO₂e</span></p>
              <p className="summary-change">+2.3% from last period</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">📈</div>
            <div className="summary-content">
              <h4>Data Entries</h4>
              <p className="summary-value">{currentEntries.length} <span>entries</span></p>
              <p className="summary-change">+{currentEntries.length > 0 ? currentEntries.length - Math.floor(currentEntries.length * 0.8) : 0} this period</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">⚡</div>
            <div className="summary-content">
              <h4>Average Emissions</h4>
              <p className="summary-value">{averageEmissions.toFixed(2)} <span>tCO₂e</span></p>
              <p className="summary-change">per entry</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">⚠️</div>
            <div className="summary-content">
              <h4>Largest Entry</h4>
              <p className="summary-value">{largestEntry.toFixed(2)} <span>tCO₂e</span></p>
              <p className="summary-change">single entry</p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="inventory-table-card">
          <div className="table-header">
            <h3>📋 Recent Entries: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            <div className="table-actions">
              <button className="export-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Export CSV
              </button>
            </div>
          </div>
          {renderTableContent()}
        </div>
      </div>
    </div>
  );
};

export default GHGInventoryEnhanced;
