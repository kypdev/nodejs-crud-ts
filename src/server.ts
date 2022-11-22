import express from "express"
import http from 'http'
import mongoose from 'mongoose'
import { config } from './config/config'
import Logging from './library/Logging'
import authorRoutes from './routes/Author'
import bookRoutes from './routes/Book'

const router = express()

/** Connect to MongoDB */
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info('Connected to mongodb')
    StartServer()
  })
  .catch((error) => {
    Logging.error('Unable to connect')
    Logging.error(error)
  })

/** Only start the server if Mongo connect */
const StartServer = () => {
  router.use((req, res, next) => {
    /** Log the request */
    Logging.info(`Incomming -> Method: [${req.method}] - url: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

    res.on('finish', () => {
      /** Log the response */
      Logging.info(`Incomming -> Method: [${req.method}] - url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}]`)
    })

    next()
  })

  router.use(express.urlencoded({ extended: true }))
  router.use(express.json())

  /** Rule of our API */
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
      return res.status(200).json({})
    }

    next()
  })

  /** Routes */
  router.use('/authors', authorRoutes)
  router.use('/book', bookRoutes)

  /** Healthcheck */
  router.get('/ping', (req, res, next) => res.status(200).json({ msg: 'pong' }))

  /** Error handling */
  router.use((req, res, next) => {
    const error = new Error('not found')
    Logging.error(error)

    return res.status(404).json({ msg: error.message })
  })

  http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}.`))
}