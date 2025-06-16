import React, { useState, useEffect } from 'react'
import { ingressoService, feiraService } from '../services/api'
import Avatar from '../components/Avatar'

function IngressosPage() {
  const [ingressos, setIngressos] = useState([])
  const [feiras, setFeiras] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedFeira, setSelectedFeira] = useState('')

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando ingressos...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Meus Ingressos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Comprar Ingresso
        </button>
      </div>

      {ingressos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Você ainda não possui ingressos. Compre o primeiro!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingressos.map(ingresso => (
            <div
              key={ingresso.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar user={ingresso.criado_por} size="sm" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {ingresso.feira_nome || 'Feira'}
                    </h3>
                    <p className="text-xs text-gray-400">Seu ingresso</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Ativo
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Código:</strong> {ingresso.numero_ingresso}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Data de Compra:</strong>{' '}
                  {new Date(ingresso.data_emissao).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Preço:</strong> R$ {ingresso.preco || 'N/A'}
                </p>
              </div>

              <button
                onClick={() => handleCancelarIngresso(ingresso.id)}
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Cancelar Ingresso
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Compra de Ingresso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Comprar Ingresso</h2>

            <form onSubmit={handleComprarIngresso} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione uma Feira
                </label>
                <select
                  value={selectedFeira}
                  onChange={e => setSelectedFeira(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Escolha uma feira...</option>
                  {feiras.map(feira => (
                    <option key={feira.id} value={feira.id}>
                      {feira.nome} - R$ {feira.preco_ingresso}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFeira && (
                <div className="bg-gray-50 p-4 rounded-md">
                  {feiras.find(f => f.id == selectedFeira) && (
                    <div>
                      <h4 className="font-medium">Detalhes da Feira:</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {feiras.find(f => f.id == selectedFeira).descricao}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Local:</strong>{' '}
                        {feiras.find(f => f.id == selectedFeira).local}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Data:</strong>{' '}
                        {new Date(
                          feiras.find(f => f.id == selectedFeira).data_inicio
                        ).toLocaleDateString('pt-BR')}{' '}
                        a{' '}
                        {new Date(
                          feiras.find(f => f.id == selectedFeira).data_termino
                        ).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={!selectedFeira}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  Comprar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedFeira('')
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default IngressosPage
