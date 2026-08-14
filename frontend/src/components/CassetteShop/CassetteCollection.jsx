/**
 * CassetteCollection.jsx
 * ──────────────────────────────────────────────────────────────
 * The browse view — cassettes laid out on a counter surface.
 * Fetches mixtapes from backend API /api/mixtapes.
 * Hover to lift. Click to select (GSAP fly-to-center then swap view).
 */

import { useRef, useCallback, useState, useEffect } from 'react'
import { motion }              from 'framer-motion'
import { gsap }                from 'gsap'
import { RefreshCw, AlertCircle } from 'lucide-react'
import Cassette                from './Cassette'
import { getMixtapes }         from '../../services/api'
import { MIXTAPES as LOCAL_MIXTAPES } from './shopData'

const STAGGER = {
  hidden:  { opacity: 0, y: 28, scale: 0.94 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.75, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function CassetteCollection({ onSelect }) {
  const cassetteRefs = useRef([])
  const [mixtapes, setMixtapes] = useState(LOCAL_MIXTAPES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* Fetch mixtapes from API */
  const loadMixtapes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getMixtapes()
      const list = res?.mixtapes || res || []
      if (list.length > 0) {
        const merged = list.map((m) => {
          const localMatch = LOCAL_MIXTAPES.find((lm) => lm.id === m.id || lm.id === m.shortId)
          return {
            ...m,
            theme: localMatch?.theme || m.theme || {
              shell: '#171512', label: '#2a2010', stripe: '#6a5820',
              accent: '#d4b030', text: '#f0e0a0', screw: '#221c0e'
            },
            labelArt: localMatch?.labelArt || 'grid',
            tracks: m.tracks || localMatch?.tracks || [],
          }
        })
        setMixtapes(merged)
      }
    } catch (err) {
      console.warn('[CassetteCollection] API fetch fallback:', err.message)
      setError('Offline archival mode active')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMixtapes()
  }, [loadMixtapes])

  const handleSelect = useCallback((mixtape, index) => {
    const el = cassetteRefs.current[index]
    if (!el) { onSelect(mixtape); return }

    /* GSAP: cassette flies to center, scales up, then calls onSelect */
    const rect   = el.getBoundingClientRect()
    const cx     = window.innerWidth  / 2
    const cy     = window.innerHeight / 2

    // Lift the cassette above all siblings
    gsap.set(el, { zIndex: 100 })

    gsap.to(el, {
      x:         cx - rect.left - rect.width  / 2,
      y:         cy - rect.top  - rect.height / 2,
      scale:     1.45,
      rotate:    0,
      duration:  0.65,
      ease:      'power3.out',
      onComplete: () => {
        gsap.to(el, {
          opacity:    0,
          scale:      1.6,
          duration:   0.3,
          ease:       'power2.in',
          onComplete: () => { onSelect(mixtape) },
        })
      },
    })
  }, [onSelect])

  return (
    <motion.div
      className="collection-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.p
        className="collection-label"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        Cassettes from the archive — pick one up {loading ? '(Syncing...)' : ''}
      </motion.p>

      {/* Error banner */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(168, 79, 53, 0.15)', border: '1px solid rgba(168, 79, 53, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '2px' }}>
          <span style={{ fontSize: '0.58rem', color: '#F2E5CC', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertCircle size={11} color="#C56A3E" />
            {error}
          </span>
          <button
            onClick={loadMixtapes}
            style={{ background: 'none', border: 'none', color: '#D7B27A', fontSize: '0.55rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', textTransform: 'uppercase' }}
            type="button"
          >
            <RefreshCw size={9} />
            Retry
          </button>
        </div>
      )}

      <div className="shop-counter">
        <div className="cassettes-display">
          {mixtapes.map((mix, i) => (
            <motion.div
              key={mix.id}
              className="cassette-wrapper"
              variants={STAGGER}
              custom={i}
              initial="hidden"
              animate="visible"
              style={{ position: 'relative' }}
            >
              <Cassette
                ref={(el) => { cassetteRefs.current[i] = el }}
                mixtape={mix}
                size="md"
                onClick={() => handleSelect(mix, i)}
              />
              {/* Hover hint label */}
              <span className="cassette-hover-hint">
                {mix.tracks?.length || mix.trackCount || 0} tracks · {mix.year}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
