import { useState } from "react"
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'
import Badge from './ui/Badge'

const EMOJI = {
  hospital: String.fromCodePoint(0x1F3E5),
  lock: String.fromCodePoint(0x1F512),
  email: String.fromCodePoint(0x2709, 0xFE0F),
  key: String.fromCodePoint(0x1F511),
  sparkles: String.fromCodePoint(0x2728),
  wave: String.fromCodePoint(0x1F44B),
  rocket: String.fromCodePoint(0x1F680)
}

export default function Login({ onLogin, onRegister, onDoctorRegister }) {
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
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
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
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 102, 204, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(0, 191, 165, 0.25) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '450px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            boxShadow: '0 20px 50px rgba(0, 102, 204, 0.4)'
          }}>
            {EMOJI.hospital}
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'white',
            marginBottom: '1rem',
            fontFamily: 'Poppins, sans-serif'
          }}>
            MedConnect AI
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.8,
            marginBottom: '2rem'
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
            <Badge variant="glass" icon={EMOJI.sparkles}>AI Powered</Badge>
            <Badge variant="glass" icon={EMOJI.lock}>Secure</Badge>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f8fafb 0%, white 100%)',
        padding: '3rem'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ 
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              fontFamily: 'Poppins, sans-serif',
              color: 'var(--text-primary)'
            }}>
              Welcome back! {EMOJI.wave}
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              Sign in to continue to your dashboard
            </p>
          </div>

          <Card style={{ padding: '2rem' }}>
            {error && (
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                color: '#DC2626',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid rgba(220, 38, 38, 0.2)'
              }}>
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              icon={EMOJI.email}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <Input
              label="Password"
              type="password"
              icon={EMOJI.key}
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
                    accentColor: '#0066CC',
                    cursor: 'pointer'
                  }} 
                />
                Remember me
              </label>
              <a 
                href="#" 
                style={{
                  color: '#0066CC',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Forgot password?
              </a>
            </div>

            <Button
              variant="gradient"
              onClick={login}
              loading={loading}
              style={{ 
                width: '100%',
                marginBottom: '1.5rem',
                padding: '16px'
              }}
            >
              {EMOJI.rocket} Sign In
            </Button>

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

            <Button
              variant="outline"
              onClick={onRegister}
              style={{ 
                width: '100%',
                padding: '14px'
              }}
            >
              Create New Account
            </Button>

            {onDoctorRegister && (
              <Button
                variant="secondary"
                onClick={onDoctorRegister}
                style={{ 
                  width: '100%',
                  padding: '14px',
                  marginTop: '0.75rem'
                }}
              >
                👨‍⚕️ Register as Doctor
              </Button>
            )}
          </Card>

          <p style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            By signing in, you agree to our{' '}
            <a href="#" style={{ color: '#0066CC' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: '#0066CC' }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}
