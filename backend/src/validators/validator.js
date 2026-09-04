import { z } from 'zod'

import {
  nameSchema,
  usernameSchema,
  emailSchema,
  skillNameSchema,
  skillDescriptionSchema,
} from './validatorFields.js'

export const updateProfileSchema = z.object({
  body: z.object({
    name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  }),

  params: z.object({}),
  query: z.object({}),
})

export const updateUserSchema = z.object({
  body: z.object({
    name: nameSchema,
    username: usernameSchema,
    email: emailSchema,
    role: z.enum(['USER', 'ADMIN']),
  }),

  params: z.object({id: z.string().uuid(),}),
  query: z.object({}),
})

export const createSkillSchema = z.object({
  body: z.object({
    name: skillNameSchema,
    description: skillDescriptionSchema,
  }),

  params: z.object({}),
  query: z.object({}),
})

export const updateSkillSchema = z.object({
  body: z.object({
    name: skillNameSchema,
    description: skillDescriptionSchema,
  }),

  params: z.object({
    id: z.string().uuid(),
  }),

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

export const createExchangeRequestSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid('Invalid receiver'),
    senderSkillId: z.string().uuid('Invalid sender skill'),
    receiverSkillId: z.string().uuid('Invalid receiver skill'),
  }),
  params: z.object({}),
  query: z.object({}),
})

export const resourceIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid('Invalid ID'),
  }),
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
  params: z.object({
    exchangeId: z.string().uuid('Invalid exchange'),
  }),
  query: z.object({}),
})

export const sendMessageSchema = z.object({
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, 'Message cannot be empty')
      .max(2000, 'Message cannot exceed 2000 characters'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid exchange'),
  }),
  query: z.object({}),
})