/**
 * AudioContext.jsx
 * ──────────────────────────────────────────────────────────────
 * Lifts useAudioPlayer to App level so audio survives route changes.
 *
 * AudioProvider:  wrap once in App.jsx (outside Routes)
 * useAudio():     consume anywhere in the tree
 */

import { createContext, useContext, useEffect } from 'react'
import useAudioPlayer from '../hooks/useAudioPlayer'
import { getDefaultQueue } from '../services/musicService'

const AudioCtx = createContext(null)

/* ── Provider ─────────────────────────────────────────────────── */
export function AudioProvider({ children }) {
  const audio = useAudioPlayer()

  /* Load the default track queue once on app start (no autoplay) */
  useEffect(() => {
    audio.loadQueue(getDefaultQueue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <AudioCtx.Provider value={audio}>{children}</AudioCtx.Provider>
}

/* ── Consumer hook ─────────────────────────────────────────────── */
export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio() must be used inside <AudioProvider>')
  return ctx
}
