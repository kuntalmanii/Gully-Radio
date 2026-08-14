/**
 * CassetteShop.jsx
 * ──────────────────────────────────────────────────────────────
 * Main container — route element for /shop.
 * Manages collection ↔ detail view state.
 * Same background world as hero: zoomed into the shop stall.
 */

import { useState, useCallback }      from 'react'
import { AnimatePresence, motion }    from 'framer-motion'
import { ArrowLeft, Store }           from 'lucide-react'
import { useCinematicTransition }     from '../CinematicTransition'
import CassetteCollection             from './CassetteCollection'
import CassetteDetail                 from './CassetteDetail'
import './shop.css'

export default function CassetteShop() {
  const [view,     setView]     = useState('collection')  // 'collection' | 'detail'
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
            aria-label={view === 'detail' ? 'Back to collection' : 'Back to street'}
          >
            <ArrowLeft size={12} />
            {view === 'detail' ? 'All cassettes' : 'Back to street'}
          </button>

          <div className="shop-title-group">
            <span className="shop-name">Gully Radio Shop</span>
            <span className="shop-sub">Cassette Archive · Vol. 01</span>
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
