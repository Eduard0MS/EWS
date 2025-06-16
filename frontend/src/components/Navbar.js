import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Avatar from './Avatar'

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          Feira Virtual
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-3">
                <Avatar user={user} size="sm" />
                <span className="font-medium">
                  Olá, {user?.first_name || user?.username}!
                </span>
              </div>
              <Link to="/feiras" className="hover:text-blue-200">
                Feiras
              </Link>
              <Link to="/expositores" className="hover:text-blue-200">
                Expositores
              </Link>
              <Link to="/produtos" className="hover:text-blue-200">
                Produtos
              </Link>
              <Link to="/ingressos" className="hover:text-blue-200">
                Ingressos
              </Link>
              <Link to="/perfil" className="hover:text-blue-200">
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
              >
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
