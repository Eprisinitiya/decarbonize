import React, { useState } from 'react';
import './GHGInventory.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Mock Data ---
const initialEntries = {
  fuel: [
    { id: 1, date: '2025-08-20', type: 'Diesel', quantity: 5000, unit: 'Litres', emissions: 13.4 },
    { id: 2, date: '2025-08-21', type: 'Natural Gas', quantity: 1200, unit: 'Cubic Meters', emissions: 2.3 },
    { id: 3, date: '2025-08-22', type: 'Diesel', quantity: 7500, unit: 'Litres', emissions: 20.1 },
  ],
  fugitive: [
    { id: 1, date: '2025-08-15', production: 25000, unit: 'Tonnes', degree: 'Degree II', emissions: 45.5 },
    { id: 2, date: '2025-08-16', production: 28000, unit: 'Tonnes', degree: 'Degree II', emissions: 51.0 },
  ],
  electricity: [], // Start empty to show adding data
  explosives: [],
};

const GHGInventory = () => {
  const [activeTab, setActiveTab] = useState('fuel');
  const [entries, setEntries] = useState(initialEntries);
  const [formState, setFormState] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...formState,
      emissions: (Math.random() * 20 + 5).toFixed(1)
    };
    setEntries(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newEntry]
    }));
    setFormState({});
    e.target.reset();
    setSuccessMessage('Data entry successfully added!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteClick = (entry) => {
    setItemToDelete(entry);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setEntries(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(entry => entry.id !== itemToDelete.id)
      }));
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const currentEntries = entries[activeTab] || [];
  const totalEmissions = currentEntries.reduce((sum, entry) => sum + parseFloat(entry.emissions), 0).toFixed(1);
  const largestEntry = currentEntries.length > 0 ? Math.max(...currentEntries.map(e => e.emissions)) : 0;

  const renderFormContent = () => {
    // ... (form rendering logic remains the same)
    switch (activeTab) {
      case 'fuel':
        return (
          <form onSubmit={handleSubmit} className="inventory-form">
            <div className="form-grid">
              <div className="form-group"><label>Fuel Type</label><select name="type" onChange={handleInputChange} required><option value="">Select...</option><option>Diesel</option><option>Natural Gas</option></select></div>
              <div className="form-group"><label>Quantity</label><input name="quantity" type="number" placeholder="e.g., 5000" onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Unit</label><select name="unit" onChange={handleInputChange} required><option value="">Select...</option><option>Litres</option><option>Cubic Meters</option></select></div>
            </div>
            <button type="submit" className="submit-btn">Add Fuel Entry</button>
          </form>
        );
      case 'fugitive':
        return (
          <form onSubmit={handleSubmit} className="inventory-form">
            <div className="tier-prompt"><p><strong>Tier 2/3 Data Unlocks Higher Accuracy.</strong></p></div>
            <div className="form-grid">
              <div className="form-group"><label>Coal Production</label><input name="production" type="number" placeholder="e.g., 25000" onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Unit</label><select name="unit" onChange={handleInputChange} required><option>Tonnes</option></select></div>
              <div className="form-group"><label>Mine Gassiness Degree</label><input name="degree" type="text" placeholder="e.g., Degree II" onChange={handleInputChange} required /></div>
            </div>
            <button type="submit" className="submit-btn">Add Fugitive Data</button>
          </form>
        );
      default:
        return <p className="no-data-message">Select a category to enter data.</p>;
    }
  };

  return (
    <div className="page-container">
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this entry? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="modal-btn cancel-btn">Cancel</button>
              <button onClick={confirmDelete} className="modal-btn confirm-btn">Delete</button>
            </div>
          </div>
        </div>
      )}

      <header className="page-header">
        <h1>GHG Inventory Explorer</h1>
        <p>Enter, track, and analyze emissions data from all operational sources.</p>
      </header>

      {successMessage && <div className="success-banner">{successMessage}</div>}

      <div className="inventory-main-grid">
        <div className="inventory-data-entry-card">
          <div className="tabs">
            <button onClick={() => setActiveTab('fuel')} className={activeTab === 'fuel' ? 'active' : ''}>Fuel</button>
            <button onClick={() => setActiveTab('electricity')} className={activeTab === 'electricity' ? 'active' : ''}>Electricity</button>
            <button onClick={() => setActiveTab('fugitive')} className={activeTab === 'fugitive' ? 'active' : ''}>Fugitive Methane</button>
            <button onClick={() => setActiveTab('explosives')} className={activeTab === 'explosives' ? 'active' : ''}>Explosives</button>
          </div>
          <div className="form-content-wrapper">
            {renderFormContent()}
          </div>
        </div>

        <div className="inventory-analysis-card">
          <h3>Live Analysis: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={currentEntries} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }}/>
              <Legend />
              <Bar dataKey="emissions" fill="var(--accent-primary)" name={`Emissions (tCO₂e)`} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="inventory-snapshot-card">
            <h3>Category Snapshot</h3>
            <div className="snapshot-grid">
                <div className="snapshot-item">
                    <span>Total Emissions</span>
                    <strong>{totalEmissions} tCO₂e</strong>
                </div>
                <div className="snapshot-item">
                    <span>Data Entries</span>
                    <strong>{currentEntries.length}</strong>
                </div>
                <div className="snapshot-item">
                    <span>Largest Entry</span>
                    <strong>{largestEntry} tCO₂e</strong>
                </div>
            </div>
        </div>

        <div className="inventory-table-card">
          <h3>Recent Entries: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  {activeTab === 'fuel' && <><th>Type</th><th>Quantity</th><th>Unit</th></>}
                  {activeTab === 'fugitive' && <><th>Production</th><th>Unit</th><th>Degree</th></>}
                  <th>Emissions (tCO₂e)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? currentEntries.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    {activeTab === 'fuel' && <><td>{entry.type}</td><td>{entry.quantity}</td><td>{entry.unit}</td></>}
                    {activeTab === 'fugitive' && <><td>{entry.production}</td><td>{entry.unit}</td><td>{entry.degree}</td></>}
                    <td className="emissions-cell">{entry.emissions}</td>
                    <td>
                      <button onClick={() => handleDeleteClick(entry)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="no-data-message">No data entries for this category yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GHGInventory;