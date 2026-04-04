const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
// Load backend/.env even when nodemon runs from repo root (cwd is not backend/)
require('dotenv').config({ path: path.join(__dirname, '../.env') })
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
app.use(cors(
    {
        origin: true,
        credentials: true,
    }
))
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
