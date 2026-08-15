/**
 * CassetteDetail.jsx
 * ──────────────────────────────────────────────────────────────
 * Selected cassette view: deck slot + cassette insertion animation,
 * metadata, description, and interactive track listing.
 * Contemporary Devanagari Visual Identity.
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence }        from 'framer-motion'
import { gsap }                           from 'gsap'
import { Play }                           from 'lucide-react'
import Cassette                           from './Cassette'
import { getMixtapeQueue }                from './shopData'
import { getMixtapeTracks }               from '../../services/api'
import { useAudio }                       from '../../contexts/AudioContext'
import { formatTime }                     from '../MusicPlayer/ProgressBar'

const FADE_UP = {
  hidden:  { opacity: 0, y: 16 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function CassetteDetail({ mixtape, onBack }) {

  const cassetteRef  = useRef(null)
  const deckSlotRef  = useRef(null)
  const contentRef   = useRef(null)

  const [tracks, setTracks]     = useState(mixtape.tracks || [])
  const [loading, setLoading]   = useState(false)

  const {
    loadQueue, playTrack, togglePlay,
    currentTrackId, isPlaying,
  } = useAudio()

  /* Listen for Escape key to go back */
  useEffect(() => {
    if (!onBack) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onBack])


  /* ── Insertion animation ───────────────────────────────────── */
  useEffect(() => {
    const cassette = cassetteRef.current
    const content  = contentRef.current
    if (!cassette || !content) return

    gsap.set(cassette, { y: 80, opacity: 0, rotate: -4 })
    gsap.set(content,  { opacity: 0 })

    const tl = gsap.timeline()

    tl.to(cassette, {
      y:        0,
      opacity:  1,
      rotate:   0,
      duration: 0.85,
      ease:     'power3.out',
    })
    .to(cassette, {
      y:        4,
      duration: 0.12,
      ease:     'power2.inOut',
      yoyo:     true,
      repeat:   1,
    })
    .to(content, {
      opacity:  1,
      duration: 0.6,
      ease:     'power2.out',
    }, '-=0.1')

    return () => tl.kill()
  }, [mixtape.id])

  /* ── Fetch latest tracks from Backend API ──────────────────── */
  const fetchTracks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMixtapeTracks(mixtape.id)
      const fetched = res?.tracks || res || []
      if (fetched.length > 0) {
        // Keep Hindi titles if available in local metadata
        const mergedTracks = fetched.map((ft, idx) => {
          const localTrack = mixtape.tracks?.[idx]
          return {
            ...ft,
            title: localTrack?.title || ft.title,
          }
        })
        setTracks(mergedTracks)
      }
    } catch (err) {
      console.warn('[CassetteDetail] Fallback to local tracks:', err.message)
    } finally {
      setLoading(false)
    }
  }, [mixtape.id, mixtape.tracks])

  useEffect(() => {
    fetchTracks()
  }, [fetchTracks])

  /* ── Load this cassette's tracks into the global queue ─────── */
  useEffect(() => {
    const queue = getMixtapeQueue(mixtape.id)
    loadQueue(queue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mixtape.id])

  /* Play All */
  const handlePlayAll = useCallback(() => {
    const queue = getMixtapeQueue(mixtape.id)
    loadQueue(queue)
    if (queue.length > 0) {
      playTrack(queue[0].id)
    }
  }, [mixtape.id, loadQueue, playTrack])

  /* Select individual track */
  const handleTrackClick = useCallback((trackId) => {
    if (currentTrackId === trackId) {
      togglePlay()
    } else {
      const queue = getMixtapeQueue(mixtape.id)
      loadQueue(queue)
      playTrack(trackId)
    }
  }, [currentTrackId, mixtape.id, loadQueue, togglePlay, playTrack])


  const queue = getMixtapeQueue(mixtape.id)
  const isThisCassetteActive = queue.some((t) => t.id === currentTrackId)

  return (
    <motion.div
      className="detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Deck / player slot with Ambient Lighting Halo ──── */}
      <div ref={deckSlotRef} className="detail-deck">
        <div
          className="ambient-light-halo ambient-light-halo--amber"
          style={{
            width: '280px',
            height: '280px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: isPlaying && isThisCassetteActive ? 0.85 : 0.35,
          }}
          aria-hidden="true"
        />

        <span
          className="detail-deck-label"
          style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.62rem', position: 'relative', zIndex: 2 }}
        >
          {loading ? 'लोड हो रहा है...' : 'डेक में कैसेट'}
        </span>

        <Cassette
          ref={cassetteRef}
          mixtape={{ ...mixtape, tracks }}
          size="lg"
          isPlaying={isPlaying && isThisCassetteActive}
        />


        <div className="detail-deck-controls">
          <AnimatePresence>
            {isPlaying && isThisCassetteActive && (
              <motion.div
                className="detail-playing-dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="detail-playing-dot" />
                <div className="detail-playing-dot" />
                <div className="detail-playing-dot" />
                <div className="detail-playing-dot" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────── */}
      <div ref={contentRef} className="detail-main">

        {/* Meta */}
        <motion.div className="detail-meta" variants={FADE_UP} initial="hidden" animate="visible">
          <h2
            className="detail-cassette-title"
            style={{
              fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              lineHeight: 1.15,
            }}
          >
            {mixtape.title}
          </h2>

          <p
            className="detail-cassette-by"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.8rem', color: 'rgba(215, 178, 122, 0.7)' }}
          >
            तैयार किया: {mixtape.curator}
          </p>

          <p
            className="detail-cassette-desc"
            style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.94rem', lineHeight: 1.7 }}
          >
            {mixtape.description}
          </p>

          <div className="detail-meta-tags">
            <span className="detail-tag" style={{ fontFamily: "'Inter', sans-serif" }}>{mixtape.genre}</span>
            <span className="detail-tag" style={{ fontFamily: "'Inter', sans-serif" }}>{mixtape.year}</span>
            <span className="detail-tag" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{tracks.length} गाने</span>
          </div>

          <button
            className="detail-play-all"
            onClick={handlePlayAll}
            aria-label={`${mixtape.title} के सभी गाने चलाएँ`}
            type="button"
            style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif", fontSize: '0.82rem' }}
          >
            <Play size={14} strokeWidth={1.5} />
            सभी गाने चलाएँ
          </button>
        </motion.div>

        {/* Tracklist */}
        <motion.div className="detail-tracklist" variants={FADE_UP} custom={0.15} initial="hidden" animate="visible">
          <div className="detail-tracklist-header">
            <span
              className="detail-tracklist-label"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.72rem' }}
            >
              गाने
            </span>
            <div className="detail-tracklist-rule" />
          </div>

          {tracks.map((track, i) => {
            const qTrack  = queue[i]
            const isActive = currentTrackId === (qTrack?.id || track.id)

            return (
              <div
                key={track.id}
                className={`detail-track-row${isActive ? ' detail-track-row--active' : ''}`}
                onClick={() => handleTrackClick(qTrack?.id || track.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleTrackClick(qTrack?.id || track.id)}
                aria-label={`${isActive && isPlaying ? 'रोकें' : 'चलाएँ'} ${track.title}`}
              >
                <span className="detail-track-num" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="detail-track-name"
                  style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.95rem' }}
                >
                  {track.title}
                </span>
                <span className="detail-track-dur" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {formatTime(track.duration)}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
