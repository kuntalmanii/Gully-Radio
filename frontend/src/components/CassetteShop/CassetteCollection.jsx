/**
 * CassetteCollection.jsx
 * ──────────────────────────────────────────────────────────────
 * The browse view — cassettes laid out on a counter surface.
 * Hover to lift. Click to select (GSAP fly-to-center then swap view).
 */

import { useRef, useCallback } from 'react'
import { motion }              from 'framer-motion'
import { gsap }               from 'gsap'
import Cassette                from './Cassette'
import { MIXTAPES }            from './shopData'

const STAGGER = {
  hidden:  { opacity: 0, y: 28, scale: 0.94 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.75, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function CassetteCollection({ onSelect }) {
  const cassetteRefs = useRef([])

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
        Cassettes from the archive — pick one up
      </motion.p>

      <div className="shop-counter">
        <div className="cassettes-display">
          {MIXTAPES.map((mix, i) => (
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
                {mix.tracks.length} tracks · {mix.year}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
