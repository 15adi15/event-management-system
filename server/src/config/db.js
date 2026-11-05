import mongoose from 'mongoose'

async function connectDB() {
  const mongoUri = process.env.MONGO_URI
  if (!mongoUri) {
    console.warn('MONGO_URI is not set; database connection was skipped.')
    return
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}

export default connectDB
