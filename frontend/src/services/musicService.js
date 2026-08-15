/**
 * musicService.js
 * ──────────────────────────────────────────────────────────────
 * Single source of truth for Lecture Time track data.
 * Contains only your personal manually-added track(s).
 */

export const TRACKS = [
  {
    id:          'track-heer',
    title:       'हीर (Heer)',
    titleEn:     'Heer',
    artist:      'Ali Raza Shjr',
    album:       'Lecture Time Special Archives',
    cover:       null,
    audioUrl:    '/audio/Heer_-_Ali_Raza_Shjr_Lyrics.mp3',
    duration:    251,
    genre:       'Sufi / Folk',
    year:        2024,
    side:        'A',
    num:         '01',
    mood:        'Late Night',
    language:    'Punjabi',
    description: 'वारिस शाह की हीर का रूहानी और भावुक तराना — अली रज़ा की आवाज़ में।',
    featured:    true,
    recentlyAdded: true,
    trending:    true,
  },
]

export function getAllTracks() {
  return [...TRACKS]
}

export function getTrackById(id) {
  return TRACKS.find((t) => String(t.id) === String(id)) ?? (TRACKS.length > 0 ? TRACKS[0] : null)
}

export function getDefaultQueue() {
  return [...TRACKS]
}
