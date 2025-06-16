import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import FeirasPage from './pages/FeirasPage'
import ExpositoresPage from './pages/ExpositoresPage'
import ProdutosPage from './pages/ProdutosPage'
import IngressosPage from './pages/IngressosPage'
import PerfilPage from './pages/PerfilPage'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'

function AppContent() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/'

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'container mx-auto p-4' : ''}>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas Privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/feiras" element={<FeirasPage />} />
            <Route path="/expositores" element={<ExpositoresPage />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/ingressos" element={<IngressosPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
