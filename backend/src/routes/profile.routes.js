import { Router } from 'express'

import { authenticate } from '../middleware/auth.js'

import {
  getProfile,
  updateProfile,
} from '../controllers/userController.js'

import {
  getOfferedSkills,
  getWantedSkills,
  addUserSkill,
  removeUserSkill,
} from '../controllers/userSkillController.js'

import { getSkills } from '../controllers/skillController.js'

import { validate } from '../middleware/validate.js'

import {
  updateProfileSchema,
  addUserSkillSchema,
} from '../validators/validator.js'

const router = Router()

router.get(
  '/',
  authenticate,
  getProfile
)

router.patch(
  '/',
  authenticate,
  validate(updateProfileSchema),
  updateProfile
)

router.get(
  '/skills/offered',
  authenticate,
  getOfferedSkills
)

router.get(
  '/skills/wanted',
  authenticate,
  getWantedSkills
)

router.post(
  '/skills',
  authenticate,
  validate(addUserSkillSchema),
  addUserSkill
)

router.delete(
  '/skills/:id',
  authenticate,
  removeUserSkill
)

router.get(
  '/skills',
  authenticate,
  getSkills
)

export default router