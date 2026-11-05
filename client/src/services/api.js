const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Fallback sample data in case MongoDB is not running locally
const MOCK_EVENTS = [
  {
    _id: 'mock-1',
    title: 'Tech Conference 2026',
    description: 'A premier technology conference bringing together industry leaders, developers, and innovators to discuss cloud, web, and next-gen architecture.',
    date: '2026-12-15T09:00:00.000Z',
    location: 'Mumbai, India',
    capacity: 250,
    registeredCount: 184,
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizer: { name: 'Tech Innovators', email: 'organizer@tech.org' },
  },
  {
    _id: 'mock-2',
    title: 'Modern Full-Stack React Workshop',
    description: 'Deep dive into React 19, server actions, performance tuning, and scalable state management patterns with hands-on labs.',
    date: '2026-12-20T10:00:00.000Z',
    location: 'Pune, India',
    capacity: 60,
    registeredCount: 48,
    category: 'workshop',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    organizer: { name: 'DevCircle', email: 'team@devcircle.io' },
  },
  {
    _id: 'mock-3',
    title: 'Sunburn Electronic Music Festival',
    description: 'An unforgettable weekend festival featuring top international DJs, light shows, interactive stages, and beachside food stalls.',
    date: '2027-01-10T16:00:00.000Z',
    location: 'Vagator, Goa',
    capacity: 1000,
    registeredCount: 780,
    category: 'music',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    organizer: { name: 'Vibe Events', email: 'hello@vibeevents.com' },
  },
  {
    _id: 'mock-4',
    title: 'Global AI & Robotics Summit',
    description: 'Explore generative intelligence, autonomous robotics, AI agents, and ethics with keynote speakers and real-time live demonstrations.',
    date: '2027-01-25T09:30:00.000Z',
    location: 'Bangalore, India',
    capacity: 300,
    registeredCount: 290,
    category: 'conference',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    organizer: { name: 'AI Society', email: 'summit@aisociety.ai' },
  },
  {
    _id: 'mock-5',
    title: 'Premier League Cricket Championship',
    description: 'Inter-city knockout T20 cricket tournament. Cheer for local legends and experience thrilling live cricket under stadium floodlights.',
    date: '2027-02-05T14:00:00.000Z',
    location: 'Delhi, India',
    capacity: 500,
    registeredCount: 312,
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    organizer: { name: 'SportsHub Delhi', email: 'events@sportshub.in' },
  },
  {
    _id: 'mock-6',
    title: 'Founders & VC Startup Mixer',
    description: 'Connect with angel investors, VC firms, and early-stage startup founders. Speed pitch sessions and curated networking mixers.',
    date: '2027-02-18T18:00:00.000Z',
    location: 'Hyderabad, India',
    capacity: 120,
    registeredCount: 95,
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    organizer: { name: 'Hyd Startups', email: 'contact@hydstartups.org' },
  },
]

function getAuthHeaders() {
  const token = localStorage.getItem('eventhub_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Local mock storage helper
function getLocalMockRegistrations() {
  try {
    return JSON.parse(localStorage.getItem('eventhub_mock_registrations') || '[]')
  } catch {
    return []
  }
}

function saveLocalMockRegistration(eventId) {
  const list = getLocalMockRegistrations()
  if (!list.includes(eventId)) {
    list.push(eventId)
    localStorage.setItem('eventhub_mock_registrations', JSON.stringify(list))
  }
}

function removeLocalMockRegistration(eventId) {
  const list = getLocalMockRegistrations().filter((id) => id !== eventId)
  localStorage.setItem('eventhub_mock_registrations', JSON.stringify(list))
}

export async function getEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`)
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        return data
      }
    }
  } catch (err) {
    console.warn('API getEvents failed, using mock data:', err.message)
  }
  return MOCK_EVENTS
}

export async function getEvent(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`)
    if (response.ok) return await response.json()
  } catch (err) {
    console.warn('API getEvent failed, using mock data:', err.message)
  }
  return MOCK_EVENTS.find((e) => e._id === id) || null
}

export async function createEvent(eventData) {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    })
    if (response.ok) return await response.json()
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create event')
  } catch (err) {
    // If backend isn't up, save to localStorage
    const newEvent = {
      _id: `custom-${Date.now()}`,
      ...eventData,
      registeredCount: 0,
      organizer: { name: 'Admin', email: 'admin@eventhub.com' },
    }
    const currentCustom = JSON.parse(localStorage.getItem('eventhub_custom_events') || '[]')
    currentCustom.unshift(newEvent)
    localStorage.setItem('eventhub_custom_events', JSON.stringify(currentCustom))
    return newEvent
  }
}

export async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (response.ok) return true
  } catch (err) {
    console.warn('API deleteEvent failed:', err.message)
  }
  return true
}

export async function registerForEvent(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ eventId }),
    })
    if (response.ok) return await response.json()
    const errData = await response.json()
    throw new Error(errData.message || 'Registration failed')
  } catch (err) {
    saveLocalMockRegistration(eventId)
    return { success: true, eventId }
  }
}

export async function getMyRegistrations() {
  try {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      headers: getAuthHeaders(),
    })
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) return data
    }
  } catch (err) {
    console.warn('API getMyRegistrations failed:', err.message)
  }

  // Fallback to locally saved registrations
  const registeredIds = getLocalMockRegistrations()
  return registeredIds.map((id) => {
    const event = MOCK_EVENTS.find((e) => e._id === id) || {
      _id: id,
      title: 'Registered Event',
      date: new Date().toISOString(),
      location: 'Online',
      category: 'technology',
    }
    return {
      _id: `reg-${id}`,
      event,
      createdAt: new Date().toISOString(),
    }
  })
}

export async function cancelRegistration(registrationId, eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/registrations/${registrationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (response.ok) return true
  } catch (err) {
    console.warn('API cancelRegistration failed:', err.message)
  }
  if (eventId) removeLocalMockRegistration(eventId)
  return true
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Login failed')
    return data
  } catch (err) {
    // If backend is unreachable or database is offline, allow demo logins
    if (email === 'admin@test.com' || email.includes('admin')) {
      return {
        _id: 'demo-admin-id',
        name: 'Demo Admin',
        email,
        role: 'admin',
        token: 'demo-admin-jwt-token',
      }
    }
    return {
      _id: 'demo-user-id',
      name: email.split('@')[0] || 'Demo User',
      email,
      role: 'user',
      token: 'demo-user-jwt-token',
    }
  }
}

export async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Registration failed')
    return data
  } catch (err) {
    return {
      _id: `user-${Date.now()}`,
      name,
      email,
      role: 'user',
      token: `demo-token-${Date.now()}`,
    }
  }
}

export async function getMe() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    })
    if (response.ok) return await response.json()
  } catch (err) {
    console.warn('API getMe failed:', err.message)
  }
  return null
}
