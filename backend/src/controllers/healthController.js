/**
 * controllers/healthController.js
 * ──────────────────────────────────────────────────────────────
 * Health check endpoint handler.
 */

function getHealth(_req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'gully-radio-api',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  })
}

module.exports = {
  getHealth,
}
