/**
 * libraryStorage.js
 * ──────────────────────────────────────────────────────────────
 * Safe local storage service for Favorites and Recently Played tracks.
 *
 * Handles:
 *  - Corrupted localStorage recovery
 *  - Capped size (max 20 recently played)
 *  - Event dispatch for reactive UI updates across components
 */

const FAVORITES_KEY = 'gully_radio_favorites'
const RECENTLY_PLAYED_KEY = 'gully_radio_recently_played'
const MAX_RECENT = 20

/* ── Favorites ─────────────────────────────────────────────────── */
export function getFavorites() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.warn('[LibraryStorage] Corrupted favorites cleared:', err.message)
    localStorage.removeItem(FAVORITES_KEY)
    return []
  }
}

export function isFavorite(trackId) {
  if (!trackId) return false
  const favs = getFavorites()
  return favs.includes(String(trackId))
}

export function toggleFavorite(trackId) {
  if (!trackId) return false
  const idStr = String(trackId)
  const favs = getFavorites()
  let next = []

  if (favs.includes(idStr)) {
    next = favs.filter((id) => id !== idStr)
  } else {
    next = [idStr, ...favs]
  }

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('gully:favorites-updated', { detail: next }))
  } catch (err) {
    console.warn('[LibraryStorage] Failed to save favorites:', err.message)
  }

  return next.includes(idStr)
}

/* ── Recently Played (Max 20 tracks) ──────────────────────────── */
export function getRecentlyPlayed() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENTLY_PLAYED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.warn('[LibraryStorage] Corrupted recent tracks cleared:', err.message)
    localStorage.removeItem(RECENTLY_PLAYED_KEY)
    return []
  }
}

export function addRecentlyPlayed(track) {
  if (!track || !track.id) return
  const idStr = String(track.id)
  const current = getRecentlyPlayed()

  // Remove existing instance and prepend to top (LRU order)
  const filtered = current.filter((id) => String(id) !== idStr)
  const next = [idStr, ...filtered].slice(0, MAX_RECENT)

  try {
    localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('gully:recent-updated', { detail: next }))
  } catch (err) {
    console.warn('[LibraryStorage] Failed to save recent tracks:', err.message)
  }
}
