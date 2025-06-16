import React, { useState, useEffect } from 'react'
import { ingressoService, feiraService } from '../services/api'
import Avatar from '../components/Avatar'
import {
  TicketIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

function IngressosPage() {
  const [ingressos, setIngressos] = useState([])
  const [feiras, setFeiras] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedFeira, setSelectedFeira] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ingressosData, feirasData] = await Promise.all([
        ingressoService.getAll(),
        feiraService.getAll()
      ])
      setIngressos(ingressosData.results || ingressosData)
      setFeiras(feirasData.results || feirasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComprarIngresso = async e => {
    e.preventDefault()
    if (!selectedFeira) return

    try {
      await ingressoService.create({ feira: selectedFeira })
      setShowModal(false)
      setSelectedFeira('')
      loadData()
    } catch (error) {
      console.error('Erro ao comprar ingresso:', error)
      alert('Erro ao comprar ingresso. Tente novamente.')
    }
  }

  const handleCancelarIngresso = async id => {
    if (window.confirm('Tem certeza que deseja cancelar este ingresso?')) {
      try {
        await ingressoService.delete(id)
        loadData()
      } catch (error) {
        console.error('Erro ao cancelar ingresso:', error)
        alert('Erro ao cancelar ingresso. Tente novamente.')
      }
    }
  }

  const filteredIngressos = ingressos.filter(
    ingresso =>
      ingresso.feira_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingresso.numero_ingresso?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedFeiraData = feiras.find(f => f.id == selectedFeira)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-slate-700">
            Carregando ingressos...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-700 rounded-xl shadow-lg">
                <TicketIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Meus Ingressos
                </h1>
                <p className="text-slate-600 mt-1">
                  Gerencie seus ingressos para as feiras
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="font-semibold">Comprar Ingresso</span>
            </button>
          </div>

          {/* Search Bar */}
          {ingressos.length > 0 && (
            <div className="mt-6 relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar ingressos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
        </div>

        {/* Content */}
        {filteredIngressos.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <TicketIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm
                  ? 'Nenhum ingresso encontrado'
                  : 'Nenhum ingresso ainda'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm
                  ? 'Tente ajustar os termos de busca'
                  : 'Você ainda não possui ingressos. Compre o primeiro!'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Comprar Primeiro Ingresso
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIngressos.map(ingresso => (
              <div
                key={ingresso.id}
                className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-slate-300/50 hover:scale-105 relative overflow-hidden"
              >
                {/* Decorative gradient border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

                {/* Header do Card */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar user={ingresso.criado_por} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-1 truncate group-hover:text-amber-600 transition-colors">
                        {ingresso.feira_nome || 'Feira'}
                      </h3>
                      <p className="text-xs text-slate-500">Seu ingresso</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3" />
                    <span>Ativo</span>
                  </div>
                </div>

                {/* Informações do Ingresso */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <TicketIcon className="h-4 w-4 text-slate-400" />
                    <span className="font-mono font-medium">
                      {ingresso.numero_ingresso}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <CalendarIcon className="h-4 w-4 text-slate-400" />
                    <span>
                      Comprado em{' '}
                      {new Date(ingresso.data_emissao).toLocaleDateString(
                        'pt-BR'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <CurrencyDollarIcon className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-emerald-600">
                      R$ {ingresso.preco || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleCancelarIngresso(ingresso.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl hover:bg-red-100 transition-colors font-medium"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Cancelar Ingresso</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Compra de Ingresso */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Comprar Ingresso
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedFeira('')
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleComprarIngresso} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Selecione uma Feira
                  </label>
                  <select
                    value={selectedFeira}
                    onChange={e => setSelectedFeira(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Escolha uma feira...</option>
                    {feiras.map(feira => (
                      <option key={feira.id} value={feira.id}>
                        {feira.nome} - R$ {feira.preco_ingresso || '10.00'}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedFeiraData && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center space-x-2">
                      <TicketIcon className="h-5 w-5 text-amber-600" />
                      <span>Detalhes da Feira</span>
                    </h4>
                    <div className="space-y-3">
                      <p className="text-slate-700">
                        {selectedFeiraData.descricao}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <MapPinIcon className="h-4 w-4 text-slate-400" />
                        <span>{selectedFeiraData.local}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                        <span>
                          {new Date(
                            selectedFeiraData.data_inicio
                          ).toLocaleDateString('pt-BR')}{' '}
                          a{' '}
                          {new Date(
                            selectedFeiraData.data_termino
                          ).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CurrencyDollarIcon className="h-4 w-4 text-emerald-500" />
                        <span className="font-bold text-emerald-600 text-lg">
                          R$ {selectedFeiraData.preco_ingresso || '10.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setSelectedFeira('')
                    }}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFeira}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comprar Ingresso
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IngressosPage
