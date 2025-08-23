import React from 'react';
import './SequestrationManager.css';

const projects = [
  { id: 1, name: 'West Ridge Afforestation', area: 50, rate: 3.5, total: 175, status: 'Active' },
  { id: 2, name: 'North Block Reclamation', area: 120, rate: 4.1, total: 492, status: 'Active' },
  { id: 3, name: 'Old Pit Grassland', area: 75, rate: 1.2, total: 90, status: 'Completed' },
];

const SequestrationManager = () => {
  return (
    <div className="page-container">
      <header className="page-header-flex">
        <div>
          <h1>Carbon Sink Projects</h1>
          <p>Manage and track your afforestation & reclamation projects.</p>
        </div>
        <button className="add-project-btn">+ Add New Project</button>
      </header>
      
      <div className="sequestration-card">
        <div className="table-responsive">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Area (Hectares)</th>
                <th>Rate (tCO₂/ha/yr)</th>
                <th>Total Absorbed (tCO₂)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.area}</td>
                  <td>{p.rate}</td>
                  <td className="total-absorbed">{p.total}</td>
                  <td>
                    <span className={`status-badge status-${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SequestrationManager;