import express from 'express'

import { authenticate, authorize } from '../middleware/auth.js'

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

router.get(
  '/users',
  authenticate,
  authorize('ADMIN'),
  getUsers
)

router.patch(
  '/users/:id',
  authenticate,
  authorize('ADMIN'),
  updateUser
)

router.delete(
  '/users/:id',
  authenticate,
  authorize('ADMIN'),
  deleteUser
)

router.get(
  '/skills',
  authenticate,
  authorize('ADMIN'),
  getSkills
)

router.post(
  '/skills',
  authenticate,
  authorize('ADMIN'),
  createSkill
)

router.patch(
  '/skills/:id',
  authenticate,
  authorize('ADMIN'),
  updateSkill
)

router.delete(
  '/skills/:id',
  authenticate,
  authorize('ADMIN'),
  deleteSkill
)

export default router