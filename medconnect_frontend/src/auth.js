import { API_BASE_URL } from "./config"

export function isAuthenticated() {
  return !!localStorage.getItem("access")
}

export function getUserRole() {
  return localStorage.getItem("role")
}

export function getUserId() {
  return localStorage.getItem("user_id")
}

export function getEmail() {
  return localStorage.getItem("email")
}

export function getUserName() {
  return localStorage.getItem("user_name") || localStorage.getItem("email")?.split('@')[0] || 'User'
}

export function getToken() {
  return localStorage.getItem("access")
}

export function logout() {
  const refresh = localStorage.getItem("refresh")

  if (refresh) {
    fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh })
    }).catch(() => {
      // Best-effort logout; local cleanup still happens below.
    })
  }

  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  localStorage.removeItem("role")
  localStorage.removeItem("user_id")
  localStorage.removeItem("email")
  localStorage.removeItem("user_name")
}
