/**
 * services/trackService.js
 * ──────────────────────────────────────────────────────────────
 * Business logic for track operations.
 */

const { tracks } = require('../models')

class TrackService {
  /**
   * Retrieve all tracks with optional filters.
   * @param {Object} filters - Optional filters: genre, side, album
   */
  async getAllTracks(filters = {}) {
    let result = [...tracks]

    if (filters.genre) {
      const g = filters.genre.toLowerCase()
      result = result.filter((t) => t.genre.toLowerCase().includes(g))
    }

    if (filters.side) {
      const s = filters.side.toUpperCase()
      result = result.filter((t) => t.side === s)
    }

    if (filters.album) {
      const a = filters.album.toLowerCase()
      result = result.filter((t) => t.album.toLowerCase().includes(a))
    }

    return result
  }

  /**
   * Find a track by numerical or string ID.
   * @param {string|number} id
   */
  async getTrackById(id) {
    const numId = parseInt(id, 10)
    const track = tracks.find((t) => t.id === numId || String(t.id) === String(id))
    return track || null
  }

  /**
   * Search tracks by title, artist, or genre.
   * @param {string} query
   */
  async searchTracks(query) {
    if (!query) return []
    const q = query.toLowerCase().trim()
    return tracks.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q)
    )
  }
}

module.exports = new TrackService()
