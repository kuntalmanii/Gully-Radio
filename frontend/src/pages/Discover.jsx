/**
 * Discover.jsx
 * ──────────────────────────────────────────────────────────────
 * Editorial Music Discovery Experience.
 * Contemporary Devanagari Visual Identity.
 *
 * Headline:
 *   आज क्या सुनें?
 *   उस रात के लिए, जब शहर सो रहा हो और गाने जाग रहे हों।
 */

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Disc, Sparkles, Moon, Search, X } from 'lucide-react'
import { useAudio } from '../contexts/AudioContext'
import { formatTime } from '../components/MusicPlayer/ProgressBar'
import Header from '../components/Header'
import { searchTracks } from '../services/api'
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
            <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              गली रेडियो संपादकीय · लाइव संग्रह
            </span>
          </motion.div>

          <motion.h1
            className="discover-headline"
            variants={FADE_UP}
            custom={0.2}
            style={{
              fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
              fontSize: 'clamp(2.8rem, 6.8vw, 5.8rem)',
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            <span>आज क्या सुनें?</span>
            <span style={{ fontSize: '0.85em', color: '#F2E5CC', fontWeight: 300, display: 'block', marginTop: '0.2rem' }}>
              उस रात के लिए, जब शहर सो रहा हो
            </span>
            <span className="accent-line" style={{ fontStyle: 'normal', color: '#D7B27A' }}>
              और गाने जाग रहे हों।
            </span>
          </motion.h1>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <motion.p
              className="discover-subhead"
              variants={FADE_UP}
              custom={0.35}
              style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 'clamp(0.92rem, 1.4vw, 1.12rem)', lineHeight: 1.7 }}
            >
              पुरानी गलियों, अनदेखे मास्टर टेपों और आधी रात के रेडियो की अनकही कहानियाँ।
            </motion.p>

            {/* Archive Search Bar */}
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
                padding: '0.45rem 1.1rem',
                minWidth: '290px',
              }}
            >
              <Search size={14} color="rgba(215, 178, 122, 0.5)" style={{ marginRight: '0.5rem' }} />
              <input
                type="text"
                placeholder="गाने या कैसेट खोजिए..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#F2E5CC',
                  fontFamily: "'Noto Sans Devanagari', sans-serif",
                  fontSize: '0.78rem',
                  letterSpacing: '0.04em',
                  width: '100%',
                }}
              />
              {isSearching ? (
                <span style={{ fontSize: '0.62rem', color: 'rgba(215,178,122,0.6)', fontFamily: "'Noto Sans Devanagari', sans-serif", whiteSpace: 'nowrap' }}>
                  खोज जारी...
                </span>
              ) : searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'rgba(215,178,122,0.5)', cursor: 'pointer', padding: 0 }}
                  type="button"
                  aria-label="खोज साफ़ करें"
                >
                  <X size={13} />
                </button>
              ) : null}
            </motion.div>
          </div>

        </motion.header>

        {/* ── Live Search Results Drawer ───────────────────── */}
        {searchResults && searchQuery && (
          <section style={{ marginBottom: '4rem', background: 'rgba(24, 18, 14, 0.85)', border: '1px solid rgba(215, 178, 122, 0.2)', borderRadius: '4px', padding: '2rem' }}>
            <div className="editorial-label">
              <span className="editorial-label-title" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                "{searchQuery}" के परिणाम ({searchResults.totalResults} मिले)
              </span>
              <div className="editorial-label-line" />
            </div>

            {searchResults.totalResults === 0 ? (
              <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.9rem', color: 'rgba(215, 178, 122, 0.5)', textAlign: 'center', padding: '2rem 0' }}>
                संग्रह में "{searchQuery}" से मेल खाता कोई गाना या कैसेट नहीं मिला।
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
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '1rem', color: isActive ? '#D7B27A' : '#F2E5CC' }}>{t.title}</p>
                        <span style={{ fontSize: '0.62rem', color: 'rgba(215,178,122,0.5)', fontFamily: "'Inter', sans-serif" }}>{t.artist} · {t.genre}</span>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: '#D7B27A', cursor: 'pointer' }} type="button" aria-label="चलाएँ">
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
          aria-label="खास पेशकश (Featured Track)"
        >
          {/* Ambient Spotlight Lighting Halo */}
          <div
            className="ambient-light-halo ambient-light-halo--amber"
            style={{
              width: '320px',
              height: '320px',
              left: '5%',
              top: '15%',
              opacity: isPlaying && isFeaturedActive ? 0.9 : 0.45,
            }}
            aria-hidden="true"
          />

          <div className="featured-visual">
            <div className="featured-disc-wrapper">
              <div
                className={`featured-disc ${isPlaying && isFeaturedActive ? 'featured-disc--spinning' : ''}`}
                aria-hidden="true"
              >
                <div className="analog-scanlines" aria-hidden="true" />
                <div className="featured-disc-center">
                  <span className="featured-disc-label" style={{ fontFamily: "'Inter', sans-serif" }}>GULLY 7"</span>
                </div>
              </div>


              <div
                className="featured-play-overlay"
                onClick={() => handlePlay(FEATURED_TRACK)}
                role="button"
                tabIndex={0}
                aria-label={isPlaying && isFeaturedActive ? 'रोकें' : 'चलाएँ'}
                onKeyDown={(e) => e.key === 'Enter' && handlePlay(FEATURED_TRACK)}
              >
                <button className="featured-play-btn" type="button">
                  {isPlaying && isFeaturedActive ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
                </button>
              </div>
            </div>
          </div>

          <div className="featured-meta">
            <span className="featured-badge" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              खास पेशकश · मास्टर रील
            </span>
            <h2
              className="featured-title"
              style={{
                fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
                fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                lineHeight: 1.15,
                fontWeight: 400,
              }}
            >
              {FEATURED_TRACK.title}
            </h2>
            <p className="featured-artist" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.82rem' }}>
              {FEATURED_TRACK.artist} · {FEATURED_TRACK.recordedAt}
            </p>
            <p className="featured-story" style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.92rem', lineHeight: 1.7 }}>
              {FEATURED_TRACK.linerNotes}
            </p>

            <div className="featured-specs">
              <div className="spec-item">
                <span className="spec-label" style={{ fontFamily: "'Inter', sans-serif" }}>DURATION</span>
                <span className="spec-val" style={{ fontFamily: "'Inter', sans-serif" }}>{formatTime(FEATURED_TRACK.duration)}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label" style={{ fontFamily: "'Inter', sans-serif" }}>GENRE</span>
                <span className="spec-val" style={{ fontFamily: "'Inter', sans-serif" }}>{FEATURED_TRACK.genre}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label" style={{ fontFamily: "'Inter', sans-serif" }}>TEMPO</span>
                <span className="spec-val" style={{ fontFamily: "'Inter', sans-serif" }}>{FEATURED_TRACK.bpm} BPM</span>
              </div>
              <div className="spec-item">
                <span className="spec-label" style={{ fontFamily: "'Inter', sans-serif" }}>KEY</span>
                <span className="spec-val" style={{ fontFamily: "'Inter', sans-serif" }}>{FEATURED_TRACK.key}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Editorial Grid: Recently Added & Late Night ──── */}
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
              <span className="editorial-label-title" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                हाल ही में शामिल किए गए गाने
              </span>
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
                    aria-label={`${track.title} चलाएँ`}
                  >
                    <span className="recent-num" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="recent-main">
                      <p className="recent-title" style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '1.05rem' }}>
                        {track.title}
                      </p>
                      <p className="recent-details" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.68rem' }}>
                        {track.artist} · {track.location}
                      </p>
                    </div>
                    <span className="recent-genre" style={{ fontFamily: "'Inter', sans-serif" }}>{track.genre}</span>
                    <button className="recent-play-trigger" aria-label="चलाएँ" type="button">
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
              <span className="editorial-label-title" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                रात 2 बजे की आवाज़ें
              </span>
              <div className="editorial-label-line" />
            </div>

            <div className="late-night-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#D7B27A', fontSize: '0.7rem', letterSpacing: '0.12em', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                <Moon size={14} />
                <span>देर रात 02:00 — 05:00 AM खास चयन</span>
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
                      <p
                        className="late-track-title"
                        style={{
                          fontFamily: "'Noto Serif Devanagari', serif",
                          fontSize: '1rem',
                          color: isActive ? '#D7B27A' : undefined,
                        }}
                      >
                        {track.title}
                      </p>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(215,178,122,0.5)', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {track.location}
                      </span>
                    </div>
                    <span className="late-track-mood" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.65rem' }}>
                      {track.mood}
                    </span>
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
            <span className="editorial-label-title" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              यादों के मास्टर टेप
            </span>
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
                  aria-label={`${track.title} चलाएँ`}
                >
                  <div className="nostalgic-top">
                    <span className="nostalgic-tag" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{track.tag}</span>
                    <Disc size={16} color={isActive ? '#D7B27A' : 'rgba(215,178,122,0.3)'} />
                  </div>

                  <div>
                    <h3 className="nostalgic-card-title" style={{ fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif", fontSize: '1.25rem' }}>
                      {track.title}
                    </h3>
                    <p className="nostalgic-card-loc" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.68rem' }}>
                      {track.artist} · {track.location}
                    </p>
                  </div>

                  <div className="nostalgic-bottom">
                    <span style={{ fontSize: '0.62rem', color: 'rgba(215,178,122,0.5)', fontFamily: "'Inter', sans-serif" }}>
                      {track.genre}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#D7B27A', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
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
            <span className="editorial-label-title" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              क्यूरेटर की अनसुनी बातें
            </span>
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
                aria-label={`${gem.title} चलाएँ`}
              >
                <p className="gem-quote" style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.92rem', lineHeight: 1.7 }}>
                  {gem.quote}
                </p>
                <div>
                  <p className="gem-meta" style={{ fontFamily: "'Tiro Devanagari Hindi', serif", fontSize: '1rem' }}>
                    {gem.title} · {gem.year}
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(215,178,122,0.5)', fontFamily: "'Inter', sans-serif" }}>
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
