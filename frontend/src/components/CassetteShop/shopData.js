/**
 * shopData.js
 * ──────────────────────────────────────────────────────────────
 * Six fictional demo mixtapes for the Cassette Shop.
 * Each cassette has a color palette, tracks, and metadata.
 * audioUrl: null → filled with a silence blob at runtime.
 */

/* ── Silence blob (demo only) ─────────────────────────────────── */
let _silence = null
function silenceUrl() {
  if (_silence) return _silence
  if (typeof window === 'undefined') return ''
  const sr = 22050, dur = 30, n = sr * dur
  const buf = new ArrayBuffer(44 + n * 2)
  const v   = new DataView(buf)
  const s   = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)) }
  s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true)
  v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data')
  v.setUint32(40, n * 2, true)
  _silence = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }))
  return _silence
}

/* ── Color themes ─────────────────────────────────────────────── */
const THEMES = {
  midnight: { shell: '#0c1220', label: '#11213d', stripe: '#1e3a6e', accent: '#4a90d9', text: '#a8c8f0', screw: '#1a2a45' },
  chai:     { shell: '#1a0f06', label: '#2a1a0a', stripe: '#7a4a1a', accent: '#d4842a', text: '#f0d0a0', screw: '#2a1a0a' },
  oldcity:  { shell: '#0a1412', label: '#102820', stripe: '#1e5040', accent: '#c87832', text: '#d4b878', screw: '#142a22' },
  sunday:   { shell: '#18140a', label: '#2a2010', stripe: '#6a5820', accent: '#d4b030', text: '#f0e0a0', screw: '#221c0e' },
  letters:  { shell: '#18060a', label: '#2a0c14', stripe: '#7a1a28', accent: '#d45060', text: '#f0b0b8', screw: '#220a10' },
  train:    { shell: '#101010', label: '#1a1a1a', stripe: '#2a2a2a', accent: '#e87820', text: '#d0c0b0', screw: '#1e1e1e' },
}

/* ── Mixtape catalogue ────────────────────────────────────────── */
export const MIXTAPES = [
  {
    id:          'mg',
    slug:        'midnight-gully',
    title:       'MIDNIGHT GULLY',
    curator:     'Rohan M.',
    year:        '1998',
    genre:       'Nocturnal / Street',
    theme:       THEMES.midnight,
    description: 'Late nights in lanes that never sleep. The hiss of a radio, the last chai stall still burning its lantern.',
    labelArt:    'grid',          // artwork style hint for CSS renderer
    tracks: [
      { id: 'mg-01', title: 'Raat Ke Musafir',    artist: 'Ram Radio',    duration: 243 },
      { id: 'mg-02', title: 'Neon Gali',           artist: 'Ram Radio',    duration: 198 },
      { id: 'mg-03', title: 'Last Chai Stand',     artist: 'Ram Radio',    duration: 274 },
      { id: 'mg-04', title: 'Three A.M.',          artist: 'Ram Radio',    duration: 312 },
      { id: 'mg-05', title: 'Radio Static',        artist: 'Ram Radio',    duration: 187 },
      { id: 'mg-06', title: 'Dawn Coming',         artist: 'Ram Radio',    duration: 256 },
    ],
  },
  {
    id:          'cr',
    slug:        'chai-and-rain',
    title:       'CHAI & RAIN',
    curator:     'Priya K.',
    year:        '2001',
    genre:       'Monsoon / Slow',
    theme:       THEMES.chai,
    description: 'Monsoon afternoons with nowhere to be. Warm cups, wet pavements, and the smell of petrichor on hot stone.',
    labelArt:    'lines',
    tracks: [
      { id: 'cr-01', title: 'Barish Ka Pehla Din', artist: 'Ram Radio',    duration: 220 },
      { id: 'cr-02', title: 'Khumaar',             artist: 'Ram Radio',    duration: 285 },
      { id: 'cr-03', title: 'Garam Chai',          artist: 'Ram Radio',    duration: 198 },
      { id: 'cr-04', title: 'Window Seat',         artist: 'Ram Radio',    duration: 240 },
      { id: 'cr-05', title: 'Slow Hour',           artist: 'Ram Radio',    duration: 310 },
    ],
  },
  {
    id:          'oc',
    slug:        'old-city-nights',
    title:       'OLD CITY NIGHTS',
    curator:     'Vikram S.',
    year:        '1995',
    genre:       'Heritage / Deep Cut',
    theme:       THEMES.oldcity,
    description: 'Recorded in the narrow lanes of a walled city. The azaan, the temple bells, and the man who sells jasmine after dark.',
    labelArt:    'circles',
    tracks: [
      { id: 'oc-01', title: 'Purani Haveli',       artist: 'Ram Radio',    duration: 267 },
      { id: 'oc-02', title: 'Jasmine Seller',      artist: 'Ram Radio',    duration: 198 },
      { id: 'oc-03', title: 'Lamp & Shadow',       artist: 'Ram Radio',    duration: 344 },
      { id: 'oc-04', title: 'The Courtyard',       artist: 'Ram Radio',    duration: 230 },
      { id: 'oc-05', title: 'Before the Mosque',   artist: 'Ram Radio',    duration: 286 },
      { id: 'oc-06', title: 'Dusk Raga',           artist: 'Ram Radio',    duration: 378 },
    ],
  },
  {
    id:          's98',
    slug:        'sunday-1998',
    title:       'SUNDAY 1998',
    curator:     'Ananya R.',
    year:        '1998',
    genre:       'Nostalgia / Easy',
    theme:       THEMES.sunday,
    description: "A Sunday that lasted a whole decade. Doordarshan static, mango pickle, and the neighbour's FM bleeding through the wall.",
    labelArt:    'dots',
    tracks: [
      { id: 's98-01', title: 'Doordarshan',        artist: 'Ram Radio',    duration: 212 },
      { id: 's98-02', title: 'Mango Season',       artist: 'Ram Radio',    duration: 245 },
      { id: 's98-03', title: 'Neighbour\'s Radio', artist: 'Ram Radio',    duration: 198 },
      { id: 's98-04', title: 'Afternoon Nap',      artist: 'Ram Radio',    duration: 420 },
      { id: 's98-05', title: 'Evening Cricket',    artist: 'Ram Radio',    duration: 267 },
    ],
  },
  {
    id:          'lns',
    slug:        'letters-never-sent',
    title:       'LETTERS NEVER SENT',
    curator:     'Dev P.',
    year:        '2003',
    genre:       'Intimate / Melancholic',
    theme:       THEMES.letters,
    description: 'For every unsent letter and every phone call that never happened. Recorded in a single winter night.',
    labelArt:    'diagonal',
    tracks: [
      { id: 'lns-01', title: 'First Draft',        artist: 'Ram Radio',    duration: 234 },
      { id: 'lns-02', title: 'Teri Aahat',         artist: 'Ram Radio',    duration: 298 },
      { id: 'lns-03', title: 'Crossed Out',        artist: 'Ram Radio',    duration: 187 },
      { id: 'lns-04', title: 'Sealed, Unsent',     artist: 'Ram Radio',    duration: 356 },
      { id: 'lns-05', title: 'Last Line',          artist: 'Ram Radio',    duration: 210 },
      { id: 'lns-06', title: 'Burned',             artist: 'Ram Radio',    duration: 285 },
    ],
  },
  {
    id:          'alt',
    slug:        'after-the-last-train',
    title:       'AFTER THE LAST TRAIN',
    curator:     'Meera J.',
    year:        '2006',
    genre:       'Transit / Ambient',
    theme:       THEMES.train,
    description: 'The platform after the last service. The station lights humming. The city going quiet, one signal at a time.',
    labelArt:    'line',
    tracks: [
      { id: 'alt-01', title: 'Platform 4',         artist: 'Ram Radio',    duration: 198 },
      { id: 'alt-02', title: 'Departure Board',    artist: 'Ram Radio',    duration: 245 },
      { id: 'alt-03', title: 'Empty Carriage',     artist: 'Ram Radio',    duration: 312 },
      { id: 'alt-04', title: 'Junction Night',     artist: 'Ram Radio',    duration: 276 },
      { id: 'alt-05', title: 'Signal Clear',       artist: 'Ram Radio',    duration: 340 },
    ],
  },
]

/** Return tracks for a mixtape with silence blob URLs filled in */
export function getMixtapeQueue(mixtapeId) {
  const mix = MIXTAPES.find((m) => m.id === mixtapeId)
  if (!mix) return []
  const url = silenceUrl()
  return mix.tracks.map((t) => ({
    ...t,
    album:    mix.title,
    album_id: mix.id,
    cover:    null,
    genre:    mix.genre,
    audioUrl: url,
    side:     undefined,
    num:      undefined,
  }))
}

export function getMixtapeById(id) { return MIXTAPES.find((m) => m.id === id) }
