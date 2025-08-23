import React, { useState } from 'react';
import './GHGInventory.css';

const GHGInventory = () => {
  const [activeTab, setActiveTab] = useState('fuel');

  const renderFormContent = () => {
    switch (activeTab) {
      case 'fuel':
        return (
          <form className="inventory-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Fuel Type</label>
                <select><option>Diesel</option><option>Natural Gas</option></select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" placeholder="e.g., 5000" />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select><option>Litres</option><option>Cubic Meters</option></select>
              </div>
            </div>
            <button type="submit" className="submit-btn">Add Fuel Entry</button>
          </form>
        );
      case 'fugitive':
        return (
          <form className="inventory-form">
            <div className="tier-prompt">
                <p><strong>Tier 2/3 Data Unlocks Higher Accuracy.</strong> Please provide additional details if available.</p>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Coal Production</label>
                <input type="number" placeholder="e.g., 25000" />
              </div>
              <div className="form-group">
                <label>Unit</label>
                 <select><option>Tonnes</option></select>
              </div>
              <div className="form-group">
                <label>Mine Gassiness Degree</label>
                <input type="text" placeholder="e.g., Degree II" />
              </div>
            </div>
            <button type="submit" className="submit-btn">Add Fugitive Data</button>
          </form>
        );
      // Add cases for 'electricity', 'explosives', etc.
      default:
        return <p>Select a category to enter data.</p>;
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>GHG Inventory Explorer</h1>
        <p>Enter and analyze emissions data from all sources.</p>
      </header>
      <div className="inventory-layout">
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
           <h3>Live Analysis</h3>
           <div className="chart-placeholder-large">[Bar chart of Emissions by Activity]</div>
        </div>
      </div>
    </div>
  );
};

export default GHGInventory;