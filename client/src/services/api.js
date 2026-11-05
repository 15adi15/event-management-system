const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events`)
  if (!response.ok) throw new Error('Could not load events')
  return response.json()
}
