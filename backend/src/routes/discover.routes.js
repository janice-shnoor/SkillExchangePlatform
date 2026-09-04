import { Router } from 'express'

import { authenticate } from '../middleware/auth.js'
import { searchUsers,getRecommendations, } from '../controllers/discoverController.js'

const router = Router()

router.get('/search',authenticate,searchUsers)
router.get('/recommendations',authenticate,getRecommendations)

export default router