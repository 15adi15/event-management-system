import Event from '../models/Event.js'

export async function getEvents(_request, response, next) {
  try {
    const events = await Event.find().sort({ date: 1 })
    response.json(events)
  } catch (error) {
    next(error)
  }
}

export function createEvent(_request, response) {
  response.status(501).json({ message: 'Event creation is not implemented yet.' })
}
