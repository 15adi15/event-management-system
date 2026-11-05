import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verify JWT and attach user to request
export async function requireAuth(request, response, next) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ message: 'Not authorized, no token provided.' })
    }

    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return response.status(500).json({ message: 'JWT_SECRET is not configured.' })
    }

    const decoded = jwt.verify(token, secret)
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return response.status(401).json({ message: 'Not authorized, user not found.' })
    }

    request.user = user
    next()
  } catch (error) {
    return response.status(401).json({ message: 'Not authorized, token invalid.' })
  }
}

// Check if the authenticated user is an admin
export function requireAdmin(request, response, next) {
  if (request.user && request.user.role === 'admin') {
    next()
  } else {
    response.status(403).json({ message: 'Not authorized, admin access required.' })
  }
}
