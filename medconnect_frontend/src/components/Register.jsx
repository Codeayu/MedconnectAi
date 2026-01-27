import { useState } from "react"
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { api } from '../api'

const EMOJI = {
  hospital: String.fromCodePoint(0x1F3E5),
  user: String.fromCodePoint(0x1F464),
  email: String.fromCodePoint(0x2709, 0xFE0F),
  key: String.fromCodePoint(0x1F511),
  phone: String.fromCodePoint(0x1F4DE),
  sparkles: String.fromCodePoint(0x2728),
  rocket: String.fromCodePoint(0x1F680),
  check: String.fromCodePoint(0x2705),
  shield: String.fromCodePoint(0x1F6E1, 0xFE0F),
  heart: String.fromCodePoint(0x2764, 0xFE0F)
}

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    age: "",
    gender: "MALE"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function validateStep1() {
    if (!formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    setError("")
    return true
  }

  function goToStep2() {
    if (validateStep1()) {
      setStep(2)
    }
  }

  async function register() {
    if (!formData.full_name) {
      setError("Please enter your full name")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      await api.register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        full_name: formData.full_name,
        age: parseInt(formData.age) || null,
        gender: formData.gender
      })
      
      onRegister()
    } catch (err) {
      setError(err.message || "Registration failed. Email may already exist.")
    } finally {
      setLoading(false)
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
          background: 'radial-gradient(circle, rgba(0, 191, 165, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(0, 102, 204, 0.25) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '450px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, #00BFA5 0%, #0066CC 100%)',
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            boxShadow: '0 20px 50px rgba(0, 191, 165, 0.4)'
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
            Join MedConnect AI
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.8,
            marginBottom: '2rem'
          }}>
            Create your free account and get access to AI-powered healthcare services, 
            verified doctor consultations, and personalized health insights.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {[
              { icon: EMOJI.check, text: 'Free AI Symptom Analysis' },
              { icon: EMOJI.check, text: 'Verified Doctor Network' },
              { icon: EMOJI.check, text: 'Secure & Private' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1rem'
              }}>
                <span>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f8fafb 0%, white 100%)',
        padding: '3rem'
      }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          {/* Step Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step >= s 
                    ? 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)' 
                    : 'var(--gray-200)',
                  color: step >= s ? 'white' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: step >= s ? '0 4px 15px rgba(0, 102, 204, 0.3)' : 'none'
                }}>
                  {step > s ? EMOJI.check : s}
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)'
                }}>
                  {s === 1 ? 'Account' : 'Profile'}
                </span>
                {s < 2 && (
                  <div style={{
                    width: '40px',
                    height: '2px',
                    background: step > 1 
                      ? 'linear-gradient(90deg, #0066CC, #00BFA5)' 
                      : 'var(--gray-200)',
                    marginLeft: '0.5rem',
                    borderRadius: '2px'
                  }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              fontFamily: 'Poppins, sans-serif',
              color: 'var(--text-primary)'
            }}>
              {step === 1 ? 'Create Your Account' : 'Complete Your Profile'}
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)',
              fontSize: '0.95rem'
            }}>
              {step === 1 
                ? 'Enter your credentials to get started' 
                : 'Tell us a bit about yourself'
              }
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
                border: '1px solid rgba(220, 38, 38, 0.2)'
              }}>
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  icon={EMOJI.email}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  icon={EMOJI.phone}
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                />

                <Input
                  label="Password"
                  type="password"
                  icon={EMOJI.key}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={e => updateField('password', e.target.value)}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  icon={EMOJI.key}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={e => updateField('confirmPassword', e.target.value)}
                />

                <Button
                  variant="gradient"
                  onClick={goToStep2}
                  style={{ 
                    width: '100%',
                    padding: '16px',
                    marginTop: '0.5rem'
                  }}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  icon={EMOJI.user}
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={e => updateField('full_name', e.target.value)}
                />

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.6rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}>
                      Age
                    </label>
                    <input
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={e => updateField('age', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        fontSize: '1rem',
                        background: '#f8fafb',
                        border: '2px solid transparent',
                        borderRadius: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.6rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}>
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={e => updateField('gender', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        fontSize: '1rem',
                        background: '#f8fafb',
                        border: '2px solid transparent',
                        borderRadius: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '0.5rem'
                }}>
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    style={{ flex: 1, padding: '16px' }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={register}
                    loading={loading}
                    style={{ flex: 2, padding: '16px' }}
                  >
                    {EMOJI.rocket} Create Account
                  </Button>
                </div>
              </>
            )}
          </Card>

          <p style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            Already have an account?{' '}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onRegister() }}
              style={{ 
                color: '#0066CC',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Sign In
            </a>
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
