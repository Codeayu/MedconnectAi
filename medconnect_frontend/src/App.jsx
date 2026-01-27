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
  }, [page])

  const Protected = (Component, target, extraProps = {}) => {
    return isAuthenticated() 
      ? <Component {...extraProps} /> 
      : <Login onLogin={() => handlePostLogin()} onRegister={() => setPage("register")} />
  }

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

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    if (!isAuthenticated()) {
      return <Login onLogin={handlePostLogin} onRegister={() => setPage("register")} />
    }
    
    const role = getUserRole()
    if (role === 'DOCTOR') {
      return <DoctorDashboard onNavigate={setPage} />
    }
    return <Dashboard onService={setPage} />
  }

  return (
    <div className="app">
      <Navbar 
        onNavigate={setPage} 
        currentPage={page} 
        userRole={userRole}
        onLogout={handleLogout}
      />

      {page === "landing" && <Landing onStart={() => setPage("login")} />}

      {page === "login" && (
        <Login 
          onLogin={handlePostLogin} 
          onRegister={() => setPage("register")} 
          onDoctorRegister={() => setPage("doctor-register")}
        />
      )}

      {page === "register" && <Register onRegister={() => setPage("login")} />}

      {page === "doctor-register" && (
        <DoctorRegister 
          onSuccess={() => setPage("login")} 
          onLogin={() => setPage("login")} 
        />
      )}

      {page === "dashboard" && renderDashboard()}

      {page === "doctor-dashboard" && (
        isAuthenticated() && userRole === 'DOCTOR'
          ? <DoctorDashboard onNavigate={setPage} />
          : <Login onLogin={handlePostLogin} onRegister={() => setPage("register")} />
      )}

      {page === "checker" && Protected(SymptomChecker, "checker")}
      {page === "consult" && Protected(DoctorList, "consult", { onBack: () => setPage("dashboard") })}

      {page === "doctors" && Protected(DoctorList, "doctors", { onBack: () => setPage("dashboard") })}

      {page === "consultations" && Protected(PatientConsultations, "consultations", { onBack: () => setPage("dashboard") })}

      {page === "awareness" && Protected(HealthAwareness, "awareness", { onBack: () => setPage("dashboard") })}
      {page === "lab" && Protected(WellnessHub, "lab")}
      {page === "chatbot" && Protected(Chatbot, "chatbot", { onBack: () => setPage("dashboard") })}
      {page === "emergency" && Protected(HealthAwareness, "emergency", { onBack: () => setPage("dashboard") })}
    </div>
  )
}
