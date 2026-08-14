/**
 * models/mixtapesData.js
 * ──────────────────────────────────────────────────────────────
 * In-memory repository for the six Gully Radio signature mixtapes.
 * Uses trackIds referencing tracksData.js.
 */

const MIXTAPES = [
  {
    id: 'mixtape-midnight-gully',
    shortId: 'mg',
    slug: 'midnight-gully',
    title: 'MIDNIGHT GULLY',
    curator: 'Rohan M.',
    year: 1998,
    genre: 'Nocturnal / Street',
    description: 'Late nights in lanes that never sleep. The hiss of a radio, the last chai stall still burning its lantern.',
    trackIds: ['track-heer'],
  },
  {
    id: 'mixtape-chai-and-rain',
    shortId: 'cr',
    slug: 'chai-and-rain',
    title: 'CHAI & RAIN',
    curator: 'Priya K.',
    year: 2001,
    genre: 'Monsoon / Slow',
    description: 'Monsoon afternoons with nowhere to be. Warm cups, wet pavements, and the smell of petrichor on hot stone.',
    trackIds: ['track-heer'],
  },
  {
    id: 'mixtape-old-city-nights',
    shortId: 'oc',
    slug: 'old-city-nights',
    title: 'OLD CITY NIGHTS',
    curator: 'Vikram S.',
    year: 1995,
    genre: 'Heritage / Deep Cut',
    description: 'Recorded in the narrow lanes of a walled city. The azaan, the temple bells, and the man who sells jasmine after dark.',
    trackIds: ['track-heer'],
  },
  {
    id: 'mixtape-sunday-1998',
    shortId: 's98',
    slug: 'sunday-1998',
    title: 'SUNDAY 1998',
    curator: 'Ananya R.',
    year: 1998,
    genre: 'Nostalgia / Easy',
    description: 'A Sunday that lasted a whole decade. Doordarshan static, mango season, and neighbourhood FM.',
    trackIds: ['track-heer'],
  },
  {
    id: 'mixtape-letters-never-sent',
    shortId: 'lns',
    slug: 'letters-never-sent',
    title: 'LETTERS NEVER SENT',
    curator: 'Dev P.',
    year: 2003,
    genre: 'Intimate / Melancholic',
    description: 'For every unsent letter and unmade phone call. Recorded in a single winter night.',
    trackIds: ['track-heer'],
  },
  {
    id: 'mixtape-after-the-last-train',
    shortId: 'alt',
    slug: 'after-the-last-train',
    title: 'AFTER THE LAST TRAIN',
    curator: 'Meera J.',
    year: 2006,
    genre: 'Transit / Ambient',
    description: 'The platform after the last service. Station lights humming. The city going quiet.',
    trackIds: ['track-heer'],
  },
]

module.exports = MIXTAPES
