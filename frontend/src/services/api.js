import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/'

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor para lidar com respostas e refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${API_BASE_URL}auth/token/refresh/`,
            {
              refresh: refreshToken
            }
          )

          localStorage.setItem('accessToken', data.access)
          api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
          originalRequest.headers['Authorization'] = `Bearer ${data.access}`
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

// Auth Services
export const authService = {
  register: async userData => {
    const response = await axios.post(`${API_BASE_URL}auth/register/`, userData)
    return response.data
  },

  login: async credentials => {
    const response = await axios.post(`${API_BASE_URL}auth/login/`, credentials)
    return response.data
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await axios.post(`${API_BASE_URL}auth/logout/`, { refresh: refreshToken })
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/')
    return response.data
  },

  updateProfile: async profileData => {
    const response = await api.put('/auth/profile/', profileData)
    return response.data
  },

  changePassword: async passwordData => {
    const response = await api.post('/auth/change-password/', passwordData)
    return response.data
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}

// Feira Services
export const feiraService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/feiras/', { params })
    return response.data
  },

  getById: async id => {
    const response = await api.get(`/api/feiras/${id}/`)
    return response.data
  },

  create: async data => {
    const response = await api.post('/api/feiras/', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/api/feiras/${id}/`, data)
    return response.data
  },

  delete: async id => {
    await api.delete(`/api/feiras/${id}/`)
  },

  getExpositores: async id => {
    const response = await api.get(`/api/feiras/${id}/expositores/`)
    return response.data
  }
}

// Expositor Services
export const expositorService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/expositores/', { params })
    return response.data
  },

  getById: async id => {
    const response = await api.get(`/api/expositores/${id}/`)
    return response.data
  },

  create: async data => {
    const response = await api.post('/api/expositores/', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/api/expositores/${id}/`, data)
    return response.data
  },

  delete: async id => {
    await api.delete(`/api/expositores/${id}/`)
  },

  getProdutos: async id => {
    const response = await api.get(`/api/expositores/${id}/produtos/`)
    return response.data
  }
}

// Produto Services
export const produtoService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/produtos/', { params })
    return response.data
  },

  getById: async id => {
    const response = await api.get(`/api/produtos/${id}/`)
    return response.data
  },

  create: async data => {
    const response = await api.post('/api/produtos/', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/api/produtos/${id}/`, data)
    return response.data
  },

  delete: async id => {
    await api.delete(`/api/produtos/${id}/`)
  }
}

// Ingresso Services
export const ingressoService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/ingressos/', { params })
    return response.data
  },

  getById: async id => {
    const response = await api.get(`/api/ingressos/${id}/`)
    return response.data
  },

  create: async data => {
    const response = await api.post('/api/ingressos/', data)
    return response.data
  },

  delete: async id => {
    await api.delete(`/api/ingressos/${id}/`)
  }
}

// Exportar a instância api tanto como default quanto nomeada
export { api }
export default api
