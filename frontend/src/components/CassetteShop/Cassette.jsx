/**
 * Cassette.jsx
 * ──────────────────────────────────────────────────────────────
 * A CSS-rendered cassette tape.
 *
 * Props:
 *   mixtape   — data from shopData.js
 *   size      — 'sm' | 'md' | 'lg'
 *   isPlaying — reel spin animation
 *   onClick   — click handler
 *   style     — extra inline styles (for GSAP overrides)
 *   ref       — forwarded ref (used for GSAP targeting)
 */

import { forwardRef } from 'react'

/* ── Artwork decoration per label art style ───────────────────── */
function ArtworkDecoration({ style, accentColor }) {
  switch (style) {
    case 'grid':
      return <div className="cassette-art-grid" />
    case 'lines':
      return <div className="cassette-art-lines" />
    case 'circles':
      return <div className="cassette-art-circles" />
    case 'dots':
      return <div className="cassette-art-dots" />
    case 'diagonal':
      return <div className="cassette-art-diagonal" />
    case 'line':
      return (
        <div
          className="cassette-art-line"
          style={{ background: accentColor, opacity: 0.55 }}
        />
      )
    default:
      return null
  }
}

/* ── Cassette ─────────────────────────────────────────────────── */
const Cassette = forwardRef(function Cassette(
  { mixtape, size = 'md', isPlaying = false, onClick, style },
  ref
) {
  const { theme, title, curator, year, labelArt } = mixtape

  return (
    <div
      ref={ref}
      className={`cassette cassette--${size}`}
      onClick={onClick}
      style={style}
      aria-label={`${title} by ${curator}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Shell */}
      <div
        className="cassette-shell"
        style={{ background: theme.shell }}
      >
        {/* Corner pegs */}
        <div className="cassette-pegs" aria-hidden="true">
          <div className="cassette-peg cassette-peg--tl" style={{ background: theme.screw }} />
          <div className="cassette-peg cassette-peg--tr" style={{ background: theme.screw }} />
          <div className="cassette-peg cassette-peg--bl" style={{ background: theme.screw }} />
          <div className="cassette-peg cassette-peg--br" style={{ background: theme.screw }} />
        </div>

        {/* Left reel */}
        <div
          className={`cassette-reel-hole${isPlaying ? ' cassette-reel-hole--spinning' : ''}`}
          aria-hidden="true"
          style={{ borderColor: `${theme.accent}22` }}
        />

        {/* Center label */}
        <div className="cassette-label-block">
          {/* Artwork stripe */}
          <div
            className="cassette-artwork-stripe"
            style={{ background: theme.stripe }}
          >
            <ArtworkDecoration style={labelArt} accentColor={theme.accent} />
            {/* Accent colour overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(90deg, ${theme.accent}44 0%, transparent 100%)`,
              }}
            />
          </div>

          {/* Title + metadata */}
          <div
            className="cassette-text-area"
            style={{ background: theme.label }}
          >
            <span
              className="cassette-label-title"
              style={{ color: theme.text }}
            >
              {title}
            </span>
            <span
              className="cassette-label-sub"
              style={{ color: theme.text }}
            >
              {curator} · {year}
            </span>
          </div>
        </div>

        {/* Right reel */}
        <div
          className={`cassette-reel-hole${isPlaying ? ' cassette-reel-hole--spinning-slow' : ''}`}
          aria-hidden="true"
          style={{ borderColor: `${theme.accent}22` }}
        />

        {/* Tape window (bottom strip) */}
        <div className="cassette-window" aria-hidden="true">
          <div className="cassette-tape" style={{ background: `${theme.accent}44` }} />
        </div>
      </div>
    </div>
  )
})

export default Cassette
