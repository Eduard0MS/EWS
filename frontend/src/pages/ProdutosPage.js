import React, { useState, useEffect } from 'react'
import { produtoService, expositorService } from '../services/api'
import { useLocation } from 'react-router-dom'
import {
  ShoppingBagIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TagIcon
} from '@heroicons/react/24/outline'

function ProdutosPage() {
  const [produtos, setProdutos] = useState([])
  const [expositores, setExpositores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [selectedExpositor, setSelectedExpositor] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    expositor: ''
  })

  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const expositorFromUrl = urlParams.get('expositor')

  useEffect(() => {
    loadData()
    if (expositorFromUrl) {
      setSelectedExpositor(expositorFromUrl)
    }
  }, [expositorFromUrl])

  const loadData = async () => {
    try {
      setLoading(true)
      const [produtosData, expositoresData] = await Promise.all([
        produtoService.getAll(),
        expositorService.getAll()
      ])
      setProdutos(produtosData.results || produtosData)
      setExpositores(expositoresData.results || expositoresData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        preco: parseFloat(formData.preco)
      }

      if (editingProduto) {
        await produtoService.update(editingProduto.id, dataToSend)
      } else {
        await produtoService.create(dataToSend)
      }
      setShowModal(false)
      setEditingProduto(null)
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        expositor: ''
      })
      loadData()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Erro desconhecido'
      alert('Erro ao salvar produto: ' + errorMessage)
    }
  }

  const handleEdit = produto => {
    setEditingProduto(produto)
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      expositor: produto.expositor
    })
    setShowModal(true)
  }

  const handleDelete = async id => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await produtoService.delete(id)
        loadData()
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
        alert('Erro ao excluir produto.')
      }
    }
  }

  const openCreateModal = () => {
    setEditingProduto(null)
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      expositor: selectedExpositor || ''
    })
    setShowModal(true)
  }

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch =
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesExpositor = selectedExpositor
      ? produto.expositor === selectedExpositor
      : true
    return matchesSearch && matchesExpositor
  })

  const getExpositorName = expositorId => {
    const expositor = expositores.find(exp => exp.id === expositorId)
    return expositor ? expositor.nome : 'Expositor não encontrado'
  }

  const getFeiraName = expositorId => {
    const expositor = expositores.find(exp => exp.id === expositorId)
    return expositor ? expositor.feira_nome : 'Feira não encontrada'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-slate-700">
            Carregando produtos...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-700 rounded-xl shadow-lg">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Gerenciar Produtos
                </h1>
                <p className="text-slate-600 mt-1">
                  Cadastre e gerencie produtos dos expositores
                </p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="font-semibold">Novo Produto</span>
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
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-slate-400" />
              </div>
              <select
                value={selectedExpositor}
                onChange={e => setSelectedExpositor(e.target.value)}
                className="block w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none"
              >
                <option value="">Todos os expositores</option>
                {expositores.map(expositor => (
                  <option key={expositor.id} value={expositor.id}>
                    {expositor.nome} - {expositor.feira_nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredProdutos.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <ShoppingBagIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm || selectedExpositor
                  ? 'Nenhum produto encontrado'
                  : 'Nenhum produto cadastrado'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || selectedExpositor
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece cadastrando o primeiro produto!'}
              </p>
              {!searchTerm && !selectedExpositor && (
                <button
                  onClick={openCreateModal}
                  className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Cadastrar Primeiro Produto
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProdutos.map(produto => (
              <div
                key={produto.id}
                className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-slate-300/50 hover:scale-105"
              >
                {/* Header do Card */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {produto.nome}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-700 rounded-lg">
                      <TagIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-emerald-600">
                      R$ {parseFloat(produto.preco).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {produto.descricao}
                </p>

                {/* Informações */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <UserGroupIcon className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-purple-600">
                      {produto.expositor_nome ||
                        getExpositorName(produto.expositor)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <BuildingStorefrontIcon className="h-4 w-4 text-slate-400" />
                    <span>
                      {produto.feira_nome || getFeiraName(produto.expositor)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(produto)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-amber-50 text-amber-600 px-3 py-2 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Excluir</span>
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
                  {editingProduto ? 'Editar Produto' : 'Novo Produto'}
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
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={e =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Digite o nome do produto"
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
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Descreva o produto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Preço (R$)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.preco}
                        onChange={e =>
                          setFormData({ ...formData, preco: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Expositor
                    </label>
                    <select
                      required
                      value={formData.expositor}
                      onChange={e =>
                        setFormData({ ...formData, expositor: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Selecione um expositor</option>
                      {expositores.map(expositor => (
                        <option key={expositor.id} value={expositor.id}>
                          {expositor.nome} - {expositor.feira_nome}
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
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    {editingProduto ? 'Atualizar' : 'Criar'} Produto
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

export default ProdutosPage
