/**
 * CassetteDetail.jsx
 * ──────────────────────────────────────────────────────────────
 * Selected cassette view: deck slot + cassette insertion animation,
 * metadata, description, and interactive track listing.
 *
 * Fetches tracks from backend API /api/mixtapes/:id/tracks.
 * Connects to the global AudioContext to enable playback.
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence }        from 'framer-motion'
import { gsap }                           from 'gsap'
import { Play, RefreshCw }                from 'lucide-react'
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
  const [apiLoaded, setApiLoaded] = useState(false)

  const {
    loadQueue, playTrack, togglePlay,
    currentTrackId, isPlaying,
  } = useAudio()

  /* ── Insertion animation: cassette slides from below into the deck */
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
        setTracks(fetched)
        setApiLoaded(true)
      }
    } catch (err) {
      console.warn('[CassetteDetail] Fallback to local tracks:', err.message)
    } finally {
      setLoading(false)
    }
  }, [mixtape.id])

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
    playTrack(queue[0]?.id)
  }, [mixtape.id, loadQueue, playTrack])

  /* Select individual track */
  const handleTrackClick = useCallback((trackId) => {
    if (currentTrackId === trackId) {
      togglePlay()
    } else {
      playTrack(trackId)
    }
  }, [currentTrackId, togglePlay, playTrack])

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
      {/* ── Deck / player slot ──────────────────────────────── */}
      <div ref={deckSlotRef} className="detail-deck">
        <span className="detail-deck-label">
          {apiLoaded ? 'Now Loading (API Synced)' : 'Now Loading'}
        </span>

        {/* Cassette — animated in */}
        <Cassette
          ref={cassetteRef}
          mixtape={{ ...mixtape, tracks }}
          size="lg"
          isPlaying={isPlaying && isThisCassetteActive}
        />

        {/* Playing bars indicator */}
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
          <h2 className="detail-cassette-title">{mixtape.title}</h2>
          <p className="detail-cassette-by">
            Curated by {mixtape.curator}
          </p>
          <p className="detail-cassette-desc">{mixtape.description}</p>

          <div className="detail-meta-tags">
            <span className="detail-tag">{mixtape.genre}</span>
            <span className="detail-tag">{mixtape.year}</span>
            <span className="detail-tag">{tracks.length} tracks</span>
          </div>

          <button
            className="detail-play-all"
            onClick={handlePlayAll}
            aria-label={`Play all tracks on ${mixtape.title}`}
          >
            <Play size={14} strokeWidth={1.5} />
            Play All Tracks
          </button>
        </motion.div>

        {/* Tracklist */}
        <motion.div className="detail-tracklist" variants={FADE_UP} custom={0.15} initial="hidden" animate="visible">
          <div className="detail-tracklist-header">
            <span className="detail-tracklist-label">Tracks</span>
            <div className="detail-tracklist-rule" />
            {loading && (
              <span style={{ fontSize: '0.52rem', color: '#D7B27A', textTransform: 'uppercase' }}>
                Updating...
              </span>
            )}
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
                aria-label={`${isActive && isPlaying ? 'Pause' : 'Play'} ${track.title}`}
              >
                <span className="detail-track-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="detail-track-name">{track.title}</span>
                <span className="detail-track-dur">{formatTime(track.duration)}</span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
