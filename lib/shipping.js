/**
 * Shipping calculation utilities
 */

// Shipping constants
export const FLAT_RATE_SHIPPING = 10;
export const FREE_SHIPPING_THRESHOLD = 50;

/**
 * Calculate shipping cost based on subtotal
 * @param {number} subtotal - Order subtotal in dollars
 * @returns {number} Shipping cost (0 if free shipping applies)
 */
export function calculateShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE_SHIPPING;
}

/**
 * Check if order qualifies for free shipping
 * @param {number} subtotal - Order subtotal in dollars
 * @returns {boolean} True if free shipping applies
 */
export function isFreeShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Calculate how much more is needed for free shipping
 * @param {number} subtotal - Order subtotal in dollars
 * @returns {number} Amount needed (0 if already qualifies)
 */
export function amountNeededForFreeShipping(subtotal) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return FREE_SHIPPING_THRESHOLD - subtotal;
}