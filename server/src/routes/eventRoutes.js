import { Router } from 'express'
import { createEvent, getEvents } from '../controllers/eventController.js'

const router = Router()
router.get('/', getEvents)
router.post('/', createEvent)

export default router
