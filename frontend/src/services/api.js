const API_BASE_URL = 'http://localhost:5000/api'

const getToken = () => {
  return localStorage.getItem('token')
}

const request = async (endpoint, options = {}) => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

const api = {
  register: async (name, email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
  },

  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
  },

  uploadApplication: async (formData) => {
    return request('/customer/upload', {
      method: 'POST',
      body: formData,
    })
  },

  getCustomerApplications: async () => {
    return request('/customer/applications')
  },

  getAdminApplications: async () => {
    return request('/admin/applications')
  },

  approveApplication: async (applicationId) => {
    return request(`/admin/applications/${applicationId}/approve`, {
      method: 'PUT',
    })
  },

  rejectApplication: async (applicationId) => {
    return request(`/admin/applications/${applicationId}/reject`, {
      method: 'PUT',
    })
  },

  getLogs: async () => {
    return request('/admin/logs')
  },
}

export default api
