// API Service for MedConnect AI - Updated March 2026
const API_BASE = 'http://104.208.88.185:8000/api'

function getAuthHeaders() {
  const token = localStorage.getItem("access")
  const headers = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
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
  },

  // ========================
  // Lab Test Booking APIs
  // ========================

  // Categories
  getLabTestCategories: async () => {
    const res = await fetch(`${API_BASE}/lab-tests/categories/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  // Labs
  getLabs: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const res = await fetch(`${API_BASE}/lab-tests/labs/${params ? '?' + params : ''}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  getLabDetail: async (labId) => {
    const res = await fetch(`${API_BASE}/lab-tests/labs/${labId}/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  getLabReviews: async (labId) => {
    const res = await fetch(`${API_BASE}/lab-tests/labs/${labId}/reviews/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  // Lab Tests
  getLabTests: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const res = await fetch(`${API_BASE}/lab-tests/tests/${params ? '?' + params : ''}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  getLabTestDetail: async (testId) => {
    const res = await fetch(`${API_BASE}/lab-tests/tests/${testId}/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  getPopularTests: async () => {
    const res = await fetch(`${API_BASE}/lab-tests/tests/popular/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  // Packages
  getLabTestPackages: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const res = await fetch(`${API_BASE}/lab-tests/packages/${params ? '?' + params : ''}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  getLabTestPackageDetail: async (packageId) => {
    const res = await fetch(`${API_BASE}/lab-tests/packages/${packageId}/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  getFeaturedPackages: async () => {
    const res = await fetch(`${API_BASE}/lab-tests/packages/featured/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  // Cart
  getCart: async () => {
    const res = await fetch(`${API_BASE}/lab-tests/cart/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  addToCart: async (data) => {
    const res = await fetch(`${API_BASE}/lab-tests/cart/add/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(res)
  },

  removeFromCart: async (data) => {
    const res = await fetch(`${API_BASE}/lab-tests/cart/remove/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(res)
  },

  clearCart: async () => {
    const res = await fetch(`${API_BASE}/lab-tests/cart/clear/`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  // Bookings
  getLabTestBookings: async (status = null) => {
    const params = status ? `?status=${status}` : ''
    const res = await fetch(`${API_BASE}/lab-tests/bookings/${params}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  createLabTestBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE}/lab-tests/bookings/create/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    })
    return handleResponse(res)
  },

  getLabTestBookingDetail: async (bookingId) => {
    const res = await fetch(`${API_BASE}/lab-tests/bookings/${bookingId}/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  cancelLabTestBooking: async (bookingId, data) => {
    const res = await fetch(`${API_BASE}/lab-tests/bookings/${bookingId}/cancel/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(res)
  },

  rescheduleLabTestBooking: async (bookingId, data) => {
    const res = await fetch(`${API_BASE}/lab-tests/bookings/${bookingId}/reschedule/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(res)
  },

  getBookingResults: async (bookingId) => {
    const res = await fetch(`${API_BASE}/lab-tests/bookings/${bookingId}/results/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  },

  // Reviews
  createLabReview: async (reviewData) => {
    const res = await fetch(`${API_BASE}/lab-tests/reviews/create/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    })
    return handleResponse(res)
  },

  // Dashboard
  getLabTestDashboard: async () => {
    const res = await fetch(`${API_BASE}/lab-tests/dashboard/`, {
      headers: getAuthHeaders()
    })
    return handleResponse(res)
  }
}

// Also export as default for compatibility
export default api
