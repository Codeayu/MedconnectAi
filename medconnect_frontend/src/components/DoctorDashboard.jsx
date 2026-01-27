import { useState, useEffect } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import VideoCall from './VideoCall'
import { api } from '../api'
import { getUserName, logout } from '../auth'

const EMOJI = {
  doctor: '👨‍⚕️',
  patient: '👤',
  calendar: '📅',
  clock: '🕐',
  check: '✅',
  pending: '⏳',
  ongoing: '🔄',
  cancel: '❌',
  video: '📹',
  chat: '💬',
  phone: '📞',
  star: '⭐',
  money: '💰',
  online: '🟢',
  offline: '🔴'
}

export default function DoctorDashboard({ onLogout }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  
  // Video call state
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [videoConsultation, setVideoConsultation] = useState(null)

  // Prescription form state
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    prescription: '',
    notes: ''
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    loadConsultations()
  }, [activeTab])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const data = await api.getDoctorDashboard()
      setDashboardData(data)
      setIsOnline(data.profile?.is_online || false)
    } catch (err) {
      setError('Failed to load dashboard')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadConsultations = async () => {
    try {
      const statusMap = {
        'pending': 'PENDING',
        'confirmed': 'CONFIRMED',
        'ongoing': 'ONGOING',
        'completed': 'COMPLETED',
        'all': null
      }
      const data = await api.getDoctorConsultations(statusMap[activeTab])
      setConsultations(data)
    } catch (err) {
      console.error('Failed to load consultations:', err)
    }
  }

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline
      await api.updateOnlineStatus(newStatus)
      setIsOnline(newStatus)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleAccept = async (consultationId) => {
    try {
      setActionLoading(true)
      await api.acceptConsultation(consultationId)
      loadConsultations()
      loadDashboard()
    } catch (err) {
      alert('Failed to accept consultation')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (consultationId) => {
    const reason = prompt('Please provide a reason for rejection (optional):')
    try {
      setActionLoading(true)
      await api.rejectConsultation(consultationId, reason || '')
      loadConsultations()
      loadDashboard()
    } catch (err) {
      alert('Failed to reject consultation')
    } finally {
      setActionLoading(false)
    }
  }

  const handleStart = async (consultationId) => {
    try {
      setActionLoading(true)
      await api.startConsultation(consultationId)
      loadConsultations()
      loadDashboard()
    } catch (err) {
      alert('Failed to start consultation')
    } finally {
      setActionLoading(false)
    }
  }

  // Start video call
  const handleStartVideoCall = (consultation) => {
    setVideoConsultation(consultation)
    setShowVideoCall(true)
  }

  // End video call
  const handleEndVideoCall = (duration) => {
    setShowVideoCall(false)
    setVideoConsultation(null)
    loadConsultations()
    loadDashboard()
  }

  const handleComplete = async (consultationId) => {
    try {
      setActionLoading(true)
      await api.updateConsultationStatus(consultationId, {
        status: 'COMPLETED',
        ...prescriptionForm
      })
      setSelectedConsultation(null)
      setPrescriptionForm({ diagnosis: '', prescription: '', notes: '' })
      loadConsultations()
      loadDashboard()
    } catch (err) {
      alert('Failed to complete consultation')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    onLogout()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not scheduled'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return ''
    return timeStr.substring(0, 5)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { variant: 'warning', text: 'Pending' },
      'CONFIRMED': { variant: 'info', text: 'Confirmed' },
      'ONGOING': { variant: 'primary', text: 'Ongoing' },
      'COMPLETED': { variant: 'success', text: 'Completed' },
      'CANCELLED': { variant: 'error', text: 'Cancelled' },
      'REJECTED': { variant: 'error', text: 'Rejected' }
    }
    const config = statusConfig[status] || { variant: 'secondary', text: status }
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'VIDEO': EMOJI.video,
      'AUDIO': EMOJI.phone,
      'CHAT': EMOJI.chat,
      'IN_PERSON': EMOJI.doctor
    }
    return icons[type] || EMOJI.video
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 80px)',
        background: 'var(--gray-50)'
      }}>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const { profile, stats } = dashboardData || { profile: {}, stats: {} }

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                {EMOJI.doctor}
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'white' }}>
                  Dr. {profile.full_name || getUserName()}
                </h1>
                <p style={{ opacity: 0.9, color: 'white' }}>
                  {profile.specialization_display || 'Specialist'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span>{EMOJI.star} {profile.average_rating || 0} ({profile.total_reviews || 0} reviews)</span>
                  <span>{EMOJI.money} ₹{profile.consultation_fee || 0}/consultation</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={toggleOnlineStatus}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: isOnline ? '#00C853' : '#666',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                {isOnline ? EMOJI.online : EMOJI.offline}
                {isOnline ? 'Online' : 'Offline'}
              </button>
              <Button variant="outline" onClick={handleLogout} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem' 
        }}>
          {[
            { label: 'Pending', value: stats.pending || 0, icon: EMOJI.pending, color: '#FFB300' },
            { label: 'Confirmed', value: stats.confirmed || 0, icon: EMOJI.calendar, color: '#2196F3' },
            { label: 'Ongoing', value: stats.ongoing || 0, icon: EMOJI.ongoing, color: '#0066CC' },
            { label: 'Completed', value: stats.completed || 0, icon: EMOJI.check, color: '#00C853' },
            { label: "Today's", value: stats.todays_appointments || 0, icon: EMOJI.clock, color: '#9C27B0' },
            { label: 'Total', value: stats.total || 0, icon: EMOJI.doctor, color: '#00BFA5' }
          ].map((stat, i) => (
            <Card key={i} style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Consultations Section */}
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>📋 Consultations</h2>
        
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'pending', label: 'Pending', icon: EMOJI.pending },
            { id: 'confirmed', label: 'Confirmed', icon: EMOJI.calendar },
            { id: 'ongoing', label: 'Ongoing', icon: EMOJI.ongoing },
            { id: 'completed', label: 'Completed', icon: EMOJI.check },
            { id: 'all', label: 'All', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                border: activeTab === tab.id ? 'none' : '1px solid var(--border)',
                background: activeTab === tab.id ? 'var(--primary)' : 'white',
                color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Consultation List */}
        {consultations.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3>No consultations found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {activeTab === 'pending' 
                ? 'No pending consultation requests at the moment.'
                : `No ${activeTab} consultations to show.`}
            </p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {consultations.map(consultation => (
              <Card key={consultation.id} hover style={{ padding: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  {/* Patient Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        {EMOJI.patient}
                      </div>
                      <div>
                        <h4 style={{ marginBottom: '0.125rem' }}>{consultation.patient_name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {consultation.patient_age ? `${consultation.patient_age} yrs` : ''} 
                          {consultation.patient_gender ? ` • ${consultation.patient_gender}` : ''}
                        </span>
                      </div>
                    </div>
                    
                    {consultation.symptoms && (
                      <div style={{ 
                        background: 'var(--gray-50)', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        marginBottom: '0.75rem'
                      }}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Symptoms:</strong>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{consultation.symptoms}</p>
                      </div>
                    )}
                  </div>

                  {/* Schedule & Status */}
                  <div style={{ textAlign: 'right', minWidth: '150px' }}>
                    {getStatusBadge(consultation.status)}
                    <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {getTypeIcon(consultation.consultation_type)}
                        {consultation.consultation_type_display}
                      </div>
                      <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                        {EMOJI.calendar} {formatDate(consultation.scheduled_date)}
                        {consultation.scheduled_time && ` at ${formatTime(consultation.scheduled_time)}`}
                      </div>
                      <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        ID: #{consultation.id}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border)',
                  flexWrap: 'wrap'
                }}>
                  {consultation.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleAccept(consultation.id)}
                        disabled={actionLoading}
                      >
                        ✓ Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(consultation.id)}
                        disabled={actionLoading}
                        style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                      >
                        ✗ Reject
                      </Button>
                    </>
                  )}
                  
                  {consultation.status === 'CONFIRMED' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleStart(consultation.id)}
                      disabled={actionLoading}
                    >
                      {EMOJI.video} Start Consultation
                    </Button>
                  )}
                  
                  {consultation.status === 'ONGOING' && (
                    <>
                      {consultation.consultation_type === 'VIDEO' && (
                        <Button 
                          variant="gradient" 
                          size="sm"
                          onClick={() => handleStartVideoCall(consultation)}
                        >
                          {EMOJI.video} Start Video Call
                        </Button>
                      )}
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setSelectedConsultation(consultation)}
                      >
                        {EMOJI.check} Complete & Add Prescription
                      </Button>
                    </>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedConsultation(consultation)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Video Call Modal */}
      {showVideoCall && videoConsultation && (
        <VideoCall
          consultationId={videoConsultation.id}
          consultation={videoConsultation}
          onEnd={handleEndVideoCall}
          isDoctor={true}
        />
      )}

      {/* Consultation Detail Modal */}
      {selectedConsultation && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setSelectedConsultation(null)}
        >
          <Card 
            style={{ 
              width: '100%', 
              maxWidth: '600px', 
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2>Consultation #{selectedConsultation.id}</h2>
              <button 
                onClick={() => setSelectedConsultation(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Patient Info */}
            <div style={{ 
              background: 'var(--gray-50)', 
              padding: '1.25rem', 
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ marginBottom: '0.75rem' }}>{EMOJI.patient} Patient Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Name</span>
                  <p style={{ fontWeight: '500' }}>{selectedConsultation.patient_name}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contact</span>
                  <p style={{ fontWeight: '500' }}>{selectedConsultation.patient_email}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age</span>
                  <p style={{ fontWeight: '500' }}>{selectedConsultation.patient_age || 'N/A'} years</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gender</span>
                  <p style={{ fontWeight: '500' }}>{selectedConsultation.patient_gender || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            {selectedConsultation.symptoms && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>🩺 Reported Symptoms</h4>
                <p style={{ 
                  background: 'var(--gray-50)', 
                  padding: '1rem', 
                  borderRadius: '8px' 
                }}>
                  {selectedConsultation.symptoms}
                </p>
              </div>
            )}

            {/* AI Prediction */}
            {selectedConsultation.ai_prediction && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>🤖 AI Analysis</h4>
                <div style={{ 
                  background: '#E3F2FD', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #90CAF9'
                }}>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '0.85rem',
                    margin: 0 
                  }}>
                    {typeof selectedConsultation.ai_prediction === 'object' 
                      ? JSON.stringify(selectedConsultation.ai_prediction, null, 2)
                      : selectedConsultation.ai_prediction}
                  </pre>
                </div>
              </div>
            )}

            {/* Prescription Form (for ONGOING consultations) */}
            {selectedConsultation.status === 'ONGOING' && (
              <div style={{ 
                borderTop: '1px solid var(--border)', 
                paddingTop: '1.5rem',
                marginTop: '1rem'
              }}>
                <h4 style={{ marginBottom: '1rem' }}>📝 Add Prescription & Notes</h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Diagnosis
                  </label>
                  <textarea
                    value={prescriptionForm.diagnosis}
                    onChange={e => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                    placeholder="Enter diagnosis..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Prescription
                  </label>
                  <textarea
                    value={prescriptionForm.prescription}
                    onChange={e => setPrescriptionForm({...prescriptionForm, prescription: e.target.value})}
                    placeholder="Enter prescription details..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Additional Notes
                  </label>
                  <textarea
                    value={prescriptionForm.notes}
                    onChange={e => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                    placeholder="Any additional notes..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      minHeight: '60px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <Button 
                  variant="primary"
                  onClick={() => handleComplete(selectedConsultation.id)}
                  disabled={actionLoading}
                  style={{ width: '100%' }}
                >
                  {actionLoading ? 'Saving...' : '✓ Complete Consultation'}
                </Button>
              </div>
            )}

            {/* Existing Prescription (for completed) */}
            {selectedConsultation.status === 'COMPLETED' && (
              <div style={{ 
                borderTop: '1px solid var(--border)', 
                paddingTop: '1.5rem',
                marginTop: '1rem'
              }}>
                {selectedConsultation.diagnosis && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Diagnosis</h4>
                    <p style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '8px' }}>
                      {selectedConsultation.diagnosis}
                    </p>
                  </div>
                )}
                {selectedConsultation.prescription && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Prescription</h4>
                    <p style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
                      {selectedConsultation.prescription}
                    </p>
                  </div>
                )}
                {selectedConsultation.notes && (
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Notes</h4>
                    <p style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '8px' }}>
                      {selectedConsultation.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
