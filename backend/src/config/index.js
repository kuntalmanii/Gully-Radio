// ─── Config ──────────────────────────────────────────────────────
// Centralised configuration loaded from environment variables.
// Extend this file as the project grows.

module.exports = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
}
