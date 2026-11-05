import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// POST /api/auth/register
export async function registerUser(request, response, next) {
  try {
    const { name, email, password, role } = request.body

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Please provide name, email and password.' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return response.status(400).json({ message: 'User with this email already exists.' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    })

    response.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
export async function loginUser(request, response, next) {
  try {
    const { email, password } = request.body

    if (!email || !password) {
      return response.status(400).json({ message: 'Please provide email and password.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    response.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/me
export async function getUserProfile(request, response, next) {
  try {
    const user = await User.findById(request.user._id).select('-password')
    if (!user) {
      return response.status(404).json({ message: 'User not found.' })
    }
    response.json(user)
  } catch (error) {
    next(error)
  }
}
