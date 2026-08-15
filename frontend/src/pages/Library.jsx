/**
 * Library.jsx
 * ──────────────────────────────────────────────────────────────
 * Personal Music Library for Gully Radio.
 *
 * Features:
 *  - मेरी लाइब्रेरी (Title)
 *  - Tab views: All Songs, Favorites, Recently Played, Mixtapes
 *  - Instant category & genre filtering
 *  - Persistent Favorites & Recently Played via localStorage
 *  - Queue actions: Play Next, Add to Queue, Direct Play
 *  - Deep integration with global MusicPlayer & AudioVisualizer
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Play, Pause, Heart, ListPlus, Radio,
  Search, Disc3, Music2, Clock
} from 'lucide-react'

import Header from '../components/Header'
import { useAudio } from '../contexts/AudioContext'
import {
  getAllTracks,
  getTracksByCategory,
  MIXTAPES,
  getTracksByMixtape,
} from '../data/musicLibrary'
import {
  getFavorites,
  toggleFavorite,
  getRecentlyPlayed,
} from '../services/libraryStorage'
import { formatTime } from '../components/MusicPlayer/ProgressBar'
import '../styles/library.css'

const FADE = {
  hidden:  { opacity: 0, y: 16 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

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

export default function Library() {
  const {
    currentTrackId, isPlaying,
    togglePlay, playTrack, loadQueue, addToQueue, playNextInQueue,
  } = useAudio()

  const [activeTab, setActiveTab]         = useState('all') // 'all' | 'favorites' | 'recent' | 'mixtapes'
  const [selectedCat, setSelectedCat]     = useState('All')
  const [searchQuery, setSearchQuery]     = useState('')
  const [favorites, setFavorites]         = useState([])
  const [recentIds, setRecentIds]         = useState([])

  /* Sync favorites and recent tracks */
  const reloadStoredData = useCallback(() => {
    setFavorites(getFavorites())
    setRecentIds(getRecentlyPlayed())
  }, [])

  useEffect(() => {
    reloadStoredData()

    const onFavUpdate = (e) => setFavorites(e.detail || getFavorites())
    const onRecUpdate = (e) => setRecentIds(e.detail || getRecentlyPlayed())

    window.addEventListener('gully:favorites-updated', onFavUpdate)
    window.addEventListener('gully:recent-updated', onRecUpdate)

    return () => {
      window.removeEventListener('gully:favorites-updated', onFavUpdate)
      window.removeEventListener('gully:recent-updated', onRecUpdate)
    }
  }, [reloadStoredData])

  const allLibraryTracks = useMemo(() => getAllTracks(), [])

  /* Filtered tracks based on tab and category and search */
  const displayedTracks = useMemo(() => {
    let list = []

    if (activeTab === 'favorites') {
      list = allLibraryTracks.filter((t) => favorites.includes(String(t.id)))
    } else if (activeTab === 'recent') {
      list = recentIds
        .map((id) => allLibraryTracks.find((t) => String(t.id) === String(id)))
        .filter(Boolean)
    } else {
      list = getTracksByCategory(selectedCat)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.titleEn?.toLowerCase().includes(q) ||
          t.artist?.toLowerCase().includes(q) ||
          t.album?.toLowerCase().includes(q) ||
          t.genre?.toLowerCase().includes(q) ||
          t.mood?.toLowerCase().includes(q) ||
          t.language?.toLowerCase().includes(q)
      )
    }

    return list
  }, [activeTab, selectedCat, searchQuery, allLibraryTracks, favorites, recentIds])

  const handleTrackClick = useCallback((track) => {
    if (String(currentTrackId) === String(track.id)) {
      togglePlay()
    } else {
      // Load current playlist queue and start track
      loadQueue(displayedTracks)
      playTrack(track.id)
    }
  }, [currentTrackId, displayedTracks, loadQueue, playTrack, togglePlay])

  const handleToggleFav = useCallback((e, trackId) => {
    e.stopPropagation()
    toggleFavorite(trackId)
    setFavorites(getFavorites())
  }, [])

  const handleAddToQueue = useCallback((e, track) => {
    e.stopPropagation()
    addToQueue(track)
  }, [addToQueue])

  const _handlePlayNext = useCallback((e, track) => {
    e.stopPropagation()
    playNextInQueue(track)
  }, [playNextInQueue])


  return (
    <div className="library-page">
      <div className="library-bg" aria-hidden="true" />
      <Header />

      <main className="library-container">
        {/* ── Header ────────────────────────────────────────── */}
        <motion.header className="library-header" variants={FADE} custom={0.1} initial="hidden" animate="visible">
          <div className="library-title-area">
            <h1 className="library-title">मेरी लाइब्रेरी</h1>
            <p className="library-subtitle">आपके पसंदीदा गाने, एक जगह।</p>
          </div>
        </motion.header>

        {/* ── Search & Filter Input ─────────────────────────── */}
        <motion.div
          variants={FADE}
          custom={0.18}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(33, 28, 24, 0.5)',
            border: '1px solid rgba(215, 178, 122, 0.2)',
            borderRadius: '24px',
            padding: '0.5rem 1.2rem',
            maxWidth: '460px',
            marginBottom: '2rem',
          }}
        >
          <Search size={15} color="rgba(215, 178, 122, 0.5)" style={{ marginRight: '0.6rem' }} />
          <input
            type="text"
            placeholder="लाइब्रेरी में खोजें (शीर्षक, गायक, राग, भाव)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#F2E5CC',
              fontFamily: "'Noto Sans Devanagari', sans-serif",
              fontSize: '0.82rem',
              width: '100%',
            }}
          />
        </motion.div>

        {/* ── Navigation Tabs ───────────────────────────────── */}
        <motion.div className="library-nav-tabs" variants={FADE} custom={0.24} initial="hidden" animate="visible" role="tablist">
          <button
            className={`library-tab-btn ${activeTab === 'all' ? 'library-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('all')}
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
          >
            <Music2 size={14} />
            <span>सभी गाने</span>
            <span className="library-tab-badge">{allLibraryTracks.length}</span>
          </button>

          <button
            className={`library-tab-btn ${activeTab === 'favorites' ? 'library-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('favorites')}
            type="button"
            role="tab"
            aria-selected={activeTab === 'favorites'}
          >
            <Heart size={14} />
            <span>पसंदीदा</span>
            <span className="library-tab-badge">{favorites.length}</span>
          </button>

          <button
            className={`library-tab-btn ${activeTab === 'recent' ? 'library-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('recent')}
            type="button"
            role="tab"
            aria-selected={activeTab === 'recent'}
          >
            <Clock size={14} />
            <span>हाल ही में सुने गए</span>
            <span className="library-tab-badge">{recentIds.length}</span>
          </button>

          <button
            className={`library-tab-btn ${activeTab === 'mixtapes' ? 'library-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('mixtapes')}
            type="button"
            role="tab"
            aria-selected={activeTab === 'mixtapes'}
          >
            <Disc3 size={14} />
            <span>मिक्सटेप संग्रह</span>
            <span className="library-tab-badge">{MIXTAPES.length}</span>
          </button>
        </motion.div>

        {/* ── Category Chips (All Tab Only) ─────────────────── */}
        {activeTab === 'all' && (
          <motion.div className="library-categories" variants={FADE} custom={0.28} initial="hidden" animate="visible">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`library-cat-chip ${selectedCat === cat ? 'library-cat-chip--active' : ''}`}
                onClick={() => setSelectedCat(cat)}
                type="button"
              >
                {cat === 'All' ? 'सभी' : cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Mixtapes View ─────────────────────────────────── */}
        {activeTab === 'mixtapes' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.4rem' }}>
            {MIXTAPES.map((mix) => {
              const mixTracks = getTracksByMixtape(mix.id)
              return (
                <div
                  key={mix.id}
                  style={{
                    background: 'rgba(33, 28, 24, 0.45)',
                    border: '1px solid rgba(215, 178, 122, 0.12)',
                    borderRadius: '4px',
                    padding: '1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: mix.theme.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      {mix.genre} · {mix.year}
                    </span>
                    <h3 style={{ fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif", fontSize: '1.35rem', color: '#F2E5CC', margin: '0.3rem 0' }}>
                      {mix.title}
                    </h3>
                    <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.85rem', color: 'rgba(215, 178, 122, 0.65)', lineHeight: 1.6 }}>
                      {mix.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(215, 178, 122, 0.1)', paddingTop: '0.8rem' }}>
                    <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.75rem', color: 'rgba(215, 178, 122, 0.6)' }}>
                      {mixTracks.length} गाने
                    </span>
                    <button
                      onClick={() => {
                        loadQueue(mixTracks)
                        if (mixTracks.length > 0) playTrack(mixTracks[0].id)
                      }}
                      style={{
                        background: 'rgba(215, 178, 122, 0.15)',
                        border: '1px solid rgba(215, 178, 122, 0.3)',
                        color: '#F2E5CC',
                        fontFamily: "'Noto Sans Devanagari', sans-serif",
                        fontSize: '0.75rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                      type="button"
                    >
                      <Play size={12} />
                      मिक्सटेप चलाएँ
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* ── Tracklist View ─────────────────────────────────── */
          <div className="library-tracklist">
            {displayedTracks.length === 0 ? (
              <div className="library-empty-state">
                <Music2 size={36} style={{ color: 'var(--color-burnt-orange, #C66A3E)', opacity: 0.6, marginBottom: '0.6rem' }} />
                <p className="library-empty-title">
                  {activeTab === 'favorites'
                    ? 'कुछ गाने दिल के लिए रखिए।'
                    : activeTab === 'recent'
                    ? 'अभी तक कोई गाना नहीं बजा।'
                    : 'अभी कोई गाना नहीं।'}
                </p>
                <p className="library-empty-desc">
                  {activeTab === 'favorites'
                    ? 'किसी भी गाने पर दिल (♡) दबाकर उसे अपनी पसंदीदा सूची में जोड़ें।'
                    : activeTab === 'recent'
                    ? 'कोई भी गाना चलाकर अपनी सुनने की यात्रा शुरू करें।'
                    : 'अपना पहला पसंदीदा गाना चुनें या खोजें।'}
                </p>
              </div>
            ) : (
              displayedTracks.map((track, i) => {
                const isActive = String(currentTrackId) === String(track.id)
                const isFav = favorites.includes(String(track.id))

                return (
                  <div
                    key={track.id}
                    className={`library-track-row ${isActive ? 'library-track-row--active' : ''}`}
                    onClick={() => handleTrackClick(track)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrackClick(track)}
                    aria-label={`${isActive && isPlaying ? 'रोकें' : 'चलाएँ'} ${track.title}`}
                  >
                    <span className="library-track-num">
                      {isActive && isPlaying ? (
                        <Radio size={14} color="#D7B27A" />
                      ) : (
                        String(i + 1).padStart(2, '0')
                      )}
                    </span>

                    <div className="library-track-main">
                      <p className="library-track-title">{track.title}</p>
                      <p className="library-track-meta">
                        <span>{track.artist}</span>
                        {track.album && <span>· {track.album}</span>}
                        {track.mood && <span>· {track.mood}</span>}
                      </p>
                    </div>

                    <div className="library-track-tags">
                      {track.genre && <span className="library-mini-tag">{track.genre}</span>}
                      {track.language && <span className="library-mini-tag">{track.language}</span>}
                    </div>

                    <span className="library-track-dur">{formatTime(track.duration)}</span>

                    <div className="library-track-actions">
                      {/* Favorite Button */}
                      <button
                        className={`library-action-btn ${isFav ? 'library-action-btn--fav-active' : ''}`}
                        onClick={(e) => handleToggleFav(e, track.id)}
                        aria-label={isFav ? 'पसंदीदा से हटाएँ' : 'पसंदीदा में जोड़ें'}
                        title={isFav ? 'पसंदीदा से हटाएँ' : 'पसंदीदा में जोड़ें'}
                        type="button"
                      >
                        <Heart size={15} fill={isFav ? '#e85d5d' : 'none'} color={isFav ? '#e85d5d' : 'currentColor'} />
                      </button>

                      {/* Add to Queue Button */}
                      <button
                        className="library-action-btn"
                        onClick={(e) => handleAddToQueue(e, track)}
                        aria-label="कतार में जोड़ें"
                        title="कतार में जोड़ें (Add to Queue)"
                        type="button"
                      >
                        <ListPlus size={15} />
                      </button>

                      {/* Play / Pause indicator */}
                      <div className="library-action-btn" style={{ color: isActive ? '#D7B27A' : undefined }}>
                        {isActive && isPlaying ? <Pause size={15} /> : <Play size={15} />}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </main>
    </div>
  )
}
