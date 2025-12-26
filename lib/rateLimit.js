import { LRUCache } from 'lru-cache';

// Create rate limiter instances
const checkoutLimiter = new LRUCache({
  max: 500, // Maximum number of IPs to track
  ttl: 1000 * 60 * 60, // 1 hour in milliseconds
});

const cartLimiter = new LRUCache({
  max: 1000, // Maximum number of IPs to track
  ttl: 1000 * 60 * 60, // 1 hour in milliseconds
});

/**
 * Rate limit middleware for API routes
 * @param {Request} request - The incoming request
 * @param {number} limit - Maximum requests allowed per window
 * @param {LRUCache} limiter - The LRU cache instance to use
 * @returns {Object} - { success: boolean, limit: number, remaining: number, reset: Date }
 */
export function rateLimit(request, limit, limiter) {
  // Get IP address from request headers
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() :
             request.headers.get('x-real-ip') ||
             'unknown';

  // Get current request count for this IP
  const tokenCount = limiter.get(ip) || 0;
  const now = Date.now();
  const resetTime = new Date(now + (1000 * 60 * 60)); // 1 hour from now

  // Check if limit exceeded
  if (tokenCount >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTime,
    };
  }

  // Increment request count
  limiter.set(ip, tokenCount + 1);

  return {
    success: true,
    limit,
    remaining: limit - (tokenCount + 1),
    reset: resetTime,
  };
}

/**
 * Rate limit for checkout API (10 requests per hour)
 */
export function checkoutRateLimit(request) {
  return rateLimit(request, 10, checkoutLimiter);
}

/**
 * Rate limit for cart API (100 requests per hour)
 */
export function cartRateLimit(request) {
  return rateLimit(request, 100, cartLimiter);
}