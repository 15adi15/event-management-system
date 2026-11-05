import { useState } from 'react'
import { Calendar, MapPin, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

const CATEGORY_STYLES = {
  technology: { bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', label: 'Technology' },
  workshop: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Workshop' },
  music: { bg: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30', label: 'Music Festival' },
  conference: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', label: 'Conference' },
  sports: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Sports' },
  festival: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Festival' },
  other: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', label: 'Community' },
}

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

function EventCard({ event, onRegister, isRegistered }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const category = (event.category || 'other').toLowerCase()
  const catStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES.other

  const capacity = event.capacity || 100
  const registeredCount = event.registeredCount || (isRegistered ? 1 : 0)
  const remaining = Math.max(0, capacity - registeredCount)
  const percentage = Math.min(100, Math.round((registeredCount / capacity) * 100))

  const handleRegisterClick = async () => {
    if (isRegistered || success) return
    setLoading(true)
    try {
      if (onRegister) {
        await onRegister(event._id)
      }
      setSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isCompleted = isRegistered || success

  return (
    <div className="group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden">
      
      {/* Event Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-slate-700" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md shadow-sm ${catStyle.bg}`}>
            <Sparkles className="h-3 w-3" />
            {catStyle.label}
          </span>
        </div>

        {/* Free / Status Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            Free Entry
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {event.description || 'Join us for this exciting event. Connect, learn, and engage with the community.'}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-medium text-slate-200">{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
            <span className="truncate">{event.location || 'Online Event'}</span>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-500" />
                Capacity
              </span>
              <span>{remaining} seats left</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          {isCompleted ? (
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-sm font-semibold cursor-default"
            >
              <CheckCircle className="h-4 w-4" />
              Registered
            </button>
          ) : (
            <button
              onClick={handleRegisterClick}
              disabled={loading || remaining === 0}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md ${
                remaining === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white shadow-indigo-600/25 hover:shadow-indigo-600/40'
              }`}
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : remaining === 0 ? (
                'Sold Out'
              ) : (
                <>
                  Register Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  )
}

export default EventCard
