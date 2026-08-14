/**
 * server.js
 * ──────────────────────────────────────────────────────────────
 * Gully Radio — Express API Server
 */

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const config = require('./config')
const routes = require('./routes')
const { rateLimiter, notFoundHandler, errorHandler } = require('./middleware')

const app = express()

/* ── Security Middlewares ─────────────────────────────────────── */
app.use(helmet())

// CORS configuration supporting frontend dev & preview origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true)

      const allowedOrigins = [
        config.frontendUrl,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
      ]

      if (allowedOrigins.includes(origin) || config.isDev) {
        return callback(null, true)
      }

      callback(new Error('Cross-Origin Request Blocked by CORS'))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

/* ── Request Parsers & Logging ────────────────────────────────── */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    console.log(`\n📻 Gully Radio API Server is running on port ${config.port}`)
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
