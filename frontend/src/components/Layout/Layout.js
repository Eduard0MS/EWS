import React from 'react'
import Header from './Header'

const Layout = ({ children, title = 'Sistema de Gestão de Feiras' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 Sistema de Gestão de Feiras. Desenvolvido para Engenharia
              de Software.
            </p>
            <p className="text-xs mt-2">
              Tecnologias: Django REST Framework + React + TailwindCSS +
              PostgreSQL
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
