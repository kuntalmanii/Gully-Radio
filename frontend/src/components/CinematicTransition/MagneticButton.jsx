/**
 * MagneticButton
 * ──────────────────────────────────────────────────────────────
 * Wraps any element with a magnetic cursor attraction effect.
 * On mouse enter → element is pulled gently toward the cursor.
 * On mouse leave → springs back with elastic easing.
 * On click → subtle press scale + warm ripple ring.
 *
 * Props:
 *   children   — button content
 *   strength   — how strongly the element follows the cursor (default 0.28)
 *   tag        — HTML element to render (default 'button')
 *   className  — forwarded to the inner element
 *   onClick    — forwarded click handler
 *   ...rest    — all other props forwarded
 */

import { useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'
import './transition.css'

export default function MagneticButton({
  children,
  strength   = 0.28,
  tag: Tag   = 'button',
  className  = '',
  onClick,
  ...rest
}) {
  const wrapRef  = useRef(null)
  const innerRef = useRef(null)
  const [ripples, setRipples] = useState([])

  /* ── Magnetic pull ─────────────────────────────────────────── */
  const onMouseMove = useCallback((e) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx   = (e.clientX - (rect.left + rect.width  / 2)) * strength
    const dy   = (e.clientY - (rect.top  + rect.height / 2)) * strength

    gsap.to(el, {
      x: dx,
      y: dy,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [strength])

  /* ── Elastic return ────────────────────────────────────────── */
  const onMouseLeave = useCallback(() => {
    gsap.to(wrapRef.current, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.45)',
      overwrite: 'auto',
    })
  }, [])

  /* ── Click: press scale + ripple ──────────────────────────── */
  const handleClick = useCallback((e) => {
    const inner = innerRef.current
    if (inner) {
      gsap.timeline()
        .to(inner, { scale: 0.94, duration: 0.1, ease: 'power2.in' })
        .to(inner, { scale: 1,    duration: 0.5, ease: 'elastic.out(1, 0.5)' })
    }

    // Add a ripple and remove it after animation
    const id = Date.now()
    setRipples((r) => [...r, id])
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 720)

    onClick?.(e)
  }, [onClick])

  return (
    /* Outer wrapper receives the magnetic translate */
    <div ref={wrapRef} className="ct-magnetic-wrap" style={{ display: 'inline-block' }}>
      {/* Inner element receives the press scale */}
      <Tag
        ref={innerRef}
        className={className}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
        style={{ position: 'relative', overflow: 'hidden' }}
        {...rest}
      >
        {children}

        {/* Ripple rings */}
        {ripples.map((id) => (
          <span key={id} className="ct-ripple-ring" aria-hidden="true" />
        ))}
      </Tag>
    </div>
  )
}
