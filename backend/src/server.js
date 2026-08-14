/**
 * server.js
 * ──────────────────────────────────────────────────────────────
 * Gully Radio — Hardened Express API Server
 */

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const config = require('./config')
const routes = require('./routes')
const { rateLimiter, notFoundHandler, errorHandler } = require('./middleware')

const app = express()

/* ── Hardened Security Headers via Helmet ─────────────────────── */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        mediaSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows audio elements to stream assets
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true,
  })
)

/* ── CORS Security ────────────────────────────────────────────── */
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin) || (config.isDev && origin.startsWith('http://localhost:'))) {
        return callback(null, true)
      }

      callback(new Error('Cross-Origin Request Blocked by CORS policy'))
    },
    methods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
  })
)

/* ── Payload Size Limits (DoS Mitigation) ─────────────────────── */
app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: true, limit: '20kb' }))

/* ── Request Logging ──────────────────────────────────────────── */
if (config.isDev) {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

/* ── Rate Limiting ────────────────────────────────────────────── */
app.use('/api', rateLimiter)

/* ── API Routes ───────────────────────────────────────────────── */
app.use('/api', routes)

/* ── 404 Not Found Handling ───────────────────────────────────── */
app.use(notFoundHandler)

/* ── Centralized Error Handling ───────────────────────────────── */
app.use(errorHandler)

/* ── Server Startup ───────────────────────────────────────────── */
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.port, () => {
    console.log(`\n📻 Gully Radio API Server is running securely on port ${config.port}`)
    console.log(`📡 Health Check:  http://localhost:${config.port}/api/health`)
    console.log(`🎵 Tracks API:    http://localhost:${config.port}/api/tracks`)
    console.log(`📼 Mixtapes API:  http://localhost:${config.port}/api/mixtapes`)
    console.log(`🔍 Search API:    http://localhost:${config.port}/api/search?q=gully\n`)
  })

  // Graceful shutdown handling
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`)
    server.close(() => {
      console.log('Server closed. Exiting process.')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

module.exports = app
