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

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: unknown) => void, reject: (reason?: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const originalRequest = err.config

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh/') || originalRequest.url?.includes('/auth/login/')) {
        localStorage.removeItem('admin_user')
        localStorage.removeItem('admin_access_token')
        localStorage.removeItem('admin_refresh_token')
        window.location.hash = '/login'
        return Promise.reject(err)
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('admin_refresh_token')
      if (!refreshToken) {
        localStorage.removeItem('admin_user')
        localStorage.removeItem('admin_access_token')
        window.location.hash = '/login'
        return Promise.reject(err)
      }

      try {
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, {
          refresh_token: refreshToken
        })

        const newToken = data.access_token
        localStorage.setItem('admin_access_token', newToken)
        
        originalRequest.headers.Authorization = 'Bearer ' + newToken
        processQueue(null, newToken)
        
        return api(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        localStorage.removeItem('admin_user')
        localStorage.removeItem('admin_access_token')
        localStorage.removeItem('admin_refresh_token')
        window.location.hash = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  }
)
