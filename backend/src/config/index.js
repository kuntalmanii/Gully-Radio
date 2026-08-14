/**
 * config/index.js
 * ──────────────────────────────────────────────────────────────
 * Centralized application configuration.
 */

require('dotenv').config()

const config = {
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,                 // Limit each IP to 200 requests per windowMs
  },
}

module.exports = config
