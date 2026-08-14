/**
 * QueueButton.jsx
 * Toggle button for the queue panel with Hindi aria-label.
 */

import { ListMusic } from 'lucide-react'

export default function QueueButton({ queueLength, isOpen, onClick }) {
  return (
    <div className="player-queue-btn">
      <button
        className="player-btn"
        onClick={onClick}
        aria-label={isOpen ? 'कतार बंद करें' : 'कतार देखें'}
        title="कतार (Queue)"
        aria-expanded={isOpen}
        type="button"
        style={{ color: isOpen ? 'rgba(215,178,122,0.8)' : undefined }}
      >
        <ListMusic size={16} strokeWidth={1.5} />
      </button>

      {queueLength > 0 && (
        <span className="player-queue-count" aria-hidden="true" style={{ fontFamily: "'Inter', sans-serif" }}>
          {queueLength}
        </span>
      )}
    </div>
  )
}
