/**
 * ExperiencePage
 * ──────────────────────────────────────────────────────────────
 * "Inside the photograph" — music experience view.
 * All audio state and controls come from AudioContext.
 */

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  SkipBack, Pause, Play,
  SkipForward, ArrowLeft
} from 'lucide-react'
import { useCinematicTransition } from '../components/CinematicTransition'
import { useAudio }               from '../contexts/AudioContext'
import { TRACKS }                 from '../services/musicService'
import { formatTime }             from '../components/MusicPlayer/ProgressBar'
import '../styles/experience.css'

/* ── Track data organised by tape side ──────────────────────────*/
const SIDES = [
  { label: 'SIDE A', tracks: TRACKS.filter((t) => t.side === 'A') },
  { label: 'SIDE B', tracks: TRACKS.filter((t) => t.side === 'B') },
]

/* ── Framer Motion entrance variant ─────────────────────────────*/
const FADE = {
  hidden:  { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ── Cassette visual ─────────────────────────────────────────────*/
function CassetteVisual({ isPlaying, trackTitle, album }) {
  return (
    <div className="exp-cassette">
      <div className="cassette-body">
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />

        <div className="cassette-label-area">
          <span className="cassette-label-title">RAM RADIO SESSIONS</span>
          <span className="cassette-label-sub">
            {album ?? 'Vol. 01 — Golden Hours'}
          </span>
        </div>

        <div className="cassette-reels">
          <div className={`cassette-reel ${isPlaying ? 'cassette-reel--spinning' : ''}`} />
          <div className="cassette-tape-bridge" />
          <div className={`cassette-reel ${isPlaying ? 'cassette-reel--spinning-slow' : ''}`} />
        </div>
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────*/
export default function ExperiencePage() {
  const {
    currentTrackId, isPlaying, isLoading,
    currentTime, duration,
    togglePlay, prevTrack, nextTrack, playTrack,
    queue,
  } = useAudio()

  const { trigger } = useCinematicTransition()

  /* Reverse cinematic transition back to hero */
  const goBack = useCallback(() => {
    trigger({ to: '/' })
  }, [trigger])

  /* Play a track from the tracklist */
  const handleTrackClick = useCallback((trackId) => {
    if (currentTrackId === trackId) {
      togglePlay()
    } else {
      playTrack(trackId)
    }
  }, [currentTrackId, togglePlay, playTrack])

  /* Current track metadata */
  const currentTrack = TRACKS.find((t) => t.id === currentTrackId)

  return (
    <div className="exp-page">
      {/* Atmospheric background */}
      <div className="exp-bg"       aria-hidden="true" />
      <div className="exp-bg-grade" aria-hidden="true" />

      <div className="exp-layout">
        <div className="exp-body">

          {/* ── Left — Player ──────────────────────────────── */}
          <motion.div className="exp-player" initial="hidden" animate="visible">

            {/* Back to hero */}
            <motion.button
              variants={FADE}
              custom={0.0}
              onClick={goBack}
              className="exp-back-btn"
              aria-label="Return to hero"
            >
              <ArrowLeft size={12} />
              <span>Back to the street</span>
            </motion.button>

            {/* Now playing label */}
            <motion.p className="exp-now-playing-label" variants={FADE} custom={0.1}>
              Now Spinning
            </motion.p>

            {/* Cassette visual */}
            <motion.div variants={FADE} custom={0.2}>
              <CassetteVisual
                isPlaying={isPlaying}
                trackTitle={currentTrack?.title}
                album={currentTrack?.album}
              />
            </motion.div>

            {/* Track info */}
            <motion.div className="exp-track-info" variants={FADE} custom={0.28}>
              <p className="exp-track-title">
                {currentTrack?.title ?? 'Select a track'}
              </p>
              <p className="exp-track-artist">
                {currentTrack?.artist ?? 'Ram Radio Sessions'} · {currentTrack?.album ?? '—'}
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div className="exp-progress" variants={FADE} custom={0.34}>
              <span className="exp-progress-time">{formatTime(currentTime)}</span>
              <div className="exp-progress-track" role="progressbar"
                aria-valuenow={duration > 0 ? Math.round((currentTime / duration) * 100) : 0}
                aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="exp-progress-fill"
                  style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                >
                  <div className="exp-progress-dot" />
                </div>
              </div>
              <span className="exp-progress-time">
                {formatTime(currentTrack?.duration ?? duration)}
              </span>
            </motion.div>

            {/* Controls */}
            <motion.div className="exp-controls" variants={FADE} custom={0.40}>
              <button className="exp-ctrl-btn" onClick={prevTrack} aria-label="Previous track">
                <SkipBack size={16} />
              </button>

              <button
                className="exp-ctrl-btn exp-ctrl-btn--play"
                onClick={currentTrack ? togglePlay : undefined}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                disabled={isLoading || !currentTrack}
              >
                {isPlaying
                  ? <Pause  size={18} />
                  : <Play   size={18} />
                }
              </button>

              <button className="exp-ctrl-btn" onClick={nextTrack} aria-label="Next track">
                <SkipForward size={16} />
              </button>
            </motion.div>
          </motion.div>

          {/* ── Right — Track listing ───────────────────────── */}
          <motion.div className="exp-tracklist" initial="hidden" animate="visible">

            <motion.div className="exp-tracklist-header" variants={FADE} custom={0.15}>
              <span className="exp-tracklist-label">On the Tape</span>
              <div className="exp-tracklist-rule" />
            </motion.div>

            {SIDES.map((side, si) => (
              <motion.div key={side.label} variants={FADE} custom={0.20 + si * 0.08}>
                <p className="exp-side-divider">{side.label}</p>

                {side.tracks.map((track) => {
                  const isActive = currentTrackId === track.id
                  return (
                    <div
                      key={track.id}
                      className={`exp-track-row${isActive ? ' exp-track-row--active' : ''}`}
                      onClick={() => handleTrackClick(track.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${isActive && isPlaying ? 'Pause' : 'Play'} ${track.title}`}
                      onKeyDown={(e) => e.key === 'Enter' && handleTrackClick(track.id)}
                    >
                      <span className="exp-track-num">
                        {track.side}{track.num}
                      </span>
                      <span className="exp-track-name">{track.title}</span>
                      <span className="exp-track-dur">{formatTime(track.duration)}</span>
                    </div>
                  )
                })}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  )
}
