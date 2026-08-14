/**
 * Cassette.jsx
 * ──────────────────────────────────────────────────────────────
 * A CSS-rendered tactile analog cassette tape.
 *
 * Enriched with:
 *  - Plastic shell gloss & bevel sheen
 *  - Metallic screw reflections
 *  - Magnetic tape scanline texture
 *  - Ambient reel backlight when playing
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
        style={{
          background: theme.shell,
          boxShadow: isPlaying
            ? `0 0 28px ${theme.accent}33, inset 0 1px 1px rgba(255,255,255,0.18)`
            : '0 8px 24px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.12)',
        }}
      >
        {/* Analog Sheen Texture Overlay */}
        <div className="tape-plastic-sheen" aria-hidden="true" />
        <div className="analog-scanlines" aria-hidden="true" />

        {/* Corner screws with metallic reflections */}
        <div className="cassette-pegs" aria-hidden="true">
          <div className="cassette-peg cassette-peg--tl metallic-screw-reflection" style={{ background: theme.screw }} />
          <div className="cassette-peg cassette-peg--tr metallic-screw-reflection" style={{ background: theme.screw }} />
          <div className="cassette-peg cassette-peg--bl metallic-screw-reflection" style={{ background: theme.screw }} />
          <div className="cassette-peg cassette-peg--br metallic-screw-reflection" style={{ background: theme.screw }} />
        </div>

        {/* Left reel */}
        <div
          className={`cassette-reel-hole${isPlaying ? ' cassette-reel-hole--spinning' : ''}`}
          aria-hidden="true"
          style={{ borderColor: `${theme.accent}33` }}
        />

        {/* Center label */}
        <div className="cassette-label-block">
          {/* Artwork stripe */}
          <div
            className="cassette-artwork-stripe"
            style={{ background: theme.stripe }}
          >
            <ArtworkDecoration style={labelArt} accentColor={theme.accent} />
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
          style={{ borderColor: `${theme.accent}33` }}
        />

        {/* Tape window with illuminated backlight */}
        <div className="cassette-window" aria-hidden="true">
          <div
            className="cassette-tape"
            style={{
              background: isPlaying
                ? `linear-gradient(90deg, #120a05 0%, ${theme.accent}66 50%, #120a05 100%)`
                : `${theme.accent}33`,
            }}
          />
        </div>
      </div>
    </div>
  )
})

export default Cassette
