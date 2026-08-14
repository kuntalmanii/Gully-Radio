'use strict'

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

// ─── App ─────────────────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 5001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// ─── Security ────────────────────────────────────────────────────
app.use(helmet())

// ─── CORS ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// ─── Logging ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ─── Body Parsers ────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Static — Uploads ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// ─── Routes ──────────────────────────────────────────────────────
// Health check — always first
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'gully-radio-backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: PORT,
  })
})

// Placeholder: future routes will be mounted here
// e.g. app.use('/api/tracks', require('./routes/tracks'))

// ─── 404 Handler ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global Error Handler ────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  })
})

// ─── Start ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎙️  Gully Radio Backend`)
  console.log(`   ➜  Listening on  http://localhost:${PORT}`)
  console.log(`   ➜  Health check  http://localhost:${PORT}/api/health`)
  console.log(`   ➜  CORS origin   ${FRONTEND_URL}`)
  console.log(`   ➜  Environment   ${process.env.NODE_ENV}\n`)
})

module.exports = app
