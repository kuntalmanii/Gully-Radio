/**
 * discoverData.js
 * ──────────────────────────────────────────────────────────────
 * Curated editorial datasets for the Discover page.
 * Connected directly to your personal music library.
 */

export const FEATURED_TRACK = {
  id:          'track-heer',
  title:       'हीर (Heer)',
  titleEn:     'Heer',
  artist:      'Ali Raza Shjr',
  album:       'Lecture Time Special Archives',
  location:    'विशेष अभिलेखागार · 2024',
  recordedAt:  'विशेष अभिलेखागार · 2024',
  linerNotes:  'वारिस शाह की कालजयी रचना का एक अत्यंत भावुक और रूहानी प्रस्तुतीकरण। असली सुर, शांत गिटार और अली रज़ा की जादू भरी आवाज़।',
  linerNotesEn:'A timeless soul-stirring rendition of Waris Shah\'s poetry by Ali Raza Shjr, recorded with acoustic richness and vintage atmospheric resonance.',
  duration:    251,
  genre:       'Sufi / Folk',
  bpm:         76,
  key:         'E Minor',
  side:        'A',
  num:         '01',
  audioUrl:    '/audio/Heer_-_Ali_Raza_Shjr_Lyrics.mp3',
}

export const RECENTLY_ADDED = [FEATURED_TRACK]
export const NOSTALGIC_PICKS = [FEATURED_TRACK]
export const LATE_NIGHT_TRACKS = [FEATURED_TRACK]
export const HIDDEN_GEMS = [FEATURED_TRACK]
export const CURATED_PICKS = [FEATURED_TRACK]

export const TIME_CAPSULE_YEARS = ['2024']
export const TIME_CAPSULE_TRACKS = {
  '2024': [FEATURED_TRACK],
}

export function resolveDiscoverTrack() {
  return FEATURED_TRACK
}
