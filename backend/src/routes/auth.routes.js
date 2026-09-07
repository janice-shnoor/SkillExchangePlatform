import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'

import {
  register,
  login,
  currUser,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'

import { validate } from '../middleware/validate.js'

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js'

const router = Router()

router.post('/register',validate(registerSchema), register)
router.post('/login',validate(loginSchema),login)
router.post('/forgot-password',validate(forgotPasswordSchema),forgotPassword)
router.post('/reset-password',validate(resetPasswordSchema),resetPassword)
router.get('/currUser',authenticate,currUser)
router.post('/logout',logout)
router.patch('/change-password',authenticate,validate(changePasswordSchema),changePassword)

export default router