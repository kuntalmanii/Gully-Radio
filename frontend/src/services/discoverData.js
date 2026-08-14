/**
 * discoverData.js
 * ──────────────────────────────────────────────────────────────
 * Curated editorial datasets for the Discover page.
 * Contemporary Devanagari titles with bilingual supporting metadata.
 */

import { getPlayableTracks } from './musicService'

/* Demo tracks pool */
const allPlayable = getPlayableTracks()

export const FEATURED_TRACK = {
  id:          1,
  title:       'तेरी याद (Extended Mix)',
  titleEn:     'Teri Yaad (Extended Mix)',
  artist:      'Ram Radio Sessions',
  album:       'वॉल्यूम 01 — शाम की धूप',
  recordedAt:  'पुरानी दिल्ली · 1987',
  linerNotes:  'चांदनी चौक की एक पुरानी इलेक्ट्रॉनिक्स दुकान के पीछे से मिला बिना लेबल का 1/4" मास्टर रील। इसमें असली वैक्यूम ट्यूब की गरमाहट, कैसेट का सुरूर और टीन की छत पर गिरती बारिश की गूंज शामिल है।',
  linerNotesEn:'An uncompressed 1/4" master reel uncovered in an unmarked aluminium canister behind a defunct electrical shop. Features warm tube saturation, analog tape flutter, and the distant sound of rain.',
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
    title:       'विक्टोरिया रोड की शाम',
    titleEn:     'Dusk on Victoria Road',
    artist:      'Kalyan & Co.',
    album:       'Bombay Archives',
    location:    'बॉम्बे डॉकयार्ड · 1989',
    duration:    284,
    genre:       'Ambient Fusion',
    curatorNote: 'BASF C-60 कैसेट पर दर्ज।',
  },
  {
    id:          'disc-rec-2',
    title:       'रीगल हॉल की रात (Live)',
    titleEn:     'Radio Mirage (Live at Regal)',
    artist:      'The Gully Trio',
    album:       'Regal Hall Recordings',
    location:    'कलकत्ता · 1991',
    duration:    312,
    genre:       'Indie Cassette',
    curatorNote: 'सीधे साउंडबोर्ड से रिकॉर्ड किया गया।',
  },
  {
    id:          'disc-rec-3',
    title:       'चौपाटी सुबह 4 बजे',
    titleEn:     'Chowpatty 4 AM',
    artist:      'Late Hour Quartet',
    album:       'Monsoon Tapes',
    location:    'मरीन ड्राइव · 1988',
    duration:    245,
    genre:       'Analog Jazz',
    curatorNote: 'सिंगल कंडेनसर माइक रिकॉर्डिंग।',
  },
  {
    id:          'disc-rec-4',
    title:       'बाज़ार की रात और सारंगी',
    titleEn:     'Bazaar Nocturne',
    artist:      'Ustad Nisar Ali',
    album:       'Heritage Series',
    location:    'लखनऊ · 1984',
    duration:    356,
    genre:       'Classical / Sarangi',
    curatorNote: 'आधी रात के चौबारे की महफ़िल।',
  },
]

export const NOSTALGIC_PICKS = [
  {
    id:          2,
    title:       'गली की रातें',
    titleEn:     'Gully Nights',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'पुराना शहर · 1988',
    duration:    225,
    genre:       'Ambient / Street',
    tag:         'खास पसंद',
  },
  {
    id:          3,
    title:       'बारिश और कैसेट',
    titleEn:     'Cassette Rain',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'वाराणसी · 1989',
    duration:    312,
    genre:       'Instrumental',
    tag:         'मानसून टेप',
  },
  {
    id:          6,
    title:       'शाम की सुनहरी धूप',
    titleEn:     'Golden Hours',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'जयपुर · 1988',
    duration:    362,
    genre:       'Jazz / Fusion',
    tag:         'सनसेट कट',
  },
  {
    id:          'oc-01',
    title:       'पुरानी हवेली',
    titleEn:     'Purani Haveli',
    artist:      'Old City Archive',
    album:       'OLD CITY NIGHTS',
    location:    'चारदीवारी · 1995',
    duration:    267,
    genre:       'Heritage / Deep Cut',
    tag:         'दुर्लभ रील',
  },
]

export const LATE_NIGHT_TRACKS = [
  {
    id:          4,
    title:       'रेडियो का सन्नाटा',
    titleEn:     'Radio Silence',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'एफएम ब्रॉडकास्ट लीक · 1986',
    duration:    238,
    genre:       'Drone / Ambient',
    mood:        'गहरा सन्नाटा',
  },
  {
    id:          7,
    title:       'दरबारी कान्हड़ा (आधी रात)',
    titleEn:     'Late Night Raga',
    artist:      'Ram Radio Sessions',
    album:       'Vol. 01 — Golden Hours',
    location:    'आकाशवाणी अभिलेखागार · 1985',
    duration:    284,
    genre:       'Classical / Fusion',
    mood:        'शांति',
  },
  {
    id:          'alt-05',
    title:       'सफ़र का अंत',
    titleEn:     'Signal Clear',
    artist:      'Ram Radio',
    album:       'AFTER THE LAST TRAIN',
    location:    'रेलवे केबिन · 2006',
    duration:    340,
    genre:       'Transit / Ambient',
    mood:        'अंतिम प्रस्थान',
  },
  {
    id:          'mg-04',
    title:       'सुबह तीन बजे',
    titleEn:     'Three A.M.',
    artist:      'Ram Radio',
    album:       'MIDNIGHT GULLY',
    location:    'चाय की दुकान का कोना · 1998',
    duration:    312,
    genre:       'Nocturnal / Street',
    mood:        'लालटेन की रोशनी',
  },
]

export const HIDDEN_GEMS = [
  {
    id:          'gem-1',
    title:       'चौबारे की खिड़की (Reel Extract)',
    titleEn:     'The Courtyard (Reel Extract)',
    artist:      'Unknown Street Trio',
    album:       'Lost Tape 04',
    year:        '1992',
    duration:    210,
    quote:       '"चौबारे की खुली खिड़की से दर्ज की गई धुन। पीछे रात में चमेली के फूल बेचने वाले की आवाज़ साफ सुनाई देती है।"',
  },
  {
    id:          'gem-2',
    title:       'प्लेटफॉर्म 4 की सरसराहट',
    titleEn:     'Platform 4 Hiss',
    artist:      'Station Master Archive',
    album:       'Railway Nights',
    year:        '2006',
    duration:    188,
    quote:       '"रात 3:15 बजे खड़े डीजल इंजन के सामने चाय की केतली की सीटी की गूंज।"',
  },
  {
    id:          'gem-3',
    title:       'आम का मौसम (Unreleased Take)',
    titleEn:     'Mango Season (Unreleased Take)',
    artist:      'The Gully Ensemble',
    album:       'Summer Tapes',
    year:        '1998',
    duration:    255,
    quote:       '"दोपहर में जब बिजली चली जाती थी, उस तपती हवा में बजाया गया एक मासूम सितार राग।"',
  },
]

export function resolveDiscoverTrack(track) {
  const match = allPlayable.find((t) => t.id === track.id)
  if (match) return match

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
