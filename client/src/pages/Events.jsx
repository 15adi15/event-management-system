import { useState, useEffect } from 'react'
import { getEvents, registerForEvent, getMyRegistrations } from '../services/api'
import EventCard from '../components/EventCard'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import { Search, Filter, Sparkles, AlertCircle, RefreshCw } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'technology', label: 'Technology' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'music', label: 'Music' },
  { id: 'conference', label: 'Conferences' },
  { id: 'sports', label: 'Sports' },
  { id: 'other', label: 'Other' },
]

function Events() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set())
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    try {
      const data = await getEvents()
      setEvents(data)

      // Also check which events the user has registered for
      const myRegs = await getMyRegistrations()
      const regIds = new Set(
        myRegs.map((r) => (r.event ? r.event._id || r.event : r))
      )
      setRegisteredEventIds(regIds)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(eventId)
      setRegisteredEventIds((prev) => new Set([...prev, eventId]))
      setNotification({
        type: 'success',
        text: '🎉 Successfully registered! Your ticket has been confirmed.',
      })
      setTimeout(() => setNotification(null), 4000)
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.message || 'Registration failed. Please try again.',
      })
      setTimeout(() => setNotification(null), 4000)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.description?.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' ||
      (event.category || 'other').toLowerCase() === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Live Event Feed
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore Upcoming Events
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Browse through conferences, tech summits, hackathons, and community gatherings. Reserve your spot today.
          </p>
        </div>

        {/* Global Notification Toast */}
        {notification && (
          <div
            className={`max-w-md mx-auto p-4 rounded-xl text-sm font-semibold flex items-center justify-between border shadow-lg animate-in fade-in slide-in-from-top-4 duration-200 ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            <span>{notification.text}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white text-xs ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by event title, location, keywords..."
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadEvents}
              title="Refresh events"
              className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="h-3.5 w-3.5" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <Loading label="Fetching latest events..." />
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 max-w-lg mx-auto space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white">No matching events found</h3>
            <p className="text-sm text-slate-400">
              Try adjusting your search criteria or switch to another category filter.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setSelectedCategory('all')
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
              <span>Showing {filteredEvents.length} events</span>
              {selectedCategory !== 'all' && (
                <span className="capitalize text-indigo-400">Filtered by: {selectedCategory}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onRegister={handleRegister}
                  isRegistered={registeredEventIds.has(event._id)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Events
