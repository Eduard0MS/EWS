import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  TicketIcon,
  UserCircleIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Avatar from '../components/Avatar'

function DashboardPage() {
  const { user } = useAuth()

  const dashboardCards = [
    {
      title: 'Gerenciar Feiras',
      description: 'Visualize, crie e edite as feiras disponíveis no sistema.',
      icon: BuildingStorefrontIcon,
      link: '/feiras',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Gerenciar Expositores',
      description: 'Cadastre e gerencie expositores que participam das feiras.',
      icon: UserGroupIcon,
      link: '/expositores',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Gerenciar Produtos',
      description: 'Cadastre e gerencie produtos dos expositores nas feiras.',
      icon: ShoppingBagIcon,
      link: '/produtos',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Meus Ingressos',
      description: 'Acesse e gerencie os ingressos que você adquiriu.',
      icon: TicketIcon,
      link: '/ingressos',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Meu Perfil',
      description: 'Atualize suas informações pessoais e altere sua senha.',
      icon: UserCircleIcon,
      link: '/perfil',
      color: 'from-slate-500 to-gray-500',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar user={user} size="lg" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Bem-vindo de volta, {user?.first_name || user?.username}!
              </h1>
              <p className="text-lg text-slate-600 mt-2">
                Este é o seu painel de controle. Gerencie tudo em um só lugar.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Painel de Controle
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              A partir daqui, você pode gerenciar feiras, expositores, produtos
              e muito mais. Escolha uma das opções abaixo para começar.
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardCards.map((card, index) => (
            <Link key={index} to={card.link} className="group block">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-slate-300/50 hover:scale-105 h-full">
                <div className="flex items-start space-x-4 mb-6">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className={`px-4 py-2 ${card.bgColor} ${card.textColor} rounded-xl text-sm font-semibold`}
                  >
                    Acessar
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Visão Geral do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-lg text-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl w-fit mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Gestão Completa
              </h3>
              <p className="text-slate-600">
                Sistema integrado para organização de feiras virtuais e
                presenciais
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-lg text-center">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl w-fit mx-auto mb-4">
                <BuildingStorefrontIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Marketplace
              </h3>
              <p className="text-slate-600">
                Conecte expositores e visitantes em um ambiente digital moderno
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-lg text-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-fit mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Networking
              </h3>
              <p className="text-slate-600">
                Facilite conexões e oportunidades de negócio entre participantes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
