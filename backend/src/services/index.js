/**
 * services/index.js
 * ──────────────────────────────────────────────────────────────
 * Unified services exporter.
 */

const trackService = require('./trackService')
const mixtapeService = require('./mixtapeService')
const searchService = require('./searchService')

module.exports = {
  trackService,
  mixtapeService,
  searchService,
}
