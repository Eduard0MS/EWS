import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { feiraService } from '../services/api'
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  TicketIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const Home = () => {
  const [feiras, setFeiras] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeiras = async () => {
      try {
        const response = await feiraService.getAll({ page_size: 3 })
        setFeiras(response.results || response)
      } catch (error) {
        console.error('Erro ao carregar feiras:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeiras()
  }, [])

  const features = [
    {
      icon: BuildingStorefrontIcon,
      title: 'Gestão de Feiras',
      description:
        'Crie e gerencie feiras com informações completas sobre local, datas e descrição.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Expositores',
      description:
        'Cadastre expositores e permita que eles participem das suas feiras.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Catálogo de Produtos',
      description:
        'Cada expositor pode cadastrar seus produtos com preços e descrições.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TicketIcon,
      title: 'Sistema de Ingressos',
      description: 'Gere ingressos únicos para controle de acesso às feiras.',
      color: 'from-amber-500 to-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BuildingStorefrontIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Sistema de Feiras
                </span>
                <div className="text-xs text-slate-500 font-medium">
                  Gestão Inteligente
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/feiras"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                Ver Feiras
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-700/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Plataforma Completa de Gestão
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Sistema de Gestão
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                de Feiras
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Organize, gerencie e participe de feiras com uma plataforma
              moderna, intuitiva e completa. Tudo que você precisa em um só
              lugar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/feiras"
                className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
              >
                <span>Explorar Feiras</span>
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/register"
                className="group bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
              >
                <span>Criar Conta Grátis</span>
                <UserGroupIcon className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tudo que você precisa para organizar e participar de feiras de
              forma profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-200 h-full">
                  <div className="flex justify-center mb-6">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Fairs Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Feiras em Destaque
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Confira as últimas feiras cadastradas no sistema
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : feiras.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {feiras.map(feira => (
                <div
                  key={feira.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-slate-200"
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {feira.nome}
                    </h3>
                    <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                      {feira.descricao}
                    </p>
                    <div className="space-y-3 text-sm text-slate-500 mb-6">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 mr-3 text-blue-600" />
                        <span>
                          {new Date(feira.data_inicio).toLocaleDateString(
                            'pt-BR'
                          )}{' '}
                          -{' '}
                          {new Date(feira.data_termino).toLocaleDateString(
                            'pt-BR'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-3 text-blue-600" />
                        <span>
                          {feira.cidade}, {feira.estado}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/feiras/${feira.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-1 transition-all duration-200"
                    >
                      Ver detalhes
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-16">
              <BuildingStorefrontIcon className="h-16 w-16 mx-auto mb-6 text-slate-300" />
              <p className="text-xl">Nenhuma feira cadastrada ainda.</p>
            </div>
          )}

          {feiras.length > 0 && (
            <div className="text-center">
              <Link
                to="/feiras"
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                Ver todas as feiras
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Crie sua conta e comece a organizar suas feiras hoje mesmo. É
              rápido, fácil e gratuito.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
              >
                <CheckCircleIcon className="mr-2 h-5 w-5" />
                Criar Conta Grátis
              </Link>
              <Link
                to="/feiras"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center"
              >
                Explorar Feiras
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                <BuildingStorefrontIcon className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">Sistema de Feiras</span>
            </div>
            <p className="text-slate-400 mb-4">
              © 2025 Sistema de Gestão de Feiras. Desenvolvido para Engenharia
              de Software.
            </p>
            <p className="text-sm text-slate-500">
              Tecnologias: Django REST Framework + React + TailwindCSS +
              PostgreSQL
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
