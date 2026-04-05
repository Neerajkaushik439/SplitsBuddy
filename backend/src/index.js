const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
// Load backend/.env even when nodemon runs from repo root (cwd is not backend/)
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Fail fast on Render if secrets are missing (otherwise signup/login return 500 with opaque errors).
const requiredEnv = ['MONGO_URI', 'JWT_SECRET_KEY']
for (const key of requiredEnv) {
  if (!process.env[key] || String(process.env[key]).trim() === '') {
    console.error(
      `[FATAL] Missing ${key}. Add it in Render → Environment (or backend/.env locally).`
    )
    process.exit(1)
  }
}

const app = express()

// CORS: echo Access-Control-Request-Headers on preflight (axios sends accept + content-type, etc.).
// Without an exact match, browsers block the request. Set ALLOWED_ORIGINS on Render for extra domains.
const defaultOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://127.0.0.1:8080',
  'https://splits-buddy.vercel.app',
]
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const allowedOriginSet = new Set([...defaultOrigins, ...extraOrigins])

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && allowedOriginSet.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Vary', 'Origin')

  const requested = req.headers['access-control-request-headers']
  if (requested) {
    res.setHeader('Access-Control-Allow-Headers', requested)
  } else {
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Accept, X-Requested-With'
    )
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  )
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  next()
})

const port = process.env.PORT || 3001;
const  { connectDB } = require('./config/db')
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoutes");
const groupRoute = require("./routes/groupRoutes");
const friendRoute = require("./routes/friendRoutes");
const groupmemberRoute = require("./routes/groupmemberRoutes");
const expenseRoute = require("./routes/expenseRoutes");
const settleRoute = require("./routes/settleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoute = require("./routes/notificationRoutes");

app.use(cookieParser());
app.use(express.json())

function healthPayload(req, res) {
  const ok = mongoose.connection.readyState === 1
  res.status(ok ? 200 : 503).json({ ok, db: ok ? 'up' : 'down' })
}
// Register early; same paths work after deploy. Use /api/v1/health if a proxy only forwards /api/*
app.get('/health', healthPayload)
app.get('/api/health', healthPayload)
app.get('/api/v1/health', healthPayload)

app.use('/api/v1/auth', authRoute) 
app.use('/api/v1/groups',groupRoute)
app.use('/api/v1/friends',friendRoute)
app.use("/api/v1/groupmembers",groupmemberRoute)
app.use('/api/v1/expenses',expenseRoute);
app.use('/api/v1/settles',settleRoute);

app.use('/api/v1/dashboard',dashboardRoutes);
app.use('/api/v1/notifications', notificationRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function start() {
  await connectDB()
  app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
  })
}

start().catch((err) => {
  console.error('Server failed to start:', err)
  process.exit(1)
})
