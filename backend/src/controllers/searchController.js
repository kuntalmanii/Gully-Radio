/**
 * controllers/searchController.js
 * ──────────────────────────────────────────────────────────────
 * Unified search endpoint controller.
 */

const { searchService } = require('../services')

/**
 * GET /api/search?q=query
 */
async function search(req, res, next) {
  try {
    const { q } = req.query
    const results = await searchService.search(q || '')

    res.status(200).json({
      success: true,
      data: results,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  search,
}
