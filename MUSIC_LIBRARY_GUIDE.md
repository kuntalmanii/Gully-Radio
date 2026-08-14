# 🎵 Gully Radio — Music Library Management Guide

Add and manage your own songs in **under 2 minutes** without modifying player or audio engine code.

---

## 📁 1. Where to Place Files

```
gully-radio/
└── frontend/
    └── public/
        ├── audio/
        │   ├── my-song.mp3             <-- Put your MP3 audio files here
        │   └── midnight-drive.mp3
        └── assets/
            └── album-art/
                ├── my-song-cover.jpg    <-- Put your album cover images here
                └── midnight-drive.jpg
```

> **Note:** Audio and image files in `frontend/public/` are served statically at root paths (e.g. `/audio/my-song.mp3` and `/assets/album-art/my-song-cover.jpg`).

---

## 📝 2. Adding a Song to the Library

Open [`frontend/src/data/musicLibrary.js`](file:///Users/manishkuntal/Desktop/Music%20website%20/gully-radio/frontend/src/data/musicLibrary.js) and add your track object into the `TRACKS` array:

```javascript
{
  id:            'track-101',                     // Unique ID (e.g. 'track-014', 'track-101')
  title:         'Kesariya (Acoustic)',          // Hindi / Devanagari or English Title
  titleEn:       'Kesariya',                     // English Title for search
  artist:        'Arijit Singh',                 // Artist Name
  album:         'Brahmastra Sessions',          // Album Name
  cover:         '/assets/album-art/kesariya.jpg',// Cover image path (or null for default reel)
  audioUrl:      '/audio/kesariya.mp3',           // Audio path in public/audio/ (or null for synth)
  duration:      268,                            // Duration in SECONDS (4:28)
  genre:         'Indie',                        // 'Indie' | 'Chill' | 'Ambient' | 'Instrumental'
  year:          2026,                           // Release Year
  mood:          'Late Night',                   // 'Late Night' | 'Chill' | 'Nostalgic'
  language:      'Hindi',                        // 'Hindi' | 'Punjabi' | 'English' | 'Instrumental'
  description:   'आधी रात की तन्हाई में गिटार और सुरीली आवाज़।',
  featured:      true,                           // true | false (appears in Featured Spotlight)
  recentlyAdded: true,                           // true | false (appears in Recently Added)
  trending:      true,                           // true | false (appears in Trending)
},
```

---

## 📼 3. Assigning Songs to a Mixtape

In [`frontend/src/data/musicLibrary.js`](file:///Users/manishkuntal/Desktop/Music%20website%20/gully-radio/frontend/src/data/musicLibrary.js), find the `MIXTAPES` array and simply add your track's ID to `trackIds`:

```javascript
{
  id:          'mixtape-midnight-gully',
  title:       'आधी रात की गली',
  // Simply add your track ID here:
  trackIds:    ['track-001', 'track-002', 'track-101'],
}
```

The song will automatically appear on the mixtape's tracklist and in the Cassette Shop!

---

## 🎨 4. Creating a New Mixtape

To create a new mixtape, add an entry to `MIXTAPES` in [`frontend/src/data/musicLibrary.js`](file:///Users/manishkuntal/Desktop/Music%20website%20/gully-radio/frontend/src/data/musicLibrary.js):

```javascript
{
  id:          'mixtape-monsoon-drive',
  shortId:     'md',
  slug:        'monsoon-drive',
  title:       'मानसून ड्राइव',
  titleEn:     'MONSOON DRIVE',
  curator:     'आपका नाम',
  year:        '2026',
  genre:       'Roadtrip / Lo-Fi',
  theme:       { shell: '#121c18', label: '#1c3028', stripe: '#2e5848', accent: '#48a880', text: '#d0f0e0', screw: '#1a2e26' },
  description: 'पहाड़ी रास्तों पर भीगी हवा और संगीत का सुकून।',
  labelArt:    'lines', // 'grid' | 'lines' | 'circles' | 'dots' | 'diagonal' | 'line'
  trackIds:    ['track-003', 'track-009', 'track-101'],
}
```

---

## ❤️ 5. How Favorites & Recent History Work

- **Favorites:** Click the heart icon (♡) on any track row. Stored in browser `localStorage` (`gully_radio_favorites`).
- **Recently Played:** Automatically recorded on playback (capped at 20 tracks, deduplicated).
- **Playback Queue:** Add any track to queue (+ button) or play next from the Library or any section.
