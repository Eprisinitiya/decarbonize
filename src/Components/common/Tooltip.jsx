import React, { useState } from 'react';
import './Tooltip.css';

/**
 * Tooltip Component
 * Provides contextual help text and explanations for complex UI elements
 * 
 * @param {string} content - The tooltip text content
 * @param {ReactNode} children - The element that triggers the tooltip
 * @param {string} position - Tooltip position: 'top', 'bottom', 'left', 'right' (default: 'top')
 */
const Tooltip = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip-content tooltip-${position}`} role="tooltip">
          <div className="tooltip-arrow"></div>
          {content}
        </div>
      )}
    </div>
  );
};

/**
 * HelpIcon Component
 * Standardized help icon with tooltip for inline help text
 * 
 * @param {string} content - The help text content
 * @param {string} ariaLabel - Accessible label for screen readers
 */
export const HelpIcon = ({ content, ariaLabel = "Help information" }) => {
  return (
    <Tooltip content={content} position="top">
      <button 
        className="help-icon-button"
        aria-label={ariaLabel}
        type="button"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
        </svg>
      </button>
    </Tooltip>
  );
};

export default Tooltip;
