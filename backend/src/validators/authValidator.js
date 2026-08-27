import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(100),
  }),

  params: z.object({}),
  query: z.object({}),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
  params: z.object({}),
  query: z.object({}),
})