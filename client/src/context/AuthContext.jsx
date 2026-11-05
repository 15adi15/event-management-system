import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, getMe } from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('eventhub_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('eventhub_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const profile = await getMe()
          if (profile) {
            setUser(profile)
            localStorage.setItem('eventhub_user', JSON.stringify(profile))
          }
        } catch (e) {
          console.warn('Session verification failed, using cached session:', e)
        }
      }
      setLoading(false)
    }
    verifyAuth()
  }, [token])

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }
    setUser(userData)
    setToken(data.token)
    localStorage.setItem('eventhub_user', JSON.stringify(userData))
    localStorage.setItem('eventhub_token', data.token)
    return userData
  }

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password)
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }
    setUser(userData)
    setToken(data.token)
    localStorage.setItem('eventhub_user', JSON.stringify(userData))
    localStorage.setItem('eventhub_token', data.token)
    return userData
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('eventhub_user')
    localStorage.removeItem('eventhub_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
