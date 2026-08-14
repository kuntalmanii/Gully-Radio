/**
 * VolumeControl.jsx
 * Mute toggle icon + volume range slider.
 * Displays speaker icon variant based on volume level.
 */

import { useRef, useEffect, useCallback } from 'react'
import { Volume2, Volume1, VolumeX } from 'lucide-react'

function VolumeIcon({ volume, isMuted }) {
  if (isMuted || volume === 0) return <VolumeX size={15} strokeWidth={1.5} />
  if (volume < 0.5)            return <Volume1 size={15} strokeWidth={1.5} />
  return                              <Volume2 size={15} strokeWidth={1.5} />
}

export default function VolumeControl({ volume, isMuted, onVolumeChange, onMuteToggle }) {
  const rangeRef = useRef(null)

  /* Update --fill CSS variable imperatively */
  useEffect(() => {
    const pct = isMuted ? 0 : volume * 100
    rangeRef.current?.style.setProperty('--fill', `${pct.toFixed(1)}%`)
  }, [volume, isMuted])

  const handleChange = useCallback((e) => {
    onVolumeChange?.(Number(e.target.value))
  }, [onVolumeChange])

  const handleInput = useCallback((e) => {
    e.target.style.setProperty('--fill', `${(Number(e.target.value) * 100).toFixed(1)}%`)
  }, [])

  return (
    <div className="player-volume" role="group" aria-label="Volume">
      <button
        className="player-btn"
        onClick={onMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        type="button"
        style={{ padding: '0.3rem' }}
      >
        <VolumeIcon volume={volume} isMuted={isMuted} />
      </button>

      <input
        ref={rangeRef}
        type="range"
        className="player-range player-volume-input"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={handleChange}
        onInput={handleInput}
        aria-label="Volume"
        aria-valuetext={isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
      />
    </div>
  )
}
