/**
 * Hero.jsx
 * ──────────────────────────────────────────────────────────────
 * Gully Radio Hero Experience — Contemporary Devanagari Identity.
 *
 * Headline:
 *   संगीत
 *   जो वक़्त
 *   से बाहर है।
 *
 * Supporting Line:
 *   पुरानी गलियों की नई आवाज़।
 *
 * CTA:
 *   गली में चलें
 *   सुनें • खोजें • याद करें
 */

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useCinematicTransition, MagneticButton } from './CinematicTransition'
import '../styles/hero.css'

const PARTICLE_COUNT = 22
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id:       i,
  size:     0.8 + Math.random() * 1.8,
  left:     `${(Math.random() * 96 + 2).toFixed(2)}%`,
  delay:    `${(Math.random() * 14).toFixed(2)}s`,
  duration: `${(18 + Math.random() * 16).toFixed(2)}s`,
  opacity:  0.12 + Math.random() * 0.28,
  drift:    `${(Math.random() * 30 - 15).toFixed(1)}px`,
}))

const FADE_UP = {
  hidden:  { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.15, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const bgRef        = useRef(null)
  const heroRef      = useRef(null)
  const headlineRef  = useRef(null)
  const taglineRef   = useRef(null)
  const ctaRef       = useRef(null)
  const kbTlRef      = useRef(null)
  const shopHintRef  = useRef(null)

  const { trigger } = useCinematicTransition()

  /* ─── Ken Burns — slow cinematic zoom ─────────────────────── */
  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return

    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
    tl.to(bg, { scale: 1.07, duration: 28 })
    kbTlRef.current = tl

    return () => tl.kill()
  }, [])

  /* ─── Shop hint — appears 3.5s after mount ─────────────────── */
  useEffect(() => {
    const hint = shopHintRef.current
    if (!hint) return
    const t = setTimeout(() => hint.classList.add('is-visible'), 3500)
    return () => clearTimeout(t)
  }, [])

  /* ─── Subtle mouse parallax ──────────────────────────────────*/
  useEffect(() => {
    const hero = heroRef.current
    const bg   = bgRef.current
    if (!hero || !bg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = null

    const onMouseMove = (e) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const cx = e.clientX / window.innerWidth  - 0.5
        const cy = e.clientY / window.innerHeight - 0.5
        gsap.to(bg, { x: -cx * 18, y: -cy * 12, duration: 2, ease: 'power2.out', overwrite: 'auto' })
        rafId = null
      })
    }

    hero.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      hero.removeEventListener('mousemove', onMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  /* ─── Cinematic entrance transition ────────────────────────── */
  const handleEnterStreet = useCallback(() => {
    trigger({
      to: '/experience',

      onExit: (tl) => {
        const bg        = bgRef.current
        const headline  = headlineRef.current
        const tagline   = taglineRef.current
        const cta       = ctaRef.current

        kbTlRef.current?.kill()

        tl.to('.site-header',           { opacity: 0, y: -18, duration: 0.55, ease: 'power2.inOut' }, 0)
          .to('.hero-scroll-indicator', { opacity: 0, duration: 0.3 }, 0)

        if (headline) {
          const lines = headline.querySelectorAll('span')
          tl.to(lines, {
            opacity: 0,
            y: -56,
            duration: 0.8,
            stagger: 0.07,
            ease: 'power3.inOut',
          }, 0.12)
        }

        tl.to(tagline, { opacity: 0, y: -32, duration: 0.65, ease: 'power2.inOut' }, 0.28)
          .to(cta,     { opacity: 0, y: -20, duration: 0.55, ease: 'power2.inOut' }, 0.38)

        tl.to(bg, {
          scale:    2.4,
          x:       '-9%',
          y:        '4%',
          duration: 3.4,
          ease:     'power2.inOut',
        }, 0.15)

        tl.to('.hero-vignette',    { opacity: 1.8, duration: 2.4, ease: 'power2.inOut' }, 0.5)
          .to('.hero-bottom-fade', { opacity: 2.0, duration: 2.0, ease: 'power2.inOut' }, 0.6)
          .to('.hero-color-grade', { opacity: 1.6, duration: 2.0, ease: 'power2.inOut' }, 0.8)
          .to('.hero-grain',       { opacity: 0.12, duration: 1.5 },                     0.4)
      },
    })
  }, [trigger])

  /* ─── Shop transition — zoom toward cassette stall ─────────── */
  const handleEnterShop = useCallback(() => {
    trigger({
      to: '/shop',

      onExit: (tl) => {
        const bg       = bgRef.current
        const headline = headlineRef.current
        const tagline  = taglineRef.current
        const cta      = ctaRef.current

        kbTlRef.current?.kill()

        tl.to('.site-header',           { opacity: 0, y: -18, duration: 0.5, ease: 'power2.inOut' }, 0)
          .to('.hero-scroll-indicator', { opacity: 0, duration: 0.3 }, 0)
          .to(shopHintRef.current,      { opacity: 0, duration: 0.3 }, 0)

        if (headline) {
          const lines = headline.querySelectorAll('span')
          tl.to(lines, { opacity: 0, y: -40, duration: 0.7, stagger: 0.06, ease: 'power3.inOut' }, 0.1)
        }

        tl.to(tagline, { opacity: 0, y: -24, duration: 0.6, ease: 'power2.inOut' }, 0.2)
          .to(cta,     { opacity: 0, y: -18, duration: 0.5, ease: 'power2.inOut' }, 0.3)

        tl.to(bg, {
          scale:           2.8,
          x:               '8%',
          y:               '-6%',
          transformOrigin: '15% 60%',
          duration:        3.2,
          ease:            'power2.inOut',
        }, 0.1)

        tl.to('.hero-vignette',    { opacity: 2.0, duration: 2.2, ease: 'power2.inOut' }, 0.4)
          .to('.hero-bottom-fade', { opacity: 2.0, duration: 1.8, ease: 'power2.inOut' }, 0.5)
          .to('.hero-color-grade', { opacity: 1.8, duration: 2.0, ease: 'power2.inOut' }, 0.7)
      },
    })
  }, [trigger])

  return (
    <section
      ref={heroRef}
      className="hero-section"
      aria-label="गली रेडियो — मुख्य पृष्ठ (Hero)"
    >
      {/* ── Background ─────────────────────────────────────────── */}
      <div className="hero-bg-wrap" aria-hidden="true">
        <div
          ref={bgRef}
          className="hero-bg"
          role="img"
          aria-label="Vintage Indian street with cassette shop"
        />
      </div>

      {/* ── Overlays & Ambient Light Halos ───────────────────── */}
      <div className="hero-color-grade" aria-hidden="true" />
      <div className="hero-vignette"    aria-hidden="true" />
      <div className="hero-bottom-fade" aria-hidden="true" />
      <div className="hero-grain"       aria-hidden="true" />

      {/* Warm Ambient Lamp Halo over Cassette Stall */}
      <div
        className="ambient-light-halo ambient-light-halo--amber"
        style={{
          width: 'min(500px, 60vw)',
          height: 'min(500px, 60vw)',
          left: '12%',
          bottom: '18%',
          opacity: 0.75,
        }}
        aria-hidden="true"
      />


      {/* ── Particles ──────────────────────────────────────────── */}
      <div className="hero-particles" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="hero-particle"
            style={{
              width:             `${p.size}px`,
              height:            `${p.size}px`,
              left:              p.left,
              opacity:           0,
              animationDelay:    p.delay,
              animationDuration: p.duration,
              '--drift':         p.drift,
            }}
          />
        ))}
      </div>

      {/* ── Contemporary Devanagari Headline & Copy ─────────────── */}
      <div className="hero-content">
        <motion.h1
          ref={headlineRef}
          className="hero-headline"
          initial="hidden"
          animate="visible"
          aria-label="संगीत जो वक़्त से बाहर है।"
        >
          <motion.span className="line-1" variants={FADE_UP} custom={0.65}>संगीत</motion.span>
          <motion.span className="line-2" variants={FADE_UP} custom={0.82}>जो वक़्त</motion.span>
          <motion.span className="line-3" variants={FADE_UP} custom={1.0}>से बाहर है।</motion.span>
        </motion.h1>

        <motion.p
          ref={taglineRef}
          className="hero-tagline"
          variants={FADE_UP}
          custom={1.35}
          initial="hidden"
          animate="visible"
        >
          पुरानी गलियों की नई आवाज़।
        </motion.p>

        <motion.div
          ref={ctaRef}
          className="hero-cta"
          variants={FADE_UP}
          custom={1.65}
          initial="hidden"
          animate="visible"
        >
          <MagneticButton
            className="btn-enter"
            type="button"
            strength={0.28}
            onClick={handleEnterStreet}
            aria-label="गली में चलें"
          >
            गली में चलें
          </MagneticButton>

          <span className="hero-listen-line" aria-hidden="true">
            सुनें&nbsp;&bull;&nbsp;खोजें&nbsp;&bull;&nbsp;याद करें
          </span>
        </motion.div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────── */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.6 }}
        aria-hidden="true"
      >
        <span className="scroll-label">नीचे चलें</span>
        <div className="scroll-line" />
      </motion.div>

      {/* ── Shop zone hotspot ───────────────────────────────────── */}
      <div
        className="hero-shop-zone"
        onClick={handleEnterShop}
        role="button"
        tabIndex={0}
        aria-label="दुकान में चलें (Enter the cassette shop)"
        onKeyDown={(e) => e.key === 'Enter' && handleEnterShop()}
      >
        <div className="hero-shop-glow" aria-hidden="true" />

        <div ref={shopHintRef} className="hero-shop-hint" aria-hidden="true">
          <div className="hero-shop-hint-ring">
            <div className="hero-shop-hint-dot" />
          </div>
          <span className="hero-shop-hint-label">दुकान में चलें</span>
        </div>
      </div>
    </section>
  )
}
