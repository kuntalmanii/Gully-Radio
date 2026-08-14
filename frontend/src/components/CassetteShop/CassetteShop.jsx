/**
 * CassetteShop.jsx
 * ──────────────────────────────────────────────────────────────
 * Main container — route element for /shop.
 * Manages collection ↔ detail view state.
 * Contemporary Devanagari Visual Identity.
 */

import { useState, useCallback }      from 'react'
import { AnimatePresence, motion }    from 'framer-motion'
import { ArrowLeft }                  from 'lucide-react'
import { useCinematicTransition }     from '../CinematicTransition'
import CassetteCollection             from './CassetteCollection'
import CassetteDetail                 from './CassetteDetail'
import './shop.css'

export default function CassetteShop() {
  const [view,     setView]     = useState('collection')
  const [selected, setSelected] = useState(null)

  const { trigger } = useCinematicTransition()

  /* Return to hero */
  const goBack = useCallback(() => {
    trigger({ to: '/' })
  }, [trigger])

  /* Return from detail to collection */
  const backToCollection = useCallback(() => {
    setView('collection')
    setSelected(null)
  }, [])

  /* Cassette selected from collection */
  const handleSelect = useCallback((mixtape) => {
    setSelected(mixtape)
    setView('detail')
  }, [])

  return (
    <div className="shop-page">
      {/* Background — hero image zoomed to shop area */}
      <div className="shop-bg"      aria-hidden="true" />
      <div className="shop-overlay" aria-hidden="true" />
      <div className="shop-grain"   aria-hidden="true" />

      <div className="shop-content">
        {/* ── Header ──────────────────────────────────────── */}
        <header className="shop-header">
          <button
            className="shop-back-btn"
            onClick={view === 'detail' ? backToCollection : goBack}
            aria-label={view === 'detail' ? 'सभी कैसेट देखें' : 'वापस गली में'}
            type="button"
          >
            <ArrowLeft size={13} />
            <span>{view === 'detail' ? 'सभी कैसेट' : 'वापस गली में'}</span>
          </button>

          <div className="shop-title-group">
            <span
              className="shop-name"
              style={{ fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif", fontSize: '1.25rem' }}
            >
              पुरानी दुकान
            </span>
            <span className="shop-sub" style={{ fontFamily: "'Inter', sans-serif" }}>
              CASSETTE ARCHIVE · VOL. 01
            </span>
          </div>

          <div className="shop-header-spacer" aria-hidden="true" />
        </header>

        {/* ── Views ───────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {view === 'collection' && (
            <motion.div
              key="collection"
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <CassetteCollection onSelect={handleSelect} />
            </motion.div>
          )}

          {view === 'detail' && selected && (
            <motion.div
              key={`detail-${selected.id}`}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <CassetteDetail mixtape={selected} onBack={backToCollection} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
