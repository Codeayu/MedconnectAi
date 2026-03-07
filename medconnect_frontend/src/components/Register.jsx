import { useState } from "react"
import McButton from './ui-next/McButton'
import McInput from './ui-next/McInput'
import McCard from './ui-next/McCard'
import Badge from './ui/Badge'
import { api } from '../api'
import { Stethoscope, CheckCircle, Shield, Heart, ArrowRight, AlertCircle } from './ui/icons/Icon'

export default function Register({ onRegister, onDoctorRegister }) {
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
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
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
            background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            boxShadow: '0 25px 60px rgba(124, 58, 237, 0.4)',
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
            Join MedConnect AI
          </h1>
          
          <p style={{
            fontSize: '1.15rem',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.8,
            marginBottom: '2.5rem'
          }}>
            Create your free account and get access to AI-powered healthcare services, 
            verified doctor consultations, and personalized health insights.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
            {[
              { icon: CheckCircle, text: 'Free AI Symptom Analysis' },
              { icon: CheckCircle, text: 'Verified Doctor Network' },
              { icon: CheckCircle, text: 'Secure & Private' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '1.05rem',
                fontWeight: 500
              }}>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}><item.icon size={16} color="#10B981" /></span>
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
        background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
        padding: '3.5rem'
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {/* Step Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: step >= s 
                    ? 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' 
                    : '#E5E7EB',
                  color: step >= s ? 'white' : '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: step >= s ? '0 8px 20px rgba(37, 99, 235, 0.35)' : 'none'
                }}>
                  {step > s ? <CheckCircle size={18} /> : s}
                </div>
                <span style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: step >= s ? '#111827' : '#9CA3AF'
                }}>
                  {s === 1 ? 'Account' : 'Profile'}
                </span>
                {s < 2 && (
                  <div style={{
                    width: '50px',
                    height: '3px',
                    background: step > 1 
                      ? 'linear-gradient(90deg, #2563EB, #7C3AED)' 
                      : '#E5E7EB',
                    marginLeft: '0.75rem',
                    borderRadius: '3px',
                    transition: 'all 0.3s ease'
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

          <McCard style={{ padding: '2rem' }}>
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
                <McInput
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                />

                <McInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                />

                <McInput
                  label="Password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={e => updateField('password', e.target.value)}
                />

                <McInput
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={e => updateField('confirmPassword', e.target.value)}
                />

                <McButton
                  variant="primary"
                  onClick={goToStep2}
                  style={{ 
                    width: '100%',
                    padding: '16px',
                    marginTop: '0.5rem',
                    background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-secondary-500) 100%)'
                  }}
                >
                  Continue
                </McButton>
              </>
            ) : (
              <>
                <McInput
                  label="Full Name"
                  type="text"
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
                  <McButton
                    variant="outline"
                    onClick={() => setStep(1)}
                    style={{ flex: 1, padding: '16px' }}
                  >
                    Back
                  </McButton>
                  <McButton
                    variant="primary"
                    onClick={register}
                    loading={loading}
                    style={{ flex: 2, padding: '16px', background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-secondary-500) 100%)' }}
                  >
                    <ArrowRight size={18} /> Create Account
                  </McButton>
                </div>
              </>
            )}
          </McCard>

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
          {onDoctorRegister && (
            <p style={{
              textAlign: 'center',
              marginTop: '0.75rem',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              Are you a doctor?{' '}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); onDoctorRegister() }}
                style={{ 
                  color: 'var(--mc-primary-500, #2563EB)',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Register as Doctor
              </a>
            </p>
          )}
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
