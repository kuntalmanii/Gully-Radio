/**
 * ProgressBar.jsx
 * Seek slider + current time / duration display.
 *
 * Uses a CSS custom property --fill on the range input to drive
 * the filled-track color — updated imperatively via a ref to
 * avoid expensive React re-renders on every timeupdate event.
 */

import { useRef, useEffect, useCallback } from 'react'

/* ── Helpers ──────────────────────────────────────────────────── */
export function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function ProgressBar({
  currentTime,
  duration,
  onSeek,
  className = '',
  showTime  = true,
}) {
  const rangeRef = useRef(null)

  /* Update --fill CSS variable imperatively (avoids full re-render) */
  useEffect(() => {
    const pct = duration > 0 ? (currentTime / duration) * 100 : 0
    rangeRef.current?.style.setProperty('--fill', `${pct.toFixed(2)}%`)
  }, [currentTime, duration])

  const handleChange = useCallback((e) => {
    onSeek?.(Number(e.target.value))
  }, [onSeek])

  /* During seek drag, update fill in real time (the state update
     from onSeek may be slightly delayed) */
  const handleInput = useCallback((e) => {
    const pct = duration > 0 ? (Number(e.target.value) / duration) * 100 : 0
    e.target.style.setProperty('--fill', `${pct.toFixed(2)}%`)
  }, [duration])

  return (
    <div className={`player-progress ${className}`}>
      {showTime && (
        <span className="player-time" aria-label="Current time">
          {formatTime(currentTime)}
        </span>
      )}

      <input
        ref={rangeRef}
        type="range"
        className="player-range player-seek"
        min={0}
        max={duration || 100}
        step={0.25}
        value={currentTime}
        onChange={handleChange}
        onInput={handleInput}
        aria-label="Seek"
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
      />

      {showTime && (
        <span className="player-time player-time--right" aria-label="Duration">
          {formatTime(duration)}
        </span>
      )}
    </div>
  )
}
