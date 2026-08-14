/**
 * musicLibrary.js
 * ──────────────────────────────────────────────────────────────
 * Centralized Music Library for Gully Radio.
 *
 * HOW TO ADD A SONG:
 * 1. Place MP3 in `frontend/public/audio/your-song.mp3` (or omit for procedural synthesis)
 * 2. Place Cover in `frontend/public/assets/album-art/your-song.jpg` (or null for cassette cover)
 * 3. Add one track object to TRACKS array below.
 */

import { generateTrackAudioUrl } from '../services/audioGenerator'

/* ── All Tracks in the Personal / Demo Library ─────────────────── */
export const TRACKS = [
  {
    id:          'track-001',
    title:       'तेरी याद (Extended Mix)',
    titleEn:     'Teri Yaad (Extended Mix)',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    '/audio/song-01.mp3', // points to public/audio/
    duration:    263,
    genre:       'Indie',
    year:        1987,
    mood:        'Late Night',
    language:    'Hindi',
    description: 'चांदनी चौक की पुरानी दुकान से मिला 1/4" मास्टर रील।',
    featured:    true,
    recentlyAdded: true,
    trending:    true,
  },
  {
    id:          'track-002',
    title:       'गली की रातें',
    titleEn:     'Gully Nights',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    '/audio/song-02.mp3',
    duration:    225,
    genre:       'Ambient',
    year:        1988,
    mood:        'Late Night',
    language:    'Hindi',
    description: 'जागती गलियों में लालटेन की रोशनी और चाय की महक।',
    featured:    true,
    recentlyAdded: true,
    trending:    true,
  },
  {
    id:          'track-003',
    title:       'बारिश और कैसेट',
    titleEn:     'Cassette Rain',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    '/audio/song-03.mp3',
    duration:    312,
    genre:       'Instrumental',
    year:        1989,
    mood:        'Chill',
    language:    'Instrumental',
    description: 'टीन की छत पर गिरती बूँदें और रिकॉर्डर का सुरूर।',
    featured:    false,
    recentlyAdded: true,
    trending:    true,
  },
  {
    id:          'track-004',
    title:       'रेडियो का सन्नाटा',
    titleEn:     'Radio Silence',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    238,
    genre:       'Ambient',
    year:        1986,
    mood:        'Late Night',
    language:    'Instrumental',
    description: 'आधी रात का एफएम सिग्नल और दूरदर्शन की झिलमिलाहट।',
    featured:    false,
    recentlyAdded: false,
    trending:    false,
  },
  {
    id:          'track-005',
    title:       'चांदनी चौक 03:00 AM',
    titleEn:     'Chandni Chowk 03:00 AM',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    194,
    genre:       'Indie',
    year:        1987,
    mood:        'Late Night',
    language:    'Hindi',
    description: 'सन्नाटे में गुजरती मालगाड़ी और आवारा हवा की सीटी।',
    featured:    false,
    recentlyAdded: false,
    trending:    true,
  },
  {
    id:          'track-006',
    title:       'शाम की सुनहरी धूप',
    titleEn:     'Golden Hours',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    362,
    genre:       'Indie',
    year:        1988,
    mood:        'Chill',
    language:    'Hindi',
    description: 'हवेली के चौबारे पर ढलती धूप का राग।',
    featured:    true,
    recentlyAdded: false,
    trending:    true,
  },
  {
    id:          'track-007',
    title:       'दरबारी कान्हड़ा (आधी रात)',
    titleEn:     'Late Night Raga',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    284,
    genre:       'Instrumental',
    year:        1985,
    mood:        'Nostalgic',
    language:    'Instrumental',
    description: 'आकाशवाणी के अभिलेखागार से बरामद दुर्लभ रिकॉर्डिंग।',
    featured:    false,
    recentlyAdded: false,
    trending:    false,
  },
  {
    id:          'track-008',
    title:       'अंतिम स्टेशन',
    titleEn:     'Last Train Home',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    297,
    genre:       'Ambient',
    year:        1990,
    mood:        'Nostalgic',
    language:    'Hindi',
    description: 'खाली डिब्बों में गूंजता सफ़र का तराना।',
    featured:    false,
    recentlyAdded: false,
    trending:    true,
  },
  {
    id:          'track-009',
    title:       'बारिश का पहला दिन',
    titleEn:     'First Day of Rain',
    artist:      'Priya K.',
    album:       'चाय और बारिश',
    cover:       null,
    audioUrl:    null,
    duration:    220,
    genre:       'Chill',
    year:        2001,
    mood:        'Chill',
    language:    'Hindi',
    description: 'मानसून की पहली फुहार और गरम चाय।',
    featured:    true,
    recentlyAdded: true,
    trending:    true,
  },
  {
    id:          'track-010',
    title:       'पुरानी हवेली',
    titleEn:     'Old Haveli',
    artist:      'Vikram S.',
    album:       'पुराने शहर की रातें',
    cover:       null,
    audioUrl:    null,
    duration:    267,
    genre:       'Nostalgic',
    year:        1995,
    mood:        'Nostalgic',
    language:    'Hindi',
    description: 'चारदीवारी वाले शहर के अनकहे क़िस्से।',
    featured:    false,
    recentlyAdded: true,
    trending:    false,
  },
  {
    id:          'track-011',
    title:       'दूरदर्शन 1998',
    titleEn:     'Doordarshan 1998',
    artist:      'Ananya R.',
    album:       'सन् 1998',
    cover:       null,
    audioUrl:    null,
    duration:    212,
    genre:       'Nostalgic',
    year:        1998,
    mood:        'Nostalgic',
    language:    'Hindi',
    description: 'इतवार की दोपहर का एंटीना और दूरदर्शन का सुर।',
    featured:    false,
    recentlyAdded: false,
    trending:    true,
  },
  {
    id:          'track-012',
    title:       'पहला ख़त',
    titleEn:     'First Letter',
    artist:      'Dev P.',
    album:       'अधूरे ख़त',
    cover:       null,
    audioUrl:    null,
    duration:    234,
    genre:       'Indie',
    year:        2003,
    mood:        'Late Night',
    language:    'Hindi',
    description: 'उन बातों के नाम जो सिर्फ़ कागज़ पर रह गईं।',
    featured:    false,
    recentlyAdded: false,
    trending:    false,
  },
  {
    id:          'track-013',
    title:       'प्लेटफॉर्म 4',
    titleEn:     'Platform 4',
    artist:      'Meera J.',
    album:       'आख़िरी ट्रेन के बाद',
    cover:       null,
    audioUrl:    null,
    duration:    198,
    genre:       'Ambient',
    year:        2006,
    mood:        'Late Night',
    language:    'Instrumental',
    description: 'आखरी ट्रेन छूटने के बाद सुनसान प्लेटफॉर्म।',
    featured:    false,
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
    trackIds:    ['track-001', 'track-002', 'track-004', 'track-005', 'track-012', 'track-013'],
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
    trackIds:    ['track-003', 'track-006', 'track-009'],
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
    trackIds:    ['track-007', 'track-008', 'track-010'],
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
    trackIds:    ['track-011', 'track-003', 'track-006'],
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
    trackIds:    ['track-012', 'track-001', 'track-004'],
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
    trackIds:    ['track-013', 'track-008', 'track-005'],
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

/* ── Sanitized, Validated Tracks with Audio Fallbacks ─────────── */
export function getAllTracks() {
  return TRACKS.filter(validateTrack).map((t) => ({
    ...t,
    // Always provide valid audio source
    audioUrl: t.audioUrl || generateTrackAudioUrl(t.id, t.genre),
  }))
}

export function getTrackById(id) {
  const all = getAllTracks()
  return all.find((t) => String(t.id) === String(id)) ?? null
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
  if (!mix) return []

  const all = getAllTracks()
  return (mix.trackIds || [])
    .map((tid) => all.find((t) => String(t.id) === String(tid)))
    .filter(Boolean)
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
