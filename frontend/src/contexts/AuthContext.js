import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verifica se há um token e dados de usuário salvos
    const accessToken = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('userData')

    if (accessToken && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Erro ao carregar dados do usuário:', e)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userData')
      }
    }
  }, [])

  const login = async (username, password) => {
    const data = await authService.login({ username, password })
    const accessToken = data.tokens?.access
    const refreshToken = data.tokens?.refresh
    const userData = data.user

    if (accessToken && userData) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userData', JSON.stringify(userData))
      setUser(userData)
    }

    return data
  }

  const logout = () => {
    authService.logout()
    localStorage.removeItem('userData')
    setUser(null)
  }

  const authValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthContext
