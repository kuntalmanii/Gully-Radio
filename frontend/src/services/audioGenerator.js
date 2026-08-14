/**
 * audioGenerator.js
 * ──────────────────────────────────────────────────────────────
 * Procedural Analog Lo-Fi Soundscape & Music Generator.
 *
 * Generates genuine, playable 16-bit PCM WAV audio blobs with:
 *  - Warm analog chord progressions & harmonic synth pads
 *  - Sitar/tanpura resonant drone overtones
 *  - Tape flutter, saturation, and subtle vinyl hiss
 *  - Unique musical keys, melodies, and soundscapes per track
 *
 * Runs 100% in-browser with zero external assets needed.
 */

// Cache generated blob URLs so they are created only once per track
const _trackBlobCache = new Map()

/**
 * Procedurally synthesizes a 35-second looping ambient lo-fi music track
 * and returns a playable blob: URL.
 *
 * @param {string|number} trackId - Track identifier
 * @param {string} mood - 'monsoon' | 'night' | 'heritage' | 'nostalgia' | 'default'
 * @returns {string} Blob URL pointing to audio/wav
 */
export function generateTrackAudioUrl(trackId = 1, mood = 'default') {
  const cacheKey = `${trackId}_${mood}`
  if (_trackBlobCache.has(cacheKey)) {
    return _trackBlobCache.get(cacheKey)
  }

  if (typeof window === 'undefined') return ''

  const sampleRate = 22050
  const durationSec = 36
  const numSamples = sampleRate * durationSec
  const buffer = new ArrayBuffer(44 + numSamples * 2)
  const view = new DataView(buffer)

  /* ── Write WAV Header ───────────────────────────────────────── */
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + numSamples * 2, true) // chunk size
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)                  // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true)                   // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true)                   // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true)          // SampleRate
  view.setUint32(28, sampleRate * 2, true)      // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true)                   // BlockAlign
  view.setUint16(34, 16, true)                  // BitsPerSample (16-bit)
  writeString(36, 'data')
  view.setUint32(40, numSamples * 2, true)      // Subchunk2Size

  /* ── Track-Specific Musical Note Frequencies (Hz) ──────────── */
  // Base frequencies: D minor, Raag Bhairav, Raag Yaman, Pentatonic Warmth
  const idNum = typeof trackId === 'number' ? trackId : String(trackId).charCodeAt(0) || 1
  
  const chordSets = [
    // 0: D Minor Warm Cassette (D3, F3, A3, C4, E4)
    [146.83, 174.61, 220.00, 261.63, 329.63],
    // 1: Monsoon Chai Ambient (C3, G3, Bb3, D4, F4)
    [130.81, 196.00, 233.08, 293.66, 349.23],
    // 2: Old City Night Raga (D3, F#3, A3, C#4, E4)
    [146.83, 185.00, 220.00, 277.18, 329.63],
    // 3: 1998 Sunday Nostalgia (A2, E3, A3, C#4, E4)
    [110.00, 164.81, 220.00, 277.18, 329.63],
    // 4: Midnight Alley Drone (G2, D3, G3, B3, D4)
    [98.00, 146.83, 196.00, 246.94, 293.66],
  ]

  const chords = chordSets[idNum % chordSets.length]
  const droneFreq = chords[0]
  const padFreq1 = chords[1]
  const padFreq2 = chords[2]
  const leadFreq1 = chords[3]
  const leadFreq2 = chords[4]

  /* ── Procedural Sound Synthesis ─────────────────────────────── */
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate

    // 1. Slow ambient LFO (0.08 Hz breath cycle)
    const lfo = Math.sin(2 * Math.PI * 0.08 * t)
    const flutter = 1.0 + 0.003 * Math.sin(2 * Math.PI * 4.8 * t) + 0.0015 * Math.sin(2 * Math.PI * 0.4 * t)

    // 2. Warm sub drone (Tanpura/Analog Bass tone)
    const drone = Math.sin(2 * Math.PI * (droneFreq * flutter) * t) * 0.28
                + Math.sin(2 * Math.PI * (droneFreq * 2 * flutter) * t) * 0.12

    // 3. Harmonic Pad with slow beating
    const pad1 = Math.sin(2 * Math.PI * (padFreq1 * flutter) * t) * (0.16 + 0.06 * lfo)
    const pad2 = Math.sin(2 * Math.PI * (padFreq2 * flutter) * t) * (0.14 - 0.04 * lfo)

    // 4. Melodic Arp Pulse (Arpeggiated note every 3.5 seconds)
    const arpPhase = Math.floor(t / 3.5) % 2
    const currentLeadFreq = arpPhase === 0 ? leadFreq1 : leadFreq2
    const noteEnv = Math.exp(-((t % 3.5) * 1.8)) // decay envelope
    const lead = Math.sin(2 * Math.PI * (currentLeadFreq * flutter) * t) * (0.18 * noteEnv)

    // 5. Ambient Tape Hiss & Vinyl Grain Crackle
    const noise = (Math.random() * 2 - 1) * 0.018
    const crackle = Math.random() > 0.997 ? (Math.random() * 2 - 1) * 0.07 : 0

    // 6. Master Mix & Soft Tube Saturation (Tanh-like curve)
    let mixed = drone + pad1 + pad2 + lead + noise + crackle
    // Smooth Fade in & Fade out at buffer ends
    const fadeDuration = 1.5
    if (t < fadeDuration) {
      mixed *= (t / fadeDuration)
    } else if (t > durationSec - fadeDuration) {
      mixed *= ((durationSec - t) / fadeDuration)
    }

    // Analog soft saturation clipping
    const saturated = Math.max(-0.95, Math.min(0.95, mixed * 1.15))

    // Convert float (-1.0 to 1.0) to 16-bit PCM integer (-32768 to 32767)
    const pcmSample = Math.floor(saturated * 32767)
    view.setInt16(44 + i * 2, pcmSample, true)
  }

  const blob = new Blob([buffer], { type: 'audio/wav' })
  const blobUrl = URL.createObjectURL(blob)
  _trackBlobCache.set(cacheKey, blobUrl)
  return blobUrl
}
