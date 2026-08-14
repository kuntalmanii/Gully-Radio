/**
 * musicService.js
 * ──────────────────────────────────────────────────────────────
 * Single source of truth for Gully Radio track data.
 * Every track is backed by authentic procedural lo-fi audio generation.
 */

import { generateTrackAudioUrl } from './audioGenerator'

export const TRACKS = [
  /* ─ Side A ─ */
  {
    id:          1,
    title:       'तेरी याद (Extended Mix)',
    titleEn:     'Teri Yaad (Extended Mix)',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    263,
    genre:       'Indie / Cassette',
    year:        1987,
    side:        'A',
    num:         '01',
    description: 'चांदनी चौक की पुरानी दुकान से मिला 1/4" मास्टर रील।',
  },
  {
    id:          2,
    title:       'गली की रातें',
    titleEn:     'Gully Nights',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    225,
    genre:       'Ambient / Street',
    year:        1988,
    side:        'A',
    num:         '02',
    description: 'जागती गलियों में लालटेन की रोशनी और चाय की महक।',
  },
  {
    id:          3,
    title:       'बारिश और कैसेट',
    titleEn:     'Cassette Rain',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    312,
    genre:       'Instrumental',
    year:        1989,
    side:        'A',
    num:         '03',
    description: 'टीन की छत पर गिरती बूँदें और रिकॉर्डर का सुरूर।',
  },
  {
    id:          4,
    title:       'रेडियो का सन्नाटा',
    titleEn:     'Radio Silence',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    238,
    genre:       'Drone / Ambient',
    year:        1986,
    side:        'A',
    num:         '04',
    description: 'आधी रात का एफएम सिग्नल और दूरदर्शन की झिलमिलाहट।',
  },

  /* ─ Side B ─ */
  {
    id:          5,
    title:       'चांदनी चौक 03:00 AM',
    titleEn:     'Chandni Chowk 03:00 AM',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    194,
    genre:       'Lo-Fi / Field Recording',
    year:        1987,
    side:        'B',
    num:         '01',
    description: 'सन्नाटे में गुजरती मालगाड़ी और आवारा हवा की सीटी।',
  },
  {
    id:          6,
    title:       'शाम की सुनहरी धूप',
    titleEn:     'Golden Hours',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    362,
    genre:       'Jazz / Fusion',
    year:        1988,
    side:        'B',
    num:         '02',
    description: 'हवेली के चौबारे पर ढलती धूप का राग।',
  },
  {
    id:          7,
    title:       'दरबारी कान्हड़ा (आधी रात)',
    titleEn:     'Late Night Raga',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    284,
    genre:       'Classical / Fusion',
    year:        1985,
    side:        'B',
    num:         '03',
    description: 'आकाशवाणी के अभिलेखागार से बरामद दुर्लभ रिकॉर्डिंग।',
  },
  {
    id:          8,
    title:       'अंतिम स्टेशन',
    titleEn:     'Last Train Home',
    artist:      'Ram Radio Sessions',
    album:       'वॉल्यूम 01 — शाम की धूप',
    cover:       null,
    audioUrl:    null,
    duration:    297,
    genre:       'Ambient / Street',
    year:        1990,
    side:        'B',
    num:         '04',
    description: 'खाली डिब्बों में गूंजता सफ़र का तराना।',
  },
]

/** Return all tracks with genuine playable procedural audio blob URLs */
export function getPlayableTracks() {
  return TRACKS.map((t) => ({
    ...t,
    audioUrl: t.audioUrl || generateTrackAudioUrl(t.id, t.genre),
  }))
}

export function getAllTracks() {
  return getPlayableTracks()
}

export function getTrackById(id) {
  const tracks = getPlayableTracks()
  return tracks.find((t) => t.id === Number(id)) ?? null
}

export function getTracksBySide(side) {
  return getPlayableTracks().filter((t) => t.side === side.toUpperCase())
}

export function getQueue() {
  return getPlayableTracks()
}

export function getDefaultQueue() {
  return getPlayableTracks()
}

