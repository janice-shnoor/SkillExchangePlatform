import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import { apiLimiter } from './middleware/rateLimit.js'
import routes from './routes/index.js'
import { errorHandler } from './utils/errors.js'
import cookieParser from 'cookie-parser'

export const app = express()

app.use(helmet())

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map(x => x.trim()),
    credentials: true,
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(apiLimiter)

app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    service: env.APP_NAME
  })
)

app.use('/api', routes)

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
)

app.use(errorHandler)