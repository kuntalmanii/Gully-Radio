/**
 * TrackInfo.jsx
 * ──────────────────────────────────────────────────────────────
 * Track info with cassette cover, spinning reels, typography & favorite heart.
 * Clicking track info opens the expanded Now Playing modal.
 */

import { useState, useEffect } from 'react'
import { Disc3, Heart, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFavorites, toggleFavorite } from '../../services/libraryStorage'

export default function TrackInfo({ track, isPlaying, onExpand }) {
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (!track?.id) return
    const favs = getFavorites()
    setIsFav(favs.includes(String(track.id)))

    const onFavUpdate = (e) => {
      const currentFavs = e.detail || getFavorites()
      setIsFav(currentFavs.includes(String(track.id)))
    }
    window.addEventListener('gully:favorites-updated', onFavUpdate)
    return () => window.removeEventListener('gully:favorites-updated', onFavUpdate)
  }, [track?.id])

  if (!track) return null

  const handleToggleFav = (e) => {
    e.stopPropagation()
    const nextState = toggleFavorite(track.id)
    setIsFav(nextState)
  }

  return (
    <div
      className="player-track-info"
      onClick={onExpand}
      role="button"
      tabIndex={0}
      aria-label="अब बज रहा है डेक खोलें (Open Now Playing)"
      onKeyDown={(e) => e.key === 'Enter' && onExpand && onExpand()}
      style={{ cursor: onExpand ? 'pointer' : 'default' }}
    >
      {/* Cover / Cassette placeholder */}
      <div className="player-cover" aria-hidden="true">
        {track.cover ? (
          <img src={track.cover} alt={track.album || track.title} />
        ) : (
          <>
            <div className="player-cover-fallback">
              <Disc3 size={22} />
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
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="player-track-title" title={track.title}>
            {track.title}
          </p>
          <p className="player-track-artist">
            {track.artist}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Favorite Heart Button */}
      <button
        className={`player-btn player-fav-btn ${isFav ? 'player-fav-btn--active' : ''}`}
        onClick={handleToggleFav}
        aria-label={isFav ? 'पसंदीदा से हटाएँ' : 'पसंदीदा में जोड़ें'}
        title={isFav ? 'पसंदीदा से हटाएँ' : 'पसंदीदा में जोड़ें'}
        type="button"
      >
        <Heart
          size={16}
          fill={isFav ? '#e85d5d' : 'none'}
          color={isFav ? '#e85d5d' : 'currentColor'}
          strokeWidth={1.6}
        />
      </button>

      {/* Expand Icon */}
      {onExpand && (
        <button
          className="player-btn player-expand-btn"
          onClick={(e) => { e.stopPropagation(); onExpand() }}
          aria-label="अब बज रहा है बड़ा करें"
          title="अब बज रहा है (Now Playing)"
          type="button"
        >
          <Maximize2 size={14} />
        </button>
      )}
    </div>
  )
}
