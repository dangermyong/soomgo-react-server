const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

// import routes
const authRoutes = require('./routes/auth')
const searchRoutes = require('./routes/search')
const requestsRoutes = require('./routes/requests')
const profileRoutes = require('./routes/profile')

// app
const app = express()

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors({
  origin: 'http://soomgo-react-server.com.s3-website.ap-northeast-2.amazonaws.com',
  credentials: true,
}))

app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header("Access-Control-Allow-Origin", "http://soomgo-react-server.com.s3-website.ap-northeast-2.amazonaws.com");
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

//routes middleware
app.use('/api/search', searchRoutes)
app.use('/api/requests', requestsRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api', authRoutes)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})