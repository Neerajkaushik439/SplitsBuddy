const path = require('path')
const express = require('express')
const cors = require('cors')
// Load backend/.env even when nodemon runs from repo root (cwd is not backend/)
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const app = express()

// CORS: browsers require explicit origins when using credentials (axios withCredentials).
// Set ALLOWED_ORIGINS on Render to comma-separated URLs, e.g. https://splits-buddy.vercel.app
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

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOriginSet.has(origin)) return callback(null, true)
    callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

const port = process.env.PORT || 3001;
const  { connectDB } = require('./config/db')
const cookieParser = require("cookie-parser");
const body = require("body-parser");
const authRoute = require("./routes/authRoutes");
const groupRoute = require("./routes/groupRoutes");
const friendRoute = require("./routes/friendRoutes");
const groupmemberRoute = require("./routes/groupmemberRoutes");
const expenseRoute = require("./routes/expenseRoutes");
const settleRoute = require("./routes/settleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoute = require("./routes/notificationRoutes");

app.use(cookieParser());
connectDB();
app.use(express.json())
app.use(body.json())

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
