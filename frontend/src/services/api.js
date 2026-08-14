/**
 * api.js
 * ──────────────────────────────────────────────────────────────
 * Unified API client communicating with the Express backend.
 *
 * Base URL configured via VITE_API_URL environment variable.
 * Fallbacks cleanly to avoid crashing the frontend if the server is offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

/**
 * Robust JSON fetch wrapper with error handling and timeout.
 * @param {string} endpoint - API path e.g. '/tracks'
 * @param {RequestInit} [options]
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    })

    clearTimeout(timeoutId)

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      const errorMsg = json?.error?.message || `Request failed with status ${res.status}`
      const errorCode = json?.error?.code || 'API_ERROR'
      const err = new Error(errorMsg)
      err.code = errorCode
      err.status = res.status
      throw err
    }

    if (json && json.success === false) {
      const err = new Error(json.error?.message || 'API operation unsuccessful')
      err.code = json.error?.code || 'OPERATION_FAILED'
      throw err
    }

    return json?.data ?? json
  } catch (error) {
    clearTimeout(timeoutId)

    if (error.name === 'AbortError') {
      const timeoutErr = new Error('Connection timed out. Please check your network.')
      timeoutErr.code = 'TIMEOUT'
      throw timeoutErr
    }

    // Network / offline error
    if (!error.code) {
      error.code = 'NETWORK_ERROR'
      error.message = error.message || 'Unable to connect to the Gully Radio audio server.'
    }

    throw error
  }
}

/* ══════════════════════════════════════════════════════════════
   API CLIENT FUNCTIONS
══════════════════════════════════════════════════════════════ */

/**
 * Fetch all tracks with optional filters.
 * @param {Object} [filters] - { genre, side, album }
 * @returns {Promise<{ count: number, tracks: Array }>}
 */
export async function getTracks(filters = {}) {
  const params = new URLSearchParams()
  if (filters.genre) params.append('genre', filters.genre)
  if (filters.side)  params.append('side', filters.side)
  if (filters.album) params.append('album', filters.album)

  const queryStr = params.toString() ? `?${params.toString()}` : ''
  return request(`/tracks${queryStr}`)
}

/**
 * Fetch a single track by its numerical or string ID.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getTrack(id) {
  if (!id) throw new Error('Track ID is required')
  return request(`/tracks/${encodeURIComponent(id)}`)
}

/**
 * Fetch all 6 signature mixtapes.
 * @returns {Promise<{ count: number, mixtapes: Array }>}
 */
export async function getMixtapes() {
  return request('/mixtapes')
}

/**
 * Fetch a single mixtape by ID or slug.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getMixtape(id) {
  if (!id) throw new Error('Mixtape ID is required')
  return request(`/mixtapes/${encodeURIComponent(id)}`)
}

/**
 * Fetch tracks for a specific mixtape.
 * @param {string} id
 * @returns {Promise<{ mixtapeId: string, mixtapeTitle: string, count: number, tracks: Array }>}
 */
export async function getMixtapeTracks(id) {
  if (!id) throw new Error('Mixtape ID is required')
  return request(`/mixtapes/${encodeURIComponent(id)}/tracks`)
}

/**
 * Search tracks and mixtapes by query string.
 * @param {string} query
 * @returns {Promise<{ query: string, totalResults: number, tracks: Array, mixtapes: Array }>}
 */
export async function searchTracks(query) {
  const q = encodeURIComponent(query || '')
  return request(`/search?q=${q}`)
}

/**
 * Check backend API health status.
 */
export async function checkHealth() {
  return request('/health')
}

export default {
  getTracks,
  getTrack,
  getMixtapes,
  getMixtape,
  getMixtapeTracks,
  searchTracks,
  checkHealth,
}
