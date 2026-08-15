/**
 * models/tracksData.js
 * ──────────────────────────────────────────────────────────────
 * Centralized track repository containing only your manually added tracks.
 */

const TRACKS = [
  {
    id: 'track-heer',
    title: 'Heer',
    artist: 'Ali Raza Shjr',
    album: 'Lecture Time Special Archives',
    cover: null,
    audioUrl: '/audio/Heer_-_Ali_Raza_Shjr_Lyrics.mp3',
    duration: 251,
    genre: 'Sufi / Folk',
    year: 2024,
    mood: 'Late Night',
    language: 'Punjabi',
    description: 'Poetic folk masterpiece recorded with acoustic resonance.',
    featured: true,
    recentlyAdded: true,
    trending: true,
  },
]

module.exports = TRACKS
