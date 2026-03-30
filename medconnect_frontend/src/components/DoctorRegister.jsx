import { useState, useEffect } from 'react'
import McCard from './ui-next/McCard'
import McButton from './ui-next/McButton'
import Badge from './ui/Badge'
import { api } from '../api'
import { UserDoctor, CheckCircle, AlertCircle, Stethoscope, Shield } from './ui/icons/Icon'

export default function DoctorRegister({ onSuccess, onLogin, onPatientRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    specialization: 'GENERAL',
    license_number: '',
    experience_years: '',
    consultation_fee: '',
    bio: ''
  })
  
  const [specializations, setSpecializations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSpecializations()
  }, [])

  const loadSpecializations = async () => {
    try {
      const data = await api.getSpecializations()
      setSpecializations(data)
    } catch (err) {
      console.error('Failed to load specializations:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (!formData.full_name || !formData.license_number) {
      setError('Please fill in all professional details')
      return false
    }
    if (!formData.experience_years || formData.experience_years < 0) {
      setError('Please enter valid years of experience')
      return false
    }
    if (!formData.consultation_fee || formData.consultation_fee < 0) {
      setError('Please enter a valid consultation fee')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')
      
      await api.registerDoctor({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        full_name: formData.full_name,
        specialization: formData.specialization,
        license_number: formData.license_number,
        experience_years: parseInt(formData.experience_years),
        consultation_fee: parseInt(formData.consultation_fee),
        bio: formData.bio
      })

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--gray-50)',
        padding: '2rem'
      }}>
        <McCard style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--mc-semantic-success-light, #E8F5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle size={32} color="var(--mc-semantic-success, #00C853)" />
          </div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--mc-semantic-success, #00C853)' }}>Registration Successful!</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Your registration has been submitted successfully. Our admin team will review and approve your profile. 
            You'll be able to login once your account is approved.
          </p>
          <McButton variant="primary" onClick={onLogin}>
            Go to Login
          </McButton>
        </McCard>
      </div>
    )
  }

  return (
    <div className="doctor-register-page" style={{ 
      minHeight: 'calc(100vh - 80px)', 
      background: 'var(--gray-50)',
      padding: '2rem 1rem'
    }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <McCard className="doctor-register-card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Badge variant="primary" icon={<UserDoctor size={14} />}>Doctor Portal</Badge>
            <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Doctor Registration</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Join our platform as a healthcare professional
            </p>
          </div>

          {error && (
              <div style={{
              background: '#FFEBEE',
              border: '1px solid #EF5350',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#C62828',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={18} color="var(--mc-primary-500)" /> Account Information</h3>
              <div className="doctor-register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Stethoscope size={18} color="var(--mc-primary-500)" /> Professional Information</h3>
              <div className="doctor-register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="doctor-register-span-2" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Specialization *
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'white'
                    }}
                  >
                    {specializations.map(spec => (
                      <option key={spec.value} value={spec.value}>{spec.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Medical License Number *
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    placeholder="MCI-XXXXX"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    placeholder="5"
                    min="0"
                    max="60"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    placeholder="500"
                    min="0"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Bio / About You
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell patients about your expertise, qualifications, and approach to healthcare..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div style={{
              padding: '1rem',
              background: 'var(--gray-50)',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" required style={{ marginTop: '0.25rem' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  I confirm that I am a licensed medical professional and the information provided is accurate. 
                  I agree to the Terms of Service and Privacy Policy.
                </span>
              </label>
            </div>

            {/* Submit */}
            <McButton 
              type="submit" 
              variant="primary" 
              disabled={loading}
              style={{ width: '100%' }}
              icon={Stethoscope}
            >
              {loading ? 'Registering...' : 'Register as Doctor'}
            </McButton>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <button 
                onClick={onLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--mc-primary-500)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Login here
              </button>
            </p>
            {onPatientRegister && (
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                Not a doctor?{' '}
                <button 
                  onClick={onPatientRegister}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--mc-primary-500)',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Register as Patient
                </button>
              </p>
            )}
          </div>
        </McCard>
      </div>
    </div>
  )
}
