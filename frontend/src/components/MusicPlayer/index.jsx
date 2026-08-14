/**
 * MusicPlayer/index.jsx
 * ──────────────────────────────────────────────────────────────
 * Persistent bottom-bar player with Contemporary Devanagari Identity.
 *
 * Labels:
 *   अभी बज रहा है (Now Playing)
 *   कतार (Queue)
 *   चलाएँ / रोकें (Play / Pause)
 *   आवाज़ (Volume)
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
          style={{ padding: '0.2rem' }}
          type="button"
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
          <span className="queue-item-num" style={{ fontFamily: "'Inter', sans-serif" }}>
            {(i + 1).toString().padStart(2, '0')}
          </span>
          <span className="queue-item-title" title={track.title} style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.92rem' }}>
            {track.title}
          </span>
          <span className="queue-item-dur" style={{ fontFamily: "'Inter', sans-serif" }}>
            {formatTime(track.duration)}
          </span>
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 400 }}>
          <AudioVisualizer showControls={true} />
          <button
            onClick={() => setShowVisualizer(false)}
            style={{
              position: 'fixed',
              top: '1.8rem',
              left: '2rem',
              zIndex: 500,
              background: 'rgba(23, 21, 18, 0.85)',
              border: '1px solid rgba(215, 178, 122, 0.25)',
              color: '#F2E5CC',
              padding: '0.45rem 0.9rem',
              borderRadius: '2px',
              fontFamily: "'Noto Sans Devanagari', sans-serif",
              fontSize: '0.72rem',
              cursor: 'pointer',
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

            {/* ── Right: Progress + Volume + Visualizer + Queue ── */}
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
              <button
                className="player-btn"
                onClick={() => setShowVisualizer((v) => !v)}
                aria-label={showVisualizer ? 'दृश्य प्रभाव छिपाएँ' : 'दृश्य प्रभाव देखें'}
                title="दृश्य प्रभाव (Audio Visualizer)"
                type="button"
                style={{ color: showVisualizer ? '#D7B27A' : undefined }}
              >
                <Activity size={16} strokeWidth={1.5} />
              </button>
              <QueueButton
                queueLength={queue.length}
                isOpen={queueOpen}
                onClick={toggleQueue}
              />
            </div>

            {/* ── Mobile-only: full-width seek row ───────────── */}
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
