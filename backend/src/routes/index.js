import express from 'express'

import authRoutes from './auth.routes.js'
import adminRoutes from './admin.routes.js'
import profileRoutes from './profile.routes.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Skill Exchange API'
  })
})

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/profile', profileRoutes)

export default router