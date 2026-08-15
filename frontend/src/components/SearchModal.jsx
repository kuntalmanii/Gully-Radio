/**
 * SearchModal.jsx
 * ──────────────────────────────────────────────────────────────
 * Fast, Accessible Global Search Modal with Real-Time Filtering.
 *
 * Supports search across:
 *  - Title (Hindi & English)
 *  - Artist
 *  - Album
 *  - Genre
 *  - Language
 *  - Mood
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Play, Radio, Music2, Disc3 } from 'lucide-react'
import { getAllTracks } from '../services/musicService'
import { useAudio } from '../contexts/AudioContext'
import { formatTime } from './MusicPlayer/ProgressBar'

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { currentTrackId, isPlaying, playTrack, togglePlay } = useAudio()

  const allTracks = useMemo(() => getAllTracks(), [])

  // Auto-focus on open & listen for Escape
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allTracks.filter((t) => {
      return (
        t.title?.toLowerCase().includes(q) ||
        t.titleEn?.toLowerCase().includes(q) ||
        t.artist?.toLowerCase().includes(q) ||
        t.album?.toLowerCase().includes(q) ||
        t.genre?.toLowerCase().includes(q) ||
        t.language?.toLowerCase().includes(q) ||
        t.mood?.toLowerCase().includes(q)
      )
    })
  }, [query, allTracks])

  const handleTrackSelect = useCallback((track) => {
    if (String(currentTrackId) === String(track.id)) {
      togglePlay()
    } else {
      playTrack(track.id, track)
    }
    onClose()
  }, [currentTrackId, togglePlay, playTrack, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="गाना खोजें (Search songs)"
        >
          <motion.div
            className="search-modal-box"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <div className="search-input-wrap">
              <Search size={20} className="search-icon" />
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search by song, artist, mood, or genre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search input"
              />
              {query && (
                <button
                  className="search-clear-btn"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  type="button"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results / Empty / Prompt State */}
            <div className="search-results-list" role="listbox">
              {query.trim() === '' ? (
                <div className="search-empty-state">
                  <span className="search-empty-icon">📻</span>
                  <p className="search-empty-text">
                    Type to discover archived tapes, rare vinyls & timeless melodies.
                  </p>
                </div>
              ) : filteredTracks.length === 0 ? (
                <div className="search-empty-state">
                  <span className="search-empty-icon">🍂</span>
                  <p className="search-empty-text">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                filteredTracks.map((track) => {
                  const isCurrent = String(currentTrackId) === String(track.id)
                  return (
                    <div
                      key={track.id}
                      className={`search-result-item ${isCurrent ? 'search-result-item--active' : ''}`}
                      onClick={() => handleTrackSelect(track)}
                      role="option"
                      aria-selected={isCurrent}
                    >
                      <div className="search-result-thumb">
                        {track.cover ? (
                          <img src={track.cover} alt={track.title} />
                        ) : (
                          <div className="search-result-thumb-placeholder">
                            <Music2 size={16} />
                          </div>
                        )}
                        <div className="search-result-play-overlay">
                          <Play size={12} fill="currentColor" />
                        </div>
                      </div>

                      <div className="search-result-info">
                        <div className="search-result-title-row">
                          <span className="search-result-title">{track.title}</span>
                          {track.titleEn && track.titleEn !== track.title && (
                            <span className="search-result-title-en">({track.titleEn})</span>
                          )}
                        </div>
                        <div className="search-result-meta">
                          <span className="search-result-artist">{track.artist}</span>
                          {track.album && (
                            <>
                              <span className="search-result-dot">•</span>
                              <span className="search-result-album">{track.album}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="search-result-tags">
                        {track.genre && <span className="search-tag">{track.genre}</span>}
                        {track.duration && (
                          <span className="search-tag search-tag--time">
                            {formatTime(track.duration)}
                          </span>
                        )}
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
