import { useState, useEffect } from 'react'
import { getEvents, createEvent, deleteEvent } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import {
  ShieldCheck,
  PlusCircle,
  Calendar,
  MapPin,
  Trash2,
  Users,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

const CATEGORIES = [
  { id: 'technology', label: 'Technology' },
  { id: 'workshop', label: 'Workshop' },
  { id: 'music', label: 'Music' },
  { id: 'conference', label: 'Conference' },
  { id: 'sports', label: 'Sports' },
  { id: 'festival', label: 'Festival' },
  { id: 'other', label: 'Other' },
]

function AdminDashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'technology',
    date: '',
    location: '',
    capacity: 100,
    imageUrl: '',
  })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.date) {
      setMessage({ type: 'error', text: 'Please fill in at least the Title and Date.' })
      return
    }

    setSubmitting(true)
    try {
      const newEvt = await createEvent({
        ...form,
        imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      })
      setEvents((prev) => [newEvt, ...prev])
      setMessage({ type: 'success', text: `Event "${form.title}" created successfully!` })
      setForm({
        title: '',
        description: '',
        category: 'technology',
        date: '',
        location: '',
        capacity: 100,
        imageUrl: '',
      })
      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create event.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      await deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e._id !== id))
      setMessage({ type: 'success', text: `Event "${title}" was deleted.` })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      alert(err.message || 'Failed to delete event')
    }
  }

  const totalCapacity = events.reduce((acc, curr) => acc + (curr.capacity || 0), 0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Organizer Control Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Event Administration
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Create new listings, track capacity, and manage published events.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
              <span className="text-slate-400">Signed in as:</span>
              <span className="font-semibold text-purple-400">{user.email}</span>
            </div>
          )}
        </div>

        {/* Global Toast */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 border shadow-lg ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Published</span>
              <Calendar className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{events.length}</p>
            <p className="text-xs text-slate-500">Live active listings</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Seat Capacity</span>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-purple-300">{totalCapacity.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Across all scheduled venues</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
              <Layers className="h-4 w-4 text-pink-400" />
            </div>
            <p className="text-3xl font-extrabold text-pink-300">{CATEGORIES.length}</p>
            <p className="text-xs text-slate-500">Tech, music, sports, workshops</p>
          </div>
        </div>

        {/* Two-Column Grid: Form & List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Event Form */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl h-fit">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <PlusCircle className="h-4 w-4" />
                Publish
              </div>
              <h2 className="text-xl font-bold text-white">Create New Event</h2>
              <p className="text-xs text-slate-400">Enter details to list an event instantly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Next.js Conf 2027"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min={1}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Date &amp; Time *
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, BKC Convention Center"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Banner Image URL (Unsplash)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell attendees what to expect..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    Publish Event
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Published Events List */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white">Active Event Listings</h2>
              <p className="text-xs text-slate-400">View and manage existing events.</p>
            </div>

            {loading ? (
              <Loading label="Loading events..." />
            ) : events.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No events found. Create your first event on the left!</p>
            ) : (
              <div className="divide-y divide-slate-800/80 space-y-4">
                {events.map((evt) => (
                  <div key={evt._id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-400 border border-slate-700">
                          {evt.category || 'Event'}
                        </span>
                        <h4 className="font-bold text-white text-sm sm:text-base">{evt.title}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                          {new Date(evt.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-rose-400" />
                          {evt.location || 'Online'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-purple-400" />
                          {evt.capacity || 100} seats
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(evt._id, evt.title)}
                      title="Delete event"
                      className="p-2 rounded-lg bg-rose-950/40 text-rose-400 hover:text-white hover:bg-rose-900 border border-rose-900/50 transition-all shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
