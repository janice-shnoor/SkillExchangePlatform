import express from 'express'

import authRoutes from './auth.routes.js'
import adminRoutes from './admin.routes.js'
import profileRoutes from './profile.routes.js'
import discoverRoutes from './discover.routes.js'
import exchangeRequestRoutes from './exchangeRequests.routes.js'
import exchangeRoutes from './exchanges.routes.js'
import messageRoutes from './message.routes.js'

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
router.use('/discover', discoverRoutes)
router.use('/exchange-requests', exchangeRequestRoutes)
router.use('/exchange', exchangeRoutes)
router.use('/message',messageRoutes)

export default router