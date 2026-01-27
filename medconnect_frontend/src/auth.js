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
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  localStorage.removeItem("role")
  localStorage.removeItem("user_id")
  localStorage.removeItem("email")
  localStorage.removeItem("user_name")
}
