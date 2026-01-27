const API_BASE_URL = "http://127.0.0.1:8000"

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem("access")
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  }
}

// Helper to handle API responses
async function handleResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || data.message || JSON.stringify(data))
  }
  return data
}

export const api = {
  // Auth
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

  async refreshToken(refreshToken) {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken })
    })
    return handleResponse(response)
  },

  // Patient Registration
  async register(data) {
    const response = await fetch(`${API_BASE_URL}/api/patients/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Patient Profile
  async getPatientProfile() {
    const response = await fetch(`${API_BASE_URL}/api/patients/profile/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updatePatientProfile(data) {
    const response = await fetch(`${API_BASE_URL}/api/patients/profile/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Chatbot
  async sendChatMessage(text, file = null) {
    const formData = new FormData()
    if (text) formData.append("text", text)
    if (file) formData.append("file", file)

    const token = localStorage.getItem("access")
    const response = await fetch(`${API_BASE_URL}/api/chat/`, {
      method: "POST",
      headers: {
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Symptom Prediction
  async predictSymptoms(symptoms) {
    const response = await fetch(`${API_BASE_URL}/api/symptoms/predict-and-recommend/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ symptoms })
    })
    return handleResponse(response)
  },

  // Consultations
  async createConsultation(aiPrediction) {
    const response = await fetch(`${API_BASE_URL}/api/consultations/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ai_prediction: aiPrediction })
    })
    return handleResponse(response)
  },

  async bookConsultation(data) {
    const response = await fetch(`${API_BASE_URL}/api/consultations/book/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async getPatientConsultations(status = null) {
    const url = status 
      ? `${API_BASE_URL}/api/consultations/patient/?status=${status}`
      : `${API_BASE_URL}/api/consultations/patient/`
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getDoctorConsultations(status = null) {
    const url = status 
      ? `${API_BASE_URL}/api/consultations/doctor/?status=${status}`
      : `${API_BASE_URL}/api/consultations/doctor/`
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getConsultationDetail(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${consultationId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async acceptConsultation(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${consultationId}/accept/`, {
      method: "POST",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async rejectConsultation(consultationId, reason = '') {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${consultationId}/reject/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    })
    return handleResponse(response)
  },

  async startConsultation(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${consultationId}/start/`, {
      method: "POST",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateConsultationStatus(consultationId, data) {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${consultationId}/update-status/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async cancelConsultation(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${consultationId}/cancel/`, {
      method: "POST",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Doctors - Public Listing
  async getDoctorsList(filters = {}) {
    const params = new URLSearchParams()
    if (filters.specialization) params.append('specialization', filters.specialization)
    if (filters.is_online) params.append('is_online', filters.is_online)
    if (filters.min_rating) params.append('min_rating', filters.min_rating)
    if (filters.max_fee) params.append('max_fee', filters.max_fee)
    if (filters.search) params.append('search', filters.search)
    
    const url = `${API_BASE_URL}/api/doctors/list/?${params.toString()}`
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    return handleResponse(response)
  },

  async getDoctorDetail(doctorId) {
    const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    return handleResponse(response)
  },

  async getSpecializations() {
    const response = await fetch(`${API_BASE_URL}/api/doctors/specializations/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    return handleResponse(response)
  },

  // Doctor's own profile & dashboard
  async getDoctorProfile() {
    const response = await fetch(`${API_BASE_URL}/api/doctors/profile/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateDoctorProfile(data) {
    const response = await fetch(`${API_BASE_URL}/api/doctors/profile/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async getDoctorDashboard() {
    const response = await fetch(`${API_BASE_URL}/api/doctors/dashboard/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateOnlineStatus(isOnline) {
    const response = await fetch(`${API_BASE_URL}/api/doctors/online-status/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_online: isOnline })
    })
    return handleResponse(response)
  },

  // Doctor Registration
  async registerDoctor(data) {
    const response = await fetch(`${API_BASE_URL}/api/doctors/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Reviews
  async submitReview(doctorId, data) {
    const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/review/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Doctor Match (existing)
  async getDoctorMatch(symptoms) {
    const response = await fetch(`${API_BASE_URL}/api/doctors-match/match/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ symptoms })
    })
    return handleResponse(response)
  },

  // ============ Video Call / Teleconsultation ============
  
  async createVideoRoom(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/video/create-room/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ consultation_id: consultationId })
    })
    return handleResponse(response)
  },

  async getVideoToken(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/video/get-token/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ consultation_id: consultationId })
    })
    return handleResponse(response)
  },

  async endVideoCall(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/video/end-call/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ consultation_id: consultationId })
    })
    return handleResponse(response)
  },

  async leaveVideoCall(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/video/leave/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ consultation_id: consultationId })
    })
    return handleResponse(response)
  },

  async getVideoRoomStatus(consultationId) {
    const response = await fetch(`${API_BASE_URL}/api/video/status/${consultationId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

export default api
