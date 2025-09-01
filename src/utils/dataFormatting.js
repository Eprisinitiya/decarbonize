/**
 * Data Formatting Utilities
 * Shared functions for consistent data display across components
 */

/**
 * Format numbers with proper localization and units
 */
export const formatNumber = (value, options = {}) => {
  const {
    decimals = 2,
    unit = '',
    locale = 'en-US',
    compact = false,
    prefix = '',
    suffix = ''
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  let formattedValue;
  
  if (compact && Math.abs(value) >= 1000) {
    // Format large numbers with K, M, B abbreviations
    if (Math.abs(value) >= 1000000000) {
      formattedValue = (value / 1000000000).toLocaleString(locale, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      }) + 'B';
    } else if (Math.abs(value) >= 1000000) {
      formattedValue = (value / 1000000).toLocaleString(locale, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      }) + 'M';
    } else {
      formattedValue = (value / 1000).toLocaleString(locale, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      }) + 'K';
    }
  } else {
    formattedValue = value.toLocaleString(locale, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  }

  return `${prefix}${formattedValue}${unit ? ' ' + unit : ''}${suffix}`;
};

/**
 * Format emissions data with proper units
 */
export const formatEmissions = (value, options = {}) => {
  const { compact = true, showUnit = true } = options;
  const unit = showUnit ? 'tCO₂e' : '';
  
  return formatNumber(value, {
    decimals: value < 10 ? 2 : 1,
    unit,
    compact
  });
};

/**
 * Format currency values
 */
export const formatCurrency = (value, options = {}) => {
  const { 
    currency = 'USD', 
    locale = 'en-US', 
    compact = false,
    showSymbol = true 
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  if (compact && Math.abs(value) >= 1000) {
    const prefix = showSymbol ? '$' : '';
    return formatNumber(value, { compact: true, prefix });
  }

  return new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format percentages
 */
export const formatPercentage = (value, options = {}) => {
  const { decimals = 1, showSign = false } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format dates consistently
 */
export const formatDate = (date, options = {}) => {
  const { 
    format = 'short', // short, medium, long, full
    includeTime = false,
    locale = 'en-US' 
  } = options;

  if (!date) return 'N/A';

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  let dateStyle, timeStyle;
  
  switch (format) {
    case 'short':
      dateStyle = 'short';
      break;
    case 'medium':
      dateStyle = 'medium';
      break;
    case 'long':
      dateStyle = 'long';
      break;
    case 'full':
      dateStyle = 'full';
      break;
    default:
      dateStyle = 'short';
  }

  timeStyle = includeTime ? 'short' : undefined;

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle
  }).format(dateObj);
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date, options = {}) => {
  const { locale = 'en-US' } = options;

  if (!date) return 'N/A';

  const dateObj = new Date(date);
  const now = new Date();
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffInMs = dateObj - now;
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffInDays) < 1) {
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    if (Math.abs(diffInHours) < 1) {
      const diffInMinutes = Math.round(diffInMs / (1000 * 60));
      return rtf.format(diffInMinutes, 'minute');
    }
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 7) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInDays) < 30) {
    const diffInWeeks = Math.round(diffInDays / 7);
    return rtf.format(diffInWeeks, 'week');
  } else if (Math.abs(diffInDays) < 365) {
    const diffInMonths = Math.round(diffInDays / 30);
    return rtf.format(diffInMonths, 'month');
  } else {
    const diffInYears = Math.round(diffInDays / 365);
    return rtf.format(diffInYears, 'year');
  }
};

/**
 * Format duration in human-readable format
 */
export const formatDuration = (durationMs, options = {}) => {
  const { format = 'auto' } = options; // auto, hours, minutes, seconds

  if (!durationMs || durationMs < 0) return '0 seconds';

  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (format === 'auto') {
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  }

  // Return formatted based on specific format
  switch (format) {
    case 'hours':
      return `${hours.toFixed(1)} hours`;
    case 'minutes':
      return `${minutes} minutes`;
    case 'seconds':
      return `${seconds} seconds`;
    default:
      return `${seconds} seconds`;
  }
};

/**
 * Format file sizes
 */
export const formatFileSize = (bytes, options = {}) => {
  const { decimals = 2 } = options;

  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'N/A';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format unit values with proper abbreviations
 */
export const formatUnit = (value, unit, options = {}) => {
  const { abbreviate = false, plural = true } = options;

  const unitMappings = {
    // Energy units
    'kilowatt-hours': abbreviate ? 'kWh' : 'kilowatt-hours',
    'megawatt-hours': abbreviate ? 'MWh' : 'megawatt-hours',
    'joules': abbreviate ? 'J' : 'joules',
    
    // Distance units
    'kilometers': abbreviate ? 'km' : 'kilometers',
    'meters': abbreviate ? 'm' : 'meters',
    'miles': abbreviate ? 'mi' : 'miles',
    
    // Weight units
    'tonnes': abbreviate ? 't' : 'tonnes',
    'kilograms': abbreviate ? 'kg' : 'kilograms',
    'pounds': abbreviate ? 'lbs' : 'pounds',
    
    // Area units
    'hectares': abbreviate ? 'ha' : 'hectares',
    'square-meters': abbreviate ? 'm²' : 'square meters',
    'acres': abbreviate ? 'ac' : 'acres',
    
    // Volume units
    'liters': abbreviate ? 'L' : 'liters',
    'gallons': abbreviate ? 'gal' : 'gallons',
    'cubic-meters': abbreviate ? 'm³' : 'cubic meters',
  };

  const formattedUnit = unitMappings[unit] || unit;
  
  // Handle pluralization for non-abbreviated forms
  if (!abbreviate && plural && value !== 1 && !formattedUnit.endsWith('s')) {
    return `${formatNumber(value)} ${formattedUnit}s`;
  }
  
  return `${formatNumber(value)} ${formattedUnit}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, options = {}) => {
  const { maxLength = 100, suffix = '...' } = options;

  if (!text || text.length <= maxLength) {
    return text || '';
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format phone numbers
 */
export const formatPhoneNumber = (phoneNumber, options = {}) => {
  const { format = 'US' } = options; // US, international

  if (!phoneNumber) return '';

  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (format === 'US' && cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (format === 'US' && cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phoneNumber; // Return original if can't format
};

/**
 * Format data for charts - ensure consistent structure
 */
export const formatChartData = (data, options = {}) => {
  const { xKey = 'x', yKey = 'y', labelKey = 'label' } = options;

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(item => ({
    [xKey]: item[xKey] || item.x,
    [yKey]: typeof item[yKey] === 'number' ? item[yKey] : (item.y || 0),
    [labelKey]: item[labelKey] || item.label || item.name || 'Unknown',
    ...item // Include all original properties
  }));
};
