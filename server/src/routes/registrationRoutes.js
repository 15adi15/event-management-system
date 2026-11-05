import { Router } from 'express'

const router = Router()
router.get('/', (_request, response) => response.json([]))
router.post('/', (_request, response) => response.status(501).json({ message: 'Event registration is not implemented yet.' }))

export default router
