import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import connectDB from './server/src/config/db.js'
import errorMiddleware from './server/src/middleware/errorMiddleware.js'
import authRoutes from './server/src/routes/authRoutes.js'
import eventRoutes from './server/src/routes/eventRoutes.js'
import registrationRoutes from './server/src/routes/registrationRoutes.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/registrations', registrationRoutes)
app.use(errorMiddleware)

connectDB().catch((error) => console.error('MongoDB connection failed:', error.message))
app.listen(port, () => console.log(`API server listening on port ${port}`))
