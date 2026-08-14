/**
 * middleware/notFound.js
 * ──────────────────────────────────────────────────────────────
 * 404 Route Not Found middleware.
 */

function notFoundHandler(req, res, _next) {
  res.status(404).json({
    success: false,
    error: {
      message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist.`,
      code: 'NOT_FOUND',
    },
  })
}

module.exports = notFoundHandler
