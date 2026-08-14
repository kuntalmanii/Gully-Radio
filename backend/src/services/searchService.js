/**
 * services/searchService.js
 * ──────────────────────────────────────────────────────────────
 * Unified search service querying both tracks and mixtapes.
 */

const trackService = require('./trackService')
const mixtapeService = require('./mixtapeService')

class SearchService {
  /**
   * Search across both tracks and mixtapes.
   * @param {string} query
   */
  async search(query) {
    if (!query || query.trim() === '') {
      return {
        query: '',
        totalResults: 0,
        tracks: [],
        mixtapes: [],
      }
    }

    const [matchedTracks, matchedMixtapes] = await Promise.all([
      trackService.searchTracks(query),
      mixtapeService.searchMixtapes(query),
    ])

    return {
      query: query.trim(),
      totalResults: matchedTracks.length + matchedMixtapes.length,
      tracks: matchedTracks,
      mixtapes: matchedMixtapes,
    }
  }
}

module.exports = new SearchService()
