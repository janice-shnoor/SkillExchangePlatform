import { Router } from 'express'

import { authenticate } from '../middleware/auth.js'

import {
  createRequest,
  getReceived,
  getSent,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} from '../controllers/exchangeRequestController.js'

import { validate } from '../middleware/validate.js'

import {
  createExchangeRequestSchema,
  resourceIdSchema,
} from '../validators/validator.js'

const router = Router()

router.post('/', authenticate, validate(createExchangeRequestSchema), createRequest)
router.get('/received', authenticate, getReceived)
router.get('/sent', authenticate, getSent)
router.patch('/:id/accept', authenticate, validate(resourceIdSchema), acceptRequest)
router.patch('/:id/reject', authenticate, validate(resourceIdSchema), rejectRequest)
router.patch('/:id/cancel', authenticate, validate(resourceIdSchema), cancelRequest)

export default router