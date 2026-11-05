import Event from '../models/Event.js'
import Registration from '../models/Registration.js'

// GET /api/events
export async function getEvents(_request, response, next) {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ date: 1 })
    response.json(events)
  } catch (error) {
    next(error)
  }
}

// GET /api/events/:id
export async function getEvent(request, response, next) {
  try {
    const event = await Event.findById(request.params.id)
      .populate('organizer', 'name email')

    if (!event) {
      return response.status(404).json({ message: 'Event not found.' })
    }

    response.json(event)
  } catch (error) {
    next(error)
  }
}

// POST /api/events
export async function createEvent(request, response, next) {
  try {
    const { title, description, date, location, capacity, category, imageUrl } = request.body

    if (!title || !date) {
      return response.status(400).json({ message: 'Title and date are required.' })
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      category,
      imageUrl,
      organizer: request.user._id,
    })

    const populated = await event.populate('organizer', 'name email')
    response.status(201).json(populated)
  } catch (error) {
    next(error)
  }
}

// PUT /api/events/:id
export async function updateEvent(request, response, next) {
  try {
    const event = await Event.findById(request.params.id)

    if (!event) {
      return response.status(404).json({ message: 'Event not found.' })
    }

    // Only the organizer or an admin can update the event
    const isOrganizer = event.organizer && event.organizer.toString() === request.user._id.toString()
    const isAdmin = request.user.role === 'admin'

    if (!isOrganizer && !isAdmin) {
      return response.status(403).json({ message: 'Not authorized to update this event.' })
    }

    const { title, description, date, location, capacity, category, imageUrl } = request.body

    event.title = title ?? event.title
    event.description = description ?? event.description
    event.date = date ?? event.date
    event.location = location ?? event.location
    event.capacity = capacity ?? event.capacity
    event.category = category ?? event.category
    event.imageUrl = imageUrl ?? event.imageUrl

    const updated = await event.save()
    const populated = await updated.populate('organizer', 'name email')
    response.json(populated)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/events/:id
export async function deleteEvent(request, response, next) {
  try {
    const event = await Event.findById(request.params.id)

    if (!event) {
      return response.status(404).json({ message: 'Event not found.' })
    }

    // Only the organizer or an admin can delete the event
    const isOrganizer = event.organizer && event.organizer.toString() === request.user._id.toString()
    const isAdmin = request.user.role === 'admin'

    if (!isOrganizer && !isAdmin) {
      return response.status(403).json({ message: 'Not authorized to delete this event.' })
    }

    // Also remove all registrations for this event
    await Registration.deleteMany({ event: event._id })
    await Event.findByIdAndDelete(event._id)

    response.json({ message: 'Event deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
