/**
 * middleware/errorHandler.js
 * ──────────────────────────────────────────────────────────────
 * Centralized error handling middleware.
 * Returns consistent structured error responses:
 * {
 *   success: false,
 *   error: {
 *     message: "...",
 *     code: "..."
 *   }
 * }
 */

const config = require('../config')

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500)
  const code = err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR')

  const response = {
    success: false,
    error: {
      message: err.message || 'An unexpected internal server error occurred.',
      code,
    },
  }

  // Include stack trace only in development if needed
  if (config.isDev && statusCode === 500) {
    response.error.stack = err.stack
  }

  res.status(statusCode).json(response)
}

module.exports = errorHandler
