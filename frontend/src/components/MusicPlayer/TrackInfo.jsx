/**
 * TrackInfo.jsx
 * Cover placeholder (cassette icon), spinning reels when playing,
 * track title + artist. Framer Motion key-based fade on track change.
 */

import { Disc3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TrackInfo({ track, isPlaying }) {
  if (!track) return null

  return (
    <div className="player-track-info">
      {/* Cover / Cassette placeholder */}
      <div className="player-cover" aria-hidden="true">
        {track.cover ? (
          <img src={track.cover} alt={track.album} />
        ) : (
          <>
            <div className="player-cover-fallback">
              <Disc3 />
            </div>
            {/* Spinning reel overlay when playing */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  className="player-reels"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="player-reel player-reel--spinning" />
                  <div className="player-reel player-reel--spinning-slow" />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Track text — fades on track change via key */}
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          className="player-track-text"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="player-track-title" title={track.title}>
            {track.title}
          </p>
          <p className="player-track-artist">
            {track.artist}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
