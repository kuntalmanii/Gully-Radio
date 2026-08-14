/**
 * ExperiencePage
 * ──────────────────────────────────────────────────────────────
 * The "inside the photograph" — music experience view.
 * Reached via the cinematic transition from the hero.
 *
 * Visual world preserved: same hero-street.jpg background,
 * zoomed and panned to focus on the RAM Radio cassette shop.
 *
 * No audio functionality yet — Phase 3 will wire the backend.
 */

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  SkipBack, Rewind, Pause, Play,
  FastForward, SkipForward, ArrowLeft
} from 'lucide-react'
import { useCinematicTransition } from '../components/CinematicTransition'
import '../styles/experience.css'

/* ── Track data (visual only) ─────────────────────────────────── */
const SIDES = [
  {
    label: 'SIDE A',
    tracks: [
      { id: 1,  title: 'Teri Yaad (Extended Mix)',  duration: '4:23' },
      { id: 2,  title: 'Gully Nights',              duration: '3:45' },
      { id: 3,  title: 'Cassette Rain',             duration: '5:12' },
      { id: 4,  title: 'Radio Silence',             duration: '3:58' },
    ],
  },
  {
    label: 'SIDE B',
    tracks: [
      { id: 5,  title: 'Street Echoes',             duration: '4:10' },
      { id: 6,  title: 'Golden Hours',              duration: '6:02' },
      { id: 7,  title: 'Late Night Raga',           duration: '4:44' },
      { id: 8,  title: 'The Last Station',          duration: '5:33' },
    ],
  },
]

const FADE = {
  hidden:  { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ── Cassette visual ──────────────────────────────────────────── */
function CassetteVisual({ isPlaying }) {
  return (
    <div className="exp-cassette">
      <div className="cassette-body">
        {/* Corner holes */}
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />
        <div className="cassette-corner-hole" />

        {/* Label */}
        <div className="cassette-label-area">
          <span className="cassette-label-title">RAM RADIO SESSIONS</span>
          <span className="cassette-label-sub">Vol. 01 — Golden Hours</span>
        </div>

        {/* Reels */}
        <div className="cassette-reels">
          <div className={`cassette-reel ${isPlaying ? 'cassette-reel--spinning' : ''}`} />
          <div className="cassette-tape-bridge" />
          <div className={`cassette-reel ${isPlaying ? 'cassette-reel--spinning-slow' : ''}`} />
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ExperiencePage() {
  const [activeTrack, setActiveTrack] = useState(1)
  const [isPlaying,   setIsPlaying]   = useState(true)

  const { trigger } = useCinematicTransition()

  /* Back to hero — reverse cinematic transition */
  const goBack = useCallback(() => {
    trigger({ to: '/' })
  }, [trigger])

  const currentTrack = SIDES.flatMap((s) => s.tracks).find((t) => t.id === activeTrack)

  return (
    <div className="exp-page">
      {/* Atmospheric background */}
      <div className="exp-bg"       aria-hidden="true" />
      <div className="exp-bg-grade" aria-hidden="true" />

      <div className="exp-layout">
        {/* ── Content ──────────────────────────────────────────── */}
        <div className="exp-body">

          {/* ── Left — Player ──────────────────────────────────── */}
          <motion.div
            className="exp-player"
            initial="hidden"
            animate="visible"
          >
            {/* Back link */}
            <motion.button
              variants={FADE}
              custom={0.0}
              onClick={goBack}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(215,178,122,0.45)',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'color 0.25s ease',
                padding: 0,
                width: 'fit-content',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(215,178,122,0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(215,178,122,0.45)')}
              aria-label="Return to hero"
            >
              <ArrowLeft size={12} />
              <span>Back to the street</span>
            </motion.button>

            {/* Now playing label */}
            <motion.p className="exp-now-playing-label" variants={FADE} custom={0.1}>
              Now Spinning
            </motion.p>

            {/* Cassette */}
            <motion.div variants={FADE} custom={0.2}>
              <CassetteVisual isPlaying={isPlaying} />
            </motion.div>

            {/* Track info */}
            <motion.div className="exp-track-info" variants={FADE} custom={0.3}>
              <p className="exp-track-title">{currentTrack?.title ?? '—'}</p>
              <p className="exp-track-artist">Ram Radio Sessions · Vol. 01</p>
            </motion.div>

            {/* Progress */}
            <motion.div className="exp-progress" variants={FADE} custom={0.35}>
              <span className="exp-progress-time">1:42</span>
              <div className="exp-progress-track" role="progressbar" aria-valuenow={38} aria-valuemin={0} aria-valuemax={100}>
                <div className="exp-progress-fill">
                  <div className="exp-progress-dot" />
                </div>
              </div>
              <span className="exp-progress-time" style={{ textAlign: 'right' }}>
                {currentTrack?.duration ?? '—'}
              </span>
            </motion.div>

            {/* Controls */}
            <motion.div className="exp-controls" variants={FADE} custom={0.4}>
              <button className="exp-ctrl-btn" aria-label="Previous track">
                <SkipBack size={16} />
              </button>
              <button className="exp-ctrl-btn" aria-label="Rewind">
                <Rewind size={16} />
              </button>
              <button
                className="exp-ctrl-btn exp-ctrl-btn--play"
                onClick={() => setIsPlaying((v) => !v)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button className="exp-ctrl-btn" aria-label="Fast forward">
                <FastForward size={16} />
              </button>
              <button className="exp-ctrl-btn" aria-label="Next track">
                <SkipForward size={16} />
              </button>
            </motion.div>
          </motion.div>

          {/* ── Right — Track listing ──────────────────────────── */}
          <motion.div
            className="exp-tracklist"
            initial="hidden"
            animate="visible"
          >
            <motion.div className="exp-tracklist-header" variants={FADE} custom={0.15}>
              <span className="exp-tracklist-label">On the Tape</span>
              <div className="exp-tracklist-rule" />
            </motion.div>

            {SIDES.map((side, si) => (
              <motion.div key={side.label} variants={FADE} custom={0.2 + si * 0.1}>
                <p className="exp-side-divider">{side.label}</p>
                {side.tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`exp-track-row${activeTrack === track.id ? ' exp-track-row--active' : ''}`}
                    onClick={() => { setActiveTrack(track.id); setIsPlaying(true) }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play ${track.title}`}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveTrack(track.id)}
                  >
                    <span className="exp-track-num">
                      {side.label[5]}{track.id.toString().padStart(2, '0')}
                    </span>
                    <span className="exp-track-name">{track.title}</span>
                    <span className="exp-track-dur">{track.duration}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
