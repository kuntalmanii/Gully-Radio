/**
 * routes/mixtapeRoutes.js
 * ──────────────────────────────────────────────────────────────
 * Mixtape endpoints routing with security validation.
 */

const { Router } = require('express')
const { mixtapeController } = require('../controllers')
const { validateIdParam, enforceMethods } = require('../middleware')

const router = Router()

// Restrict to safe read-only methods
router.use(enforceMethods(['GET', 'HEAD', 'OPTIONS']))

// GET /api/mixtapes
router.get('/', mixtapeController.getAllMixtapes)

// GET /api/mixtapes/:id
router.get('/:id', validateIdParam('id'), mixtapeController.getMixtapeById)

// GET /api/mixtapes/:id/tracks
router.get('/:id/tracks', validateIdParam('id'), mixtapeController.getTracksForMixtape)

module.exports = router
