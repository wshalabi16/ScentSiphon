/**
 * Shared utility functions for formatting data
 */

/**
 * Format size display (e.g., "2ml" → "2 ml", "5" → "5 ml", 5 → "5 ml")
 * @param {string|number} size - The size string or number to format
 * @returns {string} Formatted size with space between number and unit
 */
export function formatSize(size) {
  if (!size) return '';

  // Convert to string if it's a number
  const sizeStr = String(size);

  // If it already has units (e.g., "2ml"), add space between number and unit
  if (/[a-zA-Z]/.test(sizeStr)) {
    return sizeStr.replace(/(\d+)([a-zA-Z]+)/, '$1 $2');
  }

  // If it's just a number (e.g., "5" or 5), add " ml"
  return `${sizeStr} ml`;
}

/**
 * Extract brand name from product (standardized accessor)
 * @param {Object} product - The product object
 * @returns {string} Brand name or empty string
 */
export function getBrandName(product) {
  return product?.category?.name || '';
}

/**
 * Extract product title from product (standardized accessor)
 * @param {Object} product - The product object
 * @returns {string} Product title or empty string
 */
export function getProductTitle(product) {
  return product?.title || '';
}

/**
 * Get full product name (brand + title)
 * @param {Object} product - The product object
 * @returns {string} Full product name
 */
export function getFullProductName(product) {
  const brandName = getBrandName(product);
  const productTitle = getProductTitle(product);
  return brandName ? `${brandName} ${productTitle}` : productTitle;
}