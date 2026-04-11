import { useState } from "react"
import McButton from './ui-next/McButton'
import McInput from './ui-next/McInput'
import McCard from './ui-next/McCard'
import Badge from './ui/Badge'
import { Stethoscope, Shield, Sparkles, AlertCircle, ArrowRight, UserDoctor, Building } from './ui/icons/Icon'

export default function Login({ onLogin, onRegister, onDoctorRegister, onLabProviderRegister }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function login() {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://104.208.88.185:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (data.access) {
        localStorage.setItem("access", data.access)
        localStorage.setItem("refresh", data.refresh)
        localStorage.setItem("role", data.role)
        localStorage.setItem("user_id", data.user_id)
        localStorage.setItem("email", data.email)
        localStorage.setItem("user_name", data.full_name || data.email?.split('@')[0] || 'User')
        onLogin()
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #030712 0%, #111827 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '30%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '480px' }}>
          <div style={{
            width: '110px',
            height: '110px',
            margin: '0 auto 2.5rem',
            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            boxShadow: '0 25px 60px rgba(37, 99, 235, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Stethoscope size={52} color="white" style={{ position: 'relative', zIndex: 1 }} />
          </div>
          
          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            color: 'white',
            marginBottom: '1.25rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.02em'
          }}>
            MedConnect AI
          </h1>
          
          <p style={{
            fontSize: '1.15rem',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.8,
            marginBottom: '2.5rem'
          }}>
            Your trusted AI-powered healthcare companion. Get instant symptom analysis, 
            connect with verified doctors, and take control of your health journey.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Badge variant="glass" style={{
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              padding: '10px 20px',
              display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}><Sparkles size={14} color="#93C5FD" /> AI Powered</Badge>
            <Badge variant="glass" style={{
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              padding: '10px 20px',
              display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}><Shield size={14} color="#C4B5FD" /> Secure</Badge>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
        padding: '3.5rem'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ marginBottom: '2.75rem' }}>
            <h2 style={{ 
              fontSize: '2.25rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: '#111827',
              letterSpacing: '-0.02em'
            }}>
              Welcome back!
            </h2>
            <p style={{ 
              color: '#6B7280',
              fontSize: '1.05rem'
            }}>
              Sign in to continue to your dashboard
            </p>
          </div>

          <McCard style={{ 
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)'
          }}>
            {error && (
              <div style={{
                padding: '1.25rem',
                borderRadius: '14px',
                marginBottom: '1.75rem',
                background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                color: '#DC2626',
                fontSize: '0.925rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid rgba(239, 68, 68, 0.15)'
              }}>
                <AlertCircle size={18} color="#DC2626" /> {error}
              </div>
            )}

            <McInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <McInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                <input 
                  type="checkbox" 
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    accentColor: '#2563EB',
                    cursor: 'pointer'
                  }} 
                />
                Remember me
              </label>
              <a 
                href="#" 
                style={{
                  color: '#2563EB',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
              >
                Forgot password?
              </a>
            </div>

            <McButton
              variant="primary"
              onClick={login}
              loading={loading}
              style={{ 
                width: '100%',
                marginBottom: '1.75rem',
                padding: '18px',
                borderRadius: '14px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-secondary-500) 100%)'
              }}
            >
              <ArrowRight size={18} /> Sign In
            </McButton>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <McButton
              variant="outline"
              onClick={onRegister}
              style={{ 
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                fontWeight: 600
              }}
            >
              Create New Account
            </McButton>

            {onDoctorRegister && (
              <McButton
                variant="secondary"
                onClick={onDoctorRegister}
                style={{ 
                  width: '100%',
                  padding: '16px',
                  marginTop: '1rem',
                  borderRadius: '14px',
                  fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'
                }}
              >
                <UserDoctor size={18} /> Register as Doctor
              </McButton>
            )}

            {onLabProviderRegister && (
              <McButton
                variant="secondary"
                onClick={onLabProviderRegister}
                style={{ 
                  width: '100%',
                  padding: '16px',
                  marginTop: '0.75rem',
                  borderRadius: '14px',
                  fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
                  background: 'linear-gradient(135deg, #7C3AED10, #2563EB10)',
                  border: '1px solid #7C3AED30'
                }}
              >
                <Building size={18} /> Register as Lab Provider
              </McButton>
            )}
          </McCard>

          <p style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            fontSize: '0.9rem',
            color: '#9CA3AF'
          }}>
            By signing in, you agree to our{' '}
            <a href="#" style={{ color: '#2563EB', fontWeight: 500 }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: '#2563EB', fontWeight: 500 }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}
