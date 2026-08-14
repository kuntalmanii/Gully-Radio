/**
 * models/index.js
 * ──────────────────────────────────────────────────────────────
 * Unified in-memory data models exporter.
 */

const tracks = require('./tracksData')
const mixtapes = require('./mixtapesData')

module.exports = {
  tracks,
  mixtapes,
}
