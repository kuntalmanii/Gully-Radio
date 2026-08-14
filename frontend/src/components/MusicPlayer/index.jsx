/**
 * MusicPlayer/index.jsx
 * ──────────────────────────────────────────────────────────────
 * High-End Analog Persistent Player with Balanced 3-Section Layout.
 *
 * Layout:
 *  - Left: Track Info (Cover, Title, Artist, Favorite Heart)
 *  - Center: Playback Controls (Previous, Play/Pause, Next) + Timeline Scrub Bar
 *  - Right: Audio Visualizer + Volume Slider + Queue Drawer
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity } from 'lucide-react'
import { useAudio } from '../../contexts/AudioContext'
import { getAllTracks } from '../../services/musicService'
import { formatTime } from './ProgressBar'
import AudioVisualizer from '../AudioVisualizer'

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
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      role="listbox"
      aria-label="गानों की कतार"
    >
      <div className="queue-panel-header">
        <span className="queue-panel-label" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
          कतार · {queue.length} गाने
        </span>
        <button
          className="player-btn"
          onClick={onClose}
          aria-label="कतार बंद करें"
          style={{ padding: '0.25rem', fontSize: '0.8rem' }}
          type="button"
        >
          ✕
        </button>
      </div>

      <div className="queue-panel-list">
        {queue.map((track, i) => (
          <div
            key={track.id}
            className={`queue-item${String(currentTrackId) === String(track.id) ? ' queue-item--active' : ''}`}
            role="option"
            aria-selected={String(currentTrackId) === String(track.id)}
            onClick={() => { onSelect(track.id); onClose() }}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { onSelect(track.id); onClose() } }}
          >
            <span className="queue-item-num" style={{ fontFamily: "'Inter', sans-serif" }}>
              {(i + 1).toString().padStart(2, '0')}
            </span>
            <div className="queue-item-info">
              <span className="queue-item-title" title={track.title} style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.88rem' }}>
                {track.title}
              </span>
              <span className="queue-item-artist" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.68rem', opacity: 0.6 }}>
                {track.artist}
              </span>
            </div>
            <span className="queue-item-dur" style={{ fontFamily: "'Inter', sans-serif" }}>
              {formatTime(track.duration)}
            </span>
          </div>
        ))}
      </div>
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
  const [showVisualizer, setShowVisualizer] = useState(false)

  const allTracks = getAllTracks()
  const currentTrack = (queue && queue.find((t) => String(t.id) === String(currentTrackId)))
    ?? allTracks.find((t) => String(t.id) === String(currentTrackId))
    ?? null

  useEffect(() => {
    if (currentTrackId) {
      document.body.classList.add('has-player')
    } else {
      document.body.classList.remove('has-player')
    }
    return () => document.body.classList.remove('has-player')
  }, [currentTrackId])

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
      {/* Visualizer Floating Overlay / Modal when enabled */}
      {showVisualizer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600 }}>
          <AudioVisualizer showControls={true} />
          <button
            onClick={() => setShowVisualizer(false)}
            style={{
              position: 'fixed',
              top: '1.8rem',
              left: '2rem',
              zIndex: 700,
              background: 'rgba(23, 21, 18, 0.88)',
              border: '1px solid rgba(215, 178, 122, 0.25)',
              color: '#F2E5CC',
              padding: '0.45rem 1rem',
              borderRadius: '3px',
              fontFamily: "'Noto Sans Devanagari', sans-serif",
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
            type="button"
          >
            ✕ दृश्य प्रभाव बंद करें
          </button>
        </div>
      )}

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
            aria-label="संगीत प्लेयर (Music player)"
            initial={{ y: 110, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{    y: 110, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top Amber Ambient Highlight Line */}
            <div className="player-top-glow" aria-hidden="true" />

            {/* ── Left: Track info ───────────────────────────── */}
            <div className="player-left-col">
              <TrackInfo track={currentTrack} isPlaying={isPlaying} />
            </div>

            {/* ── Center: Playback controls + Timeline ───────── */}
            <div className="player-center-col">
              <PlaybackControls
                isPlaying={isPlaying}
                isLoading={isLoading}
                onTogglePlay={togglePlay}
                onPrev={prevTrack}
                onNext={nextTrack}
              />
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seekTo}
              />
            </div>

            {/* ── Right: Visualizer + Volume + Queue ──────────── */}
            <div className="player-right-col">
              <button
                className={`player-btn player-vis-btn ${showVisualizer ? 'player-vis-btn--active' : ''}`}
                onClick={() => setShowVisualizer((v) => !v)}
                aria-label={showVisualizer ? 'दृश्य प्रभाव छिपाएँ' : 'दृश्य प्रभाव देखें'}
                title="दृश्य प्रभाव (Audio Visualizer)"
                type="button"
              >
                <Activity size={17} strokeWidth={1.6} />
              </button>

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

            {/* ── Mobile-only seek row ───────────────────────── */}
            <div className="player-mobile-seek">
              <span className="player-time" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatTime(currentTime)}
              </span>
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seekTo}
                showTime={false}
              />
              <span className="player-time player-time--right" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatTime(duration)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
