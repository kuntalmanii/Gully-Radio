import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = ['DISCOVER', 'MIXTAPES', 'LIBRARY']

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Darken header slightly after user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
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
            ? 'linear-gradient(to bottom, rgba(23,21,18,0.92) 0%, rgba(23,21,18,0.70) 100%)'
            : 'linear-gradient(to bottom, rgba(23,21,18,0.72) 0%, transparent 100%)',
          transition: 'background 0.5s ease',
        }}
      >
        {/* Logo */}
        <a href="/" className="site-logo" aria-label="Gully Radio home">
          GULLY RADIO
        </a>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation">
          <ul className="site-nav" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`}>{link}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
        </button>
      </motion.header>

      {/* Mobile navigation drawer */}
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
                background: 'rgba(23,21,18,0.5)',
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
                width: 'min(280px, 80vw)',
                background: 'rgba(23, 21, 18, 0.98)',
                borderLeft: '1px solid rgba(215, 178, 122, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '2.5rem',
                padding: '4rem 3rem',
                zIndex: 200,
              }}
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '0.85rem',
                    letterSpacing: '0.2em',
                    color: 'rgba(242, 229, 204, 0.7)',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                  }}
                >
                  {link}
                </motion.a>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
