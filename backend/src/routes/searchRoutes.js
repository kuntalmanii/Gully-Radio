/**
 * routes/searchRoutes.js
 * ──────────────────────────────────────────────────────────────
 * Unified search routing with security validation.
 */

const { Router } = require('express')
const { searchController } = require('../controllers')
const { validateSearchQuery, enforceMethods } = require('../middleware')

const router = Router()

// Restrict to safe read-only methods
router.use(enforceMethods(['GET', 'HEAD', 'OPTIONS']))

// GET /api/search?q=
router.get('/', validateSearchQuery, searchController.search)

module.exports = router
