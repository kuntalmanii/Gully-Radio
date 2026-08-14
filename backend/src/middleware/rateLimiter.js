/**
 * middleware/rateLimiter.js
 * ──────────────────────────────────────────────────────────────
 * Express rate limiter middleware.
 */

const rateLimit = require('express-rate-limit')
const config = require('../config')

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP. Please try again in a few minutes.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
})

module.exports = apiLimiter
