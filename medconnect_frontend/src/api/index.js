const API_BASE = 'http://127.0.0.1:8000/api'

function getAuthHeaders() {
  const token = localStorage.getItem("access")
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

async function handleResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || data.detail || 'Request failed')
  }
  return data
}

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(res)
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/patients/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return handleResponse(res)
  },

  refreshToken: async (refreshToken) => {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    })
    return handleResponse(res)
  },

  // Symptoms
  predictSymptoms: async (symptoms) => {
    const res = await fetch(`${API_BASE}/symptoms/predict-and-recommend/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ symptoms })
    })
    return handleResponse(res)
  },

  // Consultations
  createConsultation: async (aiPrediction) => {
    const res = await fetch(`${API_BASE}/consultations/create/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ai_prediction: aiPrediction })
    })
    return handleResponse(res)
  },

  getPatientConsultations: async () => {
    const res = await fetch(`${API_BASE}/consultations/patient/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  getDoctorConsultations: async () => {
    const res = await fetch(`${API_BASE}/consultations/doctor/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  matchDoctors: async (consultationId) => {
    const res = await fetch(`${API_BASE}/doctors-match/match/${consultationId}/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  // Patient Profile
  getPatientProfile: async () => {
    const res = await fetch(`${API_BASE}/patients/profile/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  updatePatientProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/patients/profile/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    })
    return handleResponse(res)
  },

  // Doctor Registration
  registerDoctor: async (doctorData) => {
    const res = await fetch(`${API_BASE}/doctors/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    })
    return handleResponse(res)
  }
}
