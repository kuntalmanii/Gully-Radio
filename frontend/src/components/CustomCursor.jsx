/**
 * CustomCursor.jsx
 * ──────────────────────────────────────────────────────────────
 * Subtle, luxury analog custom cursor for desktop browsers.
 *
 * States:
 *  - default: small precision dot with smooth trailing ring
 *  - hover: expanded soft amber ring
 *  - play: subtle play triangle indicator over playable elements
 *  - drag: compact grip indicator over sliders
 *
 * Automatically disabled on touch screens / mobile devices.
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [cursorState, setCursorState] = useState('default') // 'default' | 'hover' | 'play' | 'drag'
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(true)

  const posRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    if (typeof window === 'undefined') return
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hasFinePointer) {
      setIsTouch(true)
      return
    }
    setIsTouch(false)

    const onMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      // Check hovered element
      const target = e.target
      if (!target) return

      const isPlayable = target.closest(
        '.library-track-row, .cassette-card, .cassette-play-cta, .player-btn--play, [data-cursor="play"]'
      )
      const isDraggable = target.closest('input[type="range"], .player-range, [data-cursor="drag"]')
      const isInteractive = target.closest(
        'button, a, input, select, textarea, [role="button"], [tabindex="0"], .interactive'
      )

      if (isPlayable) {
        setCursorState('play')
      } else if (isDraggable) {
        setCursorState('drag')
      } else if (isInteractive) {
        setCursorState('hover')
      } else {
        setCursorState('default')
      }
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    // Smooth RAF position update
    const updateCursor = () => {
      setPosition({ x: posRef.current.x, y: posRef.current.y })
      rafRef.current = requestAnimationFrame(updateCursor)
    }
    rafRef.current = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  if (isTouch || !isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      aria-hidden="true"
    >
      {/* Precision Core Dot */}
      <motion.div
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          scale: cursorState === 'hover' ? 0 : cursorState === 'play' ? 0 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.05, ease: 'linear' }}
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#E8D5B5',
          boxShadow: '0 0 6px rgba(232, 213, 181, 0.8)',
          position: 'absolute',
        }}
      />

      {/* Trailing Ambient Ring */}
      <motion.div
        animate={{
          x: position.x - (cursorState === 'play' ? 18 : cursorState === 'hover' ? 16 : 12),
          y: position.y - (cursorState === 'play' ? 18 : cursorState === 'hover' ? 16 : 12),
          width: cursorState === 'play' ? 36 : cursorState === 'hover' ? 32 : 24,
          height: cursorState === 'play' ? 36 : cursorState === 'hover' ? 32 : 24,
          borderColor:
            cursorState === 'play'
              ? 'rgba(198, 106, 62, 0.8)'
              : cursorState === 'hover'
              ? 'rgba(232, 213, 181, 0.65)'
              : 'rgba(232, 213, 181, 0.22)',
          backgroundColor:
            cursorState === 'play'
              ? 'rgba(169, 79, 53, 0.25)'
              : cursorState === 'hover'
              ? 'rgba(232, 213, 181, 0.08)'
              : 'transparent',
          scale: cursorState === 'drag' ? 0.85 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          borderWidth: '1px',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: cursorState === 'hover' || cursorState === 'play' ? 'blur(2px)' : 'none',
        }}
      >
        {cursorState === 'play' && (
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              borderLeft: '7px solid #F3E7D0',
              marginLeft: '2px',
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
