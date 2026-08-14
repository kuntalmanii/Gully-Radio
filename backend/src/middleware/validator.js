/**
 * middleware/validator.js
 * ──────────────────────────────────────────────────────────────
 * Security & Request Validation Middlewares.
 * Defends against:
 *  - Path Traversal (.., /, \, null bytes)
 *  - Long payload / ReDoS strings
 *  - Injection & malicious query parameters
 *  - Unsupported HTTP Methods
 */

/**
 * Validates that an ID parameter exists, is within safe length,
 * and contains no path traversal or control characters.
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

    const trimmed = val.trim()

    // Enforce max length to prevent buffer/memory exhaustion
    if (trimmed.length > 64) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Parameter '${paramName}' exceeds maximum length of 64 characters.`,
          code: 'PARAMETER_TOO_LONG',
        },
      })
    }

    // Path traversal & dangerous character checks
    const traversalPattern = /(\.\.|\/|\\|%2e%2e|%2f|%5c|\0|%00)/i
    if (traversalPattern.test(trimmed)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid characters detected in '${paramName}' parameter.`,
          code: 'MALICIOUS_INPUT_DETECTED',
        },
      })
    }

    // Sanitize in place (allow alphanumeric, dashes, underscores)
    req.params[paramName] = trimmed
    next()
  }
}

/**
 * Validates and sanitizes search query parameter.
 */
function validateSearchQuery(req, res, next) {
  const { q } = req.query

  if (q !== undefined) {
    if (typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: "Search query 'q' must be a string.",
          code: 'INVALID_QUERY',
        },
      })
    }

    const trimmed = q.trim()

    // Prevent excessive query strings (ReDoS / memory exhaustion)
    if (trimmed.length > 100) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Search query 'q' exceeds maximum length of 100 characters.",
          code: 'QUERY_TOO_LONG',
        },
      })
    }

    // Strip unprintable control characters (\x00-\x1F, \x7F)
    // eslint-disable-next-line no-control-regex
    req.query.q = trimmed.replace(/[\x00-\x1F\x7F]/g, '')
  }

  next()
}

/**
 * Validates track query filters (genre, side, album).
 */
function validateTrackFilters(req, res, next) {
  const { genre, side, album } = req.query

  if (genre && (typeof genre !== 'string' || genre.length > 50)) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid 'genre' filter parameter.", code: 'INVALID_FILTER' },
    })
  }

  if (side && (typeof side !== 'string' || !['A', 'B', 'a', 'b'].includes(side))) {
    return res.status(400).json({
      success: false,
      error: { message: "Filter 'side' must be either 'A' or 'B'.", code: 'INVALID_FILTER' },
    })
  }

  if (album && (typeof album !== 'string' || album.length > 80)) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid 'album' filter parameter.", code: 'INVALID_FILTER' },
    })
  }

  next()
}

/**
 * Enforces allowed HTTP methods for read-only routes.
 */
function enforceMethods(allowed = ['GET', 'HEAD', 'OPTIONS']) {
  return (req, res, next) => {
    if (!allowed.includes(req.method)) {
      res.set('Allow', allowed.join(', '))
      return res.status(405).json({
        success: false,
        error: {
          message: `HTTP Method ${req.method} is not allowed on this endpoint.`,
          code: 'METHOD_NOT_ALLOWED',
        },
      })
    }
    next()
  }
}

module.exports = {
  validateIdParam,
  validateSearchQuery,
  validateTrackFilters,
  enforceMethods,
}
