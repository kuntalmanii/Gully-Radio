/**
 * Hero.jsx
 * ──────────────────────────────────────────────────────────────
 * लेक्चर Time Hero Experience — Phase 2 Cinematic Indian Street
 *
 * Visual hierarchy:
 *   TOP:
 *     गली रेडियो (GULLY RADIO) · खोजें · मिक्सटेप · लाइब्रेरी
 *
 *   CENTER / LOWER LEFT:
 *     संगीत
 *     जो वक़्त
 *     से बाहर है।
 *
 *   SUPPORTING:
 *     पुरानी गलियों की नई आवाज़।
 *
 *   CTA:
 *     गली में चलें
 *     सुनें • खोजें • याद करें
 *
 *   BOTTOM CENTER:
 *     नीचे चलें ↓
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useCinematicTransition } from './CinematicTransition'
import '../styles/hero.css'

const PARTICLE_COUNT = 18
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id:       i,
  size:     0.8 + Math.random() * 1.6,
  left:     `${(Math.random() * 96 + 2).toFixed(2)}%`,
  delay:    `${(Math.random() * 12).toFixed(2)}s`,
  duration: `${(18 + Math.random() * 14).toFixed(2)}s`,
  opacity:  0.1 + Math.random() * 0.25,
  drift:    `${(Math.random() * 24 - 12).toFixed(1)}px`,
}))

/* Cinematic editorial reveal with subtle blur-to-sharp transition */
const FADE_UP_BLUR = {
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.1,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function Hero() {
  const bgRef        = useRef(null)
  const heroRef      = useRef(null)
  const headlineRef  = useRef(null)
  const taglineRef   = useRef(null)
  const kbTlRef      = useRef(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { trigger } = useCinematicTransition()

  /* ─── 1. Cinematic Camera Effect — 1.00 -> 1.025 over 16s ───── */
  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Slow, barely noticeable linear/ease-out camera drift
    const tl = gsap.timeline({ defaults: { ease: 'power1.out' } })
    tl.fromTo(bg, { scale: 1.0 }, { scale: 1.025, duration: 16 })
    kbTlRef.current = tl

    return () => tl.kill()
  }, [])

  /* ─── 2. Desktop Subtle Mouse Parallax (Damped) ───────────────── */
  useEffect(() => {
    const hero = heroRef.current
    const bg   = bgRef.current
    if (!hero || !bg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return

    let rafId = null

    const onMouseMove = (e) => {
      if (rafId || isTransitioning) return
      rafId = requestAnimationFrame(() => {
        const cx = e.clientX / window.innerWidth  - 0.5
        const cy = e.clientY / window.innerHeight - 0.5
        // Maximum gentle movement of ±10px x and ±6px y
        gsap.to(bg, {
          x: -cx * 10,
          y: -cy * 6,
          duration: 2.2,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        rafId = null
      })
    }

    hero.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      hero.removeEventListener('mousemove', onMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isTransitioning])

  /* ─── 3. Enter the Street Transition ────────────────────────── */
  const handleEnterStreet = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)

    trigger({
      to: '/experience',
      onExit: (tl) => {
        const bg        = bgRef.current
        const headline  = headlineRef.current
        const tagline   = taglineRef.current

        kbTlRef.current?.kill()

        tl.to('.site-header', { opacity: 0, y: -16, duration: 0.5, ease: 'power2.inOut' }, 0)

        if (headline) {
          const lines = headline.querySelectorAll('span')
          tl.to(lines, {
            opacity: 0,
            y: -48,
            filter: 'blur(8px)',
            duration: 0.75,
            stagger: 0.06,
            ease: 'power3.inOut',
          }, 0.1)
        }

        tl.to(tagline, { opacity: 0, y: -28, duration: 0.6, ease: 'power2.inOut' }, 0.22)

        tl.to(bg, {
          scale:    2.3,
          x:       '-8%',
          y:        '3%',
          duration: 3.2,
          ease:     'power2.inOut',
        }, 0.12)

        tl.to('.hero-vignette',    { opacity: 1.0, duration: 2.2, ease: 'power2.inOut' }, 0.45)
          .to('.hero-bottom-fade', { opacity: 1.0, duration: 1.8, ease: 'power2.inOut' }, 0.55)
          .to('.hero-color-grade', { opacity: 1.0, duration: 1.8, ease: 'power2.inOut' }, 0.7)
          .to('.hero-grain',       { opacity: 0.1, duration: 1.4 },                     0.35)
      },
    })
  }, [trigger, isTransitioning])

  return (
    <section
      ref={heroRef}
      className="hero-section"
      aria-label="लेक्चर Time — मुख्य पृष्ठ"
    >
      {/* ── Background Layer (Classroom / Street Photograph) ───── */}
      <div className="hero-bg-wrap" aria-hidden="true">
        <div
          ref={bgRef}
          className="hero-bg"
          role="img"
          aria-label="PW IOI School of Technology Classroom & Indian Street"
        />
      </div>

      {/* ── Atmospheric Overlays & Color Grade ─────────────────── */}
      <div className="hero-color-grade" aria-hidden="true" />
      <div className="hero-vignette"    aria-hidden="true" />
      <div className="hero-bottom-fade" aria-hidden="true" />
      <div className="hero-grain"       aria-hidden="true" />

      {/* Warm Ambient Lamp Halo */}
      <div
        className="ambient-light-halo ambient-light-halo--amber"
        style={{
          width: 'min(480px, 55vw)',
          height: 'min(480px, 55vw)',
          left: '12%',
          bottom: '18%',
          opacity: 0.7,
        }}
        aria-hidden="true"
      />

      {/* ── Atmospheric Dust Particles ─────────────────────────── */}
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

      {/* ── Center Devanagari Headline & Branding (Single Page Layout) ─────── */}
      <div className="hero-content hero-content--centered">
        <motion.div
          ref={headlineRef}
          className="hero-headline-wrap"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="hero-brand-title"
            variants={FADE_UP_BLUR}
            custom={0.5}
            aria-label="लेक्चर TIME"
          >
            <span className="brand-hindi">लेक्चर</span>{' '}
            <span className="brand-english">TIME</span>
          </motion.h1>

          <motion.p
            ref={taglineRef}
            className="hero-tagline"
            variants={FADE_UP_BLUR}
            custom={0.8}
          >
            पुरानी गलियों की नई आवाज़ • संगीत जो वक़्त से बाहर है
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
