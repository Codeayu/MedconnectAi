import { useState, useEffect } from "react"
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { api } from '../api'

export default function ConsultationHistory({ onBack }) {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchConsultations()
  }, [])

  async function fetchConsultations() {
    try {
      const data = await api.getPatientConsultations()
      setConsultations(data)
    } catch (err) {
      setError("Failed to load consultations")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    REQUESTED: 'warning',
    ASSIGNED: 'primary',
    ONGOING: 'info',
    COMPLETED: 'success',
    CANCELLED: 'error'
  }

  const statusIcons = {
    REQUESTED: '🔔',
    ASSIGNED: '👨‍⚕️',
    ONGOING: '🏥',
    COMPLETED: '✅',
    CANCELLED: '❌'
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{ 
      background: 'var(--gray-50)', 
      minHeight: 'calc(100vh - 80px)', 
      padding: '3rem 0' 
    }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {onBack && (
          <Button 
            variant="outline" 
            onClick={onBack}
            style={{ marginBottom: '2rem' }}
          >
            ← Back to Dashboard
          </Button>
        )}

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            margin: '0 auto 1.5rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 4px 20px rgba(0, 102, 204, 0.25)'
          }}>
            📋
          </div>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>
            My Consultations
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Track your medical consultations and appointments
          </p>
        </div>
        
        {loading ? (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Loading consultations...
            </p>
          </Card>
        ) : error ? (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--error)' }}>
              {error}
            </h3>
            <Button 
              variant="primary" 
              onClick={fetchConsultations}
              style={{ marginTop: '1rem' }}
            >
              Retry
            </Button>
          </Card>
        ) : consultations.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏥</div>
            <h3 style={{ marginBottom: '1rem' }}>No Consultations Yet</h3>
            <p style={{ 
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              maxWidth: '500px',
              margin: '0 auto 2rem'
            }}>
              Start your health journey by checking your symptoms with our AI-powered tool
            </p>
            <Button 
              variant="primary"
              onClick={onBack}
            >
              🤖 Check Symptoms Now
            </Button>
          </Card>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
              <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <div style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 700,
                  color: 'var(--primary)'
                }}>
                  {consultations.length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Total Consultations
                </div>
              </Card>
              
              <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                <div style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 700,
                  color: 'var(--warning)'
                }}>
                  {consultations.filter(c => c.status === 'REQUESTED' || c.status === 'ASSIGNED').length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Pending
                </div>
              </Card>
              
              <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <div style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 700,
                  color: 'var(--success)'
                }}>
                  {consultations.filter(c => c.status === 'COMPLETED').length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Completed
                </div>
              </Card>
            </div>

            {/* Consultations List */}
            <div className="grid" style={{ gap: '1.25rem' }}>
              {consultations.map((consultation, index) => (
                <Card 
                  key={consultation.id} 
                  hover
                  className="fade-in"
                  style={{ 
                    padding: '1.75rem',
                    animationDelay: `${index * 0.1}s`,
                    border: `2px solid ${
                      consultation.status === 'COMPLETED' ? 'var(--success)' :
                      consultation.status === 'ONGOING' ? 'var(--primary)' :
                      'var(--border)'
                    }`
                  }}
                >
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        <h3 style={{ fontSize: '1.4rem', margin: 0 }}>
                          Consultation #{consultation.id}
                        </h3>
                        <Badge variant={statusColors[consultation.status]}>
                          {statusIcons[consultation.status]} {consultation.status}
                        </Badge>
                      </div>
                      <p style={{ 
                        margin: 0,
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem'
                      }}>
                        📅 {formatDate(consultation.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* AI Prediction */}
                  {consultation.ai_prediction && (
                    <div style={{
                      background: 'linear-gradient(135deg, #E6F2FF 0%, #F0F9FF 100%)',
                      padding: '1.25rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '1px solid var(--primary-light)'
                    }}>
                      <h4 style={{ 
                        fontSize: '1rem',
                        marginBottom: '0.75rem',
                        color: 'var(--primary)'
                      }}>
                        🤖 AI Analysis
                      </h4>
                      <div style={{ 
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        {consultation.ai_prediction.top_diseases?.map((disease, i) => (
                          <Badge key={i} variant="primary">
                            {disease}
                            {consultation.ai_prediction.confidence?.[i] && 
                              ` (${Math.round(consultation.ai_prediction.confidence[i] * 100)}%)`
                            }
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Doctor Info */}
                  {consultation.doctor ? (
                    <div style={{
                      background: 'var(--success)10',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '1px solid var(--success)'
                    }}>
                      <strong style={{ color: 'var(--success)' }}>
                        👨‍⚕️ Assigned Doctor:
                      </strong> Dr. {consultation.doctor}
                    </div>
                  ) : (
                    <div style={{
                      background: 'var(--warning)10',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '1px solid var(--warning)'
                    }}>
                      <strong style={{ color: 'var(--warning)' }}>
                        ⏳ Awaiting Doctor Assignment
                      </strong>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ 
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border)'
                  }}>
                    <Button variant="outline" size="sm">
                      📄 View Details
                    </Button>
                    {consultation.status === 'ASSIGNED' && (
                      <Button variant="primary" size="sm">
                        💬 Start Consultation
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
