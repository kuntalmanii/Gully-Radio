/**
 * middleware/index.js
 * ──────────────────────────────────────────────────────────────
 * Unified middleware exporter.
 */

const rateLimiter = require('./rateLimiter')
const { validateIdParam, validateSearchQuery } = require('./validator')
const notFoundHandler = require('./notFound')
const errorHandler = require('./errorHandler')

module.exports = {
  rateLimiter,
  validateIdParam,
  validateSearchQuery,
  notFoundHandler,
  errorHandler,
}
