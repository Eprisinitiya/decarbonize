import React from 'react';
import './ReportGeneration.css';

const ReportGeneration = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Report Generation Center</h1>
        <p>Create and export customized reports for internal and external use.</p>
      </header>

      <div className="reporting-wizard">
        <div className="wizard-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Select a Template</h3>
            <div className="template-options">
              <button className="template-card active">Internal Review</button>
              <button className="template-card">Corporate Sustainability</button>
              <button className="template-card">Auditor-Ready</button>
            </div>
          </div>
        </div>

        <div className="wizard-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Customize Options</h3>
            <div className="options-grid">
              <div className="form-group">
                <label>Time Period</label>
                <select>
                  <option>Last Quarter</option>
                  <option>Year-to-Date (YTD)</option>
                  <option>Last 12 Months</option>
                </select>
              </div>
              <div className="form-group">
                <label>Emission Scopes</label>
                <select>
                  <option>Scope 1, 2 & 3</option>
                  <option>Scope 1 & 2</option>
                  <option>Scope 1 Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="wizard-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Preview & Export</h3>
            <div className="export-actions">
              <button className="export-btn preview-btn">Preview Report</button>
              <button className="export-btn pdf-btn">Export as PDF</button>
              <button className="export-btn csv-btn">Export as CSV</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneration;