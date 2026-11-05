import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'

async function seed() {
  const mongoUri = process.env.MONGO_URI
  if (!mongoUri) {
    console.error('MONGO_URI is not set. Cannot seed.')
    process.exit(1)
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected for seeding.')

  // Clear existing data
  await Registration.deleteMany({})
  await Event.deleteMany({})
  await User.deleteMany({})
  console.log('Cleared existing data.')

  // Hash passwords
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash('password123', salt)

  // Create users
  const adminUser = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: hashedPassword,
    role: 'admin',
  })
  console.log(`Created admin user: ${adminUser.email}`)

  const regularUser = await User.create({
    name: 'John',
    email: 'john@test.com',
    password: hashedPassword,
    role: 'user',
  })
  console.log(`Created regular user: ${regularUser.email}`)

  // Create events
  const eventsData = [
    {
      title: 'Tech Conference 2026',
      description: 'A premier technology conference bringing together industry leaders, developers, and innovators to discuss the latest trends in tech.',
      date: new Date('2026-12-15T09:00:00Z'),
      location: 'Mumbai',
      capacity: 200,
      category: 'technology',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      organizer: adminUser._id,
    },
    {
      title: 'React Workshop',
      description: 'Hands-on workshop covering React fundamentals, hooks, state management, and building production-ready applications.',
      date: new Date('2026-12-20T10:00:00Z'),
      location: 'Pune',
      capacity: 50,
      category: 'workshop',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      organizer: adminUser._id,
    },
    {
      title: 'Music Festival',
      description: 'An unforgettable three-day music festival featuring top artists from around the world across multiple stages.',
      date: new Date('2027-01-10T16:00:00Z'),
      location: 'Goa',
      capacity: 500,
      category: 'music',
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
      organizer: adminUser._id,
    },
    {
      title: 'AI Summit',
      description: 'Explore the future of Artificial Intelligence with keynote speakers, panel discussions, and live demos of cutting-edge AI solutions.',
      date: new Date('2027-01-25T09:00:00Z'),
      location: 'Bangalore',
      capacity: 150,
      category: 'conference',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
      organizer: adminUser._id,
    },
    {
      title: 'Cricket Tournament',
      description: 'Inter-city cricket tournament with teams competing for the championship trophy. Open to all skill levels.',
      date: new Date('2027-02-05T08:00:00Z'),
      location: 'Delhi',
      capacity: 100,
      category: 'sports',
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
      organizer: adminUser._id,
    },
    {
      title: 'Startup Meetup',
      description: 'A networking event for entrepreneurs, investors, and startup enthusiasts to share ideas and build connections.',
      date: new Date('2027-02-15T18:00:00Z'),
      location: 'Hyderabad',
      capacity: 75,
      category: 'other',
      imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      organizer: adminUser._id,
    },
  ]

  const events = await Event.insertMany(eventsData)
  console.log(`Created ${events.length} events.`)

  // Register John for 2 events (Tech Conference and Music Festival)
  await Registration.create({ user: regularUser._id, event: events[0]._id })
  await Registration.create({ user: regularUser._id, event: events[2]._id })
  console.log('Registered John for Tech Conference 2026 and Music Festival.')

  console.log('\nSeed completed successfully!')
  console.log('---')
  console.log('Admin login:  admin@test.com / password123')
  console.log('User login:   john@test.com  / password123')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
