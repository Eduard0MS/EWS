import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  TicketIcon,
  UserCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  TrophyIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import Avatar from '../components/Avatar'
import {
  produtoService,
  feiraService,
  expositorService,
  ingressoService
} from '../services/api'

function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    totalProdutos: 0,
    feiraDestaque: null,
    totalExpositores: 0,
    loading: true
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        console.log('Token:', token ? 'Presente' : 'Ausente')

        if (!token) {
          console.error('Token não encontrado!')
          setDashboardData(prev => ({
            ...prev,
            loading: false,
            error: 'Você precisa fazer login novamente. Token não encontrado.'
          }))
          return
        }

        // Usar os services específicos
        console.log('Buscando produtos...')
        const produtos = await produtoService.getAll()
        console.log('Produtos recebidos:', produtos)

        console.log('Buscando feiras...')
        const feiras = await feiraService.getAll()
        console.log('Feiras recebidas:', feiras)

        console.log('Buscando expositores...')
        const expositores = await expositorService.getAll()
        console.log('Expositores recebidos:', expositores)

        console.log('Buscando ingressos...')
        const ingressos = await ingressoService.getAll()
        console.log('Ingressos recebidos:', ingressos)

        // Processar dados - garantir que são arrays
        const produtosArray = Array.isArray(produtos)
          ? produtos
          : produtos.results || []
        const feirasArray = Array.isArray(feiras)
          ? feiras
          : feiras.results || []
        const expositoresArray = Array.isArray(expositores)
          ? expositores
          : expositores.results || []
        const ingressosArray = Array.isArray(ingressos)
          ? ingressos
          : ingressos.results || []

        // Encontrar feira em destaque (com mais ingressos vendidos)
        let feiraDestaque = null
        if (feirasArray.length > 0) {
          // Contar ingressos por feira
          const ingressosPorFeira = {}
          ingressosArray.forEach(ingresso => {
            const feiraId = ingresso.feira
            ingressosPorFeira[feiraId] = (ingressosPorFeira[feiraId] || 0) + 1
          })

          // Encontrar a feira com mais ingressos
          let maxIngressos = 0
          let feiraComMaisIngressos = null

          for (const [feiraId, quantidade] of Object.entries(
            ingressosPorFeira
          )) {
            if (quantidade > maxIngressos) {
              maxIngressos = quantidade
              feiraComMaisIngressos = feiraId
            }
          }

          // Se encontrou uma feira com ingressos, buscar os dados dela
          if (feiraComMaisIngressos) {
            feiraDestaque = feirasArray.find(
              feira => feira.id === feiraComMaisIngressos
            )
            if (feiraDestaque) {
              feiraDestaque.totalIngressos = maxIngressos
            }
          }

          // Se não há ingressos vendidos, pegar a primeira feira
          if (!feiraDestaque && feirasArray.length > 0) {
            feiraDestaque = feirasArray[0]
            feiraDestaque.totalIngressos = 0
          }
        }

        const dashboardInfo = {
          totalProdutos: produtosArray.length,
          feiraDestaque,
          totalExpositores: expositoresArray.length,
          loading: false
        }

        console.log('Dados finais do dashboard:', dashboardInfo)
        setDashboardData(dashboardInfo)
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)

        let errorMessage = error.message
        if (error.response?.status === 401) {
          errorMessage =
            'Sessão expirada. Faça login novamente para acessar os dados.'
        } else if (error.response?.status === 403) {
          errorMessage = 'Você não tem permissão para acessar estes dados.'
        } else if (error.response?.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente em alguns minutos.'
        }

        // Em caso de erro, definir valores padrão para teste
        setDashboardData({
          totalProdutos: 0,
          feiraDestaque: null,
          totalExpositores: 0,
          loading: false,
          error: errorMessage
        })
      }
    }

    fetchDashboardData()
  }, [])

  const dashboardCards = [
    {
      title: 'Gerenciar Feiras',
      description: 'Visualize, crie e edite as feiras disponíveis no sistema.',
      icon: BuildingStorefrontIcon,
      link: '/feiras',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      shadowColor: 'shadow-blue-500/25'
    },
    {
      title: 'Gerenciar Expositores',
      description: 'Cadastre e gerencie expositores que participam das feiras.',
      icon: UserGroupIcon,
      link: '/expositores',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      shadowColor: 'shadow-emerald-500/25'
    },
    {
      title: 'Gerenciar Produtos',
      description: 'Cadastre e gerencie produtos dos expositores nas feiras.',
      icon: ShoppingBagIcon,
      link: '/produtos',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      shadowColor: 'shadow-purple-500/25'
    },
    {
      title: 'Meus Ingressos',
      description: 'Acesse e gerencie os ingressos que você adquiriu.',
      icon: TicketIcon,
      link: '/ingressos',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      shadowColor: 'shadow-amber-500/25'
    },
    {
      title: 'Meu Perfil',
      description: 'Atualize suas informações pessoais e altere sua senha.',
      icon: UserCircleIcon,
      link: '/perfil',
      color: 'from-slate-500 to-gray-500',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/25'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - COMPACTO E MODERNO */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar user={user} size="lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  Olá, {user?.first_name || user?.username}!
                </h1>
                <p className="text-base text-slate-600 mt-1">
                  Bem-vindo ao seu painel de controle personalizado
                </p>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Online agora</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Último acesso: {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/feiras"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
              >
                Nova Feira
              </Link>
              <Link
                to="/produtos"
                className="px-4 py-2 bg-white/80 backdrop-blur-md text-slate-700 rounded-xl font-medium border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300 text-sm"
              >
                Ver Produtos
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-r from-white/95 via-blue-50/90 to-indigo-50/95 backdrop-blur-2xl rounded-2xl p-6 border border-slate-200/50 shadow-xl shadow-blue-500/10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-xl shadow-blue-500/40">
                  <SparklesIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
                    Painel de Controle
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Gerencie todo o seu sistema de feiras virtuais
                  </p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">
                Controle completo sobre feiras, expositores, produtos e
                ingressos. Monitore estatísticas em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards - MELHORADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {dashboardCards.map((card, index) => (
            <Link key={index} to={card.link} className="group block">
              <div
                className={`bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl ${card.shadowColor} hover:shadow-3xl transition-all duration-500 border border-slate-200/50 hover:border-slate-300/70 hover:scale-[1.02] hover:-translate-y-2 h-full relative overflow-hidden`}
              >
                {/* Decorative gradient line - MAIS ESPESSA */}
                <div
                  className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${card.color}`}
                ></div>

                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div
                    className={`w-full h-full bg-gradient-to-br ${card.color} rounded-full blur-3xl`}
                  ></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start space-x-6 mb-8">
                    <div
                      className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} shadow-2xl ${card.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    >
                      <card.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-base">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div
                      className={`px-6 py-3 ${card.bgColor} ${card.textColor} rounded-2xl text-base font-bold shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      Acessar Agora
                    </div>
                    <div className="p-3 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                      <ArrowRightIcon className="h-6 w-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay - MAIS INTENSO */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                ></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Informações Dinâmicas - SUBSTITUINDO OS CARDS ESTÁTICOS */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent mb-4">
              Visão Geral do Sistema
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Acompanhe as principais métricas e destaques do seu sistema em
              tempo real
            </p>

            {/* Debug Info - TEMPORÁRIO */}
            {dashboardData.error && (
              <div className="mt-4 p-6 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto">
                <p className="text-red-600 font-semibold mb-2">
                  Erro ao carregar dados:
                </p>
                <p className="text-red-500 text-sm mb-4">
                  {dashboardData.error}
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Fazer Login Novamente
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Recarregar Página
                  </button>
                </div>
                <p className="text-red-400 text-xs mt-3 text-center">
                  Verifique sua conexão com a internet e tente novamente
                </p>
              </div>
            )}
          </div>

          {dashboardData.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-slate-200/50 shadow-lg animate-pulse"
                >
                  <div className="h-4 bg-slate-200 rounded-full mb-4"></div>
                  <div className="h-16 bg-slate-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Total de Produtos */}
              <div className="bg-gradient-to-br from-white/95 to-purple-50/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-200/50 shadow-2xl shadow-purple-500/20 relative overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="absolute top-4 right-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <ShoppingBagIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Produtos Cadastrados
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-black text-purple-600">
                      {dashboardData.totalProdutos}
                    </span>
                    <span className="text-lg text-slate-600 font-medium">
                      produtos
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Total de produtos disponíveis no sistema de todas as feiras
                </p>
                <Link
                  to="/produtos"
                  className="inline-flex items-center space-x-2 text-purple-600 font-semibold mt-4 hover:text-purple-700 transition-colors"
                >
                  <span>Ver todos os produtos</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* Feira em Destaque */}
              <div className="bg-gradient-to-br from-white/95 to-emerald-50/80 backdrop-blur-xl rounded-3xl p-8 border border-emerald-200/50 shadow-2xl shadow-emerald-500/20 relative overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <div className="absolute top-4 right-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Feira em Destaque
                    </h3>
                    <FireIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  {dashboardData.feiraDestaque ? (
                    <div>
                      <div className="text-2xl font-black text-emerald-600 mb-2">
                        {dashboardData.feiraDestaque.nome}
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="text-sm text-slate-600">
                            {new Date(
                              dashboardData.feiraDestaque.data_inicio
                            ).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                          <TicketIcon className="h-3 w-3" />
                          <span>
                            {dashboardData.feiraDestaque.totalIngressos || 0}{' '}
                            ingressos
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xl text-slate-500">
                      Nenhuma feira cadastrada
                    </div>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {dashboardData.feiraDestaque
                    ? dashboardData.feiraDestaque.totalIngressos > 0
                      ? 'Feira com maior número de ingressos vendidos'
                      : 'Primeira feira cadastrada (ainda sem ingressos vendidos)'
                    : 'Cadastre sua primeira feira para ver os destaques'}
                </p>
                <Link
                  to="/feiras"
                  className="inline-flex items-center space-x-2 text-emerald-600 font-semibold mt-4 hover:text-emerald-700 transition-colors"
                >
                  <span>Ver todas as feiras</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* Total de Expositores */}
              <div className="bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-xl rounded-3xl p-8 border border-blue-200/50 shadow-2xl shadow-blue-500/20 relative overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="absolute top-4 right-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Expositores Ativos
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-black text-blue-600">
                      {dashboardData.totalExpositores}
                    </span>
                    <span className="text-lg text-slate-600 font-medium">
                      expositores
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Parceiros e expositores cadastrados no sistema
                </p>
                <Link
                  to="/expositores"
                  className="inline-flex items-center space-x-2 text-blue-600 font-semibold mt-4 hover:text-blue-700 transition-colors"
                >
                  <span>Ver todos os expositores</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
