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

  if (!isOpen) return null

  return (
    <AnimatePresence>
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
              placeholder="गाना, कलाकार, मूड या शैली खोजें..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="खोज इनपुट"
            />
            {query && (
              <button
                className="search-clear-btn"
                onClick={() => setQuery('')}
                aria-label="खोज साफ़ करें"
                type="button"
              >
                <X size={16} />
              </button>
            )}
            <button
              className="search-close-btn"
              onClick={onClose}
              aria-label="खोज बंद करें"
              type="button"
            >
              रद्द करें
            </button>
          </div>

          {/* Results Area */}
          <div className="search-results-area">
            {!query ? (
              <div className="search-empty-state">
                <Music2 size={36} className="search-state-icon" />
                <p className="search-empty-title">गाना, कलाकार या मूड खोजें</p>
                <p className="search-empty-sub">उदाहरण: हीर, Ali Raza Shjr, सूफी, पंजाबी</p>
              </div>
            ) : filteredTracks.length === 0 ? (
              <div className="search-empty-state">
                <Disc3 size={36} className="search-state-icon" />
                <p className="search-empty-title">कुछ नहीं मिला।</p>
                <p className="search-empty-sub">खोज के लिए कोई अन्य शब्द आज़माएँ।</p>
              </div>
            ) : (
              <div className="search-results-list">
                <p className="search-results-count">
                  {filteredTracks.length} {filteredTracks.length === 1 ? 'गाना मिला' : 'गाने मिले'}
                </p>
                {filteredTracks.map((track) => {
                  const isActive = String(currentTrackId) === String(track.id)
                  return (
                    <div
                      key={track.id}
                      className={`search-result-row ${isActive ? 'search-result-row--active' : ''}`}
                      onClick={() => handleTrackSelect(track)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleTrackSelect(track)}
                    >
                      <div className="search-result-icon">
                        {isActive && isPlaying ? (
                          <Radio size={16} color="#D7B27A" />
                        ) : (
                          <Play size={16} />
                        )}
                      </div>

                      <div className="search-result-main">
                        <span className="search-result-title">{track.title}</span>
                        <span className="search-result-meta">
                          {track.artist} {track.album && `· ${track.album}`}
                        </span>
                      </div>

                      {track.genre && (
                        <span className="search-result-pill">{track.genre}</span>
                      )}

                      <span className="search-result-dur">
                        {formatTime(track.duration)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
