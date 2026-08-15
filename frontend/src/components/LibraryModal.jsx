/**
 * LibraryModal.jsx
 * ──────────────────────────────────────────────────────────────
 * Frosted Glass Modal for Library (Single-Page Experience).
 * Allows users to view Favorites, Recently Played, and browse all tracks
 * directly from the single page without vertical page scrolling.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, Heart, Clock, Music2, ListPlus, Radio } from 'lucide-react'
import { useAudio } from '../contexts/AudioContext'
import { getAllTracks, getTracksByCategory } from '../data/musicLibrary'
import { getFavorites, toggleFavorite, getRecentlyPlayed } from '../services/libraryStorage'
import { formatTime } from './MusicPlayer/ProgressBar'

const CATEGORIES = [
  'All',
  'Featured',
  'Recently Added',
  'Trending',
  'Late Night',
  'Chill',
  'Nostalgic',
  'Indie',
  'Instrumental',
  'Hindi',
]

export default function LibraryModal({ isOpen, onClose }) {
  const { currentTrackId, isPlaying, playTrack, togglePlay, loadQueue, addToQueue } = useAudio()
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'favorites' | 'recent'
  const [selectedCat, setSelectedCat] = useState('All')
  const [favorites, setFavorites] = useState([])
  const [recentIds, setRecentIds] = useState([])

  const reloadData = useCallback(() => {
    setFavorites(getFavorites())
    setRecentIds(getRecentlyPlayed())
  }, [])

  useEffect(() => {
    if (!isOpen) return
    reloadData()

    const onFavUpdate = (e) => setFavorites(e.detail || getFavorites())
    const onRecUpdate = (e) => setRecentIds(e.detail || getRecentlyPlayed())

    window.addEventListener('gully:favorites-updated', onFavUpdate)
    window.addEventListener('gully:recent-updated', onRecUpdate)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('gully:favorites-updated', onFavUpdate)
      window.removeEventListener('gully:recent-updated', onRecUpdate)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose, reloadData])

  const allLibraryTracks = useMemo(() => getAllTracks(), [])

  const displayedTracks = useMemo(() => {
    if (activeTab === 'favorites') {
      return allLibraryTracks.filter((t) => favorites.includes(String(t.id)))
    }
    if (activeTab === 'recent') {
      return recentIds
        .map((id) => allLibraryTracks.find((t) => String(t.id) === String(id)))
        .filter(Boolean)
    }
    return getTracksByCategory(selectedCat)
  }, [activeTab, selectedCat, allLibraryTracks, favorites, recentIds])

  const handlePlayTrack = (track) => {
    if (currentTrackId === track.id) {
      togglePlay()
      return
    }
    loadQueue(displayedTracks)
    playTrack(track.id)
  }

  const handleToggleFav = (e, trackId) => {
    e.stopPropagation()
    toggleFavorite(trackId)
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
            padding: '2rem 1.5rem',
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
          {/* Header */}
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
              <Music2 size={20} color="var(--color-burnt-orange, #C66A3E)" />
              <div>
                <h2
                  style={{
                    fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
                    fontSize: '1.25rem',
                    color: 'var(--color-warm-ivory, #F3E7D0)',
                    lineHeight: 1.2,
                  }}
                >
                  मेरी लाइब्रेरी (Library)
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
                  PERSONAL MUSIC COLLECTION
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

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.6rem',
              borderBottom: '1px solid rgba(232, 213, 181, 0.08)',
              background: 'rgba(16, 13, 11, 0.3)',
            }}
          >
            {[
              { id: 'all',       labelHi: 'सभी गाने', icon: Music2 },
              { id: 'favorites', labelHi: 'पसंदीदा', icon: Heart, count: favorites.length },
              { id: 'recent',    labelHi: 'हाल ही में', icon: Clock, count: recentIds.length },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  style={{
                    background: isActive ? 'rgba(169, 79, 53, 0.25)' : 'rgba(33, 27, 23, 0.4)',
                    border: isActive ? '1px solid rgba(198, 106, 62, 0.5)' : '1px solid rgba(232, 213, 181, 0.1)',
                    borderRadius: '20px',
                    padding: '0.4rem 0.9rem',
                    color: isActive ? 'var(--color-burnt-orange, #C66A3E)' : 'var(--color-warm-ivory, #F3E7D0)',
                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={13} />
                  <span>{tab.labelHi}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.62rem',
                        background: 'rgba(232, 213, 181, 0.15)',
                        padding: '0.05rem 0.35rem',
                        borderRadius: '8px',
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Categories Pill Bar (only in 'all' tab) */}
          {activeTab === 'all' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.6rem',
                overflowX: 'auto',
                borderBottom: '1px solid rgba(232, 213, 181, 0.06)',
              }}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCat === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    type="button"
                    style={{
                      background: isSelected ? 'var(--color-burnt-orange, #C66A3E)' : 'transparent',
                      border: isSelected ? 'none' : '1px solid rgba(232, 213, 181, 0.12)',
                      borderRadius: '12px',
                      padding: '0.2rem 0.65rem',
                      color: isSelected ? '#151310' : 'rgba(232, 213, 181, 0.7)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.68rem',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          )}

          {/* Track List */}
          <div
            style={{
              padding: '1rem 1.6rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
            }}
          >
            {displayedTracks.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: 'rgba(232, 213, 181, 0.5)',
                  fontFamily: "'Noto Sans Devanagari', sans-serif",
                  fontSize: '0.9rem',
                }}
              >
                इस सूची में अभी कोई गाना नहीं है।
              </div>
            ) : (
              displayedTracks.map((t, idx) => {
                const isActive = currentTrackId === t.id
                const isFav = favorites.includes(String(t.id))
                return (
                  <div
                    key={t.id || idx}
                    onClick={() => handlePlayTrack(t)}
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
                      <button
                        type="button"
                        style={{
                          background: isActive ? 'var(--color-burnt-orange, #C66A3E)' : 'rgba(232, 213, 181, 0.1)',
                          border: 'none',
                          color: 'var(--color-warm-ivory, #F3E7D0)',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        {isActive && isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
                      </button>

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
                          {t.artist} {t.genre ? `· ${t.genre}` : ''}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <button
                        onClick={(e) => handleToggleFav(e, t.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isFav ? '#e85d5d' : 'rgba(232, 213, 181, 0.4)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        type="button"
                        aria-label="पसंदीदा"
                      >
                        <Heart size={15} fill={isFav ? '#e85d5d' : 'none'} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToQueue(t)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(232, 213, 181, 0.4)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        type="button"
                        title="कतार में जोड़ें"
                      >
                        <ListPlus size={15} />
                      </button>

                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.68rem',
                          color: 'rgba(232, 213, 181, 0.4)',
                          minWidth: '2.5rem',
                          textAlign: 'right',
                        }}
                      >
                        {formatTime(t.duration)}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  )
}
