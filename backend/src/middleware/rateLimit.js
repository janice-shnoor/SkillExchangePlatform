import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: 'draft-8',
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
})