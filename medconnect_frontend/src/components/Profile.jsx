import { useState, useEffect } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Badge from './ui/Badge'
import { api } from '../api'
import { getUserName, getEmail, getUserRole } from '../auth'

export default function Profile({ onNavigate }) {
  const [profile, setProfile] = useState({
    full_name: '',
    age: '',
    gender: 'MALE'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const userEmail = getEmail()
  const userRole = getUserRole()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const data = await api.getPatientProfile()
      setProfile({
        full_name: data.full_name || '',
        age: data.age || '',
        gender: data.gender || 'MALE'
      })
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile() {
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      await api.updatePatientProfile({
        full_name: profile.full_name,
        age: parseInt(profile.age) || null,
        gender: profile.gender
      })
      
      // Update localStorage with new name
      localStorage.setItem('user_name', profile.full_name)
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  function updateField(field, value) {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!profile.full_name) return '?'
    return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gray-50)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'var(--gray-50)',
      padding: '2rem 0'
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('dashboard')}
            style={{ marginBottom: '1rem' }}
          >
            Back to Dashboard
          </Button>
          <h1 style={{ marginBottom: '0.5rem' }}>My Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your personal information
          </p>
        </div>

        {/* Profile Card */}
        <Card style={{ marginBottom: '1.5rem' }}>
          {/* Profile Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1.5rem',
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, #f8fafb 0%, #fff 100%)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0, 102, 204, 0.3)'
            }}>
              {getInitials()}
            </div>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>
                {profile.full_name || 'Your Name'}
              </h2>
              <p style={{ 
                color: 'var(--text-muted)', 
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                {userEmail}
              </p>
              <Badge variant="primary">
                {userRole === 'PATIENT' ? 'Patient' : userRole === 'DOCTOR' ? 'Doctor' : 'User'}
              </Badge>
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: '1.5rem' }}>
            {message.text && (
              <div style={{
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                background: message.type === 'success' ? '#E8F5E9' : '#FFEBEE',
                color: message.type === 'success' ? '#2E7D32' : '#C62828',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>{message.type === 'success' ? 'Success!' : 'Error:'}</span>
                {message.text}
              </div>
            )}

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  Full Name
                </label>
                <Input
                  value={profile.full_name}
                  onChange={e => updateField('full_name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  Age
                </label>
                <Input
                  type="number"
                  value={profile.age}
                  onChange={e => updateField('age', e.target.value)}
                  placeholder="Your age"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={e => updateField('gender', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    fontSize: '1rem',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <Button 
              variant="primary"
              onClick={saveProfile}
              disabled={saving}
              style={{ 
                width: '100%',
                background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>

        {/* Account Info */}
        <Card>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Account Information</h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 0',
              borderBottom: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Email Address</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{userEmail}</div>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 0',
              borderBottom: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Account Type</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Free Plan</div>
              </div>
              <Button variant="outline" size="sm">Upgrade</Button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 0'
            }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Password</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last changed 30 days ago</div>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
