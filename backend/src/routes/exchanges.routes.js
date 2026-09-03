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
import { createReviewSchema } from '../validators/validator.js'

const router = Router()

router.patch('/:id/complete',authenticate,completeExchangeC)
router.patch('/:id/cancel',authenticate,cancelExchangeC)
router.get('/', authenticate, getExchanges)
router.get('/:id', authenticate, getSingleExchange)
router.post('/:exchangeId/review',authenticate,validate(createReviewSchema),createReviewController)

export default router