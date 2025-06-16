import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import { feiraService } from '../services/api'
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  TicketIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ArrowRightIcon
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
        'Crie e gerencie feiras com informações completas sobre local, datas e descrição.'
    },
    {
      icon: UserGroupIcon,
      title: 'Expositores',
      description:
        'Cadastre expositores e permita que eles participem das suas feiras.'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Catálogo de Produtos',
      description:
        'Cada expositor pode cadastrar seus produtos com preços e descrições.'
    },
    {
      icon: TicketIcon,
      title: 'Sistema de Ingressos',
      description: 'Gere ingressos únicos para controle de acesso às feiras.'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sistema de Gestão de Feiras
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Organize, gerencie e participe de feiras de forma simples e
              eficiente
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/feiras"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Ver Feiras Disponíveis
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-lg text-gray-600">
              Tudo que você precisa para organizar e participar de feiras
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Fairs Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Feiras em Destaque
            </h2>
            <p className="text-lg text-gray-600">
              Confira as últimas feiras cadastradas no sistema
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : feiras.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {feiras.map(feira => (
                <div
                  key={feira.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feira.nome}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {feira.descricao}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-2" />
                        {new Date(feira.data_inicio).toLocaleDateString(
                          'pt-BR'
                        )}{' '}
                        -{' '}
                        {new Date(feira.data_termino).toLocaleDateString(
                          'pt-BR'
                        )}
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {feira.cidade}, {feira.estado}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/feiras/${feira.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                      >
                        Ver detalhes
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <BuildingStorefrontIcon className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhuma feira cadastrada ainda.</p>
            </div>
          )}

          {feiras.length > 0 && (
            <div className="text-center">
              <Link
                to="/feiras"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Ver todas as feiras
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Crie sua conta e comece a organizar suas feiras hoje mesmo
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Criar Conta Grátis
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
