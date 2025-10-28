import React, { useState } from 'react';
import './ActionsPanel.css';
import { HelpIcon } from '../common/Tooltip';

/**
 * ActionsPanel Component
 * Displays prioritized decarbonization recommendations sorted by ROI and CO₂ impact
 */
const ActionsPanel = ({ timeFrame = 'quarterly' }) => {
  const [sortBy, setSortBy] = useState('roi'); // 'roi', 'co2', 'cost', 'timeline'
  const [filter, setFilter] = useState('all'); // 'all', 'quickwins', 'longterm'

  // Mock recommendation data
  const recommendations = [
    {
      id: 1,
      title: 'Diesel Fleet Electrification',
      category: 'Fleet Management',
      priority: 'high',
      timeline: 'long-term',
      co2Reduction: 15000, // tCO₂e per year
      costSavings: 1200000, // USD per year
      upfrontCost: 5000000,
      roi: 24, // months to break even
      impact: 'high',
      difficulty: 'hard',
      description: 'Replace 40% of diesel fleet with electric vehicles over 3 years.',
      nextSteps: ['Conduct fleet analysis', 'Identify suitable electric models', 'Plan charging infrastructure']
    },
    {
      id: 2,
      title: 'Methane Capture System',
      category: 'Emissions Control',
      priority: 'high',
      timeline: 'medium-term',
      co2Reduction: 12000,
      costSavings: 800000,
      upfrontCost: 2500000,
      roi: 18,
      impact: 'high',
      difficulty: 'medium',
      description: 'Install methane capture and utilization system at primary ventilation shafts.',
      nextSteps: ['Site assessment', 'Technology vendor selection', 'Pilot installation']
    },
    {
      id: 3,
      title: 'LED Lighting Upgrade',
      category: 'Energy Efficiency',
      priority: 'medium',
      timeline: 'quick-win',
      co2Reduction: 2500,
      costSavings: 180000,
      upfrontCost: 400000,
      roi: 12,
      impact: 'medium',
      difficulty: 'easy',
      description: 'Replace all underground and surface lighting with LED systems.',
      nextSteps: ['Lighting audit', 'Purchase LEDs', 'Phased installation']
    },
    {
      id: 4,
      title: 'Renewable Energy Procurement',
      category: 'Energy Mix',
      priority: 'high',
      timeline: 'medium-term',
      co2Reduction: 18000,
      costSavings: 600000,
      upfrontCost: 0,
      roi: 6,
      impact: 'high',
      difficulty: 'easy',
      description: 'Switch to 60% renewable energy through Power Purchase Agreement (PPA).',
      nextSteps: ['RFP for renewable energy', 'Negotiate PPA terms', 'Contract execution']
    },
    {
      id: 5,
      title: 'Process Optimization',
      category: 'Operations',
      priority: 'medium',
      timeline: 'quick-win',
      co2Reduction: 3500,
      costSavings: 250000,
      upfrontCost: 150000,
      roi: 8,
      impact: 'medium',
      difficulty: 'easy',
      description: 'Optimize haul routes and ventilation systems using AI-powered analytics.',
      nextSteps: ['Install sensors', 'Deploy analytics platform', 'Train operators']
    },
    {
      id: 6,
      title: 'Afforestation Project Expansion',
      category: 'Offsetting',
      priority: 'low',
      timeline: 'long-term',
      co2Reduction: 5000,
      costSavings: 0,
      upfrontCost: 800000,
      roi: null, // No direct ROI, compliance/CSR benefit
      impact: 'medium',
      difficulty: 'medium',
      description: 'Expand carbon sequestration projects by planting 50,000 native trees.',
      nextSteps: ['Land identification', 'Species selection', 'Community engagement']
    }
  ];

  // Sorting logic
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return (a.roi || Infinity) - (b.roi || Infinity);
      case 'co2':
        return b.co2Reduction - a.co2Reduction;
      case 'cost':
        return a.upfrontCost - b.upfrontCost;
      case 'timeline':
        const order = { 'quick-win': 1, 'medium-term': 2, 'long-term': 3 };
        return order[a.timeline] - order[b.timeline];
      default:
        return 0;
    }
  });

  // Filter logic
  const filteredRecommendations = sortedRecommendations.filter(rec => {
    if (filter === 'all') return true;
    if (filter === 'quickwins') return rec.timeline === 'quick-win';
    if (filter === 'longterm') return rec.timeline === 'long-term' || rec.timeline === 'medium-term';
    return true;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const formatCO2 = (value) => {
    return `${(value / 1000).toFixed(1)}k tCO₂e`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF8042';
      case 'medium': return '#FFBB28';
      case 'low': return '#4cceac';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="actions-panel">
      <div className="actions-header">
        <h2>
          Recommended Actions
          <HelpIcon 
            content="Decarbonization recommendations ranked by ROI, CO₂ impact, and feasibility. Click each item to see detailed implementation steps."
            ariaLabel="Explanation of Actions Panel"
          />
        </h2>
        
        <div className="actions-controls">
          <div className="action-filter-group">
            <label>Filter:</label>
            <button 
              className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('all')}
            >
              All Actions
            </button>
            <button 
              className={filter === 'quickwins' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('quickwins')}
            >
              🚀 Quick Wins
            </button>
            <button 
              className={filter === 'longterm' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('longterm')}
            >
              📈 Strategic
            </button>
          </div>

          <div className="action-sort-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="roi">ROI (Fastest Payback)</option>
              <option value="co2">CO₂ Impact (Highest)</option>
              <option value="cost">Upfront Cost (Lowest)</option>
              <option value="timeline">Timeline (Quickest)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="actions-list">
        {filteredRecommendations.map((action, index) => (
          <ActionCard 
            key={action.id} 
            action={action} 
            rank={index + 1}
            formatCurrency={formatCurrency}
            formatCO2={formatCO2}
            getPriorityColor={getPriorityColor}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * ActionCard - Individual recommendation card
 */
const ActionCard = ({ action, rank, formatCurrency, formatCO2, getPriorityColor }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="action-card">
      <div className="action-rank" style={{ backgroundColor: getPriorityColor(action.priority) }}>
        #{rank}
      </div>
      
      <div className="action-content">
        <div className="action-header-row">
          <div className="action-title-group">
            <h3>{action.title}</h3>
            <span className="action-category">{action.category}</span>
            <span className={`action-timeline timeline-${action.timeline}`}>
              {action.timeline === 'quick-win' && '⚡ Quick Win'}
              {action.timeline === 'medium-term' && '⏱️ Medium-term'}
              {action.timeline === 'long-term' && '📅 Long-term'}
            </span>
          </div>
        </div>

        <p className="action-description">{action.description}</p>

        <div className="action-metrics">
          <div className="metric-item">
            <span className="metric-label">CO₂ Reduction</span>
            <span className="metric-value success">{formatCO2(action.co2Reduction)}/yr</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Cost Savings</span>
            <span className="metric-value success">{formatCurrency(action.costSavings)}/yr</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Upfront Cost</span>
            <span className="metric-value">{formatCurrency(action.upfrontCost)}</span>
          </div>
          {action.roi && (
            <div className="metric-item">
              <span className="metric-label">Payback</span>
              <span className="metric-value highlight">{action.roi} months</span>
            </div>
          )}
        </div>

        <button 
          className="action-expand-btn"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide' : 'View'} Implementation Steps
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {expanded && (
          <div className="action-steps">
            <h4>Next Steps:</h4>
            <ol>
              {action.nextSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionsPanel;
