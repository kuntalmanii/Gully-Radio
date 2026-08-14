/**
 * MusicPlayer/index.jsx
 * ──────────────────────────────────────────────────────────────
 * Persistent bottom-bar player.
 * Rendered OUTSIDE <Routes> in App.jsx so it survives navigation.
 *
 * Desktop: single row — [Track Info] [Controls] [Progress + Volume]
 * Mobile:  two rows  — [Info + Controls] / [Full-width seek]
 *
 * Slides in from below when first track is loaded.
 * Does NOT autoplay — waits for user interaction.
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../contexts/AudioContext'
import { getAllTracks } from '../../services/musicService'
import { formatTime } from './ProgressBar'

import TrackInfo        from './TrackInfo'
import PlaybackControls from './PlaybackControls'
import ProgressBar      from './ProgressBar'
import VolumeControl    from './VolumeControl'
import QueueButton      from './QueueButton'
import './player.css'

/* ── Queue panel ──────────────────────────────────────────────── */
function QueuePanel({ queue, currentTrackId, onSelect, onClose }) {
  return (
    <motion.div
      className="player-queue-panel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      role="listbox"
      aria-label="Track queue"
    >
      <div className="queue-panel-header">
        <span className="queue-panel-label">Queue · {queue.length} tracks</span>
        <button
          className="player-btn"
          onClick={onClose}
          aria-label="Close queue"
          style={{ padding: '0.2rem' }}
        >
          ✕
        </button>
      </div>

      {queue.map((track, i) => (
        <div
          key={track.id}
          className={`queue-item${currentTrackId === track.id ? ' queue-item--active' : ''}`}
          role="option"
          aria-selected={currentTrackId === track.id}
          onClick={() => { onSelect(track.id); onClose() }}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') { onSelect(track.id); onClose() } }}
        >
          <span className="queue-item-num">{(i + 1).toString().padStart(2, '0')}</span>
          <span className="queue-item-title" title={track.title}>{track.title}</span>
          <span className="queue-item-dur">{formatTime(track.duration)}</span>
        </div>
      ))}
    </motion.div>
  )
}

/* ── Main player ──────────────────────────────────────────────── */
export default function MusicPlayer() {
  const {
    currentTrackId, isPlaying, isLoading,
    currentTime, duration,
    volume, isMuted,
    queue,
    togglePlay, prevTrack, nextTrack,
    seekTo, setVolume, toggleMute,
    playTrack,
  } = useAudio()

  const [queueOpen, setQueueOpen] = useState(false)

  /* Find the current track object */
  const allTracks   = getAllTracks()
  const currentTrack = allTracks.find((t) => t.id === currentTrackId) ?? null

  /* Add/remove body class for content padding compensation */
  useEffect(() => {
    if (currentTrackId) {
      document.body.classList.add('has-player')
    } else {
      document.body.classList.remove('has-player')
    }
    return () => document.body.classList.remove('has-player')
  }, [currentTrackId])

  /* Close queue on outside click */
  useEffect(() => {
    if (!queueOpen) return
    const close = (e) => {
      if (!e.target.closest('.player-queue-panel') && !e.target.closest('.player-queue-btn')) {
        setQueueOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [queueOpen])

  const toggleQueue = useCallback(() => setQueueOpen((v) => !v), [])

  return (
    <>
      {/* Queue panel */}
      <AnimatePresence>
        {queueOpen && (
          <QueuePanel
            queue={queue}
            currentTrackId={currentTrackId}
            onSelect={playTrack}
            onClose={() => setQueueOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Player bar — slides up on first track load */}
      <AnimatePresence>
        {currentTrackId && (
          <motion.div
            className="player-bar"
            role="region"
            aria-label="Music player"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{    y: 100, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Left: Track info ───────────────────────────── */}
            <TrackInfo track={currentTrack} isPlaying={isPlaying} />

            {/* ── Center: Playback controls ───────────────────── */}
            <PlaybackControls
              isPlaying={isPlaying}
              isLoading={isLoading}
              onTogglePlay={togglePlay}
              onPrev={prevTrack}
              onNext={nextTrack}
            />

            {/* ── Right: Progress + Volume + Queue ───────────── */}
            <div className="player-right">
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seekTo}
              />
              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={setVolume}
                onMuteToggle={toggleMute}
              />
              <QueueButton
                queueLength={queue.length}
                isOpen={queueOpen}
                onClick={toggleQueue}
              />
            </div>

            {/* ── Mobile-only: full-width seek row ───────────── */}
            <div className="player-mobile-seek">
              <span className="player-time">{formatTime(currentTime)}</span>
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seekTo}
                showTime={false}
              />
              <span className="player-time player-time--right">{formatTime(duration)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
