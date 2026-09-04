import { z } from 'zod'

export const nameSchema = z.string().trim()
    .min(1,'Name is required')
    .max(80,'Name cannot exceed 80 characters')

export const usernameSchema = z.string().trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/,'Username can contain only letters, digits and underscores')

export const emailSchema = z.string().trim()
    .min(1,'Email is required')
    .max(160, 'Email cannot exceed 160 characters')
    .email('Invalid email address')

export const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^\S+$/, 'Password cannot contain spaces')
    .regex(/[A-Z]/,'Password must contain at least one uppercase letter')
    .regex(/[a-z]/,'Password must contain at least one lowercase letter')
    .regex(/[!@#$%^&_]/,'Password must include at least one special character (! @ # $ % ^ & _)')

export const skillNameSchema = z
  .string()
  .trim()
  .min(1, 'Skill name is required')
  .max(80, 'Skill name cannot exceed 80 characters')

export const skillDescriptionSchema = z
  .string()
  .trim()
  .max(500, 'Skill description cannot exceed 500 characters')
  .optional()