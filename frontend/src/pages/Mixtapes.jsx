/**
 * Mixtapes.jsx
 * ──────────────────────────────────────────────────────────────
 * Horizontally Scrollable Mixtape Experience.
 * Contemporary Devanagari Visual Identity.
 *
 * Headline:
 *   कुछ गाने
 *   सिर्फ़ सुने नहीं जाते,
 *   याद भी रहते हैं।
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause, ArrowUpRight, ListMusic, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../contexts/AudioContext'
import Header from '../components/Header'
import Cassette from '../components/CassetteShop/Cassette'
import { getMixtapes } from '../services/api'
import { MIXTAPES as LOCAL_MIXTAPES, getMixtapeQueue } from '../components/CassetteShop/shopData'
import { formatTime } from '../components/MusicPlayer/ProgressBar'
import '../styles/mixtapes.css'

const FADE_UP = {
  hidden:  { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Mixtapes() {
  const scrollRef = useRef(null)
  const [mixtapes, setMixtapes] = useState(LOCAL_MIXTAPES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activePreview, setActivePreview] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const isDraggingRef = useRef(false)
  const startXRef     = useRef(0)
  const scrollLeftRef = useRef(0)

  const navigate = useNavigate()
  const { currentTrackId, isPlaying, loadQueue, playTrack, togglePlay } = useAudio()

  /* Fetch Mixtapes from Backend API */
  const fetchMixtapesData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getMixtapes()
      const fetched = res?.mixtapes || res || []
      if (fetched.length > 0) {
        const merged = fetched.map((m) => {
          const localMatch = LOCAL_MIXTAPES.find((lm) => lm.id === m.id || lm.id === m.shortId)
          return {
            ...m,
            title: localMatch?.title || m.title,
            titleEn: localMatch?.titleEn || m.titleEn,
            curator: localMatch?.curator || m.curator,
            description: localMatch?.description || m.description,
            theme: localMatch?.theme || m.theme || {
              shell: '#171512', label: '#2a2010', stripe: '#6a5820',
              accent: '#d4b030', text: '#f0e0a0', screw: '#221c0e'
            },
            labelArt: localMatch?.labelArt || 'grid',
            tracks: localMatch?.tracks || m.tracks || [],
          }
        })
        setMixtapes(merged)
      }
    } catch (err) {
      console.warn('[Mixtapes] Backend fetch fallback:', err.message)
      setError('ऑफ़लाइन कैसेट संग्रह सक्रिय')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMixtapesData()
  }, [fetchMixtapesData])

  const checkScrollBounds = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 20)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScrollBounds()
    el.addEventListener('scroll', checkScrollBounds, { passive: true })
    window.addEventListener('resize', checkScrollBounds)
    return () => {
      el.removeEventListener('scroll', checkScrollBounds)
      window.removeEventListener('resize', checkScrollBounds)
    }
  }, [checkScrollBounds])

  const handleWheel = useCallback((e) => {
    const el = scrollRef.current
    if (!el) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY * 1.5
    }
  }, [])

  const handleMouseDown = useCallback((e) => {
    const el = scrollRef.current
    if (!el) return
    isDraggingRef.current = true
    startXRef.current = e.pageX - el.offsetLeft
    scrollLeftRef.current = el.scrollLeft
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return
    e.preventDefault()
    const el = scrollRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - startXRef.current) * 1.8
    el.scrollLeft = scrollLeftRef.current - walk
  }, [])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  const scrollByAmount = useCallback((offset) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: offset, behavior: 'smooth' })
  }, [])

  const handlePlayMixtape = useCallback((mixtape) => {
    const queue = getMixtapeQueue(mixtape.id)
    const isTapeActive = queue.some((t) => t.id === currentTrackId)

    if (isTapeActive) {
      togglePlay()
    } else {
      loadQueue(queue)
      if (queue.length > 0) playTrack(queue[0].id)
    }
  }, [currentTrackId, togglePlay, loadQueue, playTrack])

  return (
    <div className="mixtapes-page">
      <div className="mixtapes-bg"    aria-hidden="true" />
      <div className="mixtapes-grain" aria-hidden="true" />

      {/* Global Header */}
      <Header />

      <main className="mixtapes-content">
        {/* ── Editorial Header ─────────────────────────────── */}
        <motion.header
          className="mixtapes-header"
          initial="hidden"
          animate="visible"
        >
          <div className="mixtapes-header-left">
            <motion.span
              className="mixtapes-tag"
              variants={FADE_UP}
              custom={0.1}
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
              कैसेट संग्रह · {loading ? 'लोड हो रहा है...' : 'लाइव सिंक'}
            </motion.span>

            <motion.h1
              className="mixtapes-headline"
              variants={FADE_UP}
              custom={0.2}
              style={{
                fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
                fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
                lineHeight: 1.15,
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              कुछ गाने सिर्फ़ सुने नहीं जाते, याद भी रहते हैं।
            </motion.h1>

            <motion.p
              className="mixtapes-subhead"
              variants={FADE_UP}
              custom={0.35}
              style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', lineHeight: 1.7 }}
            >
              भारतीय गलियों, छतों की बारिश और देर रात की ट्रेनों से चुनी हुई कुछ खास आवाज़ें। आगे देखने के लिए ड्रैग या स्क्रॉल करें।
            </motion.p>
          </div>

          <motion.div className="mixtapes-nav-controls" variants={FADE_UP} custom={0.4}>
            <button
              className="mixtapes-nav-btn"
              onClick={() => scrollByAmount(-400)}
              disabled={!canScrollLeft}
              aria-label="पिछले कैसेट"
              type="button"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="mixtapes-nav-btn"
              onClick={() => scrollByAmount(400)}
              disabled={!canScrollRight}
              aria-label="अगले कैसेट"
              type="button"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </motion.header>

        {/* Error Banner with Retry */}
        {error && (
          <div style={{ margin: '0 5vw 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(168, 79, 53, 0.12)', border: '1px solid rgba(168, 79, 53, 0.3)', padding: '0.6rem 1rem', borderRadius: '2px' }}>
            <span style={{ fontSize: '0.72rem', color: '#F2E5CC', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              <AlertCircle size={13} color="#C56A3E" />
              {error}
            </span>
            <button
              onClick={fetchMixtapesData}
              style={{ background: 'none', border: 'none', color: '#D7B27A', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              type="button"
            >
              <RefreshCw size={11} />
              पुनः प्रयास
            </button>
          </div>
        )}

        {/* ── Horizontally Scrollable Carousel ─────────────── */}
        <div
          ref={scrollRef}
          className="mixtapes-carousel-wrapper"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="mixtapes-track">
            {mixtapes.map((mix, i) => {
              const queue = getMixtapeQueue(mix.id)
              const isTapePlaying = isPlaying && queue.some((t) => t.id === currentTrackId)
              const isPreviewOpen = activePreview === mix.id

              return (
                <motion.article
                  key={mix.id}
                  className={`mixtape-card ${isPreviewOpen ? 'show-preview' : ''}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mixtape-card-top">
                    <span className="mixtape-index" style={{ fontFamily: "'Inter', sans-serif" }}>
                      VOL. 0{i + 1}
                    </span>
                    <span
                      className="mixtape-track-count"
                      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.62rem' }}
                    >
                      {mix.tracks.length} गाने · {mix.year}
                    </span>
                  </div>

                  {/* 3D Visual Cassette Showcase */}
                  <div className="mixtape-cassette-wrap">
                    <div className="mixtape-cassette-3d">
                      <Cassette
                        mixtape={mix}
                        size="md"
                        isPlaying={isTapePlaying}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mixtape-info">
                    <h2
                      className="mixtape-title"
                      style={{
                        fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
                        fontSize: '1.75rem',
                        lineHeight: 1.2,
                        fontWeight: 400,
                      }}
                    >
                      {mix.title}
                    </h2>
                    <p
                      className="mixtape-curator"
                      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.72rem' }}
                    >
                      तैयार किया: {mix.curator} · {mix.genre}
                    </p>
                    <p
                      className="mixtape-desc"
                      style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.88rem', lineHeight: 1.6 }}
                    >
                      {mix.description}
                    </p>
                  </div>

                  {/* Action Strip */}
                  <div className="mixtape-actions">
                    <button
                      className="mixtape-play-btn"
                      onClick={() => handlePlayMixtape(mix)}
                      type="button"
                      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.74rem' }}
                    >
                      {isTapePlaying ? (
                        <>
                          <Pause size={13} />
                          <span>रोकें</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} style={{ marginLeft: 1 }} />
                          <span>चलाएँ</span>
                        </>
                      )}
                    </button>

                    <button
                      className="mixtape-inspect-link"
                      onClick={() => setActivePreview(isPreviewOpen ? null : mix.id)}
                      type="button"
                      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.7rem' }}
                    >
                      <ListMusic size={13} />
                      <span>{isPreviewOpen ? 'छिपाएँ' : 'गाने देखें'}</span>
                    </button>

                    <button
                      className="mixtape-inspect-link"
                      onClick={() => navigate('/shop')}
                      type="button"
                      title="दुकान में देखें"
                      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.7rem' }}
                    >
                      <span>दुकान</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>

                  {/* Tracklist Preview Overlay */}
                  <div className="mixtape-tracks-preview">
                    <div className="preview-header">
                      <span
                        className="preview-title"
                        style={{ fontFamily: "'Tiro Devanagari Hindi', serif", fontSize: '1.15rem' }}
                      >
                        {mix.title}
                      </span>
                      <button
                        className="preview-close"
                        onClick={() => setActivePreview(null)}
                        type="button"
                        aria-label="बंद करें"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="preview-list">
                      {mix.tracks.map((t, idx) => (
                        <div key={t.id} className="preview-row">
                          <span style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.88rem' }}>
                            {idx + 1}. {t.title}
                          </span>
                          <span style={{ color: '#D7B27A', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem' }}>
                            {formatTime(t.duration)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="mixtape-play-btn"
                      style={{ width: '100%', justifyContent: 'center', fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                      onClick={() => {
                        handlePlayMixtape(mix)
                        setActivePreview(null)
                      }}
                      type="button"
                    >
                      <Play size={13} />
                      <span>पूरा मिक्सटेप चलाएँ</span>
                    </button>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
