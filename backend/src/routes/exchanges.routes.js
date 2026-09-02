import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getExchanges,
  getSingleExchange,
} from '../controllers/exchangeController.js'

const router = Router()

router.get('/', authenticate, getExchanges)
router.get('/:id', authenticate, getSingleExchange)

export default router