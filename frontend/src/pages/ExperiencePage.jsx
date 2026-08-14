/**
 * ExperiencePage
 * ──────────────────────────────────────────────────────────────
 * "Inside the photograph" — music experience view.
 * Fetches track listing from Express API /api/tracks.
 * All audio state and controls connect to global AudioContext.
 */

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  SkipBack, Pause, Play,
  SkipForward, ArrowLeft, RefreshCw, AlertCircle
} from 'lucide-react'
import { useCinematicTransition } from '../components/CinematicTransition'
import { useAudio }               from '../contexts/AudioContext'
import { getTracks }              from '../services/api'
import { TRACKS as FALLBACK_TRACKS } from '../services/musicService'
import { formatTime }             from '../components/MusicPlayer/ProgressBar'
import '../styles/experience.css'

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
    loadQueue,
  } = useAudio()

  const [tracks, setTracks]       = useState(FALLBACK_TRACKS)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const { trigger } = useCinematicTransition()

  /* Fetch tracks from backend API */
  const fetchTracksData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getTracks()
      const fetchedTracks = res?.tracks || res || []
      if (fetchedTracks.length > 0) {
        setTracks(fetchedTracks)
      }
    } catch (err) {
      console.warn('[ExperiencePage] Backend fetch fallback:', err.message)
      setError('Signal Lost · Running in offline tape mode')
      // Fallback tracks remain intact
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTracksData()
  }, [fetchTracksData])

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
  const currentTrack = tracks.find((t) => t.id === currentTrackId)

  /* Track data organised by tape side */
  const sides = [
    { label: 'SIDE A', tracks: tracks.filter((t) => t.side === 'A') },
    { label: 'SIDE B', tracks: tracks.filter((t) => t.side === 'B') },
  ]

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
              <span className="exp-tracklist-label">On the Tape (API Connected)</span>
              <div className="exp-tracklist-rule" />
              {loading && (
                <span style={{ fontSize: '0.55rem', color: '#D7B27A', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Connecting...
                </span>
              )}
            </motion.div>

            {/* Error & Retry Banner */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(168, 79, 53, 0.12)', border: '1px solid rgba(168, 79, 53, 0.3)', padding: '0.6rem 0.8rem', borderRadius: '2px', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.6rem', color: '#F2E5CC', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={12} color="#C56A3E" />
                  {error}
                </span>
                <button
                  onClick={fetchTracksData}
                  style={{ background: 'none', border: 'none', color: '#D7B27A', fontSize: '0.58rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.12em' }}
                  type="button"
                >
                  <RefreshCw size={10} />
                  Retry
                </button>
              </div>
            )}

            {sides.map((side, si) => (
              <motion.div key={side.label} variants={FADE} custom={0.20 + si * 0.08}>
                <p className="exp-side-divider">{side.label}</p>

                {side.tracks.length === 0 ? (
                  <p style={{ fontSize: '0.65rem', color: 'rgba(215,178,122,0.4)', padding: '0.5rem 0' }}>
                    No tracks archived on this side.
                  </p>
                ) : (
                  side.tracks.map((track) => {
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
                          {track.side || 'A'}{track.num || String(track.id).padStart(2, '0')}
                        </span>
                        <span className="exp-track-name">{track.title}</span>
                        <span className="exp-track-dur">{formatTime(track.duration)}</span>
                      </div>
                    )
                  })
                )}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  )
}
