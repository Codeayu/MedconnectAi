import { useState } from 'react'
import McCard from './ui-next/McCard'
import McButton from './ui-next/McButton'
import McInput from './ui-next/McInput'
import Badge from './ui/Badge'
import { api } from '../api'
import { TestTube, CheckCircle, AlertCircle, Building, Shield, MapPin, Clock } from './ui/icons/Icon'

export default function LabProviderRegister({ onSuccess, onLogin, onPatientRegister }) {
  const [step, setStep] = useState(1) // 1: Account, 2: Lab Info, 3: Certifications
  const [formData, setFormData] = useState({
    // Account credentials
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Provider details
    full_name: '',
    designation: '',
    contact_phone: '',
    alternate_phone: '',
    
    // Lab details
    lab_name: '',
    lab_address: '',
    lab_city: '',
    lab_state: '',
    lab_pincode: '',
    lab_phone: '',
    lab_email: '',
    lab_description: '',
    lab_website: '',
    
    // Certifications
    is_nabl_certified: false,
    is_cap_certified: false,
    certifications: '',
    license_number: '',
    gst_number: '',
    
    // Operating hours
    opening_time: '08:00',
    closing_time: '20:00',
    working_days: 'Mon,Tue,Wed,Thu,Fri,Sat',
    
    // Home collection
    offers_home_collection: true,
    home_collection_fee: '0'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const validateStep1 = () => {
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
    if (!formData.full_name || !formData.contact_phone) {
      setError('Please fill in your name and contact phone')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.lab_name || !formData.lab_address || !formData.lab_city) {
      setError('Please fill in lab name, address, and city')
      return false
    }
    if (!formData.lab_state || !formData.lab_pincode || !formData.lab_phone) {
      setError('Please fill in state, pincode, and lab phone')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.license_number) {
      setError('License number is required')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep3()) return

    try {
      setLoading(true)
      setError('')
      
      await api.registerLabProvider({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        full_name: formData.full_name,
        designation: formData.designation,
        contact_phone: formData.contact_phone,
        alternate_phone: formData.alternate_phone,
        lab_name: formData.lab_name,
        lab_address: formData.lab_address,
        lab_city: formData.lab_city,
        lab_state: formData.lab_state,
        lab_pincode: formData.lab_pincode,
        lab_phone: formData.lab_phone,
        lab_email: formData.lab_email,
        lab_description: formData.lab_description,
        lab_website: formData.lab_website,
        is_nabl_certified: formData.is_nabl_certified,
        is_cap_certified: formData.is_cap_certified,
        certifications: formData.certifications,
        license_number: formData.license_number,
        gst_number: formData.gst_number,
        opening_time: formData.opening_time,
        closing_time: formData.closing_time,
        working_days: formData.working_days,
        offers_home_collection: formData.offers_home_collection,
        home_collection_fee: parseFloat(formData.home_collection_fee) || 0
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
            Your lab service provider registration has been submitted successfully. Our admin team will review and approve your profile. 
            You'll be able to login once your account is approved.
          </p>
          <McButton variant="primary" onClick={onLogin}>
            Go to Login
          </McButton>
        </McCard>
      </div>
    )
  }

  const renderStepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
      {[1, 2, 3].map(s => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: step >= s ? 'var(--mc-primary)' : 'var(--gray-200)',
            color: step >= s ? 'white' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            {s}
          </div>
          <span style={{ 
            color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: step === s ? 600 : 400,
            fontSize: '0.9rem'
          }}>
            {s === 1 ? 'Account' : s === 2 ? 'Lab Info' : 'Certifications'}
          </span>
          {s < 3 && <div style={{ width: 30, height: 2, background: step > s ? 'var(--mc-primary)' : 'var(--gray-200)' }} />}
        </div>
      ))}
    </div>
  )

  return (
    <div className="lab-provider-register-page" style={{ 
      minHeight: 'calc(100vh - 80px)', 
      background: 'var(--gray-50)',
      padding: '2rem 1rem'
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <McCard className="lab-provider-register-card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Badge variant="accent" icon={<TestTube size={14} />}>Lab Provider Portal</Badge>
            <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Lab Service Provider Registration</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Register your diagnostic lab on our platform
            </p>
          </div>

          {renderStepIndicator()}

          {error && (
            <div style={{
              background: '#FFEBEE',
              border: '1px solid #EF5350',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#C62828'
            }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ 
                  background: 'var(--mc-primary-50)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Shield size={24} color="var(--mc-primary)" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Account Credentials</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Create your login credentials
                    </p>
                  </div>
                </div>

                <div className="lab-provider-register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <McInput
                    label="Email Address *"
                    type="email"
                    name="email"
                    placeholder="lab@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <McInput
                    label="Phone Number *"
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lab-provider-register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <McInput
                    label="Password *"
                    type="password"
                    name="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <McInput
                    label="Confirm Password *"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ 
                  background: 'var(--mc-accent-50)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '1rem'
                }}>
                  <Building size={24} color="var(--mc-accent)" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Provider Details</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Your personal/contact information
                    </p>
                  </div>
                </div>

                <div className="lab-provider-register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <McInput
                    label="Full Name *"
                    type="text"
                    name="full_name"
                    placeholder="Your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                  <McInput
                    label="Designation"
                    type="text"
                    name="designation"
                    placeholder="e.g., Owner, Manager"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <McInput
                    label="Contact Phone *"
                    type="tel"
                    name="contact_phone"
                    placeholder="Primary contact"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    required
                  />
                  <McInput
                    label="Alternate Phone"
                    type="tel"
                    name="alternate_phone"
                    placeholder="Alternate number"
                    value={formData.alternate_phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Lab Information */}
            {step === 2 && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ 
                  background: 'var(--mc-primary-50)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Building size={24} color="var(--mc-primary)" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Lab Details</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Information about your diagnostic laboratory
                    </p>
                  </div>
                </div>

                <McInput
                  label="Lab Name *"
                  type="text"
                  name="lab_name"
                  placeholder="Your lab/diagnostic center name"
                  value={formData.lab_name}
                  onChange={handleChange}
                  required
                />

                <McInput
                  label="Address *"
                  type="text"
                  name="lab_address"
                  placeholder="Complete address"
                  value={formData.lab_address}
                  onChange={handleChange}
                  required
                />

                <div className="lab-provider-register-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <McInput
                    label="City *"
                    type="text"
                    name="lab_city"
                    placeholder="City"
                    value={formData.lab_city}
                    onChange={handleChange}
                    required
                  />
                  <McInput
                    label="State *"
                    type="text"
                    name="lab_state"
                    placeholder="State"
                    value={formData.lab_state}
                    onChange={handleChange}
                    required
                  />
                  <McInput
                    label="Pincode *"
                    type="text"
                    name="lab_pincode"
                    placeholder="Pincode"
                    value={formData.lab_pincode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lab-provider-register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <McInput
                    label="Lab Phone *"
                    type="tel"
                    name="lab_phone"
                    placeholder="Lab contact number"
                    value={formData.lab_phone}
                    onChange={handleChange}
                    required
                  />
                  <McInput
                    label="Lab Email"
                    type="email"
                    name="lab_email"
                    placeholder="Lab email"
                    value={formData.lab_email}
                    onChange={handleChange}
                  />
                </div>

                <McInput
                  label="Description"
                  type="text"
                  name="lab_description"
                  placeholder="Brief description of your lab"
                  value={formData.lab_description}
                  onChange={handleChange}
                />

                <McInput
                  label="Website"
                  type="url"
                  name="lab_website"
                  placeholder="https://yourlab.com"
                  value={formData.lab_website}
                  onChange={handleChange}
                />

                <div style={{ 
                  background: 'var(--mc-accent-50)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '1rem'
                }}>
                  <Clock size={24} color="var(--mc-accent)" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Operating Hours</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      When is your lab open?
                    </p>
                  </div>
                </div>

                <div className="lab-provider-register-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <McInput
                    label="Opening Time"
                    type="time"
                    name="opening_time"
                    value={formData.opening_time}
                    onChange={handleChange}
                  />
                  <McInput
                    label="Closing Time"
                    type="time"
                    name="closing_time"
                    value={formData.closing_time}
                    onChange={handleChange}
                  />
                  <McInput
                    label="Working Days"
                    type="text"
                    name="working_days"
                    placeholder="Mon,Tue,Wed..."
                    value={formData.working_days}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Certifications */}
            {step === 3 && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ 
                  background: 'var(--mc-primary-50)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Shield size={24} color="var(--mc-primary)" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Certifications & License</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Your lab's certifications and business details
                    </p>
                  </div>
                </div>

                <div className="lab-provider-register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <McInput
                    label="License Number *"
                    type="text"
                    name="license_number"
                    placeholder="Lab license number"
                    value={formData.license_number}
                    onChange={handleChange}
                    required
                  />
                  <McInput
                    label="GST Number"
                    type="text"
                    name="gst_number"
                    placeholder="GST registration number"
                    value={formData.gst_number}
                    onChange={handleChange}
                  />
                </div>

                <div className="lab-provider-register-check-row" style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="is_nabl_certified"
                      checked={formData.is_nabl_certified}
                      onChange={handleChange}
                      style={{ width: 18, height: 18 }}
                    />
                    <span>NABL Certified</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="is_cap_certified"
                      checked={formData.is_cap_certified}
                      onChange={handleChange}
                      style={{ width: 18, height: 18 }}
                    />
                    <span>CAP Certified</span>
                  </label>
                </div>

                <McInput
                  label="Other Certifications"
                  type="text"
                  name="certifications"
                  placeholder="List any other certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                />

                <div style={{ 
                  background: 'var(--mc-accent-50)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '1rem'
                }}>
                  <MapPin size={24} color="var(--mc-accent)" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Home Collection</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Do you offer home sample collection?
                    </p>
                  </div>
                </div>

                <div className="lab-provider-register-home-row" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="offers_home_collection"
                      checked={formData.offers_home_collection}
                      onChange={handleChange}
                      style={{ width: 18, height: 18 }}
                    />
                    <span>Offer Home Collection</span>
                  </label>
                  
                  {formData.offers_home_collection && (
                    <div style={{ flex: 1, maxWidth: 200 }}>
                      <McInput
                        label="Home Collection Fee (₹)"
                        type="number"
                        name="home_collection_fee"
                        placeholder="0"
                        value={formData.home_collection_fee}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="lab-provider-register-nav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
              {step > 1 ? (
                <McButton type="button" variant="outline" onClick={handleBack}>
                  Back
                </McButton>
              ) : (
                <div />
              )}
              
              {step < 3 ? (
                <McButton type="button" variant="primary" onClick={handleNext}>
                  Next Step
                </McButton>
              ) : (
                <McButton type="submit" variant="primary" loading={loading}>
                  Submit Registration
                </McButton>
              )}
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Already have an account?{' '}
              <button
                onClick={onLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--mc-primary)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Login here
              </button>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Want to register as a patient?{' '}
              <button
                onClick={onPatientRegister}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--mc-accent)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Patient Registration
              </button>
            </p>
          </div>
        </McCard>
      </div>
    </div>
  )
}
