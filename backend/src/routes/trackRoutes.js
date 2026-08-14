/**
 * routes/trackRoutes.js
 * ──────────────────────────────────────────────────────────────
 * Track endpoints routing with security validation.
 */

const { Router } = require('express')
const { trackController } = require('../controllers')
const { validateIdParam, validateTrackFilters, enforceMethods } = require('../middleware')

const router = Router()

// Restrict to safe read-only methods
router.use(enforceMethods(['GET', 'HEAD', 'OPTIONS']))

// GET /api/tracks
router.get('/', validateTrackFilters, trackController.getAllTracks)

// GET /api/tracks/:id
router.get('/:id', validateIdParam('id'), trackController.getTrackById)

module.exports = router
