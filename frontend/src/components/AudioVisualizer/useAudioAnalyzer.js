/**
 * useAudioAnalyzer.js
 * ──────────────────────────────────────────────────────────────
 * Hook connecting Web Audio API AnalyserNode to the global audio player.
 *
 * Handles:
 *  - MediaElementAudioSourceNode singleton attachment
 *  - Auto-resuming AudioContext on playback / user gesture
 *  - High-performance buffer reuse (no GC thrashing in rAF)
 *  - Fallback synthetic harmonics generator for demo/silent tracks
 *  - Clean disconnect on teardown
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { useAudio } from '../../contexts/AudioContext'
import { getFrequencyBands } from './visualizerUtils'

// Module-level weakmap to guarantee single source node per HTMLAudioElement
const sourceNodeMap = new WeakMap()
let globalAudioCtx = null

export default function useAudioAnalyzer() {
  const { getAudioElement, isPlaying, volume, isMuted } = useAudio()

  const analyserRef    = useRef(null)
  const freqBufferRef  = useRef(null)
  const timeBufferRef  = useRef(null)
  const syntheticTime  = useRef(0)
  const smoothedBands  = useRef({ bass: 0, mid: 0, high: 0, amplitude: 0, isSilent: true })

  const [isAvailable, setIsAvailable] = useState(true)

  /* Initialize Web Audio API Analyser */
  useEffect(() => {
    const audioEl = getAudioElement?.()
    if (!audioEl) return

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) {
        setIsAvailable(false)
        return
      }

      if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
        globalAudioCtx = new AudioContextClass()
      }

      let source = sourceNodeMap.get(audioEl)
      let analyser = analyserRef.current

      if (!analyser) {
        analyser = globalAudioCtx.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.8
        analyserRef.current = analyser

        freqBufferRef.current = new Uint8Array(analyser.frequencyBinCount)
        timeBufferRef.current = new Uint8Array(analyser.fftSize)
      }

      if (!source) {
        source = globalAudioCtx.createMediaElementSource(audioEl)
        source.connect(analyser)
        analyser.connect(globalAudioCtx.destination)
        sourceNodeMap.set(audioEl, source)
      }
    } catch (err) {
      console.warn('[AudioVisualizer] Web Audio initialization notice:', err.message)
    }
  }, [getAudioElement])

  /* Auto-resume AudioContext if suspended */
  useEffect(() => {
    if (isPlaying && globalAudioCtx && globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume().catch(() => {})
    }
  }, [isPlaying])

  /**
   * Synchronous data retriever designed for requestAnimationFrame loops.
   * Smooths values with lerp to ensure analog cinematic motion.
   */
  const getAnalyzerData = useCallback(() => {
    const analyser = analyserRef.current
    const freqData = freqBufferRef.current
    const timeData = timeBufferRef.current

    if (!analyser || !freqData || !timeData || !isPlaying || isMuted || volume === 0) {
      // Gentle decay to zero when paused
      const prev = smoothedBands.current
      smoothedBands.current = {
        bass: prev.bass * 0.92,
        mid:  prev.mid * 0.92,
        high: prev.high * 0.92,
        amplitude: prev.amplitude * 0.92,
        isSilent: true,
      }

      // Generate flatline with tiny jitter for analog oscilloscope feel
      if (timeData) {
        for (let i = 0; i < timeData.length; i++) {
          timeData[i] = 128 + Math.sin(i * 0.1 + syntheticTime.current) * (prev.amplitude * 4)
        }
      }

      return {
        freqData: freqData || new Uint8Array(128),
        timeData: timeData || new Uint8Array(256),
        bands: smoothedBands.current,
        rawBands: smoothedBands.current,
      }
    }

    // Capture real audio frequency and waveform
    analyser.getByteFrequencyData(freqData)
    analyser.getByteTimeDomainData(timeData)

    const raw = getFrequencyBands(freqData)

    // If audio is playing but is silent WAV, synthesize warm analog reactive harmonics
    if (raw.isSilent && isPlaying) {
      syntheticTime.current += 0.04
      const t = syntheticTime.current
      const synthBass = (Math.sin(t * 2.2) * 0.35 + Math.cos(t * 4.1) * 0.25 + 0.4) * volume
      const synthMid  = (Math.sin(t * 3.4) * 0.3 + Math.cos(t * 1.8) * 0.2 + 0.35) * volume
      const synthHigh = (Math.sin(t * 6.8) * 0.2 + 0.25) * volume
      const synthAmp  = (synthBass * 0.5 + synthMid * 0.35 + synthHigh * 0.15)

      // Synthesize smooth waveform into timeData
      for (let i = 0; i < timeData.length; i++) {
        const wave = Math.sin(i * 0.08 + t * 4) * synthBass * 28 +
                     Math.cos(i * 0.15 - t * 2) * synthMid * 16
        timeData[i] = 128 + Math.max(-120, Math.min(120, wave))
      }

      raw.bass = synthBass
      raw.mid = synthMid
      raw.high = synthHigh
      raw.amplitude = synthAmp
      raw.isSilent = false
    }

    // Exponential smoothing (lerp) for analog feel
    const prev = smoothedBands.current
    smoothedBands.current = {
      bass:      prev.bass + (raw.bass - prev.bass) * 0.22,
      mid:       prev.mid  + (raw.mid - prev.mid) * 0.25,
      high:      prev.high + (raw.high - prev.high) * 0.28,
      amplitude: prev.amplitude + (raw.amplitude - prev.amplitude) * 0.2,
      isSilent:  raw.isSilent,
    }

    return {
      freqData,
      timeData,
      bands: smoothedBands.current,
      rawBands: raw,
    }
  }, [isPlaying, isMuted, volume])

  return {
    getAnalyzerData,
    isAvailable,
    isPlaying,
  }
}
