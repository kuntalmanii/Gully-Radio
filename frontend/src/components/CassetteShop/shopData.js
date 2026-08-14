/**
 * shopData.js
 * ──────────────────────────────────────────────────────────────
 * Six authentic mixtapes for the Gully Radio Cassette Shop.
 * Connected directly to your personal music library.
 */

/* ── Color themes ─────────────────────────────────────────────── */
const THEMES = {
  midnight: { shell: '#0c1220', label: '#11213d', stripe: '#1e3a6e', accent: '#4a90d9', text: '#a8c8f0', screw: '#1a2a45' },
  chai:     { shell: '#1a0f06', label: '#2a1a0a', stripe: '#7a4a1a', accent: '#d4842a', text: '#f0d0a0', screw: '#2a1a0a' },
  oldcity:  { shell: '#0a1412', label: '#102820', stripe: '#1e5040', accent: '#c87832', text: '#d4b878', screw: '#142a22' },
  sunday:   { shell: '#18140a', label: '#2a2010', stripe: '#6a5820', accent: '#d4b030', text: '#f0e0a0', screw: '#221c0e' },
  letters:  { shell: '#18060a', label: '#2a0c14', stripe: '#7a1a28', accent: '#d45060', text: '#f0b0b8', screw: '#220a10' },
  train:    { shell: '#101010', label: '#1a1a1a', stripe: '#2a2a2a', accent: '#e87820', text: '#d0c0b0', screw: '#1e1e1e' },
}

export const HEER_TRACK = {
  id: 'track-heer',
  title: 'हीर (Heer)',
  artist: 'Ali Raza Shjr',
  duration: 251,
  audioUrl: '/audio/Heer_-_Ali_Raza_Shjr_Lyrics.mp3',
}

/* ── Mixtape catalogue ────────────────────────────────────────── */
export const MIXTAPES = [
  {
    id:          'mg',
    slug:        'midnight-gully',
    title:       'आधी रात की गली',
    titleEn:     'MIDNIGHT GULLY',
    curator:     'रोहन एम.',
    curatorEn:   'Rohan M.',
    year:        '1998',
    genre:       'Nocturnal / Street',
    theme:       THEMES.midnight,
    description: 'जागती गलियों में देर रात की हलचल, रेडियो की सुरीली सरसराहट और आखिरी चाय की दुकान की लालटेन।',
    descriptionEn: 'Late nights in lanes that never sleep. The hiss of a radio, the last chai stall still burning its lantern.',
    labelArt:    'grid',
    tracks:      [HEER_TRACK],
  },
  {
    id:          'cr',
    slug:        'chai-and-rain',
    title:       'चाय और बारिश',
    titleEn:     'CHAI & RAIN',
    curator:     'प्रिया के.',
    curatorEn:   'Priya K.',
    year:        '2001',
    genre:       'Monsoon / Slow',
    theme:       THEMES.chai,
    description: 'मानसून की वो दोपहरें जब कहीं जाने की जल्दी नहीं होती। मिट्टी की सौंधी खुशबू और गर्म चाय की प्याली।',
    descriptionEn: 'Monsoon afternoons with nowhere to be. Warm cups, wet pavements, and the smell of petrichor.',
    labelArt:    'lines',
    tracks:      [HEER_TRACK],
  },
  {
    id:          'oc',
    slug:        'old-city-nights',
    title:       'पुराने शहर की रातें',
    titleEn:     'OLD CITY NIGHTS',
    curator:     'विक्रम एस.',
    curatorEn:   'Vikram S.',
    year:        '1995',
    genre:       'Heritage / Deep Cut',
    theme:       THEMES.oldcity,
    description: 'चारदीवारी वाले शहर की तंग गलियों में दर्ज आवाज़ें। मंदिर की घंटियाँ, अज़ान और रात में चमेली का इत्र।',
    descriptionEn: 'Recorded in the narrow lanes of a walled city. The azaan, the temple bells, and the jasmine seller.',
    labelArt:    'circles',
    tracks:      [HEER_TRACK],
  },
  {
    id:          's98',
    slug:        'sunday-1998',
    title:       'सन् 1998',
    titleEn:     'SUNDAY 1998',
    curator:     'अनन्या आर.',
    curatorEn:   'Ananya R.',
    year:        '1998',
    genre:       'Nostalgia / Easy',
    theme:       THEMES.sunday,
    description: 'वो इतवार जो एक सदी जैसा लंबा लगता था। दूरदर्शन का एंटीना, आम का अचार और पड़ोस के रेडियो की गूंज।',
    descriptionEn: 'A Sunday that lasted a whole decade. Doordarshan static, mango season, and neighbourhood FM.',
    labelArt:    'dots',
    tracks:      [HEER_TRACK],
  },
  {
    id:          'lns',
    slug:        'letters-never-sent',
    title:       'अधूरे ख़त',
    titleEn:     'LETTERS NEVER SENT',
    curator:     'देव पी.',
    curatorEn:   'Dev P.',
    year:        '2003',
    genre:       'Intimate / Melancholic',
    theme:       THEMES.letters,
    description: 'उन ख़तों के नाम जो कभी भेजे नहीं गए और वो बातें जो सिर्फ कागज़ पर ही रह गईं।',
    descriptionEn: 'For every unsent letter and unmade phone call. Recorded in a single winter night.',
    labelArt:    'diagonal',
    tracks:      [HEER_TRACK],
  },
  {
    id:          'alt',
    slug:        'after-the-last-train',
    title:       'आख़िरी ट्रेन के बाद',
    titleEn:     'AFTER THE LAST TRAIN',
    curator:     'मीरा जे.',
    curatorEn:   'Meera J.',
    year:        '2006',
    genre:       'Transit / Ambient',
    theme:       THEMES.train,
    description: 'आखरी ट्रेन छूटने के बाद सुनसान प्लेटफॉर्म। पीली लाइटों की गूंज और शहर का धीरे-धीरे सो जाना।',
    descriptionEn: 'The platform after the last service. Station lights humming. The city going quiet.',
    labelArt:    'line',
    tracks:      [HEER_TRACK],
  },
]

export function getMixtapeQueue(mixtapeId) {
  const mix = MIXTAPES.find((m) => m.id === mixtapeId || m.slug === mixtapeId)
  return mix?.tracks || [HEER_TRACK]
}

export function getMixtapeById(id) {
  return MIXTAPES.find((m) => m.id === id || m.slug === id) ?? MIXTAPES[0]
}
