/**
 * middleware/validator.js
 * ──────────────────────────────────────────────────────────────
 * Request validation middlewares.
 */

/**
 * Validates that an ID parameter exists and is non-empty.
 */
function validateIdParam(paramName = 'id') {
  return (req, res, next) => {
    const val = req.params[paramName]
    if (!val || typeof val !== 'string' || val.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid or missing '${paramName}' parameter.`,
          code: 'INVALID_PARAMETER',
        },
      })
    }
    next()
  }
}

/**
 * Validates search query parameter.
 */
function validateSearchQuery(req, res, next) {
  const { q } = req.query
  if (q !== undefined && typeof q !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        message: "Search query 'q' must be a string.",
        code: 'INVALID_QUERY',
      },
    })
  }
  next()
}

module.exports = {
  validateIdParam,
  validateSearchQuery,
}
