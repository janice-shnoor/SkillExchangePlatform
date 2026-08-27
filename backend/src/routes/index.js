import express from 'express'

import authRoutes from './auth.routes.js'
import usersRoutes from './users.routes.js'
import skillsRoutes from './skills.routes.js'
import exchangeRequestsRoutes from './exchangeRequests.routes.js'
import exchangesRoutes from './exchanges.routes.js'
import conversationsRoutes from './conversations.routes.js'
import messagesRoutes from './messages.routes.js'
import reviewsRoutes from './reviews.routes.js'
import adminRoutes from './admin.routes.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Skill Exchange API'
  })
})

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/skills', skillsRoutes)
router.use('/exchange-requests', exchangeRequestsRoutes)
router.use('/exchanges', exchangesRoutes)
router.use('/conversations', conversationsRoutes)
router.use('/messages', messagesRoutes)
router.use('/reviews', reviewsRoutes)
router.use('/admin', adminRoutes)

export default router