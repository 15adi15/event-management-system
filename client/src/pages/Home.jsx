import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../services/api'
import EventCard from '../components/EventCard'
import {
  Sparkles,
  ArrowRight,
  Compass,
  Zap,
  Shield,
  Calendar,
  Users,
  Award,
  ChevronRight
} from 'lucide-react'

function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([])

  useEffect(() => {
    async function load() {
      const data = await getEvents()
      setFeaturedEvents(data.slice(0, 3))
    }
    load()
  }, [])

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="absolute top-[-10%] right-[15%] w-[450px] h-[450px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute top-[20%] left-[45%] w-[350px] h-[350px] rounded-full bg-pink-600/15 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-8 shadow-inner shadow-indigo-500/20 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span>The Next Generation Event Experience</span>
          <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
        </div>

        {/* Primary Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
          Discover, Connect &amp; <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Experience Great Events
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From developer hackathons and AI summits to live music concerts and tech workshops. 
          Discover your next passion project and connect with like-minded creators.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Compass className="h-5 w-5" />
            Explore All Events
            <ArrowRight className="h-5 w-5 ml-1" />
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-base transition-all hover:border-slate-600"
          >
            Create Free Account
          </Link>
        </div>

        {/* Platform Metrics */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              500+
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Events Hosted</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              25,000+
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Happy Attendees</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              40+
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Cities Reached</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              99.8%
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Satisfaction Rate</p>
          </div>
        </div>

      </section>

      {/* Featured Events Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-wide uppercase">
              <Calendar className="h-4 w-4" />
              Handpicked For You
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Trending Upcoming Events
            </h2>
          </div>
          <Link
            to="/events"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all 6+ events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Everything you need for world-class events
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Engineered for attendees and event hosts alike. Fast, intuitive, and modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant 1-Click Registration</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No endless multi-step forms. Reserve your seat with one tap, view your digital ticket, and sync directly with your calendar.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Organizer Tools &amp; Control</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Admins and organizers get an intuitive dashboard to create events, monitor live attendee capacity, and manage registrations.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4">
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Curated Experiences</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore events filtered by technology, design, business, and music. Verified listings guarantee high quality experiences.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-sm text-slate-500">
        <p>© 2026 EventHub. Built with React, Tailwind CSS, Express, and MongoDB.</p>
      </footer>

    </div>
  )
}

export default Home
