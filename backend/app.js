const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controller/blog')
const userRouter = require('./controller/user')
const loginRouter = require('./controller/login')

const app = express()
const PORT = config.PORT

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)




module.exports = app