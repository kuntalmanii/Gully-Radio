/**
 * services/mixtapeService.js
 * ──────────────────────────────────────────────────────────────
 * Business logic for mixtape operations.
 */

const { mixtapes } = require('../models')

class MixtapeService {
  /**
   * Retrieve all mixtapes.
   */
  async getAllMixtapes() {
    return [...mixtapes]
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
      m.shortId.toLowerCase() === normalized
    )
    return mixtape || null
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
   * Search mixtapes by title, curator, or genre.
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
