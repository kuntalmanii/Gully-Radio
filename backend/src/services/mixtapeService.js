/**
 * services/mixtapeService.js
 * ──────────────────────────────────────────────────────────────
 * Business logic for mixtape operations.
 */

const { mixtapes, tracks } = require('../models')

class MixtapeService {
  /**
   * Retrieve all mixtapes with populated track counts.
   */
  async getAllMixtapes() {
    return mixtapes.map((m) => ({
      ...m,
      trackCount: (m.trackIds || []).length,
    }))
  }

  /**
   * Find a mixtape by its slug id or shortId.
   * @param {string} id
   */
  async getMixtapeById(id) {
    if (!id) return null
    const normalized = id.toLowerCase().trim()
    const mixtape = mixtapes.find((m) =>
      m.id.toLowerCase() === normalized ||
      m.shortId.toLowerCase() === normalized ||
      (m.slug && m.slug.toLowerCase() === normalized)
    )
    if (!mixtape) return null

    const resolvedTracks = (mixtape.trackIds || [])
      .map((tid) => tracks.find((t) => String(t.id) === String(tid)))
      .filter(Boolean)

    return {
      ...mixtape,
      trackCount: resolvedTracks.length,
      tracks: resolvedTracks,
    }
  }

  /**
   * Retrieve tracks specifically belonging to a mixtape.
   * @param {string} id
   */
  async getTracksForMixtape(id) {
    const mixtape = await this.getMixtapeById(id)
    if (!mixtape) return null
    return mixtape.tracks || []
  }

  /**
   * Search mixtapes by title, curator, genre, or description.
   * @param {string} query
   */
  async searchMixtapes(query) {
    if (!query) return []
    const q = query.toLowerCase().trim()
    return mixtapes.filter((m) =>
      m.title.toLowerCase().includes(q) ||
      m.curator.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    )
  }
}

module.exports = new MixtapeService()
