import { API_BASE_URL } from "./config"

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

// Auto-refresh: retry a request once after refreshing the access token
let isRefreshing = false
let refreshPromise = null

async function refreshAccessToken() {
  if (isRefreshing) return refreshPromise
  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const refresh = localStorage.getItem("refresh")
      if (!refresh) throw new Error("No refresh token")
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh })
      })
      if (!res.ok) throw new Error("Refresh failed")
      const data = await res.json()
      localStorage.setItem("access", data.access)
      if (data.refresh) localStorage.setItem("refresh", data.refresh)
      return data.access
    } catch {
      const refresh = localStorage.getItem("refresh")

      if (refresh) {
        fetch(`${API_BASE_URL}/api/auth/logout/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh })
        }).catch(() => {
          // Best-effort server cleanup when refresh fails.
        })
      }

      // Refresh failed — clear auth
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      localStorage.removeItem("role")
      localStorage.removeItem("user_id")
      localStorage.removeItem("email")
      localStorage.removeItem("user_name")
      throw new Error("Session expired. Please log in again.")
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()
  return refreshPromise
}

// Wrapper: makes a fetch, auto-refreshes token on 401, retries once
async function authFetch(url, options = {}) {
  let response = await fetch(url, options)
  if (response.status === 401 && localStorage.getItem("refresh")) {
    try {
      const newToken = await refreshAccessToken()
      // Rebuild headers with new token
      const newHeaders = { ...options.headers }
      newHeaders["Authorization"] = `Bearer ${newToken}`
      response = await fetch(url, { ...options, headers: newHeaders })
    } catch {
      // refresh failed, return the original 401
    }
  }
  return response
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

  async logout(refreshToken) {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
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
    const response = await authFetch(`${API_BASE_URL}/api/patients/profile/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updatePatientProfile(data) {
    const response = await authFetch(`${API_BASE_URL}/api/patients/profile/`, {
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
    const response = await authFetch(`${API_BASE_URL}/api/chat/`, {
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
    const response = await authFetch(`${API_BASE_URL}/api/symptoms/predict-and-recommend/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ symptoms })
    })
    return handleResponse(response)
  },

  // Consultations
  async createConsultation(aiPrediction) {
    const response = await authFetch(`${API_BASE_URL}/api/consultations/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ai_prediction: aiPrediction })
    })
    return handleResponse(response)
  },

  async bookConsultation(data) {
    const response = await authFetch(`${API_BASE_URL}/api/consultations/book/`, {
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
    const response = await authFetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getDoctorConsultations(status = null) {
    const url = status 
      ? `${API_BASE_URL}/api/consultations/doctor/?status=${status}`
      : `${API_BASE_URL}/api/consultations/doctor/`
    const response = await authFetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getConsultationDetail(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/consultations/${consultationId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async acceptConsultation(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/consultations/${consultationId}/accept/`, {
      method: "POST",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async rejectConsultation(consultationId, reason = '') {
    const response = await authFetch(`${API_BASE_URL}/api/consultations/${consultationId}/reject/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    })
    return handleResponse(response)
  },

  async startConsultation(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/consultations/${consultationId}/start/`, {
      method: "POST",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateConsultationStatus(consultationId, data) {
    const response = await authFetch(`${API_BASE_URL}/api/consultations/${consultationId}/update-status/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async cancelConsultation(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/consultations/${consultationId}/cancel/`, {
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
    if (filters.page) params.append('page', filters.page)
    if (filters.page_size) params.append('page_size', filters.page_size)
    
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
    const response = await authFetch(`${API_BASE_URL}/api/doctors/profile/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateDoctorProfile(data) {
    const response = await authFetch(`${API_BASE_URL}/api/doctors/profile/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async getDoctorDashboard() {
    const response = await authFetch(`${API_BASE_URL}/api/doctors/dashboard/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateOnlineStatus(isOnline) {
    const response = await authFetch(`${API_BASE_URL}/api/doctors/online-status/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_online: isOnline })
    })
    return handleResponse(response)
  },

  async sendDoctorHeartbeat() {
    const response = await authFetch(`${API_BASE_URL}/api/doctors/heartbeat/`, {
      method: "POST",
      headers: getAuthHeaders()
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
    const response = await authFetch(`${API_BASE_URL}/api/doctors/${doctorId}/review/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Doctor Match (existing)
  async getDoctorMatch(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/doctors-match/match/${consultationId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // ============ Video Call / Teleconsultation ============
  
  async createVideoRoom(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/video/create-room/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ consultation_id: consultationId })
    })
    return handleResponse(response)
  },

  async getVideoToken(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/video/get-token/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ consultation_id: consultationId })
    })
    return handleResponse(response)
  },

  async endVideoCall(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/video/end-call/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ consultation_id: consultationId })
    })
    return handleResponse(response)
  },

  async leaveVideoCall(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/video/leave/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ consultation_id: consultationId })
    })
    return handleResponse(response)
  },

  async getVideoRoomStatus(consultationId) {
    const response = await authFetch(`${API_BASE_URL}/api/video/status/${consultationId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // ============ Lab Test Booking APIs ============

  // Categories
  async getLabTestCategories() {
    const response = await fetch(`${API_BASE_URL}/api/lab-tests/categories/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Labs
  async getLabs(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    const url = `${API_BASE_URL}/api/lab-tests/labs/${params ? '?' + params : ''}`
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getLabDetail(labId) {
    const response = await fetch(`${API_BASE_URL}/api/lab-tests/labs/${labId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getLabReviews(labId) {
    const response = await fetch(`${API_BASE_URL}/api/lab-tests/labs/${labId}/reviews/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Lab Tests
  async getLabTests(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    const url = `${API_BASE_URL}/api/lab-tests/tests/${params ? '?' + params : ''}`
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getLabTestDetail(testId) {
    const response = await fetch(`${API_BASE_URL}/api/lab-tests/tests/${testId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getPopularTests() {
    const response = await fetch(`${API_BASE_URL}/api/lab-tests/tests/popular/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Packages
  async getLabTestPackages(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    const url = `${API_BASE_URL}/api/lab-tests/packages/${params ? '?' + params : ''}`
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getLabTestPackageDetail(packageId) {
    const response = await fetch(`${API_BASE_URL}/api/lab-tests/packages/${packageId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getFeaturedPackages() {
    const response = await fetch(`${API_BASE_URL}/api/lab-tests/packages/featured/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Cart
  async getCart() {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/cart/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async addToCart(data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/cart/add/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async removeFromCart(data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/cart/remove/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async clearCart() {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/cart/clear/`, {
      method: "POST",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Bookings
  async getLabTestBookings(status = null) {
    const params = status ? `?status=${status}` : ''
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/bookings/${params}`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async createLabTestBooking(bookingData) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/bookings/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    })
    return handleResponse(response)
  },

  async getLabTestBookingDetail(bookingId) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/bookings/${bookingId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async cancelLabTestBooking(bookingId, data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/bookings/${bookingId}/cancel/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async rescheduleLabTestBooking(bookingId, data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/bookings/${bookingId}/reschedule/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async getBookingResults(bookingId) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/bookings/${bookingId}/results/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Lab Reviews
  async createLabReview(reviewData) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/reviews/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    })
    return handleResponse(response)
  },

  // Dashboard
  async getLabTestDashboard() {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/dashboard/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // ============ Lab Provider APIs ============

  // Lab Provider Registration
  async registerLabProvider(data) {
    const response = await fetch(`${API_BASE_URL}/api/lab-tests/provider/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Lab Provider Profile
  async getLabProviderProfile() {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/profile/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateLabProviderProfile(data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/profile/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Lab Provider - Lab Details
  async getLabProviderLabDetails() {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/lab/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateLabProviderLabDetails(data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/lab/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Lab Provider - Test Offerings
  async getLabProviderTestOfferings() {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/offerings/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async addTestOffering(data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/offerings/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async updateTestOffering(offeringId, data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/offerings/${offeringId}/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async deleteTestOffering(offeringId) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/offerings/${offeringId}/`, {
      method: "DELETE",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Lab Provider - Bookings Management
  async getLabProviderBookings(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    const url = `${API_BASE_URL}/api/lab-tests/provider/bookings/${params ? '?' + params : ''}`
    const response = await authFetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getLabProviderBookingDetail(bookingId) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/bookings/${bookingId}/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateLabProviderBookingStatus(bookingId, data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/bookings/${bookingId}/status/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async addLabProviderBookingResult(bookingId, data) {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/bookings/${bookingId}/results/add/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Lab Provider Dashboard
  async getLabProviderDashboard() {
    const response = await authFetch(`${API_BASE_URL}/api/lab-tests/provider/dashboard/`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // ============ Labs with Tests (User View) ============

  // Get all labs with their test offerings
  async getLabsWithTests(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    const url = `${API_BASE_URL}/api/lab-tests/labs-with-tests/${params ? '?' + params : ''}`
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get tests offered by a specific lab
  async getLabTestsByLab(labId, filters = {}) {
    const params = new URLSearchParams(filters).toString()
    const url = `${API_BASE_URL}/api/lab-tests/labs/${labId}/tests/${params ? '?' + params : ''}`
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

export default api
