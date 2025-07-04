import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth()

  // Se estiver autenticado, renderiza o componente filho (Outlet)
  // Se não, redireciona para a página de login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
