import { Router } from 'express'
import { loginUser, registerUser, getUserProfile } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', requireAuth, getUserProfile)

export default router
