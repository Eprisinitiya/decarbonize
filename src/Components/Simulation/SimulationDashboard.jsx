import React from 'react';
import './SimulationDashboard.css';

const SimulationDashboard = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Simulation & Scenario Dashboard</h1>
        <p>Model and compare different decarbonization strategies to plan for the future.</p>
      </header>

      <div className="simulation-layout">
        <div className="scenario-builder-card">
          <h3>Scenario Builder</h3>
          <p className="builder-description">Drag mitigation levers onto the timeline to build your scenarios.</p>
          
          <div className="mitigation-levers">
            <h4>Available Levers</h4>
            <div className="lever-item draggable">Fleet Electrification</div>
            <div className="lever-item draggable">Renewable Adoption</div>
            <div className="lever-item draggable">Methane Capture</div>
            <div className="lever-item draggable">Operational Efficiency</div>
          </div>
          
          <div className="scenario-timeline">
            <h4>Scenario: Aggressive Electrification</h4>
            <div className="timeline-placeholder">[Interactive timeline with dragged levers]</div>
          </div>
        </div>

        <div className="comparison-dashboard-card">
          <h3>Comparison Dashboard</h3>
          <div className="comparison-chart">
            <h5>Emission Trajectory (tCO₂e)</h5>
            <div className="chart-placeholder-line">[Line chart comparing "Business as Usual" vs. "New Scenario"]</div>
          </div>
          <div className="financial-summary">
            <h5>Financial Summary</h5>
            <div className="summary-grid">
              <div className="summary-item">
                <span>NPV</span>
                <strong>$1.2M</strong>
              </div>
              <div className="summary-item">
                <span>IRR</span>
                <strong>14.5%</strong>
              </div>
              <div className="summary-item">
                <span>Payback</span>
                <strong>6.8 Years</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationDashboard;