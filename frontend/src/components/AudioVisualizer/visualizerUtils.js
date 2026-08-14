/**
 * visualizerUtils.js
 * ──────────────────────────────────────────────────────────────
 * Mathematical frequency band analysis & analog canvas renderers.
 *
 * Frequency Mapping:
 *  - Bass:           Low frequencies (20–250 Hz) -> Environmental pulse & depth
 *  - Mid:            Mid frequencies (250–4000 Hz) -> Waveform & tape movement
 *  - High:           High frequencies (4000–16000 Hz) -> Fine particles & sparkle
 *  - Amplitude:      Total energy -> Glow intensity & grain modulation
 *
 * Modes:
 *  1. ANALOG WAVE    - Oscilloscope tape ribbon with phosphor glow
 *  2. CASSETTE PULSE - Concentric magnetic sound rings & rotating reel hubs
 *  3. FILM GRAIN     - Amplitude-reactive organic film grain & color warmth
 *  4. PARTICLES      - Atmospheric embers & dust energized by highs/mids
 *  5. SOUND FIELD    - Deep perspective undulating audio field
 */

/* ── Frequency band analysis ──────────────────────────────────── */
export function getFrequencyBands(freqData) {
  if (!freqData || freqData.length === 0) {
    return { bass: 0, mid: 0, high: 0, amplitude: 0, isSilent: true }
  }

  const len = freqData.length
  const bassEnd = Math.floor(len * 0.12)
  const midEnd  = Math.floor(len * 0.55)

  let bassSum = 0, midSum = 0, highSum = 0, totalSum = 0

  for (let i = 0; i < len; i++) {
    const val = freqData[i] / 255
    totalSum += val

    if (i < bassEnd) {
      bassSum += val
    } else if (i < midEnd) {
      midSum += val
    } else {
      highSum += val
    }
  }

  const bassCount = bassEnd || 1
  const midCount  = (midEnd - bassEnd) || 1
  const highCount = (len - midEnd) || 1

  const bass = Math.min(1, (bassSum / bassCount) * 1.6)
  const mid  = Math.min(1, (midSum / midCount) * 1.4)
  const high = Math.min(1, (highSum / highCount) * 1.8)
  const amplitude = Math.min(1, totalSum / len)

  return {
    bass,
    mid,
    high,
    amplitude,
    isSilent: totalSum < 0.005,
  }
}

/* ── Mode 1: Analog Wave ───────────────────────────────────────── */
export function renderAnalogWave(ctx, width, height, timeData, bands, time) {
  const centerY = height * 0.5
  const bassBoost = 1 + bands.bass * 0.5
  const midWave   = bands.mid * 28

  ctx.save()

  // Background subtle phosphor glow
  const grad = ctx.createRadialGradient(
    width * 0.5, centerY, 10,
    width * 0.5, centerY, width * 0.45
  )
  grad.addColorStop(0, `rgba(215, 178, 122, ${0.08 * bands.amplitude})`)
  grad.addColorStop(0.6, `rgba(168, 79, 53, ${0.03 * bands.amplitude})`)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Primary Oscilloscope Line
  ctx.beginPath()
  const sliceWidth = width / (timeData.length - 1)
  let x = 0

  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    const harmonic = Math.sin(i * 0.05 + time * 3) * midWave * (i / timeData.length)
    const y = centerY + (v * height * 0.28 * bassBoost) + harmonic

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
    x += sliceWidth
  }

  ctx.strokeStyle = `rgba(215, 178, 122, ${0.5 + bands.amplitude * 0.5})`
  ctx.lineWidth = 2.2
  ctx.shadowColor = '#D7B27A'
  ctx.shadowBlur = 12 * (1 + bands.high)
  ctx.stroke()

  // Secondary Warm Terracotta Ghost Wave
  ctx.beginPath()
  x = 0
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    const harmonic = Math.cos(i * 0.04 - time * 2) * (midWave * 0.7)
    const y = centerY + (v * height * 0.2 * bassBoost) + harmonic + 3

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
    x += sliceWidth
  }

  ctx.strokeStyle = `rgba(197, 106, 62, ${0.35 * bands.amplitude + 0.15})`
  ctx.lineWidth = 1.2
  ctx.shadowBlur = 6
  ctx.shadowColor = '#C56A3E'
  ctx.stroke()

  ctx.restore()
}

/* ── Mode 2: Cassette Pulse ────────────────────────────────────── */
export function renderCassettePulse(ctx, width, height, bands, time) {
  const cx = width * 0.5
  const cy = height * 0.5
  const maxRadius = Math.min(width, height) * 0.38

  ctx.save()

  // Rotating Reel Hubs
  const reelDistance = maxRadius * 0.75
  const leftReelX  = cx - reelDistance * 0.5
  const rightReelX = cx + reelDistance * 0.5
  const reelRadius = 24 + bands.bass * 8

  // Connecting Tape Line
  ctx.beginPath()
  ctx.moveTo(leftReelX, cy + reelRadius)
  ctx.lineTo(rightReelX, cy + reelRadius)
  ctx.strokeStyle = `rgba(215, 178, 122, ${0.3 + bands.mid * 0.4})`
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Expanding Magnetic Sound Rings
  const ringCount = 4
  for (let i = 0; i < ringCount; i++) {
    const progress = ((time * 0.6 + i / ringCount) % 1)
    const radius = reelRadius + progress * maxRadius
    const alpha = (1 - progress) * (0.35 + bands.bass * 0.45) * bands.amplitude

    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(215, 178, 122, ${alpha})`
    ctx.lineWidth = 1 + bands.mid * 2
    ctx.stroke()
  }

  // Left Reel
  drawReelHub(ctx, leftReelX, cy, reelRadius, time * 2, bands)
  // Right Reel (spinning slightly different rate for organic reel feel)
  drawReelHub(ctx, rightReelX, cy, reelRadius, -time * 1.8, bands)

  ctx.restore()
}

function drawReelHub(ctx, x, y, r, angle, bands) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  // Outer rim
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(215, 178, 122, ${0.6 + bands.bass * 0.4})`
  ctx.lineWidth = 2
  ctx.shadowColor = '#D7B27A'
  ctx.shadowBlur = 8 * bands.bass
  ctx.stroke()

  // Inner 3 teeth
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(a) * (r * 0.75), Math.sin(a) * (r * 0.75))
    ctx.strokeStyle = 'rgba(215, 178, 122, 0.4)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  // Center hole
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2)
  ctx.fillStyle = '#171512'
  ctx.fill()
  ctx.strokeStyle = 'rgba(215, 178, 122, 0.5)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.restore()
}

/* ── Mode 3: Film Grain ────────────────────────────────────────── */
export function renderFilmGrain(ctx, width, height, bands, time) {
  ctx.save()

  // Audio-reactive warm chromatic dispersion vignette
  const bassGlow = bands.bass * 0.25
  const grad = ctx.createRadialGradient(
    width * 0.5, height * 0.5, 0,
    width * 0.5, height * 0.5, Math.max(width, height) * 0.6
  )
  grad.addColorStop(0, `rgba(215, 178, 122, ${0.04 + bassGlow * 0.1})`)
  grad.addColorStop(0.5, `rgba(168, 79, 53, ${0.06 + bassGlow * 0.15})`)
  grad.addColorStop(1, `rgba(18, 14, 11, ${0.35 + bands.amplitude * 0.3})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Dynamic analog grain dots
  const dotCount = Math.floor(60 + bands.high * 140)
  ctx.fillStyle = `rgba(242, 229, 204, ${0.08 + bands.high * 0.12})`

  for (let i = 0; i < dotCount; i++) {
    const gx = (Math.sin(i * 99 + time * 10) * 0.5 + 0.5) * width
    const gy = (Math.cos(i * 33 + time * 12) * 0.5 + 0.5) * height
    const size = Math.random() * (1.5 + bands.high * 1.5)
    ctx.fillRect(gx, gy, size, size)
  }

  // Subtle tape scanlines
  ctx.fillStyle = `rgba(215, 178, 122, ${0.02 + bands.mid * 0.03})`
  const scanStep = 8
  for (let y = (time * 15) % scanStep; y < height; y += scanStep) {
    ctx.fillRect(0, y, width, 1)
  }

  ctx.restore()
}

/* ── Mode 4: Atmospheric Particles ─────────────────────────────── */
export function initParticleSystem(count = 45) {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 0.8 + Math.random() * 2.2,
    baseSpeedY: 0.0004 + Math.random() * 0.0012,
    baseSpeedX: (Math.random() - 0.5) * 0.0006,
    opacity: 0.2 + Math.random() * 0.5,
    seed: Math.random() * 100,
  }))
}

export function renderParticles(ctx, width, height, bands, time, particles) {
  if (!particles) return
  ctx.save()

  const speedBoost = 1 + bands.mid * 2.5
  const glowBoost  = 1 + bands.high * 3

  for (const p of particles) {
    p.y -= p.baseSpeedY * speedBoost
    p.x += p.baseSpeedX + Math.sin(time * 2 + p.seed) * 0.0004 * (1 + bands.bass)

    if (p.y < -0.05) p.y = 1.05
    if (p.x < -0.05) p.x = 1.05
    if (p.x > 1.05)  p.x = -0.05

    const px = p.x * width
    const py = p.y * height
    const currentSize = p.size * (1 + bands.high * 0.8)
    const currentAlpha = Math.min(1, p.opacity * (0.4 + bands.amplitude * 0.6))

    ctx.beginPath()
    ctx.arc(px, py, currentSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(215, 178, 122, ${currentAlpha})`
    ctx.shadowColor = '#D7B27A'
    ctx.shadowBlur = 4 * glowBoost
    ctx.fill()
  }

  ctx.restore()
}

/* ── Mode 5: Sound Field ───────────────────────────────────────── */
export function renderSoundField(ctx, width, height, bands, time) {
  ctx.save()

  const rows = 12
  const cols = 20
  const cellW = width / cols
  const horizonY = height * 0.4
  const bassPulse = bands.bass * 24

  ctx.strokeStyle = `rgba(215, 178, 122, ${0.12 + bands.mid * 0.25})`
  ctx.lineWidth = 1

  for (let r = 0; r < rows; r++) {
    const rowProgress = r / rows
    const yBase = horizonY + Math.pow(rowProgress, 1.8) * (height - horizonY)
    const waveAmp = (1 - rowProgress * 0.5) * (bands.mid * 20 + bassPulse)


    ctx.beginPath()
    for (let c = 0; c <= cols; c++) {
      const x = c * cellW
      const wave = Math.sin(c * 0.4 + time * 2.5 + r) * waveAmp
      const y = yBase + wave

      if (c === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
  }

  // Atmospheric horizon glow
  const grad = ctx.createRadialGradient(
    width * 0.5, horizonY, 5,
    width * 0.5, horizonY, width * 0.6
  )
  grad.addColorStop(0, `rgba(197, 106, 62, ${0.15 * bands.amplitude})`)
  grad.addColorStop(0.5, `rgba(215, 178, 122, ${0.05 * bands.amplitude})`)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  ctx.restore()
}
