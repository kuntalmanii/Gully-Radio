/**
 * CassetteCollection.jsx
 * ──────────────────────────────────────────────────────────────
 * The browse view — cassettes laid out on a counter surface.
 * Fetches mixtapes from backend API /api/mixtapes.
 * Contemporary Devanagari Visual Identity.
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
      console.warn('[CassetteCollection] API fetch fallback:', err.message)
      setError('ऑफ़लाइन संग्रह सक्रिय')
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

    const rect   = el.getBoundingClientRect()
    const cx     = window.innerWidth  / 2
    const cy     = window.innerHeight / 2

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
        style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.92rem', letterSpacing: '0.04em' }}
      >
        एक कैसेट चुनिए — सुनने के लिए उठाइए {loading ? '(अपडेट जारी...)' : ''}
      </motion.p>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(168, 79, 53, 0.15)', border: '1px solid rgba(168, 79, 53, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '2px' }}>
          <span style={{ fontSize: '0.7rem', color: '#F2E5CC', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
            <AlertCircle size={12} color="#C56A3E" />
            {error}
          </span>
          <button
            onClick={loadMixtapes}
            style={{ background: 'none', border: 'none', color: '#D7B27A', fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            type="button"
          >
            <RefreshCw size={10} />
            पुनः प्रयास
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
              <span
                className="cassette-hover-hint"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.62rem' }}
              >
                {mix.tracks?.length || 6} गाने · {mix.year}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
