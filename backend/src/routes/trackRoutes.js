/**
 * routes/trackRoutes.js
 * ──────────────────────────────────────────────────────────────
 * Track endpoints routing.
 */

const { Router } = require('express')
const { trackController } = require('../controllers')
const { validateIdParam } = require('../middleware')

const router = Router()

// GET /api/tracks
router.get('/', trackController.getAllTracks)

// GET /api/tracks/:id
router.get('/:id', validateIdParam('id'), trackController.getTrackById)

module.exports = router
