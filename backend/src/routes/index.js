/**
 * routes/index.js
 * ──────────────────────────────────────────────────────────────
 * Unified API router combining health, tracks, mixtapes, and search.
 */

const { Router } = require('express')
const healthRoutes = require('./healthRoutes')
const trackRoutes = require('./trackRoutes')
const mixtapeRoutes = require('./mixtapeRoutes')
const searchRoutes = require('./searchRoutes')

const router = Router()

router.use('/health', healthRoutes)
router.use('/tracks', trackRoutes)
router.use('/mixtapes', mixtapeRoutes)
router.use('/search', searchRoutes)

module.exports = router
