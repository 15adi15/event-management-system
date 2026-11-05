import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyRegistrations, cancelRegistration } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import {
  Ticket,
  Calendar,
  MapPin,
  Trash2,
  AlertCircle,
  Sparkles,
  QrCode,
  ArrowRight
} from 'lucide-react'

function formatDate(dateString) {
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

function MyRegistrations() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadRegistrations()
  }, [])

  async function loadRegistrations() {
    setLoading(true)
    try {
      const data = await getMyRegistrations()
      setRegistrations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(regId, eventId) {
    if (!window.confirm('Are you sure you want to cancel this ticket registration?')) {
      return
    }

    setCancelingId(regId)
    try {
      await cancelRegistration(regId, eventId)
      setRegistrations((prev) => prev.filter((r) => r._id !== regId))
      setMessage('Ticket registration cancelled successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      alert(err.message || 'Failed to cancel registration.')
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <Ticket className="h-3.5 w-3.5" />
              Digital Passes
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Registered Tickets
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your event passes, check schedules, or cancel reservations anytime.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-sm font-semibold text-white transition-all self-start sm:self-auto"
          >
            Find More Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Message Banner */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-semibold">
            {message}
          </div>
        )}

        {/* Not Logged In Notice */}
        {!user && (
          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
              <span>You are viewing local guest tickets. Sign in to synchronize your passes across devices.</span>
            </div>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all self-start shrink-0"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <Loading label="Loading your tickets..." />
        ) : registrations.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Ticket className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No active tickets found</h3>
            <p className="text-sm text-slate-400">
              You haven&apos;t registered for any events yet. Explore upcoming summits and workshops!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              Browse Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((reg) => {
              const event = reg.event || {}
              const eventId = event._id || reg.event

              return (
                <div
                  key={reg._id}
                  className="relative flex flex-col md:flex-row bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all group"
                >
                  {/* Left Ticket Header / Image */}
                  <div className="relative md:w-64 h-48 md:h-auto bg-slate-800 shrink-0 overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-tr from-indigo-900 to-purple-900 flex items-center justify-center">
                        <Calendar className="h-10 w-10 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 backdrop-blur-md">
                        Confirmed Pass
                      </span>
                    </div>
                  </div>

                  {/* Middle Ticket Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5" />
                        {event.category || 'Event'}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {event.title || 'Untitled Event'}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {event.description || 'Confirmed admission for 1 person.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-indigo-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-rose-400" />
                        <span>{event.location || 'Online'}</span>
                      </div>
                      <div className="text-slate-400">
                        Pass ID: <span className="font-mono text-slate-300">{reg._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Stub: QR Code & Action */}
                  <div className="p-6 md:w-52 bg-slate-950/70 border-t md:border-t-0 md:border-l border-slate-800/80 flex flex-col items-center justify-center space-y-3 shrink-0">
                    <div className="p-2.5 rounded-xl bg-white shadow-md text-slate-950">
                      <QrCode className="h-16 w-16 text-slate-900" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      Scan at Entry
                    </span>

                    <button
                      onClick={() => handleCancel(reg._id, eventId)}
                      disabled={cancelingId === reg._id}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-900 border border-rose-900/40 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {cancelingId === reg._id ? 'Cancelling...' : 'Cancel Pass'}
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default MyRegistrations
