/**
 * CinematicTransition
 * ──────────────────────────────────────────────────────────────
 * Context provider that:
 *   1. Renders a full-screen dark overlay (always in DOM at opacity 0)
 *   2. Exposes `trigger({ to, onExit })` to kick off a transition
 *   3. Auto-reveals (fades overlay out) on every route change
 *
 * Usage:
 *   // Wrap your routes once at App level:
 *   <CinematicTransition><Routes>…</Routes></CinematicTransition>
 *
 *   // Inside any component:
 *   const { trigger } = useCinematicTransition()
 *   trigger({ to: '/experience', onExit: (masterTl) => { … } })
 *
 *   // The `onExit` callback receives the master GSAP timeline.
 *   // Add animations to it; the overlay fade + navigate are
 *   // appended automatically at the end.
 */

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import './transition.css'

/* ── Context ──────────────────────────────────────────────────── */
const CinematicCtx = createContext(null)

/* ── Provider ─────────────────────────────────────────────────── */
export function CinematicTransition({ children }) {
  const overlayRef  = useRef(null)
  const navigate    = useNavigate()
  const location    = useLocation()
  const isBusyRef   = useRef(false)  // prevent double-triggers

  /* Auto-reveal: fade overlay OUT on every route change ──────── */
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    gsap.to(overlay, {
      opacity: 0,
      duration: 1.1,
      delay: 0.12,
      ease: 'power2.out',
      onStart: () => overlay.classList.remove('ct-overlay--active'),
    })
  }, [location.pathname])

  /* trigger() — the main API ──────────────────────────────────── */
  const trigger = useCallback(({ to = '/', onExit } = {}) => {
    if (isBusyRef.current) return
    isBusyRef.current = true

    const overlay = overlayRef.current
    const masterTl = gsap.timeline({
      onComplete: () => {
        isBusyRef.current = false
      },
    })

    /* Let caller add hero-specific exit animations */
    if (typeof onExit === 'function') {
      onExit(masterTl)
    }

    /* After exit animations settle, fade overlay in → navigate */
    const exitDur = masterTl.duration() || 0
    const fadeStart = Math.max(exitDur - 0.6, 1.2)

    masterTl.to(
      overlay,
      {
        opacity: 1,
        duration: 1.0,
        ease: 'power2.inOut',
        onStart:    () => overlay.classList.add('ct-overlay--active'),
        onComplete: () => navigate(to),
      },
      fadeStart
    )
  }, [navigate])

  return (
    <CinematicCtx.Provider value={{ trigger }}>
      {children}
      {/* Overlay: always present, never blocks when transparent */}
      <div ref={overlayRef} className="ct-overlay" aria-hidden="true" />
    </CinematicCtx.Provider>
  )
}

/* ── Hook ─────────────────────────────────────────────────────── */
export function useCinematicTransition() {
  const ctx = useContext(CinematicCtx)
  if (!ctx) {
    throw new Error(
      'useCinematicTransition() must be called inside <CinematicTransition>'
    )
  }
  return ctx
}

export { default as MagneticButton } from './MagneticButton'
