/**
 * musicLibrary.js
 * ──────────────────────────────────────────────────────────────
 * Centralized Music Library for Gully Radio.
 * Contains only your personal manually-added tracks.
 *
 * HOW TO ADD A NEW SONG:
 * 1. Place MP3 in `frontend/public/audio/your-song.mp3`
 * 2. Place Cover in `frontend/public/assets/album-art/your-song.jpg` (optional)
 * 3. Add one track object to TRACKS array below.
 */

import { generateTrackAudioUrl } from '../services/audioGenerator'

/* ── All Tracks in the Personal Music Library ─────────────────── */
export const TRACKS = [
  {
    id:          'track-heer',
    title:       'हीर (Heer)',
    titleEn:     'Heer',
    artist:      'Ali Raza Shjr',
    album:       'Gully Radio Special Archives',
    cover:       null,
    audioUrl:    '/audio/Heer_-_Ali_Raza_Shjr_Lyrics.mp3',
    duration:    251,
    genre:       'Sufi / Folk',
    year:        2024,
    mood:        'Late Night',
    language:    'Punjabi',
    description: 'वारिस शाह की हीर का रूहानी और भावुक तराना — अली रज़ा की आवाज़ में।',
    featured:    true,
    recentlyAdded: true,
    trending:    true,
  },
]

/* ── Mixtapes Architecture referencing Track IDs ──────────────── */
export const MIXTAPES = [
  {
    id:          'mixtape-midnight-gully',
    shortId:     'mg',
    slug:        'midnight-gully',
    title:       'आधी रात की गली',
    titleEn:     'MIDNIGHT GULLY',
    curator:     'रोहन एम.',
    curatorEn:   'Rohan M.',
    year:        '1998',
    genre:       'Nocturnal / Street',
    theme:       { shell: '#0c1220', label: '#11213d', stripe: '#1e3a6e', accent: '#4a90d9', text: '#a8c8f0', screw: '#1a2a45' },
    description: 'जागती गलियों में देर रात की हलचल, रेडियो की सुरीली सरसराहट और आखिरी चाय की दुकान की लालटेन।',
    labelArt:    'grid',
    trackIds:    ['track-heer'],
  },
  {
    id:          'mixtape-chai-and-rain',
    shortId:     'cr',
    slug:        'chai-and-rain',
    title:       'चाय और बारिश',
    titleEn:     'CHAI & RAIN',
    curator:     'प्रिया के.',
    curatorEn:   'Priya K.',
    year:        '2001',
    genre:       'Monsoon / Slow',
    theme:       { shell: '#1a0f06', label: '#2a1a0a', stripe: '#7a4a1a', accent: '#d4842a', text: '#f0d0a0', screw: '#2a1a0a' },
    description: 'मानसून की वो दोपहरें जब कहीं जाने की जल्दी नहीं होती। मिट्टी की सौंधी खुशबू और गर्म चाय की प्याली।',
    labelArt:    'lines',
    trackIds:    ['track-heer'],
  },
  {
    id:          'mixtape-old-city-nights',
    shortId:     'oc',
    slug:        'old-city-nights',
    title:       'पुराने शहर की रातें',
    titleEn:     'OLD CITY NIGHTS',
    curator:     'विक्रम एस.',
    curatorEn:   'Vikram S.',
    year:        '1995',
    genre:       'Heritage / Deep Cut',
    theme:       { shell: '#0a1412', label: '#102820', stripe: '#1e5040', accent: '#c87832', text: '#d4b878', screw: '#142a22' },
    description: 'चारदीवारी वाले शहर की तंग गलियों में दर्ज आवाज़ें। मंदिर की घंटियाँ, अज़ान और रात में चमेली का इत्र।',
    labelArt:    'circles',
    trackIds:    ['track-heer'],
  },
  {
    id:          'mixtape-sunday-1998',
    shortId:     's98',
    slug:        'sunday-1998',
    title:       'सन् 1998',
    titleEn:     'SUNDAY 1998',
    curator:     'अनन्या आर.',
    curatorEn:   'Ananya R.',
    year:        '1998',
    genre:       'Nostalgia / Easy',
    theme:       { shell: '#18140a', label: '#2a2010', stripe: '#6a5820', accent: '#d4b030', text: '#f0e0a0', screw: '#221c0e' },
    description: 'वो इतवार जो एक सदी जैसा लंबा लगता था। दूरदर्शन का एंटीना, आम का अचार और पड़ोस के रेडियो की गूंज।',
    labelArt:    'dots',
    trackIds:    ['track-heer'],
  },
  {
    id:          'mixtape-letters-never-sent',
    shortId:     'lns',
    slug:        'letters-never-sent',
    title:       'अधूरे ख़त',
    titleEn:     'LETTERS NEVER SENT',
    curator:     'देव पी.',
    curatorEn:   'Dev P.',
    year:        '2003',
    genre:       'Intimate / Melancholic',
    theme:       { shell: '#18060a', label: '#2a0c14', stripe: '#7a1a28', accent: '#d45060', text: '#f0b0b8', screw: '#220a10' },
    description: 'उन ख़तों के नाम जो कभी भेजे नहीं गए और वो बातें जो सिर्फ कागज़ पर ही रह गईं।',
    labelArt:    'diagonal',
    trackIds:    ['track-heer'],
  },
  {
    id:          'mixtape-after-the-last-train',
    shortId:     'alt',
    slug:        'after-the-last-train',
    title:       'आख़िरी ट्रेन के बाद',
    titleEn:     'AFTER THE LAST TRAIN',
    curator:     'मीरा जे.',
    curatorEn:   'Meera J.',
    year:        '2006',
    genre:       'Transit / Ambient',
    theme:       { shell: '#101010', label: '#1a1a1a', stripe: '#2a2a2a', accent: '#e87820', text: '#d0c0b0', screw: '#1e1e1e' },
    description: 'आखरी ट्रेन छूटने के बाद सुनसान प्लेटफॉर्म। पीली लाइटों की गूंज और शहर का धीरे-धीरे सो जाना।',
    labelArt:    'line',
    trackIds:    ['track-heer'],
  },
]

/* ── Validation Helper ─────────────────────────────────────────── */
export function validateTrack(track) {
  if (!track || typeof track !== 'object') return false
  if (!track.id || !track.title || !track.artist) {
    console.warn('[MusicLibrary] Invalid track rejected:', track)
    return false
  }
  return true
}

/* ── Sanitized, Validated Tracks ──────────────────────────────── */
export function getAllTracks() {
  return TRACKS.filter(validateTrack).map((t) => ({
    ...t,
    audioUrl: t.audioUrl || generateTrackAudioUrl(t.id, t.genre),
  }))
}

export function getTrackById(id) {
  const all = getAllTracks()
  return all.find((t) => String(t.id) === String(id)) ?? (all.length > 0 ? all[0] : null)
}

/**
 * Filter tracks by Category, Genre, Mood, or Language
 * @param {string} category
 */
export function getTracksByCategory(category) {
  const all = getAllTracks()
  if (!category || category === 'All' || category === 'सभी') return all

  const cat = category.toLowerCase()

  switch (cat) {
    case 'featured':
    case 'खास':
      return all.filter((t) => t.featured)
    case 'recently added':
    case 'हाल ही में':
      return all.filter((t) => t.recentlyAdded)
    case 'trending':
    case 'ट्रेंडिंग':
      return all.filter((t) => t.trending)
    case 'late night':
    case 'आधी रात':
      return all.filter((t) => t.mood?.toLowerCase() === 'late night')
    case 'nostalgic':
    case 'यादें':
      return all.filter((t) => t.mood?.toLowerCase() === 'nostalgic' || t.genre?.toLowerCase() === 'nostalgic')
    case 'chill':
    case 'सुकून':
      return all.filter((t) => t.mood?.toLowerCase() === 'chill' || t.genre?.toLowerCase() === 'chill')
    case 'indie':
      return all.filter((t) => t.genre?.toLowerCase().includes('indie'))
    case 'sufi':
    case 'folk':
      return all.filter((t) => t.genre?.toLowerCase().includes('sufi') || t.genre?.toLowerCase().includes('folk'))
    case 'instrumental':
      return all.filter((t) => t.genre?.toLowerCase().includes('instrumental') || t.language?.toLowerCase() === 'instrumental')
    case 'hindi':
      return all.filter((t) => t.language?.toLowerCase() === 'hindi')
    case 'punjabi':
      return all.filter((t) => t.language?.toLowerCase() === 'punjabi')
    case 'english':
      return all.filter((t) => t.language?.toLowerCase() === 'english')
    default:
      return all.filter(
        (t) =>
          t.genre?.toLowerCase().includes(cat) ||
          t.mood?.toLowerCase().includes(cat) ||
          t.language?.toLowerCase().includes(cat)
      )
  }
}

/**
 * Resolves all track objects for a mixtape by its trackIds
 * @param {string} mixtapeId
 */
export function getTracksByMixtape(mixtapeId) {
  const mix = MIXTAPES.find((m) => m.id === mixtapeId || m.shortId === mixtapeId || m.slug === mixtapeId)
  if (!mix) return getAllTracks()

  const all = getAllTracks()
  const resolved = (mix.trackIds || [])
    .map((tid) => all.find((t) => String(t.id) === String(tid)))
    .filter(Boolean)

  return resolved.length > 0 ? resolved : all
}

/**
 * Dynamic Multi-field Library Search
 * @param {string} query
 */
export function searchLibrary(query) {
  if (!query || !query.trim()) return getAllTracks()
  const q = query.toLowerCase().trim()

  return getAllTracks().filter(
    (t) =>
      t.title?.toLowerCase().includes(q) ||
      t.titleEn?.toLowerCase().includes(q) ||
      t.artist?.toLowerCase().includes(q) ||
      t.album?.toLowerCase().includes(q) ||
      t.genre?.toLowerCase().includes(q) ||
      t.mood?.toLowerCase().includes(q) ||
      t.language?.toLowerCase().includes(q)
  )
}
