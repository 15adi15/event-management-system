import { Router } from 'express'
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} from '../controllers/registrationController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()
router.post('/', requireAuth, registerForEvent)
router.get('/', requireAuth, getMyRegistrations)
router.delete('/:id', requireAuth, cancelRegistration)

export default router
