import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Avatar from './Avatar'
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  TicketIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigationItems = [
    {
      name: 'Feiras',
      href: '/feiras',
      icon: BuildingStorefrontIcon,
      description: 'Gerencie suas feiras'
    },
    {
      name: 'Expositores',
      href: '/expositores',
      icon: UserGroupIcon,
      description: 'Cadastre expositores'
    },
    {
      name: 'Produtos',
      href: '/produtos',
      icon: ShoppingBagIcon,
      description: 'Catálogo de produtos'
    },
    {
      name: 'Ingressos',
      href: '/ingressos',
      icon: TicketIcon,
      description: 'Seus ingressos'
    },
    {
      name: 'Perfil',
      href: '/perfil',
      icon: UserCircleIcon,
      description: 'Configurações'
    }
  ]

  const isActivePath = path => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 backdrop-blur-xl border-b border-blue-500/20 shadow-2xl shadow-blue-900/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300"
          >
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">
                Feira Virtual
              </span>
              <div className="text-xs text-blue-200 font-medium -mt-1">
                Sistema de Gestão
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Apenas quando autenticado */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map(item => {
                const Icon = item.icon
                const isActive = isActivePath(item.href)

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon
                        className={`h-5 w-5 transition-transform duration-300 ${
                          isActive ? 'scale-110' : 'group-hover:scale-110'
                        }`}
                      />
                      <span className="font-semibold">{item.name}</span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}

                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Right Side - User Menu ou Login/Register */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="relative">
                    <Avatar user={user} size="sm" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold text-sm">
                      {user?.first_name || user?.username}
                    </div>
                    <div className="text-blue-200 text-xs">Online</div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login/Register Buttons - Posicionados à direita */}
                <div className="hidden lg:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-blue-100 hover:text-white font-semibold transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Registrar
                  </Link>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-blue-700 to-indigo-800 backdrop-blur-xl border-t border-blue-500/20 shadow-2xl">
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl border border-white/20 mb-4">
                    <Avatar user={user} size="md" />
                    <div>
                      <div className="text-white font-semibold">
                        {user?.first_name || user?.username}
                      </div>
                      <div className="text-blue-200 text-sm">Online agora</div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  {navigationItems.map(item => {
                    const Icon = item.icon
                    const isActive = isActivePath(item.href)

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-xs opacity-75">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    )
                  })}

                  {/* Mobile Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-4 bg-red-500/90 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 mt-4"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-4 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 text-center"
                  >
                    Registrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
