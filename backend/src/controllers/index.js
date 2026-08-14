/**
 * controllers/index.js
 * ──────────────────────────────────────────────────────────────
 * Unified controllers exporter.
 */

const healthController = require('./healthController')
const trackController = require('./trackController')
const mixtapeController = require('./mixtapeController')
const searchController = require('./searchController')

module.exports = {
  healthController,
  trackController,
  mixtapeController,
  searchController,
}
