/**
 * MixtapesModal.jsx
 * ──────────────────────────────────────────────────────────────
 * Frosted Glass Modal for Mixtapes Collection (Single-Page Experience).
 * Allows users to browse and play mixtapes directly without page scrolling.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, Disc3, Radio, Music2 } from 'lucide-react'
import { useAudio } from '../contexts/AudioContext'
import { MIXTAPES, getMixtapeQueue } from './CassetteShop/shopData'
import { formatTime } from './MusicPlayer/ProgressBar'

export default function MixtapesModal({ isOpen, onClose }) {
  const { currentTrackId, isPlaying, playTrack, togglePlay, loadQueue } = useAudio()
  const [selectedMixtape, setSelectedMixtape] = useState(MIXTAPES[0] || null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const handlePlayTrack = (track, mixtape) => {
    if (currentTrackId === track.id) {
      togglePlay()
      return
    }
    const queue = getMixtapeQueue(mixtape.id)
    if (queue && queue.length > 0) {
      loadQueue(queue)
    }
    playTrack(track.id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 800,
            background: 'rgba(12, 10, 8, 0.78)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 'min(780px, 94vw)',
            maxHeight: '82vh',
            background: 'rgba(22, 18, 15, 0.88)',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)',
            border: '1px solid rgba(232, 213, 181, 0.2)',
            borderRadius: '18px',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(243, 231, 208, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '1.2rem 1.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(232, 213, 181, 0.12)',
              background: 'rgba(33, 27, 23, 0.45)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Disc3 size={20} color="var(--color-burnt-orange, #C66A3E)" />
              <div>
                <h2
                  style={{
                    fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
                    fontSize: '1.25rem',
                    color: 'var(--color-warm-ivory, #F3E7D0)',
                    lineHeight: 1.2,
                  }}
                >
                  मिक्सटेप संग्रह (Mixtapes)
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.62rem',
                    letterSpacing: '0.18em',
                    color: 'rgba(232, 213, 181, 0.55)',
                    textTransform: 'uppercase',
                  }}
                >
                  CURATED CASSETTE ARCHIVES
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(232, 213, 181, 0.08)',
                border: '1px solid rgba(232, 213, 181, 0.15)',
                color: 'var(--color-warm-ivory, #F3E7D0)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              type="button"
              aria-label="बंद करें"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Content — Two Column View */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              flex: 1,
              overflow: 'hidden',
              minHeight: '380px',
            }}
          >
            {/* Left: Mixtapes List */}
            <div
              style={{
                borderRight: '1px solid rgba(232, 213, 181, 0.1)',
                padding: '0.8rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                background: 'rgba(16, 13, 11, 0.4)',
              }}
            >
              {MIXTAPES.map((tape) => {
                const isSelected = selectedMixtape?.id === tape.id
                return (
                  <button
                    key={tape.id}
                    onClick={() => setSelectedMixtape(tape)}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '10px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(169, 79, 53, 0.3) 0%, rgba(33, 27, 23, 0.6) 100%)'
                        : 'rgba(33, 27, 23, 0.25)',
                      border: isSelected
                        ? '1px solid rgba(198, 106, 62, 0.5)'
                        : '1px solid rgba(232, 213, 181, 0.06)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #2b231c 0%, #151310 100%)',
                        border: '1px solid rgba(215, 178, 122, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-burnt-orange, #C66A3E)',
                        flexShrink: 0,
                      }}
                    >
                      <Music2 size={16} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "'Tiro Devanagari Hindi', serif",
                          fontSize: '0.88rem',
                          color: isSelected ? 'var(--color-burnt-orange, #C66A3E)' : 'var(--color-warm-ivory, #F3E7D0)',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tape.titleHi || tape.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.65rem',
                          color: 'rgba(232, 213, 181, 0.5)',
                        }}
                      >
                        {tape.genre || 'Tape'} · {tape.tracks?.length || 0} गाने
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right: Selected Mixtape Detail & Tracklist */}
            <div
              style={{
                padding: '1.2rem 1.6rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
              }}
            >
              {selectedMixtape && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid rgba(232, 213, 181, 0.1)',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Tiro Devanagari Hindi', serif",
                          fontSize: '1.25rem',
                          color: 'var(--color-warm-ivory, #F3E7D0)',
                        }}
                      >
                        {selectedMixtape.titleHi || selectedMixtape.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Noto Sans Devanagari', sans-serif",
                          fontSize: '0.78rem',
                          color: 'rgba(232, 213, 181, 0.65)',
                          marginTop: '2px',
                        }}
                      >
                        {selectedMixtape.description || 'विशेष चुनिंदा कैसेट संग्रह'}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlayMixtape(selectedMixtape)}
                      style={{
                        background: 'linear-gradient(135deg, var(--color-terracotta, #A94F35) 0%, var(--color-burnt-orange, #C66A3E) 100%)',
                        border: '1px solid rgba(243, 231, 208, 0.25)',
                        borderRadius: '20px',
                        color: 'var(--color-warm-ivory, #F3E7D0)',
                        padding: '0.45rem 1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontFamily: "'Noto Sans Devanagari', sans-serif",
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(169, 79, 53, 0.4)',
                        flexShrink: 0,
                      }}
                      type="button"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>पूरा कैसेट चलाएँ</span>
                    </button>
                  </div>

                  {/* Tracklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {(selectedMixtape.tracks || []).map((t, idx) => {
                      const isActive = currentTrackId === t.id
                      return (
                        <div
                          key={t.id || idx}
                          onClick={() => handlePlayTrack(t, selectedMixtape)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 0.9rem',
                            borderRadius: '8px',
                            background: isActive
                              ? 'rgba(169, 79, 53, 0.2)'
                              : 'rgba(33, 27, 23, 0.3)',
                            border: isActive
                              ? '1px solid rgba(198, 106, 62, 0.4)'
                              : '1px solid rgba(232, 213, 181, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.7rem',
                                color: isActive ? 'var(--color-burnt-orange, #C66A3E)' : 'rgba(232, 213, 181, 0.4)',
                                width: '18px',
                              }}
                            >
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontFamily: "'Tiro Devanagari Hindi', serif",
                                  fontSize: '0.9rem',
                                  color: isActive ? 'var(--color-burnt-orange, #C66A3E)' : 'var(--color-warm-ivory, #F3E7D0)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {t.title}
                              </div>
                              <div
                                style={{
                                  fontFamily: "'Noto Sans Devanagari', sans-serif",
                                  fontSize: '0.68rem',
                                  color: 'rgba(232, 213, 181, 0.55)',
                                }}
                              >
                                {t.artist}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.68rem',
                                color: 'rgba(232, 213, 181, 0.4)',
                              }}
                            >
                              {formatTime(t.duration)}
                            </span>
                            <button
                              type="button"
                              style={{
                                background: isActive ? 'var(--color-burnt-orange, #C66A3E)' : 'rgba(232, 213, 181, 0.1)',
                                border: 'none',
                                color: 'var(--color-warm-ivory, #F3E7D0)',
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              {isActive && isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  )
}
