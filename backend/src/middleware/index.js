/**
 * middleware/index.js
 * ──────────────────────────────────────────────────────────────
 * Unified middleware exporter.
 */

const rateLimiter = require('./rateLimiter')
const {
  validateIdParam,
  validateSearchQuery,
  validateTrackFilters,
  enforceMethods,
} = require('./validator')
const notFoundHandler = require('./notFound')
const errorHandler = require('./errorHandler')

module.exports = {
  rateLimiter,
  validateIdParam,
  validateSearchQuery,
  validateTrackFilters,
  enforceMethods,
  notFoundHandler,
  errorHandler,
}
