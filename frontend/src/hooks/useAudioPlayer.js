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
 *
 * Usage:
 *   const audio = useAudioPlayer()
 *   audio.loadQueue(tracks)
 *   audio.playTrack(1)
 *   audio.togglePlay()
 *   audio.seekTo(45)
 *   audio.setVolume(0.6)
 *   audio.toggleMute()
 */

import { useRef, useState, useCallback, useEffect } from 'react'

/* ── Helper ──────────────────────────────────────────────────── */
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
  const audioRef     = useRef(null)    // HTML Audio element
  const queueRef     = useRef([])      // mutable queue (used inside event handlers)
  const queueIdxRef  = useRef(-1)      // mutable index
  const mockTimerRef = useRef(null)    // interval for mock playback (no real audio)
  const stateRef     = useRef(INITIAL_STATE)

  const [state, setStateRaw] = useState(INITIAL_STATE)

  /* Keep stateRef in sync (used by event handlers to read current values) */
  const setState = useCallback((updater) => {
    setStateRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      stateRef.current = next
      return next
    })
  }, [])

  /* ── Helper: format util (seconds → MM:SS) ─────────────────── */
  // Not exported — used internally only

  /* ── Mock playback (when audioUrl is a silence blob) ──────────
     We still let the real Audio API run, but we also drive
     currentTime via setInterval at 250ms resolution so the
     progress bar feels smooth even on low-power devices.
  ────────────────────────────────────────────────────────────── */
  const stopMockTimer = useCallback(() => {
    if (mockTimerRef.current) {
      clearInterval(mockTimerRef.current)
      mockTimerRef.current = null
    }
  }, [])

  /* ── Event-handler callbacks (defined once, stable refs) ───── */
  const handleTimeUpdate = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    setState((s) => ({ ...s, currentTime: a.currentTime }))
  }, [setState])

  const handleLoadedMetadata = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    // Use real audio duration if we have a real file; otherwise keep track metadata duration
    const dur = isFinite(a.duration) && a.duration > 0 ? a.duration : stateRef.current.duration
    setState((s) => ({ ...s, duration: dur, isLoading: false }))
  }, [setState])

  const handleWaiting  = useCallback(() => setState((s) => ({ ...s, isLoading: true  })), [setState])
  const handleCanPlay  = useCallback(() => setState((s) => ({ ...s, isLoading: false })), [setState])
  const handlePlaying  = useCallback(() => setState((s) => ({ ...s, isPlaying: true,  isLoading: false })), [setState])
  const handlePause    = useCallback(() => setState((s) => ({ ...s, isPlaying: false })), [setState])
  const handleError    = useCallback(() => {
    setState((s) => ({ ...s, isLoading: false, error: 'Failed to load audio' }))
  }, [setState])

  const handleEnded = useCallback(() => {
    stopMockTimer()
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
      audio.src = nextTrack.audioUrl
      audio.load()
      audio.play().catch(() => setState((s) => ({ ...s, isPlaying: false, isLoading: false })))
    } else {
      // End of queue
      setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }))
    }
  }, [setState, stopMockTimer])

  /* ── Mount: create Audio element and bind all listeners ───── */
  useEffect(() => {
    const audio = new Audio()
    audio.volume  = INITIAL_STATE.volume
    audio.preload = 'metadata'
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
      clearInterval(mockTimerRef.current)
    }
  }, [handleTimeUpdate, handleLoadedMetadata, handleWaiting, handleCanPlay, handlePlaying, handlePause, handleError, handleEnded])

  /* ══════════════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════════════ */

  /** Load a full queue of tracks. Optionally start playing from startIndex. */
  const loadQueue = useCallback((tracks, startIndex = 0) => {
    queueRef.current    = tracks
    queueIdxRef.current = startIndex
    setState((s) => ({ ...s, queue: tracks, queueIndex: startIndex }))
  }, [setState])

  /** Play a specific track by ID (must already be in the queue). */
  const playTrack = useCallback((trackId) => {
    const queue = queueRef.current
    const idx   = queue.findIndex((t) => t.id === trackId)
    if (idx === -1) return

    const track = queue[idx]
    queueIdxRef.current = idx

    const audio = audioRef.current
    if (!audio) return

    stopMockTimer()
    setState((s) => ({
      ...s,
      currentTrackId: track.id,
      queueIndex:     idx,
      currentTime:    0,
      duration:       track.duration || 0,
      isLoading:      true,
      error:          null,
    }))

    audio.src = track.audioUrl
    audio.load()
    audio.play().catch(() => setState((s) => ({ ...s, isPlaying: false, isLoading: false })))
  }, [setState, stopMockTimer])

  /** Toggle play / pause. Requires a track to be loaded. */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !stateRef.current.currentTrackId) return

    if (stateRef.current.isPlaying) {
      audio.pause()
      stopMockTimer()
    } else {
      audio.play().catch(console.warn)
    }
  }, [stopMockTimer])

  /** Explicit play. */
  const play = useCallback(() => {
    audioRef.current?.play().catch(console.warn)
  }, [])

  /** Explicit pause. */
  const pause = useCallback(() => {
    audioRef.current?.pause()
    stopMockTimer()
  }, [stopMockTimer])

  /** Seek to a position in seconds. */
  const seekTo = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio) return
    const clamped = Math.max(0, Math.min(seconds, audio.duration || stateRef.current.duration))
    audio.currentTime = clamped
    setState((s) => ({ ...s, currentTime: clamped }))
  }, [setState])

  /** Set volume 0–1. Does NOT un-mute. */
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

  /** Skip to previous track (or restart current if past 4s). */
  const prevTrack = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    // Restart current track if more than 4 seconds in
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
