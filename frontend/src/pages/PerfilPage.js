import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/api'
import Avatar from '../components/Avatar'

function PerfilPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Dados do perfil
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  })

  // Dados da mudança de senha
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  })

  const [messages, setMessages] = useState({
    profile: '',
    password: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await authService.getProfile()
      setProfileData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || ''
      })
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      await authService.updateProfile(profileData)
      setMessages({ ...messages, profile: 'Perfil atualizado com sucesso!' })
      setTimeout(() => setMessages({ ...messages, profile: '' }), 3000)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      setMessages({
        ...messages,
        profile: 'Erro ao atualizar perfil. Tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async e => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      setMessages({ ...messages, password: 'As novas senhas não coincidem.' })
      return
    }

    try {
      setLoading(true)
      await authService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        new_password_confirm: passwordData.new_password_confirm
      })
      setMessages({ ...messages, password: 'Senha alterada com sucesso!' })
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
      })
      setTimeout(() => setMessages({ ...messages, password: '' }), 3000)
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      setMessages({
        ...messages,
        password: 'Erro ao alterar senha. Verifique a senha atual.'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading && !profileData.email) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando perfil...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

      {/* Informações do usuário */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <Avatar user={user} size="xl" />
          <div>
            <h2 className="text-xl font-semibold">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.username}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Membro desde:{' '}
              {user?.date_joined
                ? new Date(user.date_joined).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Data não disponível'}
            </p>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Informações Pessoais
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Alterar Senha
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={e =>
                      setProfileData({
                        ...profileData,
                        first_name: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={e =>
                      setProfileData({
                        ...profileData,
                        last_name: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={e =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {messages.profile && (
                <div
                  className={`p-3 rounded-md ${
                    messages.profile.includes('sucesso')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {messages.profile}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={e =>
                    setPasswordData({
                      ...passwordData,
                      old_password: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={e =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordData.new_password_confirm}
                  onChange={e =>
                    setPasswordData({
                      ...passwordData,
                      new_password_confirm: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {messages.password && (
                <div
                  className={`p-3 rounded-md ${
                    messages.password.includes('sucesso')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {messages.password}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PerfilPage
