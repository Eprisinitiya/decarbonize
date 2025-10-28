import React from 'react';
import './EmptyState.css';

/**
 * EmptyState Component
 * Displays friendly empty states with illustrations, guidance, and CTAs
 * 
 * @param {string} title - Main title text
 * @param {string} description - Supporting description text
 * @param {string} icon - Emoji or icon to display
 * @param {ReactNode} action - CTA button or action component
 * @param {Array} tips - Array of tip strings to display
 */
const EmptyState = ({ 
  title = "No Data Yet", 
  description = "Get started by adding your first data entry.", 
  icon = "📊",
  action,
  tips = []
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">{icon}</div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-description">{description}</p>
      
      {tips.length > 0 && (
        <div className="empty-state-tips">
          <h4>Quick Start:</h4>
          <ul>
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
      
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * DashboardEmptyState - Specific empty state for dashboard
 */
export const DashboardEmptyState = ({ onUploadClick }) => {
  return (
    <EmptyState
      title="Welcome to Your Carbon Dashboard"
      description="Start tracking your emissions by uploading your first data set."
      icon="🌱"
      tips={[
        "Upload fuel consumption data",
        "Add electricity usage records",
        "Log fugitive emissions",
        "Review your carbon footprint"
      ]}
      action={
        <button 
          className="empty-state-button primary"
          onClick={onUploadClick}
        >
          Upload First Data Set
        </button>
      }
    />
  );
};

/**
 * InventoryEmptyState - For GHG Inventory page
 */
export const InventoryEmptyState = ({ onAddData }) => {
  return (
    <EmptyState
      title="No Emission Data Yet"
      description="Add your first emission source to start building your GHG inventory."
      icon="📝"
      tips={[
        "Start with Scope 1 (direct) emissions",
        "Add Scope 2 (electricity) data",
        "Include Scope 3 (value chain) if available"
      ]}
      action={
        <button 
          className="empty-state-button primary"
          onClick={onAddData}
        >
          Add Emission Data
        </button>
      }
    />
  );
};

/**
 * ReportsEmptyState - For reports page
 */
export const ReportsEmptyState = ({ onCreateReport }) => {
  return (
    <EmptyState
      title="No Reports Generated"
      description="Create your first carbon emissions report to share with stakeholders."
      icon="📄"
      tips={[
        "Choose a report template",
        "Select time period",
        "Customize report sections",
        "Export as PDF or CSV"
      ]}
      action={
        <button 
          className="empty-state-button primary"
          onClick={onCreateReport}
        >
          Generate First Report
        </button>
      }
    />
  );
};

export default EmptyState;
