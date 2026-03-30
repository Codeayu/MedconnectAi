import { useState, useEffect, useRef } from 'react'
import McCard from './ui-next/McCard'
import McButton from './ui-next/McButton'
import Badge from './ui/Badge'
import VideoCall from './VideoCall'
import { api } from '../api'
import { API_BASE_URL } from '../config'
import { getUserName, logout } from '../auth'
import { UserDoctor, Star, Calendar, Clock, CheckCircle, Video, MessageCircle, Phone, BarChart, X, AlertCircle, FileText } from './ui/icons/Icon'

const SOUND_PRESETS = {
  soft: {
    label: 'Soft',
    type: 'sine',
    frequency: 660,
    attack: 0.04,
    duration: 0.25,
    volume: 0.08,
  },
  default: {
    label: 'Default',
    type: 'sine',
    frequency: 880,
    attack: 0.03,
    duration: 0.35,
    volume: 0.15,
  },
  urgent: {
    label: 'Urgent',
    type: 'triangle',
    frequency: 1080,
    attack: 0.02,
    duration: 0.45,
    volume: 0.2,
  },
}

const SOUND_PRESET_ORDER = ['soft', 'default', 'urgent']

export default function DoctorDashboard({ onNavigate, onLogout, initialTab }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [activeTab, setActiveTab] = useState(initialTab || 'pending')
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundPreset, setSoundPreset] = useState('default')
  const consultationsCacheRef = useRef({})
  const knownPendingIdsRef = useRef(new Set())
  const pendingInitializedRef = useRef(false)
  
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
    loadConsultations(activeTab)
  }, [activeTab])

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {
        // Ignore permission errors; in-app flow still works.
      })
    }
  }, [])

  useEffect(() => {
    if (!isOnline) {
      return undefined
    }

    const heartbeatTimer = setInterval(() => {
      api.sendDoctorHeartbeat().catch(() => {
        // Keep UI responsive even if one heartbeat fails.
      })
    }, 45000)

    return () => clearInterval(heartbeatTimer)
  }, [isOnline])

  const playAlertSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return

      const config = SOUND_PRESETS[soundPreset] || SOUND_PRESETS.default

      const ctx = new AudioCtx()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = config.type
      oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.0001, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(config.volume, ctx.currentTime + config.attack)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + config.duration)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.start()
      oscillator.stop(ctx.currentTime + config.duration)

      oscillator.onended = () => {
        if (ctx.state !== 'closed') {
          ctx.close().catch(() => {})
        }
      }
    } catch (err) {
      console.error('Failed to play alert sound:', err)
    }
  }

  const showConsultationNotification = (consultation) => {
    if (!notificationsEnabled || typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    const patientName = consultation?.patient_name || 'Patient'
    const consultationType = consultation?.consultation_type_display || 'Consultation'

    try {
      const notification = new Notification('New Consultation Request', {
        body: `${patientName} requested a ${consultationType.toLowerCase()}.`,
        tag: `consultation-${consultation.id}`,
        renotify: true,
      })

      notification.onclick = () => {
        window.focus()
        setActiveTab('pending')
      }
    } catch (err) {
      console.error('Failed to show browser notification:', err)
    }
  }

  useEffect(() => {
    if (!isOnline) {
      return undefined
    }

    let isMounted = true

    const checkPendingConsultations = async () => {
      try {
        const pending = await api.getDoctorConsultations('PENDING')
        if (!isMounted) return

        const currentIds = new Set(pending.map(c => c.id))

        if (!pendingInitializedRef.current) {
          knownPendingIdsRef.current = currentIds
          pendingInitializedRef.current = true
        } else {
          const newItems = pending.filter(c => !knownPendingIdsRef.current.has(c.id))
          if (newItems.length > 0) {
            playAlertSound()
            showConsultationNotification(newItems[0])
            loadDashboard()
          }
          knownPendingIdsRef.current = currentIds
        }

        consultationsCacheRef.current.pending = pending
        if (activeTab === 'pending') {
          setConsultations(pending)
        }
      } catch (err) {
        console.error('Failed to check pending consultations:', err)
      }
    }

    checkPendingConsultations()
    const poller = setInterval(checkPendingConsultations, 20000)

    return () => {
      isMounted = false
      clearInterval(poller)
    }
  }, [isOnline, activeTab, notificationsEnabled, soundEnabled, soundPreset])

  const cycleSoundPreset = () => {
    setSoundPreset(prev => {
      const idx = SOUND_PRESET_ORDER.indexOf(prev)
      const nextIdx = idx === -1 ? 0 : (idx + 1) % SOUND_PRESET_ORDER.length
      return SOUND_PRESET_ORDER[nextIdx]
    })
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      const token = localStorage.getItem('access')
      const role = localStorage.getItem('role')

      if (!token || role !== 'DOCTOR' || !isOnline) return

      fetch(`${API_BASE_URL}/api/doctors/online-status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_online: false }),
        keepalive: true,
      }).catch(() => {
        // Browser close request is best-effort.
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      handleBeforeUnload()
    }
  }, [isOnline])

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

  const loadConsultations = async (tab = activeTab, forceRefresh = false) => {
    if (!forceRefresh && consultationsCacheRef.current[tab]) {
      setConsultations(consultationsCacheRef.current[tab])
      return
    }

    try {
      const statusMap = {
        'pending': 'PENDING',
        'confirmed': 'CONFIRMED',
        'ongoing': 'ONGOING',
        'completed': 'COMPLETED',
        'all': null
      }
      const data = await api.getDoctorConsultations(statusMap[tab])
      consultationsCacheRef.current[tab] = data
      if (tab === activeTab) {
        setConsultations(data)
      }
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
      consultationsCacheRef.current = {}
      loadConsultations(activeTab, true)
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
      consultationsCacheRef.current = {}
      loadConsultations(activeTab, true)
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
      consultationsCacheRef.current = {}
      loadConsultations(activeTab, true)
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
    consultationsCacheRef.current = {}
    loadConsultations(activeTab, true)
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
      consultationsCacheRef.current = {}
      loadConsultations(activeTab, true)
      loadDashboard()
    } catch (err) {
      alert('Failed to complete consultation')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      if (isOnline) {
        await api.updateOnlineStatus(false)
      }
    } catch (err) {
      console.error('Failed to set offline during logout:', err)
    }

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
    const IconMap = {
      'VIDEO': Video,
      'AUDIO': Phone,
      'CHAT': MessageCircle,
      'IN_PERSON': UserDoctor
    }
    const IconComp = IconMap[type] || Video
    return <IconComp size={16} />
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
    <div className="doctor-dashboard-page" style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-primary-700) 100%)',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div className="container">
          <div className="doctor-dashboard-header-row" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div className="doctor-dashboard-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                <UserDoctor size={32} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'white' }}>
                   {profile.full_name || getUserName()}
                </h1>
                <p style={{ opacity: 0.9, color: 'white' }}>
                  {profile.specialization_display || 'Specialist'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Star size={16} color="#FFD700" /> {profile.average_rating || 0} ({profile.total_reviews || 0} reviews)</span>
                  <span>₹{profile.consultation_fee || 0}/consultation</span>
                </div>
              </div>
            </div>
            
            <div className="doctor-dashboard-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setNotificationsEnabled(prev => !prev)}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.45)',
                  background: notificationsEnabled ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.25)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                title="Toggle desktop notifications"
              >
                {notificationsEnabled ? 'Alerts On' : 'Alerts Off'}
              </button>

              <button
                onClick={() => setSoundEnabled(prev => !prev)}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.45)',
                  background: soundEnabled ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.25)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                title="Toggle alert sound"
              >
                {soundEnabled ? 'Sound On' : 'Sound Off'}
              </button>

              <button
                onClick={cycleSoundPreset}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.45)',
                  background: 'rgba(255,255,255,0.18)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                title="Change alert sound preset"
              >
                Sound: {SOUND_PRESETS[soundPreset]?.label || 'Default'}
              </button>

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
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: isOnline ? '#fff' : 'rgba(255,255,255,0.5)', display: 'inline-block' }} />
                {isOnline ? 'Online' : 'Offline'}
              </button>
              <McButton variant="outline" onClick={handleLogout} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                Logout
              </McButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 1 }}>
        <div className="doctor-dashboard-stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem' 
        }}>
          {[
            { label: 'Pending', value: stats.pending || 0, IconComp: Clock, color: '#FFB300' },
            { label: 'Confirmed', value: stats.confirmed || 0, IconComp: Calendar, color: '#2196F3' },
            { label: 'Ongoing', value: stats.ongoing || 0, IconComp: BarChart, color: 'var(--mc-primary-500)' },
            { label: 'Completed', value: stats.completed || 0, IconComp: CheckCircle, color: '#00C853' },
            { label: "Today's", value: stats.todays_appointments || 0, IconComp: Calendar, color: '#9C27B0' },
            { label: 'Total', value: stats.total || 0, IconComp: UserDoctor, color: '#00BFA5' }
          ].map((stat, i) => (
            <McCard key={i} style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                <stat.IconComp size={20} color={stat.color} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
            </McCard>
          ))}
        </div>
      </div>

      {/* Consultations Section */}
      <div className="container doctor-dashboard-content" style={{ padding: '2rem 1rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={22} /> Consultations</h2>
        
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'all', label: 'All', IconComp: FileText },
            { id: 'pending', label: 'Pending', IconComp: Clock },
            { id: 'confirmed', label: 'Confirmed', IconComp: Calendar },
            { id: 'ongoing', label: 'Ongoing', IconComp: BarChart },
            { id: 'completed', label: 'Completed', IconComp: CheckCircle }
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
                background: activeTab === tab.id ? 'var(--mc-primary-500)' : 'white',
                color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <tab.IconComp size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Consultation List */}
        {consultations.length === 0 ? (
          <McCard style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--mc-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FileText size={28} color="var(--mc-neutral-400)" />
            </div>
            <h3>No consultations found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {activeTab === 'pending' 
                ? 'No pending consultation requests at the moment.'
                : `No ${activeTab} consultations to show.`}
            </p>
          </McCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {consultations.map(consultation => (
              <McCard key={consultation.id} hover style={{ padding: '1.5rem' }}>
                <div className="doctor-consultation-row" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  {/* Patient Info */}
                  <div className="doctor-consultation-patient" style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'var(--mc-primary-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        <UserDoctor size={22} color="var(--mc-primary-500)" />
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
                  <div className="doctor-consultation-schedule" style={{ textAlign: 'right', minWidth: '150px' }}>
                    {getStatusBadge(consultation.status)}
                    <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {getTypeIcon(consultation.consultation_type)}
                        {consultation.consultation_type_display}
                      </div>
                      <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={14} /> {formatDate(consultation.scheduled_date)}
                        {consultation.scheduled_time && ` at ${formatTime(consultation.scheduled_time)}`}
                      </div>
                      <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        ID: #{consultation.id}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="doctor-consultation-actions" style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border)',
                  flexWrap: 'wrap'
                }}>
                  {consultation.status === 'PENDING' && (
                    <>
                      <McButton 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleAccept(consultation.id)}
                        disabled={actionLoading}
                        icon={CheckCircle}
                      >
                        Accept
                      </McButton>
                      <McButton 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleReject(consultation.id)}
                        disabled={actionLoading}
                        icon={X}
                      >
                        Reject
                      </McButton>
                    </>
                  )}
                  
                  {consultation.status === 'CONFIRMED' && (
                    <McButton 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleStart(consultation.id)}
                      disabled={actionLoading}
                      icon={Video}
                    >
                      Start Consultation
                    </McButton>
                  )}
                  
                  {consultation.status === 'ONGOING' && (
                    <>
                      {consultation.consultation_type === 'VIDEO' && (
                        <McButton 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleStartVideoCall(consultation)}
                          icon={Video}
                        >
                          Start Video Call
                        </McButton>
                      )}
                      <McButton 
                        variant="success" 
                        size="sm"
                        onClick={() => setSelectedConsultation(consultation)}
                        icon={CheckCircle}
                      >
                        Complete & Add Prescription
                      </McButton>
                    </>
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
          <McCard 
            className="doctor-consultation-modal-card"
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
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Patient Info */}
            <div style={{ 
              background: 'var(--gray-50)', 
              padding: '1.25rem', 
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserDoctor size={18} /> Patient Information</h4>
              <div className="doctor-consultation-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={18} color="var(--mc-primary-500)" /> Reported Symptoms</h4>
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
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BarChart size={18} color="var(--mc-primary-500)" /> AI Analysis</h4>
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
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} /> Add Prescription & Notes</h4>
                
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

                <McButton 
                  variant="primary"
                  onClick={() => handleComplete(selectedConsultation.id)}
                  disabled={actionLoading}
                  style={{ width: '100%' }}
                  icon={CheckCircle}
                >
                  {actionLoading ? 'Saving...' : 'Complete Consultation'}
                </McButton>
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
          </McCard>
        </div>
      )}
    </div>
  )
}
