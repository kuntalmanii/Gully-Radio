/**
 * routes/healthRoutes.js
 * ──────────────────────────────────────────────────────────────
 * Health check router.
 */

const { Router } = require('express')
const { healthController } = require('../controllers')

const router = Router()

router.get('/', healthController.getHealth)

module.exports = router
