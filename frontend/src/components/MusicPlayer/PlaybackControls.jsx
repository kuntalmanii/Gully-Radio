/**
 * PlaybackControls.jsx
 * Previous / Play-Pause / Next + optional Shuffle/Repeat.
 */

import { SkipBack, SkipForward } from 'lucide-react'
import PlayButton from './PlayButton'

export default function PlaybackControls({
  isPlaying,
  isLoading,
  onTogglePlay,
  onPrev,
  onNext,
}) {
  return (
    <div className="player-controls">
      <button
        className="player-btn player-btn--skip"
        onClick={onPrev}
        aria-label="Previous track"
        type="button"
      >
        <SkipBack size={16} strokeWidth={1.5} />
      </button>

      <PlayButton
        isPlaying={isPlaying}
        isLoading={isLoading}
        onClick={onTogglePlay}
      />

      <button
        className="player-btn player-btn--skip"
        onClick={onNext}
        aria-label="Next track"
        type="button"
      >
        <SkipForward size={16} strokeWidth={1.5} />
      </button>
    </div>
  )
}
