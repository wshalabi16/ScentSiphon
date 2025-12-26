/**
 * Input Sanitization and Validation Utilities
 *
 * Prevents XSS attacks by sanitizing user input before database storage
 */

/**
 * Sanitize text input - Remove HTML tags and dangerous characters
 * @param {string} input - Raw user input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized string
 */
export function sanitizeText(input, maxLength = 200) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Enforce length limit
    .substring(0, maxLength);
}

/**
 * Validate and sanitize email
 * @param {string} email - Email address
 * @returns {{valid: boolean, sanitized: string, error?: string}}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, sanitized: '', error: 'Email is required' };
  }

  const sanitized = email.trim().toLowerCase().substring(0, 254);

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, sanitized: '', error: 'Invalid email format' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate Canadian postal code
 * @param {string} postalCode - Postal code
 * @returns {{valid: boolean, sanitized: string, error?: string}}
 */
export function validatePostalCode(postalCode) {
  if (!postalCode || typeof postalCode !== 'string') {
    return { valid: false, sanitized: '', error: 'Postal code is required' };
  }

  // Remove spaces and convert to uppercase
  const sanitized = postalCode.replace(/\s/g, '').toUpperCase().substring(0, 7);

  // Canadian postal code format: A1A 1A1
  const postalRegex = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;

  if (!postalRegex.test(sanitized)) {
    return { valid: false, sanitized: '', error: 'Invalid Canadian postal code format (A1A 1A1)' };
  }

  // Format with space: A1A 1A1
  const formatted = `${sanitized.substring(0, 3)} ${sanitized.substring(3)}`;

  return { valid: true, sanitized: formatted };
}

/**
 * Validate Canadian province code
 * @param {string} province - Province code
 * @returns {{valid: boolean, sanitized: string, error?: string}}
 */
export function validateProvince(province) {
  const validProvinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

  if (!province || typeof province !== 'string') {
    return { valid: false, sanitized: '', error: 'Province is required' };
  }

  const sanitized = province.trim().toUpperCase();

  if (!validProvinces.includes(sanitized)) {
    return { valid: false, sanitized: '', error: 'Invalid Canadian province' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate and sanitize phone number
 * @param {string} phone - Phone number
 * @returns {{valid: boolean, sanitized: string, error?: string}}
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    // Phone is optional
    return { valid: true, sanitized: '' };
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Canadian phone numbers: 10 digits
  if (digitsOnly.length !== 10 && digitsOnly.length !== 11) {
    return { valid: false, sanitized: '', error: 'Invalid phone number (10 digits required)' };
  }

  // If 11 digits, must start with 1 (country code)
  if (digitsOnly.length === 11 && !digitsOnly.startsWith('1')) {
    return { valid: false, sanitized: '', error: 'Invalid phone number' };
  }

  // Format as (XXX) XXX-XXXX
  const formatted = digitsOnly.length === 11
    ? `+1 (${digitsOnly.substring(1, 4)}) ${digitsOnly.substring(4, 7)}-${digitsOnly.substring(7)}`
    : `(${digitsOnly.substring(0, 3)}) ${digitsOnly.substring(3, 6)}-${digitsOnly.substring(6)}`;

  return { valid: true, sanitized: formatted };
}

/**
 * Sanitize checkout data - Apply all sanitization rules
 * @param {object} data - Raw checkout data
 * @returns {{valid: boolean, sanitized?: object, errors?: object}}
 */
export function sanitizeCheckoutData(data) {
  const errors = {};
  const sanitized = {};

  // Name (required, max 100 chars)
  sanitized.name = sanitizeText(data.name, 100);
  if (!sanitized.name) {
    errors.name = 'Name is required';
  }

  // Email (required, validated)
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) {
    errors.email = emailResult.error;
  } else {
    sanitized.email = emailResult.sanitized;
  }

  // Street Address (required, max 200 chars)
  sanitized.streetAddress = sanitizeText(data.streetAddress, 200);
  if (!sanitized.streetAddress) {
    errors.streetAddress = 'Street address is required';
  }

  // Address Line 2 (optional, max 200 chars)
  sanitized.addressLine2 = sanitizeText(data.addressLine2 || '', 200);

  // City (required, max 100 chars)
  sanitized.city = sanitizeText(data.city, 100);
  if (!sanitized.city) {
    errors.city = 'City is required';
  }

  // Province (required, validated)
  const provinceResult = validateProvince(data.province);
  if (!provinceResult.valid) {
    errors.province = provinceResult.error;
  } else {
    sanitized.province = provinceResult.sanitized;
  }

  // Postal Code (required, validated)
  const postalResult = validatePostalCode(data.postalCode);
  if (!postalResult.valid) {
    errors.postalCode = postalResult.error;
  } else {
    sanitized.postalCode = postalResult.sanitized;
  }

  // Country (required, only Canada supported)
  sanitized.country = sanitizeText(data.country, 50);
  if (sanitized.country !== 'Canada') {
    errors.country = 'Only Canadian orders are accepted';
  }

  // Phone (optional, validated if provided)
  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.valid) {
    errors.phone = phoneResult.error;
  } else {
    sanitized.phone = phoneResult.sanitized;
  }

  // Check if there are any errors
  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, sanitized };
}