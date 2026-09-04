import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

import {
  getExchanges,
  getSingleExchange,
  completeExchangeC,
  cancelExchangeC,
} from '../controllers/exchangeController.js'
import { createReviewController } from '../controllers/reviewController.js'
import { 
  createReviewSchema, 
  resourceIdSchema,
} from '../validators/validator.js'

const router = Router()

router.patch('/:id/complete',authenticate, validate(resourceIdSchema), completeExchangeC)
router.patch('/:id/cancel',authenticate,validate(resourceIdSchema), cancelExchangeC)
router.get('/', authenticate, getExchanges)
router.get('/:id', authenticate, validate(resourceIdSchema), getSingleExchange)
router.post('/:exchangeId/review',authenticate,validate(createReviewSchema),createReviewController)

export default router