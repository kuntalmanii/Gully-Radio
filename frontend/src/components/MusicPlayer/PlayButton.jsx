/**
 * PlayButton.jsx
 * Large circular play/pause button with loading spinner state.
 * Framer Motion AnimatePresence transitions between play/pause icons.
 */

import { Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PlayButton({ isPlaying, isLoading, onClick, size = 'md' }) {
  const iconSize = size === 'lg' ? 22 : 18

  return (
    <button
      className={`player-btn player-btn--play${size === 'lg' ? ' player-btn--play-lg' : ''}`}
      onClick={onClick}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      disabled={isLoading}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="loading"
            className="player-loading-ring"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          />
        ) : isPlaying ? (
          <motion.span
            key="pause"
            initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 15 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Pause size={iconSize} strokeWidth={1.5} />
          </motion.span>
        ) : (
          <motion.span
            key="play"
            initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: -15 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginLeft: 2 }}  /* optical centering for play triangle */
          >
            <Play size={iconSize} strokeWidth={1.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
