import { Router } from 'express'
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()
router.get('/', getEvents)
router.get('/:id', getEvent)
router.post('/', requireAuth, createEvent)
router.put('/:id', requireAuth, updateEvent)
router.delete('/:id', requireAuth, deleteEvent)

export default router
