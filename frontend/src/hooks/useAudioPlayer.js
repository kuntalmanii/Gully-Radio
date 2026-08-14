/**
 * useAudioPlayer.js
 * ──────────────────────────────────────────────────────────────
 * Core hook wrapping the native HTML5 Audio API.
 *
 * Rules:
 *  - One Audio element created once and kept in a ref (never recreated)
 *  - NO autoplay — user interaction required before any playback
 *  - Event handlers reference mutable values via refs to avoid stale closures
 *  - All external controls are stable callbacks (useCallback + no deps)
 *  - Guaranteed audio playback with procedural ambient synthesis fallback
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { generateTrackAudioUrl } from '../services/audioGenerator'

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
    console.warn('[useAudioPlayer] Audio element error event, recovering with generated audio...', e)
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
      // Auto-advance to next track
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

      const validUrl = (nextTrack.audioUrl && !nextTrack.audioUrl.startsWith('/audio/'))
        ? nextTrack.audioUrl
        : generateTrackAudioUrl(nextTrack.id, nextTrack.genre)

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
    // Ensure all tracks in the queue have a valid playable audioUrl
    const sanitizedQueue = (tracks || []).map((t) => ({
      ...t,
      audioUrl: (t.audioUrl && !t.audioUrl.startsWith('/audio/'))
        ? t.audioUrl
        : generateTrackAudioUrl(t.id, t.genre || 'default'),
    }))

    queueRef.current    = sanitizedQueue
    queueIdxRef.current = startIndex
    setState((s) => ({ ...s, queue: sanitizedQueue, queueIndex: startIndex }))
  }, [setState])

  /** Play a specific track by ID. */
  const playTrack = useCallback((trackId) => {
    let queue = queueRef.current
    let idx = queue.findIndex((t) => String(t.id) === String(trackId))

    if (idx === -1 && queue.length > 0) {
      idx = 0
    }


    const track = queue[idx]
    if (!track) return

    queueIdxRef.current = idx

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

    const validUrl = (track.audioUrl && !track.audioUrl.startsWith('/audio/'))
      ? track.audioUrl
      : generateTrackAudioUrl(track.id, track.genre || 'default')

    audio.src = validUrl
    audio.load()

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setState((s) => ({ ...s, isPlaying: true, isLoading: false }))
        })
        .catch((err) => {
          console.warn('[useAudioPlayer] Playback was interrupted or blocked:', err.message)
          setState((s) => ({ ...s, isPlaying: false, isLoading: false }))
        })
    }
  }, [setState])

  /** Toggle play / pause. */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !stateRef.current.currentTrackId) return

    if (stateRef.current.isPlaying) {
      audio.pause()
      setState((s) => ({ ...s, isPlaying: false }))
    } else {
      // Check if audio src is set
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

  /** Explicit play. */
  const play = useCallback(() => {
    audioRef.current?.play().then(() => {
      setState((s) => ({ ...s, isPlaying: true }))
    }).catch(console.warn)
  }, [setState])

  /** Explicit pause. */
  const pause = useCallback(() => {
    audioRef.current?.pause()
    setState((s) => ({ ...s, isPlaying: false }))
  }, [setState])

  /** Seek to a position in seconds. */
  const seekTo = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio) return
    const clamped = Math.max(0, Math.min(seconds, audio.duration || stateRef.current.duration))
    audio.currentTime = clamped
    setState((s) => ({ ...s, currentTime: clamped }))
  }, [setState])

  /** Set volume 0–1. */
  const setVolume = useCallback((vol) => {
    const v = Math.max(0, Math.min(1, vol))
    if (audioRef.current) audioRef.current.volume = v
    setState((s) => ({ ...s, volume: v }))
  }, [setState])

  /** Toggle mute. */
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = !stateRef.current.isMuted
    audio.muted = next
    setState((s) => ({ ...s, isMuted: next }))
  }, [setState])

  /** Skip to next track in queue. */
  const nextTrack = useCallback(() => {
    const queue = queueRef.current
    const idx   = queueIdxRef.current
    if (idx < queue.length - 1) playTrack(queue[idx + 1].id)
  }, [playTrack])

  /** Skip to previous track. */
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
