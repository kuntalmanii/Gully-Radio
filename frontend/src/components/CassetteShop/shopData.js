/**
 * shopData.js
 * ──────────────────────────────────────────────────────────────
 * Six authentic mixtapes for the Gully Radio Cassette Shop.
 * Every track is backed by procedural lo-fi audio generation.
 */

import { generateTrackAudioUrl } from '../../services/audioGenerator'


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
    tracks: [
      { id: 'track-heer', title: 'हीर (Heer)',    artist: 'Ali Raza Shjr', duration: 251, audioUrl: '/audio/Heer_-_Ali_Raza_Shjr_Lyrics.mp3' },
      { id: 'mg-01', title: 'रात के मुसाफ़िर',    artist: 'Ram Radio', duration: 243 },
      { id: 'mg-02', title: 'नियॉन गली',         artist: 'Ram Radio', duration: 198 },
      { id: 'mg-03', title: 'अंतिम चाय की दुकान', artist: 'Ram Radio', duration: 274 },
      { id: 'mg-04', title: 'सुबह तीन बजे',      artist: 'Ram Radio', duration: 312 },
      { id: 'mg-05', title: 'रेडियो स्टैटिक',    artist: 'Ram Radio', duration: 187 },
      { id: 'mg-06', title: 'सवेरे की धूप',       artist: 'Ram Radio', duration: 256 },
    ],

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
    tracks: [
      { id: 'cr-01', title: 'बारिश का पहला दिन', artist: 'Ram Radio', duration: 220 },
      { id: 'cr-02', title: 'ख़ुमार',            artist: 'Ram Radio', duration: 285 },
      { id: 'cr-03', title: 'गरम चाय',          artist: 'Ram Radio', duration: 198 },
      { id: 'cr-04', title: 'खिड़की की सीट',     artist: 'Ram Radio', duration: 240 },
      { id: 'cr-05', title: 'ठहरा हुआ पहर',      artist: 'Ram Radio', duration: 310 },
    ],
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
    description: 'चारदीवारी वाले शहर की तंग गलियों में दर्ज आवाज़ें। मंदिर की घंटियाँ, अज़ान और रात में चमेली का इत्र बेचने वाला।',
    descriptionEn: 'Recorded in the narrow lanes of a walled city. The azaan, temple bells, and night jasmine.',
    labelArt:    'circles',
    tracks: [
      { id: 'oc-01', title: 'पुरानी हवेली',      artist: 'Ram Radio', duration: 267 },
      { id: 'oc-02', title: 'चमेली का इत्र',     artist: 'Ram Radio', duration: 198 },
      { id: 'oc-03', title: 'चिराग और साया',    artist: 'Ram Radio', duration: 344 },
      { id: 'oc-04', title: 'चौबारे की हवा',     artist: 'Ram Radio', duration: 230 },
      { id: 'oc-05', title: 'शाम का राग',       artist: 'Ram Radio', duration: 286 },
      { id: 'oc-06', title: 'अंधेरे की धुन',      artist: 'Ram Radio', duration: 378 },
    ],
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
    tracks: [
      { id: 's98-01', title: 'दूरदर्शन',          artist: 'Ram Radio', duration: 212 },
      { id: 's98-02', title: 'आम का मौसम',       artist: 'Ram Radio', duration: 245 },
      { id: 's98-03', title: 'पड़ोस का ट्रांजिस्टर', artist: 'Ram Radio', duration: 198 },
      { id: 's98-04', title: 'दोपहर की नींद',      artist: 'Ram Radio', duration: 420 },
      { id: 's98-05', title: 'गली का क्रिकेट',     artist: 'Ram Radio', duration: 267 },
    ],
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
    tracks: [
      { id: 'lns-01', title: 'पहला ख़त',         artist: 'Ram Radio', duration: 234 },
      { id: 'lns-02', title: 'तेरी आहट',         artist: 'Ram Radio', duration: 298 },
      { id: 'lns-03', title: 'काट दिए लफ़्ज़',    artist: 'Ram Radio', duration: 187 },
      { id: 'lns-04', title: 'लिफ़ाफ़े में क़ैद', artist: 'Ram Radio', duration: 356 },
      { id: 'lns-05', title: 'आख़िरी लाइन',      artist: 'Ram Radio', duration: 210 },
      { id: 'lns-06', title: 'राख की धुन',       artist: 'Ram Radio', duration: 285 },
    ],
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
    tracks: [
      { id: 'alt-01', title: 'प्लेटफॉर्म 4',      artist: 'Ram Radio', duration: 198 },
      { id: 'alt-02', title: 'खाली डिब्बे',       artist: 'Ram Radio', duration: 245 },
      { id: 'alt-03', title: 'सिग्नल की बत्ती',   artist: 'Ram Radio', duration: 312 },
      { id: 'alt-04', title: 'जंक्शन की रात',     artist: 'Ram Radio', duration: 276 },
      { id: 'alt-05', title: 'सफ़र का अंत',       artist: 'Ram Radio', duration: 340 },
    ],
  },
]

/** Return tracks for a mixtape with genuine playable audio URLs */
export function getMixtapeQueue(mixtapeId) {
  const mix = MIXTAPES.find((m) => m.id === mixtapeId)
  if (!mix) return []
  return mix.tracks.map((t) => ({
    ...t,
    album:    mix.title,
    album_id: mix.id,
    cover:    null,
    genre:    mix.genre,
    audioUrl: generateTrackAudioUrl(t.id, mix.genre),
    side:     undefined,
    num:      undefined,
  }))
}

export function getMixtapeById(id) { return MIXTAPES.find((m) => m.id === id) }
