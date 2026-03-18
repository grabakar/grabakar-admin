import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: baseURL ? `${baseURL}/api/v1` : '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
