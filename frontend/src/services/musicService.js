/**
 * musicService.js
 * ──────────────────────────────────────────────────────────────
 * Single source of truth for track data.
 * 
 * audioUrl: Points to files in /public/audio/
 * Replace the placeholder blob URLs with real audio paths:
 *   audioUrl: '/audio/teri-yaad.mp3'
 *
 * duration: Track length in SECONDS (formatted by UI layer).
 *
 * Demo mode: A 30-second silent WAV is generated in-browser
 * as a blob URL so all player controls are fully functional
 * without requiring real audio files.
 */

/* ── Silent WAV generator (demo placeholder) ─────────────────── */
let _silenceUrl = null

function getSilenceUrl() {
  if (_silenceUrl) return _silenceUrl
  if (typeof window === 'undefined') return ''

  // Minimal valid WAV: 30s of silence at 22050 Hz mono 16-bit
  const sampleRate  = 22050
  const numSamples  = sampleRate * 30          // 30 second demo duration
  const dataBytes   = numSamples * 2           // 16-bit = 2 bytes per sample
  const buffer      = new ArrayBuffer(44 + dataBytes)
  const v           = new DataView(buffer)
  const str         = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }

  str(0,  'RIFF')
  v.setUint32(4,  36 + dataBytes, true)
  str(8,  'WAVE')
  str(12, 'fmt ')
  v.setUint32(16, 16, true)           // chunk size
  v.setUint16(20, 1,  true)           // PCM format
  v.setUint16(22, 1,  true)           // mono
  v.setUint32(24, sampleRate, true)
  v.setUint32(28, sampleRate * 2, true) // byte rate
  v.setUint16(32, 2,  true)           // block align
  v.setUint16(34, 16, true)           // bits per sample
  str(36, 'data')
  v.setUint32(40, dataBytes, true)
  // Buffer is already zeroed = silence

  _silenceUrl = URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }))
  return _silenceUrl
}

/* ── Track dataset ───────────────────────────────────────────── */
export const TRACKS = [
  /* ─ Side A ─ */
  {
    id:       1,
    title:    'Teri Yaad (Extended Mix)',
    artist:   'Ram Radio Sessions',
    album:    'Vol. 01 — Golden Hours',
    cover:    null,                           // replace with '/audio/covers/track-1.jpg'
    audioUrl: null,                           // replace with '/audio/teri-yaad.mp3'
    duration: 263,                            // seconds (4:23)
    genre:    'Indie / Cassette',
    year:     1987,
    side:     'A',
    num:      '01',
  },
  {
    id:       2,
    title:    'Gully Nights',
    artist:   'Ram Radio Sessions',
    album:    'Vol. 01 — Golden Hours',
    cover:    null,
    audioUrl: null,
    duration: 225,                            // 3:45
    genre:    'Ambient / Street',
    year:     1988,
    side:     'A',
    num:      '02',
  },
  {
    id:       3,
    title:    'Cassette Rain',
    artist:   'Ram Radio Sessions',
    album:    'Vol. 01 — Golden Hours',
    cover:    null,
    audioUrl: null,
    duration: 312,                            // 5:12
    genre:    'Instrumental',
    year:     1989,
    side:     'A',
    num:      '03',
  },
  {
    id:       4,
    title:    'Radio Silence',
    artist:   'Ram Radio Sessions',
    album:    'Vol. 01 — Golden Hours',
    cover:    null,
    audioUrl: null,
    duration: 238,                            // 3:58
    genre:    'Drone / Ambient',
    year:     1986,
    side:     'A',
    num:      '04',
  },
  /* ─ Side B ─ */
  {
    id:       5,
    title:    'Street Echoes',
    artist:   'Ram Radio Sessions',
    album:    'Vol. 01 — Golden Hours',
    cover:    null,
    audioUrl: null,
    duration: 250,                            // 4:10
    genre:    'Indie / Cassette',
    year:     1990,
    side:     'B',
    num:      '01',
  },
  {
    id:       6,
    title:    'Golden Hours',
    artist:   'Ram Radio Sessions',
    album:    'Vol. 01 — Golden Hours',
    cover:    null,
    audioUrl: null,
    duration: 362,                            // 6:02
    genre:    'Jazz / Fusion',
    year:     1988,
    side:     'B',
    num:      '02',
  },
  {
    id:       7,
    title:    'Late Night Raga',
    artist:   'Ram Radio Sessions',
    album:    'Vol. 01 — Golden Hours',
    cover:    null,
    audioUrl: null,
    duration: 284,                            // 4:44
    genre:    'Classical / Fusion',
    year:     1985,
    side:     'B',
    num:      '03',
  },
  {
    id:       8,
    title:    'The Last Station',
    artist:   'Ram Radio Sessions',
    album:    'Vol. 01 — Golden Hours',
    cover:    null,
    audioUrl: null,
    duration: 333,                            // 5:33
    genre:    'Ambient / Closing',
    year:     1991,
    side:     'B',
    num:      '04',
  },
]

/**
 * Enriches tracks with a demo silence URL when no real audioUrl
 * is supplied. Call once at app startup (lazy — only runs in browser).
 */
export function getPlayableTracks() {
  const url = getSilenceUrl()
  return TRACKS.map((t) => ({
    ...t,
    audioUrl: t.audioUrl ?? url,
  }))
}

/** Convenience accessors */
export const getAllTracks    = ()   => TRACKS
export const getTrackById   = (id) => TRACKS.find((t) => t.id === id)
export const getDefaultQueue = ()  => getPlayableTracks()
