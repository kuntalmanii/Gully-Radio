/**
 * useAudioPlayer.js
 * ──────────────────────────────────────────────────────────────
 * Core hook wrapping the native HTML5 Audio API.
 *
 * Full Feature Set:
 *  - Single HTML5 Audio instance
 *  - Queue management: loadQueue, addToQueue, playNext, removeFromQueue, clearQueue
 *  - Automatic Recently Played tracking via libraryStorage
 *  - Real MP3 audio playback with seamless procedural fallback
 *  - Non-blocking error recovery
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { generateTrackAudioUrl } from '../services/audioGenerator'
import { addRecentlyPlayed } from '../services/libraryStorage'

const INITIAL_STATE = {
  isPlaying:      false,
  isLoading:      false,
  currentTime:    0,
  duration:       0,
  volume:         0.75,
  isMuted:        false,
  currentTrackId: null,
  queueIndex:     -1,
  error:          null,
}

export default function useAudioPlayer() {
  const audioRef     = useRef(null)
  const queueRef     = useRef([])
  const queueIdxRef  = useRef(-1)
  const stateRef     = useRef(INITIAL_STATE)

  const [state, setStateRaw] = useState(INITIAL_STATE)

  const setState = useCallback((updater) => {
    setStateRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      stateRef.current = next
      return next
    })
  }, [])

  /* ── Event-handler callbacks ───────────────────────────────── */
  const handleTimeUpdate = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    setState((s) => ({ ...s, currentTime: a.currentTime }))
  }, [setState])

  const handleLoadedMetadata = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    const dur = isFinite(a.duration) && a.duration > 0 ? a.duration : stateRef.current.duration
    setState((s) => ({ ...s, duration: dur, isLoading: false }))
  }, [setState])

  const handleWaiting  = useCallback(() => setState((s) => ({ ...s, isLoading: true  })), [setState])
  const handleCanPlay  = useCallback(() => setState((s) => ({ ...s, isLoading: false })), [setState])
  const handlePlaying  = useCallback(() => setState((s) => ({ ...s, isPlaying: true,  isLoading: false })), [setState])
  const handlePause    = useCallback(() => setState((s) => ({ ...s, isPlaying: false })), [setState])

  const handleError = useCallback((e) => {
    console.warn('[useAudioPlayer] Audio loading error on src, fallback to synthesized audio...', e)
    const currentTrack = queueRef.current[queueIdxRef.current]
    if (currentTrack && audioRef.current) {
      const fallbackUrl = generateTrackAudioUrl(currentTrack.id, currentTrack.genre)
      if (audioRef.current.src !== fallbackUrl) {
        audioRef.current.src = fallbackUrl
        audioRef.current.load()
        audioRef.current.play().catch(() => setState((s) => ({ ...s, isPlaying: false, isLoading: false })))
      }
    }
  }, [setState])

  const handleEnded = useCallback(() => {
    const queue = queueRef.current
    const idx   = queueIdxRef.current
    if (idx < queue.length - 1) {
      // Auto-advance to next track in queue
      const nextTrack = queue[idx + 1]
      const audio = audioRef.current
      if (!audio) return
      queueIdxRef.current = idx + 1
      setState((s) => ({
        ...s,
        currentTrackId: nextTrack.id,
        queueIndex:     idx + 1,
        currentTime:    0,
        duration:       nextTrack.duration || 0,
        isLoading:      true,
      }))

      addRecentlyPlayed(nextTrack)

      const validUrl = nextTrack.audioUrl || generateTrackAudioUrl(nextTrack.id, nextTrack.genre)

      audio.src = validUrl
      audio.load()
      audio.play().catch(() => setState((s) => ({ ...s, isPlaying: false, isLoading: false })))
    } else {
      // End of queue
      setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }))
    }
  }, [setState])

  /* ── Mount: create Audio element and bind all listeners ───── */
  useEffect(() => {
    const audio = new Audio()
    audio.volume  = INITIAL_STATE.volume
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    audio.addEventListener('timeupdate',     handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('waiting',        handleWaiting)
    audio.addEventListener('canplay',        handleCanPlay)
    audio.addEventListener('playing',        handlePlaying)
    audio.addEventListener('pause',          handlePause)
    audio.addEventListener('error',          handleError)
    audio.addEventListener('ended',          handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate',     handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('waiting',        handleWaiting)
      audio.removeEventListener('canplay',        handleCanPlay)
      audio.removeEventListener('playing',        handlePlaying)
      audio.removeEventListener('pause',          handlePause)
      audio.removeEventListener('error',          handleError)
      audio.removeEventListener('ended',          handleEnded)
    }
  }, [handleTimeUpdate, handleLoadedMetadata, handleWaiting, handleCanPlay, handlePlaying, handlePause, handleError, handleEnded])

  /* ══════════════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════════════ */

  /** Load a full queue of tracks. */
  const loadQueue = useCallback((tracks, startIndex = 0) => {
    const sanitizedQueue = (tracks || []).map((t) => ({
      ...t,
      audioUrl: t.audioUrl || generateTrackAudioUrl(t.id, t.genre || 'default'),
    }))

    queueRef.current    = sanitizedQueue
    queueIdxRef.current = startIndex
    setState((s) => ({ ...s, queue: sanitizedQueue, queueIndex: startIndex }))
  }, [setState])

  /** Add a single track to the end of the queue */
  const addToQueue = useCallback((track) => {
    if (!track) return
    const sanitized = {
      ...track,
      audioUrl: track.audioUrl || generateTrackAudioUrl(track.id, track.genre || 'default'),
    }

    const updated = [...queueRef.current, sanitized]
    queueRef.current = updated
    setState((s) => ({ ...s, queue: updated }))
  }, [setState])

  /** Insert a track to play right next */
  const playNextInQueue = useCallback((track) => {
    if (!track) return
    const sanitized = {
      ...track,
      audioUrl: track.audioUrl || generateTrackAudioUrl(track.id, track.genre || 'default'),
    }

    const currentIdx = queueIdxRef.current
    const queue = [...queueRef.current]
    queue.splice(currentIdx + 1, 0, sanitized)
    queueRef.current = queue
    setState((s) => ({ ...s, queue }))
  }, [setState])

  /** Remove track from queue by ID */
  const removeFromQueue = useCallback((trackId) => {
    const idStr = String(trackId)
    const updated = queueRef.current.filter((t) => String(t.id) !== idStr)
    queueRef.current = updated
    setState((s) => ({ ...s, queue: updated }))
  }, [setState])

  /** Clear all tracks from queue */
  const clearQueue = useCallback(() => {
    const current = queueRef.current[queueIdxRef.current]
    const updated = current ? [current] : []
    queueRef.current = updated
    queueIdxRef.current = 0
    setState((s) => ({ ...s, queue: updated, queueIndex: 0 }))
  }, [setState])

  /** Play a specific track by ID */
  const playTrack = useCallback((trackId, directTrack = null) => {
    let queue = queueRef.current
    let idx = queue.findIndex((t) => String(t.id) === String(trackId))

    if (idx === -1 && directTrack) {
      queue = [directTrack, ...queue]
      queueRef.current = queue
      idx = 0
    } else if (idx === -1 && queue.length > 0) {
      idx = 0
    }

    const track = queue[idx]
    if (!track) return

    queueIdxRef.current = idx
    addRecentlyPlayed(track)

    const audio = audioRef.current
    if (!audio) return

    setState((s) => ({
      ...s,
      currentTrackId: track.id,
      queueIndex:     idx,
      currentTime:    0,
      duration:       track.duration || 0,
      isLoading:      true,
      error:          null,
    }))

    const validUrl = track.audioUrl || generateTrackAudioUrl(track.id, track.genre || 'default')

    audio.src = validUrl
    audio.load()

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setState((s) => ({ ...s, isPlaying: true, isLoading: false }))
        })
        .catch((err) => {
          console.warn('[useAudioPlayer] Playback was interrupted:', err.message)
          setState((s) => ({ ...s, isPlaying: false, isLoading: false }))
        })
    }
  }, [setState])

  /** Toggle play / pause */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !stateRef.current.currentTrackId) return

    if (stateRef.current.isPlaying) {
      audio.pause()
      setState((s) => ({ ...s, isPlaying: false }))
    } else {
      if (!audio.src || audio.src === window.location.href) {
        const curr = queueRef.current[queueIdxRef.current]
        if (curr) {
          audio.src = curr.audioUrl || generateTrackAudioUrl(curr.id, curr.genre)
          audio.load()
        }
      }

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setState((s) => ({ ...s, isPlaying: true }))
          })
          .catch((err) => {
            console.warn('[useAudioPlayer] togglePlay audio.play() blocked:', err.message)
          })
      }
    }
  }, [setState])

  /** Explicit play */
  const play = useCallback(() => {
    audioRef.current?.play().then(() => {
      setState((s) => ({ ...s, isPlaying: true }))
    }).catch(console.warn)
  }, [setState])

  /** Explicit pause */
  const pause = useCallback(() => {
    audioRef.current?.pause()
    setState((s) => ({ ...s, isPlaying: false }))
  }, [setState])

  /** Seek to seconds */
  const seekTo = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio) return
    const clamped = Math.max(0, Math.min(seconds, audio.duration || stateRef.current.duration))
    audio.currentTime = clamped
    setState((s) => ({ ...s, currentTime: clamped }))
  }, [setState])

  /** Set volume 0–1 */
  const setVolume = useCallback((vol) => {
    const v = Math.max(0, Math.min(1, vol))
    if (audioRef.current) audioRef.current.volume = v
    setState((s) => ({ ...s, volume: v }))
  }, [setState])

  /** Toggle mute */
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = !stateRef.current.isMuted
    audio.muted = next
    setState((s) => ({ ...s, isMuted: next }))
  }, [setState])

  /** Skip to next track in queue */
  const nextTrack = useCallback(() => {
    const queue = queueRef.current
    const idx   = queueIdxRef.current
    if (idx < queue.length - 1) playTrack(queue[idx + 1].id)
  }, [playTrack])

  /** Skip to previous track */
  const prevTrack = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.currentTime > 4) {
      seekTo(0)
      return
    }
    const queue = queueRef.current
    const idx   = queueIdxRef.current
    if (idx > 0) playTrack(queue[idx - 1].id)
  }, [playTrack, seekTo])

  return {
    /* State */
    ...state,
    queue: queueRef.current,

    /* Controls */
    loadQueue,
    addToQueue,
    playNextInQueue,
    removeFromQueue,
    clearQueue,
    playTrack,
    togglePlay,
    play,
    pause,
    seekTo,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    getAudioElement: () => audioRef.current,
  }
}
