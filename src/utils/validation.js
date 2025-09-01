/**
 * Validation Utilities
 * Shared validation functions for forms and data integrity
 */

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? '' : 'Please enter a valid email address'
  };
};

/**
 * Phone number validation
 */
export const validatePhone = (phone, options = {}) => {
  const { format = 'US' } = options;
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  let isValid = false;
  let message = '';
  
  if (format === 'US') {
    isValid = cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
    message = isValid ? '' : 'Please enter a valid US phone number';
  } else {
    // Basic international validation (7-15 digits)
    isValid = cleaned.length >= 7 && cleaned.length <= 15;
    message = isValid ? '' : 'Please enter a valid phone number';
  }
  
  return { isValid, message };
};

/**
 * Required field validation
 */
export const validateRequired = (value, fieldName = 'This field') => {
  const isEmpty = value === null || value === undefined || 
                  (typeof value === 'string' && value.trim() === '') ||
                  (Array.isArray(value) && value.length === 0);
  
  return {
    isValid: !isEmpty,
    message: isEmpty ? `${fieldName} is required` : ''
  };
};

/**
 * Number validation
 */
export const validateNumber = (value, options = {}) => {
  const {
    min,
    max,
    integer = false,
    positive = false,
    fieldName = 'Value'
  } = options;
  
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return {
      isValid: false,
      message: `${fieldName} must be a valid number`
    };
  }
  
  if (integer && !Number.isInteger(numValue)) {
    return {
      isValid: false,
      message: `${fieldName} must be a whole number`
    };
  }
  
  if (positive && numValue <= 0) {
    return {
      isValid: false,
      message: `${fieldName} must be greater than zero`
    };
  }
  
  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min}`
    };
  }
  
  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${max}`
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * String length validation
 */
export const validateLength = (value, options = {}) => {
  const {
    min,
    max,
    fieldName = 'Value'
  } = options;
  
  if (typeof value !== 'string') {
    value = String(value || '');
  }
  
  const length = value.length;
  
  if (min !== undefined && length < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min} characters long`
    };
  }
  
  if (max !== undefined && length > max) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${max} characters long`
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Date validation
 */
export const validateDate = (date, options = {}) => {
  const {
    min,
    max,
    fieldName = 'Date',
    allowPast = true,
    allowFuture = true
  } = options;
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      message: `${fieldName} must be a valid date`
    };
  }
  
  const now = new Date();
  
  if (!allowPast && dateObj < now) {
    return {
      isValid: false,
      message: `${fieldName} cannot be in the past`
    };
  }
  
  if (!allowFuture && dateObj > now) {
    return {
      isValid: false,
      message: `${fieldName} cannot be in the future`
    };
  }
  
  if (min && dateObj < new Date(min)) {
    return {
      isValid: false,
      message: `${fieldName} must be after ${new Date(min).toLocaleDateString()}`
    };
  }
  
  if (max && dateObj > new Date(max)) {
    return {
      isValid: false,
      message: `${fieldName} must be before ${new Date(max).toLocaleDateString()}`
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * URL validation
 */
export const validateURL = (url, options = {}) => {
  const { requireProtocol = false, fieldName = 'URL' } = options;
  
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      message: `${fieldName} is required`
    };
  }
  
  try {
    const urlObj = new URL(url);
    
    if (requireProtocol && !['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        isValid: false,
        message: `${fieldName} must start with http:// or https://`
      };
    }
    
    return {
      isValid: true,
      message: ''
    };
  } catch (error) {
    return {
      isValid: false,
      message: `${fieldName} must be a valid URL`
    };
  }
};

/**
 * Password validation
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = false,
    fieldName = 'Password'
  } = options;
  
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: `${fieldName} is required`
    };
  }
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`at least ${minLength} characters`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('one number');
  }
  
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('one special character');
  }
  
  if (errors.length > 0) {
    return {
      isValid: false,
      message: `${fieldName} must contain ${errors.join(', ')}`
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * File validation
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize, // in bytes
    allowedTypes = [], // array of MIME types
    fieldName = 'File'
  } = options;
  
  if (!file) {
    return {
      isValid: false,
      message: `${fieldName} is required`
    };
  }
  
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      message: `${fieldName} must be smaller than ${maxSizeMB}MB`
    };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `${fieldName} must be one of: ${allowedTypes.join(', ')}`
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Custom regex validation
 */
export const validateRegex = (value, pattern, message = 'Invalid format') => {
  const regex = new RegExp(pattern);
  
  return {
    isValid: regex.test(value),
    message: regex.test(value) ? '' : message
  };
};

/**
 * Validate multiple fields using a schema
 */
export const validateSchema = (data, schema) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    for (const rule of rules) {
      const validation = rule(value);
      
      if (!validation.isValid) {
        errors[field] = validation.message;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  }
  
  return {
    isValid,
    errors
  };
};

/**
 * Common validation rules for emissions data
 */
export const validateEmissionsData = (data) => {
  const schema = {
    date: [
      (value) => validateRequired(value, 'Date'),
      (value) => validateDate(value, { fieldName: 'Date' })
    ],
    quantity: [
      (value) => validateRequired(value, 'Quantity'),
      (value) => validateNumber(value, { 
        positive: true, 
        fieldName: 'Quantity',
        min: 0.01
      })
    ],
    location: [
      (value) => validateRequired(value, 'Location'),
      (value) => validateLength(value, { 
        min: 2, 
        max: 100, 
        fieldName: 'Location' 
      })
    ]
  };
  
  return validateSchema(data, schema);
};

/**
 * Common validation rules for project data
 */
export const validateProjectData = (data) => {
  const schema = {
    name: [
      (value) => validateRequired(value, 'Project name'),
      (value) => validateLength(value, { 
        min: 3, 
        max: 100, 
        fieldName: 'Project name' 
      })
    ],
    area: [
      (value) => validateRequired(value, 'Area'),
      (value) => validateNumber(value, { 
        positive: true, 
        fieldName: 'Area',
        min: 0.1
      })
    ],
    investment: [
      (value) => validateRequired(value, 'Investment'),
      (value) => validateNumber(value, { 
        positive: true, 
        fieldName: 'Investment',
        min: 1000
      })
    ],
    plantedDate: [
      (value) => validateRequired(value, 'Planting date'),
      (value) => validateDate(value, { 
        fieldName: 'Planting date',
        allowFuture: false 
      })
    ]
  };
  
  return validateSchema(data, schema);
};

/**
 * Sanitize input data
 */
export const sanitizeInput = (value, options = {}) => {
  const { 
    trim = true, 
    removeHtml = true, 
    maxLength 
  } = options;
  
  if (typeof value !== 'string') {
    return value;
  }
  
  let sanitized = value;
  
  if (trim) {
    sanitized = sanitized.trim();
  }
  
  if (removeHtml) {
    // Basic HTML removal - for production use a proper HTML sanitization library
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Deep validation for nested objects
 */
export const validateNested = (data, schema, path = '') => {
  const errors = {};
  let isValid = true;
  
  for (const [field, rules] of Object.entries(schema)) {
    const fieldPath = path ? `${path}.${field}` : field;
    const value = getNestedValue(data, field);
    
    if (Array.isArray(rules)) {
      // Standard validation rules
      for (const rule of rules) {
        const validation = rule(value);
        
        if (!validation.isValid) {
          setNestedValue(errors, field, validation.message);
          isValid = false;
          break;
        }
      }
    } else if (typeof rules === 'object') {
      // Nested schema
      const nestedValidation = validateNested(value || {}, rules, fieldPath);
      
      if (!nestedValidation.isValid) {
        setNestedValue(errors, field, nestedValidation.errors);
        isValid = false;
      }
    }
  }
  
  return {
    isValid,
    errors
  };
};

/**
 * Helper function to get nested values
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Helper function to set nested values
 */
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
};
