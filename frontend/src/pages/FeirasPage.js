import React, { useState, useEffect } from 'react'
import { feiraService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import {
  BuildingStorefrontIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

function FeirasPage() {
  const navigate = useNavigate()
  const [feiras, setFeiras] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFeira, setEditingFeira] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_termino: '',
    local: '',
    cidade: '',
    estado: '',
    preco_ingresso: ''
  })

  useEffect(() => {
    loadFeiras()
  }, [])

  const loadFeiras = async () => {
    try {
      setLoading(true)
      const data = await feiraService.getAll()
      setFeiras(data.results || data)
    } catch (error) {
      console.error('Erro ao carregar feiras:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editingFeira) {
        await feiraService.update(editingFeira.id, formData)
      } else {
        await feiraService.create(formData)
      }
      setShowModal(false)
      setEditingFeira(null)
      setFormData({
        nome: '',
        descricao: '',
        data_inicio: '',
        data_termino: '',
        local: '',
        cidade: '',
        estado: '',
        preco_ingresso: ''
      })
      loadFeiras()
    } catch (error) {
      console.error('Erro ao salvar feira:', error)
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Erro desconhecido'
      alert('Erro ao salvar feira: ' + errorMessage)
    }
  }

  const handleEdit = feira => {
    setEditingFeira(feira)
    setFormData({
      nome: feira.nome,
      descricao: feira.descricao,
      data_inicio: feira.data_inicio,
      data_termino: feira.data_termino,
      local: feira.local,
      cidade: feira.cidade,
      estado: feira.estado,
      preco_ingresso: feira.preco_ingresso || ''
    })
    setShowModal(true)
  }

  const handleDelete = async id => {
    if (window.confirm('Tem certeza que deseja excluir esta feira?')) {
      try {
        await feiraService.delete(id)
        loadFeiras()
      } catch (error) {
        console.error('Erro ao excluir feira:', error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingFeira(null)
    setFormData({
      nome: '',
      descricao: '',
      data_inicio: '',
      data_termino: '',
      local: '',
      cidade: '',
      estado: '',
      preco_ingresso: ''
    })
    setShowModal(true)
  }

  const filteredFeiras = feiras.filter(
    feira =>
      feira.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feira.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feira.estado.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-slate-700">
            Carregando feiras...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                <BuildingStorefrontIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Gerenciar Feiras
                </h1>
                <p className="text-slate-600 mt-1">
                  Organize e gerencie todas as suas feiras
                </p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="font-semibold">Nova Feira</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar feiras..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Content */}
        {filteredFeiras.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <BuildingStorefrontIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm
                  ? 'Nenhuma feira encontrada'
                  : 'Nenhuma feira cadastrada'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm
                  ? 'Tente ajustar os termos de busca'
                  : 'Comece criando sua primeira feira!'}
              </p>
              {!searchTerm && (
                <button
                  onClick={openCreateModal}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Criar Primeira Feira
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeiras.map(feira => (
              <div
                key={feira.id}
                className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-slate-300/50 hover:scale-105"
              >
                {/* Header do Card */}
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar user={feira.criado_por} size="sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {feira.nome}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Criado por{' '}
                      {feira.criado_por?.first_name ||
                        feira.criado_por?.username ||
                        'Usuário'}
                    </p>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {feira.descricao}
                </p>

                {/* Informações */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPinIcon className="h-4 w-4 text-slate-400" />
                    <span>{feira.local}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <BuildingStorefrontIcon className="h-4 w-4 text-slate-400" />
                    <span>
                      {feira.cidade}, {feira.estado}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <CalendarIcon className="h-4 w-4 text-slate-400" />
                    <span>
                      {feira.data_inicio} a {feira.data_termino}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <CurrencyDollarIcon className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-emerald-600">
                      R${' '}
                      {feira.preco_ingresso
                        ? parseFloat(feira.preco_ingresso).toFixed(2)
                        : '10.00'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(feira)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-amber-50 text-amber-600 px-3 py-2 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(feira.id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Excluir</span>
                  </button>
                  <button
                    onClick={() => navigate(`/expositores?feira=${feira.id}`)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                  >
                    <UserGroupIcon className="h-4 w-4" />
                    <span>Expositores</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Criação/Edição */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingFeira ? 'Editar Feira' : 'Nova Feira'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nome da Feira
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={e =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Digite o nome da feira"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      required
                      value={formData.descricao}
                      onChange={e =>
                        setFormData({ ...formData, descricao: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Descreva a feira"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.data_inicio}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          data_inicio: e.target.value
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Data de Término
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.data_termino}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          data_termino: e.target.value
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Local
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.local}
                      onChange={e =>
                        setFormData({ ...formData, local: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Endereço do local"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={e =>
                        setFormData({ ...formData, cidade: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.estado}
                      onChange={e =>
                        setFormData({ ...formData, estado: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="UF do estado"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Preço do Ingresso (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco_ingresso}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          preco_ingresso: e.target.value
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="10.00"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    {editingFeira ? 'Atualizar' : 'Criar'} Feira
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

export default FeirasPage
