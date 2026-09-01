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

const router = Router()

router.post('/', authenticate, createRequest)
router.get('/received', authenticate, getReceived)
router.get('/sent', authenticate, getSent)
router.patch('/:id/accept', authenticate, acceptRequest)
router.patch('/:id/reject', authenticate, rejectRequest)
router.patch('/:id/cancel', authenticate, cancelRequest)

export default router