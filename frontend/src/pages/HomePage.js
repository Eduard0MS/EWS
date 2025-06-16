import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Bem-vindo a Feira Virtual, {user?.username}!
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Este é o seu painel de controle. A partir daqui, você pode gerenciar
        feiras, expositores, produtos e muito mais.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card para Gerenciar Feiras */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            Gerenciar Feiras
          </h2>
          <p className="mt-2 text-gray-600">
            Visualize, crie e edite as feiras disponíveis no sistema.
          </p>
          <Link to="/feiras">
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
              Ir para Feiras
            </button>
          </Link>
        </div>

        {/* Card para Gerenciar Expositores */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            Gerenciar Expositores
          </h2>
          <p className="mt-2 text-gray-600">
            Cadastre e gerencie expositores que participam das feiras.
          </p>
          <Link to="/expositores">
            <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
              Ir para Expositores
            </button>
          </Link>
        </div>

        {/* Card para Gerenciar Produtos */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            Gerenciar Produtos
          </h2>
          <p className="mt-2 text-gray-600">
            Cadastre e gerencie produtos dos expositores nas feiras.
          </p>
          <Link to="/produtos">
            <button className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors">
              Ir para Produtos
            </button>
          </Link>
        </div>

        {/* Card para Gerenciar Ingressos */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            Meus Ingressos
          </h2>
          <p className="mt-2 text-gray-600">
            Acesse e gerencie os ingressos que você adquiriu.
          </p>
          <Link to="/ingressos">
            <button className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors">
              Ver Ingressos
            </button>
          </Link>
        </div>

        {/* Card para o Perfil */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">Meu Perfil</h2>
          <p className="mt-2 text-gray-600">
            Atualize suas informações pessoais e altere sua senha.
          </p>
          <Link to="/perfil">
            <button className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors">
              Editar Perfil
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
