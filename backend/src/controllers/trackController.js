/**
 * controllers/trackController.js
 * ──────────────────────────────────────────────────────────────
 * Track endpoints controller.
 */

const { trackService } = require('../services')

/**
 * GET /api/tracks
 * Query params: ?genre=, ?side=, ?album=
 */
async function getAllTracks(req, res, next) {
  try {
    const { genre, side, album } = req.query
    const tracks = await trackService.getAllTracks({ genre, side, album })

    res.status(200).json({
      success: true,
      data: {
        count: tracks.length,
        tracks,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/tracks/:id
 */
async function getTrackById(req, res, next) {
  try {
    const { id } = req.params
    const track = await trackService.getTrackById(id)

    if (!track) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Track with id '${id}' was not found.`,
          code: 'TRACK_NOT_FOUND',
        },
      })
    }

    res.status(200).json({
      success: true,
      data: track,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllTracks,
  getTrackById,
}
