import { z } from 'zod'

import {
  nameSchema,
  usernameSchema,
  emailSchema,
  passwordSchema,
} from './validatorFields.js'

export const registerSchema = z.object({
  body: z.object({
    name: nameSchema,
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
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

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
  }),
  params: z.object({}),
  query: z.object({}),
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
  params: z.object({}),
  query: z.object({}),
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordSchema,
  }),
  params: z.object({}),
  query: z.object({}),
})