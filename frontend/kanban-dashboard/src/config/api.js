// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    ME: '/api/me',
    USERS: '/api/users',
    TASKS: '/api/tasks',
    TASKS_STATS: '/api/tasks/stats',
    TASKS_BY_STATUS: '/api/tasks/by-status',
    TASKS_REORDER: '/api/tasks/reorder'
  }
}

// Função helper para fazer requisições
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Adicionar token de autorização se disponível
  const token = localStorage.getItem('token')
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

