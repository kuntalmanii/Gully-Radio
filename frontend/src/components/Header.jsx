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
 *   खोजें • मिक्सटेप • लाइब्रेरी (with subtle English subtitles)
 */

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { labelHi: 'खोजें', labelEn: 'DISCOVER', path: '/discover' },
  { labelHi: 'मिक्सटेप', labelEn: 'MIXTAPES', path: '/mixtapes' },
  { labelHi: 'लाइब्रेरी', labelEn: 'LIBRARY', path: '/library' },

]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Darken header slightly after user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
      <motion.header
        className="site-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: scrolled
            ? 'linear-gradient(to bottom, rgba(23,21,18,0.96) 0%, rgba(23,21,18,0.85) 100%)'
            : 'linear-gradient(to bottom, rgba(23,21,18,0.78) 0%, transparent 100%)',
          transition: 'background 0.5s ease',
        }}
      >
        {/* Brand Presentation: Primary Devanagari Display + Subtle Supporting English Label */}
        <Link to="/" className="site-logo-wrap" aria-label="गली रेडियो (Gully Radio) Home" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontFamily: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
              fontSize: '1.42rem',
              fontWeight: 400,
              color: '#F2E5CC',
              lineHeight: 1.15,
              letterSpacing: '0.02em',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}
          >
            गली रेडियो
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.48rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              color: '#D7B27A',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            GULLY RADIO
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
                      transition: 'color 0.25s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Noto Sans Devanagari', sans-serif",
                        fontSize: '0.84rem',
                        fontWeight: 400,
                        color: isActive ? '#D7B27A' : '#F2E5CC',
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
                        color: isActive ? '#D7B27A' : 'rgba(215, 178, 122, 0.45)',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      {item.labelEn}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Mobile Hamburger */}
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
                background: 'rgba(23,21,18,0.7)',
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
                width: 'min(290px, 82vw)',
                background: 'rgba(23, 21, 18, 0.98)',
                borderLeft: '1px solid rgba(215, 178, 122, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '2.4rem',
                padding: '4rem 2.5rem',
                zIndex: 200,
              }}
              aria-label="मोबाइल नेविगेशन"
            >
              <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(215, 178, 122, 0.12)', paddingBottom: '1rem' }}>
                <span
                  style={{
                    fontFamily: "'Tiro Devanagari Hindi', serif",
                    fontSize: '1.6rem',
                    color: '#F2E5CC',
                    display: 'block',
                  }}
                >
                  गली रेडियो
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.55rem',
                    letterSpacing: '0.25em',
                    color: '#D7B27A',
                    textTransform: 'uppercase',
                  }}
                >
                  GULLY RADIO ARCHIVE
                </span>
              </div>

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
                      color: location.pathname === item.path ? '#D7B27A' : '#F2E5CC',
                    }}
                  >
                    {item.labelHi}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.55rem',
                      letterSpacing: '0.22em',
                      color: 'rgba(215, 178, 122, 0.45)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.labelEn}
                  </span>
                </Link>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
