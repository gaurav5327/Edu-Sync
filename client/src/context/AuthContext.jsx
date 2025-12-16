import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../utils/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const currentUser = getCurrentUser()
    console.log('[AuthContext] Initial user check:', currentUser)
    setUser(currentUser)
    setLoading(false)
  }, [])

  // Debug: Log user state changes
  useEffect(() => {
    console.log('[AuthContext] User state changed:', user)
  }, [user])

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const currentUser = getCurrentUser()
        console.log('[AuthContext] Storage change detected, updating user:', currentUser)
        setUser(currentUser)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (userData) => {
    console.log('[AuthContext] User logged in:', userData)
    setUser(userData)
  }

  const logout = () => {
    console.log('[AuthContext] User logged out')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
