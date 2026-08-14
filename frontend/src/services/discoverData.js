/**
 * discoverData.js
 * ──────────────────────────────────────────────────────────────
 * Curated editorial datasets for the Discover page.
 * All tracks reference the unified playback format with demo audio URLs.
 */

import { getPlayableTracks } from './musicService'
import { MIXTAPES } from '../components/CassetteShop/shopData'

/* Demo tracks pool */
const allPlayable = getPlayableTracks()

export const FEATURED_TRACK = {
  id:          1,
  title:       'Teri Yaad (Extended Mix)',
  artist:      'Ram Radio Sessions',
  album:       'Vol. 01 — Golden Hours',
  recordedAt:  'Old Delhi · 1987',
  linerNotes:  'An uncompressed 1/4" master reel uncovered in an unmarked aluminium canister behind a defunct electrical shop. Features warm tube saturation, analog tape flutter, and the distant sound of rain on corrugated iron.',
  duration:    263,
  genre:       'Indie / Cassette',
  bpm:         82,
  key:         'D Minor',
  side:        'A',
  num:         '01',
}

export const RECENTLY_ADDED = [
  {
    id:          'disc-rec-1',
    title:       'Dusk on Victoria Road',
    artist:      'Kalyan & Co.',
    album:       'Bombay Archives',
    location:    'Bombay Dockyards · 1989',
    duration:    284,
    genre:       'Ambient Fusion',
    curatorNote: 'Found on a BASF C-60 cassette.',
  },
  {
    id:          'disc-rec-2',
    title:       'Radio Mirage (Live at Regal)',
    artist:      'The Gully Trio',
    album:       'Regal Hall Recordings',
    location:    'Calcutta · 1991',
    duration:    312,
    genre:       'Indie Cassette',
    curatorNote: 'Captured directly from the soundboard.',
  },
  {
    id:          'disc-rec-3',
    title:       'Chowpatty 4 AM',
    artist:      'Late Hour Quartet',
    album:       'Monsoon Tapes',
    location:    'Marine Drive · 1988',
    duration:    245,
    genre:       'Analog Jazz',
    curatorNote: 'Single condenser mic on the promenade.',
  },
  {
    id:          'disc-rec-4',
    title:       'Bazaar Nocturne',
    artist:      'Ustad Nisar Ali',
    album:       'Heritage Series',
    location:    'Lucknow · 1984',
    duration:    356,
    genre:       'Classical / Sarangi',
    curatorNote: 'Midnight courtyard session.',
  },
]

export const NOSTALGIC_PICKS = [
  {
    id:          2,
    title:       'Gully Nights',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'Old City · 1988',
    duration:    225,
    genre:       'Ambient / Street',
    tag:         'Staff Favorite',
  },
  {
    id:          3,
    title:       'Cassette Rain',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'Varanasi · 1989',
    duration:    312,
    genre:       'Instrumental',
    tag:         'Monsoon Tape',
  },
  {
    id:          6,
    title:       'Golden Hours',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'Jaipur · 1988',
    duration:    362,
    genre:       'Jazz / Fusion',
    tag:         'Sunset Cut',
  },
  {
    id:          'oc-01',
    title:       'Purani Haveli',
    artist:      'Old City Archive',
    album:       'OLD CITY NIGHTS',
    location:    'Walled City · 1995',
    duration:    267,
    genre:       'Heritage / Deep Cut',
    tag:         'Rare Reel',
  },
]

export const LATE_NIGHT_TRACKS = [
  {
    id:          4,
    title:       'Radio Silence',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'FM Broadcast Leak · 1986',
    duration:    238,
    genre:       'Drone / Ambient',
    mood:        'Heavy Silence',
  },
  {
    id:          7,
    title:       'Late Night Raga',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'All India Radio Archive · 1985',
    duration:    284,
    genre:       'Classical / Fusion',
    mood:        'Meditative',
  },
  {
    id:          'alt-05',
    title:       'Signal Clear',
    artist:      'Ram Radio',
    album:       'AFTER THE LAST TRAIN',
    location:    'Railway Cabin · 2006',
    duration:    340,
    genre:       'Transit / Ambient',
    mood:        'Last Departure',
  },
  {
    id:          'mg-04',
    title:       'Three A.M.',
    artist:      'Ram Radio',
    album:       'MIDNIGHT GULLY',
    location:    'Tea Stall Corner · 1998',
    duration:    312,
    genre:       'Nocturnal / Street',
    mood:        'Lantern Glow',
  },
]

export const HIDDEN_GEMS = [
  {
    id:          'gem-1',
    title:       'The Courtyard (Reel Extract)',
    artist:      'Unknown Street Trio',
    album:       'Lost Tape 04',
    year:        '1992',
    duration:    210,
    quote:       '"Recorded through a window open to the courtyard. You can hear the jasmine garland sellers outside."',
  },
  {
    id:          'gem-2',
    title:       'Platform 4 Hiss',
    artist:      'Station Master Archive',
    album:       'Railway Nights',
    year:        '2006',
    duration:    188,
    quote:       '"The sound of the tea kettle whistling against a dormant diesel locomotive at 3:15 AM."',
  },
  {
    id:          'gem-3',
    title:       'Mango Season (Unreleased Take)',
    artist:      'The Gully Ensemble',
    album:       'Summer Tapes',
    year:        '1998',
    duration:    255,
    quote:       '"A playful sitar improvisation recorded on a high-temperature afternoon when the power was out."',
  },
]

/** Get complete track object for playback from any Discover item */
export function resolveDiscoverTrack(track) {
  const match = allPlayable.find((t) => t.id === track.id)
  if (match) return match

  // Fallback demo silence track
  return {
    id:       track.id,
    title:    track.title,
    artist:   track.artist,
    album:    track.album || 'Gully Radio Discovery',
    cover:    null,
    audioUrl: allPlayable[0]?.audioUrl || '',
    duration: track.duration || 240,
    genre:    track.genre || 'Cassette',
    year:     track.year || 1990,
  }
}
