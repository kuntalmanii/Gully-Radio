/**
 * routes/mixtapeRoutes.js
 * ──────────────────────────────────────────────────────────────
 * Mixtape endpoints routing.
 */

const { Router } = require('express')
const { mixtapeController } = require('../controllers')
const { validateIdParam } = require('../middleware')

const router = Router()

// GET /api/mixtapes
router.get('/', mixtapeController.getAllMixtapes)

// GET /api/mixtapes/:id
router.get('/:id', validateIdParam('id'), mixtapeController.getMixtapeById)

// GET /api/mixtapes/:id/tracks
router.get('/:id/tracks', validateIdParam('id'), mixtapeController.getTracksForMixtape)

module.exports = router
