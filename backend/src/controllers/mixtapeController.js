/**
 * controllers/mixtapeController.js
 * ──────────────────────────────────────────────────────────────
 * Mixtape endpoints controller.
 */

const { mixtapeService } = require('../services')

/**
 * GET /api/mixtapes
 */
async function getAllMixtapes(_req, res, next) {
  try {
    const mixtapes = await mixtapeService.getAllMixtapes()

    res.status(200).json({
      success: true,
      data: {
        count: mixtapes.length,
        mixtapes,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/mixtapes/:id
 */
async function getMixtapeById(req, res, next) {
  try {
    const { id } = req.params
    const mixtape = await mixtapeService.getMixtapeById(id)

    if (!mixtape) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Mixtape with id '${id}' was not found.`,
          code: 'MIXTAPE_NOT_FOUND',
        },
      })
    }

    res.status(200).json({
      success: true,
      data: mixtape,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/mixtapes/:id/tracks
 */
async function getTracksForMixtape(req, res, next) {
  try {
    const { id } = req.params
    const mixtape = await mixtapeService.getMixtapeById(id)

    if (!mixtape) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Mixtape with id '${id}' was not found.`,
          code: 'MIXTAPE_NOT_FOUND',
        },
      })
    }

    res.status(200).json({
      success: true,
      data: {
        mixtapeId: mixtape.id,
        mixtapeTitle: mixtape.title,
        count: mixtape.tracks.length,
        tracks: mixtape.tracks,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllMixtapes,
  getMixtapeById,
  getTracksForMixtape,
}
