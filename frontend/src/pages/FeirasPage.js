import React, { useState, useEffect } from 'react'
import { feiraService } from '../services/api'
import Avatar from '../components/Avatar'

function FeirasPage() {
  const [feiras, setFeiras] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFeira, setEditingFeira] = useState(null)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando feiras...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Feiras</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Nova Feira
        </button>
      </div>

      {feiras.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Nenhuma feira encontrada. Crie a primeira!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feiras.map(feira => (
            <div key={feira.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-3 mb-4">
                <Avatar user={feira.criado_por} size="sm" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{feira.nome}</h3>
                  <p className="text-xs text-gray-400">
                    Criado por{' '}
                    {feira.criado_por?.first_name ||
                      feira.criado_por?.username ||
                      'Usuário'}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{feira.descricao}</p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Local:</strong> {feira.local}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Cidade:</strong> {feira.cidade}, {feira.estado}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Data:</strong> {feira.data_inicio} a{' '}
                {feira.data_termino}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Preço do Ingresso:</strong> R${' '}
                {feira.preco_ingresso
                  ? parseFloat(feira.preco_ingresso).toFixed(2)
                  : '10.00'}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(feira)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(feira.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `/expositores?feira=${feira.id}`)
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                >
                  Expositores
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
              {editingFeira ? 'Editar Feira' : 'Nova Feira'}
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
                  Local
                </label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={e =>
                    setFormData({ ...formData, local: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={e =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={e =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={formData.data_inicio}
                    onChange={e =>
                      setFormData({ ...formData, data_inicio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data Término
                  </label>
                  <input
                    type="date"
                    value={formData.data_termino}
                    onChange={e =>
                      setFormData({ ...formData, data_termino: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço do Ingresso (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.preco_ingresso}
                  onChange={e =>
                    setFormData({ ...formData, preco_ingresso: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingFeira ? 'Atualizar' : 'Criar'}
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

export default FeirasPage
