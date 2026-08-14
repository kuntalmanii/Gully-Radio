/**
 * AudioVisualizer.jsx
 * ──────────────────────────────────────────────────────────────
 * Audio-Reactive 2D Web Audio Visualizer.
 *
 * Visual Modes:
 *  1. ANALOG WAVE    - Oscilloscope tape ribbon
 *  2. CASSETTE PULSE - Rotating reel hubs & magnetic ripples
 *  3. FILM GRAIN     - Amplitude-reactive organic film grain & warmth
 *  4. PARTICLES      - Atmospheric embers reacting to high frequencies
 *  5. SOUND FIELD    - Deep perspective undulating audio field
 *
 * Reacts directly to currently playing track frequency/amplitude.
 */

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Activity } from 'lucide-react'
import useAudioAnalyzer from './useAudioAnalyzer'
import {
  renderAnalogWave,
  renderCassettePulse,
  renderFilmGrain,
  renderParticles,
  renderSoundField,
  initParticleSystem,
} from './visualizerUtils'
import './visualizer.css'

export const VISUAL_MODES = [
  { id: 'wave',      label: 'ANALOG WAVE' },
  { id: 'pulse',     label: 'CASSETTE PULSE' },
  { id: 'grain',     label: 'FILM GRAIN' },
  { id: 'particles', label: 'PARTICLES' },
  { id: 'field',     label: 'SOUND FIELD' },
]

export default function AudioVisualizer({
  mode: propMode,
  showControls = true,
  className = '',
  isAmbient = false,
}) {
  const canvasRef = useRef(null)
  const particlesRef = useRef(null)
  const animFrameRef = useRef(null)
  const timeRef = useRef(0)

  const [currentMode, setCurrentMode] = useState(propMode || 'wave')
  const [isExpanded, setIsExpanded]   = useState(false)
  const [meterBands, setMeterBands]   = useState({ bass: 0, mid: 0, high: 0, amp: 0 })

  const { getAnalyzerData } = useAudioAnalyzer()


  // Initialize particle pool once
  useEffect(() => {
    particlesRef.current = initParticleSystem(window.innerWidth < 768 ? 25 : 55)
  }, [])

  /* ── Canvas Render Loop (rAF) ────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let isRunning = true

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width  = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let meterThrottle = 0

    const render = () => {
      if (!isRunning) return

      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      if (width === 0 || height === 0) {
        animFrameRef.current = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)

      timeRef.current += prefersReducedMotion ? 0.005 : 0.016
      const time = timeRef.current

      // Capture audio analyzer bands & waveform
      const { timeData, bands } = getAnalyzerData()

      // Update UI meter occasionally
      meterThrottle++
      if (meterThrottle % 4 === 0) {
        setMeterBands({
          bass: Math.round(bands.bass * 100),
          mid:  Math.round(bands.mid * 100),
          high: Math.round(bands.high * 100),
          amp:  Math.round(bands.amplitude * 100),
        })
      }

      // Render Selected Mode
      switch (currentMode) {
        case 'wave':
          renderAnalogWave(ctx, width, height, timeData, bands, time)
          break
        case 'pulse':
          renderCassettePulse(ctx, width, height, bands, time)
          break
        case 'grain':
          renderFilmGrain(ctx, width, height, bands, time)
          break
        case 'particles':
          renderParticles(ctx, width, height, bands, time, particlesRef.current)
          break
        case 'field':
          renderSoundField(ctx, width, height, bands, time)
          break
        default:
          renderAnalogWave(ctx, width, height, timeData, bands, time)
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      isRunning = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [currentMode, getAnalyzerData])

  return (
    <>
      <div className={`visualizer-overlay ${className}`} aria-hidden="true">
        <canvas ref={canvasRef} className="visualizer-canvas" />

        {/* Floating Mode Selector */}
        {showControls && !isAmbient && (
          <div className="visualizer-controls" role="toolbar" aria-label="Visualizer modes">
            {VISUAL_MODES.map((m) => (
              <button
                key={m.id}
                className={`visualizer-mode-btn ${currentMode === m.id ? 'visualizer-mode-btn--active' : ''}`}
                onClick={() => setCurrentMode(m.id)}
                type="button"
              >
                {m.label}
              </button>
            ))}

            <button
              className="visualizer-toggle-btn"
              onClick={() => setIsExpanded(true)}
              aria-label="Expand visualizer deck"
              title="Expand Visualizer"
              type="button"
            >
              <Activity size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Expanded Visualizer Deck Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="visualizer-deck-modal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="deck-modal-header">
              <div>
                <span style={{ fontFamily: "'DM Sans'", fontSize: '0.58rem', letterSpacing: '0.24em', color: '#C56A3E', textTransform: 'uppercase' }}>
                  Web Audio Oscilloscope & Field
                </span>
                <h2 className="deck-modal-title">Audio Reactive Visualizer</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {VISUAL_MODES.map((m) => (
                    <button
                      key={m.id}
                      className={`visualizer-mode-btn ${currentMode === m.id ? 'visualizer-mode-btn--active' : ''}`}
                      onClick={() => setCurrentMode(m.id)}
                      type="button"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <button
                  className="visualizer-toggle-btn"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close modal"
                  type="button"
                  style={{ marginLeft: '1rem' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="deck-modal-canvas-wrap">
              <AudioVisualizer mode={currentMode} showControls={false} />
            </div>

            <div className="deck-modal-footer">
              <div className="deck-meter-group">
                <div className="deck-meter">
                  <span className="deck-meter-label">Bass · {meterBands.bass}%</span>
                  <div className="deck-meter-bar">
                    <div className="deck-meter-fill" style={{ width: `${meterBands.bass}%` }} />
                  </div>
                </div>

                <div className="deck-meter">
                  <span className="deck-meter-label">Mid · {meterBands.mid}%</span>
                  <div className="deck-meter-bar">
                    <div className="deck-meter-fill" style={{ width: `${meterBands.mid}%` }} />
                  </div>
                </div>

                <div className="deck-meter">
                  <span className="deck-meter-label">High · {meterBands.high}%</span>
                  <div className="deck-meter-bar">
                    <div className="deck-meter-fill" style={{ width: `${meterBands.high}%` }} />
                  </div>
                </div>

                <div className="deck-meter">
                  <span className="deck-meter-label">Amplitude · {meterBands.amp}%</span>
                  <div className="deck-meter-bar">
                    <div className="deck-meter-fill" style={{ width: `${meterBands.amp}%`, background: '#D7B27A' }} />
                  </div>
                </div>
              </div>

              <span style={{ fontFamily: "'DM Sans'", fontSize: '0.6rem', color: 'rgba(215,178,122,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                GULLY RADIO · ANALOG AUDIO ENGINE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
