/**
 * Discover.jsx
 * ──────────────────────────────────────────────────────────────
 * Editorial Music Discovery Experience.
 *
 * Headline:
 *   FOR THE NIGHTS
 *   YOU DON'T WANT
 *   TO END.
 *
 * Asymmetrical editorial layout with:
 *   - Search the Archive (connected to Express /api/search?q=)
 *   - Featured Track Spotlight (vinyl disc spinning, liner notes)
 *   - Recently Added (editorial list with timestamps)
 *   - Nostalgic Picks (tape highlight cards)
 *   - Late Night Tracks (mood indicators)
 *   - Hidden Gems (curator quotes & rare recordings)
 *
 * Fully connected to global AudioContext for playback.
 */

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Disc, Sparkles, Moon, Search, X, RefreshCw } from 'lucide-react'
import { useAudio } from '../contexts/AudioContext'
import { formatTime } from '../components/MusicPlayer/ProgressBar'
import Header from '../components/Header'
import { searchTracks, getTracks } from '../services/api'
import {
  FEATURED_TRACK,
  RECENTLY_ADDED,
  NOSTALGIC_PICKS,
  LATE_NIGHT_TRACKS,
  HIDDEN_GEMS,
  resolveDiscoverTrack,
} from '../services/discoverData'
import '../styles/discover.css'

const FADE_UP = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Discover() {
  const {
    currentTrackId, isPlaying,
    togglePlay, playTrack, loadQueue,
  } = useAudio()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  /* Live search handler debounced */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      setIsSearching(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await searchTracks(searchQuery)
        setSearchResults(res)
      } catch (err) {
        console.warn('[Discover] Search fallback:', err.message)
      } finally {
        setIsSearching(false)
      }
    }, 280)

    return () => clearTimeout(timer)
  }, [searchQuery])

  /* Play any track from Discover */
  const handlePlay = useCallback((rawTrack, trackList = null) => {
    const track = resolveDiscoverTrack(rawTrack)

    if (currentTrackId === track.id) {
      togglePlay()
      return
    }

    if (trackList && trackList.length > 0) {
      const fullQueue = trackList.map(resolveDiscoverTrack)
      loadQueue(fullQueue)
    }

    playTrack(track.id)
  }, [currentTrackId, togglePlay, playTrack, loadQueue])

  const isFeaturedActive = currentTrackId === FEATURED_TRACK.id

  return (
    <div className="discover-page">
      <div className="discover-bg-grid" aria-hidden="true" />
      <div className="discover-grain"   aria-hidden="true" />

      {/* Global Header */}
      <Header />

      <main className="discover-container">
        {/* ── Editorial Header ─────────────────────────────── */}
        <motion.header
          className="discover-header"
          initial="hidden"
          animate="visible"
        >
          <motion.div className="discover-issue-tag" variants={FADE_UP} custom={0.1}>
            <Sparkles size={13} />
            <span>Gully Radio Editorial · Live Synced</span>
          </motion.div>

          <motion.h1 className="discover-headline" variants={FADE_UP} custom={0.2}>
            <span>FOR THE NIGHTS</span>
            <span>YOU DON'T WANT</span>
            <span className="accent-line">TO END.</span>
          </motion.h1>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <motion.p className="discover-subhead" variants={FADE_UP} custom={0.35}>
              An analog catalogue of street recordings, unreleased master tapes,
              and forgotten midnight transmissions from another era.
            </motion.p>

            {/* Archive Search Bar (Connected to Express API) */}
            <motion.div
              variants={FADE_UP}
              custom={0.4}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(23, 21, 18, 0.75)',
                border: '1px solid rgba(215, 178, 122, 0.2)',
                borderRadius: '30px',
                padding: '0.4rem 1rem',
                minWidth: '280px',
              }}
            >
              <Search size={14} color="rgba(215, 178, 122, 0.5)" style={{ marginRight: '0.5rem' }} />
              <input
                type="text"
                placeholder="Search archive or tape..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#F2E5CC',
                  fontFamily: "'DM Sans'",
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  width: '100%',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'rgba(215,178,122,0.5)', cursor: 'pointer', padding: 0 }}
                  type="button"
                >
                  <X size={13} />
                </button>
              )}
            </motion.div>
          </div>
        </motion.header>

        {/* ── Live Search Results Drawer if searching ──────── */}
        {searchResults && searchQuery && (
          <section style={{ marginBottom: '4rem', background: 'rgba(24, 18, 14, 0.85)', border: '1px solid rgba(215, 178, 122, 0.2)', borderRadius: '4px', padding: '2rem' }}>
            <div className="editorial-label">
              <span className="editorial-label-title">
                Search Results for "{searchQuery}" ({searchResults.totalResults} found)
              </span>
              <div className="editorial-label-line" />
            </div>

            {searchResults.totalResults === 0 ? (
              <p style={{ fontFamily: "'DM Sans'", fontSize: '0.8rem', color: 'rgba(215, 178, 122, 0.4)', textAlign: 'center', padding: '2rem 0' }}>
                No tapes or tracks matched "{searchQuery}" in the archive.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {searchResults.tracks?.map((t) => {
                  const isActive = currentTrackId === t.id
                  return (
                    <div
                      key={t.id}
                      onClick={() => handlePlay(t)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.8rem 1rem',
                        background: isActive ? 'rgba(168, 79, 53, 0.15)' : 'rgba(14, 10, 7, 0.5)',
                        border: '1px solid rgba(215, 178, 122, 0.1)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <p style={{ fontFamily: "'Cormorant Garamond'", fontSize: '1rem', color: isActive ? '#D7B27A' : '#F2E5CC' }}>{t.title}</p>
                        <span style={{ fontSize: '0.55rem', color: 'rgba(215,178,122,0.45)' }}>{t.artist} · {t.genre}</span>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: '#D7B27A', cursor: 'pointer' }} type="button">
                        {isActive && isPlaying ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ── Featured Track Spotlight ─────────────────────── */}
        <motion.section
          className="featured-spotlight"
          variants={FADE_UP}
          custom={0.4}
          initial="hidden"
          animate="visible"
          aria-label="Featured track"
        >
          <div className="featured-visual">
            <div className="featured-disc-wrapper">
              <div
                className={`featured-disc ${isPlaying && isFeaturedActive ? 'featured-disc--spinning' : ''}`}
                aria-hidden="true"
              >
                <div className="featured-disc-center">
                  <span className="featured-disc-label">GULLY 7"</span>
                </div>
              </div>

              <div
                className="featured-play-overlay"
                onClick={() => handlePlay(FEATURED_TRACK)}
                role="button"
                tabIndex={0}
                aria-label={isPlaying && isFeaturedActive ? 'Pause featured track' : 'Play featured track'}
                onKeyDown={(e) => e.key === 'Enter' && handlePlay(FEATURED_TRACK)}
              >
                <button className="featured-play-btn" type="button">
                  {isPlaying && isFeaturedActive ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
                </button>
              </div>
            </div>
          </div>

          <div className="featured-meta">
            <span className="featured-badge">Featured Reel Spotlight</span>
            <h2 className="featured-title">{FEATURED_TRACK.title}</h2>
            <p className="featured-artist">{FEATURED_TRACK.artist} · {FEATURED_TRACK.recordedAt}</p>
            <p className="featured-story">{FEATURED_TRACK.linerNotes}</p>

            <div className="featured-specs">
              <div className="spec-item">
                <span className="spec-label">Duration</span>
                <span className="spec-val">{formatTime(FEATURED_TRACK.duration)}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Genre</span>
                <span className="spec-val">{FEATURED_TRACK.genre}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Tempo</span>
                <span className="spec-val">{FEATURED_TRACK.bpm} BPM</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Key</span>
                <span className="spec-val">{FEATURED_TRACK.key}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Editorial Asymmetric Grid: Recently Added & Late Night ── */}
        <div className="discover-editorial-grid">
          {/* Recently Added */}
          <motion.section
            className="recent-section"
            variants={FADE_UP}
            custom={0.5}
            initial="hidden"
            animate="visible"
          >
            <div className="editorial-label">
              <span className="editorial-label-title">Recently Archived Tracks</span>
              <div className="editorial-label-line" />
            </div>

            <div className="recent-list">
              {RECENTLY_ADDED.map((track, i) => {
                const isActive = currentTrackId === track.id
                return (
                  <div
                    key={track.id}
                    className={`recent-row ${isActive ? 'recent-row--active' : ''}`}
                    onClick={() => handlePlay(track, RECENTLY_ADDED)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handlePlay(track, RECENTLY_ADDED)}
                    aria-label={`Play ${track.title}`}
                  >
                    <span className="recent-num">{String(i + 1).padStart(2, '0')}</span>
                    <div className="recent-main">
                      <p className="recent-title">{track.title}</p>
                      <p className="recent-details">{track.artist} · {track.location}</p>
                    </div>
                    <span className="recent-genre">{track.genre}</span>
                    <button className="recent-play-trigger" aria-label="Play track" type="button">
                      {isActive && isPlaying ? <Pause size={12} /> : <Play size={12} style={{ marginLeft: 1 }} />}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* Late Night Tracks */}
          <motion.section
            className="late-night-section"
            variants={FADE_UP}
            custom={0.6}
            initial="hidden"
            animate="visible"
          >
            <div className="editorial-label">
              <span className="editorial-label-title">Late Night Frequencies</span>
              <div className="editorial-label-line" />
            </div>

            <div className="late-night-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#D7B27A', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                <Moon size={14} />
                <span>02:00 — 05:00 AM Selection</span>
              </div>

              {LATE_NIGHT_TRACKS.map((track) => {
                const isActive = currentTrackId === track.id
                return (
                  <div
                    key={track.id}
                    className="late-track-item"
                    onClick={() => handlePlay(track, LATE_NIGHT_TRACKS)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handlePlay(track, LATE_NIGHT_TRACKS)}
                  >
                    <div>
                      <p className="late-track-title" style={{ color: isActive ? '#D7B27A' : undefined }}>
                        {track.title}
                      </p>
                      <span style={{ fontSize: '0.58rem', color: 'rgba(215,178,122,0.4)' }}>
                        {track.location}
                      </span>
                    </div>
                    <span className="late-track-mood">{track.mood}</span>
                  </div>
                )
              })}
            </div>
          </motion.section>
        </div>

        {/* ── Nostalgic Picks ───────────────────────────────── */}
        <motion.section
          className="nostalgic-section"
          variants={FADE_UP}
          custom={0.65}
          initial="hidden"
          animate="visible"
        >
          <div className="editorial-label">
            <span className="editorial-label-title">Nostalgic Master Tapes</span>
            <div className="editorial-label-line" />
          </div>

          <div className="nostalgic-grid">
            {NOSTALGIC_PICKS.map((track) => {
              const isActive = currentTrackId === track.id
              return (
                <div
                  key={track.id}
                  className="nostalgic-card"
                  onClick={() => handlePlay(track, NOSTALGIC_PICKS)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handlePlay(track, NOSTALGIC_PICKS)}
                  aria-label={`Play ${track.title}`}
                >
                  <div className="nostalgic-top">
                    <span className="nostalgic-tag">{track.tag}</span>
                    <Disc size={16} color={isActive ? '#D7B27A' : 'rgba(215,178,122,0.3)'} />
                  </div>

                  <div>
                    <h3 className="nostalgic-card-title">{track.title}</h3>
                    <p className="nostalgic-card-loc">{track.artist} · {track.location}</p>
                  </div>

                  <div className="nostalgic-bottom">
                    <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(215,178,122,0.4)', textTransform: 'uppercase' }}>
                      {track.genre}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: '#D7B27A', fontWeight: 500 }}>
                      {formatTime(track.duration)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* ── Hidden Gems ───────────────────────────────────── */}
        <motion.section
          className="gems-section"
          variants={FADE_UP}
          custom={0.7}
          initial="hidden"
          animate="visible"
        >
          <div className="editorial-label">
            <span className="editorial-label-title">Curator's Unreleased Notes</span>
            <div className="editorial-label-line" />
          </div>

          <div className="gems-grid">
            {HIDDEN_GEMS.map((gem) => (
              <div
                key={gem.id}
                className="gem-quote-card"
                onClick={() => handlePlay(gem)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handlePlay(gem)}
                aria-label={`Play ${gem.title}`}
              >
                <p className="gem-quote">{gem.quote}</p>
                <div>
                  <p className="gem-meta">{gem.title} · {gem.year}</p>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(215,178,122,0.4)' }}>
                    {gem.artist} · {formatTime(gem.duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}
