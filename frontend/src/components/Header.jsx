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
import { Search } from 'lucide-react'
import SearchModal from './SearchModal'

const NAV_ITEMS = [
  { labelHi: 'खोजें', labelEn: 'DISCOVER', path: '/discover' },
  { labelHi: 'मिक्सटेप', labelEn: 'MIXTAPES', path: '/mixtapes' },
  { labelHi: 'लाइब्रेरी', labelEn: 'LIBRARY', path: '/library' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Darken header slightly after user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  // Lock body scroll when mobile menu is open and handle Escape key
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <motion.header
        className="site-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: scrolled
            ? 'linear-gradient(to bottom, rgba(21,19,16,0.96) 0%, rgba(21,19,16,0.85) 100%)'
            : 'linear-gradient(to bottom, rgba(21,19,16,0.78) 0%, transparent 100%)',
          transition: 'background 0.5s ease',
        }}
      >
        {/* Brand Presentation */}
        <Link
          to="/"
          className="site-logo-wrap"
          aria-label="लेक्चर Time (Lecture Time) Home"
        >
          <span
            style={{
              fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
              fontSize: '1.42rem',
              fontWeight: 400,
              color: 'var(--color-warm-ivory, #F3E7D0)',
              lineHeight: 1.15,
              letterSpacing: '0.02em',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}
          >
            लेक्चर Time
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.48rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              color: 'var(--color-muted-cream, #E8D5B5)',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            LECTURE TIME
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="site-nav-desktop" aria-label="मुख्य नेविगेशन (Main Navigation)">
          <ul className="site-nav" role="list" style={{ display: 'flex', alignItems: 'center', gap: '2.4rem', listStyle: 'none' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1px',
                      position: 'relative',
                      paddingBottom: '4px',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Noto Sans Devanagari', sans-serif",
                        fontSize: '0.86rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--color-burnt-orange, #C66A3E)' : 'var(--color-warm-ivory, #F3E7D0)',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.labelHi}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.45rem',
                        letterSpacing: '0.2em',
                        color: isActive ? 'var(--color-burnt-orange, #C66A3E)' : 'rgba(232, 213, 181, 0.45)',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      {item.labelEn}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'var(--color-burnt-orange, #C66A3E)',
                          boxShadow: '0 0 8px rgba(198, 106, 62, 0.6)',
                          borderRadius: '1px',
                        }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}

            {/* Quick Search Button */}
            <li>
              <button
                className="header-search-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="गाने खोजें (Search songs) - Cmd+K"
                title="गाने खोजें (Cmd+K)"
                type="button"
                style={{
                  background: 'rgba(33, 27, 23, 0.6)',
                  border: '1px solid var(--color-border-subtle, rgba(232, 213, 181, 0.15))',
                  borderRadius: 'var(--radius-full, 9999px)',
                  color: 'var(--color-muted-cream, #E8D5B5)',
                  padding: '0.35rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontFamily: "'Noto Sans Devanagari', sans-serif",
                  transition: 'all 0.2s ease',
                }}
              >
                <Search size={14} />
                <span>खोजें</span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.55rem',
                    background: 'rgba(232, 213, 181, 0.1)',
                    padding: '0.05rem 0.35rem',
                    borderRadius: '2px',
                    opacity: 0.6,
                  }}
                >
                  ⌘K
                </span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Actions: Search + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            className="mobile-search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="खोजें"
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-warm-ivory, #F3E7D0)',
              padding: '6px',
              display: 'none', // shown via media query
              cursor: 'pointer',
            }}
          >
            <Search size={20} />
          </button>

          <button
            className="nav-toggle"
            aria-label={menuOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
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
