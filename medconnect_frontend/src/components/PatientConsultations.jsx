import { useState, useEffect } from 'react'
import McCard from './ui-next/McCard'
import McButton from './ui-next/McButton'
import Badge from './ui/Badge'
import VideoCall from './VideoCall'
import { api } from '../api'
import { Calendar, Clock, UserDoctor, Video, MessageCircle, Phone, CheckCircle, BarChart, FileText, X, AlertCircle, Stethoscope } from './ui/icons/Icon'

const STATUS_COLORS = {
  PENDING: { bg: '#FFF3E0', color: '#E65100', label: 'Pending' },
  CONFIRMED: { bg: '#E3F2FD', color: '#1565C0', label: 'Confirmed' },
  ONGOING: { bg: '#E8F5E9', color: '#2E7D32', label: 'In Progress' },
  COMPLETED: { bg: '#F3E5F5', color: '#7B1FA2', label: 'Completed' },
  CANCELLED: { bg: '#FFEBEE', color: '#C62828', label: 'Cancelled' },
  REJECTED: { bg: '#FFEBEE', color: '#C62828', label: 'Rejected' }
}

const TYPE_MAP = {
  VIDEO: Video,
  AUDIO: Phone,
  CHAT: MessageCircle,
  IN_PERSON: Stethoscope
}

export default function PatientConsultations({ onBack }) {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  
  // Video call state
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [videoConsultation, setVideoConsultation] = useState(null)

  useEffect(() => {
    loadConsultations()
  }, [activeTab])

  const loadConsultations = async () => {
    try {
      setLoading(true)
      const statusMap = {
        'pending': 'PENDING',
        'confirmed': 'CONFIRMED',
        'ongoing': 'ONGOING',
        'completed': 'COMPLETED',
        'all': null
      }
      const data = await api.getPatientConsultations(statusMap[activeTab])
      setConsultations(data)
    } catch (err) {
      setError('Failed to load consultations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (consultationId) => {
    if (!confirm('Are you sure you want to cancel this consultation?')) return
    
    try {
      await api.cancelConsultation(consultationId)
      loadConsultations()
    } catch (err) {
      alert('Failed to cancel consultation')
    }
  }

  const handleJoinVideoCall = (consultation) => {
    setVideoConsultation(consultation)
    setShowVideoCall(true)
  }

  const handleEndVideoCall = () => {
    setShowVideoCall(false)
    setVideoConsultation(null)
    loadConsultations()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not scheduled'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const tabs = [
    { id: 'all', label: 'All', IconComp: FileText },
    { id: 'pending', label: 'Pending', IconComp: Clock },
    { id: 'confirmed', label: 'Confirmed', IconComp: CheckCircle },
    { id: 'ongoing', label: 'Ongoing', IconComp: BarChart },
    { id: 'completed', label: 'Completed', IconComp: CheckCircle }
  ]

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-secondary-500) 100%)',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div className="container">
          {onBack && (
            <McButton 
              variant="outline" 
              onClick={onBack}
              style={{ marginBottom: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              ← Back to Dashboard
            </McButton>
          )}
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={24} /> My Consultations
          </h1>
          <p style={{ opacity: 0.9, color: 'white' }}>
            View and manage your doctor appointments
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--mc-primary-500)' : 'white',
                color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <tab.IconComp size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--mc-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Clock size={24} color="var(--mc-neutral-400)" />
            </div>
            <p>Loading consultations...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <McCard style={{ padding: '2rem', textAlign: 'center', background: '#FFEBEE' }}>
            <p style={{ color: '#C62828' }}>{error}</p>
            <McButton onClick={loadConsultations}>Retry</McButton>
          </McCard>
        )}

        {/* No consultations */}
        {!loading && !error && consultations.length === 0 && (
          <McCard style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--mc-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FileText size={28} color="var(--mc-neutral-400)" />
            </div>
            <h3>No consultations found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {activeTab === 'all' 
                ? "You haven't booked any consultations yet."
                : `No ${activeTab} consultations.`
              }
            </p>
            {onBack && (
              <McButton variant="primary" onClick={onBack} style={{ marginTop: '1rem' }}>
                Book a Consultation
              </McButton>
            )}
          </McCard>
        )}

        {/* Consultations List */}
        {!loading && !error && consultations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {consultations.map(consultation => {
              const statusInfo = STATUS_COLORS[consultation.status] || STATUS_COLORS.PENDING
              
              return (
                <McCard key={consultation.id} style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserDoctor size={18} /> {consultation.doctor_name || 'Unassigned'}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {consultation.doctor_specialization || 'General'}
                      </p>
                    </div>
                    <Badge style={{ background: statusInfo.bg, color: statusInfo.color }}>
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '1rem',
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'var(--gray-50)',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Date</span>
                      <p style={{ fontWeight: 600, margin: '0.25rem 0 0' }}>
                        <Calendar size={14} /> {formatDate(consultation.scheduled_date)}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Time</span>
                      <p style={{ fontWeight: 600, margin: '0.25rem 0 0' }}>
                        <Clock size={14} /> {consultation.scheduled_time || 'TBD'}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Type</span>
                      <p style={{ fontWeight: 600, margin: '0.25rem 0 0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {(() => { const IC = TYPE_MAP[consultation.consultation_type] || FileText; return <IC size={14} />; })()} {consultation.consultation_type_display || consultation.consultation_type}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fee</span>
                      <p style={{ fontWeight: 600, margin: '0.25rem 0 0' }}>
                        ₹{consultation.fee || 0}
                      </p>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {consultation.symptoms && (
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Symptoms</span>
                      <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>
                        {consultation.symptoms}
                      </p>
                    </div>
                  )}

                  {/* Prescription (for completed) */}
                  {consultation.status === 'COMPLETED' && consultation.prescription && (
                    <div style={{ 
                      padding: '1rem', 
                      background: '#E8F5E9', 
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} /> Prescription</h4>
                      {consultation.diagnosis && (
                        <p><strong>Diagnosis:</strong> {consultation.diagnosis}</p>
                      )}
                      <p style={{ whiteSpace: 'pre-wrap' }}>{consultation.prescription}</p>
                      {consultation.notes && (
                        <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                          Note: {consultation.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Join Video Call for ONGOING video consultations */}
                    {consultation.status === 'ONGOING' && consultation.consultation_type === 'VIDEO' && (
                      <McButton 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleJoinVideoCall(consultation)}
                        icon={Video}
                      >
                        Join Video Call
                      </McButton>
                    )}

                    {/* Cancel for pending/confirmed */}
                    {['PENDING', 'CONFIRMED'].includes(consultation.status) && (
                      <McButton 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleCancel(consultation.id)}
                        icon={X}
                      >
                        Cancel
                      </McButton>
                    )}

                    <McButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedConsultation(consultation)}
                    >
                      View Details
                    </McButton>
                  </div>
                </McCard>
              )
            })}
          </div>
        )}
      </div>

      {/* Video Call */}
      {showVideoCall && videoConsultation && (
        <VideoCall
          consultationId={videoConsultation.id}
          consultation={videoConsultation}
          onEnd={handleEndVideoCall}
          isDoctor={false}
        />
      )}

      {/* Detail Modal */}
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
          <McCard 
            style={{ 
              maxWidth: '600px', 
              width: '100%', 
              maxHeight: '90vh', 
              overflow: 'auto',
              padding: '2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Consultation Details</h2>
              <button 
                onClick={() => setSelectedConsultation(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Doctor</label>
                  <p style={{ fontWeight: 600 }}>{selectedConsultation.doctor_name}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Specialization</label>
                  <p>{selectedConsultation.doctor_specialization}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Date</label>
                  <p>{formatDate(selectedConsultation.scheduled_date)}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Time</label>
                  <p>{selectedConsultation.scheduled_time || 'TBD'}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Type</label>
                  <p>{selectedConsultation.consultation_type_display}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</label>
                  <Badge style={{ 
                    background: STATUS_COLORS[selectedConsultation.status]?.bg,
                    color: STATUS_COLORS[selectedConsultation.status]?.color
                  }}>
                    {STATUS_COLORS[selectedConsultation.status]?.label}
                  </Badge>
                </div>
              </div>

              {selectedConsultation.symptoms && (
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Symptoms</label>
                  <p>{selectedConsultation.symptoms}</p>
                </div>
              )}

              {selectedConsultation.ai_prediction && (
                <div style={{ background: '#E3F2FD', padding: '1rem', borderRadius: '8px' }}>
                  <label style={{ color: '#1565C0', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BarChart size={14} /> AI Prediction</label>
                  <p>{selectedConsultation.ai_prediction}</p>
                </div>
              )}

              {selectedConsultation.diagnosis && (
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Diagnosis</label>
                  <p>{selectedConsultation.diagnosis}</p>
                </div>
              )}

              {selectedConsultation.prescription && (
                <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '8px' }}>
                  <label style={{ color: '#2E7D32', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={14} /> Prescription</label>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedConsultation.prescription}</p>
                </div>
              )}

              {selectedConsultation.notes && (
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Doctor's Notes</label>
                  <p style={{ fontStyle: 'italic' }}>{selectedConsultation.notes}</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              {selectedConsultation.status === 'ONGOING' && selectedConsultation.consultation_type === 'VIDEO' && (
                <McButton 
                  variant="primary"
                  onClick={() => {
                    setSelectedConsultation(null)
                    handleJoinVideoCall(selectedConsultation)
                  }}
                  icon={Video}
                >
                  Join Video Call
                </McButton>
              )}
              <McButton variant="outline" onClick={() => setSelectedConsultation(null)}>
                Close
              </McButton>
            </div>
          </McCard>
        </div>
      )}
    </div>
  )
}
