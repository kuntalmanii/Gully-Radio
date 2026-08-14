/**
 * routes/searchRoutes.js
 * ──────────────────────────────────────────────────────────────
 * Unified search routing.
 */

const { Router } = require('express')
const { searchController } = require('../controllers')
const { validateSearchQuery } = require('../middleware')

const router = Router()

// GET /api/search?q=
router.get('/', validateSearchQuery, searchController.search)

module.exports = router
