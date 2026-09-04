import express from 'express'

import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { 
  updateUserSchema,
  createSkillSchema,
  updateSkillSchema,
  resourceIdSchema,
} from '../validators/validator.js'

import {
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/userController.js'

import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js'

const router = express.Router()

router.get('/users', authenticate, authorize('ADMIN'),getUsers)
router.patch('/users/:id',authenticate, authorize('ADMIN'),validate(updateUserSchema),updateUser)
router.delete('/users/:id',authenticate,authorize('ADMIN'),validate(resourceIdSchema),deleteUser)
router.get('/skills',authenticate,authorize('ADMIN'),getSkills)
router.post('/skills',authenticate,authorize('ADMIN'),validate(createSkillSchema),createSkill)
router.patch('/skills/:id',authenticate,authorize('ADMIN'),validate(updateSkillSchema),updateSkill)
router.delete('/skills/:id',authenticate,authorize('ADMIN'),validate(resourceIdSchema),deleteSkill)

export default router