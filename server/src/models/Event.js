import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  location: { type: String, default: '' },
  capacity: { type: Number, min: 1 },
}, { timestamps: true })

const Event = mongoose.model('Event', eventSchema)
export default Event
