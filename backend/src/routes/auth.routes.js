import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'

import {
  register,
  login,
  currUser,
  logout,
} from '../controllers/authController.js'

import { validate } from '../middleware/validate.js'

import {
  registerSchema,
  loginSchema,
} from '../validators/authValidator.js'

const router = Router()

router.post(
  '/register',
  validate(registerSchema),
  register
)

router.post(
  '/login',
  validate(loginSchema),
  login
)

router.get(
  '/currUser',
  authenticate,
  currUser
)

router.post(
  '/logout',
  logout
)

export default router