import React, { useState, useEffect } from 'react'
import { produtoService, expositorService } from '../services/api'
import { useLocation } from 'react-router-dom'

function ProdutosPage() {
  const [produtos, setProdutos] = useState([])
  const [expositores, setExpositores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [selectedExpositor, setSelectedExpositor] = useState('')
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

  const filteredProdutos = selectedExpositor
    ? produtos.filter(prod => prod.expositor === selectedExpositor)
    : produtos

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
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando produtos...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Novo Produto
        </button>
      </div>

      {/* Filtro por Expositor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por Expositor
        </label>
        <select
          value={selectedExpositor}
          onChange={e => setSelectedExpositor(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os expositores</option>
          {expositores.map(expositor => (
            <option key={expositor.id} value={expositor.id}>
              {expositor.nome} - {expositor.feira_nome}
            </option>
          ))}
        </select>
      </div>

      {filteredProdutos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {selectedExpositor
              ? 'Nenhum produto encontrado para este expositor.'
              : 'Nenhum produto encontrado. Crie o primeiro!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProdutos.map(produto => (
            <div key={produto.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{produto.nome}</h3>
              <p className="text-gray-600 mb-2">{produto.descricao}</p>
              <p className="text-lg font-bold text-green-600 mb-2">
                R$ {parseFloat(produto.preco).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Expositor:</strong> {produto.expositor_nome}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Feira:</strong> {produto.feira_nome}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(produto)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(produto.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduto ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={e =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.preco}
                  onChange={e =>
                    setFormData({ ...formData, preco: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expositor
                </label>
                <select
                  value={formData.expositor}
                  onChange={e =>
                    setFormData({ ...formData, expositor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um expositor</option>
                  {expositores.map(expositor => (
                    <option key={expositor.id} value={expositor.id}>
                      {expositor.nome} - {expositor.feira_nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingProduto ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default ProdutosPage
