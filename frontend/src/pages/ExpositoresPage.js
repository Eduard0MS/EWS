import React, { useState, useEffect } from 'react'
import { expositorService, feiraService } from '../services/api'
import { useLocation } from 'react-router-dom'
import Avatar from '../components/Avatar'

function ExpositoresPage() {
  const [expositores, setExpositores] = useState([])
  const [feiras, setFeiras] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExpositor, setEditingExpositor] = useState(null)
  const [selectedFeira, setSelectedFeira] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    contato: '',
    feira: ''
  })

  const location = useLocation()
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
      feira: ''
    })
    setShowModal(true)
  }

  const filteredExpositores = selectedFeira
    ? expositores.filter(exp => exp.feira === selectedFeira)
    : expositores

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando expositores...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciar Expositores
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Novo Expositor
        </button>
      </div>

      {/* Filtro por Feira */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por Feira
        </label>
        <select
          value={selectedFeira}
          onChange={e => setSelectedFeira(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as feiras</option>
          {feiras.map(feira => (
            <option key={feira.id} value={feira.id}>
              {feira.nome}
            </option>
          ))}
        </select>
      </div>

      {filteredExpositores.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {selectedFeira
              ? 'Nenhum expositor encontrado para esta feira.'
              : 'Nenhum expositor encontrado. Crie o primeiro!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpositores.map(expositor => (
            <div
              key={expositor.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start space-x-3 mb-4">
                <Avatar user={expositor.criado_por} size="sm" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">
                    {expositor.nome}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Criado por{' '}
                    {expositor.criado_por?.first_name ||
                      expositor.criado_por?.username ||
                      'Usuário'}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{expositor.descricao}</p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Contato:</strong> {expositor.contato}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Feira:</strong> {expositor.feira_nome}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(expositor)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(expositor.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `/produtos?expositor=${expositor.id}`)
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                >
                  Produtos
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
              {editingExpositor ? 'Editar Expositor' : 'Novo Expositor'}
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
                  Contato
                </label>
                <input
                  type="text"
                  value={formData.contato}
                  onChange={e =>
                    setFormData({ ...formData, contato: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email, telefone ou outro contato"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Feira
                </label>
                <select
                  value={formData.feira}
                  onChange={e =>
                    setFormData({ ...formData, feira: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma feira</option>
                  {feiras.map(feira => (
                    <option key={feira.id} value={feira.id}>
                      {feira.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingExpositor ? 'Atualizar' : 'Criar'}
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

export default ExpositoresPage
