/**
 * NowPlayingModal.jsx
 * ──────────────────────────────────────────────────────────────
 * Immersive Full-Screen "Now Playing" Deck with Authentic Indian Aesthetic.
 *
 * Features:
 *  - Large analog cassette artwork with spinning tape reels
 *  - High-contrast Devanagari typography
 *  - Embedded live audio visualizer
 *  - Complete playback controls, volume, queue drawer toggle & favorites
 *  - Accessible with Escape key & click outside
 */

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, ListMusic, X
} from 'lucide-react'
import { formatTime } from './ProgressBar'
import AudioVisualizer from '../AudioVisualizer'
import { toggleFavorite, isFavorite } from '../../services/libraryStorage'

export default function NowPlayingModal({
  isOpen,
  onClose,
  track,
  isPlaying,
  isLoading,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onToggleQueue,
  queueLength,
}) {
  const isFav = track ? isFavorite(track.id) : false

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleFavClick = useCallback((e) => {
    e.stopPropagation()
    if (!track) return
    toggleFavorite(track.id)
  }, [track])

  if (!isOpen || !track) return null

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <AnimatePresence>
      <motion.div
        className="now-playing-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label="अब बज रहा है (Now Playing Deck)"
      >
        {/* Background ambient lighting */}
        <div className="now-playing-bg" aria-hidden="true" />

        <div className="now-playing-modal-box">
          {/* Header Bar */}
          <div className="now-playing-header">
            <div className="now-playing-tagline">
              <span className="now-playing-badge">अब बज रहा है</span>
              <span className="now-playing-sub">LECTURE TIME ARCHIVE</span>
            </div>

            <button
              className="now-playing-close-btn"
              onClick={onClose}
              aria-label="बंद करें (Close)"
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cassette Deck / Visualizer Centerpiece */}
          <div className="now-playing-deck">
            <div className={`now-playing-cassette ${isPlaying ? 'now-playing-cassette--playing' : ''}`}>
              <div className="np-cassette-shell">
                {/* Cassette Top Label */}
                <div className="np-cassette-label">
                  <span className="np-label-brand">लेक्चर Time · C-60</span>
                  <span className="np-label-side">{track.side || 'A'}</span>
                </div>

                {/* Cassette Window & Reels */}
                <div className="np-cassette-window">
                  <div className={`np-cassette-reel ${isPlaying ? 'np-cassette-reel--spin' : ''}`}>
                    <div className="np-reel-spokes" />
                  </div>
                  <div className="np-cassette-tape-bridge" />
                  <div className={`np-cassette-reel ${isPlaying ? 'np-cassette-reel--spin' : ''}`}>
                    <div className="np-reel-spokes" />
                  </div>
                </div>

                {/* Cassette Bottom Title */}
                <div className="np-cassette-title-bar">
                  <span className="np-track-name">{track.title}</span>
                  <span className="np-track-artist">{track.artist}</span>
                </div>
              </div>
            </div>

            {/* Embedded Live Waveform Audio Visualizer */}
            <div className="now-playing-vis-container">
              <AudioVisualizer mode="bars" height={80} showControls={false} />
            </div>
          </div>

          {/* Track Metadata */}
          <div className="now-playing-meta">
            <div className="now-playing-info">
              <h2 className="now-playing-title">{track.title}</h2>
              <p className="now-playing-artist">{track.artist}</p>
              {track.album && <p className="now-playing-album">एल्बम: {track.album}</p>}
            </div>

            <button
              className={`now-playing-fav-btn ${isFav ? 'now-playing-fav-btn--active' : ''}`}
              onClick={handleFavClick}
              aria-label={isFav ? 'पसंदीदा से हटाएँ' : 'पसंदीदा में जोड़ें'}
              type="button"
            >
              <Heart size={24} fill={isFav ? '#e85d5d' : 'none'} color={isFav ? '#e85d5d' : 'currentColor'} />
            </button>
          </div>

          {/* Scrubbable Timeline Progress Bar */}
          <div className="now-playing-progress-area">
            <div
              className="now-playing-progress-track"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const newTime = (clickX / rect.width) * duration
                onSeek(newTime)
              }}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={duration || 100}
              aria-valuenow={currentTime}
              aria-label="समय प्रगति"
              tabIndex={0}
            >
              <div
                className="now-playing-progress-fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="now-playing-progress-handle" />
              </div>
            </div>

            <div className="now-playing-time-row">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Primary Playback Controls */}
          <div className="now-playing-controls">
            <button
              className="now-playing-ctrl-btn"
              onClick={onPrev}
              aria-label="पिछला गाना"
              type="button"
            >
              <SkipBack size={22} />
            </button>

            <button
              className="now-playing-ctrl-btn now-playing-ctrl-btn--play"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'रोकें (Pause)' : 'चलाएँ (Play)'}
              disabled={isLoading}
              type="button"
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} style={{ marginLeft: '3px' }} />}
            </button>

            <button
              className="now-playing-ctrl-btn"
              onClick={onNext}
              aria-label="अगला गाना"
              type="button"
            >
              <SkipForward size={22} />
            </button>
          </div>

          {/* Secondary Actions (Volume & Queue) */}
          <div className="now-playing-bottom-row">
            {/* Volume */}
            <div className="now-playing-vol-group">
              <button
                className="now-playing-sub-btn"
                onClick={onMuteToggle}
                aria-label={isMuted ? 'ध्वनि चालू करें' : 'ध्वनि बंद करें'}
                type="button"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="now-playing-vol-slider"
                aria-label="आवाज़ स्तर"
              />
            </div>

            {/* Queue Toggle */}
            <button
              className="now-playing-queue-btn"
              onClick={onToggleQueue}
              type="button"
            >
              <ListMusic size={18} />
              <span>कतार ({queueLength})</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
