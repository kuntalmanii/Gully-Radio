/**
 * Header.jsx
 * ──────────────────────────────────────────────────────────────
 * Global Navigation Header with Contemporary Devanagari Visual Identity.
 *
 * Brand:
 *   गली रेडियो (Primary Display in Tiro Devanagari Hindi)
 *   GULLY RADIO (Subtle supporting label in Inter)
 *
 * Navigation:
 *   खोजें • मिक्सटेप • लाइब्रेरी (with active route indicator & search trigger)
 */

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Disc3, Music2, Radio } from 'lucide-react'
import SearchModal from './SearchModal'
import MixtapesModal from './MixtapesModal'
import LibraryModal from './LibraryModal'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mixtapesOpen, setMixtapesOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const location = useLocation()

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MixtapesModal isOpen={mixtapesOpen} onClose={() => setMixtapesOpen(false)} />
      <LibraryModal isOpen={libraryOpen} onClose={() => setLibraryOpen(false)} />

      <motion.header
        className="site-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left: Brand Presentation */}
        <Link
          to="/"
          className="site-logo-wrap"
          aria-label="लेक्चर Time Home"
        >
          <span
            style={{
              fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
              fontSize: '1.45rem',
              fontWeight: 400,
              color: 'var(--color-warm-ivory, #F3E7D0)',
              lineHeight: 1.1,
              letterSpacing: '0.02em',
              textShadow: '0 2px 14px rgba(0,0,0,0.7)',
            }}
          >
            लेक्चर Time
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.46rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              color: 'var(--color-muted-cream, #E8D5B5)',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            LECTURE TIME
          </span>
        </Link>

        {/* Center: Live Listener Pill Badge (Matching reference photo) */}
        <div
          className="header-live-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(21, 19, 16, 0.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(232, 213, 181, 0.16)',
            borderRadius: '20px',
            padding: '0.35rem 0.9rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#4ade80',
              boxShadow: '0 0 8px #4ade80',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 500,
              color: 'var(--color-warm-ivory, #F3E7D0)',
              letterSpacing: '0.02em',
            }}
          >
            484 people listening
          </span>
        </div>

        {/* Right: Glass Quick Action Buttons */}
        <nav className="site-nav-desktop" aria-label="मुख्य नेविगेशन">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="glass-pill"
              style={{
                padding: '0.45rem 0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                fontSize: '0.8rem',
              }}
              type="button"
            >
              <Search size={14} />
              <span>खोजें</span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.55rem',
                  background: 'rgba(232, 213, 181, 0.12)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '3px',
                  opacity: 0.7,
                }}
              >
                ⌘K
              </span>
            </button>

            {/* Mixtapes Modal Trigger */}
            <button
              onClick={() => setMixtapesOpen(true)}
              className="glass-pill"
              style={{
                padding: '0.45rem 0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                fontSize: '0.8rem',
              }}
              type="button"
            >
              <Disc3 size={14} />
              <span>मिक्सटेप</span>
            </button>

            {/* Library Modal Trigger */}
            <button
              onClick={() => setLibraryOpen(true)}
              className="glass-pill"
              style={{
                padding: '0.45rem 0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                fontSize: '0.8rem',
              }}
              type="button"
            >
              <Music2 size={14} />
              <span>लाइब्रेरी</span>
            </button>
          </div>
        </nav>

        {/* Mobile Action Buttons */}
        <div style={{ display: 'none' }} className="mobile-header-actions">
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-warm-ivory, #F3E7D0)',
              padding: '6px',
              cursor: 'pointer',
            }}
            type="button"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setLibraryOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-warm-ivory, #F3E7D0)',
              padding: '6px',
              cursor: 'pointer',
            }}
            type="button"
          >
            <Music2 size={18} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(21, 19, 16, 0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 150,
              }}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              id="mobile-nav"
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(300px, 85vw)',
                background: 'rgba(21, 19, 16, 0.98)',
                borderLeft: '1px solid rgba(232, 213, 181, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '3rem 2rem 2.5rem',
                zIndex: 200,
              }}
              aria-label="मोबाइल नेविगेशन"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid rgba(232, 213, 181, 0.12)', paddingBottom: '1rem' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: "'Tiro Devanagari Hindi', serif",
                        fontSize: '1.5rem',
                        color: 'var(--color-warm-ivory, #F3E7D0)',
                        display: 'block',
                      }}
                    >
                      लेक्चर Time
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.52rem',
                        letterSpacing: '0.25em',
                        color: 'var(--color-muted-cream, #E8D5B5)',
                        textTransform: 'uppercase',
                        opacity: 0.7,
                      }}
                    >
                      LECTURE TIME ARCHIVE
                    </span>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-warm-ivory, #F3E7D0)',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    aria-label="मेनू बंद करें"
                    type="button"
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
                          fontSize: '1.35rem',
                          color: location.pathname === item.path ? 'var(--color-burnt-orange, #C66A3E)' : 'var(--color-warm-ivory, #F3E7D0)',
                        }}
                      >
                        {item.labelHi}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.55rem',
                          letterSpacing: '0.22em',
                          color: 'rgba(232, 213, 181, 0.45)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.labelEn}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Drawer Footer with Search Trigger */}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  setSearchOpen(true)
                }}
                style={{
                  background: 'rgba(33, 27, 23, 0.7)',
                  border: '1px solid var(--color-border-subtle, rgba(232, 213, 181, 0.15))',
                  borderRadius: 'var(--radius-xs, 2px)',
                  color: 'var(--color-warm-ivory, #F3E7D0)',
                  padding: '0.8rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontFamily: "'Noto Sans Devanagari', sans-serif",
                }}
                type="button"
              >
                <Search size={16} />
                <span>गाना खोजें (Search)</span>
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
