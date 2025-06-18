import React, { useState, useEffect } from 'react'
import { expositorService, feiraService } from '../services/api'
import { useLocation, useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

function ExpositoresPage() {
  const [expositores, setExpositores] = useState([])
  const [feiras, setFeiras] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExpositor, setEditingExpositor] = useState(null)
  const [selectedFeira, setSelectedFeira] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    contato: '',
    feira: ''
  })

  const location = useLocation()
  const navigate = useNavigate()
  const urlParams = new URLSearchParams(location.search)
  const feiraFromUrl = urlParams.get('feira')

  useEffect(() => {
    loadData()
    if (feiraFromUrl) {
      setSelectedFeira(feiraFromUrl)
    }
  }, [feiraFromUrl])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expositoresData, feirasData] = await Promise.all([
        expositorService.getAll(),
        feiraService.getAll()
      ])
      setExpositores(expositoresData.results || expositoresData)
      setFeiras(feirasData.results || feirasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editingExpositor) {
        await expositorService.update(editingExpositor.id, formData)
      } else {
        await expositorService.create(formData)
      }
      setShowModal(false)
      setEditingExpositor(null)
      setFormData({
        nome: '',
        descricao: '',
        contato: '',
        feira: ''
      })
      loadData()
    } catch (error) {
      console.error('Erro ao salvar expositor:', error)
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Erro desconhecido'
      alert('Erro ao salvar expositor: ' + errorMessage)
    }
  }

  const handleEdit = expositor => {
    setEditingExpositor(expositor)
    setFormData({
      nome: expositor.nome,
      descricao: expositor.descricao,
      contato: expositor.contato,
      feira: expositor.feira
    })
    setShowModal(true)
  }

  const handleDelete = async id => {
    if (window.confirm('Tem certeza que deseja excluir este expositor?')) {
      try {
        await expositorService.delete(id)
        loadData()
      } catch (error) {
        console.error('Erro ao excluir expositor:', error)
        alert(
          'Erro ao excluir expositor. Verifique se não há produtos associados.'
        )
      }
    }
  }

  const openCreateModal = () => {
    setEditingExpositor(null)
    setFormData({
      nome: '',
      descricao: '',
      contato: '',
      feira: selectedFeira || ''
    })
    setShowModal(true)
  }

  const filteredExpositores = expositores.filter(expositor => {
    const matchesSearch =
      expositor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expositor.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expositor.contato.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFeira = selectedFeira
      ? expositor.feira === selectedFeira
      : true
    return matchesSearch && matchesFeira
  })

  const getFeiraName = feiraId => {
    const feira = feiras.find(f => f.id === feiraId)
    return feira ? feira.nome : 'Feira não encontrada'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-slate-700">
            Carregando expositores...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl shadow-lg">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Gerenciar Expositores
                </h1>
                <p className="text-slate-600 mt-1">
                  Cadastre e gerencie expositores das feiras
                </p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="font-semibold">Novo Expositor</span>
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar expositores..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-slate-400" />
              </div>
              <select
                value={selectedFeira}
                onChange={e => setSelectedFeira(e.target.value)}
                className="block w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 appearance-none"
              >
                <option value="">Todas as feiras</option>
                {feiras.map(feira => (
                  <option key={feira.id} value={feira.id}>
                    {feira.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredExpositores.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <UserGroupIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm || selectedFeira
                  ? 'Nenhum expositor encontrado'
                  : 'Nenhum expositor cadastrado'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || selectedFeira
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece cadastrando o primeiro expositor!'}
              </p>
              {!searchTerm && !selectedFeira && (
                <button
                  onClick={openCreateModal}
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Cadastrar Primeiro Expositor
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExpositores.map(expositor => (
              <div
                key={expositor.id}
                className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-slate-300/50 hover:scale-105"
              >
                {/* Header do Card */}
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar user={expositor.criado_por} size="sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 truncate group-hover:text-emerald-600 transition-colors">
                      {expositor.nome}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Criado por{' '}
                      {expositor.criado_por?.first_name ||
                        expositor.criado_por?.username ||
                        'Usuário'}
                    </p>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {expositor.descricao}
                </p>

                {/* Informações */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                    <span>{expositor.contato}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <BuildingStorefrontIcon className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-emerald-600">
                      {expositor.feira_nome || getFeiraName(expositor.feira)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(expositor)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-amber-50 text-amber-600 px-3 py-2 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(expositor.id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Excluir</span>
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/produtos?expositor=${expositor.id}`)
                    }
                    className="flex-1 flex items-center justify-center space-x-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                  >
                    <ShoppingBagIcon className="h-4 w-4" />
                    <span>Produtos</span>
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
                  {editingExpositor ? 'Editar Expositor' : 'Novo Expositor'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nome do Expositor
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={e =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      placeholder="Digite o nome do expositor"
                    />
                  </div>

                  <div>
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
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Descreva o expositor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Contato
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contato}
                      onChange={e =>
                        setFormData({ ...formData, contato: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      placeholder="Email, telefone ou outro contato"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Feira
                    </label>
                    <select
                      required
                      value={formData.feira}
                      onChange={e =>
                        setFormData({ ...formData, feira: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Selecione uma feira</option>
                      {feiras.map(feira => (
                        <option key={feira.id} value={feira.id}>
                          {feira.nome}
                        </option>
                      ))}
                    </select>
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
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    {editingExpositor ? 'Atualizar' : 'Criar'} Expositor
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

export default ExpositoresPage
