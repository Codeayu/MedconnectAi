import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Landing from "./components/Landing"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import SymptomChecker from "./SymptomChecker"
import WellnessHub from "./WellnessHub"
import Chatbot from "./components/Chatbot"
import HealthAwareness from "./components/HealthAwareness"
import DoctorDashboard from "./components/DoctorDashboard"
import DoctorList from "./components/DoctorList"
import DoctorRegister from "./components/DoctorRegister"
import PatientConsultations from "./components/PatientConsultations"
import ConsultationHistory from "./components/ConsultationHistory"
import Profile from "./components/Profile"
import DesignShowcase from "./components/DesignShowcase"
import ErrorBoundary from "./components/ErrorBoundary"
import McPageTransition from "./components/ui-next/McPageTransition"
import { isAuthenticated, getUserRole, logout } from "./auth"
import "./App.css"

export default function App() {
  const [page, setPage] = useState("landing")
  const [userRole, setUserRole] = useState(null)

  // Update user role whenever page changes or on auth state change
  useEffect(() => {
    if (isAuthenticated()) {
      setUserRole(getUserRole())
    } else {
      setUserRole(null)
    }
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  // Handle post-login redirect based on user role
  const handlePostLogin = () => {
    const role = getUserRole()
    setUserRole(role)
    if (role === 'DOCTOR') {
      setPage("doctor-dashboard")
    } else {
      setPage("dashboard")
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    setUserRole(null)
    setPage("landing")
  }

  // Helper: get the correct dashboard page name for current role
  const getDashboardPage = () => {
    return userRole === 'DOCTOR' ? 'doctor-dashboard' : 'dashboard'
  }

  // Shared login props — always include both registration links
  const loginProps = {
    onLogin: handlePostLogin,
    onRegister: () => setPage("register"),
    onDoctorRegister: () => setPage("doctor-register")
  }

  // Protected route wrapper — redirects to login if not authenticated
  const Protected = (Component, extraProps = {}) => {
    if (!isAuthenticated()) {
      return <Login {...loginProps} />
    }
    return (
      <ErrorBoundary onReset={() => setPage(getDashboardPage())}>
        <Component {...extraProps} />
      </ErrorBoundary>
    )
  }

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    if (!isAuthenticated()) {
      return <Login {...loginProps} />
    }
    const role = getUserRole()
    if (role === 'DOCTOR') {
      return (
        <ErrorBoundary onReset={() => setPage("landing")}>
          <DoctorDashboard onNavigate={setPage} onLogout={handleLogout} />
        </ErrorBoundary>
      )
    }
    return (
      <ErrorBoundary onReset={() => setPage("landing")}>
        <Dashboard onService={setPage} />
      </ErrorBoundary>
    )
  }

  // Page content renderer — a single function for clarity
  const renderPage = () => {
    switch (page) {
      case "landing":
        return <Landing onStart={() => setPage("login")} />

      case "login":
        return <Login {...loginProps} />

      case "register":
        return (
          <Register
            onRegister={() => setPage("login")}
            onDoctorRegister={() => setPage("doctor-register")}
          />
        )

      case "doctor-register":
        return (
          <DoctorRegister
            onSuccess={() => setPage("login")}
            onLogin={() => setPage("login")}
            onPatientRegister={() => setPage("register")}
          />
        )

      case "dashboard":
        return renderDashboard()

      case "doctor-dashboard":
        return isAuthenticated() && userRole === 'DOCTOR'
          ? <ErrorBoundary onReset={() => setPage("landing")}><DoctorDashboard onNavigate={setPage} onLogout={handleLogout} /></ErrorBoundary>
          : <Login {...loginProps} />

      case "doctor-consultations":
        return isAuthenticated() && userRole === 'DOCTOR'
          ? <ErrorBoundary onReset={() => setPage("doctor-dashboard")}><DoctorDashboard onNavigate={setPage} onLogout={handleLogout} initialTab="pending" /></ErrorBoundary>
          : <Login {...loginProps} />

      case "checker":
        return Protected(SymptomChecker, { onBack: () => setPage(getDashboardPage()), onNavigate: setPage })

      case "consult":
      case "doctors":
        return Protected(DoctorList, { onBack: () => setPage(getDashboardPage()) })

      case "consultations":
        return Protected(PatientConsultations, { onBack: () => setPage(getDashboardPage()) })

      case "consultation-history":
        return Protected(ConsultationHistory, { onBack: () => setPage(getDashboardPage()) })

      case "awareness":
        return Protected(HealthAwareness, { onBack: () => setPage(getDashboardPage()) })

      case "lab":
        return Protected(WellnessHub, { onBack: () => setPage(getDashboardPage()), onNavigate: setPage })

      case "chatbot":
        return Protected(Chatbot, { onBack: () => setPage(getDashboardPage()) })

      case "emergency":
        return Protected(HealthAwareness, { onBack: () => setPage(getDashboardPage()) })

      case "profile":
        return Protected(Profile, { onNavigate: setPage, onBack: () => setPage(getDashboardPage()) })

      case "showcase":
        return <DesignShowcase />

      default:
        return <Landing onStart={() => setPage("login")} />
    }
  }

  return (
    <div className="app">
      <Navbar
        onNavigate={setPage}
        currentPage={page}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <McPageTransition pageKey={page}>
        {renderPage()}
      </McPageTransition>
    </div>
  )
}
