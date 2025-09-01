/**
 * Utility Functions Index
 * Central export point for all utility functions
 */

// Data formatting utilities
export * from './dataFormatting.js';

// Validation utilities
export * from './validation.js';

// Chart configuration utilities
export * from './chartConfig.js';

// Re-export commonly used utilities with more convenient names
export {
  formatNumber,
  formatEmissions,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatRelativeTime,
} from './dataFormatting.js';

export {
  validateRequired,
  validateNumber,
  validateEmail,
  validateSchema,
  validateEmissionsData,
  validateProjectData,
} from './validation.js';

export {
  CHART_COLORS,
  CHART_COLOR_ARRAY,
  ChartUtils,
  formatChartData,
  generateChartConfig,
} from './chartConfig.js';

/**
 * Constants for easy access across the application
 */
export const APP_CONSTANTS = {
  // Date formats
  DATE_FORMATS: {
    SHORT: 'MM/DD/YYYY',
    MEDIUM: 'MMM DD, YYYY',
    LONG: 'MMMM DD, YYYY',
    ISO: 'YYYY-MM-DD',
  },
  
  // Number formats
  NUMBER_FORMATS: {
    DECIMAL: 'decimal',
    CURRENCY: 'currency',
    PERCENT: 'percent',
    COMPACT: 'compact',
  },
  
  // File types
  SUPPORTED_FILE_TYPES: {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
    PRESENTATIONS: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  },
  
  // API related
  API_ENDPOINTS: {
    // These would be defined based on your backend API
    BASE_URL: '/api',
    AUTH: '/auth',
    USERS: '/users',
    EMISSIONS: '/emissions',
    PROJECTS: '/projects',
    REPORTS: '/reports',
  },
  
  // Storage keys
  STORAGE_KEYS: {
    USER_TOKEN: 'decarbonize_token',
    USER_DATA: 'decarbonize_user',
    THEME: 'decarbonize_theme',
    PREFERENCES: 'decarbonize_preferences',
  },
  
  // Status options
  STATUS_OPTIONS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    COMPLETED: 'completed',
    DRAFT: 'draft',
    ARCHIVED: 'archived',
  },
  
  // Emission categories
  EMISSION_CATEGORIES: {
    FUEL: 'fuel',
    ELECTRICITY: 'electricity',
    FUGITIVE: 'fugitive',
    EXPLOSIVES: 'explosives',
    TRANSPORTATION: 'transportation',
    WASTE: 'waste',
  },
  
  // Units
  UNITS: {
    MASS: {
      TONNES: 'tonnes',
      KILOGRAMS: 'kg',
      POUNDS: 'lbs',
    },
    ENERGY: {
      KWH: 'kWh',
      MWH: 'MWh',
      JOULES: 'J',
      BTU: 'BTU',
    },
    VOLUME: {
      LITERS: 'L',
      GALLONS: 'gal',
      CUBIC_METERS: 'm³',
    },
    AREA: {
      HECTARES: 'ha',
      SQUARE_METERS: 'm²',
      ACRES: 'ac',
    },
    DISTANCE: {
      KILOMETERS: 'km',
      METERS: 'm',
      MILES: 'mi',
      FEET: 'ft',
    },
  },
};

/**
 * Common helper functions
 */
export const CommonHelpers = {
  /**
   * Deep clone an object
   */
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => CommonHelpers.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = CommonHelpers.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  },

  /**
   * Debounce function calls
   */
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },

  /**
   * Throttle function calls
   */
  throttle: (func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Generate unique ID
   */
  generateId: (prefix = 'id') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Check if value is empty
   */
  isEmpty: (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  /**
   * Get nested object property safely
   */
  getNestedProperty: (obj, path, defaultValue = undefined) => {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current;
  },

  /**
   * Set nested object property
   */
  setNestedProperty: (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
    return obj;
  },

  /**
   * Sort array of objects by property
   */
  sortByProperty: (array, property, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = CommonHelpers.getNestedProperty(a, property);
      const bVal = CommonHelpers.getNestedProperty(b, property);
      
      if (aVal === bVal) return 0;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Group array of objects by property
   */
  groupByProperty: (array, property) => {
    return array.reduce((groups, item) => {
      const key = CommonHelpers.getNestedProperty(item, property);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  },

  /**
   * Calculate percentage change
   */
  calculatePercentageChange: (oldValue, newValue) => {
    if (oldValue === 0) return newValue === 0 ? 0 : 100;
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  },

  /**
   * Calculate average of array
   */
  calculateAverage: (numbers) => {
    if (!Array.isArray(numbers) || numbers.length === 0) return 0;
    const sum = numbers.reduce((total, num) => total + (parseFloat(num) || 0), 0);
    return sum / numbers.length;
  },

  /**
   * Calculate sum of array
   */
  calculateSum: (numbers) => {
    if (!Array.isArray(numbers)) return 0;
    return numbers.reduce((total, num) => total + (parseFloat(num) || 0), 0);
  },
};

// Export everything as default for convenience
export default {
  ...APP_CONSTANTS,
  CommonHelpers,
};
