import { z } from 'zod'

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().trim().email().max(160),
  }),

  params: z.object({}),
  query: z.object({}),
})

export const addUserSkillSchema = z.object({
  body: z.object({
    skillId: z.string().uuid(),
    type: z.enum(['OFFERED', 'WANTED']),
    proficiency: z.enum([
      'BEGINNER',
      'INTERMEDIATE',
      'ADVANCED',
      'EXPERT',
    ]).optional(),
  }),

  params: z.object({}),
  query: z.object({}),
})

export const createReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
  }),
})