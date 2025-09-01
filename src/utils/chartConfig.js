/**
 * Chart Configuration Utilities
 * Shared configurations and helpers for consistent data visualization
 */

/**
 * Default color palette for charts
 */
export const CHART_COLORS = {
  primary: '#4cceac',
  secondary: '#00C49F',
  tertiary: '#FFBB28',
  quaternary: '#FF8042',
  quinternary: '#ca71eb',
  senary: '#8dd1e1',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#22c55e',
  info: '#3b82f6',
};

/**
 * Color arrays for multi-series charts
 */
export const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinternary,
  CHART_COLORS.senary,
];

/**
 * Status-based colors
 */
export const STATUS_COLORS = {
  active: CHART_COLORS.success,
  inactive: '#9ca3af',
  completed: CHART_COLORS.info,
  pending: CHART_COLORS.warning,
  failed: CHART_COLORS.danger,
  draft: '#6b7280',
  archived: '#4b5563',
};

/**
 * Common chart margins
 */
export const CHART_MARGINS = {
  default: { top: 5, right: 30, left: 20, bottom: 5 },
  large: { top: 20, right: 50, left: 40, bottom: 20 },
  small: { top: 5, right: 15, left: 10, bottom: 5 },
  withLegend: { top: 20, right: 30, left: 20, bottom: 60 },
};

/**
 * Default tooltip configuration
 */
export const getTooltipConfig = (theme = 'light') => ({
  contentStyle: {
    backgroundColor: theme === 'dark' ? 'var(--background-secondary)' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? 'var(--border-color)' : '#e5e7eb'}`,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: theme === 'dark' ? 'var(--text-primary)' : '#374151',
  },
  labelStyle: {
    color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
});

/**
 * Default legend configuration
 */
export const getLegendConfig = (position = 'bottom') => ({
  verticalAlign: position,
  height: position === 'bottom' ? 36 : undefined,
  iconType: 'rect',
  wrapperStyle: {
    paddingTop: position === 'bottom' ? '20px' : '0',
    fontSize: '0.875rem',
  },
});

/**
 * Axis configuration helpers
 */
export const getAxisConfig = (theme = 'light') => ({
  stroke: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280',
  fontSize: '0.75rem',
  fontFamily: 'Inter, system-ui, sans-serif',
});

/**
 * Grid configuration
 */
export const getGridConfig = (theme = 'light') => ({
  strokeDasharray: '3 3',
  stroke: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
  opacity: 0.5,
});

/**
 * Format chart data for consistent structure
 */
export const formatChartData = (data, config = {}) => {
  const {
    xKey = 'x',
    yKey = 'y',
    labelKey = 'label',
    valueKey = 'value',
    nameKey = 'name',
    sortBy,
    sortOrder = 'asc',
    limit,
  } = config;

  if (!Array.isArray(data)) {
    console.warn('Chart data must be an array');
    return [];
  }

  let formattedData = data.map(item => {
    const formatted = {
      ...item,
      [xKey]: item[xKey] || item.x || item.name || item.label,
      [yKey]: typeof item[yKey] === 'number' ? item[yKey] : (item.y || item.value || 0),
      [labelKey]: item[labelKey] || item.label || item.name || 'Unknown',
      [valueKey]: typeof item[valueKey] === 'number' ? item[valueKey] : (item.value || item.y || 0),
      [nameKey]: item[nameKey] || item.name || item.label || 'Series',
    };

    return formatted;
  });

  // Sort data if specified
  if (sortBy) {
    formattedData.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return sortOrder === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }

  // Limit data if specified
  if (limit && limit > 0) {
    formattedData = formattedData.slice(0, limit);
  }

  return formattedData;
};

/**
 * Generate gradient definitions for charts
 */
export const generateGradients = (colors = CHART_COLOR_ARRAY) => {
  return colors.map((color, index) => ({
    id: `gradient-${index}`,
    stops: [
      { offset: '0%', stopColor: color, stopOpacity: 0.8 },
      { offset: '100%', stopColor: color, stopOpacity: 0.1 },
    ],
  }));
};

/**
 * Responsive chart dimensions
 */
export const getResponsiveDimensions = (containerWidth, aspectRatio = 16/9) => {
  const maxWidth = 1200;
  const minWidth = 300;
  const width = Math.max(minWidth, Math.min(maxWidth, containerWidth));
  const height = width / aspectRatio;
  
  return { width, height };
};

/**
 * Format tooltip values based on data type
 */
export const formatTooltipValue = (value, name, props) => {
  const { dataKey, unit, prefix = '', suffix = '' } = props || {};
  
  if (typeof value !== 'number') {
    return [value, name];
  }

  let formattedValue;
  
  // Format based on common data types
  if (name?.toLowerCase().includes('emission') || unit === 'tCO2e') {
    formattedValue = `${value.toFixed(1)} tCO₂e`;
  } else if (name?.toLowerCase().includes('currency') || name?.toLowerCase().includes('cost') || unit === 'currency') {
    formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } else if (name?.toLowerCase().includes('percentage') || unit === 'percentage') {
    formattedValue = `${value.toFixed(1)}%`;
  } else if (value >= 1000000) {
    formattedValue = `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    formattedValue = `${(value / 1000).toFixed(1)}K`;
  } else {
    formattedValue = value.toLocaleString('en-US', {
      minimumFractionDigits: value % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 2,
    });
  }

  return [`${prefix}${formattedValue}${suffix}`, name];
};

/**
 * Custom label formatter for different chart types
 */
export const formatChartLabel = (value, type = 'default', options = {}) => {
  const { unit, prefix = '', suffix = '', decimals = 1 } = options;

  if (value === null || value === undefined) {
    return 'N/A';
  }

  switch (type) {
    case 'percentage':
      return `${value.toFixed(decimals)}%`;
    
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    
    case 'compact':
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(decimals)}B`;
      } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(decimals)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(decimals)}K`;
      }
      return value.toFixed(decimals);
    
    case 'emissions':
      return `${value.toFixed(decimals)} tCO₂e`;
    
    case 'duration':
      if (value >= 365) {
        return `${(value / 365).toFixed(decimals)} years`;
      } else if (value >= 30) {
        return `${(value / 30).toFixed(decimals)} months`;
      } else if (value >= 7) {
        return `${(value / 7).toFixed(decimals)} weeks`;
      }
      return `${value.toFixed(decimals)} days`;
    
    default:
      const formatted = typeof value === 'number' ? value.toFixed(decimals) : value;
      return `${prefix}${formatted}${unit ? ' ' + unit : ''}${suffix}`;
  }
};

/**
 * Chart animation configurations
 */
export const ANIMATION_CONFIG = {
  default: {
    animationBegin: 0,
    animationDuration: 800,
    animationEasing: 'ease-out',
  },
  slow: {
    animationBegin: 0,
    animationDuration: 1200,
    animationEasing: 'ease-in-out',
  },
  fast: {
    animationBegin: 0,
    animationDuration: 400,
    animationEasing: 'ease-out',
  },
  none: {
    animationBegin: 0,
    animationDuration: 0,
  },
};

/**
 * Common chart configurations by type
 */
export const CHART_CONFIGS = {
  barChart: {
    margin: CHART_MARGINS.default,
    ...ANIMATION_CONFIG.default,
  },
  
  lineChart: {
    margin: CHART_MARGINS.default,
    strokeWidth: 2,
    dot: { strokeWidth: 2, r: 4 },
    activeDot: { r: 6, strokeWidth: 2 },
    ...ANIMATION_CONFIG.default,
  },
  
  areaChart: {
    margin: CHART_MARGINS.default,
    strokeWidth: 2,
    fillOpacity: 0.6,
    ...ANIMATION_CONFIG.default,
  },
  
  pieChart: {
    margin: CHART_MARGINS.small,
    outerRadius: 80,
    innerRadius: 0,
    paddingAngle: 2,
    ...ANIMATION_CONFIG.default,
  },
  
  donutChart: {
    margin: CHART_MARGINS.small,
    outerRadius: 80,
    innerRadius: 40,
    paddingAngle: 2,
    ...ANIMATION_CONFIG.default,
  },
  
  composedChart: {
    margin: CHART_MARGINS.default,
    ...ANIMATION_CONFIG.default,
  },
};

/**
 * Theme-aware chart configuration
 */
export const getThemedChartConfig = (theme = 'light') => ({
  tooltip: getTooltipConfig(theme),
  axis: getAxisConfig(theme),
  grid: getGridConfig(theme),
  background: theme === 'dark' ? 'var(--background-secondary)' : '#ffffff',
  text: theme === 'dark' ? 'var(--text-primary)' : '#374151',
  textSecondary: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280',
});

/**
 * Generate chart configuration based on data type
 */
export const generateChartConfig = (data, type, options = {}) => {
  const {
    theme = 'light',
    colors = CHART_COLOR_ARRAY,
    animation = 'default',
    responsive = true,
    showLegend = true,
    showTooltip = true,
    showGrid = true,
    ...customOptions
  } = options;

  const baseConfig = CHART_CONFIGS[type] || CHART_CONFIGS.barChart;
  const themedConfig = getThemedChartConfig(theme);
  const animationConfig = ANIMATION_CONFIG[animation] || ANIMATION_CONFIG.default;

  return {
    ...baseConfig,
    ...themedConfig,
    ...animationConfig,
    colors,
    data: formatChartData(data, customOptions),
    responsive,
    showLegend,
    showTooltip,
    showGrid,
    ...customOptions,
  };
};

/**
 * Export utilities for easy access
 */
export const ChartUtils = {
  colors: CHART_COLORS,
  colorArray: CHART_COLOR_ARRAY,
  statusColors: STATUS_COLORS,
  margins: CHART_MARGINS,
  formatData: formatChartData,
  formatLabel: formatChartLabel,
  formatTooltipValue,
  generateGradients,
  getResponsiveDimensions,
  generateConfig: generateChartConfig,
  animations: ANIMATION_CONFIG,
  configs: CHART_CONFIGS,
};
