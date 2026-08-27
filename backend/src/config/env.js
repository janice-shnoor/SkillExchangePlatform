import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(200),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(20),
  APP_NAME: z.string().default('Skill Exchange API'),
  APP_URL: z.string().default('http://localhost:5000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.string().default('info')
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}
export const env = parsed.data