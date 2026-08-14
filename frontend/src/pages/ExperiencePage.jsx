/**
 * ExperiencePage
 * ──────────────────────────────────────────────────────────────
 * "Inside the photograph" — music experience view.
 * Contemporary Devanagari Visual Identity.
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

const FADE = {
  hidden:  { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

function CassetteVisual({ isPlaying, trackTitle, album }) {
  return (
    <div className="exp-cassette">
      <div className="cassette-body">
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />

        <div className="cassette-label-area">
          <span className="cassette-label-title" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
            राम रेडियो सेशन्स
          </span>
          <span className="cassette-label-sub" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>
            {album ?? 'वॉल्यूम 01 — शाम की धूप'}
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
      setError('ऑफ़लाइन टेप मोड सक्रिय')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTracksData()
  }, [fetchTracksData])

  useEffect(() => {
    if (tracks.length > 0) {
      loadQueue(tracks)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])

  const goBack = useCallback(() => {
    trigger({ to: '/' })
  }, [trigger])

  const handleTrackClick = useCallback((trackId) => {
    if (currentTrackId === trackId) {
      togglePlay()
    } else {
      playTrack(trackId)
    }
  }, [currentTrackId, togglePlay, playTrack])

  const currentTrack = tracks.find((t) => t.id === currentTrackId) ?? tracks[0]

  const sides = [
    {
      label: 'साइड A — चांदनी चौक से लाइव (1987)',
      tracks: tracks.filter((t) => t.side === 'A' || !t.side || t.id <= 4),
    },
    {
      label: 'साइड B — आधी रात के राग (1989)',
      tracks: tracks.filter((t) => t.side === 'B' || t.id > 4),
    },
  ]

  return (
    <div className="experience-page">
      <div className="exp-bg"      aria-hidden="true" />
      <div className="exp-overlay" aria-hidden="true" />
      <div className="exp-grain"   aria-hidden="true" />

      <div className="exp-content">

        {/* ── Header bar ──────────────────────────────────────── */}
        <motion.header className="exp-header" variants={FADE} custom={0.05} initial="hidden" animate="visible">
          <button
            className="exp-back-btn"
            onClick={goBack}
            aria-label="वापस मुख्य पृष्ठ पर चलें"
            type="button"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <ArrowLeft size={13} />
            <span>वापस गली में</span>
          </button>

          <span
            className="exp-header-title"
            style={{ fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif", fontSize: '1.2rem' }}
          >
            गली रेडियो
          </span>

          <span
            className="exp-header-sub"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.62rem' }}
          >
            मास्टर रील · 1987
          </span>
        </motion.header>

        {/* ── Main 2-column layout ────────────────────────────── */}
        <div className="exp-main">

          {/* ── Left — Deck player ──────────────────────────── */}
          <motion.div className="exp-deck" initial="hidden" animate="visible">
            <motion.div className="exp-deck-header" variants={FADE} custom={0.12}>
              <span className="exp-deck-label" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                अभी बज रहा है
              </span>
              <div className="exp-deck-status">
                <div className={`exp-status-dot ${isPlaying ? 'exp-status-dot--active' : ''}`} />
                <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                  {isLoading ? 'लोड हो रहा है...' : isPlaying ? 'चल रहा है' : 'रुका हुआ'}
                </span>
              </div>
            </motion.div>

            {/* Visual cassette */}
            <motion.div variants={FADE} custom={0.20}>
              <CassetteVisual
                isPlaying={isPlaying}
                trackTitle={currentTrack?.title}
                album={currentTrack?.album}
              />
            </motion.div>

            {/* Track info */}
            <motion.div className="exp-track-info" variants={FADE} custom={0.28}>
              <p
                className="exp-track-title"
                style={{ fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif", fontSize: '1.5rem' }}
              >
                {currentTrack?.title ?? 'एक गाना चुनिए'}
              </p>
              <p className="exp-track-artist" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.75rem' }}>
                {currentTrack?.artist ?? 'Ram Radio Sessions'} · {currentTrack?.album ?? '—'}
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div className="exp-progress" variants={FADE} custom={0.34}>
              <span className="exp-progress-time" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatTime(currentTime)}
              </span>
              <div
                className="exp-progress-track"
                role="progressbar"
                aria-valuenow={duration > 0 ? Math.round((currentTime / duration) * 100) : 0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="exp-progress-fill"
                  style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                >
                  <div className="exp-progress-dot" />
                </div>
              </div>
              <span className="exp-progress-time" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatTime(currentTrack?.duration ?? duration)}
              </span>
            </motion.div>

            {/* Controls */}
            <motion.div className="exp-controls" variants={FADE} custom={0.40}>
              <button className="exp-ctrl-btn" onClick={prevTrack} aria-label="पिछला गाना" type="button">
                <SkipBack size={16} />
              </button>

              <button
                className="exp-ctrl-btn exp-ctrl-btn--play"
                onClick={currentTrack ? togglePlay : undefined}
                aria-label={isPlaying ? 'रोकें' : 'चलाएँ'}
                disabled={isLoading || !currentTrack}
                type="button"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <button className="exp-ctrl-btn" onClick={nextTrack} aria-label="अगला गाना" type="button">
                <SkipForward size={16} />
              </button>
            </motion.div>
          </motion.div>

          {/* ── Right — Track listing ───────────────────────── */}
          <motion.div className="exp-tracklist" initial="hidden" animate="visible">

            <motion.div className="exp-tracklist-header" variants={FADE} custom={0.15}>
              <span className="exp-tracklist-label" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.72rem' }}>
                टेप पर दर्ज गाने
              </span>
              <div className="exp-tracklist-rule" />
            </motion.div>

            {/* Error & Retry Banner */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(168, 79, 53, 0.12)', border: '1px solid rgba(168, 79, 53, 0.3)', padding: '0.6rem 0.8rem', borderRadius: '2px', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.68rem', color: '#F2E5CC', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                  <AlertCircle size={12} color="#C56A3E" />
                  {error}
                </span>
                <button
                  onClick={fetchTracksData}
                  style={{ background: 'none', border: 'none', color: '#D7B27A', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                  type="button"
                >
                  <RefreshCw size={10} />
                  पुनः प्रयास
                </button>
              </div>
            )}

            {sides.map((side, si) => (
              <motion.div key={side.label} variants={FADE} custom={0.20 + si * 0.08}>
                <p className="exp-side-divider" style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.82rem' }}>
                  {side.label}
                </p>

                {side.tracks.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'rgba(215,178,122,0.4)', padding: '0.5rem 0', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                    इस साइड पर कोई गाना उपलब्ध नहीं है।
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
                        aria-label={`${isActive && isPlaying ? 'रोकें' : 'चलाएँ'} ${track.title}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleTrackClick(track.id)}
                      >
                        <span className="exp-track-num" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {track.side || 'A'}{track.num || String(track.id).padStart(2, '0')}
                        </span>
                        <span className="exp-track-name" style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.95rem' }}>
                          {track.title}
                        </span>
                        <span className="exp-track-dur" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {formatTime(track.duration)}
                        </span>
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
