import Registration from '../models/Registration.js'
import Event from '../models/Event.js'

// POST /api/registrations
export async function registerForEvent(request, response, next) {
  try {
    const { eventId } = request.body
    const userId = request.user._id

    if (!eventId) {
      return response.status(400).json({ message: 'eventId is required.' })
    }

    const event = await Event.findById(eventId)
    if (!event) {
      return response.status(404).json({ message: 'Event not found.' })
    }

    // Check for duplicate registration
    const existing = await Registration.findOne({ user: userId, event: eventId })
    if (existing) {
      return response.status(400).json({ message: 'You are already registered for this event.' })
    }

    // Check capacity
    if (event.capacity) {
      const registrationCount = await Registration.countDocuments({ event: eventId })
      if (registrationCount >= event.capacity) {
        return response.status(400).json({ message: 'This event has reached its maximum capacity.' })
      }
    }

    const registration = await Registration.create({
      user: userId,
      event: eventId,
    })

    const populated = await registration.populate('event')
    response.status(201).json(populated)
  } catch (error) {
    // Handle mongoose unique index violation
    if (error.code === 11000) {
      return response.status(400).json({ message: 'You are already registered for this event.' })
    }
    next(error)
  }
}

// GET /api/registrations
export async function getMyRegistrations(request, response, next) {
  try {
    const registrations = await Registration.find({ user: request.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email' },
      })
      .sort({ createdAt: -1 })

    response.json(registrations)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/registrations/:id
export async function cancelRegistration(request, response, next) {
  try {
    const registration = await Registration.findById(request.params.id)

    if (!registration) {
      return response.status(404).json({ message: 'Registration not found.' })
    }

    // Only the owner of the registration can cancel it
    if (registration.user.toString() !== request.user._id.toString()) {
      return response.status(403).json({ message: 'Not authorized to cancel this registration.' })
    }

    await Registration.findByIdAndDelete(registration._id)
    response.json({ message: 'Registration cancelled successfully.' })
  } catch (error) {
    next(error)
  }
}
